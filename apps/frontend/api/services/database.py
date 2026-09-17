from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv, find_dotenv
import os
from datetime import datetime
from bson import ObjectId

load_dotenv(find_dotenv())

MONGODB_URI = os.getenv("MONGODB_URI")

is_connected = False
client = None

if MONGODB_URI:
    try:
        client = AsyncIOMotorClient(MONGODB_URI, serverSelectionTimeoutMS=2000)
    except Exception as e:
        print(f"[database] Failed to initialize Motor client: {e}")

# In-memory storage for offline / local demo mode
class InMemoryCursor:
    def __init__(self, items):
        self._items = list(items)

    def sort(self, key_or_list, direction=None):
        if isinstance(key_or_list, list) and len(key_or_list) > 0:
            key, dir_val = key_or_list[0]
            reverse = dir_val == -1
        elif isinstance(key_or_list, str):
            key = key_or_list
            reverse = direction == -1
        else:
            return self

        try:
            self._items.sort(key=lambda x: x.get(key, 0) or 0, reverse=reverse)
        except Exception:
            pass
        return self

    def skip(self, n):
        self._items = self._items[n:]
        return self

    def limit(self, n):
        self._items = self._items[:n]
        return self

    async def to_list(self, length=100):
        return self._items[:length]

class InMemoryCollection:
    def __init__(self, name, initial_data=None):
        self.name = name
        self.docs = list(initial_data or [])

    async def create_index(self, *args, **kwargs):
        return "index_created"

    def find(self, query=None, projection=None):
        query = query or {}
        results = []
        for d in self.docs:
            match = True
            for k, v in query.items():
                if d.get(k) != v:
                    match = False
                    break
            if match:
                results.append(dict(d))
        return InMemoryCursor(results)

    async def find_one(self, query=None, projection=None):
        query = query or {}
        for d in self.docs:
            match = True
            for k, v in query.items():
                if d.get(k) != v:
                    match = False
                    break
            if match:
                return dict(d)
        return None

    async def insert_one(self, doc):
        d = dict(doc)
        if "_id" not in d:
            d["_id"] = ObjectId()
        self.docs.insert(0, d)
        class Result:
            inserted_id = d["_id"]
        return Result()

    async def update_one(self, filter_query, update_data, upsert=False):
        matched = None
        for d in self.docs:
            match = True
            for k, v in filter_query.items():
                if d.get(k) != v:
                    match = False
                    break
            if match:
                matched = d
                break

        if matched:
            if "$set" in update_data:
                matched.update(update_data["$set"])
            if "$inc" in update_data:
                for k, v in update_data["$inc"].items():
                    matched[k] = (matched.get(k, 0) or 0) + v
            if "$addToSet" in update_data:
                for k, v in update_data["$addToSet"].items():
                    current = matched.get(k, [])
                    if isinstance(current, list) and v not in current:
                        current.append(v)
                        matched[k] = current
            if "$pull" in update_data:
                for k, v in update_data["$pull"].items():
                    current = matched.get(k, [])
                    if isinstance(current, list) and v in current:
                        current.remove(v)
                        matched[k] = current
        elif upsert:
            new_doc = dict(filter_query)
            if "$set" in update_data:
                new_doc.update(update_data["$set"])
            if "$setOnInsert" in update_data:
                new_doc.update(update_data["$setOnInsert"])
            if "_id" not in new_doc:
                new_doc["_id"] = ObjectId()
            self.docs.append(new_doc)

    async def delete_one(self, filter_query):
        for i, d in enumerate(self.docs):
            match = True
            for k, v in filter_query.items():
                if d.get(k) != v:
                    match = False
                    break
            if match:
                self.docs.pop(i)
                break

    def aggregate(self, pipeline):
        # Fallback for vector search or custom aggregates
        return InMemoryCursor(self.docs[:10])

class ResilientDatabase:
    def __init__(self):
        self._in_memory = {
            "posts": InMemoryCollection("posts", [
                {
                    "_id": ObjectId("65e0123456789abcdef01234"),
                    "user_id": "user-1",
                    "username": "@arnavryie",
                    "avatar": "https://github.com/arnavryie.png",
                    "repo_full_name": "google-deepmind/gemini-cli-agent",
                    "content": "Just shipped Project Ronin! Real-time developer feeds with Gemini 2.0 repo insights and MongoDB Atlas Vector Search.",
                    "likes": ["demo-user"],
                    "likes_count": 19,
                    "created_at": datetime.utcnow()
                },
                {
                    "_id": ObjectId("65e0123456789abcdef01235"),
                    "user_id": "user-2",
                    "username": "@tiangolo",
                    "avatar": "https://github.com/tiangolo.png",
                    "repo_full_name": "tiangolo/fastapi",
                    "content": "The Ronin developer dossier is an awesome take on developer profile cards. Love the clean GitHub dark mode aesthetic.",
                    "likes": [],
                    "likes_count": 42,
                    "created_at": datetime.utcnow()
                }
            ]),
            "bookmarks": InMemoryCollection("bookmarks"),
            "follows": InMemoryCollection("follows"),
            "communities": InMemoryCollection("communities", [
                {"_id": ObjectId("65e0123456789abcdef01240"), "slug": "ai-ml", "name": "AI & Machine Learning", "icon": "🤖", "github_topic": "machine-learning", "description": "LLMs, neural networks, AI tools and frameworks", "member_count": 12400, "color": "#58a6ff"},
                {"_id": ObjectId("65e0123456789abcdef01241"), "slug": "ui-frontend", "name": "UI & Frontend", "icon": "⚛️", "github_topic": "react", "description": "React, Vue, Svelte, CSS frameworks, design systems", "member_count": 8900, "color": "#8957e5"},
                {"_id": ObjectId("65e0123456789abcdef01242"), "slug": "devops", "name": "DevOps & Infrastructure", "icon": "⚙️", "github_topic": "kubernetes", "description": "Docker, Kubernetes, CI/CD, cloud-native tools", "member_count": 6700, "color": "#238636"},
                {"_id": ObjectId("65e0123456789abcdef01243"), "slug": "databases", "name": "Databases", "icon": "🗄️", "github_topic": "database", "description": "SQL, NoSQL, vector databases, ORMs", "member_count": 5400, "color": "#d76027"},
                {"_id": ObjectId("65e0123456789abcdef01244"), "slug": "systems", "name": "Systems & Rust", "icon": "⚡", "github_topic": "rust", "description": "Systems programming, performance engineering", "member_count": 4200, "color": "#dea584"},
                {"_id": ObjectId("65e0123456789abcdef01245"), "slug": "python", "name": "Python", "icon": "🐍", "github_topic": "python", "description": "Python libraries, frameworks, and tools", "member_count": 9800, "color": "#3572A5"}
            ]),

            "users": InMemoryCollection("users", [
                {
                    "github_username": "arnavryie",
                    "skills": ["TypeScript", "Python", "React", "Next.js", "AI", "MongoDB"],
                    "status": "Building Project Ronin ⚔️"
                }
            ]),
            "repos": InMemoryCollection("repos"),
            "ai_cache": InMemoryCollection("ai_cache")
        }

    def __getitem__(self, name):
        global is_connected, client
        if is_connected and client:
            return client["project_ronin"][name]
        if name not in self._in_memory:
            self._in_memory[name] = InMemoryCollection(name)
        return self._in_memory[name]

db = ResilientDatabase()

async def ping_db():
    global is_connected, client
    if not client:
        print("[database] Running in high-reliability In-Memory Fallback Mode (No MONGODB_URI).")
        return False
    try:
        await client.admin.command("ping")
        is_connected = True
        print("[SUCCESS] MongoDB connected!")
        return True
    except Exception as e:
        is_connected = False
        print(f"[database] MongoDB connection failed: {e}. Switching seamlessly to In-Memory Fallback Mode.")
        return False


from google import genai
import os
import json
import httpx
from datetime import datetime

# Initialize Gemini only if API key is present
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=GEMINI_API_KEY) if GEMINI_API_KEY else None

OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434/api/generate")
LOCAL_MODEL = os.getenv("LOCAL_MODEL", "qwen2.5-coder:32b")

async def query_local_llm(prompt: str, model: str = LOCAL_MODEL) -> str:
    """Fallback to local Qwen 2.5 Coder 32B (Dual-Brain mode) via Ollama."""
    try:
        async with httpx.AsyncClient(timeout=30.0) as http_client:
            resp = await http_client.post(
                OLLAMA_URL,
                json={
                    "model": model,
                    "prompt": prompt,
                    "stream": False,
                    "options": {"temperature": 0.3}
                }
            )
            if resp.status_code == 200:
                data = resp.json()
                return data.get("response", "").strip()
    except Exception as e:
        print(f"[local-llm] Local Ollama fallback error ({model}): {e}")
    return ""

async def generate_repo_summary(repo_name: str, description: str, topics: list, language: str) -> str:
    """AI summary — Gemini primary with local Qwen 32B Dual-Brain fallback"""
    prompt = f"""You are a developer analyst. In exactly 2 sentences, describe what this GitHub repository does and why developers find it valuable.

Repository: {repo_name}
Description: {description}
Language: {language}
Topics: {', '.join(topics)}

Be specific and technical. No marketing fluff."""

    if client:
        try:
            response = client.models.generate_content(model="gemini-1.5-flash", contents=prompt)
            if response and response.text:
                return response.text.strip()
        except Exception as e:
            print(f"[gemini] Repo summary error: {e}. Falling back to local Qwen 32B.")

    # Local LLM Fallback (Dual Brain)
    local_res = await query_local_llm(prompt)
    if local_res:
        return local_res

    # Clean heuristic fallback if both unavailable
    topic_str = f" built around {', '.join(topics[:3])}" if topics else ""
    return f"{repo_name} is an active open-source {language} project{topic_str}. It provides developers with {description or 'modular utilities and core building blocks'}."

async def score_issue_impact(issue_title: str, repo_name: str) -> dict:
    prompt = f"""You are a senior engineer triaging GitHub issues.
Score this issue's impact 0-100.

Repository: {repo_name}
Issue: {issue_title}

Respond in JSON only, no markdown:
{{"score": 75, "level": "High", "reason": "Impact assessment"}}"""

    if client:
        try:
            response = client.models.generate_content(model="gemini-1.5-flash", contents=prompt)
            if response and response.text:
                text = response.text.strip().replace("```json", "").replace("```", "")
                return json.loads(text)
        except Exception as e:
            print(f"[gemini] Issue score error: {e}. Falling back to local Qwen 32B.")

    # Local LLM Fallback (Dual Brain)
    local_res = await query_local_llm(prompt)
    if local_res:
        try:
            text = local_res.replace("```json", "").replace("```", "").strip()
            return json.loads(text)
        except Exception:
            pass

    # Heuristic scoring based on title keywords
    is_critical = any(kw in issue_title.lower() for kw in ["bug", "crash", "security", "fail", "broken", "memory"])
    score = 85 if is_critical else 60
    level = "High" if score >= 75 else "Med"
    return {
        "score": score,
        "level": level,
        "reason": f"Heuristic analysis: {'Core stability issue' if is_critical else 'Enhancement or standard issue'}."
    }

async def generate_developer_dossier(username: str, skills: list, top_repos: list) -> str:
    prompt = f"""You are a technical analyst writing a developer intelligence report.
Write 2 paragraphs analyzing this GitHub developer's profile.

Developer: {username}
Core Skills: {', '.join(skills)}
Top Repositories: {', '.join(top_repos[:5])}

Cover: technical specialization, architecture mastery, and what kinds of engineering problems they solve best."""

    if client:
        try:
            response = client.models.generate_content(model="gemini-1.5-flash", contents=prompt)
            if response and response.text:
                return response.text.strip()
        except Exception as e:
            print(f"[gemini] Dossier error: {e}. Falling back to local Qwen 32B.")

    # Local LLM Fallback (Dual Brain)
    local_res = await query_local_llm(prompt)
    if local_res:
        return local_res

    # Heuristic dossier
    skill_list = ", ".join(skills) if skills else "Modern full-stack technologies"
    repo_list = ", ".join(top_repos[:3]) if top_repos else "open source repositories"
    return (
        f"{username} demonstrates strong technical specialization across {skill_list}. "
        f"Their development focus centers on shipping reliable software architectures, as reflected in key projects like {repo_list}.\n\n"
        f"Consistently solves full-lifecycle engineering challenges with clean component design, active open-source collaboration, and proactive problem solving."
    )


async def get_or_generate_summary(db, repo_full_name: str, description: str, topics: list, language: str) -> str:
    """Check MongoDB cache first, only call Gemini if not cached"""
    cached = await db["ai_cache"].find_one({"repo": repo_full_name, "type": "summary"})
    if cached:
        return cached["content"]
    
    summary = await generate_repo_summary(repo_full_name, description, topics, language)
    
    # Cache the summary
    await db["ai_cache"].insert_one({
        "repo": repo_full_name,
        "type": "summary",
        "content": summary,
        "created_at": datetime.utcnow()
    })

    # Also store the embedding for vector search
    try:
        from core.embeddings import get_or_generate_repo_embedding
        await get_or_generate_repo_embedding(db, repo_full_name, summary)
    except Exception as e:
        print(f"[embeddings] Warning: {e}")

    return summary

async def get_or_score_issue(db, repo_full_name: str, issue_number: int, issue_title: str) -> dict:
    """Score an issue once with Gemini, then serve from MongoDB cache forever."""
    cache_key = f"{repo_full_name}#{issue_number}"
    cached = await db["ai_cache"].find_one({"repo": cache_key, "type": "issue_score"})
    if cached:
        return cached["content"]

    result = await score_issue_impact(issue_title, repo_full_name)

    await db["ai_cache"].insert_one({
        "repo": cache_key,
        "type": "issue_score",
        "content": result,
        "created_at": datetime.utcnow(),
    })
    return result

async def get_or_generate_dossier(db, username: str, skills: list, top_repos: list) -> str:
    """Generate a developer dossier once, then serve from MongoDB cache."""
    cached = await db["ai_cache"].find_one({"repo": username, "type": "dossier"})
    if cached:
        return cached["content"]

    dossier = await generate_developer_dossier(username, skills, top_repos)

    await db["ai_cache"].insert_one({
        "repo": username,
        "type": "dossier",
        "content": dossier,
        "created_at": datetime.utcnow(),
    })
    return dossier

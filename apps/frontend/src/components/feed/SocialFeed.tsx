"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TextareaAutosize from "react-textarea-autosize";
import { ChevronDown, Rocket, Check, MessageSquare, Repeat2, Heart, Bookmark, LogIn, UserCheck } from "lucide-react";
import { useSession, signIn } from "next-auth/react";
import { toast } from "sonner";
import { supabase } from "../../lib/supabase";


// --- Types ---
type Repo = {
  id: number;
  name: string;
  full_name: string;
  description: string;
  stargazers_count: number;
  language: string;
};

type Post = {
  id: string;
  user_id: string;
  username: string;
  content: string;
  repo_full_name: string | null;
  created_at: string;
  avatar_url?: string;
  likes?: number;
};

const INITIAL_POSTS: Post[] = [
  {
    id: "post-1",
    user_id: "user-1",
    username: "@arnavryie",
    content: "Just shipped Project Ronin for the Google Cloud Rapid Agent Hackathon! Real-time developer feeds with Gemini 2.0 repo insights and MongoDB Atlas Vector Search.",
    repo_full_name: "google-deepmind/gemini-cli-agent",
    created_at: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    avatar_url: "https://github.com/arnavryie.png",
    likes: 18,
  },
  {
    id: "post-2",
    user_id: "user-2",
    username: "@tiangolo",
    content: "The Ronin developer dossier is an awesome take on developer profile cards. Love the clean GitHub dark mode aesthetic and fast API response times.",
    repo_full_name: "tiangolo/fastapi",
    created_at: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
    avatar_url: "https://github.com/tiangolo.png",
    likes: 42,
  },
  {
    id: "post-3",
    user_id: "user-3",
    username: "@sindresorhus",
    content: "Tracking fork velocity is such an underrated signal for discovering breakout open-source projects before they reach the mainstream trending page.",
    repo_full_name: "sindresorhus/awesome",
    created_at: new Date(Date.now() - 1000 * 60 * 210).toISOString(),
    avatar_url: "https://github.com/sindresorhus.png",
    likes: 29,
  },
];

export function SocialFeed() {
  const { data: nextAuthSession } = useSession();
  const [session, setSession] = useState<any>(null);
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [content, setContent] = useState("");
  const [repoFullName, setRepoFullName] = useState("");
  const [repos, setRepos] = useState<Repo[]>([]);
  const [filteredRepos, setFilteredRepos] = useState<Repo[]>([]);
  const [showRepoDropdown, setShowRepoDropdown] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState<Repo | null>(null);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  // Sync session: prefer NextAuth session, fallback to Supabase session
  useEffect(() => {
    if (nextAuthSession?.user) {
      setSession({
        user: {
          id: nextAuthSession.user.email || "user-" + (nextAuthSession.user.name || "dev"),
          email: nextAuthSession.user.email,
          user_metadata: {
            user_name: (nextAuthSession.user as any).login || nextAuthSession.user.name || "arnavryie",
            avatar_url: nextAuthSession.user.image || `https://github.com/${(nextAuthSession.user as any).login || 'arnavryie'}.png`,
          },
        },
      });
      fetchPosts();
      return;
    }

    try {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          setSession(session);
          fetchPosts();
        }
      }).catch(() => {});

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session) {
          setSession(session);
          fetchPosts();
        }
      });

      return () => subscription.unsubscribe();
    } catch {}
  }, [nextAuthSession]);

  // Set up real-time post subscriptions if Supabase is active
  useEffect(() => {
    if (!session?.user) return;

    try {
      const channel = supabase
        .channel("realtime-posts")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "ronin_posts",
          },
          (payload) => {
            const newPost = payload.new as Post;
            setPosts((prev) => [newPost, ...prev]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch {}
  }, [session]);

  // Fetch posts from Supabase database or retain seed posts
  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("ronin_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        setPosts(data);
      }
    } catch (error) {
      console.log("Using seed posts fallback");
    }
  };

  // Fetch user's GitHub repositories
  const fetchGitHubRepos = async (token?: string) => {
    if (repos.length > 0) return;
    setLoadingRepos(true);
    try {
      const headers: Record<string, string> = {};
      if (token && !token.startsWith("demo-")) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      const res = await fetch("https://api.github.com/repositories?since=300", { headers });
      if (res.ok) {
        const data = await res.json();
        const mapped = data.slice(0, 20).map((r: any) => ({
          id: r.id,
          name: r.name,
          full_name: r.full_name,
          description: r.description || "",
          stargazers_count: 500,
          language: "TypeScript",
        }));
        setRepos(mapped);
        setFilteredRepos(mapped.slice(0, 5));
      }
    } catch (err) {
      console.error("Error fetching repos:", err);
    } finally {
      setLoadingRepos(false);
    }
  };

  // Handle repository selection search filtering
  const handleRepoSearch = (val: string) => {
    setRepoFullName(val);
    if (!val) {
      setFilteredRepos(repos.slice(0, 5));
      setSelectedRepo(null);
      return;
    }

    const filtered = repos.filter(
      (r) =>
        r.name.toLowerCase().includes(val.toLowerCase()) ||
        r.full_name.toLowerCase().includes(val.toLowerCase())
    );
    setFilteredRepos(filtered.slice(0, 5));

    const exact = repos.find((r) => r.full_name.toLowerCase() === val.toLowerCase());
    if (exact) {
      setSelectedRepo(exact);
    } else if (val.split("/").length === 2) {
      setSelectedRepo({
        id: Math.random(),
        name: val.split("/")[1],
        full_name: val,
        description: "Attached via Project Ronin",
        stargazers_count: 1420,
        language: "TypeScript",
      });
    } else {
      setSelectedRepo(null);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsPosting(true);
    const username = session?.user?.user_metadata?.user_name
      ? `@${session.user.user_metadata.user_name}`
      : "@guest_developer";

    const avatar = session?.user?.user_metadata?.avatar_url || "https://github.com/arnavryie.png";

    const newPost: Post = {
      id: "post-" + Date.now(),
      user_id: session?.user?.id || "guest",
      username,
      content: content.trim(),
      repo_full_name: selectedRepo ? selectedRepo.full_name : null,
      created_at: new Date().toISOString(),
      avatar_url: avatar,
      likes: 1,
    };

    // Immediate optimistic local update
    setPosts((prev) => [newPost, ...prev]);
    setContent("");
    setSelectedRepo(null);
    setRepoFullName("");
    setShowRepoDropdown(false);

    // Try Supabase insert if active
    try {
      if (session?.user?.id) {
        await supabase.from("ronin_posts").insert([
          {
            user_id: session.user.id,
            username: username,
            content: newPost.content,
            repo_full_name: newPost.repo_full_name,
          },
        ]);
      }
    } catch {}

    setIsPosting(false);
  };

  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
  const [feedFilter, setFeedFilter] = useState<"all" | "repos" | "thoughts">("all");

  const handleLike = async (postId: string, currentLikes: number) => {
    const isCurrentlyLiked = !!likedPosts[postId];
    const newLiked = !isCurrentlyLiked;
    const baseCount = likeCounts[postId] !== undefined ? likeCounts[postId] : currentLikes;
    const newCount = newLiked ? baseCount + 1 : Math.max(0, baseCount - 1);

    setLikedPosts(prev => ({ ...prev, [postId]: newLiked }));
    setLikeCounts(prev => ({ ...prev, [postId]: newCount }));

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api";
      const endpoint = newLiked ? "like" : "unlike";
      const userId = session?.user?.email || "anonymous";
      await fetch(`${apiUrl}/posts/${postId}/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId })
      });
    } catch {}
  };

  const handleBookmarkPost = (post: Post) => {
    const isBookmarked = likedPosts[`bm_${post.id}`];
    setLikedPosts(prev => ({ ...prev, [`bm_${post.id}`]: !isBookmarked }));
    toast(!isBookmarked ? "🔖 Post saved to bookmarks" : "Removed from bookmarks");
  };

  const filteredPosts = posts.filter(post => {
    if (feedFilter === "repos") return Boolean(post.repo_full_name);
    if (feedFilter === "thoughts") return !post.repo_full_name;
    return true;
  });

  const activeAvatar = session?.user?.user_metadata?.avatar_url || "https://github.com/arnavryie.png";

  return (
    <div className="flex flex-col gap-6">
      {/* Cinematic Input area */}
      <motion.form
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleCreatePost}
        className="bg-[#0d1117]/80 backdrop-blur-md border border-gh-border rounded-xl p-5 shadow-2xl flex flex-col gap-4 relative overflow-hidden"
      >
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

        <div className="flex gap-4 items-start">
          <img
            src={activeAvatar}
            alt="avatar"
            className="w-10 h-10 rounded-full border border-white/10 mt-1 bg-gh-surface"
          />
          <div className="flex-1">
            <TextareaAutosize
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={session ? "Share a repo, insight, or what you're building..." : "Share your thoughts with the developer community (Guest Mode)..."}
              className="w-full bg-transparent border-0 outline-none text-white placeholder-neutral-500 text-base resize-none focus:ring-0"
              minRows={2}
            />
          </div>
        </div>

        {/* Repo Selector input */}
        <div className="relative border-t border-gh-border pt-3">
          <div className="flex items-center gap-2 text-sm text-neutral-400">
            <span className="text-xs">Attach repository:</span>
            <input
              type="text"
              value={repoFullName}
              onChange={(e) => handleRepoSearch(e.target.value)}
              onFocus={() => {
                setShowRepoDropdown(true);
                fetchGitHubRepos();
              }}
              placeholder="owner/repo-name"
              className="flex-1 bg-transparent border-0 outline-none focus:ring-0 text-white placeholder-neutral-600 text-sm font-mono"
            />
          </div>

          {/* Dropdown suggestions */}
          <AnimatePresence>
            {showRepoDropdown && filteredRepos.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="absolute left-0 right-0 mt-2 bg-[#161b22] border border-gh-border rounded-lg shadow-2xl z-50 overflow-hidden divide-y divide-gh-border"
              >
                {filteredRepos.map((repo) => (
                  <div
                    key={repo.id}
                    onClick={() => {
                      setSelectedRepo(repo);
                      setRepoFullName(repo.full_name);
                      setShowRepoDropdown(false);
                    }}
                    className="px-4 py-2.5 hover:bg-neutral-800 cursor-pointer flex justify-between items-center transition-colors"
                  >
                    <div>
                      <div className="text-sm font-semibold text-white">{repo.full_name}</div>
                      {repo.description && (
                        <div className="text-xs text-neutral-400 line-clamp-1 mt-0.5">{repo.description}</div>
                      )}
                    </div>
                    {selectedRepo?.full_name === repo.full_name && (
                      <Check className="w-4 h-4 text-purple-400" />
                    )}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Repo Preview Card */}
        <AnimatePresence>
          {selectedRepo && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#161b22]/50 border border-white/10 rounded-lg p-4 flex flex-col gap-2 relative overflow-hidden group hover:border-purple-500/30 transition-colors"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 via-transparent to-transparent pointer-events-none" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-sm font-bold text-white">
                  <span>📦</span>
                  <span>{selectedRepo.full_name}</span>
                </div>
                <span className="text-xs text-neutral-500 font-mono flex items-center gap-1">
                  ★ {selectedRepo.stargazers_count}
                </span>
              </div>
              {selectedRepo.description && (
                <p className="text-xs text-neutral-400">{selectedRepo.description}</p>
              )}
              {selectedRepo.language && (
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                  <span className="text-xs text-neutral-400 font-mono">{selectedRepo.language}</span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setShowRepoDropdown(!showRepoDropdown);
                fetchGitHubRepos();
              }}
              className="text-xs text-neutral-400 hover:text-white transition-colors flex items-center gap-1"
            >
              Browse repos <ChevronDown className="w-3 h-3" />
            </button>
            {!session && (
              <button
                type="button"
                onClick={() => signIn("credentials", { username: "arnavryie", callbackUrl: "/feed" })}
                className="text-xs text-gh-blue hover:underline flex items-center gap-1"
              >
                <UserCheck className="w-3 h-3" />
                <span>Demo sign in</span>
              </button>
            )}
          </div>
          <button
            type="submit"
            disabled={isPosting || !content.trim()}
            className="bg-white text-black font-semibold text-sm px-4 py-2 rounded-md hover:bg-neutral-200 transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:hover:bg-white cursor-pointer"
          >
            <Rocket className="w-4 h-4" />
            {isPosting ? "Posting..." : "Post"}
          </button>
        </div>
      </motion.form>

      {/* Post Category Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setFeedFilter("all")}
            className={`px-3 py-1 rounded-full border transition-all cursor-pointer ${
              feedFilter === "all"
                ? "bg-white text-black border-white font-semibold"
                : "bg-[#161b22] text-gh-muted border-gh-border hover:text-white"
            }`}
          >
            All Activity
          </button>
          <button
            onClick={() => setFeedFilter("repos")}
            className={`px-3 py-1 rounded-full border transition-all cursor-pointer ${
              feedFilter === "repos"
                ? "bg-purple-600 text-white border-purple-500 font-semibold"
                : "bg-[#161b22] text-gh-muted border-gh-border hover:text-white"
            }`}
          >
            📦 Repo Drops
          </button>
          <button
            onClick={() => setFeedFilter("thoughts")}
            className={`px-3 py-1 rounded-full border transition-all cursor-pointer ${
              feedFilter === "thoughts"
                ? "bg-gh-blue text-white border-blue-500 font-semibold"
                : "bg-[#161b22] text-gh-muted border-gh-border hover:text-white"
            }`}
          >
            💬 Developer Discussions
          </button>
        </div>
        <span className="text-xs text-neutral-500 font-mono">
          {filteredPosts.length} posts
        </span>
      </div>

      {/* Cinematic Real-time Feed */}
      <div className="flex flex-col gap-4">
        <AnimatePresence initial={false}>
          {filteredPosts.map((post) => {
            const isLiked = !!likedPosts[post.id];
            const currentLikes = likeCounts[post.id] !== undefined ? likeCounts[post.id] : (post.likes || 1);
            const isBookmarked = !!likedPosts[`bm_${post.id}`];

            return (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: -30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
                className="bg-[#0d1117]/60 border border-gh-border rounded-xl p-5 hover:border-white/10 transition-all relative overflow-hidden group shadow-lg"
              >
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-purple-500/0 group-hover:bg-purple-500/40 transition-colors" />

                <div className="flex gap-4">
                  <img
                    src={post.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${post.username.replace('@', '')}`}
                    alt=""
                    className="w-10 h-10 rounded-full border border-white/10 bg-neutral-800 object-cover"
                  />

                  <div className="flex-1 flex flex-col gap-2">
                    {/* Post Header */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-white hover:underline cursor-pointer">
                        {post.username}
                      </span>
                      <span className="text-xs text-neutral-500 font-mono">
                        {new Date(post.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                      </span>
                    </div>

                    {/* Post Content */}
                    <p className="text-sm text-neutral-300 leading-relaxed break-words whitespace-pre-wrap">
                      {post.content}
                    </p>

                    {/* Linked Repository Preview */}
                    {post.repo_full_name && (
                      <a
                        href={`/repo/${post.repo_full_name}`}
                        className="bg-[#161b22]/50 border border-gh-border hover:border-purple-500/40 rounded-lg p-3.5 mt-2 flex items-center justify-between transition-all group/repo"
                      >
                        <div className="flex items-center gap-2 text-xs font-bold text-purple-300 group-hover/repo:text-purple-200">
                          <span>📦</span>
                          <span>{post.repo_full_name}</span>
                        </div>
                        <span className="text-[10px] text-neutral-400 font-mono group-hover/repo:text-white flex items-center gap-1">
                          View details →
                        </span>
                      </a>
                    )}

                    {/* Interactive Icons */}
                    <div className="flex items-center gap-6 mt-3 text-neutral-500 select-none">
                      <button className="hover:text-purple-400 transition-colors flex items-center gap-1 text-xs cursor-pointer">
                        <MessageSquare className="w-4 h-4" />
                        <span>Reply</span>
                      </button>
                      <button className="hover:text-purple-400 transition-colors flex items-center gap-1 text-xs cursor-pointer">
                        <Repeat2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleLike(post.id, post.likes || 1)}
                        className={`transition-colors flex items-center gap-1.5 text-xs cursor-pointer ${
                          isLiked ? "text-pink-500 font-semibold" : "hover:text-pink-400"
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${isLiked ? "fill-pink-500 text-pink-500" : ""}`} />
                        <span>{currentLikes}</span>
                      </button>
                      <button
                        onClick={() => handleBookmarkPost(post)}
                        className={`transition-colors cursor-pointer ${
                          isBookmarked ? "text-gh-purple font-semibold" : "hover:text-purple-400"
                        }`}
                        title="Save post"
                      >
                        <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-purple-500 text-purple-500" : ""}`} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

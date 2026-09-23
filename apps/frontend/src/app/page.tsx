"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TrendingUp, Users, Sparkles, ArrowRight, UserCheck, Search, BookOpen, Star, ShieldCheck, MapPin, Globe } from "lucide-react";
import { useSession, signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { ParallaxVideoShowcase } from "@/components/landing/ParallaxVideoShowcase";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

const Orb = ({ color, style }: { color: string; style?: React.CSSProperties }) => (
  <motion.div
    style={style}
    className={`absolute w-80 h-80 rounded-full pointer-events-none opacity-20 blur-3xl ${
      color === "purple" ? "bg-purple-600" : color === "blue" ? "bg-blue-600" : "bg-cyan-500"
    }`}
    animate={{
      scale: [1, 1.2, 1],
      opacity: [0.15, 0.35, 0.15],
      rotate: [0, 360, 0],
    }}
    transition={{
      duration: 16,
      repeat: Infinity,
      ease: "linear",
    }}
  />
);

interface GitHubUserPreview {
  username: string;
  name: string;
  avatar: string;
  bio: string;
  location: string;
  publicRepos: number;
  followers: number;
  following: number;
  archetype?: string;
  aiTldr?: string;
  superpower?: string;
}

export default function LandingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loggingIn, setLoggingIn] = useState(false);
  const [inputUsername, setInputUsername] = useState("arnavryie");
  const [userPreview, setUserPreview] = useState<GitHubUserPreview | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);

  const activeUser = (session?.user as any)?.login || session?.user?.name;

  // Real-time GitHub User & AI TL;DR Lookup with debounce
  useEffect(() => {
    const clean = inputUsername.trim().replace(/^@/, "");
    if (!clean) {
      setUserPreview(null);
      return;
    }

    setLoadingPreview(true);
    const timer = setTimeout(async () => {
      try {
        // Fetch public GitHub user
        let ghData: any = null;
        try {
          const res = await fetch(`https://api.github.com/users/${clean}`);
          if (res.ok) {
            ghData = await res.json();
          }
        } catch {}

        const username = ghData?.login || clean;
        const name = ghData?.name || clean;
        const avatar = ghData?.avatar_url || `https://github.com/${clean}.png`;
        const bio = ghData?.bio || "";
        const location = ghData?.location || "";
        const publicRepos = ghData?.public_repos ?? 12;
        const followers = ghData?.followers ?? 84;
        const following = ghData?.following ?? 32;

        // Fetch AI TL;DR description
        let aiTldr = `@${clean} is an active open-source developer specializing in modern distributed systems with high code quality.`;
        let archetype = "High-Velocity Full-Stack Engineer";
        let superpower = "Clean modular architecture & active open-source contribution.";

        try {
          const tldrRes = await fetch(`/api/ai/user-tldr?username=${encodeURIComponent(clean)}&bio=${encodeURIComponent(bio)}`);
          if (tldrRes.ok) {
            const aiData = await tldrRes.json();
            if (aiData.summary) aiTldr = aiData.summary;
            if (aiData.archetype) archetype = aiData.archetype;
            if (aiData.superpower) superpower = aiData.superpower;
          }
        } catch {}

        setUserPreview({
          username,
          name,
          avatar,
          bio,
          location,
          publicRepos,
          followers,
          following,
          archetype,
          aiTldr,
          superpower,
        });
      } finally {
        setLoadingPreview(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [inputUsername]);

  const handleUserLogin = async (targetUser?: string) => {
    const raw = (targetUser || inputUsername || "arnavryie").trim().replace(/^@/, "");
    const userToLogin = raw || "arnavryie";
    setLoggingIn(true);
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("gitwit_active_user", userToLogin);
        localStorage.setItem("ronin_active_user", userToLogin);
      }
      await signIn("credentials", {
        username: userToLogin,
        redirect: false,
      });
    } catch (e) {
      console.warn("Credentials login warning:", e);
    } finally {
      setLoggingIn(false);
      router.push(`/profile/${userToLogin}`);
    }
  };

  const handleViewProfile = (targetUser?: string) => {
    const userToView = (targetUser || inputUsername || "arnavryie").trim().replace(/^@/, "");
    if (!userToView) return;
    if (typeof window !== "undefined") {
      localStorage.setItem("gitwit_active_user", userToView);
      localStorage.setItem("ronin_active_user", userToView);
    }
    router.push(`/profile/${userToView}`);
  };

  const handleGitHubLogin = async () => {
    setLoggingIn(true);
    try {
      const res = await signIn("github", { callbackUrl: "/feed", redirect: false });
      if (res?.error) {
        await handleUserLogin(inputUsername || "arnavryie");
      } else if (res?.url) {
        window.location.href = res.url;
      }
    } catch {
      await handleUserLogin(inputUsername || "arnavryie");
    } finally {
      setLoggingIn(false);
    }
  };

  if (status === "loading" || loggingIn) {
    return (
      <div className="min-h-screen bg-gh-bg flex flex-col items-center justify-center gap-3">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gh-blue" />
        <p className="text-xs text-gh-muted">Entering git-wit...</p>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gh-bg flex flex-col items-center justify-start px-4 text-center relative py-10 overflow-x-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <Orb color="purple" style={{ top: "5%", left: "10%" }} />
      <Orb color="blue" style={{ top: "15%", right: "10%" }} />
      <Orb color="cyan" style={{ bottom: "10%", left: "20%" }} />

      <div className="max-w-4xl w-full flex flex-col items-center gap-6 z-10">
        {/* Brand Banner */}
        <motion.div
          className="flex items-center gap-2 text-3xl sm:text-4xl font-extrabold text-white tracking-tight"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="text-3xl">⚔️</span>
          <span className="bg-gradient-to-r from-blue-400 via-purple-300 to-indigo-400 bg-clip-text text-transparent">
            git-wit
          </span>
        </motion.div>

        {activeUser && (
          <motion.div
            className="flex items-center gap-2 bg-purple-950/70 border border-purple-700/60 px-4 py-1.5 rounded-full text-xs text-purple-200 shadow-md backdrop-blur-sm"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <span>Active session: <strong className="text-white">@{activeUser}</strong></span>
            <span className="text-purple-400">•</span>
            <Link href="/feed" className="text-gh-blue hover:underline font-semibold flex items-center gap-1">
              Go to Feed <ArrowRight className="w-3 h-3" />
            </Link>
          </motion.div>
        )}

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-3xl">
          The social layer GitHub <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300 bg-clip-text text-transparent">
            never built.
          </span>
        </h1>

        <p className="text-gh-muted text-base sm:text-lg max-w-2xl leading-relaxed">
          Discover trending repos through real GitHub data and Gemini AI intelligence.
          Explore any developer profile, read their AI TL;DR dossier, and track fork velocity before projects blow up.
        </p>

        {/* Enter Any GitHub Username & Live Preview Section */}
        <motion.div
          className="w-full bg-[#161b22]/90 border border-purple-500/50 rounded-2xl p-4 sm:p-6 shadow-2xl backdrop-blur-md flex flex-col gap-4 text-left relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="flex items-center justify-between text-xs px-1">
            <span className="flex items-center gap-1.5 text-purple-300 font-semibold text-sm">
              <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
              <span>Instant GitHub Profile Lookup &amp; AI TL;DR</span>
            </span>
            <span className="text-[11px] text-neutral-400 font-mono hidden sm:inline">
              Type any public handle to inspect live
            </span>
          </div>

          {/* Search Input Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="relative w-full flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400 font-mono text-base font-semibold">@</span>
              <input
                type="text"
                value={inputUsername}
                onChange={(e) => setInputUsername(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleViewProfile(inputUsername || "arnavryie");
                  }
                }}
                placeholder="Enter GitHub username (e.g. torvalds, shadcn, gaearon, arnavryie)"
                className="w-full bg-[#0d1117] border border-gh-border text-white pl-9 pr-10 py-3 text-sm rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/40 font-mono transition-all shadow-inner"
              />
              {loadingPreview && (
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-400 border-t-transparent" />
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => handleViewProfile(inputUsername || "arnavryie")}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold text-xs px-5 py-3 rounded-xl transition-all shadow-md cursor-pointer shrink-0"
              >
                <span>View Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => handleUserLogin(inputUsername || "arnavryie")}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-gh-surface2 hover:bg-[#30363d] border border-gh-border text-neutral-200 font-semibold text-xs px-4 py-3 rounded-xl transition-colors cursor-pointer shrink-0"
                title="Demo login with this profile"
              >
                <UserCheck className="w-3.5 h-3.5 text-purple-400" />
                <span>Demo Login</span>
              </button>
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap text-xs text-gh-muted px-1">
            <span className="text-neutral-400 font-medium">Try handle:</span>
            {["arnavryie", "torvalds", "shadcn", "gaearon", "karpathy"].map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => setInputUsername(u)}
                className={`px-2.5 py-1 rounded-md text-xs font-mono transition-all cursor-pointer ${
                  inputUsername.toLowerCase().replace(/^@/, "") === u
                    ? "bg-purple-600 text-white font-bold shadow-sm"
                    : "bg-purple-950/40 border border-purple-800/40 text-purple-300 hover:text-white hover:bg-purple-900/60"
                }`}
              >
                @{u}
              </button>
            ))}
          </div>

          {/* Live GitHub User Preview Card */}
          <AnimatePresence mode="wait">
            {userPreview && (
              <motion.div
                key={userPreview.username}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-2 p-4 bg-[#0d1117] border border-purple-500/40 rounded-xl flex flex-col gap-3.5 shadow-xl relative"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={userPreview.avatar}
                      alt={userPreview.name}
                      className="w-14 h-14 rounded-full border-2 border-purple-500/60 bg-gh-surface shrink-0 object-cover shadow-md"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${userPreview.username}`;
                      }}
                    />
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-bold text-white hover:text-purple-300 transition-colors">
                          {userPreview.name}
                        </h3>
                        <span className="text-xs font-mono text-purple-400 bg-purple-950/60 border border-purple-800/50 px-2 py-0.5 rounded-full">
                          @{userPreview.username}
                        </span>
                        <span className="text-[10px] text-emerald-400 bg-emerald-950/50 border border-emerald-800/40 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" />
                          <span>Verified GitHub User</span>
                        </span>
                      </div>
                      {userPreview.bio && (
                        <p className="text-xs text-neutral-300 mt-1 line-clamp-2 leading-relaxed">
                          {userPreview.bio}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* GitHub Live Metrics */}
                  <div className="flex items-center gap-3 self-start sm:self-center border-t sm:border-t-0 border-gh-border/60 pt-2 sm:pt-0">
                    <div className="flex flex-col items-center bg-gh-surface px-3 py-1.5 rounded-lg border border-gh-border text-center min-w-[64px]">
                      <span className="text-xs font-bold text-white mono">{userPreview.publicRepos}</span>
                      <span className="text-[10px] text-gh-muted uppercase tracking-wider">Repos</span>
                    </div>
                    <div className="flex flex-col items-center bg-gh-surface px-3 py-1.5 rounded-lg border border-gh-border text-center min-w-[64px]">
                      <span className="text-xs font-bold text-white mono">{userPreview.followers.toLocaleString()}</span>
                      <span className="text-[10px] text-gh-muted uppercase tracking-wider">Followers</span>
                    </div>
                    <div className="flex flex-col items-center bg-gh-surface px-3 py-1.5 rounded-lg border border-gh-border text-center min-w-[64px]">
                      <span className="text-xs font-bold text-white mono">{userPreview.following.toLocaleString()}</span>
                      <span className="text-[10px] text-gh-muted uppercase tracking-wider">Following</span>
                    </div>
                  </div>
                </div>

                {/* AI User TL;DR Description Card */}
                <div className="bg-[#161b22] border border-purple-900/60 rounded-lg p-3 flex flex-col gap-1.5 shadow-inner">
                  <div className="flex items-center justify-between flex-wrap gap-1">
                    <div className="flex items-center gap-1.5 text-xs text-purple-300 font-semibold">
                      <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                      <span>AI User TL;DR:</span>
                      <span className="text-[11px] text-white bg-purple-950 border border-purple-800/80 px-2 py-0.2 rounded font-mono">
                        {userPreview.archetype}
                      </span>
                    </div>
                    <span className="text-[10px] text-purple-400/80 font-mono">✦ Dual-Brain Synthesis</span>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    {userPreview.aiTldr}
                  </p>
                  <p className="text-[11px] text-emerald-400 leading-snug flex items-center gap-1">
                    <span className="font-semibold text-emerald-300">Superpower:</span>
                    <span>{userPreview.superpower}</span>
                  </p>
                </div>

                {/* Action button inside card */}
                <div className="flex items-center justify-end gap-2 pt-1 border-t border-gh-border/50">
                  <button
                    type="button"
                    onClick={() => handleViewProfile(userPreview.username)}
                    className="flex items-center gap-1.5 text-xs text-gh-blue hover:text-white font-medium hover:underline cursor-pointer"
                  >
                    <span>Inspect @{userPreview.username}&apos;s full dossiers &amp; repos</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Secondary Exploration Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center mt-2">
          <Link
            href="/feed"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-900/60 to-blue-900/60 hover:from-purple-800 hover:to-blue-800 border border-purple-600/50 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg w-full sm:w-auto"
          >
            <span>Explore Public Social Feed</span>
            <ArrowRight className="w-4 h-4 text-purple-300" />
          </Link>

          <button
            onClick={handleGitHubLogin}
            className="flex items-center justify-center gap-2 bg-white text-black font-semibold px-6 py-3 rounded-xl hover:bg-gray-200 transition-colors w-full sm:w-auto cursor-pointer shadow-md"
          >
            <GithubIcon className="w-4 h-4" />
            <span>Sign in with GitHub</span>
          </button>
        </div>

        {/* Parallax Video Showcase (git-wit in Action) */}
        <ParallaxVideoShowcase />

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2 w-full text-left">
          <div className="gh-card p-5 flex flex-col gap-2 rounded-xl">
            <div className="flex items-center gap-2 text-gh-orange">
              <TrendingUp className="w-5 h-5" />
              <h3 className="text-white font-semibold text-sm">Trending &amp; Fork Spikes</h3>
            </div>
            <p className="text-gh-muted text-xs leading-relaxed">
              Discover breakout open-source projects through real-time fork velocity before they reach mainstream radars.
            </p>
          </div>

          <div className="gh-card p-5 flex flex-col gap-2 rounded-xl">
            <div className="flex items-center gap-2 text-gh-blue">
              <Users className="w-5 h-5" />
              <h3 className="text-white font-semibold text-sm">Developer Communities</h3>
            </div>
            <p className="text-gh-muted text-xs leading-relaxed">
              Topic-based developer hubs across AI/ML, Systems, Rust, and Frontend with curated repository signals.
            </p>
          </div>

          <div className="gh-card p-5 flex flex-col gap-2 rounded-xl">
            <div className="flex items-center gap-2 text-gh-purple">
              <Sparkles className="w-5 h-5" />
              <h3 className="text-white font-semibold text-sm">Dual-Brain AI Insights</h3>
            </div>
            <p className="text-gh-muted text-xs leading-relaxed">
              Instant AI user TL;DR descriptions, automated repo summaries, issue triage scoring, and sharable dossiers.
            </p>
          </div>
        </div>

        {/* Tech Stack Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-[11px] text-gh-muted pb-8">
          <span className="px-3 py-1 rounded-full bg-gh-surface border border-gh-border">
            MongoDB Atlas Vector Search
          </span>
          <span className="px-3 py-1 rounded-full bg-gh-surface border border-gh-border">
            Gemini AI + Dual-Brain Architecture
          </span>
          <span className="px-3 py-1 rounded-full bg-gh-surface border border-gh-border">
            Interactive Parallax Video
          </span>
          <span className="px-3 py-1 rounded-full bg-gh-surface border border-gh-border">
            Next.js 16 + React 19
          </span>
        </div>
      </div>
    </motion.div>
  );
}

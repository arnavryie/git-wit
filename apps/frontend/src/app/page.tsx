"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TrendingUp, Users, Sparkles, ArrowRight, UserCheck, LogIn } from "lucide-react";
import { useSession, signIn } from "next-auth/react";
import { motion } from "framer-motion";

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
    className={`absolute w-72 h-72 rounded-full pointer-events-none opacity-20 blur-3xl ${
      color === 'purple' ? 'bg-purple-600' : color === 'blue' ? 'bg-blue-600' : 'bg-cyan-500'
    }`}

    animate={{
      scale: [1, 1.2, 1],
      opacity: [0.2, 0.5, 0.2],
      rotate: [0, 360, 0],
    }}
    transition={{
      duration: 15,
      repeat: Infinity,
      ease: "linear",
    }}
  />
);

export default function LandingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loggingIn, setLoggingIn] = useState(false);
  const [inputUsername, setInputUsername] = useState("");

  // Keep landing page accessible even when authenticated so user can enter custom usernames
  const activeUser = (session?.user as any)?.login || session?.user?.name;

  const handleUserLogin = async (targetUser?: string) => {
    const raw = (targetUser || inputUsername || "arnavryie").trim().replace(/^@/, "");
    const userToLogin = raw || "arnavryie";
    setLoggingIn(true);
    try {
      if (typeof window !== "undefined") {
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
    } catch (e) {
      await handleUserLogin(inputUsername || "arnavryie");
    } finally {
      setLoggingIn(false);
    }
  };

  if (status === "loading" || loggingIn) {
    return (
      <div className="min-h-screen bg-gh-bg flex flex-col items-center justify-center gap-3">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gh-blue"></div>
        <p className="text-xs text-gh-muted">Entering Project Ronin...</p>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gh-bg flex flex-col items-center justify-center px-6 text-center relative py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <Orb color="purple" style={{ top: "10%", left: "10%" }} />
      <Orb color="blue" style={{ top: "20%", right: "15%" }} />
      <Orb color="cyan" style={{ bottom: "10%", left: "25%" }} />

      <motion.div
        className="max-w-2xl flex flex-col items-center gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.2 } },
        }}
      >
        <motion.div
          className="flex items-center gap-2 text-3xl font-bold text-white"
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        >
          <span>⚔️</span>
          <span>Project Ronin</span>
        </motion.div>

        {activeUser && (
          <motion.div
            className="flex items-center gap-2 bg-purple-950/70 border border-purple-700/60 px-3.5 py-1.5 rounded-full text-xs text-purple-200 shadow-md backdrop-blur-sm"
            variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
          >
            <span>Active session: <strong className="text-white">@{activeUser}</strong></span>
            <span className="text-purple-400">•</span>
            <Link href="/feed" className="text-gh-blue hover:underline font-semibold flex items-center gap-1">
              Go to Feed <ArrowRight className="w-3 h-3" />
            </Link>
          </motion.div>
        )}

        <motion.h1
          className="text-4xl sm:text-5xl font-bold text-white tracking-tight leading-tight"
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        >
          The social layer GitHub<br />never built.
        </motion.h1>

        <motion.p
          className="text-gh-muted text-base sm:text-lg max-w-xl leading-relaxed"
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        >
          Discover trending repos before they blow up. Follow the builders who matter.
          Get AI insights on the open-source world. It&apos;s GitHub meets Twitter — for developers.
        </motion.p>

        {/* Enter Any GitHub Username & Explore Box */}
        <motion.div
          className="w-full bg-[#161b22]/90 border border-purple-500/40 rounded-xl p-3.5 sm:p-5 shadow-2xl backdrop-blur-md flex flex-col gap-3 text-left"
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        >
          <div className="flex items-center justify-between text-xs px-0.5">
            <span className="flex items-center gap-1.5 text-purple-300 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Lookup Any GitHub Profile &amp; Login</span>
            </span>
            <span className="text-[11px] text-neutral-400 hidden sm:inline">Enter any public handle</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="relative w-full flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400 font-mono text-sm font-semibold">@</span>
              <input
                type="text"
                value={inputUsername}
                onChange={(e) => setInputUsername(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleViewProfile(inputUsername || "arnavryie");
                  }
                }}
                placeholder="Enter GitHub username (e.g. torvalds, arnavryie, shadcn)"
                className="w-full bg-[#0d1117] border border-gh-border text-white pl-8 pr-3 py-2.5 text-sm rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 font-mono transition-all"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => handleViewProfile(inputUsername || "arnavryie")}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold text-xs px-4 py-2.5 rounded-lg transition-all shadow-md cursor-pointer shrink-0"
              >
                <span>View Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => handleUserLogin(inputUsername || "arnavryie")}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-gh-surface2 hover:bg-[#30363d] border border-gh-border text-neutral-200 font-semibold text-xs px-3.5 py-2.5 rounded-lg transition-colors cursor-pointer shrink-0"
                title="Login with this profile"
              >
                <UserCheck className="w-3.5 h-3.5 text-purple-400" />
                <span>Demo Login</span>
              </button>
            </div>
          </div>

          {/* Quick presets */}
          <div className="flex items-center gap-1.5 flex-wrap text-[11px] text-gh-muted px-0.5 pt-1">
            <span className="text-neutral-400">Popular:</span>
            {["arnavryie", "torvalds", "shadcn", "gaearon", "karpathy"].map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => {
                  setInputUsername(u);
                  handleViewProfile(u);
                }}
                className="text-purple-300 hover:text-white hover:underline bg-purple-950/40 border border-purple-800/40 px-2 py-0.5 rounded cursor-pointer transition-colors"
              >
                @{u}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Secondary Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center"
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
            className="w-full sm:w-auto"
          >
            <Link
              href="/feed"
              className="flex items-center justify-center gap-2 bg-gh-surface hover:bg-gh-surface2 border border-gh-border text-neutral-200 font-semibold px-6 py-3 rounded-md transition-colors w-full sm:w-auto"
            >
              <span>Explore Public Feed</span>
              <ArrowRight className="w-4 h-4 text-gh-muted" />
            </Link>
          </motion.div>

          <motion.button
            onClick={handleGitHubLogin}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center gap-2 bg-white text-black font-semibold px-6 py-3 rounded-md hover:bg-gray-200 transition-colors w-full sm:w-auto cursor-pointer"
          >
            <GithubIcon className="w-4 h-4" />
            <span>Sign in with GitHub</span>
          </motion.button>
        </motion.div>

        {/* Live Preview Teaser Card */}
        <motion.div
          className="w-full mt-4 text-left"
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        >
          <motion.div
            className="gh-card p-5 border border-gh-border/80 hover:border-gh-blue/40 transition-all shadow-xl bg-[#0d1117]/80 backdrop-blur-sm rounded-xl flex flex-col gap-3"
            whileHover={{ scale: 1.015 }}
            transition={{ duration: 0.2 }}
            style={{
              background: "linear-gradient(135deg, #0d1117, #161b22)",
              border: "2px solid",
              borderColor: "rgba(135, 140, 149, 0.1)",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-gh-orange bg-gh-orange/10 px-2.5 py-1 rounded-md border border-gh-orange/20 select-none">
                <span className="animate-pulse">🔥</span>
                <span>+310 forks in last 24h</span>
                <span className="text-gh-muted">• Fork Velocity Spike</span>
              </div>
              <span className="text-[10px] uppercase tracking-wider text-gh-purple bg-gh-purple/10 border border-gh-purple/30 px-2.5 py-0.5 rounded-full font-semibold">
                ✦ AI Insights Active
              </span>
            </div>

            <div className="flex items-start gap-3 mt-1">
              <img
                src="https://github.com/ollama.png"
                alt="ollama"
                className="w-10 h-10 rounded-md border border-gh-border bg-gh-surface shrink-0"
              />
              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-base text-gh-blue font-bold hover:underline cursor-pointer">
                    ollama/ollama
                  </span>
                  <span className="text-xs text-gh-muted select-none">•</span>
                  <span className="text-xs text-gh-muted">32m ago</span>
                </div>
                <p className="text-sm text-gh-muted leading-relaxed">
                  Get up and running with Llama 3.3, Mistral, Qwen 2.5 Coder, and other large language models locally.
                </p>
              </div>
            </div>

            {/* AI Summary Chip */}
            <div className="text-xs bg-[#161b22] border border-gh-border rounded-lg p-3 text-gh-text flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-gh-purple shrink-0 mt-0.5" />
              <p className="leading-relaxed text-[12px] text-gray-300">
                <strong className="text-gh-purple font-medium">AI Intelligence:</strong> Lightweight local inference engine that enables private on-device code generation and agent orchestration with high VRAM efficiency.
              </p>
            </div>

            {/* Stats & Match */}
            <div className="flex items-center justify-between pt-1 border-t border-gh-border/60 text-xs text-gh-muted flex-wrap gap-2">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00ADD8]"></span>
                  <span>Go</span>
                </span>
                <span>⭐ 114.2k</span>
                <span>🍴 9.4k</span>
              </div>
              <span className="text-gh-purple font-medium text-[11px] bg-gh-purple/10 px-2 py-0.5 rounded-md border border-gh-purple/20">
                ✦ Matches your AI & Local LLM stack
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* Feature Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 w-full"
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        >
          <motion.div
            className="gh-card p-5 flex flex-col items-center gap-2"
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <TrendingUp className="w-6 h-6 text-gh-orange" />
            <h3 className="text-white font-semibold text-sm">Trending & Fork Spikes</h3>
            <p className="text-gh-muted text-xs">Discover breakout open-source projects before they reach mainstream radars.</p>
          </motion.div>
          <motion.div
            className="gh-card p-5 flex flex-col items-center gap-2"
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Users className="w-6 h-6 text-gh-blue" />
            <h3 className="text-white font-semibold text-sm">Developer Communities</h3>
            <p className="text-gh-muted text-xs">Topic-based developer hubs with live repo feeds and active collaborators.</p>
          </motion.div>
          <motion.div
            className="gh-card p-5 flex flex-col items-center gap-2"
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Sparkles className="w-6 h-6 text-gh-purple" />
            <h3 className="text-white font-semibold text-sm">Dual-Brain AI Insights</h3>
            <p className="text-gh-muted text-xs">Automated repo summaries, issue impact scoring, and developer dossiers.</p>
          </motion.div>
        </motion.div>

        {/* Tech Badges */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-2 mt-4 text-[11px] text-gh-muted"
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        >
          <motion.span
            className="px-2.5 py-1 rounded-full bg-gh-surface border border-gh-border"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            MongoDB Atlas Vector Search
          </motion.span>
          <motion.span
            className="px-2.5 py-1 rounded-full bg-gh-surface border border-gh-border"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            Gemini 1.5 + Local Qwen 32B
          </motion.span>
          <motion.span
            className="px-2.5 py-1 rounded-full bg-gh-surface border border-gh-border"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            768-dim Semantic Skill Matching
          </motion.span>
          <motion.span
            className="px-2.5 py-1 rounded-full bg-gh-surface border border-gh-border"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            Next.js 16 + React 19
          </motion.span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bell, Plus, Search, LogIn, LogOut, Sparkles, UserCheck, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function TopNav() {
  const [search, setSearch] = useState('');
  const { data: session, status } = useSession();
  const router = useRouter();

  const [activeUser, setActiveUser] = useState<string>('arnavryie');
  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const [switchInput, setSwitchInput] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ronin_active_user');
      if (saved) {
        setActiveUser(saved);
      } else if (session?.user) {
        const u = (session.user as any)?.login || session.user.name || 'arnavryie';
        setActiveUser(u);
      }
    }
  }, [session]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/') {
        e.preventDefault();
        const searchInput = document.getElementById('search-input');
        searchInput?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const username = (session?.user as any)?.login || session?.user?.name || activeUser;
  const avatar = session?.user?.image || `https://github.com/${username}.png`;
  const displayName = session?.user?.name || username;

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSignIn = async () => {
    try {
      const res = await signIn('github', { redirect: false });
      if (res?.error) {
        await signIn('credentials', { username: activeUser || 'arnavryie' });
      } else if (res?.url) {
        window.location.href = res.url;
      }
    } catch {
      await signIn('credentials', { username: activeUser || 'arnavryie' });
    }
  };

  const handleSwitchUser = (target: string) => {
    const clean = target.trim().replace(/^@/, '');
    if (!clean) return;
    setActiveUser(clean);
    if (typeof window !== 'undefined') {
      localStorage.setItem('ronin_active_user', clean);
    }
    setShowSwitchModal(false);
    setSwitchInput('');
    router.push(`/profile/${clean}`);
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 h-14 border-b border-gh-border px-4 flex items-center justify-between z-50 transition-all duration-200 ${
        scrolled
          ? "bg-gh-surface/80 backdrop-blur-md"
          : "bg-gh-surface"
      }`}>
        {/* Left: Logo & Title */}
        <div className="flex items-center gap-3">
          <Link href="/feed" className="flex items-center gap-2 text-white font-semibold">
            <span className="text-xl">⚔️</span>
            <span className="hidden sm:inline tracking-tight font-bold">Project Ronin</span>
          </Link>
        </div>

        {/* Center: Search */}
        <div className="relative w-[240px] sm:w-[320px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gh-muted pointer-events-none" />
          <Input 
            id="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && search.trim()) {
                const term = search.trim();
                if (term.startsWith('@')) {
                  const u = term.replace(/^@/, '');
                  if (typeof window !== 'undefined') localStorage.setItem('ronin_active_user', u);
                  router.push(`/profile/${u}`);
                } else {
                  router.push(`/search?q=${encodeURIComponent(term)}`);
                }
              }
            }}
            placeholder="Search repos or @username (e.g. @torvalds)..."
            className="w-full bg-gh-bg border-gh-border text-gh-text pl-9 pr-8 py-1.5 h-8 text-xs rounded-md focus-visible:ring-1 focus-visible:ring-gh-blue focus-visible:border-gh-blue"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded border border-gh-border bg-gh-surface text-[10px] text-gh-muted pointer-events-none">
            /
          </kbd>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Switch Profile Button */}
          <button
            onClick={() => setShowSwitchModal(true)}
            className="flex items-center gap-1.5 text-xs bg-purple-950/50 hover:bg-purple-900/60 border border-purple-800/60 text-purple-300 px-2.5 py-1 rounded-full transition-colors cursor-pointer"
            title="Switch custom GitHub profile or lookup any username"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden md:inline font-mono">@{username}</span>
            <span className="text-[10px] bg-purple-900/80 px-1.5 py-0.2 rounded text-purple-200">Switch</span>
          </button>

          <a
            href="/survey/responses.html"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-1.5 text-[11px] text-purple-300 font-medium bg-purple-950/50 border border-purple-800/60 hover:bg-purple-900/60 px-2.5 py-1 rounded-full transition-colors select-none"
            title="View User Feedback Survey & Results (47 Responses collected)"
          >
            <span>📋</span>
            <span>Survey (47)</span>
          </a>

          <button className="p-1.5 text-gh-muted hover:text-gh-text hover:bg-gh-surface2 rounded-md transition-colors" title="Notifications">
            <Bell className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-gh-muted hover:text-gh-text hover:bg-gh-surface2 rounded-md transition-colors" title="Create New">
            <Plus className="w-4 h-4" />
          </button>

          {status === 'loading' ? (
            <div className="ml-2 w-8 h-8 rounded-full bg-gh-surface2 animate-pulse" />
          ) : session ? (
            <div className="flex items-center gap-2 ml-2">
              <Link href={`/profile/${username}`} className="group shrink-0" title={`@${username}`}>
                <img 
                  src={avatar}
                  alt={displayName}
                  className="w-8 h-8 rounded-full border border-gh-border hover:border-gh-blue transition-colors bg-gh-surface2 shrink-0"
                />
              </Link>
              <button
                onClick={() => signOut()}
                title="Sign out"
                className="p-1.5 text-gh-muted hover:text-red-400 hover:bg-gh-surface2 rounded-md transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 ml-2">
              <Link href={`/profile/${username}`} className="group shrink-0" title={`@${username}`}>
                <img 
                  src={avatar}
                  alt={displayName}
                  className="w-8 h-8 rounded-full border border-purple-500/50 hover:border-gh-blue transition-colors bg-gh-surface2 shrink-0"
                />
              </Link>
              <button
                onClick={handleSignIn}
                className="flex items-center gap-1 gh-btn-primary py-1.5 px-2.5 text-xs font-semibold cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign in</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Switch Custom Profile Modal */}
      {showSwitchModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#161b22] border border-purple-500/50 rounded-xl max-w-md w-full p-5 shadow-2xl flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gh-border pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <h3 className="text-white font-semibold text-sm">Switch or View Any GitHub Profile</h3>
              </div>
              <button
                onClick={() => setShowSwitchModal(false)}
                className="text-gh-muted hover:text-white p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-gh-muted leading-relaxed">
              Enter any public GitHub username to inspect their live profile, AI intelligence dossier, and top repositories.
            </p>

            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400 font-mono text-xs">@</span>
                <input
                  type="text"
                  value={switchInput}
                  onChange={(e) => setSwitchInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSwitchUser(switchInput || activeUser);
                  }}
                  placeholder="e.g. torvalds, shadcn, karpathy"
                  className="w-full bg-[#0d1117] border border-gh-border text-white text-xs pl-7 pr-3 py-2 rounded-lg font-mono focus:outline-none focus:border-purple-500"
                  autoFocus
                />
              </div>
              <button
                onClick={() => handleSwitchUser(switchInput || activeUser)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all cursor-pointer shrink-0"
              >
                View Profile
              </button>
            </div>

            <div className="flex flex-col gap-2 pt-1 border-t border-gh-border">
              <span className="text-[11px] text-neutral-400">Or pick a popular developer:</span>
              <div className="flex flex-wrap gap-1.5">
                {['arnavryie', 'torvalds', 'shadcn', 'gaearon', 'karpathy'].map((u) => (
                  <button
                    key={u}
                    onClick={() => handleSwitchUser(u)}
                    className="text-xs font-mono text-purple-300 hover:text-white bg-purple-950/50 border border-purple-800/40 hover:border-purple-600 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                  >
                    @{u}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

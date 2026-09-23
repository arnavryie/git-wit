"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Users, Award, MapPin, Sparkles, UserCheck, ExternalLink } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useSession } from "next-auth/react";
import { FollowButton } from "@/components/profile/FollowButton";

interface Builder {
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  location?: string;
  followers: number;
}

const FEATURED_BUILDERS: Builder[] = [
  {
    username: "arnavryie",
    displayName: "Arnav Ryie",
    avatar: "https://github.com/arnavryie.png",
    bio: "Full-stack builder & creator of git-wit. Developing modern open-source devtools.",
    location: "Global",
    followers: 1420,
  },
  {
    username: "torvalds",
    displayName: "Linus Torvalds",
    avatar: "https://github.com/torvalds.png",
    bio: "Creator of Linux and Git. Open source systems engineer.",
    location: "Portland, OR",
    followers: 245000,
  },
  {
    username: "shadcn",
    displayName: "shadcn",
    avatar: "https://github.com/shadcn.png",
    bio: "Building accessible and customizable UI component libraries for modern web development.",
    location: "Remote",
    followers: 98000,
  },
  {
    username: "gaearon",
    displayName: "Dan Abramov",
    avatar: "https://github.com/gaearon.png",
    bio: "Co-author of Redux and Create React App. React core contributor.",
    location: "London, UK",
    followers: 87000,
  },
  {
    username: "karpathy",
    displayName: "Andrej Karpathy",
    avatar: "https://github.com/karpathy.png",
    bio: "AI researcher & educator. Passionate about deep learning, neural networks, and open AI education.",
    location: "California",
    followers: 130000,
  },
];

const COMMUNITIES = [
  { slug: "ai-ml", name: "AI & Machine Learning", icon: "🤖", description: "LLMs, neural networks, AI tools and frameworks", member_count: 12400 },
  { slug: "ui-frontend", name: "UI & Frontend", icon: "⚛️", description: "React, Vue, Svelte, CSS frameworks, design systems", member_count: 8900 },
  { slug: "devops", name: "DevOps & Infrastructure", icon: "⚙️", description: "Docker, Kubernetes, CI/CD, cloud-native tools", member_count: 6700 },
  { slug: "databases", name: "Databases", icon: "🗄️", description: "SQL, NoSQL, vector databases, ORMs", member_count: 5400 },
  { slug: "systems", name: "Systems & Rust", icon: "⚡", description: "Systems programming, performance engineering", member_count: 4200 },
  { slug: "python", name: "Python", icon: "🐍", description: "Python libraries, frameworks, and tools", member_count: 9800 },
  { slug: "web3", name: "Web3 & Blockchain", icon: "⛓️", description: "DeFi, smart contracts, crypto protocols", member_count: 3100 },
  { slug: "mobile", name: "Mobile Dev", icon: "📱", description: "iOS, Android, Flutter, React Native", member_count: 5800 },
];

export default function FollowingPage() {
  const { data: session } = useSession();
  const [followingList, setFollowingList] = useState<string[]>([]);
  const [builders, setBuilders] = useState<Builder[]>(FEATURED_BUILDERS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Read followed users from localStorage first
    let localFollows: string[] = [];
    if (typeof window !== "undefined") {
      try {
        localFollows = JSON.parse(localStorage.getItem("gitwit_following") || localStorage.getItem("ronin_following") || "[]");
      } catch {}
    }

    const currentActive = session?.user?.name || (typeof window !== "undefined" ? (localStorage.getItem("gitwit_active_user") || localStorage.getItem("ronin_active_user")) : null) || "guest";

    fetch(`/api/following/${currentActive}`)
      .then((r) => r.json())
      .then((data) => {
        const apiFollows: string[] = data.following || [];
        const combined = Array.from(new Set([...localFollows, ...apiFollows]));
        setFollowingList(combined);
      })
      .catch(() => {
        setFollowingList(localFollows);
      });
  }, [session]);

  const followedBuilders = builders.filter((b) => followingList.includes(b.username));
  const suggestedBuilders = builders.filter((b) => !followingList.includes(b.username));

  return (
    <div className="p-6 max-w-[1000px] mx-auto flex flex-col gap-6">
      <div className="border-b border-gh-border pb-3">
        <h2 className="text-xl font-bold text-white tracking-tight">Following</h2>
        <p className="text-xs text-gh-muted mt-1">Keep track of developers and technical communities you are following.</p>
      </div>

      <Tabs defaultValue="developers" className="w-full">
        <TabsList className="bg-[#161b22] border border-gh-border p-0.5 rounded-md flex self-start gap-1 select-none">
          <TabsTrigger
            value="developers"
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs text-gh-muted data-[state=active]:bg-gh-surface2 data-[state=active]:text-white rounded-md font-medium cursor-pointer"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Developers</span>
            <span className="bg-gh-surface2 px-1.5 py-0.5 rounded-full text-[10px] text-gh-text border border-gh-border">
              {followedBuilders.length}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="communities"
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs text-gh-muted data-[state=active]:bg-gh-surface2 data-[state=active]:text-white rounded-md font-medium cursor-pointer"
          >
            <Award className="w-3.5 h-3.5" />
            <span>Communities</span>
            <span className="bg-gh-surface2 px-1.5 py-0.5 rounded-full text-[10px] text-gh-text border border-gh-border">
              {COMMUNITIES.length}
            </span>
          </TabsTrigger>
        </TabsList>

        <div className="mt-4">
          <TabsContent value="developers" className="flex flex-col gap-6">
            {followedBuilders.length > 0 && (
              <div className="flex flex-col gap-3">
                <h3 className="text-xs font-semibold text-gh-muted uppercase tracking-wider">Currently Following</h3>
                <div className="flex flex-col gap-3">
                  {followedBuilders.map((dev) => (
                    <div
                      key={dev.username}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-gh-surface border border-gh-border rounded-md hover:border-gh-border/80 transition-colors"
                    >
                      <div className="flex gap-3 overflow-hidden">
                        <img
                          src={dev.avatar}
                          alt={dev.displayName}
                          className="w-12 h-12 rounded-full border border-gh-border shrink-0 bg-gh-bg"
                        />
                        <div className="flex flex-col overflow-hidden leading-tight justify-center">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Link
                              href={`/profile/${dev.username}`}
                              className="text-sm font-semibold text-white hover:underline hover:text-gh-blue"
                            >
                              {dev.displayName}
                            </Link>
                            <span className="text-xs text-gh-muted">@{dev.username}</span>
                          </div>
                          <p className="text-xs text-gh-muted mt-1 leading-normal">{dev.bio}</p>
                          <div className="flex items-center gap-4 mt-2 text-[11px] text-gh-muted flex-wrap">
                            {dev.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 shrink-0" />
                                <span>{dev.location}</span>
                              </div>
                            )}
                            <div>
                              <span>{dev.followers.toLocaleString()} followers</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <FollowButton targetUserId={dev.username} targetUsername={dev.username} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Suggested Builders to Follow */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <h3 className="text-xs font-semibold text-purple-300 uppercase tracking-wider">
                  {followedBuilders.length === 0 ? "Featured Open-Source Builders to Follow" : "Suggested Builders"}
                </h3>
              </div>

              <div className="flex flex-col gap-3">
                {suggestedBuilders.map((dev) => (
                  <div
                    key={dev.username}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-gh-surface border border-gh-border rounded-md hover:border-gh-border/80 transition-colors"
                  >
                    <div className="flex gap-3 overflow-hidden">
                      <img
                        src={dev.avatar}
                        alt={dev.displayName}
                        className="w-12 h-12 rounded-full border border-gh-border shrink-0 bg-gh-bg"
                      />
                      <div className="flex flex-col overflow-hidden leading-tight justify-center">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Link
                            href={`/profile/${dev.username}`}
                            className="text-sm font-semibold text-white hover:underline hover:text-gh-blue"
                          >
                            {dev.displayName}
                          </Link>
                          <span className="text-xs text-gh-muted">@{dev.username}</span>
                        </div>
                        <p className="text-xs text-gh-muted mt-1 leading-normal">{dev.bio}</p>
                        <div className="flex items-center gap-4 mt-2 text-[11px] text-gh-muted flex-wrap">
                          {dev.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 shrink-0" />
                              <span>{dev.location}</span>
                            </div>
                          )}
                          <div>
                            <span>{dev.followers.toLocaleString()} followers</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="shrink-0">
                      <FollowButton targetUserId={dev.username} targetUsername={dev.username} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="communities" className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {COMMUNITIES.map((comm) => (
              <div
                key={comm.slug}
                className="p-4 bg-gh-surface border border-gh-border rounded-md hover:border-gh-blue transition-colors flex flex-col gap-3"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl p-1.5 rounded-md bg-gh-bg border border-gh-border select-none">
                    {comm.icon}
                  </span>
                  <div className="flex flex-col leading-tight">
                    <Link
                      href={`/communities/${comm.slug}`}
                      className="text-sm font-bold text-white hover:underline hover:text-gh-blue"
                    >
                      {comm.name}
                    </Link>
                    <span className="text-[10px] text-gh-muted">Community • /c/{comm.slug}</span>
                  </div>
                </div>

                <p className="text-xs text-gh-muted line-clamp-2 leading-relaxed">
                  {comm.description}
                </p>

                <div className="flex items-center justify-between text-xs text-gh-muted mt-auto pt-2 border-t border-gh-border/40 select-none">
                  <div>
                    <span className="font-semibold text-white">{comm.member_count.toLocaleString()}</span> members
                  </div>
                  <Link href={`/communities/${comm.slug}`} className="text-gh-blue hover:underline text-xs">
                    View Repos →
                  </Link>
                </div>
              </div>
            ))}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

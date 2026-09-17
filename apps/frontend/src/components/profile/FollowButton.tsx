"use client"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { UserPlus, UserCheck } from "lucide-react"

export function FollowButton({ targetUserId, targetUsername }: { targetUserId: string, targetUsername: string }) {
  const { data: session } = useSession()
  const [isFollowing, setIsFollowing] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = JSON.parse(localStorage.getItem("ronin_following") || "[]")
        if (saved.includes(targetUsername)) {
          setIsFollowing(true)
          return
        }
      } catch {}
    }

    if (session?.user?.email) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL || "/api"}/following/${session.user.email}`)
        .then(res => res.json())
        .then(data => {
          if (data.following?.includes(targetUsername)) {
            setIsFollowing(true)
          }
        })
        .catch(() => {})
    }
  }, [session, targetUsername])

  const handleFollow = async () => {
    setLoading(true)
    const nextState = !isFollowing
    setIsFollowing(nextState)

    // Save to localStorage
    if (typeof window !== "undefined") {
      try {
        let saved = JSON.parse(localStorage.getItem("ronin_following") || "[]")
        if (nextState) {
          if (!saved.includes(targetUsername)) saved.push(targetUsername)
          toast.success(`Following @${targetUsername}!`)
        } else {
          saved = saved.filter((u: string) => u !== targetUsername)
          toast(`Unfollowed @${targetUsername}.`)
        }
        localStorage.setItem("ronin_following", JSON.stringify(saved))
      } catch {}
    }

    const endpoint = nextState ? "follow" : "unfollow"
    const followerEmail = session?.user?.email || "guest@users.noreply.github.com"
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || "/api"}/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          follower_id: followerEmail,
          following_id: targetUserId,
          following_username: targetUsername
        })
      })
    } catch {} finally {
      setLoading(false)
    }
  }

  // Don't show follow button for your own profile if signed in as that exact user
  if (session?.user?.name === targetUsername) return null

  return (
    <button 
      onClick={handleFollow}
      disabled={loading}
      className={`mt-2 w-full text-xs px-3 py-1.5 rounded-md font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 ${
        isFollowing 
          ? "bg-gh-surface2 text-gh-text border border-gh-border hover:border-red-500/50 hover:text-red-400" 
          : "bg-gh-blue text-white hover:bg-blue-600 shadow-sm"
      }`}
    >
      {isFollowing ? (
        <>
          <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Following</span>
        </>
      ) : (
        <>
          <UserPlus className="w-3.5 h-3.5" />
          <span>Follow @{targetUsername}</span>
        </>
      )}
    </button>
  )
}

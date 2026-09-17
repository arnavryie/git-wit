"use client"
import { useEffect, useState } from "react"
import { BrainCircuit, Copy, Check, ShieldCheck, Sparkles } from "lucide-react"
import { toast } from "sonner"

interface DeveloperDossierProps {
  username: string
  skills: string[]
  topRepos: string[]
}

export function DeveloperDossier({ username, skills, topRepos }: DeveloperDossierProps) {
  const [dossier, setDossier] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "/api"}/ai/developer-dossier`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, skills, top_repos: topRepos })
    })
      .then(r => r.json())
      .then(d => setDossier(d.dossier || ""))
      .catch(() => setDossier("Unable to generate dossier at this moment."))
      .finally(() => setLoading(false))
  }, [username, skills, topRepos])

  const handleCopy = () => {
    if (!dossier) return
    navigator.clipboard.writeText(`[Project Ronin Developer Dossier: @${username}]\n\n${dossier}`)
    setCopied(true)
    toast("📋 Copied developer intelligence report")
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="p-5 bg-gh-surface border border-gh-border rounded-xl flex flex-col gap-4 relative overflow-hidden shadow-lg">
      <div className="flex items-center justify-between border-b border-gh-border/70 pb-3 flex-wrap gap-2 select-none">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-gh-purple animate-pulse" />
          <h3 className="text-sm font-bold text-white tracking-tight">
            Developer Intelligence Dossier
          </h3>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-gh-purple/10 text-gh-purple border border-gh-purple/30">
            ✦ Dual-Brain AI
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-[11px] text-gh-green font-medium bg-gh-green/10 px-2 py-0.5 rounded-md border border-gh-green/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified Builder</span>
          </div>
          <button
            onClick={handleCopy}
            disabled={loading || !dossier}
            className="flex items-center gap-1 text-xs text-gh-muted hover:text-white px-2 py-1 rounded bg-[#161b22] border border-gh-border transition-colors cursor-pointer disabled:opacity-40"
            title="Copy dossier to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-gh-green" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied" : "Copy Brief"}</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3 py-2">
          <div className="flex items-center gap-2 text-xs text-gh-muted">
            <Sparkles className="w-3.5 h-3.5 text-gh-purple animate-spin" />
            <span>Synthesizing repository contributions and architecture patterns...</span>
          </div>
          <div className="h-3 bg-[#21262d] rounded animate-pulse w-full" />
          <div className="h-3 bg-[#21262d] rounded animate-pulse w-11/12" />
          <div className="h-3 bg-[#21262d] rounded animate-pulse w-4/5" />
          <div className="h-3 bg-[#21262d] rounded animate-pulse w-full mt-3" />
          <div className="h-3 bg-[#21262d] rounded animate-pulse w-9/12" />
        </div>
      ) : (
        <div className="flex flex-col gap-4 leading-relaxed">
          <p className="text-xs sm:text-sm text-neutral-300 whitespace-pre-wrap leading-relaxed">
            {dossier}
          </p>

          {skills && skills.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-gh-border/50 text-[11px] text-gh-muted">
              <span className="font-semibold text-white">Analyzed Core Stack:</span>
              {skills.slice(0, 5).map(skill => (
                <span key={skill} className="px-2 py-0.5 rounded bg-[#1f3d5c] text-gh-blue border border-[#1f4f7c]">
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}


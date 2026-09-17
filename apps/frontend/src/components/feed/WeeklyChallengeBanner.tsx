"use client"

import React, { useState } from "react"
import { Trophy, Sparkles, CheckCircle2, Circle, ChevronDown, ChevronUp, Award, ArrowRight } from "lucide-react"

export default function WeeklyChallengeBanner() {
  const [collapsed, setCollapsed] = useState(false)
  const [tasks, setTasks] = useState([
    { id: 1, text: "Explore AI-recommended repos for your stack", done: true },
    { id: 2, text: "Read an AI TL;DR summary on a trending project", done: true },
    { id: 3, text: "Star or bookmark a beginner-friendly repo", done: false },
  ])

  const toggleTask = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  const completedCount = tasks.filter(t => t.done).length

  return (
    <div className="bg-gradient-to-r from-[#161b22] via-[#1a1f2c] to-[#161b22] border border-gh-purple/40 rounded-xl p-4 shadow-md transition-all">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gh-purple/20 border border-gh-purple/50 flex items-center justify-center text-gh-purple shrink-0">
            <Trophy className="w-4 h-4 text-purple-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-tight">
                Weekly Dev Challenge: Sprint #3
              </h3>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold">
                Community Driven
              </span>
            </div>
            <p className="text-xs text-gh-muted">
              Suggested by 47 developer peers — complete weekly goals to earn verified badges.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-purple-300 font-mono bg-purple-950/60 border border-purple-800/60 px-2.5 py-1 rounded-md">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Badge: <strong>Ronin Pioneer</strong></span>
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-gh-muted hover:text-white p-1 rounded transition-colors"
            title={collapsed ? "Expand challenge" : "Collapse challenge"}
          >
            {collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="mt-3 pt-3 border-t border-gh-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 flex-1">
            {tasks.map(task => (
              <button
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`flex items-center gap-2 text-xs px-2.5 py-1.5 rounded-md border transition-all text-left ${
                  task.done
                    ? "bg-emerald-950/30 border-emerald-700/40 text-emerald-300"
                    : "bg-[#0d1117] border-gh-border text-gh-muted hover:text-gh-text hover:border-gh-muted"
                }`}
              >
                {task.done ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <Circle className="w-3.5 h-3.5 text-gh-muted shrink-0" />
                )}
                <span>{task.text}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs text-gh-muted shrink-0">
            <div className="w-20 bg-neutral-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-emerald-400 h-full transition-all duration-300"
                style={{ width: `${(completedCount / tasks.length) * 100}%` }}
              />
            </div>
            <span className="font-mono text-[11px] text-neutral-300">{completedCount}/{tasks.length} Completed</span>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Community Hub Interactive Filter Bar
 * Allows granular filtering of repositories by ecosystem, maturity, and AI impact.
 * Author: Yukta Tapdiya (@yukta06tapdiya)
 */

'use client';

import React from 'react';

export interface HubFilterBarProps {
  activeTopic: string;
  onSelectTopic: (topic: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const TOPICS = [
  { id: 'all', label: '🌐 All Ecosystems' },
  { id: 'ai-ml', label: '🤖 AI & Machine Learning' },
  { id: 'frontend', label: '⚡ Modern Frontend' },
  { id: 'systems', label: '🦀 Systems & Compilers' },
  { id: 'devops', label: '☁️ Cloud & Infrastructure' },
  { id: 'security', label: '🛡️ Cyber & Reverse Eng' }
];

export const HubFilterBar: React.FC<HubFilterBarProps> = ({
  activeTopic,
  onSelectTopic,
  searchQuery,
  onSearchChange
}) => {
  return (
    <div className="w-full flex flex-col md:flex-row items-center justify-between gap-3 p-4 bg-[#161b22] border border-[#30363d] rounded-xl mb-6 shadow-sm">
      <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
        {TOPICS.map((t) => {
          const isActive = activeTopic === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onSelectTopic(t.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 border ${
                isActive
                  ? 'bg-[#58a6ff]/15 border-[#58a6ff] text-[#58a6ff] shadow-sm'
                  : 'bg-[#21262d] border-[#30363d] text-[#8b949e] hover:text-[#f0f6fc] hover:border-[#8b949e]'
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="w-full md:w-64 relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Filter topics & repos..."
          className="w-full bg-[#0d1117] border border-[#30363d] focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] rounded-lg px-3 py-1.5 text-xs text-[#f0f6fc] placeholder-[#6e7681] outline-none transition-all"
        />
      </div>
    </div>
  );
};

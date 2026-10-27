/**
 * Keyboard Accessible Select & Dropdown Menu
 * Author: Yukta Tapdiya (@yukta06tapdiya)
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';

export interface DropdownOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export interface DropdownProps {
  options: DropdownOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  placeholder?: string;
  label?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  selectedValue,
  onSelect,
  placeholder = 'Select option...',
  label
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const selectedOption = options.find((o) => o.value === selectedValue);

  return (
    <div className="relative w-full" ref={containerRef}>
      {label && (
        <label className="block text-xs font-medium text-[#8b949e] mb-1.5">
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between px-3.5 py-2 text-xs bg-[#0d1117] border border-[#30363d] rounded-lg text-[#f0f6fc] hover:border-[#8b949e] transition-all focus:outline-none focus:ring-1 focus:ring-[#58a6ff]"
      >
        <span className="flex items-center gap-2 truncate">
          {selectedOption?.icon}
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className="text-[#8b949e] text-[10px]">▼</span>
      </button>

      {isOpen && (
        <ul
          role="listbox"
          className="absolute z-50 w-full mt-1.5 bg-[#161b22] border border-[#30363d] rounded-lg shadow-xl max-h-56 overflow-y-auto py-1 scrollbar-none animate-in fade-in-50"
        >
          {options.map((opt) => {
            const isSelected = opt.value === selectedValue;
            return (
              <li
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onSelect(opt.value);
                  setIsOpen(false);
                }}
                className={`flex items-center gap-2 px-3 py-2 text-xs cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-[#58a6ff]/15 text-[#58a6ff] font-medium'
                    : 'text-[#8b949e] hover:bg-[#21262d] hover:text-[#f0f6fc]'
                }`}
              >
                {opt.icon}
                <span className="truncate">{opt.label}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

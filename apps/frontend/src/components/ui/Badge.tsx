/**
 * Accessible Status & Archetype Badge Component
 * Author: Yukta Tapdiya (@yukta06tapdiya)
 */

'use client';

import React from 'react';

export type BadgeVariant = 'default' | 'verified' | 'ai' | 'warning' | 'breakout' | 'outline';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  icon,
  className = '',
  ...props
}) => {
  const variantStyles: Record<BadgeVariant, string> = {
    default: 'bg-[#21262d] text-[#8b949e] border-[#30363d]',
    verified: 'bg-[#238636]/15 text-[#3fb950] border-[#238636]/40',
    ai: 'bg-[#8957e5]/15 text-[#bc8cff] border-[#8957e5]/40 shadow-sm shadow-[#8957e5]/10',
    breakout: 'bg-[#f78166]/15 text-[#f78166] border-[#f78166]/40',
    warning: 'bg-[#d29922]/15 text-[#e3b341] border-[#d29922]/40',
    outline: 'bg-transparent text-[#c9d1d9] border-[#30363d]'
  };

  const sizeStyles = {
    sm: 'text-[10px] px-1.5 py-0.5 gap-1 font-medium',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium'
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border transition-all duration-150 select-none ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};

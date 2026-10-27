/**
 * Dark Mode Shimmering Skeleton Loader
 * Author: Yukta Tapdiya (@yukta06tapdiya)
 */

'use client';

import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
  rounded?: 'sm' | 'md' | 'lg' | 'full';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width,
  height,
  rounded = 'md',
  className = '',
  style,
  ...props
}) => {
  const roundedClasses = {
    sm: 'rounded',
    md: 'rounded-lg',
    lg: 'rounded-xl',
    full: 'rounded-full'
  };

  return (
    <div
      className={`relative overflow-hidden bg-[#161b22] border border-[#21262d] animate-pulse before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-[#30363d]/30 before:to-transparent ${roundedClasses[rounded]} ${className}`}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        ...style
      }}
      aria-hidden="true"
      {...props}
    />
  );
};

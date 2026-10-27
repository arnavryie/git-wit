/**
 * Developer Avatar with Fallback Letter Initials
 * Author: Yukta Tapdiya (@yukta06tapdiya)
 */

'use client';

import React, { useState } from 'react';

export interface AvatarProps {
  src?: string;
  alt: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  size = 'md',
  className = ''
}) => {
  const [hasError, setHasError] = useState(false);

  const sizeStyles = {
    xs: 'w-5 h-5 text-[9px]',
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg'
  };

  const initial = alt ? alt.charAt(0).toUpperCase() : '?';

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full overflow-hidden bg-[#21262d] border border-[#30363d] select-none shrink-0 ${sizeStyles[size]} ${className}`}
    >
      {src && !hasError ? (
        <img
          src={src}
          alt={alt}
          onError={() => setHasError(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="font-semibold text-[#8b949e]">{initial}</span>
      )}
    </div>
  );
};

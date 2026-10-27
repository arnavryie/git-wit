/**
 * Dark Theme Toast Notification Dispatcher & Hook
 * Author: Yukta Tapdiya (@yukta06tapdiya)
 */

'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'ai';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
}

interface ToastContextType {
  toasts: ToastMessage[];
  showToast: (title: string, description?: string, type?: ToastType) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((title: string, description?: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, description, type }]);
    setTimeout(() => dismissToast(id), 4000);
  }, [dismissToast]);

  return (
    <ToastContext.Provider value={{ toasts, showToast, dismissToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((t) => {
          const typeStyles: Record<ToastType, string> = {
            info: 'border-[#30363d] bg-[#161b22] text-[#f0f6fc]',
            success: 'border-[#238636]/40 bg-[#161b22] text-[#3fb950]',
            error: 'border-[#f85149]/40 bg-[#161b22] text-[#f85149]',
            ai: 'border-[#8957e5]/40 bg-[#161b22] text-[#bc8cff]'
          };

          return (
            <div
              key={t.id}
              className={`pointer-events-auto p-3.5 rounded-xl border shadow-2xl flex items-start justify-between gap-3 animate-in slide-in-from-bottom-5 duration-200 ${typeStyles[t.type]}`}
            >
              <div>
                <p className="text-xs font-semibold">{t.title}</p>
                {t.description && (
                  <p className="text-[11px] text-[#8b949e] mt-0.5">{t.description}</p>
                )}
              </div>
              <button
                onClick={() => dismissToast(t.id)}
                className="text-[#8b949e] hover:text-[#f0f6fc] text-xs p-0.5"
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

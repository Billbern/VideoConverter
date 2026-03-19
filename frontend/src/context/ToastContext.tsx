// src/context/ToastContext.tsx
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext } from 'react';

interface Toast {
  title: string;
  message: string;
}

const ToastContext = createContext<{
  showToast: (title: string, message: string) => void;
} | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = (title: string, message: string) => {
    setToast({ title, message });
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div className="toast show">
          <strong>{toast.title}</strong>
          <span>{toast.message}</span>
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
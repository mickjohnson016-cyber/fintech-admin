'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, XCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle className="text-emerald-500" size={20} />,
    error: <XCircle className="text-rose-500" size={20} />,
    warning: <AlertCircle className="text-amber-500" size={20} />,
  };

  const bgColors = {
    success: 'bg-card border-border',
    error: 'bg-card border-border',
    warning: 'bg-card border-border',
  };

  return (
    <div className={`flex items-center gap-3 p-4 rounded-2xl border shadow-2xl shadow-black/40 animate-in slide-in-from-right duration-300 ${bgColors[type]}`}>
      {icons[type]}
      <p className="text-[13px] font-bold text-foreground flex-1">{message}</p>
      <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1 transition-all">
        <X size={16} />
      </button>
    </div>
  );
};

export const useToast = () => {
  const [toasts, setToasts] = useState<{ id: number; message: string; type: ToastType }[]>([]);

  const showToast = (message: string, type: ToastType = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const ToastContainer = () => (
    <div className="fixed bottom-6 right-6 z-[110] flex flex-col gap-3">
      {toasts.map((toast) => (
        <Toast 
          key={toast.id} 
          message={toast.message} 
          type={toast.type} 
          onClose={() => removeToast(toast.id)} 
        />
      ))}
    </div>
  );

  return { showToast, ToastContainer };
};

export default Toast;

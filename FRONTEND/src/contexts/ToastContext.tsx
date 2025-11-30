import React, { createContext, useState, useCallback } from "react";
import Toast from "../components/Toast";
import type { ToastType } from "../components/Toast";

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

export interface ToastContextType {
  toasts: ToastMessage[];
  showToast: (message: string, type: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
  showLoading: (message: string) => string;
  hideLoading: (id: string, message: string, type: "success" | "error") => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(
  undefined
);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType, duration: number = 4000) => {
      const id = `toast-${Date.now()}-${Math.random()}`;
      setToasts((prev) => [...prev, { id, message, type, duration }]);
      return id;
    },
    []
  );

  const showLoading = useCallback((message: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type: "loading" }]);
    return id;
  }, []);

  const hideLoading = useCallback(
    (id: string, message: string, type: "success" | "error") => {
      setToasts((prev) =>
        prev.map((toast) =>
          toast.id === id
            ? { ...toast, message, type, duration: 4000 }
            : toast
        )
      );
    },
    []
  );

  return (
    <ToastContext.Provider
      value={{ toasts, showToast, removeToast, showLoading, hideLoading }}
    >
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={removeToast}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};



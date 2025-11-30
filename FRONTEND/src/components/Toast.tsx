import React, { useEffect } from "react";
import "../assets/css/toast.css";

export type ToastType = "success" | "error" | "warning" | "info" | "loading";

interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({
  id,
  message,
  type,
  duration = 4000,
  onClose,
}) => {
  useEffect(() => {
    if (type === "loading") {
      return; // Los toasts de carga no se cierran automáticamente
    }

    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, type, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return "✓";
      case "error":
        return "✕";
      case "warning":
        return "⚠";
      case "info":
        return "ℹ";
      case "loading":
        return "⟳";
      default:
        return "●";
    }
  };

  return (
    <div className={`toast toast-${type}`}>
      <div className={`toast-icon icon-${type}`}>
        {type === "loading" ? (
          <span className="spinner"></span>
        ) : (
          getIcon()
        )}
      </div>
      <div className="toast-content">
        <p className="toast-message">{message}</p>
      </div>
    </div>
  );
};

export default Toast;

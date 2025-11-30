import { useContext } from "react";
import type { ToastContextType } from "./ToastContext";
import { ToastContext } from "./ToastContext";

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast debe ser usado dentro de ToastProvider");
  }
  return context;
};

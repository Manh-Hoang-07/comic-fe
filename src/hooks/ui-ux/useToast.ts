"use client";

import { useState, useCallback } from "react";

export type ToastType = "success" | "succes" | "error" | "warning" | "info";

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
  duration: number;
  visible: boolean;
}

export interface ToastOptions {
  duration?: number;
}

let toastId = 0;

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: number): void => {
    setToasts((prev) => {
      const index = prev.findIndex((toast) => toast.id === id);
      if (index > -1) {
        const updated = [...prev];
        updated[index] = { ...updated[index], visible: false };
        setTimeout(() => {
          setToasts((current) => current.filter((toast) => toast.id !== id));
        }, 300); // Animation duration
        return updated;
      }
      return prev;
    });
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = "info", options: ToastOptions = {}): number => {
      const id = ++toastId;
      const duration = options.duration || 3000;

      const toast: Toast = {
        id,
        message,
        type,
        duration,
        visible: true,
      };

      setToasts((prev) => [...prev, toast]);

      // Auto remove after duration
      setTimeout(() => {
        removeToast(id);
      }, duration);

      return id;
    },
    [removeToast]
  );

  const showSuccess = useCallback(
    (message: string, options?: ToastOptions): number => {
      return showToast(message, "success", options);
    },
    [showToast]
  );

  const showError = useCallback(
    (message: string, options?: ToastOptions): number => {
      return showToast(message, "error", options);
    },
    [showToast]
  );

  const showWarning = useCallback(
    (message: string, options?: ToastOptions): number => {
      return showToast(message, "warning", options);
    },
    [showToast]
  );

  const showInfo = useCallback(
    (message: string, options?: ToastOptions): number => {
      return showToast(message, "info", options);
    },
    [showToast]
  );

  const clearAll = useCallback((): void => {
    setToasts([]);
  }, []);

  return {
    toasts,
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeToast,
    clearAll,
  };
}




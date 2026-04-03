"use client";

import { useEffect, ReactNode } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  show: boolean;
  onClose: () => void;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  closeOnBackdrop?: boolean;
  loading?: boolean;
  children: ReactNode;
  footer?: ReactNode;
}

export default function Modal({
  show,
  onClose,
  title = "Modal Title",
  size = "md",
  closeOnBackdrop = true,
  loading = false,
  children,
  footer,
}: ModalProps) {
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && show) {
        onClose();
      }
    };

    if (show) {
      document.addEventListener("keydown", handleEscKey);
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
      document.body.classList.remove("modal-open");
    };
  }, [show, onClose]);

  const handleBackdropClick = () => {
    if (closeOnBackdrop) {
      onClose();
    }
  };

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
    full: "w-[calc(100%-2rem)] h-[calc(100vh-2rem)] max-w-none",
  };

  if (!show) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10 transition-opacity"
        onClick={handleBackdropClick}
      />
      <div
        className={`bg-white rounded-lg shadow-xl w-full max-h-[calc(100vh-2rem)] flex flex-col overflow-hidden ${sizeClasses[size]} mx-4`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-4 overflow-y-auto flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-gray-600 text-sm mt-3">Đang tải...</p>
            </div>
          ) : (
            children
          )}
        </div>

        {/* Footer */}
        {footer && (
          <div className="p-4 border-t border-gray-200 flex justify-end">
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}



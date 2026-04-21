"use client";

import { useState } from "react";
import Modal from '@/components/UI/Feedback/Modal';

interface ConfirmModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonClass?: string;
  loading?: boolean;
}

export default function ConfirmModal({
  show,
  onClose,
  onConfirm,
  title = "Xác nhận",
  message = "Bạn có chắc chắn muốn thực hiện hành động này?",
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  confirmButtonClass = "bg-red-600 hover:bg-red-700",
  loading = false,
}: ConfirmModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsSubmitting(true);
      const result = onConfirm();
      if (result instanceof Promise) {
        await result;
      }
      // Note: Only call onClose automatically if the parent didn't already handle closing
      // Often, the parent handles closing, but just in case we call it here.
      onClose();
    } catch (error) {
      // If the promise rejects, we might not want to close
      console.error("Confirmation error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = loading || isSubmitting;

  return (
    <Modal show={show} onClose={onClose} title={title} size="sm">
      <div className="p-4">
        <div className="mb-4 text-sm text-gray-600">{message}</div>
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isLoading}
            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none disabled:opacity-50 ${confirmButtonClass}`}
          >
            {isLoading ? "Đang xử lý..." : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}




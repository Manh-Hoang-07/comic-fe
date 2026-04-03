"use client";

import { useState, useEffect, ReactNode } from "react";

interface FormWrapperProps {
  initialData?: Record<string, any>;
  defaultValues?: Record<string, any>;
  apiErrors?: Record<string, string | string[]>;
  showCancelButton?: boolean;
  submitText?: string;
  submittingText?: string;
  cancelText?: string;
  disableSubmit?: boolean;
  onSubmit?: (data: Record<string, any>) => void | Promise<void>;
  onCancel?: () => void;
  children?:
  | ReactNode
  | ((props: {
    form: Record<string, any>;
    errors: Record<string, string | string[]>;
    isSubmitting: boolean;
    clearError: (field?: string) => void;
  }) => ReactNode);
  actions?: ReactNode;
}

export default function FormWrapper({
  initialData = {},
  defaultValues = {},
  apiErrors = {},
  showCancelButton = true,
  submitText = "Lưu",
  submittingText = "Đang lưu...",
  cancelText = "Hủy",
  disableSubmit = false,
  onSubmit,
  onCancel,
  children,
  actions,
}: FormWrapperProps) {
  const [form, setForm] = useState<Record<string, any>>({ ...defaultValues });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setForm((prev) => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  useEffect(() => {
    if (defaultValues && Object.keys(defaultValues).length > 0) {
      setForm((prev) => ({ ...prev, ...defaultValues }));
    }
  }, [defaultValues]);

  const displayErrors = { ...errors, ...apiErrors };

  const clearError = (field?: string) => {
    if (field) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    } else {
      setErrors({});
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onSubmit?.(form);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    onCancel?.();
  };

  return (
    <div className="form-wrapper">
      {typeof children === "function"
        ? children({ form, errors: displayErrors, isSubmitting, clearError })
        : children}
      <div className="mt-4 flex justify-end space-x-2">
        {actions || (
          <>
            {showCancelButton && (
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              >
                {cancelText}
              </button>
            )}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || disableSubmit}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="inline-flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  {submittingText}
                </span>
              ) : (
                submitText
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}




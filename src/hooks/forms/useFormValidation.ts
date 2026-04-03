"use client";

import { useState, useCallback } from "react";

interface ValidationRule {
  required?: string;
  min?: number;
  max?: number;
  email?: boolean;
  numeric?: boolean;
  minValue?: number;
  maxValue?: number;
  pattern?: RegExp;
  patternMessage?: string;
  minMessage?: string;
  maxMessage?: string;
  emailMessage?: string;
  numericMessage?: string;
  minValueMessage?: string;
  maxValueMessage?: string;
}

interface ValidationRules {
  [key: string]: ValidationRule[];
}

interface FormData {
  [key: string]: any;
}

export function useFormValidation(
  formData: FormData,
  validationRules: ValidationRules
) {
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // Clear errors
  const clearErrors = useCallback(() => {
    setValidationErrors({});
  }, []);

  // Helper function to validate email
  function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Helper function to validate a single rule
  const validateRule = useCallback((field: string, rule: any): string | null => {
    const fieldValue = formData[field];

    // Support both formats: useFormValidation format and utils/form.ts format
    if (typeof rule === "string") {
      // utils/form.ts format
      if (rule === "required" && !fieldValue) {
        return "Trường này là bắt buộc.";
      }
      if (rule === "email" && fieldValue && !isValidEmail(fieldValue)) {
        return "Email không hợp lệ.";
      }
    } else if (typeof rule === "object") {
      // useFormValidation format
      if (rule.required && !fieldValue) {
        return rule.required;
      }

      if (rule.min && fieldValue && fieldValue.length < rule.min) {
        return rule.minMessage || `Tối thiểu ${rule.min} ký tự`;
      }

      if (rule.max && fieldValue && fieldValue.length > rule.max) {
        return rule.maxMessage || `Tối đa ${rule.max} ký tự`;
      }

      if (rule.email && fieldValue && !isValidEmail(fieldValue)) {
        return rule.emailMessage || "Email không hợp lệ";
      }

      if (rule.numeric && fieldValue && isNaN(fieldValue)) {
        return rule.numericMessage || "Phải là số";
      }

      const numValue = Number(fieldValue);
      if (rule.minValue && fieldValue && numValue < rule.minValue) {
        return (
          rule.minValueMessage || `Giá trị tối thiểu là ${rule.minValue}`
        );
      }

      if (rule.maxValue && fieldValue && numValue > rule.maxValue) {
        return rule.maxValueMessage || `Giá trị tối đa là ${rule.maxValue}`;
      }

      if (rule.pattern && fieldValue && !rule.pattern.test(fieldValue)) {
        return rule.patternMessage || "Giá trị không hợp lệ";
      }
    }

    return null; // No error
  }, [formData]);

  // Validate form
  const validateForm = useCallback((): boolean => {
    setValidationErrors({});
    let valid = true;
    const errors: Record<string, string> = {};

    for (const field in validationRules) {
      const fieldRules = validationRules[field];
      if (!fieldRules) continue;

      for (const rule of fieldRules) {
        const errorMessage = validateRule(field, rule);
        if (errorMessage) {
          errors[field] = errorMessage;
          valid = false;
          break;
        }
      }
    }

    setValidationErrors(errors);
    return valid;
  }, [validationRules, validateRule]);

  // Validate single field
  const validateField = useCallback(
    (fieldName: string): boolean => {
      const rules = validationRules[fieldName];
      if (!rules) return true;

      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });

      for (const rule of rules) {
        const errorMessage = validateRule(fieldName, rule);
        if (errorMessage) {
          setValidationErrors((prev) => ({
            ...prev,
            [fieldName]: errorMessage,
          }));
          return false;
        }
      }

      return true;
    },
    [validationRules, validateRule]
  );

  // Check if field has error
  const hasError = useCallback(
    (fieldName: string): boolean => {
      return !!validationErrors[fieldName];
    },
    [validationErrors]
  );

  // Get error message for field
  const getError = useCallback(
    (fieldName: string): string => {
      return validationErrors[fieldName] || "";
    },
    [validationErrors]
  );

  return {
    validationErrors,
    clearErrors,
    validateForm,
    validateField,
    hasError,
    getError,
  };
}




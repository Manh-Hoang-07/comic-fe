"use client";

import { useId, forwardRef } from "react";

interface Option {
  value: string | number;
  label: string;
}

interface FormFieldProps {
  // Common props
  label?: string;
  type?: string;
  name?: string;
  id?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helpText?: string;
  className?: string;
  labelClass?: string;
  inputClass?: string;
  autocomplete?: string;

  // Value/Change props (for controlled usage)
  value?: any;
  onChange?: (e: any) => void;
  onBlur?: (e: any) => void;

  // Text/Input specific
  maxlength?: number | string;
  min?: number | string;
  max?: number | string;
  step?: number | string;

  // Textarea specific
  rows?: number | string;

  // Select/Radio specific
  options?: Option[];
  multiple?: boolean;

  // Checkbox specific
  checkboxLabel?: React.ReactNode;
  noLabel?: boolean;
}

const FormField = forwardRef<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, FormFieldProps>(
  ({
    label,
    type = "text",
    name,
    id,
    placeholder,
    required = false,
    disabled = false,
    error,
    helpText,
    className = "",
    labelClass = "",
    inputClass = "",
    autocomplete,
    value,
    onChange,
    onBlur,
    maxlength,
    min,
    max,
    step,
    rows = 3,
    options = [],
    multiple = false,
    checkboxLabel,
    noLabel = false,
    ...rest
  }, ref) => {
    const generatedId = useId();
    const fieldId = id || name || generatedId;

    const baseInputClass = `w-full px-4 py-2 border rounded-xl transition-all duration-200 outline-none focus:ring-2 focus:ring-blue-500/20 ${error
      ? "border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-500/20"
      : "border-gray-300 focus:border-blue-500"
      } ${disabled ? "bg-gray-100 cursor-not-allowed opacity-60" : "bg-white"} ${inputClass}`;

    const renderInput = () => {
      // Common props for standard inputs
      const commonProps = {
        id: fieldId,
        name,
        placeholder,
        disabled,
        onBlur,
        autoComplete: autocomplete,
        ...rest,
      };

      const handleInputChange = (e: React.ChangeEvent<any>) => {
        onChange?.(e);
      };

      if (["text", "email", "password", "number", "tel", "date", "datetime-local"].includes(type)) {
        return (
          <input
            {...commonProps}
            ref={ref as any}
            type={type}
            {...(value !== undefined ? { value: value ?? "" } : {})}
            onChange={handleInputChange}
            maxLength={typeof maxlength === "number" ? maxlength : undefined}
            min={min}
            max={max}
            step={step}
            className={baseInputClass}
          />
        );
      }

      if (type === "textarea") {
        return (
          <textarea
            {...commonProps}
            ref={ref as any}
            {...(value !== undefined ? { value: value ?? "" } : {})}
            onChange={handleInputChange}
            maxLength={typeof maxlength === "number" ? maxlength : undefined}
            rows={typeof rows === "number" ? rows : parseInt(String(rows))}
            className={baseInputClass}
          />
        );
      }

      if (type === "select") {
        return (
          <select
            {...commonProps}
            ref={ref as any}
            {...(value !== undefined ? { value: value ?? (multiple ? [] : "") } : {})}
            onChange={handleInputChange}
            multiple={multiple}
            className={`${baseInputClass} ${multiple ? "min-h-[120px]" : ""}`}
          >
            {!multiple && placeholder && <option value="">{placeholder}</option>}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      }

      if (type === "checkbox") {
        return (
          <div className="flex items-center group cursor-pointer">
            <input
              {...commonProps}
              ref={ref as any}
              type="checkbox"
              checked={Boolean(value)}
              onChange={handleInputChange}
              className="h-5 w-5 text-blue-600 border-gray-300 rounded-lg transition-all focus:ring-blue-500 cursor-pointer"
            />
            <label htmlFor={fieldId} className="ml-3 block text-sm text-gray-700 cursor-pointer group-hover:text-gray-900 transition-colors">
              {checkboxLabel || label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
          </div>
        );
      }

      if (type === "radio") {
        return (
          <div className="space-y-3">
            {options.map((option) => (
              <div key={option.value} className="flex items-center group cursor-pointer">
                <input
                  {...commonProps}
                  id={`${fieldId}-${option.value}`}
                  type="radio"
                  value={option.value}
                  {...(value !== undefined ? { checked: value === option.value } : {})}
                  onChange={handleInputChange}
                  className="h-5 w-5 text-blue-600 border-gray-300 transition-all focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor={`${fieldId}-${option.value}`} className="ml-3 block text-sm text-gray-700 cursor-pointer group-hover:text-gray-900 transition-colors">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        );
      }

      return null;
    };

    return (
      <div className={`form-field w-full ${className}`}>
        {label && type !== "checkbox" && !noLabel && (
          <label htmlFor={fieldId} className={`block text-sm font-semibold mb-1.5 text-gray-700 ${labelClass}`}>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {renderInput()}

        {helpText && !error && (
          <p className="mt-1.5 text-xs text-gray-500 flex items-center">
            <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {helpText}
          </p>
        )}

        {error && (
          <p className="mt-1.5 text-sm text-red-500 flex items-center animate-in fade-in slide-in-from-top-1">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormField.displayName = "FormField";

export default FormField;



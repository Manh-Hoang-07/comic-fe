"use client";

import { useState, useEffect, useCallback, forwardRef, useRef } from "react";
import api from "@/lib/api/client";

interface Option {
  value: string | number;
  label: string;
}

interface SingleSelectEnhancedProps {
  value?: string | number | null;
  searchApi?: string;
  labelField?: string;
  valueField?: string;
  label?: string;
  placeholder?: string;
  error?: string;
  helpText?: string;
  disabled?: boolean;
  required?: boolean | string;
  options?: Option[];
  loading?: boolean;
  onChange?: (value: string | number | null) => void;
  onSelectOption?: (option: Option | null) => void;
  name?: string;
  onBlur?: React.FocusEventHandler<HTMLSelectElement>;
}

const SingleSelectEnhanced = forwardRef<HTMLSelectElement, SingleSelectEnhancedProps>(
  ({
    value,
    searchApi,
    labelField = "label",
    valueField = "value",
    label,
    placeholder = "-- Chọn --",
    error,
    helpText,
    disabled = false,
    required,
    options = [],
    loading: externalLoading,
    onChange,
    onSelectOption,
    name,
    onBlur,
  }, ref) => {
    const [localOptions, setLocalOptions] = useState<Option[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const finalOptions = options.length > 0 ? options : localOptions;
    const loading = externalLoading || isLoading;

    const lastFetchedUrl = useRef<string | null>(null);

    const fetchOptions = useCallback(async () => {
      if (!searchApi || searchApi === lastFetchedUrl.current) return;

      lastFetchedUrl.current = searchApi;
      setIsLoading(true);
      try {
        const response = await api.get(searchApi);
        let data: Record<string, unknown>[] = [];

        // Hỗ trợ nhiều format response
        if (response.data?.success && response.data?.data) {
          // Format: { success: true, data: [...] }
          data = Array.isArray(response.data.data)
            ? response.data.data
            : (response.data.data.data || []);
        } else if (response.data?.data) {
          // Format: { data: [...] } hoặc { data: { data: [...], meta: {...} } }
          data = Array.isArray(response.data.data)
            ? response.data.data
            : (response.data.data.data || []);
        } else if (Array.isArray(response.data)) {
          // Format: [...]
          data = response.data;
        }

        setLocalOptions(
          data.map((item) => ({
            value: item[valueField] as string | number,
            label: String(item[labelField] ?? item[valueField] ?? ""),
          }))
        );
      } catch (error) {
        lastFetchedUrl.current = null; // Cho phép thử lại nếu lỗi
        setLocalOptions([]);
      } finally {
        setIsLoading(false);
      }
    }, [searchApi, valueField, labelField]);

    // Xóa dữ liệu cũ khi URL thay đổi
    useEffect(() => {
      if (searchApi) {
        setLocalOptions([]);
        // Không xóa lastFetchedUrl ở đây để useEffect bên dưới không gọi lại ngay lập tức nếu dữ liệu đã đang load
      }
    }, [searchApi]);

    useEffect(() => {
      if (searchApi && options.length === 0 && localOptions.length === 0 && !isLoading) {
        // Chỉ reset ref nếu URL hiện tại khác với URL đã fetch thành công trước đó
        if (lastFetchedUrl.current !== searchApi) {
           lastFetchedUrl.current = null;
        }
        fetchOptions();
      }
    }, [searchApi, options.length, localOptions.length, isLoading, fetchOptions]);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const rawValue = e.target.value;
      if (!rawValue || rawValue === "") {
        onChange?.(null);
        onSelectOption?.(null);
      } else {
        const selectedOption = finalOptions.find(
          (opt) => String(opt.value) === String(rawValue)
        );
        if (selectedOption) {
          onChange?.(selectedOption.value);
          onSelectOption?.(selectedOption);
        } else {
          const numValue = Number(rawValue);
          const finalVal = isNaN(numValue) ? rawValue : numValue;
          onChange?.(finalVal);
          onSelectOption?.({ value: finalVal, label: rawValue }); // Fallback
        }
      }
    };

    return (
      <div className="single-select-enhanced w-full">
        {label && (
          <label className="block text-sm font-semibold text-gray-700 mb-1.5 focus-within:text-blue-600 transition-colors">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative group">
          <select
            ref={ref}
            name={name}
            onBlur={onBlur}
            value={value || ""}
            onChange={handleChange}
            disabled={disabled || loading}
            className={`w-full px-4 py-2.5 border rounded-xl shadow-sm transition-all duration-200 appearance-none cursor-pointer outline-none ${error
              ? "border-red-500 bg-red-50 focus:ring-2 focus:ring-red-200"
              : "border-gray-300 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-sm"
              } ${disabled ? "bg-gray-100 cursor-not-allowed opacity-60" : "bg-white"}`}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {finalOptions.map((option, index) => (
              <option key={index} value={String(option.value)}>
                {option.label}
              </option>
            ))}
          </select>

          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400 group-hover:text-blue-500 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {loading && (
            <div className="absolute inset-y-0 right-9 flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
            </div>
          )}
        </div>

        {error && (
          <p className="mt-1.5 text-sm text-red-500 flex items-center animate-in fade-in slide-in-from-top-1">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </p>
        )}

        {helpText && !error && (
          <p className="mt-1.5 text-xs text-gray-500 flex items-center">
            <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {helpText}
          </p>
        )}
      </div>
    );
  }
);

SingleSelectEnhanced.displayName = "SingleSelectEnhanced";

export default SingleSelectEnhanced;

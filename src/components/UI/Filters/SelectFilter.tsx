"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import api from "@/lib/api/client";

interface Option {
  value: string | number;
  label: string;
}

interface SelectFilterProps {
  value?: string | number;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  options?: Option[];
  apiEndpoint?: string;
  apiParams?: Record<string, any>;
  valueField?: string;
  labelField?: string;
  onChange?: (value: string | number) => void;
}

export default function SelectFilter({
  value = "",
  label,
  placeholder = "Chọn...",
  disabled = false,
  error,
  options,
  apiEndpoint,
  apiParams,
  valueField = "id",
  labelField = "name",
  onChange,
}: SelectFilterProps) {
  const [loading, setLoading] = useState(false);
  const [normalizedOptions, setNormalizedOptions] = useState<Option[]>([]);

  const normalize = useCallback((items: any[]): Option[] => {
    return (items || []).map((i) => ({
      value: i?.value ?? i?.[valueField],
      label: i?.label ?? i?.[labelField] ?? String(i?.[valueField] ?? ""),
    }));
  }, [valueField, labelField]);

  const loadOptions = useCallback(async () => {
    if (!apiEndpoint) {
      setNormalizedOptions(normalize(options || []));
      return;
    }

    setLoading(true);
    try {
      const res = await api.get(apiEndpoint, { params: apiParams });
      setNormalizedOptions(normalize(res.data?.data || []));
    } catch (e) {
      setNormalizedOptions([]);
    } finally {
      setLoading(false);
    }
  }, [apiEndpoint, apiParams, options, normalize]);

  const apiParamsStr = useMemo(() => JSON.stringify(apiParams), [apiParams]);
  const optionsStr = useMemo(() => JSON.stringify(options), [options]);

  useEffect(() => {
    loadOptions();
  }, [loadOptions, apiParamsStr, optionsStr]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    const casted = val === "" ? "" : isNaN(Number(val)) ? val : Number(val);
    onChange?.(casted as string | number);
  };

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium mb-1">{label}</label>
      )}
      <select
        value={value}
        onChange={handleChange}
        disabled={disabled || loading}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? "border-red-500" : "border-gray-300"
          }`}
      >
        <option value="">{placeholder}</option>
        {normalizedOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}




"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { debounce } from "@/utils/debounce";

interface TextFilterProps {
  value?: string;
  label?: string;
  placeholder?: string;
  debounceMs?: number;
  onChange?: (value: string) => void;
}

export default function TextFilter({
  value = "",
  label,
  placeholder = "Nhập từ khóa...",
  debounceMs = 300,
  onChange,
}: TextFilterProps) {
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    if (value !== internalValue) {
      setInternalValue(value);
    }
  }, [value, internalValue]);

  const debouncedEmit = useMemo(
    () =>
      debounce((val: string) => {
        onChange?.(val);
      }, debounceMs),
    [onChange, debounceMs]
  );

  const handleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    debouncedEmit(newValue);
  }, [debouncedEmit]);

  const handleBlur = useCallback(() => {
    if (debouncedEmit.flush) {
      debouncedEmit.flush();
    }
    onChange?.(internalValue);
  }, [debouncedEmit, onChange, internalValue]);

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium mb-1">{label}</label>
      )}
      <input
        type="text"
        value={internalValue}
        placeholder={placeholder}
        onChange={handleInput}
        onBlur={handleBlur}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}




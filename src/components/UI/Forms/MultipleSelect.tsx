"use client";

import { useState, useEffect, useRef } from "react";

interface Option {
  value: string | number;
  label: string;
}

interface MultipleSelectProps {
  value?: Array<string | number>;
  options?: Option[];
  label?: string;
  placeholder?: string;
  error?: string;
  onChange?: (value: Array<string | number>) => void;
}

export default function MultipleSelect({
  value = [],
  options = [],
  label,
  placeholder = "Chọn...",
  error,
  onChange,
}: MultipleSelectProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isValueEqual = (a: any, b: any): boolean => {
    return String(a) === String(b);
  };

  const isSelected = (val: string | number): boolean => {
    return value.some((item) => isValueEqual(item, val));
  };

  const selectedItems = value
    .map((val) => {
      const option = options.find((opt) => isValueEqual(opt.value, val));
      return {
        value: val,
        label: option ? option.label : String(val),
      };
    })
    .filter(Boolean);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const toggleItem = (val: string | number) => {
    const newValue = [...value];
    const index = newValue.findIndex((item) => isValueEqual(item, val));

    if (index > -1) {
      newValue.splice(index, 1);
    } else {
      newValue.push(val);
    }

    onChange?.(newValue);
  };

  const removeItem = (val: string | number) => {
    const newValue = value.filter((item) => !isValueEqual(item, val));
    onChange?.(newValue);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <div ref={containerRef} className="relative">
      {label && <label className="block text-sm font-medium mb-1">{label}</label>}
      <div
        onClick={toggleDropdown}
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer bg-white ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      >
        <div className="flex flex-wrap gap-1">
          {value.length === 0 ? (
            <span className="text-gray-500">{placeholder}</span>
          ) : (
            selectedItems.map((item) => (
              <span
                key={String(item.value)}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-indigo-100 text-indigo-800"
              >
                {item.label}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeItem(item.value);
                  }}
                  className="ml-1 text-indigo-600 hover:text-indigo-800"
                >
                  ×
                </button>
              </span>
            ))
          )}
        </div>
      </div>

      {showDropdown && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {options.map((option) => (
            <div
              key={String(option.value)}
              onClick={() => toggleItem(option.value)}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
            >
              <input
                type="checkbox"
                checked={isSelected(option.value)}
                className="mr-2 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                readOnly
              />
              {option.label}
            </div>
          ))}
        </div>
      )}

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}




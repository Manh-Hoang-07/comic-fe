"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import api from "@/lib/api/client";

interface Option {
  value: string | number;
  label: string;
}

interface MultiSelectFilterProps {
  value?: Array<string | number>;
  label?: string;
  placeholder?: string;
  options?: Option[];
  apiEndpoint?: string;
  apiParams?: Record<string, any>;
  valueField?: string;
  labelField?: string;
  onChange?: (value: Array<string | number>) => void;
}

export default function MultiSelectFilter({
  value = [],
  label,
  placeholder = "Chọn...",
  options = [],
  apiEndpoint,
  apiParams = {},
  valueField = "id",
  labelField = "name",
  onChange,
}: MultiSelectFilterProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [storeOptions, setStoreOptions] = useState<Option[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const normalize = useCallback((items: any[]): Option[] => {
    return (items || []).map((i) => ({
      value: i?.value ?? i?.[valueField],
      label: i?.label ?? i?.[labelField] ?? String(i?.[valueField] ?? ""),
    }));
  }, [valueField, labelField]);

  const loadOptions = useCallback(async () => {
    if (!apiEndpoint) {
      setStoreOptions(normalize(options));
      return;
    }
    setLoading(true);
    try {
      const res = await api.get(apiEndpoint, { params: apiParams });
      setStoreOptions(normalize(res.data?.data || []));
    } catch (e) {
      setStoreOptions([]);
    } finally {
      setLoading(false);
    }
  }, [apiEndpoint, apiParams, options, normalize]);

  const apiParamsStr = useMemo(() => JSON.stringify(apiParams), [apiParams]);
  const optionsStr = useMemo(() => JSON.stringify(options), [options]);

  useEffect(() => {
    loadOptions();
  }, [loadOptions, apiParamsStr, optionsStr]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [open]);

  const selectedValues = value || [];
  const selectedItems = selectedValues
    .map((v) => storeOptions.find((o) => o.value === v))
    .filter(Boolean) as Option[];

  const filteredOptions = storeOptions.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (v: string | number) => {
    const next = selectedValues.includes(v)
      ? selectedValues.filter((x) => x !== v)
      : [...selectedValues, v];
    onChange?.(next);
  };

  return (
    <div ref={containerRef} className="relative">
      {label && <label className="block text-sm font-medium mb-1">{label}</label>}
      <div
        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white cursor-pointer min-h-[38px] flex flex-wrap gap-1"
        onClick={() => setOpen(!open)}
      >
        {selectedValues.length === 0 ? (
          <span className="text-gray-500">{placeholder}</span>
        ) : (
          selectedItems.map((opt) => (
            <span
              key={opt.value}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
            >
              {opt.label}
              <button
                className="ml-1"
                onClick={(e) => {
                  e.stopPropagation();
                  toggle(opt.value);
                }}
              >
                ×
              </button>
            </span>
          ))
        )}
      </div>
      {open && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          <div className="p-2 sticky top-0 bg-white border-b">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          {loading ? (
            <div className="px-3 py-2 text-gray-500">Đang tải...</div>
          ) : filteredOptions.length === 0 ? (
            <div className="px-3 py-2 text-gray-500">Không có dữ liệu</div>
          ) : (
            filteredOptions.map((opt) => (
              <div
                key={opt.value}
                onClick={() => toggle(opt.value)}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
              >
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={selectedValues.includes(opt.value)}
                  readOnly
                />
                {opt.label}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}




"use client";

import { useState, useEffect, useRef, ReactNode } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import TextFilter from "@/components/UI/Filters/TextFilter";

interface SortOption {
  value: string;
  label: string;
}

interface AdminFilterProps {
  initialFilters?: Record<string, any>;
  sortOptions?: SortOption[];
  sortField?: string;
  searchField?: string;
  searchPlaceholder?: string;
  showSearch?: boolean;
  hasAdvancedFilters?: boolean;
  hasSortOptions?: boolean;
  resetFunction?: () => void;
  children?: ReactNode;
  onUpdateFilters?: (filters: Record<string, any>) => void;
  onFilterChange?: () => void;
  advancedFilters?: (props: {
    filters: Record<string, any>;
    onChange: () => void;
  }) => ReactNode;
}

export default function AdminFilter({
  initialFilters = {},
  sortOptions = [],
  sortField = "sort",
  searchField = "search",
  searchPlaceholder = "Tìm kiếm...",
  showSearch = true,
  hasAdvancedFilters = false,
  hasSortOptions = true,
  resetFunction,
  children,
  onUpdateFilters,
  onFilterChange,
  advancedFilters,
}: AdminFilterProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [localFilters, setLocalFilters] = useState<Record<string, any>>({
    [searchField]: "",
    [sortField]: "",
    ...initialFilters,
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const advancedRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const query: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      query[key] = value;
    });

    setLocalFilters((prev) => ({
      ...prev,
      ...query,
    }));
  }, [searchParams]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (advancedRef.current && !advancedRef.current.contains(event.target as Node)) {
        setShowAdvancedFilters(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setShowSortOptions(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleFilterChange = () => {
    onFilterChange?.();
  };

  const selectSortOption = (value: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      [sortField]: value,
    }));
    setShowSortOptions(false);
    handleFilterChange();
  };

  const applyFilters = () => {
    const cleanFilters: Record<string, any> = {};
    Object.keys(localFilters).forEach((key) => {
      const value = localFilters[key];
      if (value !== "" && value !== null && value !== undefined) {
        cleanFilters[key] = value;
      }
    });

    onUpdateFilters?.(cleanFilters);
  };

  const resetFilters = () => {
    if (resetFunction) {
      resetFunction();
    } else {
      setLocalFilters({
        [searchField]: "",
        [sortField]: "",
      });
      applyFilters();
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <div className="flex flex-wrap items-center gap-4">
        {hasAdvancedFilters && (
          <div className="relative" ref={advancedRef}>
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="p-2 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              title="Bộ lọc nâng cao"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
            </button>

            {showAdvancedFilters && (
              <div className="absolute left-0 mt-2 w-80 bg-white border border-gray-300 rounded-md shadow-lg z-10 p-4">
                <div className="space-y-4">
                  {advancedFilters?.({ filters: localFilters, onChange: handleFilterChange })}
                </div>
              </div>
            )}
          </div>
        )}

        {hasSortOptions && sortOptions.length > 0 && (
          <div className="relative" ref={sortRef}>
            <button
              onClick={() => setShowSortOptions(!showSortOptions)}
              className="p-2 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              title="Sắp xếp"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                />
              </svg>
            </button>

            {showSortOptions && (
              <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10 p-2">
                <div className="space-y-1">
                  {sortOptions.map((option) => (
                    <div
                      key={option.value}
                      onClick={() => selectSortOption(option.value)}
                      className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 rounded ${
                        localFilters[sortField] === option.value ? "bg-gray-100" : ""
                      }`}
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {children}

        {showSearch && (
          <div className="flex-1 min-w-[200px]">
            <TextFilter
              value={localFilters[searchField] || ""}
              placeholder={searchPlaceholder}
              onChange={(value) => {
                setLocalFilters((prev) => ({
                  ...prev,
                  [searchField]: value,
                }));
                handleFilterChange();
              }}
            />
          </div>
        )}

        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={resetFilters}
            className="p-2 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            title="Đặt lại"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>

          <button
            onClick={applyFilters}
            className="p-2 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
            title="Áp dụng bộ lọc"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}




"use client";

import { ReactNode } from "react";

interface FilterBaseProps {
  label?: string;
  children: ReactNode;
  onClear?: () => void;
  className?: string;
}

export default function FilterBase({
  label,
  children,
  onClear,
  className = "",
}: FilterBaseProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {(label || onClear) && (
        <div className="flex items-center justify-between">
          {label && (
            <label className="block text-sm font-medium text-gray-700">
              {label}
            </label>
          )}
          {onClear && (
            <button
              type="button"
              onClick={onClear}
              className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}

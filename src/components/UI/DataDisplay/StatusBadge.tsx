"use client";

interface StatusBadgeProps {
  status: string;
  label?: string;
  className?: string;
}

export default function StatusBadge({ status, label, className = "" }: StatusBadgeProps) {
  const displayLabel = label || status || "Không xác định";

  return (
    <span
      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 ${className}`}
    >
      {displayLabel}
    </span>
  );
}



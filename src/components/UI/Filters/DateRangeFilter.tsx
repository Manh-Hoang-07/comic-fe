"use client";

interface DateRange {
  start: string;
  end: string;
}

interface DateRangeFilterProps {
  value?: DateRange;
  label?: string;
  startLabel?: string;
  endLabel?: string;
  onChange?: (value: DateRange) => void;
}

export default function DateRangeFilter({
  value = { start: "", end: "" },
  label,
  startLabel = "Từ ngày",
  endLabel = "Đến ngày",
  onChange,
}: DateRangeFilterProps) {
  const start = value?.start || "";
  const end = value?.end || "";

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.({ start: e.target.value, end });
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.({ start, end: e.target.value });
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      <div>
        {label && (
          <label className="block text-sm font-medium mb-1">
            {startLabel || label}
          </label>
        )}
        <input
          type="date"
          value={start}
          onChange={handleStartChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        {label && (
          <label className="block text-sm font-medium mb-1">
            {endLabel || label}
          </label>
        )}
        <input
          type="date"
          value={end}
          onChange={handleEndChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}




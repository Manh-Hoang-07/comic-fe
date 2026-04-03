"use client";

interface SkeletonLoaderProps {
  type?: "table" | "card" | "form" | "list" | "default";
  rows?: number;
  columns?: number;
  fields?: number;
  items?: number;
}

export default function SkeletonLoader({
  type = "default",
  rows = 5,
  columns = 4,
  fields = 5,
  items = 3,
}: SkeletonLoaderProps) {
  if (type === "table") {
    return (
      <div className="animate-pulse bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-8 bg-gray-200 rounded w-24"></div>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="px-6 py-4">
              <div className="flex items-center space-x-4">
                {Array.from({ length: columns }).map((_, j) => (
                  <div key={j} className="flex-1">
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "card") {
    return (
      <div className="animate-pulse bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          <div className="h-3 bg-gray-200 rounded w-4/6"></div>
        </div>
      </div>
    );
  }

  if (type === "form") {
    return (
      <div className="animate-pulse space-y-6">
        {Array.from({ length: fields }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        ))}
        <div className="flex justify-end space-x-3 pt-4">
          <div className="h-10 bg-gray-200 rounded w-20"></div>
          <div className="h-10 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    );
  }

  if (type === "list") {
    return (
      <div className="animate-pulse space-y-3">
        {Array.from({ length: items }).map((_, i) => (
          <div key={i} className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow">
            <div className="w-10 h-10 bg-gray-200 rounded"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="w-20 h-8 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="h-4 bg-gray-200 rounded"></div>
      ))}
    </div>
  );
}




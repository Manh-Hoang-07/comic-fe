"use client";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  text?: string;
  showText?: boolean;
  fullScreen?: boolean;
}

export default function LoadingSpinner({
  size = "md",
  text = "Đang tải...",
  showText = true,
  fullScreen = false,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  const containerClass = fullScreen
    ? "absolute inset-0 bg-white bg-opacity-75 z-50 min-h-screen"
    : "py-8";

  return (
    <div className={`flex items-center justify-center ${containerClass}`}>
      <div className="relative">
        {/* Spinner */}
        <div
          className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-500 ${sizeClasses[size]}`}
        />

        {/* Loading text */}
        {showText && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">{text}</p>
          </div>
        )}
      </div>
    </div>
  );
}




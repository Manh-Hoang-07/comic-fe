"use client";

export default function BannerSkeleton() {
  return (
    <div className="relative w-full overflow-hidden">
      <div className="relative h-[500px] md:h-[600px]">
        <div className="absolute inset-0 transition-opacity duration-500 bg-gray-200 animate-pulse" />

        {/* Navigation dots skeleton */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-gray-300 animate-pulse" />
          <div className="w-3 h-3 rounded-full bg-gray-300 animate-pulse" />
          <div className="w-3 h-3 rounded-full bg-gray-300 animate-pulse" />
        </div>

        {/* Navigation arrows skeleton */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
          <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse" />
        </div>
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
          <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse" />
        </div>
      </div>
    </div>
  );
}




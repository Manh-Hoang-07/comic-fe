"use client";

export default function PostCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse cursor-pointer">
      {/* Post Image Skeleton */}
      <div className="relative w-full h-48 overflow-hidden">
        <div className="w-full h-full bg-gray-200" />
      </div>

      {/* Post Content Skeleton */}
      <div className="p-5">
        {/* Category Badge Skeleton */}
        <div className="mb-2">
          <div className="h-5 bg-gray-200 rounded-full w-20" />
        </div>

        {/* Post Title Skeleton */}
        <div className="mb-2">
          <div className="h-6 bg-gray-200 rounded mb-1" />
          <div className="h-6 bg-gray-200 rounded w-3/4" />
        </div>

        {/* Post Excerpt Skeleton */}
        <div className="mb-4">
          <div className="h-4 bg-gray-200 rounded mb-1" />
          <div className="h-4 bg-gray-200 rounded mb-1" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
        </div>

        {/* Post Meta Skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-4 bg-gray-200 rounded w-24" />
          <div className="h-4 bg-gray-200 rounded w-16" />
        </div>
      </div>
    </div>
  );
}




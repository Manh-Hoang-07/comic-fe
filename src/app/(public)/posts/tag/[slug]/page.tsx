"use client";

import { useParams } from "next/navigation";

export default function PostTagDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Tag: {slug}</h1>
        <p className="text-gray-600">Posts by tag component needed</p>
      </div>
    </div>
  );
}


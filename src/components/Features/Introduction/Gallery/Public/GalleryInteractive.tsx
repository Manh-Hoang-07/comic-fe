"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/UI/Navigation/Button";
import { useGalleryFilter, GalleryItem } from "@/hooks/ui-ux/public/useGalleryFilter";

interface GalleryInteractiveProps {
  initialItems: GalleryItem[];
}

export default function GalleryInteractive({ initialItems }: GalleryInteractiveProps) {
  const { filteredItems, search, setSearch, viewMode, setViewMode } =
    useGalleryFilter(initialItems);

  return (
    <>
      {/* Filters and View Mode */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1 max-w-md">
            <input
              id="search"
              name="search"
              type="text"
              placeholder="Tìm kiếm dự án..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 font-medium">Xem:</span>
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden p-1 gap-1 bg-gray-50">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded transition-colors ${
                  viewMode === "grid"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-400 hover:text-gray-700"
                }`}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded transition-colors ${
                  viewMode === "list"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-400 hover:text-gray-700"
                }`}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Items */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 py-20 text-center">
          <p className="text-xl font-medium text-gray-900">Không tìm thấy dự án nào.</p>
          <p className="text-gray-500 mt-2">Thử thay đổi từ khóa tìm kiếm.</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredItems.map((item) => (
            <div
              key={item.id || Math.random()}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow duration-300"
            >
              <div className="h-56 bg-gray-100 relative overflow-hidden">
                {item.cover_image ? (
                  <Image
                    src={item.cover_image}
                    alt={item.title || "Project Image"}
                    width={500}
                    height={400}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-gray-100 text-gray-400">
                    <span className="text-4xl">🖼️</span>
                  </div>
                )}
                {item.featured && (
                  <div className="absolute top-3 right-3 bg-amber-500 text-white px-2.5 py-1 text-xs rounded-lg font-bold">
                    Nổi bật
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2 text-sm">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                    {item.category || "Dự án"}
                  </span>
                  <Link href={`/gallery/${item.slug || item.id}`} className="inline-block">
                    <Button size="sm">Xem chi tiết</Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4 mb-12">
          {filteredItems.map((item) => (
            <div
              key={item.id || Math.random()}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex group hover:shadow-md transition-shadow duration-300"
            >
              <div className="w-44 h-40 bg-gray-100 flex-shrink-0 relative overflow-hidden">
                {item.cover_image ? (
                  <Image
                    src={item.cover_image}
                    alt={item.title || "Project Image"}
                    width={200}
                    height={200}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-gray-100 text-gray-400">
                    <span className="text-4xl">🖼️</span>
                  </div>
                )}
                {item.featured && (
                  <div className="absolute top-2 right-2 bg-amber-500 text-white px-2 py-1 text-xs rounded font-bold">
                    Nổi bật
                  </div>
                )}
              </div>
              <div className="p-5 flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                  <span className="text-xs text-gray-400 ml-4 flex-shrink-0">{item.date}</span>
                </div>
                <p className="text-gray-600 mb-4 text-sm line-clamp-2">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                    {item.category || "Dự án"}
                  </span>
                  <Link href={`/gallery/${item.slug || item.id}`} className="inline-block">
                    <Button size="sm">Xem chi tiết</Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

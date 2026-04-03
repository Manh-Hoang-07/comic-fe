"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/UI/Navigation/Button";
import { Breadcrumbs } from "@/components/UI/Navigation/Breadcrumbs";
import api from "@/lib/api/client";
import { publicEndpoints } from "@/lib/api/endpoints";
import HeroBanner from "@/components/Features/Marketing/Banners/Public/HeroBanner";

interface GalleryItem {
    id: number;
    title: string;
    slug: string;
    description: string;
    cover_image: string;
    images: string[];
    featured: boolean;
    status: string;
    category?: string;
    date?: string;
}

export default function GalleryClient() {
    const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
    const [filteredItems, setFilteredItems] = useState<GalleryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: "",
    });
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    // Fetch gallery from API
    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const response = await api.get(publicEndpoints.gallery.list);
                if (response.data?.success) {
                    const galleryData = response.data.data || [];
                    setGalleryItems(galleryData);
                    setFilteredItems(galleryData);
                }
            } catch (error) {
                console.error("Error fetching gallery:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchGallery();
    }, []);

    // Apply filters
    useEffect(() => {
        let filtered = [...galleryItems];

        // Filter by search
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filtered = filtered.filter(item =>
                item.title.toLowerCase().includes(searchLower) ||
                item.description.toLowerCase().includes(searchLower)
            );
        }

        setFilteredItems(filtered);
    }, [galleryItems, filters]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#f8f9fa] pb-20 transition-colors duration-300">
                <div className="container mx-auto px-4 mt-8">
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <p className="ml-3 text-gray-600 font-medium">Đang tải thư viện...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8f9fa] pb-20 transition-colors duration-300">
            <HeroBanner locationCode="gallery" imageOnly={true} />

            <div className="container mx-auto px-4 mt-8 relative z-10">
                <Breadcrumbs items={[{ label: "Thư viện" }]} />
                <h1 className="text-4xl font-extrabold text-gray-900 mb-10 border-l-8 border-primary pl-6">Thư viện dự án</h1>
                {/* Filters and View Mode */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1 max-w-md">
                            <input
                                id="search"
                                name="search"
                                type="text"
                                placeholder="Tìm kiếm dự án..."
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500 font-medium">Xem:</span>
                            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden p-1 gap-1 bg-gray-50">
                                <button
                                    onClick={() => setViewMode("grid")}
                                    className={`p-2 rounded transition-colors ${viewMode === "grid" ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-700"}`}
                                >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setViewMode("list")}
                                    className={`p-2 rounded transition-colors ${viewMode === "list" ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-700"}`}
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
                            <div key={item.id || Math.random()} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow duration-300">
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
                                        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{item.category || "Dự án"}</span>
                                        <Link href={`/gallery/${item.slug || item.id}`} className="inline-block">
                                            <Button size="sm">
                                                Xem chi tiết
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4 mb-12">
                        {filteredItems.map((item) => (
                            <div key={item.id || Math.random()} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex group hover:shadow-md transition-shadow duration-300">
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
                                        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{item.category || "Dự án"}</span>
                                        <Link href={`/gallery/${item.slug || item.id}`} className="inline-block">
                                            <Button size="sm">
                                                Xem chi tiết
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* CTA Section */}
                <div className="bg-white rounded-2xl p-10 text-center border border-gray-100 shadow-sm">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Cần dự án tương tự?</h2>
                    <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                        Chúng tôi chuyên tạo các giải pháp tùy chỉnh theo nhu cầu cụ thể của bạn.
                        Liên hệ với chúng tôi để thảo luận về dự án tiếp theo của bạn.
                    </p>
                    <Button size="lg">
                        Bắt đầu dự án mới
                    </Button>
                </div>
            </div>
        </div>
    );
}

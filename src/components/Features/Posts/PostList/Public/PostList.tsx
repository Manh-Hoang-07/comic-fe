"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Pagination from "@/components/UI/DataDisplay/Pagination";
import { ContentWrapper } from "@/components/UI/Loading/ContentWrapper";

interface PostCategory {
    id: string;
    name: string;
    slug: string;
}

interface PostTag {
    id: string;
    name: string;
}

interface Post {
    id: string;
    name: string;
    excerpt: string;
    slug: string;
    image: string;
    cover_image: string;
    view_count: string;
    primary_category: PostCategory;
    tags: PostTag[];
    featured?: boolean;
    created_at?: string;
}

interface Meta {
    page: number;
    totalPages: number;
    totalItems: number;
    limit: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

interface PostListProps {
    initialPosts: Post[];
    categories: PostCategory[];
    meta?: Meta;
}

export function PostList({ initialPosts, categories, meta }: PostListProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Local state for search input to allow typing without immediate URL update
    const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");

    const category = searchParams.get("category") || "";
    const sort = searchParams.get("sort") || "newest";

    // Update local search term when URL changes (e.g. back button)
    useEffect(() => {
        setSearchTerm(searchParams.get("search") || "");
    }, [searchParams]);

    const updateFilter = useCallback((key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value && value !== "") {
            params.set(key, value);
        } else {
            params.delete(key);
        }

        // Reset page to 1 on filter change
        if (key !== "page") {
            params.delete("page");
        }

        router.push(`?${params.toString()}`);
    }, [router, searchParams]);

    // Debounce search update to URL
    useEffect(() => {
        const timer = setTimeout(() => {
            const currentSearch = searchParams.get("search") || "";
            if (searchTerm !== currentSearch) {
                updateFilter("search", searchTerm);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm, searchParams, updateFilter]);

    return (
        <>
            {/* Header Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                {/* Search Input */}
                <div className="relative w-full md:w-96">
                    <input
                        type="text"
                        placeholder="Tìm kiếm bài viết..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm"
                    />
                    <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>

                {/* Category Select + Sort Tabs */}
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    {/* Category Select Dropdown */}
                    <div className="relative min-w-[200px]">
                        <select
                            value={category}
                            onChange={(e) => updateFilter("category", e.target.value)}
                            className="w-full appearance-none bg-white border border-gray-200 text-gray-700 py-2.5 px-4 pr-10 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer shadow-sm hover:border-primary"
                        >
                            <option value="">Tất cả thể loại</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.slug}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                            <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>

                    {/* Sort Buttons */}
                    <div className="flex bg-white rounded-xl p-1 border border-gray-100 shadow-sm">
                        <button
                            onClick={() => updateFilter("sort", "newest")}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${sort === "newest"
                                ? "bg-primary text-white shadow-md"
                                : "text-gray-600 hover:text-primary"
                                }`}
                        >
                            Mới cập nhật
                        </button>
                        <button
                            onClick={() => updateFilter("sort", "popular")}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${sort === "popular"
                                ? "bg-primary text-white shadow-md"
                                : "text-gray-600 hover:text-primary"
                                }`}
                        >
                            Xem nhiều
                        </button>
                    </div>
                </div>
            </div>

            <ContentWrapper>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {initialPosts.map((post) => (
                        <article
                            key={post.id}
                            className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col group h-full"
                        >
                            <div className="relative h-56 overflow-hidden">
                                <Link href={`/posts/${post.slug}`}>
                                    <Image
                                        src={post.image || post.cover_image}
                                        alt={post.name}
                                        width={400}
                                        height={224}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </Link>
                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider text-gray-800">
                                    {post.primary_category.name}
                                </div>
                            </div>

                            <div className="p-6 flex-1 flex flex-col">
                                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                                    <Link href={`/posts/${post.slug}`} className="hover:underline">{post.name}</Link>
                                </h3>

                                <p className="text-gray-600 mb-4 line-clamp-3 text-sm flex-1">
                                    {post.excerpt}
                                </p>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                                    <div className="flex items-center gap-3">
                                        <div className="flex flex-wrap gap-1">
                                            {post.tags?.slice(0, 2).map(tag => (
                                                <span key={tag.id} className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-500">#{tag.name}</span>
                                            ))}
                                        </div>
                                        <span className="flex items-center gap-1 text-[10px] text-gray-400">
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                            {post.view_count}
                                        </span>
                                    </div>

                                    <Link
                                        href={`/posts/${post.slug}`}
                                        className="text-primary hover:text-primary-dark hover:bg-primary/5 px-3 py-1.5 rounded text-sm font-medium transition-colors"
                                    >
                                        Đọc tiếp →
                                    </Link>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                {initialPosts.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                        <p className="text-xl font-medium text-gray-900">Không tìm thấy bài viết nào.</p>
                        {searchTerm && (
                            <Link href="/posts" className="text-primary font-bold hover:underline mt-2 inline-block">
                                Xem tất cả bài viết
                            </Link>
                        )}
                    </div>
                )}

                {meta && meta.totalPages > 1 && (
                    <Pagination
                        currentPage={meta.page}
                        totalPages={meta.totalPages}
                        hasNextPage={meta.hasNextPage}
                        hasPreviousPage={meta.hasPreviousPage}
                    />
                )}
            </ContentWrapper>
        </>
    );
}


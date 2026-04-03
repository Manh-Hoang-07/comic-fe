"use client";

import React, { useState, useTransition } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    hasNextPage,
    hasPreviousPage,
}) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const [loadingPage, setLoadingPage] = useState<number | null>(null);

    const createPageUrl = (pageNumber: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', pageNumber.toString());
        return `${pathname}?${params.toString()}`;
    };

    const handlePageChange = (page: number) => {
        setLoadingPage(page);
        startTransition(() => {
            router.push(createPageUrl(page));
        });
    };

    if (totalPages <= 1) return null;

    const renderPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        // Logic remains same, just update button states
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            const isLoading = isPending && loadingPage === i;
            pages.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    disabled={isPending}
                    className={`w-10 h-10 rounded-xl font-bold transition-all relative ${currentPage === i
                        ? 'bg-red-600 text-white shadow-lg shadow-red-200 scale-110'
                        : 'bg-white text-gray-600 hover:border-red-500 hover:text-red-500 border border-gray-100'
                        } ${isPending ? 'opacity-60 cursor-wait' : ''}`}
                >
                    {isLoading ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        i
                    )}
                </button>
            );
        }
        return pages;
    };

    return (
        <div className="flex justify-center items-center gap-2 mt-12 pb-8" data-pagination>
            <button
                disabled={!hasPreviousPage || isPending}
                onClick={() => handlePageChange(currentPage - 1)}
                className={`px-4 py-2 rounded-xl font-bold border transition-all relative ${hasPreviousPage && !isPending
                    ? 'bg-white text-gray-700 border-gray-100 hover:border-red-500 hover:text-red-500'
                    : 'bg-gray-50 text-gray-300 border-gray-50 cursor-not-allowed'
                    }`}
            >
                {isPending && loadingPage === currentPage - 1 ? (
                    <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                        Trước
                    </span>
                ) : (
                    'Trước'
                )}
            </button>

            <div className="flex items-center gap-2 mx-2">
                {renderPageNumbers()}
            </div>

            <button
                disabled={!hasNextPage || isPending}
                onClick={() => handlePageChange(currentPage + 1)}
                className={`px-4 py-2 rounded-xl font-bold border transition-all relative ${hasNextPage && !isPending
                    ? 'bg-white text-gray-700 border-gray-100 hover:border-red-500 hover:text-red-500'
                    : 'bg-gray-50 text-gray-300 border-gray-50 cursor-not-allowed'
                    }`}
            >
                {isPending && loadingPage === currentPage + 1 ? (
                    <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                        Sau
                    </span>
                ) : (
                    'Sau'
                )}
            </button>
        </div>
    );
};

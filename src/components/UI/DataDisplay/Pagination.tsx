"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/solid";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  loading?: boolean;
  /** Callback mode (admin). Khi không truyền, tự động dùng URL navigation (public). */
  onPageChange?: (page: number) => void;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  loading = false,
  onPageChange,
  hasNextPage,
  hasPreviousPage,
}: PaginationProps) {
  const [inputPage, setInputPage] = useState(currentPage);
  const [isPending, startTransition] = useTransition();
  const [loadingPage, setLoadingPage] = useState<number | null>(null);

  // URL navigation hooks - chỉ dùng khi không có onPageChange
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setInputPage(currentPage);
    setLoadingPage(null);
  }, [currentPage]);

  const isUrlMode = !onPageChange;
  const isLoading = loading || isPending;
  const showPagination = totalPages > 1 && !loading;

  const handlePageChange = (page: number | string) => {
    if (page === "..." || page === currentPage || isLoading) return;
    if (typeof page !== "number") return;

    if (isUrlMode) {
      setLoadingPage(page);
      startTransition(() => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", page.toString());
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      });
    } else {
      onPageChange(page);
    }
  };

  const jumpToPage = () => {
    let page = inputPage;
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;
    handlePageChange(page);
  };

  const canGoPrev = hasPreviousPage !== undefined ? hasPreviousPage : currentPage > 1;
  const canGoNext = hasNextPage !== undefined ? hasNextPage : currentPage < totalPages;

  const visiblePages = (): (number | string)[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }
    if (currentPage >= totalPages - 3) {
      return [
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }
    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  };

  if (!showPagination) return null;

  const renderButtonContent = (page: number, label: React.ReactNode) => {
    if (isUrlMode && isPending && loadingPage === page) {
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        </div>
      );
    }
    return label;
  };

  return (
    <nav
      className="mt-8 flex flex-wrap items-center justify-center gap-2 py-3 select-none"
      aria-label="Pagination"
      data-pagination
    >
      <button
        className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-indigo-100 text-gray-600 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!canGoPrev || isLoading}
        onClick={() => handlePageChange(1)}
        title="Trang đầu"
      >
        <ChevronDoubleLeftIcon className="w-4 h-4" />
      </button>
      <button
        className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-indigo-100 text-gray-600 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed relative"
        disabled={!canGoPrev || isLoading}
        onClick={() => handlePageChange(currentPage - 1)}
        title="Trang trước"
      >
        {renderButtonContent(currentPage - 1, <ChevronLeftIcon className="w-4 h-4" />)}
      </button>

      {visiblePages().map((page, index) => (
        <button
          key={`page-${index}-${page}`}
          className={`mx-0.5 px-3 py-1 rounded-lg font-semibold transition relative ${
            page === currentPage
              ? "bg-indigo-600 text-white shadow"
              : "bg-gray-100 hover:bg-indigo-100 text-gray-700"
          } ${isLoading ? "opacity-60 cursor-wait" : ""}`}
          disabled={isLoading || page === "..."}
          onClick={() => handlePageChange(page)}
        >
          {typeof page === "number"
            ? renderButtonContent(page, page)
            : page}
        </button>
      ))}

      <button
        className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-indigo-100 text-gray-600 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed relative"
        disabled={!canGoNext || isLoading}
        onClick={() => handlePageChange(currentPage + 1)}
        title="Trang sau"
      >
        {renderButtonContent(currentPage + 1, <ChevronRightIcon className="w-4 h-4" />)}
      </button>
      <button
        className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-indigo-100 text-gray-600 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!canGoNext || isLoading}
        onClick={() => handlePageChange(totalPages)}
        title="Trang cuối"
      >
        <ChevronDoubleRightIcon className="w-4 h-4" />
      </button>

      <div className="flex items-center gap-1 ml-4 text-sm text-gray-500">
        <span>Trang</span>
        <input
          type="number"
          min="1"
          max={totalPages}
          value={inputPage}
          onChange={(e) => setInputPage(Number(e.target.value))}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              jumpToPage();
            }
          }}
          className="w-12 px-2 py-1 border rounded focus:outline-none focus:ring focus:border-indigo-400 text-center"
          disabled={isLoading}
        />
        <span>/ {totalPages}</span>
      </div>
      {totalItems !== undefined && (
        <div className="ml-4 text-sm text-gray-500 hidden sm:block">
          Tổng: <span className="font-semibold text-indigo-600">{totalItems}</span>{" "}
          bản ghi
        </div>
      )}
    </nav>
  );
}

export { Pagination };

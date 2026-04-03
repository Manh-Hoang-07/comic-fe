"use client";

import { useState, useEffect } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/solid";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  loading?: boolean;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  loading = false,
  onPageChange,
}: PaginationProps) {
  const [inputPage, setInputPage] = useState(currentPage);

  useEffect(() => {
    setInputPage(currentPage);
  }, [currentPage]);

  const showPagination = totalPages > 1 && !loading;

  const handlePageChange = (page: number | string) => {
    if (page === "..." || page === currentPage || loading) return;
    if (typeof page === "number") {
      onPageChange(page);
    }
  };

  const jumpToPage = () => {
    let page = inputPage;
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;
    handlePageChange(page);
  };

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

  return (
    <nav
      className="mt-8 flex flex-wrap items-center justify-center gap-2 py-3 select-none"
      aria-label="Pagination"
    >
      <button
        className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-indigo-100 text-gray-600 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={currentPage === 1 || loading}
        onClick={() => handlePageChange(1)}
        title="Trang đầu"
      >
        <ChevronDoubleLeftIcon className="w-4 h-4" />
      </button>
      <button
        className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-indigo-100 text-gray-600 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={currentPage === 1 || loading}
        onClick={() => handlePageChange(currentPage - 1)}
        title="Trang trước"
      >
        <ChevronLeftIcon className="w-4 h-4" />
      </button>

      {visiblePages().map((page, index) => (
        <button
          key={`page-${index}-${page}`}
          className={`mx-0.5 px-3 py-1 rounded-lg font-semibold transition ${
            page === currentPage
              ? "bg-indigo-600 text-white shadow"
              : "bg-gray-100 hover:bg-indigo-100 text-gray-700"
          }`}
          disabled={loading || page === "..."}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </button>
      ))}

      <button
        className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-indigo-100 text-gray-600 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={currentPage === totalPages || loading}
        onClick={() => handlePageChange(currentPage + 1)}
        title="Trang sau"
      >
        <ChevronRightIcon className="w-4 h-4" />
      </button>
      <button
        className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-indigo-100 text-gray-600 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={currentPage === totalPages || loading}
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
          disabled={loading}
        />
        <span>/ {totalPages}</span>
      </div>
      <div className="ml-4 text-sm text-gray-500 hidden sm:block">
        Tổng: <span className="font-semibold text-indigo-600">{totalItems}</span>{" "}
        bản ghi
      </div>
    </nav>
  );
}




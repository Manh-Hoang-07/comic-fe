"use client";

import { useState, useMemo, useCallback } from "react";

export interface PaginationInit {
  current: number;
  perPage: number;
  total: number;
}

export interface PaginationResult {
  currentPage: number;
  perPage: number;
  total: number;
  setPage: (page: number) => void;
  setTotal: (val: number) => void;
  setPerPage: (size: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  firstPage: () => void;
  lastPage: () => void;
  canGoNext: boolean;
  canGoPrev: boolean;
  totalPages: number;
}

function calculatePaginationInfo(
  current: number,
  pageSize: number,
  total: number
): {
  totalPages: number;
  startItem: number;
  endItem: number;
  hasNext: boolean;
  hasPrev: boolean;
} {
  const totalPages = Math.ceil(total / pageSize);
  const startItem = (current - 1) * pageSize + 1;
  const endItem = Math.min(current * pageSize, total);
  const hasNext = current < totalPages;
  const hasPrev = current > 1;

  return {
    totalPages,
    startItem,
    endItem,
    hasNext,
    hasPrev,
  };
}

export default function usePagination(
  init: PaginationInit = { current: 1, perPage: 10, total: 0 }
): PaginationResult {
  const [currentPage, setCurrentPage] = useState(init.current);
  const [perPage, setPerPageState] = useState(init.perPage);
  const [total, setTotal] = useState(init.total);

  const paginationInfo = useMemo(
    () => calculatePaginationInfo(currentPage, perPage, total),
    [currentPage, perPage, total]
  );

  const setPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const setTotalState = useCallback((val: number) => {
    setTotal(val);
  }, []);

  const setPerPage = useCallback(
    (size: number) => {
      setPerPageState(size);
      setCurrentPage(1); // Reset to first page
    },
    []
  );

  const nextPage = useCallback(() => {
    if (paginationInfo.hasNext) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [paginationInfo.hasNext]);

  const prevPage = useCallback(() => {
    if (paginationInfo.hasPrev) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [paginationInfo.hasPrev]);

  const firstPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  const lastPage = useCallback(() => {
    setCurrentPage(paginationInfo.totalPages);
  }, [paginationInfo.totalPages]);

  return {
    currentPage,
    perPage,
    total,
    setPage,
    setTotal: setTotalState,
    setPerPage,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
    canGoNext: paginationInfo.hasNext,
    canGoPrev: paginationInfo.hasPrev,
    totalPages: paginationInfo.totalPages,
  };
}




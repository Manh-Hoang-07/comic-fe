"use client";

import { useMemo } from "react";

export interface Pagination {
  page?: number;
  current_page?: number;
  limit?: number;
  per_page?: number;
}

/**
 * Hook để tính toán số thứ tự cho bảng dữ liệu
 * @param pagination - Đối tượng phân trang chứa current_page/page và per_page/limit
 * @returns Function - Hàm tính số thứ tự dựa trên index
 */
export function useSerialNumber(pagination: Pagination) {
  /**
   * Tính số thứ tự dựa trên index trong mảng và thông tin phân trang
   * @param index - Index của item trong mảng hiện tại
   * @returns number - Số thứ tự tương ứng
   */
  const getSerialNumber = useMemo(
    () => (index: number): number => {
      // Đảm bảo index là số hợp lệ
      const idx = typeof index === "number" && !isNaN(index) ? index : 0;

      // Hỗ trợ cả page/limit và current_page/per_page
      const currentPage = Number(pagination.page || pagination.current_page || 1);
      const perPage = Number(pagination.limit || pagination.per_page || 10);

      // Đảm bảo tính toán nhất quán
      const page = Math.max(1, Math.floor(currentPage));
      const limit = Math.max(1, Math.floor(perPage));
      const idxNum = Math.max(0, Math.floor(idx));

      return (page - 1) * limit + idxNum + 1;
    },
    [pagination]
  );

  return {
    getSerialNumber,
  };
}




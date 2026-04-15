"use client";

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import apiClient from "@/lib/api/client";

/**
 * Hook thay thế useApiFetch với React Query
 * - Tự động cache response (30s staleTime)
 * - Deduplication: nhiều component gọi cùng API chỉ fetch 1 lần
 * - Background refetch khi data cũ
 * - Loading/error state tự động
 */
export function useApiQuery<T = any>(
  key: string | string[],
  url: string,
  params?: Record<string, any>,
  options?: Omit<UseQueryOptions<T>, "queryKey" | "queryFn">
) {
  const queryKey = Array.isArray(key) ? [...key, params] : [key, params];

  return useQuery<T>({
    queryKey,
    queryFn: async () => {
      const res = await apiClient.get<T>(url, { params });
      return res.data;
    },
    ...options,
  });
}

/**
 * Hook cho mutation (create, update, delete)
 * Tự động invalidate cache sau khi mutation thành công
 */
export function useApiMutation<TData = any, TVariables = any>(
  url: string,
  method: "post" | "put" | "patch" | "delete" = "post",
  invalidateKeys?: string[]
) {
  const queryClient = useQueryClient();

  return useMutation<TData, Error, TVariables>({
    mutationFn: async (variables) => {
      const res = await apiClient[method]<TData>(url, variables);
      return res.data;
    },
    onSuccess: () => {
      if (invalidateKeys) {
        invalidateKeys.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: [key] });
        });
      }
    },
  });
}

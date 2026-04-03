"use client";

import { useState, useEffect, useCallback } from "react";
import apiClient from "@/lib/api/client";

export interface ApiFetchOptions {
  immediate?: boolean;
  params?: Record<string, any>;
}

export interface ApiFetchResult<T = any> {
  data: T | null;
  loading: boolean;
  error: any;
  fetchData: () => Promise<void>;
}

/**
 * Hook để fetch dữ liệu từ API một cách đơn giản, không cache
 */
export default function useApiFetch<T = any>(
  url: string,
  params: Record<string, any> = {},
  immediate: boolean = true
): ApiFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const paramsString = JSON.stringify(params);

  const fetchData = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get<T>(url, { params });
      setData(res.data);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [url, params]);

  useEffect(() => {
    if (immediate) {
      fetchData();
    }
  }, [immediate, fetchData]);

  return { data, loading, error, fetchData };
}




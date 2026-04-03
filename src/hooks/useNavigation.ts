"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export interface NavigationResult {
  navigateTo: (path: string) => void;
  navigateToWithQuery: (path: string, query?: Record<string, any>) => void;
  updateQuery: (newQuery: Record<string, any>) => Promise<void>;
}

export function useNavigation(): NavigationResult {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const navigateTo = useCallback(
    (path: string) => {
      router.push(path);
    },
    [router]
  );

  const navigateToWithQuery = useCallback(
    (path: string, query: Record<string, any> = {}) => {
      const params = new URLSearchParams();
      Object.keys(query).forEach((key) => {
        if (query[key] !== undefined && query[key] !== null && query[key] !== "") {
          params.append(key, String(query[key]));
        }
      });
      const queryString = params.toString();
      router.push(`${path}${queryString ? `?${queryString}` : ""}`);
    },
    [router]
  );

  const updateQuery = useCallback(
    async (newQuery: Record<string, any> = {}) => {
      const currentParams = new URLSearchParams(searchParams.toString());

      // Merge current query with new query
      Object.keys(newQuery).forEach((key) => {
        const value = newQuery[key];
        if (value === undefined || value === null || value === "") {
          currentParams.delete(key);
        } else {
          currentParams.set(key, String(value));
        }
      });

      const queryString = currentParams.toString();
      router.replace(`${pathname}${queryString ? `?${queryString}` : ""}`);
    },
    [router, pathname, searchParams]
  );

  return {
    navigateTo,
    navigateToWithQuery,
    updateQuery,
  };
}




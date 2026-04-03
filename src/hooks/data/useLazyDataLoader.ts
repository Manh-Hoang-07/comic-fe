"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";

export interface LazyDataOptions {
  immediate?: boolean;
  threshold?: number;
  rootMargin?: string;
}

export function useLazyDataLoader<T>(
  fetcher: () => Promise<T>,
  options: LazyDataOptions = {}
) {
  const {
    immediate = false,
    threshold = 0.1,
    rootMargin = "0px",
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Create a target element for intersection observer
  const targetRef = useRef<HTMLElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Computed property to check if we should start loading
  const shouldLoad = useMemo(
    () => hasLoaded || loading,
    [hasLoaded, loading]
  );

  // Function to load data
  const loadData = useCallback(async () => {
    if (loading || hasLoaded) return;

    setLoading(true);
    setError(null);

    try {
      const result = await fetcher();
      setData(result);
      setHasLoaded(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [fetcher, loading, hasLoaded]);

  // Set up intersection observer
  const observeElement = useCallback(
    (element: HTMLElement) => {
      targetRef.current = element;

      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (
              entry.isIntersecting &&
              !hasLoaded &&
              !loading
            ) {
              loadData();
            }
          });
        },
        { threshold, rootMargin }
      );

      observerRef.current.observe(element);
    },
    [threshold, rootMargin, hasLoaded, loading, loadData]
  );

  const unobserve = useCallback(() => {
    if (observerRef.current && targetRef.current) {
      observerRef.current.unobserve(targetRef.current);
    }
  }, []);

  // Load immediately if immediate is true
  useEffect(() => {
    if (immediate) {
      loadData();
    }
  }, [immediate, loadData]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, []);

  return {
    data,
    loading,
    error,
    hasLoaded,
    target: targetRef,
    loadData,
    observeElement,
    unobserve,
  };
}




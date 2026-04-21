// Response normalization utilities
// Handles various API response formats from the backend:
//   - Axios wrapper:    response.data = actual JSON body
//   - Standard:         { success, data: T, message? }
//   - Paginated:        { success, data: { items: T[], meta: {...} } }
//   - Flat paginated:   { success, data: T[], meta: {...} }
//   - Nested:           { data: { data: T } }   (double-wrapped)
//   - Direct:           T  (no wrapper at all)

// ===== TYPES =====

export interface PaginationMeta {
  page: number;
  totalPages: number;
  limit: number;
  totalItems: number;
}

export interface PaginatedResult<T> {
  items: T[];
  meta: PaginationMeta;
}

export interface NormalizedListResult<T> {
  items: T[];
  meta: Record<string, unknown> | null;
}

// ===== INTERNAL HELPERS =====

/**
 * Safely convert a value to a finite number, or return undefined.
 */
function toNumber(val: unknown): number | undefined {
  if (val === null || val === undefined || val === "") return undefined;
  const n = typeof val === "number" ? val : parseInt(String(val), 10);
  return Number.isFinite(n) ? n : undefined;
}

/**
 * Check if a value is a plain object (not array, not null).
 */
function isPlainObject(val: unknown): val is Record<string, unknown> {
  return val !== null && typeof val === "object" && !Array.isArray(val);
}

// ===== PUBLIC API =====

/**
 * Normalize a single-object response.
 *
 * Handles these server response shapes (after Axios unwrapping `response.data`):
 *   - `{ success, data: T }`           -> T
 *   - `{ data: T }`                    -> T
 *   - `{ data: { data: T } }`          -> T  (double-wrapped)
 *   - `T`                              -> T  (no wrapper)
 *
 * @param response - The value of `response.data` from Axios (i.e., the JSON body)
 * @returns The unwrapped payload, or `null` if nothing usable was found
 */
export function normalizeResponse<T = unknown>(response: unknown): T | null {
  if (response === null || response === undefined) return null;

  if (isPlainObject(response)) {
    // { success?, data: ... }
    if ("data" in response && response.data !== undefined) {
      const inner = response.data;

      // Double-wrapped: { data: { data: T } } where inner.data is NOT an array
      if (isPlainObject(inner) && "data" in inner && inner.data !== undefined && !Array.isArray(inner.data)) {
        return inner.data as T;
      }

      return inner as T;
    }

    // No `data` key -> the object itself is the payload
    return response as T;
  }

  // Primitive or array at the top level
  return response as T;
}

/**
 * Normalize a list (array) response.
 *
 * Handles these server response shapes (after Axios unwrapping):
 *   - `{ success, data: T[] }`                  -> T[]
 *   - `{ success, data: { data: T[] } }`        -> T[]  (nested)
 *   - `{ data: T[] }`                           -> T[]
 *   - `{ data: { data: T[] } }`                 -> T[]  (nested)
 *   - `T[]`                                     -> T[]  (direct array)
 *   - anything else                              -> []
 *
 * @param response - The value of `response.data` from Axios
 * @returns The unwrapped array, falling back to `[]`
 */
export function normalizeListResponse<T = unknown>(response: unknown): T[] {
  if (Array.isArray(response)) return response as T[];

  if (isPlainObject(response)) {
    const inner = response.data;

    if (Array.isArray(inner)) return inner as T[];

    // Nested: { data: { data: T[] } }
    if (isPlainObject(inner)) {
      if (Array.isArray(inner.data)) return inner.data as T[];
    }
  }

  return [];
}

/**
 * Normalize a detail / single-entity response.
 *
 * Alias for `normalizeResponse<T>` with clearer intent for entity fetching.
 * Common patterns:
 *   - `{ success, data: { id, name, ... } }`
 *   - `{ data: { id, name, ... } }`
 *   - `{ id, name, ... }`
 *
 * @param response - The value of `response.data` from Axios
 * @returns The unwrapped entity, or `null`
 */
export function normalizeDetailResponse<T = unknown>(response: unknown): T | null {
  return normalizeResponse<T>(response);
}

/**
 * Normalize a paginated list response and extract pagination metadata.
 *
 * Handles these server response shapes (after Axios unwrapping):
 *   - `{ success, data: { items: T[], meta: {...} } }`   (preferred format)
 *   - `{ success, data: T[], meta: {...} }`               (flat format)
 *   - `{ data: { items: T[], meta: {...} } }`
 *   - `{ data: T[], meta: {...} }`
 *   - `T[]`                                               (no pagination info)
 *
 * Meta field mapping (API may use different keys):
 *   page:       page | current_page | currentPage | page_index | pageIndex
 *   totalPages: totalPages | pageCount | total_pages | lastPage | last_page
 *   limit:      limit | per_page | perPage
 *   totalItems: totalItems | total | total_items
 *
 * @param response      - The value of `response.data` from Axios
 * @param fallbackPage  - Fallback page number (e.g. from URL params), defaults to 1
 * @param fallbackLimit - Fallback limit (e.g. from URL params), defaults to 10
 * @returns Normalized items array + pagination meta
 */
export function normalizePaginatedResponse<T = unknown>(
  response: unknown,
  fallbackPage: number = 1,
  fallbackLimit: number = 10
): PaginatedResult<T> {
  const emptyResult: PaginatedResult<T> = {
    items: [],
    meta: { page: fallbackPage, totalPages: 1, limit: fallbackLimit, totalItems: 0 },
  };

  if (response === null || response === undefined) return emptyResult;

  // Direct array — no meta available
  if (Array.isArray(response)) {
    return {
      items: response as T[],
      meta: { page: fallbackPage, totalPages: 1, limit: fallbackLimit, totalItems: response.length },
    };
  }

  if (!isPlainObject(response)) return emptyResult;

  let itemsData: T[] = [];
  let rawMeta: Record<string, unknown> | null = null;

  const inner = response.data;

  // Format: { data: { items: [...], meta: {...} } }
  if (isPlainObject(inner) && "items" in inner && Array.isArray(inner.items)) {
    itemsData = inner.items as T[];
    rawMeta = isPlainObject(inner.meta) ? inner.meta as Record<string, unknown> : null;
  }
  // Format: { data: T[], meta?: {...} }
  else if (Array.isArray(inner)) {
    itemsData = inner as T[];
    rawMeta = isPlainObject(response.meta) ? response.meta as Record<string, unknown> : null;
  }
  // Direct array at top level (shouldn't happen after Axios, but just in case)
  else if (Array.isArray(response)) {
    itemsData = response as T[];
  }

  const meta = normalizePaginationMeta(rawMeta, fallbackPage, fallbackLimit);

  return { items: itemsData, meta };
}

/**
 * Extract list items + raw meta object from a paginated response.
 * Unlike `normalizePaginatedResponse`, this returns the raw meta without normalization,
 * useful when callers want to do their own meta parsing.
 *
 * @param response - The value of `response.data` from Axios
 * @returns `{ items, meta }` where meta is the raw object or null
 */
export function normalizeListWithMeta<T = unknown>(response: unknown): NormalizedListResult<T> {
  if (response === null || response === undefined) {
    return { items: [], meta: null };
  }

  if (Array.isArray(response)) {
    return { items: response as T[], meta: null };
  }

  if (!isPlainObject(response)) {
    return { items: [], meta: null };
  }

  const inner = response.data;

  // Format: { data: { items: [...], meta: {...} } }
  if (isPlainObject(inner) && "items" in inner && Array.isArray(inner.items)) {
    const meta = isPlainObject(inner.meta) ? (inner.meta as Record<string, unknown>) : null;
    return { items: inner.items as T[], meta };
  }

  // Format: { data: T[], meta?: {...} }
  if (Array.isArray(inner)) {
    const meta = isPlainObject(response.meta) ? (response.meta as Record<string, unknown>) : null;
    return { items: inner as T[], meta };
  }

  return { items: [], meta: null };
}

/**
 * Normalize raw meta object into a standard PaginationMeta shape.
 * Handles varied key names from the backend.
 *
 * @param raw           - Raw meta object from the API
 * @param fallbackPage  - Default page if not found in meta
 * @param fallbackLimit - Default limit if not found in meta
 * @returns Normalized PaginationMeta
 */
export function normalizePaginationMeta(
  raw: Record<string, unknown> | null,
  fallbackPage: number = 1,
  fallbackLimit: number = 10
): PaginationMeta {
  if (!raw) {
    return { page: fallbackPage, totalPages: 1, limit: fallbackLimit, totalItems: 0 };
  }

  const page =
    toNumber(raw.page ?? raw.current_page ?? raw.currentPage ?? raw.page_index ?? raw.pageIndex) ??
    fallbackPage;

  const totalPages =
    toNumber(raw.totalPages ?? raw.pageCount ?? raw.total_pages ?? raw.lastPage ?? raw.last_page) ??
    1;

  const limit =
    toNumber(raw.limit ?? raw.per_page ?? raw.perPage) ??
    fallbackLimit;

  const totalItems =
    toNumber(raw.totalItems ?? raw.total ?? raw.total_items) ??
    0;

  return { page, totalPages, limit, totalItems };
}

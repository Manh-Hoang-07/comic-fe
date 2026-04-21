// ===== CENTRALIZED LOCALSTORAGE SERVICE =====
// Wraps all localStorage operations with SSR safety, type-safety, and JSON handling.

import type { User } from "@/lib/store/authTypes";
import type { Group } from "@/lib/group/utils";

// ===== HELPERS =====

const isBrowser = typeof window !== "undefined";

/** Safe JSON parse with fallback */
function safeParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

/** Safe localStorage.getItem (SSR-safe) */
function getItem(key: string): string | null {
  if (!isBrowser) return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

/** Safe localStorage.setItem (SSR-safe) */
function setItem(key: string, value: string): void {
  if (!isBrowser) return;
  try {
    localStorage.setItem(key, value);
  } catch {
    // localStorage full or unavailable
  }
}

/** Safe localStorage.removeItem (SSR-safe) */
function removeItem(key: string): void {
  if (!isBrowser) return;
  try {
    localStorage.removeItem(key);
  } catch {
    // localStorage unavailable
  }
}

// ===== KEY CONSTANTS =====

const KEYS = {
  AUTH_TOKEN: "auth_token",
  USER: "user",
  USER_PERMISSIONS: "userPermissions",
  USER_GROUPS: "user_groups",
  SELECTED_GROUP_ID: "selected_group_id",
  REFRESH_TOKEN: "refreshToken",
  SYSTEM_CONFIG_PREFIX: "SystemConfig-cache",
} as const;

// ===== STORAGE SERVICE =====

export const storage = {
  // --- Auth ---
  auth: {
    /** Get auth token from localStorage */
    getToken(): string | null {
      return getItem(KEYS.AUTH_TOKEN);
    },

    /** Set auth token in localStorage */
    setToken(token: string): void {
      setItem(KEYS.AUTH_TOKEN, token);
    },

    /** Remove auth token from localStorage */
    clearToken(): void {
      removeItem(KEYS.AUTH_TOKEN);
    },

    /** Get refresh token from localStorage */
    getRefreshToken(): string | null {
      return getItem(KEYS.REFRESH_TOKEN);
    },

    /** Set refresh token in localStorage */
    setRefreshToken(token: string): void {
      setItem(KEYS.REFRESH_TOKEN, token);
    },

    /** Clear refresh token from localStorage */
    clearRefreshToken(): void {
      removeItem(KEYS.REFRESH_TOKEN);
    },
  },

  // --- User ---
  user: {
    /** Get stored user data */
    getData(): User | null {
      return safeParse<User | null>(getItem(KEYS.USER), null);
    },

    /** Store user data */
    setData(user: User): void {
      setItem(KEYS.USER, JSON.stringify(user));
    },

    /** Clear stored user data */
    clearData(): void {
      removeItem(KEYS.USER);
    },

    /** Get stored user permissions */
    getPermissions(): string[] {
      return safeParse<string[]>(getItem(KEYS.USER_PERMISSIONS), []);
    },

    /** Store user permissions */
    setPermissions(permissions: string[]): void {
      setItem(KEYS.USER_PERMISSIONS, JSON.stringify(permissions));
    },

    /** Clear stored user permissions */
    clearPermissions(): void {
      removeItem(KEYS.USER_PERMISSIONS);
    },
  },

  // --- Group ---
  group: {
    /** Get selected group ID */
    getSelected(): string | null {
      return getItem(KEYS.SELECTED_GROUP_ID);
    },

    /** Set selected group ID */
    setSelected(groupId: string): void {
      setItem(KEYS.SELECTED_GROUP_ID, groupId);
    },

    /** Clear selected group ID */
    clearSelected(): void {
      removeItem(KEYS.SELECTED_GROUP_ID);
    },

    /** Get all stored user groups */
    getGroups(): Group[] {
      return safeParse<Group[]>(getItem(KEYS.USER_GROUPS), []);
    },

    /** Store user groups */
    setGroups(groups: Group[]): void {
      setItem(KEYS.USER_GROUPS, JSON.stringify(groups));
    },

    /** Clear stored user groups */
    clearGroups(): void {
      removeItem(KEYS.USER_GROUPS);
    },
  },

  // --- System Config cache ---
  config: {
    /** Get cached system config for a group */
    getCache(group: string): string | null {
      const key = group === "general" ? KEYS.SYSTEM_CONFIG_PREFIX : `${KEYS.SYSTEM_CONFIG_PREFIX}:${group}`;
      return getItem(key);
    },

    /** Set cached system config for a group */
    setCache(group: string, value: string): void {
      const key = group === "general" ? KEYS.SYSTEM_CONFIG_PREFIX : `${KEYS.SYSTEM_CONFIG_PREFIX}:${group}`;
      setItem(key, value);
    },

    /** Clear cached system config for a group */
    clearCache(group: string): void {
      const key = group === "general" ? KEYS.SYSTEM_CONFIG_PREFIX : `${KEYS.SYSTEM_CONFIG_PREFIX}:${group}`;
      removeItem(key);
    },
  },

  // --- Clear all app data ---
  /** Clear all auth, user, and group data from localStorage */
  clearAll(): void {
    storage.auth.clearToken();
    storage.auth.clearRefreshToken();
    storage.user.clearData();
    storage.user.clearPermissions();
    storage.group.clearSelected();
    storage.group.clearGroups();
  },
} as const;

/** Exported key constants for advanced usage */
export { KEYS as STORAGE_KEYS };

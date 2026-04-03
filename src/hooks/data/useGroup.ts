"use client";

import { useState, useEffect, useMemo } from "react";
import api from "@/lib/api/client";
import { useToast } from "./useToast";
import { userEndpoints } from "@/lib/api/endpoints";

export interface Group {
  id: number;
  name: string;
  type?: string;
  context?: {
    id: number;
    type: string;
    name: string;
  };
  roles?: Array<{ id: number; name: string }>;
}

export function useGroup() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showSuccess, showError } = useToast();

  const getStoredGroupId = (): number | null => {
    if (typeof window !== "undefined") {
      const storedGroupId = localStorage.getItem("selected_group_id");
      if (storedGroupId) {
        const groupIdNum = parseInt(storedGroupId, 10);
        if (!isNaN(groupIdNum)) {
          return groupIdNum;
        }
      }
    }
    return null;
  };

  const currentGroup = useMemo<Group | null>(() => {
    const groupId = getStoredGroupId();
    if (!groupId) return null;
    return groups.find((g) => g.id === groupId) || null;
  }, [groups]);

  const fetchMyGroups = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      // Load groups from API
      const response = await api.get(userEndpoints.groups.list);
      const fetchedGroups = response.data?.data || [];
      setGroups(fetchedGroups);

      // Store in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("user_groups", JSON.stringify(fetchedGroups));
      }
    } catch (err: any) {
      setError(err.message || "Không thể tải danh sách groups");
      setGroups([]);

      // Fallback: Load from localStorage if available
      if (typeof window !== "undefined") {
        const cachedGroups = localStorage.getItem("user_groups");
        if (cachedGroups) {
          try {
            setGroups(JSON.parse(cachedGroups));
          } catch (e) {
            // Ignore parse error
          }
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const switchGroup = async (groupId: number): Promise<Group | null> => {
    setLoading(true);
    setError(null);

    try {
      const group = groups.find((g) => g.id === groupId);

      if (!group) {
        setError("Group không tồn tại");
        showError("Group không tồn tại");
        return null;
      }

      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("selected_group_id", String(groupId));
      }

      showSuccess("Đã chuyển group thành công");

      return group;
    } catch (err: any) {
      setError(err.message || "Không thể chuyển group");
      showError("Không thể chuyển group");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const setGroupId = (groupId: number | null): void => {
    if (typeof window !== "undefined") {
      if (groupId) {
        localStorage.setItem("selected_group_id", String(groupId));
      } else {
        localStorage.removeItem("selected_group_id");
      }
    }
  };

  const getGroupId = (): number | null => {
    return getStoredGroupId();
  };

  useEffect(() => {
    fetchMyGroups();
  }, []);

  return {
    groups,
    currentGroup,
    loading,
    error,
    fetchMyGroups,
    switchGroup,
    setGroupId,
    getGroupId,
  };
}




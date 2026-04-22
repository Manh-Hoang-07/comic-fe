"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/store/authStore";
import { useToastContext } from "@/contexts/ToastContext";
import { userComicService } from "@/lib/api/user/comic";

export function useBookmarks() {
  const { isAuthenticated } = useAuthStore();
  const { showSuccess, showError } = useToastContext();
  const queryClient = useQueryClient();
  const hasToken =
    typeof window !== "undefined" && document.cookie.includes("auth_token");

  const { data: bookmarks = [], isLoading } = useQuery({
    queryKey: ["bookmarks"],
    queryFn: () => userComicService.getBookmarks(),
    enabled: isAuthenticated && hasToken,
  });

  const { mutate: deleteBookmark } = useMutation({
    mutationFn: (id: string | number) => userComicService.deleteBookmark(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
      showSuccess("Đã xóa bookmark");
    },
    onError: () => showError("Không thể xóa bookmark"),
  });

  return { bookmarks, isLoading, deleteBookmark };
}

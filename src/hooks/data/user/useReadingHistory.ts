"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/store/authStore";
import { useToastContext } from "@/contexts/ToastContext";
import { userComicService } from "@/lib/api/user/comic";

export function useReadingHistory() {
  const { isAuthenticated } = useAuthStore();
  const { showSuccess, showError } = useToastContext();
  const queryClient = useQueryClient();
  const hasToken =
    typeof window !== "undefined" && document.cookie.includes("auth_token");

  const { data: history = [], isLoading } = useQuery({
    queryKey: ["readingHistory"],
    queryFn: () => userComicService.getReadingHistory(),
    enabled: isAuthenticated && hasToken,
  });

  const { mutate: deleteReadingHistory } = useMutation({
    mutationFn: (comicId: string | number) =>
      userComicService.deleteReadingHistory(comicId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["readingHistory"] });
      showSuccess("Đã xóa lịch sử đọc");
    },
    onError: () => showError("Không thể xóa lịch sử đọc"),
  });

  return { history, isLoading, deleteReadingHistory };
}

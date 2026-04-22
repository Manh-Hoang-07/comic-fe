"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/store/authStore";
import { useToastContext } from "@/contexts/ToastContext";
import { userComicService } from "@/lib/api/user/comic";

export function useFollows() {
  const { isAuthenticated } = useAuthStore();
  const { showSuccess, showError } = useToastContext();
  const queryClient = useQueryClient();
  const hasToken =
    typeof window !== "undefined" && document.cookie.includes("auth_token");

  const { data: follows = [], isLoading } = useQuery({
    queryKey: ["follows"],
    queryFn: () => userComicService.getFollows(),
    enabled: isAuthenticated && hasToken,
  });

  const { mutate: unfollowComic } = useMutation({
    mutationFn: (comicId: string | number) =>
      userComicService.unfollowComic(comicId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["follows"] });
      showSuccess("Đã bỏ theo dõi");
    },
    onError: () => showError("Không thể thực hiện thao tác"),
  });

  return { follows, isLoading, unfollowComic };
}

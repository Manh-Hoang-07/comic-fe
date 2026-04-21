"use client";

import dynamic from "next/dynamic";
const PostForm = dynamic(() => import("./PostForm"), {
  ssr: false,
  loading: () => <div className="p-6 animate-pulse"><div className="h-8 w-48 bg-gray-200 rounded mb-4" /><div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-10 bg-gray-200 rounded" />)}</div></div>,
}) as any;
import { useFormModal } from "@/hooks";
import { EditTarget } from "@/hooks/crud/useFormModal";

interface EditPostProps {
  show: boolean;
  target: EditTarget | null;
  statusEnums?: Array<{ value: string; label: string; name?: string }>;
  postTypeEnums?: Array<{ value: string; label: string; name?: string }>;
  categoryEnums?: Array<{ value: number; label: string; name?: string }>;
  tagEnums?: Array<{ value: number; label: string; name?: string }>;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function EditPost({
  show,
  target,
  statusEnums,
  postTypeEnums,
  categoryEnums,
  tagEnums,
  onSuccess,
  onClose,
}: EditPostProps) {
  const { entityData, loading, apiErrors, handleSubmit } = useFormModal(
    { mode: "edit", show, target },
    {
      updateSuccessMessage: "Cập nhật bài viết thành công",
      fetchErrorMessage: "Không thể tải thông tin bài viết",
      onSuccess,
      onClose,
    }
  );

  return (
    <PostForm
      show={show}
      post={entityData}
      statusEnums={statusEnums}
      postTypeEnums={postTypeEnums}
      categoryEnums={categoryEnums}
      tagEnums={tagEnums}
      onSubmit={(data: Record<string, unknown>) => handleSubmit(data)}
      onCancel={onClose}
      loading={loading}
      apiErrors={apiErrors ?? undefined}
    />
  );
}

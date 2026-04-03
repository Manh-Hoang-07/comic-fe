import { Suspense } from "react";
import { Metadata } from "next";
import AdminPostTags from "@/components/Features/Posts/Tags/Admin/AdminPostTags";
import PageMeta from "@/components/UI/Navigation/PageMeta";

export const metadata: Metadata = {
  title: "Thẻ bài viết | Admin",
  description: "Quản lý thẻ (tags) bài viết",
};

export default function AdminPostTagsPage() {
  return (
    <div className="w-full p-4">
      <PageMeta
        title="Thẻ bài viết"
        breadcrumbs={[
          { label: "Trang quản trị", href: "/admin", },
          { label: "Bài viết", href: "/admin/postsss" },
          { label: "Thẻ (Tags)" },
        ]}
      />
      <Suspense fallback={<div>Đang tải...</div>}>
        <AdminPostTags />
      </Suspense>
    </div>
  );
}







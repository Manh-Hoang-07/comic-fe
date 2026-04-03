import { Suspense } from "react";
import { Metadata } from "next";
import AdminPosts from "@/components/Features/Posts/PostList/Admin/AdminPosts";
import PageMeta from "@/components/UI/Navigation/PageMeta";

export const metadata: Metadata = {
  title: "Quản lý bài viết | Admin",
  description: "Quản lý bài viết và tin tức",
};

export default function AdminPostsPage() {
  return (
    <div className="w-full p-4">
      <PageMeta
        title="Quản lý bài viết"
        breadcrumbs={[
          { label: "Trang quản trị", href: "/admin", },
          { label: "Bài viết", href: "/admin/postsss" },
          { label: "Danh sách" },
        ]}
      />
      <Suspense fallback={<div>Đang tải...</div>}>
        <AdminPosts />
      </Suspense>
    </div>
  );
}







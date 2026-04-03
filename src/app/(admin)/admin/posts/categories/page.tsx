import { Suspense } from "react";
import { Metadata } from "next";
import AdminPostCategories from "@/components/Features/Posts/Categories/Admin/AdminPostCategories";
import PageMeta from "@/components/UI/Navigation/PageMeta";

export const metadata: Metadata = {
  title: "Danh mục bài viết | Admin",
  description: "Quản lý danh mục bài viết",
};

export default function AdminPostCategoriesPage() {
  return (
    <div className="w-full p-4">
      <PageMeta
        title="Danh mục bài viết"
        breadcrumbs={[
          { label: "Trang quản trị", href: "/admin", },
          { label: "Bài viết", href: "/admin/postsss" },
          { label: "Danh mục" },
        ]}
      />
      <Suspense fallback={<div>Đang tải...</div>}>
        <AdminPostCategories />
      </Suspense>
    </div>
  );
}







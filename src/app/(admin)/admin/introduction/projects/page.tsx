import { Suspense } from "react";
import { Metadata } from "next";
import AdminProjects from "@/components/Features/Introduction/Projects/Admin/AdminProjects";
import PageMeta from "@/components/UI/Navigation/PageMeta";

export const metadata: Metadata = {
  title: "Quản lý Dự án | Admin",
  description: "Quản lý danh sách dự án",
};

export default function AdminProjectsPage() {
  return (
    <div className="w-full p-4">
      <PageMeta
        title="Quản lý Dự án"
        breadcrumbs={[
          { label: "Trang quản trị", href: "/admin", },
          { label: "Dự án" },
        ]}
      />
      <Suspense fallback={<div>Đang tải...</div>}>
        <AdminProjects />
      </Suspense>
    </div>
  );
}





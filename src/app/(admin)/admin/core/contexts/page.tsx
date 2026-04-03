import { Suspense } from "react";
import { Metadata } from "next";
import AdminContexts from "@/components/Features/Core/Contexts/Admin/AdminContexts";
import PageMeta from "@/components/UI/Navigation/PageMeta";

export const metadata: Metadata = {
  title: "Quản lý Context | Admin",
  description: "Quản lý ngữ cảnh và phân quyền chuyên sâu",
};

export default function AdminContextsPage() {
  return (
    <div className="w-full p-4">
      <PageMeta
        title="Quản lý Context"
        breadcrumbs={[
          { label: "Trang quản trị", href: "/admin", },
          { label: "Nhóm & Context", href: "/admin/groups" },
          { label: "Context" },
        ]}
      />
      <Suspense fallback={<div>Đang tải...</div>}>
        <AdminContexts />
      </Suspense>
    </div>
  );
}



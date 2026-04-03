import { Suspense } from "react";
import { Metadata } from "next";
import AdminRoles from "@/components/Features/Core/Iam/Roles/Admin/AdminRoles";
import PageMeta from "@/components/UI/Navigation/PageMeta";

export const metadata: Metadata = {
  title: "Quản lý Vai trò | Admin",
  description: "Quản lý vai trò và phân quyền",
};

export default function AdminRolesPage() {
  return (
    <div className="w-full p-4">
      <PageMeta
        title="Quản lý Vai trò"
        breadcrumbs={[
          { label: "Trang quản trị", href: "/admin", },
          { label: "Phân quyền", href: "/admin/roles" },
          { label: "Vai trò" },
        ]}
      />
      <Suspense fallback={<div>Đang tải...</div>}>
        <AdminRoles />
      </Suspense>
    </div>
  );
}





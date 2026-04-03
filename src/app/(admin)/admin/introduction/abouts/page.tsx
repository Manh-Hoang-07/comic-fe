import { Suspense } from "react";
import { Metadata } from "next";
import AdminAboutSections from "@/components/Features/Introduction/About/Admin/AdminAboutSections";
import PageMeta from "@/components/UI/Navigation/PageMeta";

export const metadata: Metadata = {
  title: "Giới thiệu chung | Admin",
  description: "Quản lý nội dung trang giới thiệu",
};

export default function AdminAboutSectionsPage() {
  return (
    <div className="w-full p-4">
      <PageMeta
        title="Giới thiệu chung"
        breadcrumbs={[
          { label: "Trang quản trị", href: "/admin", },
          { label: "Giới thiệu", href: "/admin/Abouts" },
          { label: "Nội dung chung" },
        ]}
      />
      <Suspense fallback={<div>Đang tải...</div>}>
        <AdminAboutSections />
      </Suspense>
    </div>
  );
}





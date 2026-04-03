import { Suspense } from "react";
import { Metadata } from "next";
import AdminFAQs from "@/components/Features/Introduction/Faqs/Admin/AdminFAQs";
import PageMeta from "@/components/UI/Navigation/PageMeta";

export const metadata: Metadata = {
  title: "Quản lý FAQ | Admin",
  description: "Quản lý câu hỏi thường gặp",
};

export default function AdminFAQsPage() {
  return (
    <div className="w-full p-4">
      <PageMeta
        title="Quản lý FAQ"
        breadcrumbs={[
          { label: "Trang quản trị", href: "/admin", },
          { label: "FAQ" },
        ]}
      />
      <Suspense fallback={<div>Đang tải...</div>}>
        <AdminFAQs />
      </Suspense>
    </div>
  );
}





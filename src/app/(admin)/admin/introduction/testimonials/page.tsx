import { Suspense } from "react";
import { Metadata } from "next";
import AdminTestimonials from "@/components/Features/Introduction/Testimonials/Admin/AdminTestimonials";
import PageMeta from "@/components/UI/Navigation/PageMeta";

export const metadata: Metadata = {
  title: "Đánh giá Khách hàng | Admin",
  description: "Quản lý ý kiến đánh giá từ khách hàng",
};

export default function AdminTestimonialsPage() {
  return (
    <div className="w-full p-4">
      <PageMeta
        title="Đánh giá Khách hàng"
        breadcrumbs={[
          { label: "Trang quản trị", href: "/admin", },
          { label: "Đánh giá" },
        ]}
      />
      <Suspense fallback={<div>Đang tải...</div>}>
        <AdminTestimonials />
      </Suspense>
    </div>
  );
}





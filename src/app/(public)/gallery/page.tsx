import { Metadata } from "next";
import { serverFetch } from "@/lib/api/server-client";
import HeroBanner from "@/components/Features/Marketing/Banners/Public/HeroBanner";
import { Breadcrumbs } from "@/components/UI/Navigation/Breadcrumbs";
import GalleryInteractive from "@/components/Features/Introduction/Gallery/Public/GalleryInteractive";
import { Button } from "@/components/UI/Navigation/Button";

export const metadata: Metadata = {
  title: "Thư viện dự án",
  description: "Khám phá các thiết kế và giải pháp xây dựng tiêu biểu của chúng tôi.",
};

export const revalidate = 3600;

export default async function GalleryPage() {
  const { data: galleryItems } = await serverFetch("/api/gallery", { revalidate: 3600 });

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-20 transition-colors duration-300">
      {/* Static — server rendered */}
      <HeroBanner locationCode="gallery" imageOnly={true} />

      <div className="container mx-auto px-4 mt-8 relative z-10">
        <Breadcrumbs items={[{ label: "Thư viện" }]} />
        <h1 className="text-4xl font-extrabold text-gray-900 mb-10 border-l-8 border-primary pl-6">
          Thư viện dự án
        </h1>

        {/* Interactive client island */}
        <GalleryInteractive initialItems={galleryItems || []} />

        {/* Static CTA — server rendered */}
        <div className="bg-white rounded-2xl p-10 text-center border border-gray-100 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Cần dự án tương tự?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Chúng tôi chuyên tạo các giải pháp tùy chỉnh theo nhu cầu cụ thể của bạn.
          </p>
          <Button size="lg">Bắt đầu dự án mới</Button>
        </div>
      </div>
    </div>
  );
}

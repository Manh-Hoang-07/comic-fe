import { Suspense } from "react";
import { Metadata } from "next";
import GalleryClient from "./GalleryClient";
import { serverFetch } from "@/lib/api/server-client";

export const metadata: Metadata = {
  title: "Thư viện dự án",
  description: "Khám phá các thiết kế và giải pháp xây dựng tiêu biểu của chúng tôi.",
};

export const revalidate = 3600;

export default async function GalleryPage() {
  const { data: galleryItems } = await serverFetch<any[]>("/api/gallery", { revalidate: 3600 });

  return (
    <Suspense fallback={<div className="text-center py-10 text-gray-500">Đang tải thư viện...</div>}>
      <GalleryClient initialItems={galleryItems || []} />
    </Suspense>
  );
}

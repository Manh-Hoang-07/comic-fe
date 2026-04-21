import { Suspense } from "react";
import { Metadata } from "next";
import FAQsClient from "./FAQsClient";
import { serverFetch } from "@/lib/api/server-client";

export const metadata: Metadata = {
  title: "Câu hỏi thường gặp",
  description: "Tìm câu trả lời cho các câu hỏi phổ biến về dịch vụ của chúng tôi.",
};

export const revalidate = 3600;

export default async function FAQsPage() {
  const { data: faqs } = await serverFetch("/api/faqs", { revalidate: 3600 });

  return (
    <Suspense fallback={<div className="text-center py-10 text-gray-500">Đang tải câu hỏi...</div>}>
      <FAQsClient initialFaqs={faqs || []} />
    </Suspense>
  );
}

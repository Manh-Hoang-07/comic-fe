import { Suspense } from "react";
import { Metadata } from "next";
import FAQsClient from "./FAQsClient";

export const metadata: Metadata = {
  title: "Câu hỏi thường gặp",
  description: "Tìm câu trả lời cho các câu hỏi phổ biến về dịch vụ của chúng tôi.",
};

export default function FAQsPage() {
  return (
    <Suspense fallback={<div className="text-center py-10 text-gray-500">Đang tải câu hỏi...</div>}>
      <FAQsClient />
    </Suspense>
  );
}


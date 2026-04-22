import { Metadata } from "next";
import FaqsPage from "@/components/Features/Introduction/Faqs/Public/FaqsPage";
import { Breadcrumbs } from "@/components/UI/Navigation/Breadcrumbs";
import { serverFetch } from "@/lib/api/server-client";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Câu hỏi thường gặp",
  description: "Tìm câu trả lời cho các câu hỏi phổ biến về dịch vụ của chúng tôi.",
};

export const revalidate = 3600;

export default async function FAQsPage() {
  const { data: faqs } = await serverFetch("/api/faqs", { revalidate: 3600 });

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-20 transition-colors duration-300">
      <div className="container mx-auto px-4 mt-8">
        {/* Static — render ở server */}
        <Breadcrumbs items={[{ label: "Câu hỏi thường gặp" }]} />
        <h1 className="text-4xl font-extrabold text-gray-900 mb-10 border-l-8 border-primary pl-6">
          Câu hỏi thường gặp
        </h1>

        {/* Interactive — client island */}
        <FaqsPage initialFaqs={faqs || []} />

        {/* Static CTA — render ở server */}
        <div className="bg-white rounded-2xl p-10 text-center border border-gray-100 shadow-sm mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Không tìm thấy câu trả lời bạn cần?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Nếu bạn có câu hỏi khác chưa được trả lời, đừng ngần ngại liên hệ với chúng tôi.
          </p>
          <Link
            href="/contacts"
            className="inline-flex items-center px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors"
          >
            Liên hệ hỗ trợ
          </Link>
        </div>
      </div>
    </div>
  );
}

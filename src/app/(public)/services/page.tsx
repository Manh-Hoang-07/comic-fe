import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/components/UI/Navigation/Button";
import { ServiceFilter } from "@/components/Features/Introduction/Services/Public/ServiceFilter";
import { Metadata } from "next";
import HeroBanner from "@/components/Features/Marketing/Banners/Public/HeroBanner";
import { Breadcrumbs } from "@/components/UI/Navigation/Breadcrumbs";
import { getServices } from "@/lib/data/mock-services";

export const metadata: Metadata = {
  title: "Dịch vụ",
  description: "Giải pháp công nghệ toàn diện giúp doanh nghiệp phát triển bền vững.",
};

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-20 transition-colors duration-300">
      <HeroBanner locationCode="service" imageOnly={true} />

      <div className="container mx-auto px-4 mt-8 relative z-10">
        <Breadcrumbs items={[{ label: "Dịch vụ" }]} />
        <h1 className="text-4xl font-extrabold text-gray-900 mb-10 border-l-8 border-primary pl-6">Dịch vụ chuyên nghiệp</h1>
        <Suspense fallback={<div className="text-center py-10 text-gray-500">Đang tải dịch vụ...</div>}>
          <ServiceFilter initialServices={services} />
        </Suspense>

        {/* CTA Section */}
        <div className="mt-16 bg-white rounded-2xl p-10 text-center border border-gray-100 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Cần dịch vụ tùy chỉnh?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Chúng tôi cũng cung cấp các giải pháp tùy chỉnh theo nhu cầu cụ thể của doanh nghiệp bạn.
            Liên hệ với chúng tôi để được tư vấn miễn phí.
          </p>
          <Link href="/contact">
            <Button size="lg">
              Liên hệ tư vấn
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

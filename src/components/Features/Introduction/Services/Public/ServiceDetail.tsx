import Link from "next/link";
import { PageBanner } from "@/components/UI/Navigation/PageBanner";
import { Button } from "@/components/UI/Navigation/Button";

interface Service {
  id?: string;
  title: string;
  description: string;
  image: string;
  icon?: string;
  features: string[];
  price: string;
  duration: string;
  category: string;
  popular?: boolean;
  fullDescription?: string;
}

interface ServiceDetailProps {
  service: Service;
}

export default function ServiceDetail({ service }: ServiceDetailProps) {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <PageBanner
        title={service.title}
        subtitle={service.category}
        backgroundImage={service.image.startsWith("http") ? service.image : "https://images.unsplash.com/photo-1504384308090-c54be3852f33?auto=format&fit=crop&q=80"}
      />

      <div className="container mx-auto px-4 -mt-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Chi tiết dịch vụ</h2>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed whitespace-pre-line">
                {service.fullDescription || service.description}
              </p>

              <h3 className="text-xl font-bold text-gray-900 mb-4">Tính năng nổi bật</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {service.features?.map((feature: string, idx: number) => (
                  <div key={idx} className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Thông tin gói</h3>
              <div className="space-y-4 border-t border-b border-gray-100 py-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Thời gian:</span>
                  <span className="font-medium text-gray-900">{service.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Giá tham khảo:</span>
                  <span className="font-bold text-primary">{service.price}</span>
                </div>
              </div>

              <div className="space-y-3">
                <Button className="w-full">Yêu cầu báo giá</Button>
                <Link href="/services" className="block w-full text-center py-2 text-gray-600 hover:text-primary transition-colors">
                  ← Quay lại danh sách
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

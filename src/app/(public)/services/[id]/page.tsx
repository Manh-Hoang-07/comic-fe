import Link from "next/link";
import { PageBanner } from "@/components/UI/Navigation/PageBanner";
import { Button } from "@/components/UI/Navigation/Button";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const service = MOCK_SERVICES.find(s => s.id === id);
    const title = service?.title || "Dịch vụ chi tiết";
    const description = service?.description || "Chi tiết dịch vụ của chúng tôi.";

    return {
        title: title,
        description: description,
        openGraph: {
            title: title,
            description: description,
            images: service?.image ? [{ url: service.image }] : [],
        },
    };
}


// Mock data (shared with list page for consistency)
const MOCK_SERVICES = [
    {
        id: "1",
        title: "Phát triển Web",
        description: "Xây dựng các trang web hiện đại, responsive và tối ưu SEO với công nghệ mới nhất.",
        image: "/images/service1.jpg",
        icon: "web",
        features: [
            "Thiết kế responsive",
            "Tối ưu SEO",
            "Tốc độ tải nhanh",
            "Bảo mật cao",
            "Hỗ trợ đa trình duyệt"
        ],
        price: "Từ 15.000.000 VNĐ",
        duration: "2-8 tuần",
        category: "Web Development",
        popular: true,
        fullDescription: `
      Chúng tôi cung cấp dịch vụ phát triển web toàn diện, từ landing page đơn giản đến các hệ thống web phức tạp.
      Quy trình làm việc chuyên nghiệp đảm bảo chất lượng và tiến độ dự án.
      
      Công nghệ sử dụng:
      - Frontend: React, Next.js, Vue.js
      - Backend: Node.js, Python, PHP
      - Database: PostgreSQL, MySQL, MongoDB
    `
    },
    {
        id: "2",
        title: "Phát triển Mobile",
        description: "Tạo ứng dụng di động native và cross-platform cho iOS và Android.",
        image: "/images/service2.jpg",
        icon: "mobile",
        features: [
            "Native iOS & Android",
            "Cross-platform (React Native)",
            "UI/UX tối ưu",
            "Push notifications",
            "Tích hợp API"
        ],
        price: "Từ 25.000.000 VNĐ",
        duration: "4-12 tuần",
        category: "Mobile Development",
        fullDescription: "Phát triển ứng dụng di động đa nền tảng giúp doanh nghiệp tiếp cận khách hàng trên mọi thiết bị."
    },
    // Add other mock services as needed for demo purposes matching existing IDs
];

export default async function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const found = MOCK_SERVICES.find(s => s.id === id);
    const service = found || {
        title: "Dịch vụ đã lưu trữ",
        description: "Thông tin dịch vụ đang được cập nhật.",
        image: "https://images.unsplash.com/photo-1504384308090-c54be3852f33?auto=format&fit=crop&q=80",
        features: [],
        price: "Liên hệ",
        duration: "Thỏa thuận",
        category: "Dịch vụ khác",
        fullDescription: "Thông tin chi tiết đang được cập nhật."
    };

    if (!service) return null;

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

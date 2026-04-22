import { Metadata } from "next";
import ServiceDetail from "@/components/Features/Introduction/Services/Public/ServiceDetail";

// Mock data for detail page (includes fullDescription not in list page data)
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

    return <ServiceDetail service={service} />;
}

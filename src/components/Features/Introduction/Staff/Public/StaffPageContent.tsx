import { StaffList } from "./StaffList";
import HeroBanner from "@/components/Features/Marketing/Banners/Public/HeroBanner";
import { Breadcrumbs } from "@/components/UI/Navigation/Breadcrumbs";
import Link from "next/link";
import { Button } from "@/components/UI/Navigation/Button";
import { TeamMember } from "@/types/api";

interface StaffPageContentProps {
  staffMembers: TeamMember[];
}

export default function StaffPageContent({ staffMembers }: StaffPageContentProps) {
  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-20 transition-colors duration-300">
      <HeroBanner locationCode="staff" imageOnly={true} />

      <div className="container mx-auto px-4 mt-8 relative z-10">
        <Breadcrumbs items={[{ label: "Đội ngũ nhân sự" }]} />
        <h1 className="text-4xl font-extrabold text-gray-900 mb-10 border-l-8 border-primary pl-6">Đội ngũ nhân sự</h1>
        <StaffList initialStaff={staffMembers} />

        {/* CTA Section */}
        <div className="mt-16 bg-white rounded-2xl p-10 text-center border border-gray-100 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Gia nhập đội ngũ của chúng tôi</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Chúng tôi luôn tìm kiếm những tài năng đam mê và sáng tạo.
            Xem các vị trí đang tuyển dụng và ứng tuyển ngay hôm nay.
          </p>
          <Link href="/contact">
            <Button size="lg">
              Liên hệ ứng tuyển
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

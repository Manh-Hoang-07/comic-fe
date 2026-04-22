import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/UI/Navigation/Button";
import HeroBanner from "@/components/Features/Marketing/Banners/Public/HeroBanner";
import { Breadcrumbs } from "@/components/UI/Navigation/Breadcrumbs";
import ProjectListAsync from "@/components/Features/Introduction/Projects/Public/ProjectListAsync";
import ProjectSkeleton from "@/components/Features/Introduction/Projects/Public/ProjectSkeleton";

export const metadata: Metadata = {
  title: "Dự án",
  description: "Khám phá những công trình tiêu biểu chúng tôi đã thực hiện.",
};

// Enable ISR with 5 minutes revalidation
export const revalidate = 300;

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-20 transition-colors duration-300">
      <HeroBanner locationCode="project" imageOnly={true} />

      <div className="container mx-auto px-4 mt-8 relative z-10">
        <Breadcrumbs items={[{ label: "Dự án" }]} />
        <h1 className="text-4xl font-extrabold text-gray-900 mb-10 border-l-8 border-primary pl-6">Dự án tiêu biểu</h1>
        <Suspense fallback={<ProjectSkeleton />}>
          <ProjectListAsync />
        </Suspense>

        {/* CTA Section */}
        <div className="mt-16 bg-white rounded-2xl p-10 text-center border border-gray-100 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Cần giải pháp cho dự án của bạn?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Chúng tôi luôn sẵn sàng lắng nghe và tư vấn những phương án tối ưu nhất cho dự án của bạn.
          </p>
          <Link href="/contact">
            <Button size="lg">
              Liên hệ ngay
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}


import { serverFetch } from "@/lib/api/server-client";
import { publicEndpoints } from "@/lib/api/endpoints";
import { ProjectFilter } from "@/components/Features/Introduction/Projects/Public/ProjectFilter";
import Link from "next/link";
import { Button } from "@/components/UI/Navigation/Button";
import { Suspense } from "react";
import { Metadata } from "next";
import HeroBanner from "@/components/Features/Marketing/Banners/Public/HeroBanner";
import { Breadcrumbs } from "@/components/UI/Navigation/Breadcrumbs";

export const metadata: Metadata = {
  title: "Dự án",
  description: "Khám phá những công trình tiêu biểu chúng tôi đã thực hiện.",
};

// Enable ISR with 5 minutes revalidation
export const revalidate = 300;

async function getProjects() {
  try {
    const { data, error } = await serverFetch(publicEndpoints.projects.list, {
      skipCookies: true,
      next: {
        revalidate: 300,
        tags: ['projects'],
      },
    });

    if (error) {
      console.error("Error fetching projects:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

async function ProjectList() {
  const projects = await getProjects();
  return <ProjectFilter initialProjects={projects} />;
}

function ProjectSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
          <div className="h-48 bg-gray-100" />
          <div className="p-5">
            <div className="h-5 bg-gray-100 rounded w-3/4 mb-3" />
            <div className="h-4 bg-gray-100 rounded w-full mb-2" />
            <div className="h-4 bg-gray-100 rounded w-2/3 mb-4" />
            <div className="h-9 bg-gray-100 rounded w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-20 transition-colors duration-300">
      <HeroBanner locationCode="project" imageOnly={true} />

      <div className="container mx-auto px-4 mt-8 relative z-10">
        <Breadcrumbs items={[{ label: "Dự án" }]} />
        <h1 className="text-4xl font-extrabold text-gray-900 mb-10 border-l-8 border-primary pl-6">Dự án tiêu biểu</h1>
        <Suspense fallback={<ProjectSkeleton />}>
          <ProjectList />
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

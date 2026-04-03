import Link from "next/link";
import { PageBanner } from "@/components/UI/Navigation/PageBanner";
import { Button } from "@/components/UI/Navigation/Button";
import { serverFetch } from "@/lib/api/server-client";
import { publicEndpoints } from "@/lib/api/endpoints";
import { Project } from "@/types/api";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    return {
      title: "Dự án không tồn tại",
    };
  }

  return {
    title: project.name,
    description: project.short_description,
    openGraph: {
      title: project.name,
      description: project.short_description,
      images: project.cover_image ? [{ url: project.cover_image }] : [],
    },
  };
}

// Tự động tạo static paths cho các dự án khi build
export async function generateStaticParams() {
  const { data: projects } = await serverFetch<Project[]>(publicEndpoints.projects.list, {
    revalidate: 3600,
    skipCookies: true,
  });

  if (!projects) return [];

  return projects.map((project) => ({
    slug: project.slug,
  }));
}

async function getProject(slug: string) {
  const { data } = await serverFetch<Project>(
    publicEndpoints.projects.showBySlug(slug),
    {
      revalidate: 3600, // Cache 1 giờ
      tags: [`project-${slug}`],
      skipCookies: true, // Render tĩnh không cần cookie layout
    }
  );
  return data;
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <PageBanner
        title={project.name || "Chi tiết dự án"}
        subtitle={project.short_description}
        backgroundImage={project.cover_image || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80"}
      />

      <div className="container mx-auto px-4 -mt-10 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Mô tả dự án</h2>
              <div
                className="prose max-w-none text-gray-700"
                dangerouslySetInnerHTML={{
                  __html: project.description || project.short_description || "Chưa có mô tả chi tiết.",
                }}
              />
            </section>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Thông tin dự án</h3>
              <dl className="space-y-4 border-t border-b border-gray-100 py-4 mb-6">
                {project.location && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Địa điểm</dt>
                    <dd className="font-medium text-gray-900">{project.location}</dd>
                  </div>
                )}
              </dl>

              <div className="space-y-3">
                <Link href="/contact">
                  <Button className="w-full">Liên hệ về dự án</Button>
                </Link>
                <Link
                  href="/projects"
                  className="block w-full text-center py-2 text-gray-600 hover:text-primary transition-colors"
                >
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

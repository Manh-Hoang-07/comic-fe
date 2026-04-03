import Link from "next/link";
import { PageBanner } from "@/components/UI/Navigation/PageBanner";
import { serverFetch } from "@/lib/api/server-client";
import { publicEndpoints } from "@/lib/api/endpoints";
import { Post } from "@/types/api";
import { notFound } from "next/navigation";
import { ShareButton } from "@/components/UI/Navigation/ShareButton";
import { PostComments } from "@/components/Features/Posts/PostList/Public/PostComments";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return {
      title: "Bài viết không tồn tại",
    };
  }

  return {
    title: post.name,
    description: post.excerpt,
    openGraph: {
      title: post.name,
      description: post.excerpt,
      images: post.cover_image ? [{ url: post.cover_image }] : [],
    },
  };
}

export async function generateStaticParams() {
  const { data: posts } = await serverFetch<Post[]>(publicEndpoints.posts.list, {
    revalidate: 3600,
    skipCookies: true,
  });

  if (!posts) return [];

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

async function getPost(slug: string) {
  const { data } = await serverFetch<Post>(
    publicEndpoints.posts.showBySlug(slug),
    {
      revalidate: 3600,
      tags: [`post-${slug}`],
      skipCookies: true,
    }
  );
  return data;
}

export default async function PostDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <PageBanner
        title={post.name}
        subtitle={post.excerpt}
        backgroundImage={post.cover_image || post.image || "https://images.unsplash.com/photo-1432821596592-e2c18b78144f?auto=format&fit=crop&q=80"}
      />

      <div className="container mx-auto px-4 -mt-10 relative z-10">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 md:p-12">
          {/* Header Info */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-8 border-b border-gray-100 gap-4">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4 text-primary font-bold">
                {post.name?.[0] || 'A'}
              </div>
              <div>
                <p className="font-bold text-gray-900 text-lg">{post.primary_category?.name || "Tin tức"}</p>
                <div className="flex gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {post.view_count} lượt xem
                  </span>
                </div>
              </div>
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag: any) => (
                  <span
                    key={tag.id}
                    className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium hover:bg-primary/10 hover:text-primary transition-colors cursor-default"
                  >
                    #{tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none mb-12 text-gray-700 leading-relaxed">
            <div
              className="post-content"
              dangerouslySetInnerHTML={{ __html: post.content || post.description || post.excerpt || "" }}
            />
          </div>

          {/* Comments Section */}
          <PostComments postId={post.id} />

          {/* Footer Actions */}
          <div className="pt-8 border-t border-gray-100 flex justify-between items-center">
            <Link
              href="/posts"
              className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Quay lại danh sách
            </Link>

            <ShareButton title={post.name} />
          </div>
        </div>
      </div>
    </div>
  );
}

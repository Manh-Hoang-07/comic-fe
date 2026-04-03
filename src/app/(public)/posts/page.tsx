import { publicEndpoints } from "@/lib/api/endpoints";
import { PostList } from "@/components/Features/Posts/PostList/Public/PostList";
import HeroBanner from "@/components/Features/Marketing/Banners/Public/HeroBanner";
import { serverFetch } from "@/lib/api/server-client";
import { Metadata } from "next";
import { Breadcrumbs } from "@/components/UI/Navigation/Breadcrumbs";

export const metadata: Metadata = {
  title: "Tin tức",
  description: "Cập nhật những thông tin mới nhất về ngành xây dựng, kiến trúc và hoạt động của công ty.",
};

async function getPostsData(searchParams: any) {
  const page = searchParams?.page || 1;
  const category = searchParams?.category;
  const search = searchParams?.search;
  const sort = searchParams?.sort || 'newest';

  const postsParams: any = {
    page,
    limit: 9,
    sort: sort === 'popular' ? 'view_count:desc' : 'created_at:desc',
  };

  if (category && category !== 'all') {
    postsParams["category_slug"] = category;
  }
  if (search) {
    postsParams["search"] = search;
  }

  const queryString = new URLSearchParams(postsParams).toString();

  const [postsRes, catsRes] = await Promise.all([
    serverFetch(`${publicEndpoints.posts.list}?${queryString}`, { revalidate: 300, skipCookies: true }),
    serverFetch(`${publicEndpoints.postCategories.list}?limit=100`, { revalidate: 3600, skipCookies: true })
  ]);

  return {
    posts: postsRes.data || [],
    meta: postsRes.meta || null,
    categories: catsRes.data || []
  };
}

export default async function PostsPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const resolvedSearchParams = await searchParams;
  const { posts, categories, meta } = await getPostsData(resolvedSearchParams);

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col pb-20 transition-colors duration-300">
      <HeroBanner locationCode="post" imageOnly={true} />

      <div className="container mx-auto px-4 mt-8 relative z-10">
        <Breadcrumbs items={[{ label: "Tin tức" }]} />
        <h1 className="text-4xl font-extrabold text-gray-900 mb-10 border-l-8 border-primary pl-6">Tin tức & Sự kiện</h1>
        <PostList initialPosts={posts} categories={categories} meta={meta} />
      </div>
    </div>
  );
}


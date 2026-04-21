import { publicEndpoints } from "@/lib/api/endpoints";
import { PostList } from "@/components/Features/Posts/PostList/Public/PostList";
import HeroBanner from "@/components/Features/Marketing/Banners/Public/HeroBanner";
import { serverFetch } from "@/lib/api/server-client";
import { Metadata } from "next";
import { Breadcrumbs } from "@/components/UI/Navigation/Breadcrumbs";
import { PUBLIC_PAGE_SIZE } from "@/config/constants";

export const metadata: Metadata = {
  title: "Tin tức",
  description: "Cập nhật những thông tin mới nhất về ngành xây dựng, kiến trúc và hoạt động của công ty.",
};

async function getPostsData(searchParams: Record<string, string | undefined>) {
  const page = searchParams?.page || 1;
  const category = searchParams?.category;
  const search = searchParams?.search;
  const sort = searchParams?.sort || 'newest';

  const postsParams: Record<string, string | number | undefined> = {
    page,
    limit: PUBLIC_PAGE_SIZE,
    sort: sort === 'popular' ? 'view_count:desc' : 'created_at:desc',
  };

  if (category && category !== 'all') {
    postsParams["category_slug"] = category;
  }
  if (search) {
    postsParams["search"] = search;
  }

  const filteredParams: Record<string, string> = {};
  for (const [key, value] of Object.entries(postsParams)) {
    if (value !== undefined) filteredParams[key] = String(value);
  }
  const queryString = new URLSearchParams(filteredParams).toString();

  const [postsRes, catsRes] = await Promise.all([
    serverFetch(`${publicEndpoints.posts.list}?${queryString}`, { revalidate: 300, skipCookies: true }),
    serverFetch(`${publicEndpoints.postCategories.list}?limit=100`, { revalidate: 3600, skipCookies: true })
  ]);

  return {
    posts: postsRes.data || [],
    meta: postsRes.meta ?? undefined,
    categories: catsRes.data || []
  };
}

export default async function PostsPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const resolvedSearchParams = await searchParams;
  // Normalize search params: take first value if array
  const normalizedParams: Record<string, string | undefined> = {};
  for (const [key, value] of Object.entries(resolvedSearchParams)) {
    normalizedParams[key] = Array.isArray(value) ? value[0] : value;
  }
  const { posts, categories, meta } = await getPostsData(normalizedParams);

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col pb-20 transition-colors duration-300">
      <HeroBanner locationCode="post" imageOnly={true} />

      <div className="container mx-auto px-4 mt-8 relative z-10">
        <Breadcrumbs items={[{ label: "Tin tức" }]} />
        <h1 className="text-4xl font-extrabold text-gray-900 mb-10 border-l-8 border-primary pl-6">Tin tức & Sự kiện</h1>
        <PostList initialPosts={posts} categories={categories} meta={meta as unknown as React.ComponentProps<typeof PostList>["meta"]} />
      </div>
    </div>
  );
}


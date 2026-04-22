import { Metadata } from "next";
import { notFound } from "next/navigation";
import { serverFetch } from "@/lib/api/server-client";
import { publicEndpoints } from "@/lib/api/endpoints";
import { Post } from "@/types/api";
import PostDetail from "@/components/Features/Posts/PostList/Public/PostDetail";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
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

export default async function PostDetailPage({ params }: Props) {
    const { slug } = await params;
    const post = await getPost(slug);

    if (!post) {
        notFound();
    }

    return <PostDetail post={post} />;
}

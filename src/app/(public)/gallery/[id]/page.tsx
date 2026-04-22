import { Metadata } from "next";
import { notFound } from "next/navigation";
import { serverFetch } from "@/lib/api/server-client";
import { publicEndpoints } from "@/lib/api/endpoints";
import GalleryDetail from "@/components/Features/Introduction/Gallery/Public/GalleryDetail";
import type { GalleryItem } from "@/components/Features/Introduction/Gallery/Public/GalleryDetail";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

async function getGalleryItem(id: string) {
    const { data, error } = await serverFetch<GalleryItem>(publicEndpoints.gallery.showBySlug(id), {
        revalidate: 3600,
        skipCookies: true,
    });

    if (error || !data) {
        return null;
    }

    // Ensure images is an array even if returned as string
    let processedImages = data.images;
    if (typeof data.images === 'string') {
        try {
            processedImages = JSON.parse(data.images);
        } catch (e) {
            processedImages = [];
        }
    }

    return {
        ...data,
        images: Array.isArray(processedImages) ? processedImages : []
    };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    const item = await getGalleryItem(id);
    if (!item) {
        return {
            title: "Dự án không tồn tại",
        };
    }
    return {
        title: `${item.title} | Thư viện dự án`,
        description: item.description,
    };
}

export default async function GalleryDetailPage({ params }: PageProps) {
    const { id } = await params;
    const item = await getGalleryItem(id);

    if (!item) {
        notFound();
    }

    return <GalleryDetail item={item} />;
}

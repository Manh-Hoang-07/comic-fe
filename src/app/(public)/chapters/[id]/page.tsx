import { Metadata } from "next";
import { notFound } from "next/navigation";
import "@/styles/comic.css";
import InfiniteScrollReader from "@/components/Features/Comics/Chapters/Public/InfiniteScrollReader";
import { fetchChapterFullData } from "@/app/(public)/chapters/actions";

interface Props {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    return {
        title: `Đang đọc chương | Comic Haven`,
    };
}

export default async function ReadingPage({ params }: Props) {
    const { id } = await params;

    // Use the comprehensive data fetcher (same one used for infinite loading)
    const initialData = await fetchChapterFullData(id);

    if (!initialData || !initialData.pages) notFound();

    return (
        <main className="bg-[#f8f9fa] min-h-screen text-gray-900 pt-24 pb-32">
            <InfiniteScrollReader initialData={initialData} />
        </main>
    );
}

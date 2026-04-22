import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getComicDetail, getComicChapters } from "@/lib/api/public/comic";
import { getComicComments } from "@/lib/api/public/comment";
import ComicDetail from "@/components/Features/Comics/ComicList/Public/ComicDetail";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const comic = await getComicDetail(slug);
    if (!comic) return { title: "Không tìm thấy truyện" };

    return {
        title: `${comic.title} | Comic Haven`,
        description: comic.description,
        openGraph: {
            images: [comic.cover_image],
        },
    };
}

export default async function ComicDetailPage({ params }: Props) {
    const { slug } = await params;
    const comic = await getComicDetail(slug);

    if (!comic) notFound();

    // Fetch chapters va comments SONG SONG (truoc day comments phai doi comic xong moi goi)
    const [chaptersData, commentsData] = await Promise.all([
        getComicChapters(slug),
        getComicComments(comic.id, 1)
    ]);

    return <ComicDetail comic={comic} chaptersData={chaptersData} commentsData={commentsData} />;
}

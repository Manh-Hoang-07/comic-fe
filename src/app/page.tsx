import { Metadata } from "next";
import Image from "next/image";
import { getComicHomepageData } from "@/lib/api/public/comic";
import { TrendingHero } from "@/components/Features/Comics/ComicList/Public/TrendingHero";
import { ComicSection } from "@/components/Features/Comics/ComicList/Public/ComicSection";
import { CategorySidebar } from "@/components/Features/Comics/Categories/Public/CategorySidebar";
import Link from "next/link";
import { formatNumber } from "@/utils/formatters";
import "@/styles/comic.css";
import { PublicHeader, PublicFooter, PublicLayoutWrapper } from "@/components/Layouts/Public";
import { getSystemConfig } from "@/lib/api/public/general";
import { getPublicMenus } from "@/lib/api/public/menu";


export const metadata: Metadata = {
    title: "Trang Chủ | Comic Haven - Thế Giới Truyện Tranh Miễn Phí",
    description: "Trang web đọc truyện tranh online lớn nhất với hàng ngàn đầu truyện hấp dẫn được cập nhật mỗi ngày.",
};

// Enable ISR: Revalidate every 60 seconds
export const revalidate = 60;

export default async function ComicHomePage() {
    const [data, systemConfig, menus] = await Promise.all([
        getComicHomepageData(),
        getSystemConfig("general"),
        getPublicMenus(),
    ]);

    if (!data) {
        return (
            <PublicLayoutWrapper
                contactChannels={systemConfig?.contact_channels}
                header={<PublicHeader key="header" systemConfig={systemConfig} initialMenus={menus} />}
                footer={<PublicFooter key="footer" systemConfig={systemConfig} />}
            >
                <div className="flex justify-center items-center min-h-screen bg-gray-50">
                    <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md">
                        <svg className="w-20 h-20 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Có lỗi xảy ra</h2>
                        <p className="text-gray-600 mb-6">Không thể kết nối được với máy chủ để lấy dữ liệu trang chủ.</p>
                        <Link href="/" className="inline-block px-6 py-2 bg-red-600 text-white rounded-full font-bold hover:bg-red-700 transition">
                            Thử lại
                        </Link>
                    </div>
                </div>
            </PublicLayoutWrapper>
        );
    }

    return (
        <PublicLayoutWrapper
            contactChannels={systemConfig?.contact_channels}
            header={<PublicHeader key="header" systemConfig={systemConfig} initialMenus={menus} />}
            footer={<PublicFooter key="footer" systemConfig={systemConfig} />}
        >
            <main className="bg-[#f8f9fa] min-h-screen">
                <div className="container mx-auto px-4 py-8">
                    {/* SEO H1 */}
                    <h1 className="sr-only">{systemConfig?.site_name || "Comic Haven"} - Thế giới truyện tranh trực tuyến</h1>

                    {/* Hero Section - Trending */}
                    <TrendingHero comics={data.trending_comics || []} />

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Main Content Area */}
                        <div className="flex-1">
                            {/* Newest Updates */}
                            <ComicSection
                                title="Mới cập nhật"
                                comics={data.recent_update_comics || []}
                                viewAllLink="/comics?sort=last_chapter_updated_at:desc"
                            />

                            {/* Popular Comics */}
                            <ComicSection
                                title="Truyện phổ biến"
                                comics={data.popular_comics || []}
                                viewAllLink="/comics?sort=view_count:desc"
                            />

                            {/* New Comics */}
                            <ComicSection
                                title="Truyện mới đăng"
                                comics={data.newest_comics || []}
                                viewAllLink="/comics?sort=created_at:desc"
                            />
                        </div>

                        {/* Sidebar Area */}
                        <aside className="lg:w-80 w-full">
                            <div className="sticky top-24 space-y-8">
                                {/* Categories Sidebar */}
                                <CategorySidebar categories={data.comic_categories || []} />

                                {/* Top Viewed (Mini list) */}
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                    <h3 className="text-xl font-extrabold mb-6 border-b pb-2 text-gray-800 uppercase tracking-tighter">
                                        Xem nhiều nhất
                                    </h3>
                                    <div className="space-y-4">
                                        {(data.top_viewed_comics || []).map((comic, idx) => (
                                            <div key={comic.id} className="flex gap-4 group cursor-pointer">
                                                <div className="relative w-16 h-20 flex-shrink-0 overflow-hidden rounded-lg">
                                                    <Image
                                                        src={comic.cover_image}
                                                        alt={comic.title}
                                                        width={64}
                                                        height={80}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                        sizes="64px"
                                                    />
                                                    <div className="absolute top-0 left-0 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-br-lg">
                                                        #{idx + 1}
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-sm text-gray-800 line-clamp-2 group-hover:text-red-500 transition-colors">
                                                        {comic.title}
                                                    </h4>
                                                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                                                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                                                        {formatNumber(comic.stats?.view_count)} lượt xem
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>
        </PublicLayoutWrapper>
    );
}

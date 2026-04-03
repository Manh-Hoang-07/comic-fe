import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/UI/Navigation/Button";
import { serverFetch } from "@/lib/api/server-client";
import { publicEndpoints } from "@/lib/api/endpoints";

interface GalleryItem {
    id: number;
    title: string;
    slug: string;
    description: string;
    cover_image: string;
    images: string[];
    featured: boolean;
    status: string;
    category?: string; // Optional if missing from payload
    date?: string;     // Optional
}

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

    // Default category if missing
    const categoryName = item.category || "Dự án";

    return (
        <div className="container mx-auto p-6 max-w-5xl">
            <div className="mb-6">
                <Link href="/gallery" className="text-gray-600 hover:text-gray-900 flex items-center">
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Quay lại danh sách
                </Link>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-6">{item.title}</h1>

            <div className="h-[500px] bg-gray-200 mb-8 rounded-lg overflow-hidden relative shadow-md">
                {item.cover_image ? (
                    <Image
                        src={item.cover_image}
                        alt={item.title || "Project Image"}
                        fill
                        className="object-cover"
                        priority
                    />
                ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gray-300 text-gray-500">
                        <span className="text-6xl">🖼️</span>
                    </div>
                )}
                {item.featured && (
                    <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1.5 text-sm rounded font-bold shadow-sm">
                        Nổi bật
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="md:col-span-2">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Mô tả dự án</h2>
                    <div className="prose max-w-none text-gray-600">
                        {item.description.split('\n').map((paragraph, idx) => (
                            <p key={idx} className="mb-4">{paragraph}</p>
                        ))}
                    </div>

                    {/* Additional Images Gallery */}
                    {Array.isArray(item.images) && item.images.length > 0 && (
                        <div className="mt-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Hình ảnh chi tiết</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {item.images.map((img, index) => (
                                    <div key={index} className="relative h-64 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                        <Image
                                            src={img}
                                            alt={`${item.title} - ${index + 1}`}
                                            fill
                                            className="object-cover hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-gray-50 p-6 rounded-lg shadow-sm h-fit">
                    <h3 className="font-bold text-gray-900 mb-4 text-lg">Thông tin chi tiết</h3>
                    <div className="space-y-4 text-sm">
                        <div className="border-b border-gray-200 pb-3">
                            <span className="block text-gray-500 mb-1">Danh mục</span>
                            <span className="font-medium text-gray-900">{categoryName}</span>
                        </div>
                        {item.date && (
                            <div className="border-b border-gray-200 pb-3">
                                <span className="block text-gray-500 mb-1">Ngày hoàn thành</span>
                                <span className="font-medium text-gray-900">{item.date}</span>
                            </div>
                        )}
                        <div className="border-b border-gray-200 pb-3">
                            <span className="block text-gray-500 mb-1">Trạng thái</span>
                            <span className="font-medium text-gray-900 capitalize">{item.status}</span>
                        </div>
                        <div>
                            <span className="block text-gray-500 mb-1">Chia sẻ</span>
                            <div className="flex gap-2">
                                {/* Social share placeholders */}
                                <Button size="sm" variant="outline">Facebook</Button>
                                <Button size="sm" variant="outline">Twitter</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-8 text-center text-white">
                <h2 className="text-2xl font-bold mb-4">Thích dự án này?</h2>
                <p className="mb-6 max-w-2xl mx-auto opacity-90">
                    Chúng tôi có thể thực hiện một dự án tương tự cho bạn. Hãy liên hệ ngay hôm nay để được tư vấn miễn phí.
                </p>
                <div className="flex justify-center gap-4">
                    <Link href="/contact">
                        <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                            Liên hệ ngay
                        </Button>
                    </Link>
                    <Link href="/gallery">
                        <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                            Xem dự án khác
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

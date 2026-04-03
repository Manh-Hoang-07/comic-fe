import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/UI/Navigation/Button";
import { serverFetch } from "@/lib/api/server-client";
import { publicEndpoints } from "@/lib/api/endpoints";

interface Certificate {
    id: number;
    name: string;
    description: string;
    image: string;
    issued_by: string;
    issued_date: string | object | null;
    expiry_date: string | object | null;
    certificate_number: string;
    type: string;
    status: string;
    skills?: string[]; // Keeping optional if not in payload
    verification_url?: string; // Keeping optional
}

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

// Helper to format date safely
const formatDate = (date: string | object | null | undefined) => {
    if (!date || typeof date === 'object') return null;
    try {
        return new Date(date).toLocaleDateString('vi-VN');
    } catch (e) {
        return null;
    }
};

const getDateObject = (date: string | object | null | undefined) => {
    if (!date || typeof date === 'object') return null;
    return new Date(date);
}

async function getCertificate(id: string) {
    const { data, error } = await serverFetch<Certificate>(publicEndpoints.certificates.show(id), {
        revalidate: 3600,
        skipCookies: true,
    });

    if (error || !data) {
        return null;
    }
    return data;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    const cert = await getCertificate(id);
    if (!cert) {
        return {
            title: "Chứng chỉ không tồn tại",
        };
    }
    return {
        title: `${cert.name} | Chứng chỉ`,
        description: cert.description,
    };
}

export default async function CertificateDetailPage({ params }: PageProps) {
    const { id } = await params;
    const cert = await getCertificate(id);

    if (!cert) {
        notFound();
    }

    const issuedDate = formatDate(cert.issued_date);
    const expiryDate = formatDate(cert.expiry_date);

    const end = getDateObject(cert.expiry_date);
    const isExpired = end ? end.getTime() < Date.now() : false;

    return (
        <div className="container mx-auto p-6 max-w-5xl">
            <div className="mb-6">
                <Link href="/certificates" className="text-gray-600 hover:text-gray-900 flex items-center">
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Quay lại danh sách
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
                <div className="md:flex">
                    <div className="md:w-1/2 bg-gray-100 flex items-center justify-center p-8 border-b md:border-b-0 md:border-r border-gray-200">
                        <div className="relative w-full h-[400px]">
                            {cert.image ? (
                                <Image
                                    src={cert.image}
                                    alt={cert.name || "Certificate Image"}
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center bg-gray-200 text-gray-500">
                                    <span className="text-6xl">📜</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="md:w-1/2 p-8">
                        <div className="flex justify-between items-start mb-4">
                            <h1 className="text-2xl font-bold text-gray-900">{cert.name}</h1>
                            {isExpired && (
                                <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded">Đã hết hạn</span>
                            )}
                        </div>

                        <div className="mb-6 text-gray-600">
                            <p className="mb-4">{cert.description}</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-1">Cấp bởi</h3>
                                <p className="text-gray-700">{cert.issued_by}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-1">Loại</h3>
                                <p className="text-gray-700 capitalize">{cert.type}</p>
                            </div>
                            {issuedDate && (
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">Ngày cấp</h3>
                                    <p className="text-gray-700">{issuedDate}</p>
                                </div>
                            )}
                            {expiryDate && (
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">Hết hạn</h3>
                                    <p className="text-gray-700">{expiryDate}</p>
                                </div>
                            )}
                            {cert.certificate_number && (
                                <div className="col-span-1 sm:col-span-2">
                                    <h3 className="font-semibold text-gray-900 mb-1">Số chứng chỉ</h3>
                                    <code className="bg-gray-100 px-2 py-1 rounded text-sm text-gray-800">{cert.certificate_number}</code>
                                </div>
                            )}
                        </div>

                        <div className="mb-8">
                            <h3 className="font-semibold text-gray-900 mb-2">Trạng thái</h3>
                            <span className={`px-2 py-1 rounded text-sm capitalize ${cert.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                {cert.status}
                            </span>
                        </div>

                        {cert.verification_url && (
                            <a href={cert.verification_url} target="_blank" rel="noopener noreferrer" className="block w-full">
                                <Button className="w-full justify-center">
                                    Xác thực chứng chỉ
                                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </Button>
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer CTA */}
            <div className="mt-12 text-center">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Bạn có câu hỏi về năng lực của chúng tôi?</h2>
                <div className="flex justify-center gap-4">
                    <Link href="/contact">
                        <Button size="lg" variant="outline">
                            Liên hệ tư vấn
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

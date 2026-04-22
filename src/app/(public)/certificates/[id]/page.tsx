import { Metadata } from "next";
import { notFound } from "next/navigation";
import { serverFetch } from "@/lib/api/server-client";
import { publicEndpoints } from "@/lib/api/endpoints";
import CertificateDetail from "@/components/Features/Introduction/Certificates/Public/CertificateDetail";
import type { Certificate } from "@/components/Features/Introduction/Certificates/Public/CertificateDetail";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
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

    return <CertificateDetail cert={cert} />;
}

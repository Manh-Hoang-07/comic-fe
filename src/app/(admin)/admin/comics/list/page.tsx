import { Suspense } from "react";
import { Metadata } from "next";
import AdminComics from "@/components/Features/Comics/ComicList/Admin/AdminComics";
import PageMeta from "@/components/UI/Navigation/PageMeta";

export const metadata: Metadata = {
    title: "Quản lý Truyện tranh | Admin",
    description: "Quản lý thư viện truyện tranh",
};

export default function ComicsPage() {
    return (
        <div className="w-full p-4">
            <PageMeta
                title="Truyện tranh"
                breadcrumbs={[
                    { label: "Trang quản trị", href: "/admin" },
                    { label: "Comic" },
                    { label: "Truyện tranh" },
                ]}
            />
            <Suspense fallback={<div>Đang tải...</div>}>
                <AdminComics />
            </Suspense>
        </div>
    );
}



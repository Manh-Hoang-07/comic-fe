import { Suspense } from "react";
import { Metadata } from "next";
import AdminChapters from "@/components/Features/Comics/Chapters/Admin/AdminChapters";
import PageMeta from "@/components/UI/Navigation/PageMeta";

export const metadata: Metadata = {
    title: "Quản lý Chương truyện | Admin",
    description: "Quản lý nội dung chương truyện",
};

export default function ChaptersPage() {
    return (
        <div className="w-full p-4">
            <PageMeta
                title="Chương truyện"
                breadcrumbs={[
                    { label: "Trang quản trị", href: "/admin" },
                    { label: "Comic" },
                    { label: "Chương truyện" },
                ]}
            />
            <Suspense fallback={<div>Đang tải...</div>}>
                <AdminChapters />
            </Suspense>
        </div>
    );
}



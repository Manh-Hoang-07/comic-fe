import { Suspense } from "react";
import { Metadata } from "next";
import AdminComicCategories from "@/components/Features/Comics/Categories/Admin/AdminComicCategories";
import PageMeta from "@/components/UI/Navigation/PageMeta";

export const metadata: Metadata = {
    title: "Danh mục truyện | Admin",
    description: "Quản lý phân loại truyện tranh",
};

export default function ComicCategoriesPage() {
    return (
        <div className="w-full p-4">
            <PageMeta
                title="Danh mục truyện"
                breadcrumbs={[
                    { label: "Trang quản trị", href: "/admin" },
                    { label: "Comic" },
                    { label: "Danh mục truyện" },
                ]}
            />
            <Suspense fallback={<div>Đang tải...</div>}>
                <AdminComicCategories />
            </Suspense>
        </div>
    );
}




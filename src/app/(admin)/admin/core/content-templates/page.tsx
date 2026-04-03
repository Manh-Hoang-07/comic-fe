import { Suspense } from "react";
import { Metadata } from "next";
import AdminContentTemplates from "@/components/Features/Core/ContentTemplates/Admin/AdminContentTemplates";
import PageMeta from "@/components/UI/Navigation/PageMeta";

export const metadata: Metadata = {
    title: "Quản lý Mẫu nội dung | Admin",
    description: "Quản lý danh sách các mẫu nội dung Email, SMS, Telegram, Zalo",
};

export default function AdminContentTemplatesPage() {
    return (
        <div className="w-full">
            <PageMeta
                title="Quản lý Mẫu nội dung"
                breadcrumbs={[
                    { label: "Trang quản trị", href: "/admin", },
                    { label: "Mẫu nội dung" },
                ]}
            />
            <Suspense fallback={
                <div className="p-8 flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            }>
                <AdminContentTemplates />
            </Suspense>
        </div>
    );
}



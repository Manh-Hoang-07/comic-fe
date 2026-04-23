import AdminPostComments from "@/components/Features/Posts/Comments/Admin/AdminPostComments";
import PageMeta from "@/components/UI/Navigation/PageMeta";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Quản lý bình luận | Admin Dashboard",
    description: "Quản lý tất cả bình luận của bài viết trên hệ thống",
};

export default function AdminPostCommentsPage() {
    return (
        <div className="p-4 md:p-6 lg:p-8">
            <PageMeta
                title="Bình luận bài viết"
                breadcrumbs={[
                    { label: "Trang quản trị", href: "/admin" },
                    { label: "Bài viết" },
                    { label: "Bình luận" },
                ]}
            />
            <AdminPostComments />
        </div>
    );
}



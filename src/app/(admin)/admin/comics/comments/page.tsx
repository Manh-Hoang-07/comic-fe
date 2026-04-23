import AdminComicComments from "@/components/Features/Comics/Comments/Admin/AdminComicComments";
import PageMeta from "@/components/UI/Navigation/PageMeta";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Quản lý bình luận truyện | Admin",
    description: "Quản lý bình luận của người dùng trên các bộ truyện",
};

export default function AdminComicCommentsPage() {
    return (
        <div className="p-4 md:p-6 lg:p-8">
            <PageMeta
                title="Bình luận truyện"
                breadcrumbs={[
                    { label: "Trang quản trị", href: "/admin" },
                    { label: "Truyện tranh" },
                    { label: "Bình luận" },
                ]}
            />
            <AdminComicComments />
        </div>
    );
}



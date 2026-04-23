import { Metadata } from "next";
import ComicStats from "@/components/Features/Comics/Statistics/Admin/ComicStats";
import PageMeta from "@/components/UI/Navigation/PageMeta";

export const metadata: Metadata = {
    title: "Thống kê & Báo cáo | Admin",
    description: "Thống kê chi tiết về truyện tranh",
};

export default function ComicStatsPage() {
    return (
        <>
            <PageMeta
                title="Thống kê truyện"
                breadcrumbs={[
                    { label: "Trang quản trị", href: "/admin" },
                    { label: "Truyện tranh" },
                    { label: "Thống kê" },
                ]}
            />
            <ComicStats />
        </>
    );
}

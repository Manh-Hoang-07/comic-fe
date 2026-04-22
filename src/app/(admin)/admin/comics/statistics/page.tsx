import { Metadata } from "next";
import ComicStats from "@/components/Features/Comics/Statistics/Admin/ComicStats";

export const metadata: Metadata = {
    title: "Thống kê & Báo cáo | Admin",
    description: "Thống kê chi tiết về truyện tranh",
};

export default function ComicStatsPage() {
    return <ComicStats />;
}

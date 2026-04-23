import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import PageMeta from "@/components/UI/Navigation/PageMeta";

const AdminPostStatistics = dynamic(
    () => import('@/components/Features/Posts/PostList/Admin/AdminPostStatistics'),
    {
        loading: () => (
            <div className="p-6 animate-pulse space-y-6">
                <div className="h-8 w-64 bg-gray-200 rounded" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[...Array(3)].map((_, i) => <div key={i} className="h-32 bg-gray-200 rounded-xl" />)}
                </div>
                <div className="h-64 bg-gray-200 rounded-xl" />
            </div>
        ),
    }
);

export const metadata: Metadata = {
    title: 'Thống kê bài viết | Admin',
    description: 'Thống kê và phân tích bài viết',
};

export default function AdminPostStatisticsPage() {
    return (
        <>
            <PageMeta
                title="Thống kê bài viết"
                breadcrumbs={[
                    { label: "Trang quản trị", href: "/admin" },
                    { label: "Bài viết" },
                    { label: "Thống kê" },
                ]}
            />
            <AdminPostStatistics />
        </>
    );
}



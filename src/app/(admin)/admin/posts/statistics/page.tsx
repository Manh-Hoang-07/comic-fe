import { Metadata } from 'next';
import AdminPostStatistics from '@/components/Features/Posts/PostList/Admin/AdminPostStatistics';

export const metadata: Metadata = {
    title: 'Thống kê bài viết | Admin',
    description: 'Thống kê và phân tích bài viết',
};

export default function AdminPostStatisticsPage() {
    return <AdminPostStatistics />;
}



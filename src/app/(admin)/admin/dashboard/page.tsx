import { Metadata } from "next";
import PageMeta from "@/components/UI/Navigation/PageMeta";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard | Admin",
  description: "Tổng quan hệ thống",
};

export default function AdminDashboardPage() {
  return (
    <div className="w-full p-4">
      <PageMeta
        title="Bảng điều khiển"
        breadcrumbs={[
          { label: "Trang quản trị", href: "/admin" },
          { label: "Tổng quan" },
        ]}
      />
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Tổng quan về hoạt động của hệ thống</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng người dùng</p>
              <p className="text-2xl font-semibold text-gray-900">1250</p>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-green-600">+12%</span>
            <span className="text-sm text-gray-600"> so với tháng trước</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-pink-100 text-pink-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Lượt theo dõi</p>
              <p className="text-2xl font-semibold text-gray-900">12,450</p>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-green-600">+8%</span>
            <span className="text-sm text-gray-600"> so với tháng trước</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng số truyện</p>
              <p className="text-2xl font-semibold text-gray-900">842</p>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-green-600">+15%</span>
            <span className="text-sm text-gray-600"> so với tháng trước</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng số chương</p>
              <p className="text-2xl font-semibold text-gray-900">15,680</p>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-green-600">+5%</span>
            <span className="text-sm text-gray-600"> so với tháng trước</span>
          </div>
        </div>
      </div>
    </div>
  );
}




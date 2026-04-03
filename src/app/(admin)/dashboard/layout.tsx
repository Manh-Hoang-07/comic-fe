"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { AdminSidebar, AdminHeader } from "@/components/Layouts/Admin";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);

    // Khởi tạo lần đầu: desktop thì mở sidebar, mobile thì đóng
    const initialWidth = window.innerWidth;
    const isMobileSize = initialWidth < 1024;
    setIsMobile(isMobileSize);
    if (!isMobileSize) {
      setSidebarOpen(true); // Desktop: mở sidebar mặc định
    }

    // Handle resize - chỉ update isMobile, không thay đổi sidebar state
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="admin-layout flex min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Sidebar */}
      <AdminSidebar
        isOpen={isMounted && sidebarOpen}
        onClose={closeSidebar}
      />

      {/* Mobile overlay */}
      {isMounted && sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Main content */}
      <div
        className={`flex-1 min-w-0 flex flex-col transition-all duration-300 main-content ${isMounted && sidebarOpen && !isMobile ? "lg:ml-64" : ""
          }`}
      >
        <AdminHeader
          onToggleSidebar={toggleSidebar}
        />
        <main className="flex-1 min-w-0 pt-16">{children}</main>
      </div>
    </div>
  );
}







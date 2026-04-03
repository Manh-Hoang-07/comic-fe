"use client";

// Force hydrate update
import { useAuthStore } from "@/lib/store/authStore";
import { usePageStore } from "@/lib/store/pageStore";
import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const PATH_MAP: Record<string, string> = {
  admin: "Trang quản trị",
  dashboard: "Tổng quan",
  users: "Thành viên",
  posts: "Bài viết",
  "SystemConfigs": "Cấu hình hệ thống",
  general: "Cấu hình chung",
  email: "Cấu hình Email",
  roles: "Phân quyền",
  permissions: "Quyền hạn",
  products: "Sản phẩm",
  orders: "Đơn hàng",
  categories: "Danh mục",
  profile: "Hồ sơ cá nhân",
  comics: "Truyện tranh",
  chapters: "Chương truyện",
  "comic-categories": "Danh mục truyện",
  "comic-stats": "Thống kê",
  warehouses: "Kho bãi",
  exports: "Xuất kho",
  imports: "Nhập kho",
  transfers: "Điều chuyển",
};

function Breadcrumbs() {
  const pathname = usePathname();
  const { title: pageTitle, breadcrumbs: pageBreadcrumbs } = usePageStore();

  const crumbs = useMemo(() => {
    // Priority: Page declared breadcrumbs
    if (pageBreadcrumbs && pageBreadcrumbs.length > 0) {
      return pageBreadcrumbs.map((crumb, index) => ({
        href: crumb.href,
        label: crumb.label,
        isLast: index === pageBreadcrumbs.length - 1
      }));
    }

    if (!pathname) return [];

    // Fallback: Auto generated from path
    const path = pathname.split("?")[0];
    const segments = path.split("/").filter(Boolean);

    // Build crumbs
    const items = segments.map((segment, index) => {
      const href = "/" + segments.slice(0, index + 1).join("/");
      const label = PATH_MAP[segment] || segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
      return { href, label, isLast: index === segments.length - 1 };
    });

    return items;
  }, [pathname, pageBreadcrumbs]);

  // Keep showing title if available, or at least 1 crumb
  if (crumbs.length === 0 && !pageTitle) return null;

  return (
    <div className="hidden md:flex items-center gap-2 overflow-hidden whitespace-nowrap">
      {crumbs.map((crumb, index) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          {index > 0 && (
            <svg className="h-3 w-3 text-gray-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
          {crumb.href && !crumb.isLast ? (
            <Link href={crumb.href} className="font-medium text-gray-500 hover:text-blue-600 transition-colors">
              {crumb.label}
            </Link>
          ) : (
            <span
              className={`font-medium ${crumb.isLast ? "text-gray-900" : "text-gray-500"}`}
            >
              {crumb.label}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

export function AdminHeader({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
  const { user, logout } = useAuthStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-20">
      <div className="flex items-center gap-4">
        {/* Mobile menu toggle */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <Breadcrumbs />
      </div>

      <div className="flex items-center gap-4">
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 p-1.5 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
              {user?.name?.charAt(0) || user?.email?.charAt(0) || "A"}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-sm font-medium text-gray-900 leading-none">{user?.name || "Admin User"}</div>
              <div className="text-xs text-gray-500 mt-1">{user?.email || "admin@example.com"}</div>
            </div>
            <svg className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-30">
              <Link href="/admin/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Hồ sơ cá nhân
              </Link>
              <button
                onClick={() => logout()}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}



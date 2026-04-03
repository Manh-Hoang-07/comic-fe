"use client";

import { useMemo, useCallback } from "react";
import { usePathname } from "next/navigation";

export interface MenuItem {
  id?: string;
  name: string;
  path?: string;
  api?: string;
  icon: string;
  status: "active" | "inactive";
  children?: MenuItem[];
  hasDynamicChildren?: boolean;
  permissions?: string[];
  roles?: string[];
  requiresAuth?: boolean;
  order?: number;
  parentId?: string;
  type?: "admin" | "user" | "public";
  external?: boolean;
  target?: "_blank" | "_self";
  badge?: {
    text: string;
    color?: string;
    variant?: "primary" | "secondary" | "succes" | "warning" | "danger" | "info";
  };
  tooltip?: string;
  disabled?: boolean;
}

export type MenuType = "user" | "public";

export interface UserNavigationResult {
  menuItems: MenuItem[];
  userMenuItems: MenuItem[];
  currentPath: string;
  getMenuItemsByType: (type: MenuType) => MenuItem[];
  isActiveMenuItem: (item: MenuItem) => boolean;
}

function filterByStatus(items: MenuItem[], status: "active" | "inactive"): MenuItem[] {
  return items
    .filter((item) => item.status === status)
    .map((item) => ({
      ...item,
      children: item.children ? filterByStatus(item.children, status) : undefined,
    }));
}

function isMenuItemActive(item: MenuItem, currentPath: string): boolean {
  if (!currentPath || !item.path) return false;
  return currentPath === item.path;
}

export function useUserNavigation(): UserNavigationResult {
  const pathname = usePathname();

  // Current path từ route
  const currentPath = useMemo(() => pathname, [pathname]);

  // Menu items cho người dùng
  const menuItems = useMemo<MenuItem[]>(
    () => [
      {
        name: "Trang chủ",
        path: "/",
        api: "",
        icon: "🏠",
        status: "active",
      },
      {
        name: "Giới thiệu",
        path: "/about",
        api: "api/Abouts",
        icon: "ℹ️",
        status: "active",
        children: [
          {
            name: "Về chúng tôi",
            path: "/about",
            icon: "🏢",
            status: "active",
          },
          {
            name: "Đội ngũ",
            path: "/staff",
            icon: "👥",
            status: "active",
          },
          {
            name: "Chứng chỉ",
            path: "/certificates",
            icon: "🏆",
            status: "active",
          },
        ],
      },
      {
        name: "Dự án",
        path: "/projects",
        api: "api/projects",
        icon: "🏗️",
        status: "active",
      },
      {
        name: "Dịch vụ",
        path: "/services",
        api: "",
        icon: "🛠️",
        status: "active",
      },
      {
        name: "Thư viện",
        path: "/gallery",
        api: "api/gallery",
        icon: "📸",
        status: "active",
      },
      {
        name: "FAQ",
        path: "/faqs",
        api: "api/faqs",
        icon: "❓",
        status: "active",
      },
      {
        name: "Liên hệ",
        path: "/contact",
        api: "api/contact",
        icon: "📞",
        status: "active",
      },
    ],
    []
  );

  // Menu items cho người dùng đã đăng nhập
  const userMenuItems = useMemo<MenuItem[]>(
    () => [
      {
        name: "Tài khoản của tôi",
        path: "/user/profile",
        api: "api/user/profile",
        icon: "👤",
        status: "active",
      },
      {
        name: "Lịch sử đọc",
        path: "/user/reading-histories",
        api: "api/user/reading-history",
        icon: "📖",
        status: "active",
      },
      {
        name: "Truyện yêu thích",
        path: "/user/bookmarks",
        api: "api/user/bookmarks",
        icon: "❤️",
        status: "active",
      },
      {
        name: "Đang theo dõi",
        path: "/user/follows",
        api: "api/user/follows",
        icon: "⭐",
        status: "active",
      },
      {
        name: "Cài đặt",
        path: "/user/profile/edit",
        api: "api/user/settings",
        icon: "⚙️",
        status: "active",
      },
    ],
    []
  );

  // Menu items đã được filter - đơn giản chỉ filter theo status
  const filteredMenuItems = useMemo(
    () => filterByStatus(menuItems, "active"),
    [menuItems]
  );

  // Hàm để lấy menu items theo loại
  const getMenuItemsByType = useCallback(
    (type: MenuType): MenuItem[] => {
      switch (type) {
        case "user":
          return filterByStatus(userMenuItems, "active");
        default:
          return filteredMenuItems;
      }
    },
    [userMenuItems, filteredMenuItems]
  );

  // Hàm để kiểm tra menu item có active không
  const isActiveMenuItem = useCallback(
    (item: MenuItem): boolean => {
      return isMenuItemActive(item, currentPath);
    },
    [currentPath]
  );

  return {
    menuItems: filteredMenuItems,
    userMenuItems,
    currentPath,
    getMenuItemsByType,
    isActiveMenuItem,
  };
}




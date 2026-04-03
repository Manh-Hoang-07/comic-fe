"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

interface MenuItem {
  name: string;
  path: string;
  icon?: string;
  children?: MenuItem[];
}

interface SidebarMenuProps {
  menuItems: MenuItem[] | { value: MenuItem[] };
  activePath?: string;
  sidebarOpen?: boolean;
  loading?: boolean;
  error?: string | null;
  onSelect?: (item: MenuItem) => void;
  onClose?: () => void;
  children?: React.ReactNode;
}

export default function SidebarMenu({
  menuItems,
  activePath,
  sidebarOpen = true,
  loading = false,
  error = null,
  onSelect,
  onClose,
  children,
}: SidebarMenuProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMounted, setIsMounted] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const menuItemsArray = useMemo(() => {
    if (!isMounted) return [];
    return Array.isArray(menuItems) ? menuItems : (menuItems as any).value || [];
  }, [menuItems, isMounted]);

  const isActivePath = useCallback((path: string): boolean => {
    if (path.includes("?")) {
      const [pathOnly, search] = path.split("?");
      const query = Object.fromEntries(new URLSearchParams(search));

      if (pathname !== pathOnly) return false;

      for (const [key, value] of Object.entries(query)) {
        if (searchParams.get(key) !== value) return false;
      }
      return true;
    } else {
      return pathname === path;
    }
  }, [pathname, searchParams]);

  const isSubmenuActive = useCallback((item: MenuItem): boolean => {
    if (!item.children) return false;
    return item.children.some((child) => isActivePath(child.path));
  }, [isActivePath]);

  const toggleSubmenu = useCallback((menuName: string) => {
    setExpandedMenus((prev) => {
      const index = prev.indexOf(menuName);
      if (index > -1) {
        return prev.filter((name) => name !== menuName);
      } else {
        return [...prev, menuName];
      }
    });
  }, []);

  const handleMenuClick = useCallback((path: string) => {
    if (path.includes("?")) {
      const [pathOnly, search] = path.split("?");
      const query = Object.fromEntries(new URLSearchParams(search));
      router.push(`${pathOnly}?${new URLSearchParams(query).toString()}`);
    } else {
      router.push(path);
    }
  }, [router]);

  useEffect(() => {
    const currentSubmenu = menuItemsArray.find(
      (item: any) => item.children && item.children.some((child: any) => isActivePath(child.path))
    );
    if (currentSubmenu && !expandedMenus.includes(currentSubmenu.name)) {
      setExpandedMenus((prev) => [...prev, currentSubmenu.name]);
    }
  }, [menuItemsArray, isActivePath, expandedMenus]);

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 h-screen overflow-y-auto bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl transform transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            AdminHub
          </span>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {children}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
            <p className="text-sm text-slate-400">Đang tải menu...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="text-red-400 text-4xl">⚠️</div>
            <p className="text-sm text-red-400 text-center px-4">{error}</p>
          </div>
        )}

        {/* Menu Items */}
        {!loading && !error && (
          <>
            {menuItemsArray.map((item: any) => (
              <div key={item.name}>
                {/* Menu with children */}
                {item.children ? (
                  <>
                    <button
                      onClick={() => toggleSubmenu(item.name)}
                      className={`group flex items-center w-full justify-between px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 min-h-[48px] hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-purple-500/20 hover:text-white hover:shadow-lg hover:scale-105 ${expandedMenus.includes(item.name) || isSubmenuActive(item)
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105"
                        : "text-slate-300"
                        }`}
                    >
                      <div className="flex items-center w-full truncate">
                        {item.icon && (
                          <span className="w-5 h-5 mr-3 transition-transform duration-200 text-center">
                            {item.icon}
                          </span>
                        )}
                        <span className="truncate" title={item.name}>
                          {item.name}
                        </span>
                      </div>
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ml-2 ${expandedMenus.includes(item.name) ? "rotate-180" : ""
                          }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Submenu */}
                    {expandedMenus.includes(item.name) && (
                      <div className="ml-6 space-y-1 transition-all duration-200">
                        {item.children.map((child: any) => (
                          <Link
                            key={child.path}
                            href={child.path}
                            onClick={() => {
                              onSelect?.(child);
                              handleMenuClick(child.path);
                            }}
                            className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-purple-500/20 hover:text-white hover:shadow-md hover:scale-105 ${isActivePath(child.path)
                              ? "bg-gradient-to-r from-blue-500/80 to-purple-600/80 text-white shadow-md scale-105"
                              : "text-slate-400"
                              }`}
                          >
                            {child.icon && (
                              <span className="w-4 h-4 mr-3 transition-transform duration-200 text-center">
                                {child.icon}
                              </span>
                            )}
                            <span className="truncate" title={child.name}>
                              {child.name}
                            </span>
                            {isActivePath(child.path) && (
                              <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
                            )}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  /* Menu without children */
                  <Link
                    href={item.path}
                    onClick={() => {
                      onSelect?.(item);
                      handleMenuClick(item.path);
                    }}
                    className={`group flex items-center w-full px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 min-h-[48px] hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-purple-500/20 hover:text-white hover:shadow-lg hover:scale-105 ${isActivePath(item.path)
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105"
                      : "text-slate-300"
                      }`}
                  >
                    {item.icon && (
                      <span className="w-5 h-5 mr-3 transition-transform duration-200 text-center">{item.icon}</span>
                    )}
                    <span className="truncate" title={item.name}>
                      {item.name}
                    </span>
                    {isActivePath(item.path) && (
                      <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
                    )}
                  </Link>
                )}
              </div>
            ))}
          </>
        )}
      </nav>
    </aside>
  );
}




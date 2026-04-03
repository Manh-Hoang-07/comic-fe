"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { useMenus, MenuTreeItem } from "@/hooks/useMenus";
import { initializeUserGroups, getUserGroups, getSelectedGroup, Group } from "@/lib/group/utils";
import { useAuthStore } from "@/lib/store/authStore";
import { IconSelector } from "@/components/Shared/Admin/IconSelector";

function MenuItem({ item, pathname, depth = 0 }: { item: MenuTreeItem; pathname: string; depth?: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const href = item.path || "#";
  const isActive = item.path ? (pathname === href || (href !== "/admin" && pathname.startsWith(href + "/"))) : false;

  useEffect(() => {
    if (hasChildren && item.children?.some(child => {
      const childPath = child.path || "#";
      return pathname === childPath || (childPath !== "/admin" && pathname.startsWith(childPath + "/"));
    })) {
      setIsOpen(true);
    }
  }, [pathname, hasChildren, item.children]);

  return (
    <div className="space-y-1">
      {hasChildren ? (
        <div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
              ? "bg-primary/10 text-primary"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            style={{ paddingLeft: `${depth * 16 + 12}px` }}
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <span className={`flex-shrink-0 ${isActive ? "text-primary" : "text-gray-400"}`}>
                <IconSelector iconName={item.icon || "document"} className="h-5 w-5" />
              </span>
              <span className="truncate">{item.name}</span>
            </div>
            <svg
              className={`h-4 w-4 flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isOpen && (
            <div className="mt-1 space-y-1">
              {item.children?.map((child) => (
                <MenuItem key={child.id} item={child} pathname={pathname} depth={depth + 1} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <Link
          href={href}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
            ? "bg-primary/10 text-primary"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          style={{ paddingLeft: `${depth * 16 + 12}px` }}
        >
          <span className={`flex-shrink-0 ${isActive ? "text-primary" : "text-gray-400"}`}>
            <IconSelector iconName={item.icon || "document"} className="h-5 w-5" />
          </span>
          <span className="truncate">{item.name}</span>
        </Link>
      )}
    </div>
  );
}


export function AdminSidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  const { getUserMenus, loading: menusLoading } = useMenus();
  const { user, logout } = useAuthStore();

  const [menus, setMenus] = useState<MenuTreeItem[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Close sidebar on path change
  useEffect(() => {
    if (onClose) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Initialize groups and menus
  useEffect(() => {
    const init = async () => {
      try {
        setIsInitializing(true);

        const userGroups = await initializeUserGroups();
        setGroups(userGroups);

        const group = getSelectedGroup();
        setSelectedGroup(group);

        const userMenus = await getUserMenus();
        setMenus(userMenus || []);
      } catch (error) {
        console.error("Failed to initialize admin sidebar:", error);
      } finally {
        setIsInitializing(false);
      }
    };

    init();
  }, [getUserMenus]);

  const handleGroupChange = useCallback(async (groupId: string) => {
    localStorage.setItem("selected_group_id", groupId);
    const group = groups.find(g => String(g.id) === groupId) || null;
    setSelectedGroup(group);

    try {
      const userMenus = await getUserMenus();
      setMenus(userMenus || []);
    } catch (error) {
      console.error("Failed to refresh menus:", error);
    }
  }, [groups, getUserMenus]);

  return (
    <aside className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-gray-200 bg-white transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 flex flex-col h-screen shrink-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
      <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100 shrink-0">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">
            Admin Panel
          </span>
        </Link>

        {/* Close button for mobile */}
        <button
          onClick={onClose}
          className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Group Selector */}
      {groups.length > 0 && (
        <div className="px-4 py-4 border-b border-gray-100 shrink-0">
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
            Selected Group
          </label>
          <select
            className="w-full text-sm border border-gray-200 rounded-md p-2 bg-gray-50 focus:ring-1 focus:ring-primary focus:outline-none"
            value={selectedGroup?.id || ""}
            onChange={(e) => handleGroupChange(e.target.value)}
          >
            {groups.map(group => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex-1 overflow-y-auto py-6 px-4 scrollbar-thin">
        <div className="mb-4 px-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
          Main Menu
        </div>
        <nav className="space-y-1">
          {menusLoading && menus.length === 0 ? (
            <div className="px-2 py-4 text-sm text-gray-500 italic">Loading menus...</div>
          ) : (
            menus.map((menu) => (
              <MenuItem key={menu.id} item={menu} pathname={pathname || ""} />
            ))
          )}
        </nav>
      </div>
    </aside>
  );
}



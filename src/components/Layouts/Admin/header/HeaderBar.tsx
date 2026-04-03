"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import GroupSwitcher from "@/components/UI/Navigation/GroupSwitcher";
import UserDropdown from "./UserDropdown";
import { useAuthStore } from "@/lib/store/authStore";

interface HeaderBarProps {
  title?: string;
  sidebarOpen?: boolean;
  onToggleSidebar?: () => void;
  onLogout?: () => void;
}

export default function HeaderBar({
  title = "Admin",
  sidebarOpen = false,
  onToggleSidebar,
  onLogout,
}: HeaderBarProps) {
  const authStore = useAuthStore();
  const username = authStore.user?.name || authStore.user?.username || "User";
  const email = authStore.user?.email || "";

  const handleLogout = () => {
    if (confirm("Bạn có chắc muốn đăng xuất?")) {
      onLogout?.();
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 h-12 bg-white border-b border-slate-200 flex items-center justify-between px-4 z-[1001] transition-all duration-300 ${sidebarOpen ? "lg:left-64 lg:w-[calc(100%-256px)]" : ""
        }`}
    >
      <div className="flex items-center gap-3 flex-shrink-0">
        <button
          onClick={onToggleSidebar}
          className="w-9 h-9 rounded-lg border-none bg-transparent cursor-pointer flex items-center justify-center flex-shrink-0 hover:bg-slate-100"
        >
          <svg className="w-5 h-5 fill-slate-600" viewBox="0 0 24 24">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
          </svg>
        </button>
      </div>

      <div className="flex items-center gap-3">
        {authStore.isAuthenticated && (
          <>
            <GroupSwitcher className="mr-3" />
            <UserDropdown
              username={username}
              email={email}
              onLogout={handleLogout}
            />
          </>
        )}
      </div>
    </header>
  );
}




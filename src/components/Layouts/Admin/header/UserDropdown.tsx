"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";

interface UserDropdownProps {
  username: string;
  email?: string;
  showName?: boolean;
  variant?: "default" | "compact";
  onLogout?: () => void;
}

export default function UserDropdown({
  username,
  email = "",
  showName = true,
  variant = "default",
  onLogout,
}: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<React.CSSProperties>({});
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
    if (!isOpen) {
      calculateDropdownPosition();
    }
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const calculateDropdownPosition = () => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const dropdownWidth = 240;
    const dropdownHeight = 200;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    let left = rect.right - dropdownWidth + scrollLeft;
    let top = rect.bottom + 8 + scrollTop;

    if (left + dropdownWidth > windowWidth + scrollLeft) {
      left = windowWidth - dropdownWidth + scrollLeft - 16;
    }

    if (left < scrollLeft + 16) {
      left = scrollLeft + 16;
    }

    if (top + dropdownHeight > windowHeight + scrollTop) {
      top = rect.top - dropdownHeight - 8 + scrollTop;
    }

    setDropdownPosition({
      position: "absolute",
      left: `${left}px`,
      top: `${top}px`,
      width: `${dropdownWidth}px`,
    });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) && isOpen) {
        const button = (event.target as HTMLElement).closest(".user-dropdown-container");
        if (!button) {
          closeDropdown();
        }
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeDropdown();
      }
    };

    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const handleProfile = () => {
    closeDropdown();
    router.push("/user/profile");
  };

  const handleChangePassword = () => {
    closeDropdown();
    router.push("/user/profile/change-password");
  };

  const handleLogout = () => {
    closeDropdown();
    if (confirm("Bạn có chắc muốn đăng xuất?")) {
      onLogout?.();
    }
  };

  const avatarText = username?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="user-dropdown-container relative inline-block" ref={dropdownRef}>
      <button
        ref={buttonRef}
        onClick={toggleDropdown}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border-none bg-transparent cursor-pointer transition-colors hover:bg-slate-100 ${
          variant === "compact" ? "px-2" : ""
        }`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <span className="text-sm font-semibold text-white">{avatarText}</span>
        </div>
        {showName && variant !== "compact" && (
          <span className="text-sm font-medium text-slate-700">{username}</span>
        )}
        <svg
          className={`w-4 h-4 fill-slate-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
          viewBox="0 0 24 24"
        >
          <path d="M7 10l5 5 5-5z" />
        </svg>
      </button>

      {isMounted &&
        isOpen &&
        createPortal(
          <>
            <div className="fixed inset-0 z-[9998] bg-transparent" onClick={closeDropdown} />
            <div
              className="fixed z-[9999] bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden"
              style={dropdownPosition}
            >
              <div className="p-4 border-b border-slate-100">
                <div className="font-semibold text-slate-900 text-sm mb-0.5">{username}</div>
                {email && <div className="text-xs text-slate-500">{email}</div>}
              </div>
              <div className="h-px bg-slate-100" />
              <button
                onClick={handleProfile}
                className="w-full px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors border-none bg-transparent cursor-pointer"
              >
                Thông tin cá nhân
              </button>
              <button
                onClick={handleChangePassword}
                className="w-full px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors border-none bg-transparent cursor-pointer"
              >
                Đổi mật khẩu
              </button>
              <div className="h-px bg-slate-100" />
              <button
                onClick={handleLogout}
                className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 transition-colors border-none bg-transparent cursor-pointer"
              >
                Đăng xuất
              </button>
            </div>
          </>,
          document.body
        )}
    </div>
  );
}




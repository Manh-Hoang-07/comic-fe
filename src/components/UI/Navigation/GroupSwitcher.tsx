"use client";

import { useState, useEffect, useRef } from "react";
import { useGroup, Group } from "@/hooks/useGroup";

interface GroupSwitcherProps {
  className?: string;
}

export default function GroupSwitcher({ className = "" }: GroupSwitcherProps) {
  const { groups, currentGroup, loading, fetchMyGroups, switchGroup } = useGroup();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentGroupName = currentGroup
    ? currentGroup.context?.name && currentGroup.context.name !== currentGroup.name
      ? `${currentGroup.name} (${currentGroup.context.name})`
      : currentGroup.name
    : "Chưa chọn group";

  const currentGroupId = currentGroup?.id || null;

  const isCurrentGroup = (group: Group): boolean => {
    if (!currentGroupId) return false;
    return currentGroupId === group.id;
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen && groups.length === 0) {
      fetchMyGroups();
    }
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const selectGroup = async (group: Group) => {
    if (isCurrentGroup(group)) {
      closeDropdown();
      return;
    }

    const result = await switchGroup(group.id);
    if (result) {
      closeDropdown();
      setTimeout(() => {
        window.location.reload();
      }, 300);
    }
  };

  const getTypeLabel = (type?: string): string => {
    const typeMap: Record<string, string> = {
      system: "System",
      shop: "Shop",
      team: "Team",
      project: "Project",
      department: "Department",
      organization: "Organization",
    };
    return typeMap[type || ""] || type || "";
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) && isOpen) {
        const button = (event.target as HTMLElement).closest(".group-switcher");
        if (!button) {
          closeDropdown();
        }
      }
    };

    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen]);

  // If only 1 group, show info only
  if (groups.length === 1 && currentGroup) {
    return (
      <div className={`group-switcher relative ${className}`}>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 bg-white">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <span className="text-sm font-medium text-gray-700">
            {currentGroup.name}
            {currentGroup.roles && currentGroup.roles.length > 0 && (
              <span className="text-xs text-gray-500">
                {" "}
                ({currentGroup.roles.map((r) => r.name).join(", ")})
              </span>
            )}
          </span>
        </div>
      </div>
    );
  }

  // If 2+ groups, show dropdown
  if (groups.length >= 2) {
    return (
      <div className={`group-switcher relative ${className}`} ref={dropdownRef}>
        <button
          onClick={toggleDropdown}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        >
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <span className="text-sm font-medium text-gray-700">{currentGroupName}</span>
          <svg
            className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
            <div className="p-2">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Chọn Group
              </div>
              {loading ? (
                <div className="px-3 py-4 text-center text-sm text-gray-500">Đang tải...</div>
              ) : groups.length === 0 ? (
                <div className="px-3 py-4 text-center text-sm text-gray-500">Không có group nào</div>
              ) : (
                <div className="space-y-1">
                  {groups.map((group) => (
                    <button
                      key={group.id}
                      onClick={() => selectGroup(group)}
                      className={`w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 transition-colors flex items-center justify-between ${
                        isCurrentGroup(group)
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700"
                      }`}
                    >
                      <div className="flex-1">
                        <div className="text-sm font-medium">{group.name}</div>
                        <div className="text-xs text-gray-500">
                          {group.context?.name ? (
                            <span>{group.context.name}</span>
                          ) : (
                            <span>{getTypeLabel(group.type)}</span>
                          )}
                        </div>
                        {group.roles && group.roles.length > 0 && (
                          <div className="text-xs text-gray-400 mt-0.5">
                            Roles: {group.roles.map((r) => r.name).join(", ")}
                          </div>
                        )}
                      </div>
                      {isCurrentGroup(group) && (
                        <svg
                          className="w-4 h-4 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}




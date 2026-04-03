"use client";

import { ReactNode } from "react";

interface Action {
  icon: string;
  label: string;
  action: () => void;
  className?: string;
}

interface ActionsProps {
  item: any;
  showEdit?: boolean;
  showDelete?: boolean;
  showView?: boolean;
  editTitle?: string;
  deleteTitle?: string;
  viewTitle?: string;
  additionalActions?: Action[];
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
  onView?: (item: any) => void;
  customSlot?: (item: any) => ReactNode;
  children?: ReactNode;
}

export default function Actions({
  item,
  showEdit = true,
  showDelete = true,
  showView = false,
  editTitle = "Sửa",
  deleteTitle = "Xóa",
  viewTitle = "Xem",
  additionalActions = [],
  onEdit,
  onDelete,
  onView,
  customSlot,
  children,
}: ActionsProps) {
  const handleEdit = () => {
    onEdit?.(item);
  };

  const handleDelete = () => {
    onDelete?.(item);
  };

  const handleView = () => {
    onView?.(item);
  };

  const handleActionClick = (action: Action) => {
    if (typeof action.action === "function") {
      action.action();
    }
  };

  const renderIcon = (icon: string, color: string) => {
    const iconClass = `w-4 h-4 ${color}`;

    switch (icon) {
      case "play":
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        );
      case "pause":
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        );
      case "star":
        return (
          <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
          </svg>
        );
      case "star-outline":
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
          </svg>
        );
      case "view":
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
          </svg>
        );
      case "check":
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        );
      case "key":
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
          </svg>
        );
      default:
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        );
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {/* Edit button */}
      {showEdit && (
        <button
          onClick={handleEdit}
          className="p-2 rounded-full hover:bg-indigo-100 transition-colors duration-200"
          title={editTitle}
        >
          <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
          </svg>
        </button>
      )}

      {/* Delete button */}
      {showDelete && (
        <button
          onClick={handleDelete}
          className="p-2 rounded-full hover:bg-red-100 transition-colors duration-200"
          title={deleteTitle}
        >
          <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6h18"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"></path>
          </svg>
        </button>
      )}

      {/* View button */}
      {showView && (
        <button
          onClick={handleView}
          className="p-2 rounded-full hover:bg-blue-100 transition-colors duration-200"
          title={viewTitle}
        >
          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
          </svg>
        </button>
      )}

      {/* Additional actions */}
      {additionalActions.map((action, index) => (
        <button
          key={`action-${index}-${item.id || index}`}
          onClick={() => handleActionClick(action)}
          className={`p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 ${action.className || ""}`}
          title={action.label}
        >
          {renderIcon(action.icon, action.className ? "" : "text-gray-600")}
        </button>
      ))}

      {/* Custom actions */}
      {customSlot && customSlot(item)}
      {children}
    </div>
  );
}




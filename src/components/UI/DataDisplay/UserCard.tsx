"use client";

import { useState } from "react";
import Modal from '@/components/UI/Feedback/Modal';

interface User {
  id: number;
  name: string;
  email: string;
  created_at?: string;
}

interface UserCardProps {
  user: User;
  onEdit?: (user: User) => void;
  onDelete?: (userId: number) => void;
}

export default function UserCard({ user, onEdit, onDelete }: UserCardProps) {
  const [showModal, setShowModal] = useState(false);

  const userInitials = user.name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const formatDate = (dateString?: string): string => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {userInitials}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">{user.name}</h3>
            <p className="text-sm text-gray-500 truncate">{user.email}</p>
            <p className="text-xs text-gray-400 mt-1">ID: {user.id}</p>
          </div>
          <div className="flex-shrink-0">
            <div className="flex space-x-2">
              {onEdit && (
                <button
                  onClick={() => onEdit(user)}
                  className="text-blue-600 hover:text-blue-800 p-1 rounded"
                  title="Sửa"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(user.id)}
                  className="text-red-600 hover:text-red-800 p-1 rounded"
                  title="Xóa"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              )}
              <button
                onClick={() => setShowModal(true)}
                className="text-indigo-600 hover:text-indigo-800 p-1 rounded border border-indigo-200 bg-indigo-50"
                title="Xem chi tiết"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {user.created_at && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Ngày tạo:</span>
              <span>{formatDate(user.created_at)}</span>
            </div>
          </div>
        )}
      </div>

      <Modal show={showModal} onClose={() => setShowModal(false)} title="Thông tin tài khoản">
        <div className="space-y-2">
          <div>
            <b>Tên:</b> {user.name}
          </div>
          <div>
            <b>Email:</b> {user.email}
          </div>
          <div>
            <b>ID:</b> {user.id}
          </div>
          {user.created_at && (
            <div>
              <b>Ngày tạo:</b> {formatDate(user.created_at)}
            </div>
          )}
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => setShowModal(false)}
            className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Đóng
          </button>
        </div>
      </Modal>
    </>
  );
}




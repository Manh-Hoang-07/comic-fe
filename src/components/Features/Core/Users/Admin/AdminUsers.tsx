"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api/client";
import { adminEndpoints } from "@/lib/api/endpoints";
import { useCrudList } from "@/hooks";
import { BASIC_STATUS_BADGES, getStatusBadge } from "@/config/constants/status";
import SkeletonLoader from "@/components/UI/Feedback/SkeletonLoader";
import ConfirmModal from "@/components/UI/Feedback/ConfirmModal";
import Actions from "@/components/UI/DataDisplay/Actions";
import Pagination from "@/components/UI/DataDisplay/Pagination";
import useModal from "@/hooks/ui-ux/useModal";
import UsersFilter from "./UsersFilter";
import CreateUser from "./CreateUser";
import EditUser from "./EditUser";
import ChangePassword from "./ChangePassword";
import AssignRole from "./AssignRole";
import { type AdminUsersProps, type ChangePasswordTarget, type AssignRoleTarget } from "./Constants/types";

const endpoints = adminEndpoints.users;


export default function AdminUsers({
  title = "Quản lý người dùng",
  createButtonText = "Thêm người dùng mới",
}: AdminUsersProps) {
  const {
    data, actions, ui,
    createModal, editModal, deleteModal,
    handleDeleteConfirm, openCreate, openEdit, openDelete,
  } = useCrudList({
    endpoint: endpoints.list,
    deleteSuccessMessage: "Người dùng đã được xóa thành công",
  });

  const { items, loading, pagination, filters, hasData } = data;
  const { getSerialNumber } = ui;

  const [statusEnums, setStatusEnums] = useState<Array<{ value: string; id?: string; label: string; name?: string }>>([]);
  const [genderEnums, setGenderEnums] = useState<Array<{ value: string; label: string; name?: string }>>([]);

  const passwordModal = useModal<{ passApi: string; user: Record<string, unknown> }>();
  const roleModal = useModal<AssignRoleTarget>();

  const loadEnums = async () => {
    try {
      const statusResponse = await api.get(adminEndpoints.enums.byName("user_status"));
      if (statusResponse.data?.success) {
        setStatusEnums(statusResponse.data.data || []);
      }

      const genderResponse = await api.get(adminEndpoints.enums.byName("gender"));
      if (genderResponse.data?.success) {
        setGenderEnums(genderResponse.data.data || []);
      }
    } catch (e) {
      console.error("Failed to load enums", e);
    }
  };

  useEffect(() => {
    loadEnums();
  }, []);

  const getStatusLabel = (status?: string): string => {
    const found = statusEnums.find((s) => s.value === status || s.id === status);
    return found?.label || found?.name || status || "Không xác định";
  };

  return (
    <div className="admin-users">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        <button
          onClick={() => openCreate(endpoints.create)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {createButtonText}
        </button>
      </div>

      <UsersFilter
        initialFilters={filters}
        statusEnums={statusEnums}
        onUpdateFilters={actions.updateFilters}
      />

      <div className="bg-white shadow-md rounded-lg overflow-hidden mt-6">
        {loading ? (
          <SkeletonLoader type="table" rows={10} columns={6} />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên đăng nhập</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số điện thoại</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((user, index) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getSerialNumber(index)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.username || "N/A"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.phone || "N/A"}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        {getStatusLabel(user.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Actions
                          item={user}
                          onEdit={() => openEdit(user, endpoints)}
                          onDelete={() => openDelete(user, endpoints, "username")}
                        />
                        <button
                          onClick={() => passwordModal.open({
                            passApi: endpoints.changePassword(user.id),
                            user
                          })}
                          className="p-2 rounded-full hover:bg-blue-100 transition-colors"
                          title="Đổi mật khẩu"
                        >
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => roleModal.open({ user })}
                          className="p-2 rounded-full hover:bg-green-100 transition-colors"
                          title="Phân quyền"
                        >
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!loading && items.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-10 py-10 text-center text-gray-500">Không có dữ liệu</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {hasData && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          onPageChange={actions.changePage}
        />
      )}

      {createModal.isOpen && createModal.data && (
        <CreateUser
          show={createModal.isOpen}
          createApi={createModal.data.createApi}
          statusEnums={statusEnums}
          genderEnums={genderEnums}
          onClose={createModal.close}
          onSuccess={() => {
            createModal.close();
            actions.refresh();
          }}
        />
      )}

      {editModal.isOpen && editModal.data && (
        <EditUser
          show={editModal.isOpen}
          target={editModal.data}
          statusEnums={statusEnums}
          genderEnums={genderEnums}
          onClose={editModal.close}
          onSuccess={() => {
            editModal.close();
            actions.refresh();
          }}
        />
      )}

      {deleteModal.isOpen && deleteModal.data && (
        <ConfirmModal
          show={deleteModal.isOpen}
          title="Xác nhận xóa"
          message={`Bạn có chắc chắn muốn xóa người dùng "${deleteModal.data.displayName}"?`}
          onClose={deleteModal.close}
          onConfirm={handleDeleteConfirm}
        />
      )}

      {passwordModal.isOpen && passwordModal.data && (
        <ChangePassword
          show={passwordModal.isOpen}
          target={passwordModal.data}
          onClose={passwordModal.close}
          onSuccess={() => {
            passwordModal.close();
          }}
        />
      )}

      {roleModal.isOpen && roleModal.data && (
        <AssignRole
          show={roleModal.isOpen}
          target={roleModal.data}
          onClose={roleModal.close}
          onSuccess={() => {
            actions.refresh();
          }}
        />
      )}
    </div>
  );
}

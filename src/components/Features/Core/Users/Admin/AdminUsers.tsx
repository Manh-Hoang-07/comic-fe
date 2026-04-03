"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api/client";
import { adminEndpoints } from "@/lib/api/endpoints";
import { useListPage } from "@/hooks";
import SkeletonLoader from "@/components/UI/Feedback/SkeletonLoader";
import ConfirmModal from "@/components/UI/Feedback/ConfirmModal";
import Actions from "@/components/UI/DataDisplay/Actions";
import Pagination from "@/components/UI/DataDisplay/Pagination";
import UsersFilter from "./UsersFilter";
import CreateUser from "./CreateUser";
import EditUser from "./EditUser";
import ChangePassword from "./ChangePassword";
import AssignRole from "./AssignRole";

interface AdminUsersProps {
  title?: string;
  createButtonText?: string;
}

export default function AdminUsers({
  title = "Quản lý người dùng",
  createButtonText = "Thêm người dùng mới",
}: AdminUsersProps) {
  const {
    items,
    loading,
    pagination,
    filters,
    apiErrors,
    hasData,
    getSerialNumber,
    modal,
    actions,
    toast,
  } = useListPage({
    endpoints: {
      list: adminEndpoints.users.list,
      create: adminEndpoints.users.create,
      update: (id) => adminEndpoints.users.update(id),
      delete: (id) => adminEndpoints.users.delete(id),
    },
    customModals: ["assignRole", "changePassword"],
    messages: {
      createSuccess: "Người dùng đã được tạo thành công",
      updateSuccess: "Người dùng đã được cập nhật thành công",
      deleteSuccess: "Người dùng đã được xóa thành công",
    },
  });

  const [statusEnums, setStatusEnums] = useState<any[]>([]);
  const [genderEnums, setGenderEnums] = useState<any[]>([]);

  const loadEnums = async () => {
    try {
      const statusResponse = await api.get(adminEndpoints.enums.byName("user_status"));
      if (statusResponse.data?.success) {
        setStatusEnums(statusResponse.data.data || []);
      }
    } catch (e) {
      setStatusEnums([]);
    }

    try {
      const genderResponse = await api.get(adminEndpoints.enums.byName("gender"));
      if (genderResponse.data?.success) {
        setGenderEnums(genderResponse.data.data || []);
      }
    } catch (e) {
      setGenderEnums([]);
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
          onClick={() => modal.open("create")}
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
                          onEdit={() => modal.open("edit", user)}
                          onDelete={() => modal.open("delete", user)}
                        />
                        <button
                          onClick={() => modal.open("changePassword", user)}
                          className="p-2 rounded-full hover:bg-blue-100 transition-colors"
                          title="Đổi mật khẩu"
                        >
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => modal.open("assignRole", user)}
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

      <CreateUser
        show={modal.state.create}
        statusEnums={statusEnums}
        genderEnums={genderEnums}
        apiErrors={apiErrors}
        onClose={() => modal.close("create")}
        onCreated={actions.create}
      />

      {modal.selected && (
        <>
          <EditUser
            show={modal.state.edit}
            user={modal.selected}
            statusEnums={statusEnums}
            genderEnums={genderEnums}
            apiErrors={apiErrors}
            onClose={() => modal.close("edit")}
            onUpdated={(data) => actions.update(modal.selected.id, data)}
          />

          <ConfirmModal
            show={modal.state.delete}
            title="Xác nhận xóa"
            message={`Bạn có chắc chắn muốn xóa người dùng "${modal.selected.username || modal.selected.email}"?`}
            onClose={() => modal.close("delete")}
            onConfirm={() => actions.delete(modal.selected.id)}
          />

          {modal.state.changePassword && (
            <ChangePassword
              show={true}
              user={modal.selected}
              onClose={() => modal.close("changePassword")}
              onPasswordChanged={() => {
                modal.close("changePassword");
                toast.success("Mật khẩu đã được thay đổi thành công");
              }}
            />
          )}

          {modal.state.assignRole && (
            <AssignRole
              show={true}
              user={modal.selected}
              onClose={() => modal.close("assignRole")}
              onRoleAssigned={() => {
                modal.close("assignRole");
                toast.success("Vai trò đã được phân công thành công");
                actions.refresh();
              }}
            />
          )}
        </>
      )}
    </div>
  );
}


"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api/client";
import { adminEndpoints } from "@/lib/api/endpoints";
import { useAdminListPage } from "@/hooks/useAdminListPage";
import SkeletonLoader from "@/components/UI/Feedback/SkeletonLoader";
import ConfirmModal from "@/components/UI/Feedback/ConfirmModal";
import Actions from "@/components/UI/DataDisplay/Actions";
import Pagination from "@/components/UI/DataDisplay/Pagination";
import RolesFilter from "./RolesFilter";
import CreateRole from "./CreateRole";
import EditRole from "./EditRole";
import AssignPermissions from "./AssignPermissions";

interface AdminRolesProps {
  title?: string;
  createButtonText?: string;
}

export default function AdminRoles({
  title = "Quản lý vai trò",
  createButtonText = "Thêm vai trò mới",
}: AdminRolesProps) {
  const {
    items,
    loading,
    pagination,
    filters,
    apiErrors,
    modals,
    selectedItem,
    openCreateModal,
    closeCreateModal,
    openEditModal,
    closeEditModal,
    openDeleteModal,
    closeDeleteModal,
    updateFilters,
    changePage,
    handleCreate,
    handleUpdate,
    handleDelete,
    getSerialNumber,
    hasData,
    refresh,
    showSuccess,
    openModal,
    closeModal,
  } = useAdminListPage({
    endpoints: {
      list: adminEndpoints.roles.list,
      create: adminEndpoints.roles.create,
      update: (id) => adminEndpoints.roles.update(id),
      delete: (id) => adminEndpoints.roles.delete(id),
    },
    customModals: ["assignPermissions"],
    messages: {
      createSuccess: "Vai trò đã được tạo thành công",
      updateSuccess: "Vai trò đã được cập nhật thành công",
      deleteSuccess: "Vai trò đã được xóa thành công",
    },
  });

  const [statusEnums, setStatusEnums] = useState<any[]>([]);

  const fetchEnums = async () => {
    try {
      const statusResponse = await api.get(adminEndpoints.enums.byName("basic_status"));
      if (statusResponse.data?.success) {
        setStatusEnums(statusResponse.data.data || []);
      }
    } catch (e) {
      setStatusEnums([]);
    }
  };

  useEffect(() => {
    fetchEnums();
  }, []);

  const getStatusLabel = (status: string): string => {
    const found = statusEnums.find((s) => s.value === status || s.id === status);
    return found?.label || found?.name || status || "Không xác định";
  };

  const getStatusClass = (status: string): string => {
    const found = statusEnums.find((s) => s.value === status);
    return found?.class || found?.badge_class || "bg-gray-100 text-gray-800";
  };

  const openAssignPermissionsModal = (item: any) => {
    openModal("assignPermissions", item);
  };

  return (
    <div className="admin-roles">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
        >
          {createButtonText}
        </button>
      </div>

      <RolesFilter
        initialFilters={filters}
        statusEnums={statusEnums}
        onUpdateFilters={updateFilters}
      />

      <div className="bg-white shadow-md rounded-lg overflow-hidden mt-6">
        {loading ? (
          <SkeletonLoader type="table" rows={10} columns={5} />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên vai trò</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((role, index) => (
                  <tr key={role.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getSerialNumber(index)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <code className="px-2 py-1 bg-gray-100 rounded text-xs">{role.code}</code>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{role.name || "—"}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(role.status || "")}`}>
                        {getStatusLabel(role.status || "")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Actions
                        item={role}
                        showView={false}
                        showDelete={false}
                        onEdit={() => openEditModal(role)}
                        additionalActions={[
                          {
                            label: "Gán quyền",
                            action: () => openAssignPermissionsModal(role),
                            icon: "key",
                          },
                          {
                            label: "Xóa",
                            action: () => openDeleteModal(role),
                            icon: "trash",
                          },
                        ]}
                      />
                    </td>
                  </tr>
                ))}
                {!loading && items.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-10 py-10 text-center text-gray-500">Không có dữ liệu</td>
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
          onPageChange={changePage}
        />
      )}

      <CreateRole
        show={modals.create}
        statusEnums={statusEnums}
        apiErrors={apiErrors}
        onClose={closeCreateModal}
        onCreated={handleCreate}
      />

      {selectedItem && (
        <>
          <EditRole
            show={modals.edit}
            role={selectedItem}
            statusEnums={statusEnums}
            apiErrors={apiErrors}
            onClose={closeEditModal}
            onUpdated={(data) => handleUpdate(selectedItem.id, data)}
          />

          <ConfirmModal
            show={modals.delete}
            title="Xác nhận xóa"
            message={`Bạn có chắc chắn muốn xóa vai trò "${selectedItem.name || selectedItem.code}"?`}
            onClose={closeDeleteModal}
            onConfirm={() => handleDelete(selectedItem.id)}
          />

          {modals.assignPermissions && (
            <AssignPermissions
              show={true}
              role={selectedItem}
              onClose={() => closeModal("assignPermissions")}
              onPermissionsAssigned={() => {
                closeModal("assignPermissions");
                showSuccess("Quyền đã được gán thành công");
                refresh();
              }}
            />
          )}
        </>
      )}
    </div>
  );
}



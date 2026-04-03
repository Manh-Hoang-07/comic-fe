"use client";

import { useEffect, useState } from "react";
import { adminEndpoints } from "@/lib/api/endpoints";
import { useAdminListPage } from "@/hooks/useAdminListPage";
import SkeletonLoader from "@/components/UI/Feedback/SkeletonLoader";
import ConfirmModal from "@/components/UI/Feedback/ConfirmModal";
import Actions from "@/components/UI/DataDisplay/Actions";
import Pagination from "@/components/UI/DataDisplay/Pagination";
import PermissionsFilter from "./PermissionsFilter";
import CreatePermission from "./CreatePermission";
import EditPermission from "./EditPermission";

const getBasicStatusArray = () => [
  { value: "active", label: "Hoạt động" },
  { value: "inactive", label: "Ngừng hoạt động" },
];

const getStatusLabel = (value: string): string => {
  const status = getBasicStatusArray().find((s) => s.value === value);
  return status?.label || value;
};

const getStatusClass = (value: string): string => {
  const classes: Record<string, string> = {
    active: "bg-green-100 text-green-800",
    inactive: "bg-gray-100 text-gray-800",
  };
  return classes[value] || "bg-gray-100 text-gray-800";
};

interface AdminPermissionsProps {
  title?: string;
  createButtonText?: string;
}

export default function AdminPermissions({
  title = "Quản lý quyền",
  createButtonText = "Thêm quyền mới",
}: AdminPermissionsProps) {
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
  } = useAdminListPage({
    endpoints: {
      list: adminEndpoints.permissions.list,
      create: adminEndpoints.permissions.create,
      update: (id) => adminEndpoints.permissions.update(id),
      delete: (id) => adminEndpoints.permissions.delete(id),
    },
    messages: {
      createSuccess: "Đã tạo quyền thành công",
      updateSuccess: "Đã cập nhật quyền thành công",
      deleteSuccess: "Đã xóa quyền thành công",
    },
  });

  const [statusEnums, setStatusEnums] = useState(getBasicStatusArray());

  return (
    <div className="admin-permissions">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {createButtonText}
        </button>
      </div>

      <PermissionsFilter
        initialFilters={filters}
        statusEnums={statusEnums}
        onUpdateFilters={updateFilters}
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên quyền</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phạm vi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((permission, index) => (
                  <tr key={permission.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getSerialNumber(index)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <code className="px-2 py-1 bg-gray-100 rounded text-xs leading-loose">{permission.code}</code>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {permission.name || "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${permission.scope === "system" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
                        }`}>
                        {permission.scope === "system" ? "System" : "Context"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(permission.status || "")}`}>
                        {getStatusLabel(permission.status || "")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {!permission.has_children ? (
                        <Actions
                          item={permission}
                          onEdit={() => openEditModal(permission)}
                          onDelete={() => openDeleteModal(permission)}
                        />
                      ) : (
                        <span className="text-gray-400 text-xs italic">Có {permission.children_count} quyền con</span>
                      )}
                    </td>
                  </tr>
                ))}
                {!loading && items.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-gray-500">Không có dữ liệu</td>
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

      <CreatePermission
        show={modals.create}
        statusEnums={statusEnums}
        apiErrors={apiErrors}
        onClose={closeCreateModal}
        onCreated={handleCreate}
      />

      {selectedItem && (
        <>
          <EditPermission
            show={modals.edit}
            permission={selectedItem}
            statusEnums={statusEnums}
            apiErrors={apiErrors}
            onClose={closeEditModal}
            onUpdated={(data) => handleUpdate(selectedItem.id, data)}
          />

          <ConfirmModal
            show={modals.delete}
            title="Xác nhận xóa"
            message={`Bạn có chắc chắn muốn xóa quyền "${selectedItem.name || selectedItem.code}"?`}
            onClose={closeDeleteModal}
            onConfirm={() => handleDelete(selectedItem.id)}
          />
        </>
      )}
    </div>
  );
}



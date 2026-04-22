"use client";

import { useCrudList } from "@/hooks";
import { adminEndpoints } from "@/lib/api/endpoints";
import { BASIC_STATUS, BASIC_STATUS_BADGES, getStatusBadge } from "@/config/constants/status";
import SkeletonLoader from "@/components/UI/Feedback/SkeletonLoader";
import ConfirmModal from "@/components/UI/Feedback/ConfirmModal";
import Actions from "@/components/UI/DataDisplay/Actions";
import Pagination from "@/components/UI/DataDisplay/Pagination";
import PermissionsFilter from "./PermissionsFilter";
import CreatePermission from "./CreatePermission";
import EditPermission from "./EditPermission";
import { type AdminPermissionsProps, type Permission } from "./Constants/types";

const endpoints = adminEndpoints.permissions;

export default function AdminPermissions({
  title = "Quản lý quyền",
  createButtonText = "Thêm quyền mới",
}: AdminPermissionsProps) {
  const {
    data, actions, ui,
    createModal, editModal, deleteModal,
    handleDeleteConfirm, openCreate, openEdit, openDelete,
  } = useCrudList({
    endpoint: endpoints.list,
    deleteSuccessMessage: "Đã xóa quyền thành công",
  });

  const { items, loading, pagination, filters, hasData } = data;
  const { getSerialNumber } = ui;

  return (
    <div className="admin-permissions">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        <button
          onClick={() => openCreate(endpoints.create)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {createButtonText}
        </button>
      </div>

      <PermissionsFilter
        initialFilters={filters}
        statusEnums={BASIC_STATUS}
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên quyền</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phạm vi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((permission, index) => {
                  const badge = getStatusBadge(permission.status || "", BASIC_STATUS_BADGES);
                  return (
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
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${permission.scope === "system" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"}`}>
                          {permission.scope === "system" ? "System" : "Context"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${badge.className}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {!permission.has_children ? (
                          <Actions
                            item={permission}
                            onEdit={() => openEdit(permission, endpoints)}
                            onDelete={() => openDelete(permission, endpoints)}
                          />
                        ) : (
                          <span className="text-gray-400 text-xs italic">Có {permission.children_count} quyền con</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
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
          onPageChange={actions.changePage}
        />
      )}

      {createModal.isOpen && createModal.data && (
        <CreatePermission
          show={createModal.isOpen}
          createApi={createModal.data.createApi}
          statusEnums={BASIC_STATUS}
          onClose={createModal.close}
          onSuccess={() => {
            createModal.close();
            actions.refresh();
          }}
        />
      )}

      {editModal.isOpen && editModal.data && (
        <EditPermission
          show={editModal.isOpen}
          target={editModal.data}
          statusEnums={BASIC_STATUS}
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
          message={`Bạn có chắc chắn muốn xóa quyền "${deleteModal.data.displayName}"?`}
          onClose={deleteModal.close}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
}

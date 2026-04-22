"use client";

import { useCrudList } from "@/hooks";
import { adminEndpoints } from "@/lib/api/endpoints";
import { BASIC_STATUS, BASIC_STATUS_BADGES, getStatusBadge } from "@/config/constants/status";
import SkeletonLoader from "@/components/UI/Feedback/SkeletonLoader";
import ConfirmModal from "@/components/UI/Feedback/ConfirmModal";
import Actions from "@/components/UI/DataDisplay/Actions";
import Pagination from "@/components/UI/DataDisplay/Pagination";
import useModal from "@/hooks/ui-ux/useModal";
import RolesFilter from "./RolesFilter";
import CreateRole from "./CreateRole";
import EditRole from "./EditRole";
import AssignPermissions from "./AssignPermissions";
import { type AdminRolesProps, type Role } from "./Constants/types";

const endpoints = adminEndpoints.roles;

export default function AdminRoles({
  title = "Quản lý vai trò",
  createButtonText = "Thêm vai trò mới",
}: AdminRolesProps) {
  const {
    data, actions, ui,
    createModal, editModal, deleteModal,
    handleDeleteConfirm, openCreate, openEdit, openDelete,
    toast,
  } = useCrudList({
    endpoint: endpoints.list,
    deleteSuccessMessage: "Đã xóa vai trò thành công",
  });

  const { items, loading, pagination, filters, hasData } = data;
  const { getSerialNumber } = ui;

  const permissionsModal = useModal<{ role: Record<string, unknown> }>();

  return (
    <div className="admin-roles">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        <button
          onClick={() => openCreate(endpoints.create)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
        >
          {createButtonText}
        </button>
      </div>

      <RolesFilter
        initialFilters={filters}
        statusEnums={BASIC_STATUS}
        onUpdateFilters={actions.updateFilters}
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
                {items.map((role, index) => {
                  const badge = getStatusBadge(role.status || "", BASIC_STATUS_BADGES);
                  return (
                    <tr key={role.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getSerialNumber(index)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <code className="px-2 py-1 bg-gray-100 rounded text-xs">{role.code}</code>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{role.name || "—"}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${badge.className}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Actions
                          item={role}
                          showView={false}
                          showDelete={false}
                          onEdit={() => openEdit(role, endpoints)}
                          additionalActions={[
                            {
                              label: "Gán quyền",
                              action: () => permissionsModal.open({ role }),
                              icon: "key",
                            },
                            {
                              label: "Xóa",
                              action: () => openDelete(role, endpoints),
                              icon: "trash",
                            },
                          ]}
                        />
                      </td>
                    </tr>
                  );
                })}
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
          onPageChange={actions.changePage}
        />
      )}

      {createModal.isOpen && createModal.data && (
        <CreateRole
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
        <EditRole
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
          message={`Bạn có chắc chắn muốn xóa vai trò "${deleteModal.data.displayName || deleteModal.data.id}"?`}
          onClose={deleteModal.close}
          onConfirm={handleDeleteConfirm}
        />
      )}

      {permissionsModal.isOpen && permissionsModal.data && (
        <AssignPermissions
          show={true}
          role={permissionsModal.data.role}
          onClose={permissionsModal.close}
          onPermissionsAssigned={() => {
            permissionsModal.close();
            toast.success("Quyền đã được gán thành công");
            actions.refresh();
          }}
        />
      )}
    </div>
  );
}

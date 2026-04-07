"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api/client";
import { adminEndpoints } from "@/lib/api/endpoints";
import { useListPage } from "@/hooks";
import useModal from "@/hooks/ui-ux/useModal";
import SkeletonLoader from "@/components/UI/Feedback/SkeletonLoader";
import ConfirmModal from "@/components/UI/Feedback/ConfirmModal";
import Actions from "@/components/UI/DataDisplay/Actions";
import Pagination from "@/components/UI/DataDisplay/Pagination";
import { useToastContext } from "@/contexts/ToastContext";
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
  const { data, actions, ui } = useListPage({
    endpoint: adminEndpoints.roles.list,
  });
  
  const { items, loading, pagination, filters, hasData } = data;
  const { getSerialNumber } = ui;
  const { showSuccess, showError } = useToastContext();

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

  const createModal = useModal<{ createApi: string }>();
  const editModal = useModal<{ fetchApi?: string; initialData?: any; updateApi: string }>();
  const deleteModal = useModal<{ id: number; name?: string; deleteApi: string }>();
  const permissionsModal = useModal<{ role: any }>();

  const handleDeleteConfirm = async () => {
    if (!deleteModal.data?.deleteApi) return;
    try {
      await api.delete(deleteModal.data.deleteApi);
      showSuccess("Đã xóa vai trò thành công");
      deleteModal.close();
      actions.refresh();
    } catch (error: any) {
      showError(error.response?.data?.message || "Có lỗi xảy ra khi xóa");
    }
  };

  return (
    <div className="admin-roles">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        <button
          onClick={() => createModal.open({ createApi: adminEndpoints.roles.create })}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
        >
          {createButtonText}
        </button>
      </div>

      <RolesFilter
        initialFilters={filters}
        statusEnums={statusEnums}
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
                        onEdit={() => editModal.open({
                          fetchApi: adminEndpoints.roles.show(role.id),
                          updateApi: adminEndpoints.roles.update(role.id)
                        })}
                        additionalActions={[
                          {
                            label: "Gán quyền",
                            action: () => permissionsModal.open({ role }),
                            icon: "key",
                          },
                          {
                            label: "Xóa",
                            action: () => deleteModal.open({
                              id: role.id,
                              name: role.name,
                              deleteApi: adminEndpoints.roles.delete(role.id)
                            }),
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
          onPageChange={actions.changePage}
        />
      )}

      {createModal.isOpen && createModal.data && (
        <CreateRole
          show={createModal.isOpen}
          createApi={createModal.data.createApi}
          statusEnums={statusEnums}
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
          statusEnums={statusEnums}
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
          message={`Bạn có chắc chắn muốn xóa vai trò "${deleteModal.data.name || deleteModal.data.id}"?`}
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
            showSuccess("Quyền đã được gán thành công");
            actions.refresh();
          }}
        />
      )}
    </div>
  );
}


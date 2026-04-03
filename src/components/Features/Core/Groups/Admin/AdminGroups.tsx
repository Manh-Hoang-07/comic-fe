"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminListPage } from "@/hooks/useAdminListPage";
import { adminEndpoints } from "@/lib/api/endpoints";
import SkeletonLoader from "@/components/UI/Feedback/SkeletonLoader";
import ConfirmModal from "@/components/UI/Feedback/ConfirmModal";
import Actions from "@/components/UI/DataDisplay/Actions";
import Pagination from "@/components/UI/DataDisplay/Pagination";
import GroupsFilter from "./GroupsFilter";
import CreateGroup from "./CreateGroup";
import EditGroup from "./EditGroup";
import api from "@/lib/api/client";

interface Group {
  id: number;
  type?: string;
  code: string;
  name?: string;
  status?: string;
}

interface AdminGroupsProps {
  title?: string;
  createButtonText?: string;
}

const getTypeLabel = (type?: string): string => {
  const typeMap: Record<string, string> = {
    shop: "Shop",
    team: "Team",
    project: "Project",
    department: "Department",
    organization: "Organization",
  };
  return typeMap[type || ""] || type || "—";
};

export default function AdminGroups({ title = "Quản lý Groups", createButtonText = "Thêm group mới" }: AdminGroupsProps) {
  const router = useRouter();
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
      list: adminEndpoints.groups.list,
      create: adminEndpoints.groups.create,
      update: (id) => adminEndpoints.groups.update(id),
      delete: (id) => adminEndpoints.groups.delete(id),
      show: (id) => adminEndpoints.groups.show(id),
    },
    messages: {
      createSuccess: "Group đã được tạo thành công",
      updateSuccess: "Group đã được cập nhật thành công",
      deleteSuccess: "Group đã được xóa thành công",
    },
    fetchDetailBeforeEdit: true,
  });

  const [statusEnums, setStatusEnums] = useState<any[]>([]);

  const fetchEnums = async () => {
    try {
      const response = await api.get(adminEndpoints.enums.byName("basic_status"));
      if (response.data?.success) {
        setStatusEnums(response.data.data || []);
      } else {
        setStatusEnums([]);
      }
    } catch (e) {
      setStatusEnums([]);
    }
  };

  useEffect(() => {
    fetchEnums();
  }, []);

  const navigateToMembers = (groupId: number) => {
    router.push(`/admin/core/groups/${groupId}/members`);
  };

  const getStatusLabel = (status?: string): string => {
    const found = statusEnums.find((s) => s.value === status || s.id === status);
    return found?.label || found?.name || status || "Không xác định";
  };

  const getStatusClass = (status?: string): string => {
    const found = statusEnums.find((s) => s.value === status);
    return found?.class || found?.badge_class || found?.color_class || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="admin-groups">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        <button onClick={openCreateModal} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none">
          {createButtonText}
        </button>
      </div>

      <GroupsFilter initialFilters={filters} statusEnums={statusEnums} onUpdateFilters={updateFilters} />

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {loading ? (
          <SkeletonLoader type="table" rows={5} columns={6} />
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên group</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((group: Group, index) => (
                <tr key={group.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getSerialNumber(index)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">{getTypeLabel(group.type)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <code className="px-2 py-1 bg-gray-100 rounded text-xs">{group.code}</code>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{group.name || "—"}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(group.status)}`}>
                      {getStatusLabel(group.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Actions
                      item={group}
                      showView={false}
                      showDelete={false}
                      onEdit={() => openEditModal(group)}
                      additionalActions={[
                        {
                          label: "Quản lý members",
                          action: () => navigateToMembers(group.id),
                          icon: "users",
                        },
                        {
                          label: "Xóa",
                          action: () => openDeleteModal(group),
                          icon: "trash",
                        },
                      ]}
                    />
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {hasData && <Pagination currentPage={pagination.page} totalPages={pagination.totalPages} totalItems={pagination.totalItems} onPageChange={changePage} />}

      {modals.create && (
        <CreateGroup show={modals.create} apiErrors={apiErrors} onClose={closeCreateModal} onCreated={handleCreate} />
      )}

      {modals.edit && selectedItem && (
        <EditGroup show={modals.edit} group={selectedItem} apiErrors={apiErrors} onClose={closeEditModal} onUpdated={(data) => handleUpdate(selectedItem.id, data)} />
      )}

      {selectedItem && (
        <ConfirmModal
          show={modals.delete}
          title="Xác nhận xóa"
          message={`Bạn có chắc chắn muốn xóa group ${(selectedItem as Group).name || (selectedItem as Group).code || ""}?`}
          onClose={closeDeleteModal}
          onConfirm={() => handleDelete(selectedItem.id)}
        />
      )}
    </div>
  );
}



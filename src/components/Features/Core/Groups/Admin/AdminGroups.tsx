"use client";

import { useRouter } from "next/navigation";
import { useCrudList } from "@/hooks";
import { adminEndpoints } from "@/lib/api/endpoints";
import { BASIC_STATUS, BASIC_STATUS_BADGES, getStatusBadge } from "@/config/constants/status";
import SkeletonLoader from "@/components/UI/Feedback/SkeletonLoader";
import ConfirmModal from "@/components/UI/Feedback/ConfirmModal";
import Actions from "@/components/UI/DataDisplay/Actions";
import Pagination from "@/components/UI/DataDisplay/Pagination";
import GroupsFilter from "./GroupsFilter";
import CreateGroup from "./CreateGroup";
import EditGroup from "./EditGroup";
import { type AdminGroupsProps, type Group } from "./Constants/types";

const endpoints = adminEndpoints.groups;


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
    data, actions, ui,
    createModal, editModal, deleteModal,
    handleDeleteConfirm, openCreate, openEdit, openDelete,
  } = useCrudList({
    endpoint: endpoints.list,
    deleteSuccessMessage: "Group đã được xóa thành công",
  });

  const { items, loading, pagination, filters, hasData } = data;
  const { getSerialNumber } = ui;

  const navigateToMembers = (groupId: number) => {
    router.push(`/admin/groups/${groupId}/members`);
  };

  return (
    <div className="admin-groups">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        <button
          onClick={() => openCreate(endpoints.create)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
        >
          {createButtonText}
        </button>
      </div>

      <GroupsFilter initialFilters={filters} statusEnums={BASIC_STATUS} onUpdateFilters={actions.updateFilters} />

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
              {items.map((group: Group, index) => {
                const badge = getStatusBadge(group.status || "", BASIC_STATUS_BADGES);
                return (
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
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${badge.className}`}>
                        {badge.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Actions
                        item={group}
                        showView={false}
                        showDelete={false}
                        onEdit={() => openEdit(group, endpoints)}
                        additionalActions={[
                          {
                            label: "Quản lý members",
                            action: () => navigateToMembers(group.id),
                            icon: "users",
                          },
                          {
                            label: "Xóa",
                            action: () => openDelete(group, endpoints),
                            icon: "trash",
                          },
                        ]}
                      />
                    </td>
                  </tr>
                );
              })}
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

      {hasData && <Pagination currentPage={pagination.page} totalPages={pagination.totalPages} totalItems={pagination.totalItems} onPageChange={actions.changePage} />}

      {createModal.isOpen && createModal.data && (
        <CreateGroup
          show={createModal.isOpen}
          createApi={createModal.data.createApi}
          onClose={createModal.close}
          onSuccess={() => {
            createModal.close();
            actions.refresh();
          }}
        />
      )}

      {editModal.isOpen && editModal.data && (
        <EditGroup
          show={editModal.isOpen}
          target={editModal.data}
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
          message={`Bạn có chắc chắn muốn xóa group "${deleteModal.data.displayName || ""}"?`}
          onClose={deleteModal.close}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
}

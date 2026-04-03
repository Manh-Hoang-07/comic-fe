"use client";

import { useMemo } from "react";
import { useAdminListPage } from "@/hooks/useAdminListPage";
import { adminEndpoints } from "@/lib/api/endpoints";
import Pagination from "@/components/UI/DataDisplay/Pagination";
import SkeletonLoader from "@/components/UI/Feedback/SkeletonLoader";
import Actions from "@/components/UI/DataDisplay/Actions";
import ConfirmModal from "@/components/UI/Feedback/ConfirmModal";
import type { AdminWard } from "@/types/location";
import WardFilter from "./WardFilter";
import CreateWard from "./CreateWard";
import EditWard from "./EditWard";

export default function AdminWards() {
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
      list: adminEndpoints.location.wards.list,
      create: adminEndpoints.location.wards.create,
      update: (id) => adminEndpoints.location.wards.update(id),
      delete: (id) => adminEndpoints.location.wards.delete(id),
      show: (id) => adminEndpoints.location.wards.show(id),
    },
    messages: {
      createSuccess: "Phường/Xã đã được tạo thành công",
      updateSuccess: "Phường/Xã đã được cập nhật thành công",
      deleteSuccess: "Phường/Xã đã được xóa thành công",
    },
    fetchDetailBeforeEdit: true,
  });

  const getStatusBadge = (status?: string) => {
    if (status === "active") {
      return {
        label: "Hoạt động",
        className: "bg-green-100 text-green-800",
      };
    }
    if (status === "inactive") {
      return {
        label: "Ngừng hoạt động",
        className: "bg-gray-100 text-gray-800",
      };
    }
    return {
      label: status || "Không xác định",
      className: "bg-gray-100 text-gray-800",
    };
  };

  const getWardTypeLabel = (type?: string | null) => {
    switch (type) {
      case "Ward":
        return "Phường";
      case "Commune":
        return "Xã";
      case "Township":
        return "Thị trấn";
      default:
        return type || "—";
    }
  };

  return (
    <div className="admin-wards">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý Phường/Xã</h1>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
        >
          Thêm Phường/Xã
        </button>
      </div>

      <WardFilter initialFilters={filters} onUpdateFilters={updateFilters} />

      <div className="bg-white shadow-md rounded-lg overflow-hidden mt-6">
        {loading ? (
          <SkeletonLoader type="table" rows={10} columns={4} />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    STT
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loại
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((ward: AdminWard, index: number) => {
                  const status = getStatusBadge(ward.status);
                  return (
                    <tr key={ward.id}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {getSerialNumber(index)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {ward.name}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {getWardTypeLabel(ward.type)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${status.className}`}
                        >
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                        <Actions
                          item={ward}
                          showView={false}
                          showDelete={false}
                          onEdit={() => openEditModal(ward)}
                          additionalActions={[
                            {
                              label: "Xóa",
                              action: () => openDeleteModal(ward),
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
                    <td
                      colSpan={7}
                      className="px-6 py-10 text-center text-gray-500 text-sm"
                    >
                      Không có dữ liệu
                    </td>
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

      {modals.create && (
        <CreateWard
          show={modals.create}
          apiErrors={apiErrors}
          onClose={closeCreateModal}
          onCreated={handleCreate}
        />
      )}

      {modals.edit && selectedItem && (
        <EditWard
          show={modals.edit}
          ward={selectedItem}
          apiErrors={apiErrors}
          onClose={closeEditModal}
          onUpdated={(data) => handleUpdate(selectedItem.id, data)}
        />
      )}

      {selectedItem && (
        <ConfirmModal
          show={modals.delete}
          title="Xác nhận xóa"
          message={`Bạn có chắc chắn muốn xóa Phường/Xã "${selectedItem.name || selectedItem.code}"?`}
          onClose={closeDeleteModal}
          onConfirm={() => handleDelete(selectedItem.id)}
        />
      )}
    </div>
  );
}


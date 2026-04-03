"use client";

import { useMemo, useState, useEffect } from "react";
import { useAdminListPage } from "@/hooks/useAdminListPage";
import { adminEndpoints } from "@/lib/api/endpoints";
import SkeletonLoader from "@/components/UI/Feedback/SkeletonLoader";
import ConfirmModal from "@/components/UI/Feedback/ConfirmModal";
import Actions from "@/components/UI/DataDisplay/Actions";
import Pagination from "@/components/UI/DataDisplay/Pagination";
import BannerLocationsFilter from "./BannerLocationsFilter";
import CreateBannerLocation from "./CreateBannerLocation";
import EditBannerLocation from "./EditBannerLocation";

const getBasicStatusArray = () => [
  { value: "active", label: "Hoạt động", class: "bg-green-100 text-green-800" },
  { value: "inactive", label: "Ngừng hoạt động", class: "bg-gray-100 text-gray-800" },
];

const getStatusLabel = (value: string): string => {
  const status = getBasicStatusArray().find((s) => s.value === value);
  return status?.label || value;
};

const getStatusClass = (value: string): string => {
  const status = getBasicStatusArray().find((s) => s.value === value);
  return status?.class || "bg-gray-100 text-gray-800";
};

interface BannerLocation {
  id: number;
  code: string;
  name: string;
  description?: string;
  status?: string;
  deleted_at?: string;
}

interface AdminBannerLocationsProps {
  title?: string;
  createButtonText?: string;
}

export default function AdminBannerLocations({
  title = "Quản lý vị trí banner",
  createButtonText = "Thêm vị trí mới",
}: AdminBannerLocationsProps) {
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
  } = useAdminListPage(useMemo(() => ({
    endpoints: {
      list: adminEndpoints.bannerLocations.list,
      create: adminEndpoints.bannerLocations.create,
      update: (id: string | number) => adminEndpoints.bannerLocations.update(id),
      delete: (id: string | number) => adminEndpoints.bannerLocations.delete(id),
    },
    messages: {
      createSuccess: "Đã tạo thành công",
      updateSuccess: "Đã cập nhật thành công",
      deleteSuccess: "Đã xóa thành công",
    },
  }), []));

  const [statusEnums, setStatusEnums] = useState<Array<{ value: string; label?: string; name?: string }>>([]);

  useEffect(() => {
    setStatusEnums(getBasicStatusArray());
  }, []);

  return (
    <div className="admin-Locationss">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
        >
          {createButtonText}
        </button>
      </div>

      <BannerLocationsFilter
        initialFilters={filters}
        statusEnums={statusEnums}
        onUpdateFilters={updateFilters}
      />

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {loading ? (
          <SkeletonLoader type="table" rows={5} columns={5} />
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  STT
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã vị trí
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên vị trí
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((location: BannerLocation, index) => (
                <tr key={location.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getSerialNumber(index)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                      {location.code}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{location.name}</div>
                    <div className="text-sm text-gray-500">{location.description || "—"}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-1">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(
                          location.status || ""
                        )}`}
                      >
                        {getStatusLabel(location.status || "")}
                      </span>
                      {location.deleted_at && (
                        <div className="text-xs text-red-600">Đã xóa</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Actions
                      item={location}
                      showView={false}
                      showDelete={false}
                      onEdit={() => openEditModal(location)}
                      additionalActions={[
                        {
                          label: location.status === "active" ? "Vô hiệu hóa" : "Kích hoạt",
                          action: () => { },
                          icon: location.status === "active" ? "eye-off" : "eye",
                        },
                        {
                          label: location.deleted_at ? "Khôi phục" : "Xóa",
                          action: () => openDeleteModal(location),
                          icon: location.deleted_at ? "refresh" : "trash",
                        },
                      ]}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
        <CreateBannerLocation
          show={modals.create}
          statusEnums={statusEnums}
          apiErrors={apiErrors}
          onClose={closeCreateModal}
          onCreated={handleCreate}
        />
      )}

      {modals.edit && selectedItem && (
        <EditBannerLocation
          show={modals.edit}
          locationId={selectedItem.id}
          statusEnums={statusEnums}
          apiErrors={apiErrors}
          onClose={closeEditModal}
          onUpdated={(data) => handleUpdate(selectedItem.id, data)}
        />
      )}

      {selectedItem && (
        <ConfirmModal
          show={modals.delete}
          title="Xác nhận xóa"
          message={`Bạn có chắc chắn muốn xóa vị trí ${(selectedItem as BannerLocation).name || ""}?`}
          onClose={closeDeleteModal}
          onConfirm={() => handleDelete(selectedItem.id)}
        />
      )}
    </div>
  );
}



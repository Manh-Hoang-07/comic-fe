"use client";

import { useMemo } from "react";
import { useAdminListPage } from "@/hooks/useAdminListPage";
import { adminEndpoints } from "@/lib/api/endpoints";
import Pagination from "@/components/UI/DataDisplay/Pagination";
import SkeletonLoader from "@/components/UI/Feedback/SkeletonLoader";
import Actions from "@/components/UI/DataDisplay/Actions";
import ConfirmModal from "@/components/UI/Feedback/ConfirmModal";
import type { AdminCountry } from "@/types/location";
import CountryFilter from "./CountryFilter";
import CreateCountry from "./CreateCountry";
import EditCountry from "./EditCountry";

export default function AdminCountries() {
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
      list: adminEndpoints.location.countries.list,
      create: adminEndpoints.location.countries.create,
      update: (id) => adminEndpoints.location.countries.update(id),
      delete: (id) => adminEndpoints.location.countries.delete(id),
      show: (id) => adminEndpoints.location.countries.show(id),
    },
    messages: {
      createSuccess: "Quốc gia đã được tạo thành công",
      updateSuccess: "Quốc gia đã được cập nhật thành công",
      deleteSuccess: "Quốc gia đã được xóa thành công",
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

  return (
    <div className="admin-countries">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý quốc gia</h1>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
        >
          Thêm quốc gia mới
        </button>
      </div>

      <CountryFilter initialFilters={filters} onUpdateFilters={updateFilters} />

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
                    Tên đầy đủ
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
                {items.map((country: AdminCountry, index: number) => {
                  const status = getStatusBadge(country.status);
                  return (
                    <tr key={country.id}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {getSerialNumber(index)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {country.name}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {country.official_name || "—"}
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
                          item={country}
                          showView={false}
                          showDelete={false}
                          onEdit={() => openEditModal(country)}
                          additionalActions={[
                            {
                              label: "Xóa",
                              action: () => openDeleteModal(country),
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
        <CreateCountry
          show={modals.create}
          apiErrors={apiErrors}
          onClose={closeCreateModal}
          onCreated={handleCreate}
        />
      )}

      {modals.edit && selectedItem && (
        <EditCountry
          show={modals.edit}
          country={selectedItem}
          apiErrors={apiErrors}
          onClose={closeEditModal}
          onUpdated={(data) => handleUpdate(selectedItem.id, data)}
        />
      )}

      {selectedItem && (
        <ConfirmModal
          show={modals.delete}
          title="Xác nhận xóa"
          message={`Bạn có chắc chắn muốn xóa quốc gia "${selectedItem.name || selectedItem.code}"?`}
          onClose={closeDeleteModal}
          onConfirm={() => handleDelete(selectedItem.id)}
        />
      )}
    </div>
  );
}


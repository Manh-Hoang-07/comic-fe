"use client";

import { useCrudList } from "@/hooks";
import { adminEndpoints } from "@/lib/api/endpoints";
import { BASIC_STATUS_BADGES, getStatusBadge } from "@/config/constants/status";
import Pagination from "@/components/UI/DataDisplay/Pagination";
import SkeletonLoader from "@/components/UI/Feedback/SkeletonLoader";
import Actions from "@/components/UI/DataDisplay/Actions";
import ConfirmModal from "@/components/UI/Feedback/ConfirmModal";
import type { AdminProvince } from "@/types/location";
import ProvinceFilter from "./ProvinceFilter";
import CreateProvince from "./CreateProvince";
import EditProvince from "./EditProvince";

const endpoints = adminEndpoints.location.provinces;

const getProvinceTypeLabel = (type?: string | null) => {
  switch (type) {
    case "Province":
      return "Tỉnh";
    case "Municipality":
      return "Thành phố Trung ương";
    default:
      return type || "—";
  }
};

export default function AdminProvinces() {
  const {
    data, actions, ui,
    createModal, editModal, deleteModal,
    handleDeleteConfirm, openCreate, openEdit, openDelete,
  } = useCrudList({
    endpoint: endpoints.list,
    deleteSuccessMessage: "Đã xóa Tỉnh/Thành phố thành công",
  });

  const { items, loading, pagination, filters, hasData } = data;
  const { getSerialNumber } = ui;

  return (
    <div className="admin-provinces">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý Tỉnh/Thành phố</h1>
        <button
          onClick={() => openCreate(endpoints.create)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
        >
          Thêm Tỉnh/Thành phố
        </button>
      </div>

      <ProvinceFilter initialFilters={filters} onUpdateFilters={actions.updateFilters} />

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
                {items.map((province: AdminProvince, index: number) => {
                  const badge = getStatusBadge(province.status || "", BASIC_STATUS_BADGES);
                  return (
                    <tr key={province.id}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {getSerialNumber(index)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {province.name}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {getProvinceTypeLabel(province.type)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${badge.className}`}
                        >
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                        <Actions
                          item={province}
                          showView={false}
                          showDelete={false}
                          onEdit={() => openEdit(province, endpoints)}
                          additionalActions={[
                            {
                              label: "Xóa",
                              action: () => openDelete(province, endpoints),
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
                      colSpan={5}
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
          onPageChange={actions.changePage}
        />
      )}

      {createModal.isOpen && createModal.data && (
        <CreateProvince
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
        <EditProvince
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
          message={`Bạn có chắc chắn muốn xóa Tỉnh/Thành phố "${deleteModal.data.displayName}"?`}
          onClose={deleteModal.close}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
}

"use client";

import { useCrudList } from "@/hooks";
import { adminEndpoints } from "@/lib/api/endpoints";
import SkeletonLoader from "@/components/UI/Feedback/SkeletonLoader";
import ConfirmModal from "@/components/UI/Feedback/ConfirmModal";
import Actions from "@/components/UI/DataDisplay/Actions";
import Pagination from "@/components/UI/DataDisplay/Pagination";
import BannerLocationsFilter from "./BannerLocationsFilter";
import CreateBannerLocation from "./CreateBannerLocation";
import EditBannerLocation from "./EditBannerLocation";
import { BASIC_STATUS, BASIC_STATUS_BADGES, getStatusBadge } from "@/config/constants/status";

const endpoints = adminEndpoints.bannerLocations;

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
    data, actions, ui,
    createModal, editModal, deleteModal,
    handleDeleteConfirm, openCreate, openEdit, openDelete,
  } = useCrudList({
    endpoint: endpoints.list,
    deleteSuccessMessage: "Đã xóa vị trí banner thành công",
  });

  const { items, loading, pagination, filters, hasData } = data;
  const { getSerialNumber } = ui;

  return (
    <div className="admin-banner-locations">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        <button
          onClick={() => openCreate(endpoints.create)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
        >
          {createButtonText}
        </button>
      </div>

      <BannerLocationsFilter
        initialFilters={filters}
        statusEnums={BASIC_STATUS}
        onUpdateFilters={actions.updateFilters}
      />

      <div className="bg-white shadow-md rounded-lg overflow-hidden mt-4">
        {loading ? (
          <SkeletonLoader type="table" rows={5} columns={5} />
        ) : (
          <div className="overflow-x-auto">
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-right">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.length > 0 ? items.map((location: BannerLocation, index) => {
                  const badge = getStatusBadge(location.status || "", BASIC_STATUS_BADGES);
                  return (
                    <tr key={location.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getSerialNumber(index)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          {location.code}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{location.name}</div>
                        <div className="text-sm text-gray-500 line-clamp-1">{location.description || "—"}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex flex-col space-y-1">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${badge.className}`}
                          >
                            {badge.label}
                          </span>
                          {location.deleted_at && (
                            <div className="text-xs text-red-600 font-medium">Đã xóa</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                        <Actions
                          item={location}
                          showView={false}
                          showDelete={false}
                          onEdit={() => openEdit(location, endpoints)}
                          additionalActions={[
                            {
                              label: "Xóa",
                              action: () => openDelete(location, endpoints),
                              icon: "trash",
                            },
                          ]}
                        />
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-gray-500 italic">
                      Không tìm thấy vị trí banner nào
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
        <CreateBannerLocation
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
        <EditBannerLocation
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
          message={`Bạn có chắc chắn muốn xóa vị trí banner "${deleteModal.data.displayName}"?`}
          onClose={deleteModal.close}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
}

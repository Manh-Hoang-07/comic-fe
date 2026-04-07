"use client";

import { useListPage } from "@/hooks";
import useModal from "@/hooks/ui-ux/useModal";
import { adminEndpoints } from "@/lib/api/endpoints";
import Pagination from "@/components/UI/DataDisplay/Pagination";
import SkeletonLoader from "@/components/UI/Feedback/SkeletonLoader";
import Actions from "@/components/UI/DataDisplay/Actions";
import ConfirmModal from "@/components/UI/Feedback/ConfirmModal";
import { useToastContext } from "@/contexts/ToastContext";
import api from "@/lib/api/client";
import type { AdminWard } from "@/types/location";
import WardFilter from "./WardFilter";
import CreateWard from "./CreateWard";
import EditWard from "./EditWard";

export default function AdminWards() {
  const { data, actions, ui } = useListPage({
    endpoint: adminEndpoints.location.wards.list,
  });
  
  const { items, loading, pagination, filters, hasData } = data;
  const { getSerialNumber } = ui;
  const { showSuccess, showError } = useToastContext();

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

  const createModal = useModal<{ createApi: string }>();
  const editModal = useModal<{ fetchApi?: string; initialData?: any; updateApi: string }>();
  const deleteModal = useModal<{ id: number; name?: string; deleteApi: string }>();

  const handleDeleteConfirm = async () => {
    if (!deleteModal.data?.deleteApi) return;
    try {
      await api.delete(deleteModal.data.deleteApi);
      showSuccess("Đã xóa Phường/Xã thành công");
      deleteModal.close();
      actions.refresh();
    } catch (error: any) {
      showError(error.response?.data?.message || "Có lỗi xảy ra khi xóa");
    }
  };

  return (
    <div className="admin-wards">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý Phường/Xã</h1>
        <button
          onClick={() => createModal.open({ createApi: adminEndpoints.location.wards.create })}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
        >
          Thêm Phường/Xã
        </button>
      </div>

      <WardFilter initialFilters={filters} onUpdateFilters={actions.updateFilters} />

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
                          onEdit={() => editModal.open({
                            fetchApi: adminEndpoints.location.wards.show(ward.id),
                            updateApi: adminEndpoints.location.wards.update(ward.id)
                          })}
                          additionalActions={[
                            {
                              label: "Xóa",
                              action: () => deleteModal.open({
                                id: ward.id,
                                name: ward.name,
                                deleteApi: adminEndpoints.location.wards.delete(ward.id)
                              }),
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
        <CreateWard
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
        <EditWard
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
          message={`Bạn có chắc chắn muốn xóa Phường/Xã "${deleteModal.data.name}"?`}
          onClose={deleteModal.close}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
}



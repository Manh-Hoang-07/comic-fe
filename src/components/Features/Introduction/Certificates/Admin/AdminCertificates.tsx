"use client";

import Image from "next/image";
import { useAdminListPage } from "@/hooks/useAdminListPage";
import { adminEndpoints } from "@/lib/api/endpoints";
import SkeletonLoader from "@/components/UI/Feedback/SkeletonLoader";
import ConfirmModal from "@/components/UI/Feedback/ConfirmModal";
import Actions from "@/components/UI/DataDisplay/Actions";
import Pagination from "@/components/UI/DataDisplay/Pagination";
import CertificatesFilter from "./CertificatesFilter";
import CreateCertificate from "./CreateCertificate";
import EditCertificate from "./EditCertificate";

const getCertificateTypeLabel = (value: string): string => {
  const labels: Record<string, string> = {
    iso: "ISO",
    quality: "Chất lượng",
    safety: "An toàn",
    environment: "Môi trường",
    license: "Giấy phép",
    other: "Khác",
  };
  return labels[value] || value;
};

const formatDate = (dateStr?: string): string => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? "-" : date.toLocaleString("vi-VN");
};

interface Certificate {
  id: number;
  name: string;
  image?: string;
  issued_by?: string;
  issued_date?: string;
  expiry_date?: string;
  certificate_number?: string;
  type?: string;
  status?: string;
  sort_order?: number;
}

interface AdminCertificatesProps {
  title?: string;
  createButtonText?: string;
}

export default function AdminCertificates({
  title = "Quản lý chứng chỉ",
  createButtonText = "Thêm chứng chỉ mới",
}: AdminCertificatesProps) {
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
      list: adminEndpoints.certificates.list,
      create: adminEndpoints.certificates.create,
      update: (id) => adminEndpoints.certificates.update(id),
      delete: (id) => adminEndpoints.certificates.delete(id),
      show: (id) => adminEndpoints.certificates.show(id),
    },
    messages: {
      createSuccess: "Đã tạo thành công",
      updateSuccess: "Đã cập nhật thành công",
      deleteSuccess: "Đã xóa thành công",
    },
    fetchDetailBeforeEdit: true,
  });

  return (
    <div className="admin-certificates">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
        >
          {createButtonText}
        </button>
      </div>

      <CertificatesFilter
        initialFilters={filters}
        onUpdateFilters={updateFilters}
      />

      <div className="bg-white shadow-md rounded-lg overflow-hidden mt-4">
        {loading ? (
          <SkeletonLoader type="table" rows={5} columns={9} />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    STT
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Tên
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Loại
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Cơ quan cấp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Số
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Ảnh
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Ngày cấp / hết hạn
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((item: Certificate, index) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {getSerialNumber(index)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {getCertificateTypeLabel(item.type || "")}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{item.issued_by || "-"}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {item.certificate_number || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={100}
                          height={60}
                          className="h-14 w-auto object-contain rounded"
                        />
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div>{formatDate(item.issued_date)}</div>
                      <div className="text-xs text-gray-400">
                        Hết hạn: {formatDate(item.expiry_date)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${item.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                          }`}
                      >
                        {item.status === "active" ? "Hoạt động" : "Không hoạt động"}
                      </span>
                      <div className="text-xs text-gray-400 mt-1">
                        Thứ tự: {item.sort_order ?? 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <Actions
                        item={item}
                        onEdit={() => openEditModal(item)}
                        showView={false}
                        showDelete={false}
                        additionalActions={[
                          {
                            label: "Xóa",
                            action: () => openDeleteModal(item),
                            icon: "trash",
                          },
                        ]}
                      />
                    </td>
                  </tr>
                ))}
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
        <CreateCertificate
          show={modals.create}
          apiErrors={apiErrors}
          onClose={closeCreateModal}
          onCreated={handleCreate}
        />
      )}

      {modals.edit && selectedItem && (
        <EditCertificate
          show={modals.edit}
          certificate={selectedItem}
          apiErrors={apiErrors}
          onClose={closeEditModal}
          onUpdated={(data) => handleUpdate(selectedItem.id, data)}
        />
      )}

      {selectedItem && (
        <ConfirmModal
          show={modals.delete}
          title="Xác nhận xóa"
          message={`Bạn có chắc chắn muốn xóa ${(selectedItem as Certificate).name || ""}?`}
          onClose={closeDeleteModal}
          onConfirm={() => handleDelete(selectedItem.id)}
        />
      )}
    </div>
  );
}



"use client";

import { useMemo } from "react";
import Image from "next/image";
import { useAdminListPage } from "@/hooks/useAdminListPage";
import { adminEndpoints } from "@/lib/api/endpoints";
import SkeletonLoader from "@/components/UI/Feedback/SkeletonLoader";
import ConfirmModal from "@/components/UI/Feedback/ConfirmModal";
import Actions from "@/components/UI/DataDisplay/Actions";
import Pagination from "@/components/UI/DataDisplay/Pagination";
import GalleryFilter from "./GalleryFilter";
import CreateGallery from "./CreateGallery";
import EditGallery from "./EditGallery";

const formatDate = (dateStr?: string): string => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? "-" : date.toLocaleDateString("vi-VN");
};

interface Gallery {
  id: number;
  title?: string;
  name?: string;
  slug?: string;
  cover_image?: string;
  images?: string[];
  status?: string;
  featured?: boolean;
  sort_order?: number;
  created_at?: string;
}

interface AdminGalleryProps {
  title?: string;
  createButtonText?: string;
}

export default function AdminGallery({
  title = "Quản lý thư viện ảnh",
  createButtonText = "Thêm ảnh mới",
}: AdminGalleryProps) {
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
      list: adminEndpoints.gallery.list,
      create: adminEndpoints.gallery.create,
      update: (id: string | number) => adminEndpoints.gallery.update(id),
      delete: (id: string | number) => adminEndpoints.gallery.delete(id),
      show: (id: string | number) => adminEndpoints.gallery.show(id),
    },
    messages: {
      createSuccess: "Đã tạo thành công",
      updateSuccess: "Đã cập nhật thành công",
      deleteSuccess: "Đã xóa thành công",
    },
    fetchDetailBeforeEdit: true,
  }), []));

  return (
    <div className="admin-gallery">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
        >
          {createButtonText}
        </button>
      </div>

      <GalleryFilter
        initialFilters={filters}
        onUpdateFilters={updateFilters}
      />

      <div className="bg-white shadow-md rounded-lg overflow-hidden mt-4">
        {loading ? (
          <SkeletonLoader type="table" rows={5} columns={8} />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    STT
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Tiêu đề
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Slug
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Ảnh bìa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Số ảnh
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Nổi bật
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Ngày tạo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((item: Gallery, index) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {getSerialNumber(index)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {item.title || item.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{item.slug || "-"}</td>
                    <td className="px-6 py-4 text-sm">
                      {item.cover_image ? (
                        <Image
                          src={item.cover_image}
                          alt={item.title || item.name || ""}
                          width={100}
                          height={60}
                          className="h-14 w-auto object-cover rounded"
                        />
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {item.images?.length || 0}
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
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {item.featured ? (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Nổi bật
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                      <div className="text-xs text-gray-400 mt-1">
                        Thứ tự: {item.sort_order ?? 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(item.created_at)}
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

      {selectedItem && (
        <ConfirmModal
          show={modals.delete}
          title="Xác nhận xóa"
          message={`Bạn có chắc chắn muốn xóa ${(selectedItem as Gallery).title || (selectedItem as Gallery).name || ""}?`}
          onClose={closeDeleteModal}
          onConfirm={() => handleDelete(selectedItem.id)}
        />
      )}

      {modals.create && (
        <CreateGallery
          show={modals.create}
          apiErrors={apiErrors}
          onClose={closeCreateModal}
          onCreated={handleCreate}
        />
      )}

      {modals.edit && selectedItem && (
        <EditGallery
          show={modals.edit}
          gallery={selectedItem}
          apiErrors={apiErrors}
          onClose={closeEditModal}
          onUpdated={(data) => handleUpdate(selectedItem.id, data)}
        />
      )}
    </div>
  );
}



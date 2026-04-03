"use client";

import { useAdminListPage } from "@/hooks/useAdminListPage";
import { adminEndpoints } from "@/lib/api/endpoints";
import SkeletonLoader from "@/components/UI/Feedback/SkeletonLoader";
import ConfirmModal from "@/components/UI/Feedback/ConfirmModal";
import Actions from "@/components/UI/DataDisplay/Actions";
import Pagination from "@/components/UI/DataDisplay/Pagination";
import PostCategoriesFilter from "./PostCategoriesFilter";
import CreatePostCategory from "./CreatePostCategory";
import EditPostCategory from "./EditPostCategory";
import { useState, useEffect } from "react";

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

interface PostCategory {
  id: number;
  name: string;
  status?: string;
  // Add other properties if needed
}

interface AdminPostCategoriesProps {
  title?: string;
  createButtonText?: string;
}

export default function AdminPostCategories({
  title = "Quản lý danh mục bài viết",
  createButtonText = "Thêm danh mục mới",
}: AdminPostCategoriesProps) {
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
      list: adminEndpoints.postCategories.list,
      create: adminEndpoints.postCategories.create,
      update: (id) => adminEndpoints.postCategories.update(id),
      delete: (id) => adminEndpoints.postCategories.delete(id),
      show: (id) => adminEndpoints.postCategories.show(id),
    },
    messages: {
      createSuccess: "Đã tạo thành công",
      updateSuccess: "Đã cập nhật thành công",
      deleteSuccess: "Đã xóa thành công",
    },
    fetchDetailBeforeEdit: true,
  });

  const [statusEnums, setStatusEnums] = useState<Array<{ value: string; label?: string; name?: string }>>([]);

  useEffect(() => {
    setStatusEnums(getBasicStatusArray());
  }, []);

  return (
    <div className="admin-post-categories">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
        >
          {createButtonText}
        </button>
      </div>

      <PostCategoriesFilter
        initialFilters={filters}
        statusEnums={statusEnums}
        onUpdateFilters={updateFilters}
      />

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {loading ? (
          <SkeletonLoader type="table" rows={5} columns={4} />
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  STT
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên danh mục
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
              {items.map((category: PostCategory, index) => (
                <tr key={category.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getSerialNumber(index)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {category.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(
                        category.status || ""
                      )}`}
                    >
                      {getStatusLabel(category.status || "")}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Actions
                      item={category}
                      onEdit={() => openEditModal(category)}
                      onDelete={() => openDeleteModal(category)}
                    />
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    Không có dữ liệu
                  </td>
                </tr>
              )}
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
        <CreatePostCategory
          show={modals.create}
          statusEnums={statusEnums}
          apiErrors={apiErrors}
          onClose={closeCreateModal}
          onCreated={handleCreate}
        />
      )}

      {modals.edit && selectedItem && (
        <EditPostCategory
          show={modals.edit}
          category={selectedItem}
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
          message={`Bạn có chắc chắn muốn xóa danh mục ${(selectedItem as PostCategory).name || ""}?`}
          onClose={closeDeleteModal}
          onConfirm={() => handleDelete(selectedItem.id)}
        />
      )}
    </div>
  );
}




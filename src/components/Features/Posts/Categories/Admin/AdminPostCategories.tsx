"use client";

import { useListPage } from "@/hooks";
import useModal from "@/hooks/ui-ux/useModal";
import { adminEndpoints } from "@/lib/api/endpoints";
import SkeletonLoader from "@/components/UI/Feedback/SkeletonLoader";
import ConfirmModal from "@/components/UI/Feedback/ConfirmModal";
import Actions from "@/components/UI/DataDisplay/Actions";
import Pagination from "@/components/UI/DataDisplay/Pagination";
import PostCategoriesFilter from "./PostCategoriesFilter";
import CreatePostCategory from "./CreatePostCategory";
import EditPostCategory from "./EditPostCategory";
import { useState, useEffect } from "react";
import { useToastContext } from "@/contexts/ToastContext";
import api from "@/lib/api/client";

const getBasicStatusArray = () => [
  { value: "active", label: "Hoạt động", class: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  { value: "inactive", label: "Tạm ẩn", class: "bg-rose-100 text-rose-800 border-rose-200" },
];

const getStatusLabel = (value: string): string => {
  const status = getBasicStatusArray().find((s) => s.value === value);
  return status?.label || value;
};

const getStatusClass = (value: string): string => {
  const status = getBasicStatusArray().find((s) => s.value === value);
  return status?.class || "bg-gray-100 text-gray-800 border-gray-200";
};

interface PostCategory {
  id: number;
  name: string;
  status?: string;
}

interface AdminPostCategoriesProps {
  title?: string;
  createButtonText?: string;
}

export default function AdminPostCategories({
  title = "Quản lý danh mục bài viết",
  createButtonText = "Thêm danh mục mới",
}: AdminPostCategoriesProps) {
  const { data, actions, ui } = useListPage({
    endpoint: adminEndpoints.postCategories.list,
  });
  
  const { items, loading, pagination, filters, hasData } = data;
  const { getSerialNumber } = ui;
  const { showSuccess, showError } = useToastContext();

  const createModal = useModal<{ createApi: string }>();
  const editModal = useModal<{ fetchApi?: string; initialData?: any; updateApi: string }>();
  const deleteModal = useModal<{ id: number | string; name?: string; deleteApi: string }>();

  const [statusEnums, setStatusEnums] = useState<Array<{ value: string; label?: string; name?: string }>>([]);

  useEffect(() => {
    setStatusEnums(getBasicStatusArray());
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteModal.data?.deleteApi) return;
    try {
      await api.delete(deleteModal.data.deleteApi);
      showSuccess("Đã xóa danh mục thành công");
      deleteModal.close();
      actions.refresh();
    } catch (error: any) {
      showError(error.response?.data?.message || "Có lỗi xảy ra khi xóa");
    }
  };

  return (
    <div className="admin-post-categories">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        <button
          onClick={() => createModal.open({ createApi: adminEndpoints.postCategories.create })}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none transition-colors"
        >
          {createButtonText}
        </button>
      </div>

      <PostCategoriesFilter
        initialFilters={filters}
        statusEnums={statusEnums}
        onUpdateFilters={actions.updateFilters}
      />

      <div className="bg-white shadow-md rounded-lg overflow-hidden mt-6 border border-gray-100">
        {loading ? (
          <SkeletonLoader type="table" rows={5} columns={4} />
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50/80">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  STT
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Tên danh mục
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.length > 0 ? items.map((category: PostCategory, index) => (
                <tr key={category.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getSerialNumber(index)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    {category.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border transition-colors ${getStatusClass(
                        category.status || ""
                      )}`}
                    >
                      {getStatusLabel(category.status || "")}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                    <Actions
                      item={category}
                      onEdit={() => editModal.open({
                        fetchApi: adminEndpoints.postCategories.show(category.id),
                        updateApi: adminEndpoints.postCategories.update(category.id)
                      })}
                      onDelete={() => deleteModal.open({
                        id: category.id,
                        name: category.name,
                        deleteApi: adminEndpoints.postCategories.delete(category.id)
                      })}
                    />
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500 italic">
                    Chưa có danh mục bài viết nào
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
          onPageChange={actions.changePage}
        />
      )}

      {createModal.isOpen && createModal.data && (
        <CreatePostCategory
          show={createModal.isOpen}
          createApi={createModal.data.createApi}
          onClose={createModal.close}
          statusEnums={statusEnums}
          onSuccess={() => {
            createModal.close();
            actions.refresh();
          }}
        />
      )}

      {editModal.isOpen && editModal.data && (
        <EditPostCategory
          show={editModal.isOpen}
          target={editModal.data}
          onClose={editModal.close}
          statusEnums={statusEnums}
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
          message={`Bạn có chắc chắn muốn xóa danh mục "${deleteModal.data.name}"? Mọi bài viết thuộc danh mục này sẽ bị ảnh hưởng.`}
          onClose={deleteModal.close}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
}





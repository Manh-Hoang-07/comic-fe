"use client";

import { useCrudList } from "@/hooks";
import { adminEndpoints } from "@/lib/api/endpoints";
import SkeletonLoader from "@/components/UI/Feedback/SkeletonLoader";
import ConfirmModal from "@/components/UI/Feedback/ConfirmModal";
import Actions from "@/components/UI/DataDisplay/Actions";
import Pagination from "@/components/UI/DataDisplay/Pagination";
import PostCategoriesFilter from "./PostCategoriesFilter";
import CreatePostCategory from "./CreatePostCategory";
import EditPostCategory from "./EditPostCategory";
import { BASIC_STATUS, BASIC_STATUS_BADGES, getStatusBadge } from "@/config/constants/status";

const endpoints = adminEndpoints.postCategories;

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
  const {
    data, actions, ui,
    createModal, editModal, deleteModal,
    handleDeleteConfirm, openCreate, openEdit, openDelete,
  } = useCrudList({
    endpoint: endpoints.list,
    deleteSuccessMessage: "Đã xóa danh mục thành công",
  });

  const { items, loading, pagination, filters, hasData } = data;
  const { getSerialNumber } = ui;

  return (
    <div className="admin-post-categories">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        <button
          onClick={() => openCreate(endpoints.create)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none transition-colors"
        >
          {createButtonText}
        </button>
      </div>

      <PostCategoriesFilter
        initialFilters={filters}
        statusEnums={BASIC_STATUS}
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
              {items.length > 0 ? items.map((category: PostCategory, index) => {
                const badge = getStatusBadge(category.status || "", BASIC_STATUS_BADGES);
                return (
                  <tr key={category.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getSerialNumber(index)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      {category.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border transition-colors ${badge.className}`}
                      >
                        {badge.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                      <Actions
                        item={category}
                        onEdit={() => openEdit(category, endpoints)}
                        onDelete={() => openDelete(category, endpoints)}
                      />
                    </td>
                  </tr>
                );
              }) : (
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
          statusEnums={BASIC_STATUS}
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
          statusEnums={BASIC_STATUS}
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
          message={`Bạn có chắc chắn muốn xóa danh mục "${deleteModal.data.displayName}"? Mọi bài viết thuộc danh mục này sẽ bị ảnh hưởng.`}
          onClose={deleteModal.close}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
}

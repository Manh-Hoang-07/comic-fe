"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api/client";
import { adminEndpoints } from "@/lib/api/endpoints";
import { useAdminListPage } from "@/hooks/useAdminListPage";
import SkeletonLoader from "@/components/UI/Feedback/SkeletonLoader";
import ConfirmModal from "@/components/UI/Feedback/ConfirmModal";
import Actions from "@/components/UI/DataDisplay/Actions";
import Pagination from "@/components/UI/DataDisplay/Pagination";
import PostsFilter from "./PostsFilter";
import CreatePost from "./CreatePost";
import EditPost from "./EditPost";

const formatDate = (dateString?: string): string => {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getCategoryNames = (categories?: Array<{ id: number; name: string }>): string => {
  if (!categories || !Array.isArray(categories) || categories.length === 0) {
    return "—";
  }
  return categories.map((cat) => cat.name).join(", ");
};

interface AdminPostsProps {
  title?: string;
  createButtonText?: string;
}

export default function AdminPosts({
  title = "Quản lý bài viết",
  createButtonText = "Thêm bài viết mới",
}: AdminPostsProps) {
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
    refresh,
    showSuccess,
    showError,
  } = useAdminListPage({
    endpoints: {
      list: adminEndpoints.posts.list,
      create: adminEndpoints.posts.create,
      update: (id) => adminEndpoints.posts.update(id),
      delete: (id) => adminEndpoints.posts.delete(id),
    },
    messages: {
      createSuccess: "Bài viết đã được tạo thành công",
      updateSuccess: "Bài viết đã được cập nhật thành công",
      deleteSuccess: "Bài viết đã được xóa thành công",
    },
  });

  const [statusEnums, setStatusEnums] = useState<any[]>([]);
  const [postTypeEnums, setPostTypeEnums] = useState<any[]>([]);
  const [categoryEnums, setCategoryEnums] = useState<any[]>([]);
  const [tagEnums, setTagEnums] = useState<any[]>([]);

  const fetchEnums = async () => {
    try {
      const statusResponse = await api.get(adminEndpoints.enums.byName("post_status"));
      if (statusResponse.data?.success) setStatusEnums(statusResponse.data.data || []);

      const typeResponse = await api.get(adminEndpoints.enums.byName("post_type"));
      if (typeResponse.data?.success) setPostTypeEnums(typeResponse.data.data || []);

      const categoryResponse = await api.get(adminEndpoints.postCategories.list);
      setCategoryEnums(categoryResponse.data?.data || []);

      const tagResponse = await api.get(adminEndpoints.postTags.list);
      setTagEnums(tagResponse.data?.data || []);
    } catch (e) {
      console.error("Failed to load enums", e);
    }
  };

  useEffect(() => {
    fetchEnums();
  }, []);

  const restorePost = async (post: any) => {
    try {
      const response = await api.put(`${adminEndpoints.posts.delete(post.id)}/restore`);
      if (response.data?.success) {
        showSuccess("Bài viết đã được khôi phục thành công");
        refresh();
      } else {
        showError("Không thể khôi phục bài viết");
      }
    } catch (error) {
      showError("Không thể khôi phục bài viết");
    }
  };

  const getStatusLabel = (status?: string): string => {
    const found = statusEnums.find((s) => s.value === status);
    return found?.label || found?.name || status || "Không xác định";
  };

  const getStatusClass = (status?: string): string => {
    const found = statusEnums.find((s) => s.value === status);
    return found?.class || found?.badge_class || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="admin-posts">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition-colors"
        >
          {createButtonText}
        </button>
      </div>

      <PostsFilter
        initialFilters={filters}
        statusEnums={statusEnums}
        categoryEnums={categoryEnums}
        onUpdateFilters={updateFilters}
      />

      <div className="bg-white shadow-md rounded-lg overflow-hidden mt-6">
        {loading ? (
          <SkeletonLoader type="table" rows={10} columns={6} />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tiêu đề</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Danh mục</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((post, index) => (
                  <tr key={post.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getSerialNumber(index)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{post.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getCategoryNames(post.categories)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(post.status)}`}>
                          {getStatusLabel(post.status)}
                        </span>
                        {post.deleted_at && <div className="text-xs text-red-600">Đã xóa</div>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(post.created_at)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Actions
                        item={post}
                        showView={false}
                        showDelete={false}
                        onEdit={() => openEditModal(post)}
                        additionalActions={[
                          {
                            label: "Xem bình luận",
                            action: () => window.location.href = `/admin/postss-comments?post_id=${post.id}`,
                            icon: "message",
                          },
                          {
                            label: post.deleted_at ? "Khôi phục" : "Xóa",
                            action: () => (post.deleted_at ? restorePost(post) : openDeleteModal(post)),
                            icon: post.deleted_at ? "refresh" : "trash",
                          },
                        ]}

                      />
                    </td>
                  </tr>
                ))}
                {!loading && items.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-10 py-10 text-center text-gray-500">Không có dữ liệu</td>
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

      <CreatePost
        show={modals.create}
        statusEnums={statusEnums}
        postTypeEnums={postTypeEnums}
        categoryEnums={categoryEnums}
        tagEnums={tagEnums}
        apiErrors={apiErrors}
        onClose={closeCreateModal}
        onCreated={handleCreate}
      />

      {selectedItem && (
        <>
          <EditPost
            show={modals.edit}
            post={selectedItem}
            statusEnums={statusEnums}
            postTypeEnums={postTypeEnums}
            categoryEnums={categoryEnums}
            tagEnums={tagEnums}
            apiErrors={apiErrors}
            onClose={closeEditModal}
            onUpdated={(data) => handleUpdate(selectedItem.id, data)}
          />

          <ConfirmModal
            show={modals.delete}
            title="Xác nhận xóa"
            message={`Bạn có chắc chắn muốn xóa bài viết "${selectedItem.name}"?`}
            onClose={closeDeleteModal}
            onConfirm={() => handleDelete(selectedItem.id)}
          />
        </>
      )}
    </div>
  );
}





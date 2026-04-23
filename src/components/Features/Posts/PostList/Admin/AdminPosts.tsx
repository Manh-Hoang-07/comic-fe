"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api/client";
import { adminEndpoints } from "@/lib/api/endpoints";
import { useCrudList } from "@/hooks";
import SkeletonLoader from "@/components/UI/Feedback/SkeletonLoader";
import ConfirmModal from "@/components/UI/Feedback/ConfirmModal";
import Actions from "@/components/UI/DataDisplay/Actions";
import Pagination from "@/components/UI/DataDisplay/Pagination";
import PostsFilter from "./PostsFilter";
import CreatePost from "./CreatePost";
import EditPost from "./EditPost";
import { formatDate } from "@/utils/formatters";

const endpoints = adminEndpoints.posts;

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
    data, actions, ui, toast,
    createModal, editModal, deleteModal,
    handleDeleteConfirm, openCreate, openEdit, openDelete,
  } = useCrudList({
    endpoint: endpoints.list,
    deleteSuccessMessage: "Đã xóa bài viết thành công",
  });

  const { items, loading, pagination, filters, hasData } = data;
  const { getSerialNumber } = ui;

  const [statusEnums, setStatusEnums] = useState<Array<{ value: string; label: string; name?: string; class?: string; badge_class?: string }>>([]);
  const [postTypeEnums, setPostTypeEnums] = useState<Array<{ value: string; label: string; name?: string }>>([]);
  const [categoryEnums, setCategoryEnums] = useState<Array<{ id: number; name: string; value?: number; label?: string }>>([]);
  const [tagEnums, setTagEnums] = useState<Array<{ id: number; name: string; value?: number; label?: string }>>([]);

  const fetchEnums = async () => {
    try {
      const [statusRes, typeRes, catRes, tagRes] = await Promise.all([
        api.get(adminEndpoints.enums.byName("post_status")),
        api.get(adminEndpoints.enums.byName("post_type")),
        api.get(adminEndpoints.postCategories.list),
        api.get(adminEndpoints.postTags.list)
      ]);

      if (statusRes.data?.success) setStatusEnums(statusRes.data.data || []);
      if (typeRes.data?.success) setPostTypeEnums(typeRes.data.data || []);
      setCategoryEnums(catRes.data?.data || []);
      setTagEnums(tagRes.data?.data || []);
    } catch (e) {
      console.error("Failed to load enums", e);
    }
  };

  useEffect(() => {
    fetchEnums();
  }, []);

  const handleRestore = async (post: Record<string, unknown>) => {
    try {
      const response = await api.put(`${adminEndpoints.posts.delete(post.id as number | string)}/restore`);
      if (response.data?.success) {
        toast.success("Bài viết đã được khôi phục thành công");
        actions.refresh();
      } else {
        toast.error("Không thể khôi phục bài viết");
      }
    } catch (error) {
      toast.error("Không thể khôi phục bài viết");
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
          onClick={() => openCreate(endpoints.create)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition-colors"
        >
          {createButtonText}
        </button>
      </div>

      <PostsFilter
        initialFilters={filters}
        statusEnums={statusEnums}
        categoryEnums={categoryEnums}
        onUpdateFilters={actions.updateFilters}
      />

      <div className="bg-white shadow-md rounded-lg overflow-hidden mt-6 border border-gray-100">
        {loading ? (
          <SkeletonLoader type="table" rows={10} columns={6} />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50/80">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">STT</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tiêu đề</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Danh mục</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Trạng thái</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Ngày tạo</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider text-right pr-10">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.length > 0 ? items.map((post, index) => (
                  <tr key={post.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getSerialNumber(index)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       <div className="text-sm font-bold text-gray-900 line-clamp-1 max-w-xs" title={post.name}>{post.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">{getCategoryNames(post.categories)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex flex-col items-center space-y-1">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border transition-colors ${getStatusClass(post.status)}`}>
                          {getStatusLabel(post.status)}
                        </span>
                        {post.deleted_at && <div className="text-[10px] text-rose-600 font-bold uppercase tracking-wider">Đã xóa</div>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 font-medium text-center">{formatDate(post.created_at)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                      <Actions
                        item={post}
                        showView={false}
                        showDelete={false}
                        onEdit={() => openEdit(post, endpoints)}
                        additionalActions={[
                          {
                            label: "Xem bình luận",
                            action: () => window.location.href = `/admin/posts-comments?post_id=${post.id}`,
                            icon: "message",
                          },
                          {
                            label: post.deleted_at ? "Khôi phục" : "Xóa",
                            action: () => (post.deleted_at ? handleRestore(post) : openDelete(post, endpoints)),
                            icon: post.deleted_at ? "refresh" : "trash",
                            className: post.deleted_at ? "text-emerald-600 hover:text-emerald-700" : "text-rose-600 hover:text-rose-700"
                          },
                        ]}

                      />
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500 italic">Chưa có bài viết nào trên hệ thống</td>
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
        <CreatePost
          show={createModal.isOpen}
          createApi={createModal.data.createApi}
          statusEnums={statusEnums}
          postTypeEnums={postTypeEnums}
          categoryEnums={categoryEnums.map(c => ({ value: c.id, label: c.name, name: c.name }))}
          tagEnums={tagEnums.map(t => ({ value: t.id, label: t.name, name: t.name }))}
          onClose={createModal.close}
          onSuccess={() => {
            createModal.close();
            actions.refresh();
          }}
        />
      )}

      {editModal.isOpen && editModal.data && (
        <EditPost
          show={editModal.isOpen}
          target={editModal.data}
          statusEnums={statusEnums}
          postTypeEnums={postTypeEnums}
          categoryEnums={categoryEnums.map(c => ({ value: c.id, label: c.name, name: c.name }))}
          tagEnums={tagEnums.map(t => ({ value: t.id, label: t.name, name: t.name }))}
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
          message={`Bạn có chắc chắn muốn xóa bài viết "${deleteModal.data.displayName}"? Dữ liệu có thể khôi phục sau này.`}
          onClose={deleteModal.close}
          onConfirm={handleDeleteConfirm}
          confirmText="Xác nhận xóa"
          confirmButtonClass="bg-rose-600 hover:bg-rose-700 shadow-rose-600/20"
        />
      )}
    </div>
  );
}

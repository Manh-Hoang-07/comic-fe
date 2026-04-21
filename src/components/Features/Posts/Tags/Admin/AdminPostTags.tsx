"use client";

import { useCrudList } from "@/hooks";
import { adminEndpoints } from "@/lib/api/endpoints";
import SkeletonLoader from "@/components/UI/Feedback/SkeletonLoader";
import ConfirmModal from "@/components/UI/Feedback/ConfirmModal";
import Actions from "@/components/UI/DataDisplay/Actions";
import Pagination from "@/components/UI/DataDisplay/Pagination";
import PostTagsFilter from "./PostTagsFilter";
import CreateTag from "./CreateTag";
import EditTag from "./EditTag";
import { BASIC_STATUS, BASIC_STATUS_BADGES, getStatusBadge } from "@/config/constants/status";

const endpoints = adminEndpoints.postTags;

interface Tag {
  id: number;
  name: string;
  status?: string;
}

interface AdminPostTagsProps {
  title?: string;
  createButtonText?: string;
}

export default function AdminPostTags({
  title = "Quản lý thẻ bài viết",
  createButtonText = "Thêm thẻ mới",
}: AdminPostTagsProps) {
  const {
    data, actions, ui,
    createModal, editModal, deleteModal,
    handleDeleteConfirm, openCreate, openEdit, openDelete,
  } = useCrudList({
    endpoint: endpoints.list,
    deleteSuccessMessage: "Đã xóa thẻ thành công",
  });

  const { items, loading, pagination, filters, hasData } = data;
  const { getSerialNumber } = ui;

  return (
    <div className="admin-post-tags">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 font-primary">{title}</h1>
        <button
          onClick={() => openCreate(endpoints.create)}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold transition-all active:scale-95 shadow-lg shadow-blue-500/20"
        >
          {createButtonText}
        </button>
      </div>

      <PostTagsFilter
        initialFilters={filters}
        statusEnums={BASIC_STATUS}
        onUpdateFilters={actions.updateFilters}
      />

      <div className="bg-white shadow-md rounded-2xl overflow-hidden mt-6 border border-gray-100">
        {loading ? (
          <SkeletonLoader type="table" rows={10} columns={4} />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50/80">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-widest w-20">STT</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-widest">Thẻ bài viết</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-widest text-center w-40">Trạng thái</th>
                  <th className="px-6 py-4 text-right text-xs font-black text-gray-500 uppercase tracking-widest w-32 pr-10">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {items.length > 0 ? items.map((tag: Tag, index) => {
                  const badge = getStatusBadge(tag.status || "", BASIC_STATUS_BADGES);
                  return (
                    <tr key={tag.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                        {getSerialNumber(index)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center transition-transform group-hover:scale-110">
                              <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                              </svg>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-black text-gray-900 group-hover:text-blue-600 transition-colors">{tag.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border transition-colors ${badge.className}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Actions
                          item={tag}
                          onEdit={() => openEdit(tag, endpoints)}
                          onDelete={() => openDelete(tag, endpoints)}
                        />
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500 italic font-medium">
                      Chưa có thẻ nào được tạo
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
        <CreateTag
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
        <EditTag
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
          message={`Bạn có chắc chắn muốn xóa thẻ "${deleteModal.data.displayName}"? Thao tác này không thể hoàn tác.`}
          onClose={deleteModal.close}
          onConfirm={handleDeleteConfirm}
          confirmText="Xác nhận xóa"
          confirmButtonClass="bg-rose-600 hover:bg-rose-700 shadow-rose-600/20"
        />
      )}
    </div>
  );
}

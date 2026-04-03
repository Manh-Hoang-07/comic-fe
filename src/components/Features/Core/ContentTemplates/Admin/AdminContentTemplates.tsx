"use client";

import { useAdminListPage } from "@/hooks/useAdminListPage";
import { adminEndpoints } from "@/lib/api/endpoints";
import { ContentTemplate } from "@/types/api";
import SkeletonLoader from "@/components/UI/Feedback/SkeletonLoader";
import ConfirmModal from "@/components/UI/Feedback/ConfirmModal";
import Actions from "@/components/UI/DataDisplay/Actions";
import Pagination from "@/components/UI/DataDisplay/Pagination";
import ContentTemplateFilter from "./ContentTemplateFilter";
import Modal from "@/components/UI/Feedback/Modal";
import ContentTemplateForm from "./ContentTemplateForm";
import ContentTemplateTestModal from "./ContentTemplateTestModal";
import { useState } from "react";

export default function AdminContentTemplates() {
    const [testModal, setTestModal] = useState<{ show: boolean; template: ContentTemplate | null }>({
        show: false,
        template: null,
    });

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
            list: adminEndpoints.contentTemplates.list,
            create: adminEndpoints.contentTemplates.create,
            update: (id) => adminEndpoints.contentTemplates.update(id),
            delete: (id) => adminEndpoints.contentTemplates.delete(id),
            show: (id) => adminEndpoints.contentTemplates.show(id),
        },
        messages: {
            createSuccess: "Đã tạo mẫu thành công",
            updateSuccess: "Đã cập nhật mẫu thành công",
            deleteSuccess: "Đã xóa mẫu thành công",
        },
        fetchDetailBeforeEdit: true,
    });

    const handleOpenTest = (item: ContentTemplate) => {
        setTestModal({ show: true, template: item });
    };

    const getTypeBadgeColor = (type: string) => {
        const colors: Record<string, string> = {
            email: "bg-blue-100 text-blue-800",
            telegram: "bg-sky-100 text-sky-800",
            zalo: "bg-indigo-100 text-indigo-800",
            sms: "bg-purple-100 text-purple-800",
            pdf_generated: "bg-red-100 text-red-800",
            file_word: "bg-blue-50 text-blue-600",
        };
        return colors[type] || "bg-gray-100 text-gray-800";
    };

    return (
        <div className="admin-ContentTemplates">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Mẫu nội dung</h1>
                <button
                    onClick={openCreateModal}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Thêm mẫu mới
                </button>
            </div>

            <ContentTemplateFilter
                initialFilters={filters}
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
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">STT</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mẫu / Mã</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Phân loại</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Loại / Kênh</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Trạng thái</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {items.length > 0 ? (
                                    items.map((item: ContentTemplate, index) => (
                                        <tr key={item.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                                {getSerialNumber(index)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-gray-900">{item.name}</span>
                                                    <span className="text-xs text-gray-400 font-mono">{item.code}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.category === 'render' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                                                    }`}>
                                                    {item.category === 'render' ? 'Render' : 'File'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeBadgeColor(item.type)}`}>
                                                    {item.type.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {item.status === 'active' ? 'Hoạt động' : 'Tạm ngưng'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <Actions
                                                    item={item}
                                                    onEdit={() => openEditModal(item)}
                                                    showDelete={false}
                                                    showView={false}
                                                    additionalActions={[
                                                        {
                                                            label: "Gửi thử",
                                                            icon: "view",
                                                            action: () => handleOpenTest(item),
                                                        },
                                                        {
                                                            label: "Xóa",
                                                            icon: "trash",
                                                            action: () => openDeleteModal(item),
                                                        }
                                                    ]}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-400 italic">
                                            Không tìm thấy mẫu nội dung nào
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
                    onPageChange={changePage}
                    totalItems={pagination.totalItems}
                />
            )}

            {/* Create Modal */}
            <Modal
                show={modals.create}
                onClose={closeCreateModal}
                title="Thêm mẫu nội dung mới"
                size="xl"
            >
                <div className="p-1">
                    <ContentTemplateForm
                        onSubmit={handleCreate}
                        loading={loading}
                        apiErrors={apiErrors}
                        onCancel={closeCreateModal}
                    />
                </div>
            </Modal>

            {/* Edit Modal */}
            <Modal
                show={modals.edit}
                onClose={closeEditModal}
                title="Chỉnh sửa mẫu nội dung"
                size="xl"
            >
                <div className="p-1">
                    {selectedItem && (
                        <ContentTemplateForm
                            initialData={selectedItem}
                            onSubmit={(data) => handleUpdate(selectedItem.id, data)}
                            loading={loading}
                            apiErrors={apiErrors}
                            onCancel={closeEditModal}
                        />
                    )}
                </div>
            </Modal>

            {/* Delete Confirmation */}
            {selectedItem && (
                <ConfirmModal
                    show={modals.delete}
                    title="Xác nhận xóa"
                    message={`Bạn có chắc chắn muốn xóa mẫu "${(selectedItem as ContentTemplate).name}"? Hành động này không thể hoàn tác.`}
                    onClose={closeDeleteModal}
                    onConfirm={() => handleDelete(selectedItem.id)}
                />
            )}

            {/* Test Modal */}
            {testModal.template && (
                <ContentTemplateTestModal
                    show={testModal.show}
                    template={testModal.template}
                    onClose={() => setTestModal({ show: false, template: null })}
                />
            )}
        </div>
    );
}



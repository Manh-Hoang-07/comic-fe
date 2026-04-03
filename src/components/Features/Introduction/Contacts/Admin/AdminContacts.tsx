"use client";

import { useAdminListPage } from "@/hooks/useAdminListPage";
import { adminEndpoints } from "@/lib/api/endpoints";
import ContactsFilter from "./ContactsFilter";
import SkeletonLoader from "@/components/UI/Feedback/SkeletonLoader";
import Actions from "@/components/UI/DataDisplay/Actions";
import Pagination from "@/components/UI/DataDisplay/Pagination";
import { formatDate } from "@/utils";
import ConfirmModal from "@/components/UI/Feedback/ConfirmModal";

interface AdminContactsProps {
    title?: string;
}

export default function AdminContacts({ title = "Quản lý Liên hệ" }: AdminContactsProps) {
    const {
        items,
        loading,
        pagination,
        filters,
        selectedItem,
        modals,
        updateFilters,
        changePage,
        handleDelete,
        getSerialNumber,
        hasData,
        openDeleteModal,
        closeDeleteModal,
        showSuccess,
    } = useAdminListPage({
        endpoints: {
            list: adminEndpoints.contacts.list,
            delete: (id) => adminEndpoints.contacts.delete(id),
        },
        messages: {
            deleteSuccess: "Liên hệ đã được xóa thành công",
        },
    });

    const getStatusLabel = (status: string) => {
        const map: Record<string, string> = {
            new: "Mới",
            read: "Đã xem",
            processing: "Đang xử lý",
            replied: "Đã phản hồi",
            closed: "Đã đóng",
        };
        return map[status] || status;
    };

    const getStatusClass = (status: string) => {
        const map: Record<string, string> = {
            new: "bg-blue-100 text-blue-800",
            read: "bg-green-100 text-green-800",
            processing: "bg-yellow-100 text-yellow-800",
            replied: "bg-purple-100 text-purple-800",
            closed: "bg-gray-100 text-gray-800",
        };
        return map[status] || "bg-gray-100 text-gray-800";
    };

    return (
        <div className="admin-contacts">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">{title}</h1>
            </div>

            <ContactsFilter
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
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Họ tên</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email/SĐT</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nội dung</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {items.map((contact, index) => (
                                    <tr key={contact.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getSerialNumber(index)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{contact.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div>{contact.email}</div>
                                            <div className="text-xs text-gray-400">{contact.phone}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={contact.message}>
                                            {contact.message}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(contact.status)}`}>
                                                {getStatusLabel(contact.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(contact.created_at)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <Actions
                                                item={contact}
                                                showEdit={false}
                                                onDelete={() => openDeleteModal(contact)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                                {!loading && items.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
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
                    onPageChange={changePage}
                />
            )}

            {selectedItem && (
                <ConfirmModal
                    show={modals.delete}
                    title="Xác nhận xóa"
                    message={`Bạn có chắc chắn muốn xóa liên hệ từ "${selectedItem.name}"?`}
                    onClose={closeDeleteModal}
                    onConfirm={() => handleDelete(selectedItem.id)}
                />
            )}
        </div>
    );
}



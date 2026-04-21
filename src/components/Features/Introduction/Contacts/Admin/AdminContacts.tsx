"use client";

import { useCrudList } from "@/hooks";
import { adminEndpoints } from "@/lib/api/endpoints";
import ContactsFilter from "./ContactsFilter";
import SkeletonLoader from "@/components/UI/Feedback/SkeletonLoader";
import Actions from "@/components/UI/DataDisplay/Actions";
import Pagination from "@/components/UI/DataDisplay/Pagination";
import { formatDate } from "@/utils";
import ConfirmModal from "@/components/UI/Feedback/ConfirmModal";
import { getStatusBadge } from "@/config/constants/status";
import { CONTACT_STATUS_BADGES } from "@/components/Features/Introduction/Contacts/constants";

const endpoints = adminEndpoints.contacts;

interface AdminContactsProps {
    title?: string;
}

export default function AdminContacts({ title = "Quản lý Liên hệ" }: AdminContactsProps) {
    const {
        data, actions, ui,
        deleteModal,
        handleDeleteConfirm, openDelete,
    } = useCrudList({
        endpoint: endpoints.list,
        deleteSuccessMessage: "Liên hệ đã được xóa thành công",
    });

    const { items, loading, pagination, filters, hasData } = data;
    const { getSerialNumber } = ui;

    return (
        <div className="admin-contacts">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">{title}</h1>
            </div>

            <ContactsFilter
                initialFilters={filters}
                onUpdateFilters={actions.updateFilters}
            />

            <div className="bg-white shadow-md rounded-lg overflow-hidden mt-6">
                {loading ? (
                    <SkeletonLoader type="table" rows={10} columns={7} />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Họ tên</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email/SĐT</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nội dung</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Trạng thái</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {items.length > 0 ? items.map((contact, index) => {
                                    const badge = getStatusBadge(contact.status, CONTACT_STATUS_BADGES);
                                    return (
                                        <tr key={contact.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getSerialNumber(index)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{contact.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div className="font-medium text-indigo-600">{contact.email}</div>
                                                <div className="text-xs text-gray-400">{contact.phone}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={contact.message}>
                                                {contact.message}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span className={`px-2 py-1 inline-flex text-[10px] leading-5 font-bold uppercase rounded-full ${badge.className}`}>
                                                    {badge.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(contact.created_at)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                                                <Actions
                                                    item={contact}
                                                    showEdit={false}
                                                    onDelete={() => openDelete(contact, endpoints)}
                                                />
                                            </td>
                                        </tr>
                                    );
                                }) : (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-10 text-center text-gray-500 italic">
                                            Không có dữ liệu liên hệ nào
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

            {deleteModal.isOpen && deleteModal.data && (
                <ConfirmModal
                    show={deleteModal.isOpen}
                    title="Xác nhận xóa"
                    message={`Bạn có chắc chắn muốn xóa liên hệ từ "${deleteModal.data.displayName}"?`}
                    onClose={deleteModal.close}
                    onConfirm={handleDeleteConfirm}
                />
            )}
        </div>
    );
}

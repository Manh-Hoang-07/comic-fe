"use client";

import { useCrudList } from "@/hooks";
import Image from "next/image";
import { adminEndpoints } from "@/lib/api/endpoints";
import SkeletonLoader from "@/components/UI/Feedback/SkeletonLoader";
import ConfirmModal from "@/components/UI/Feedback/ConfirmModal";
import Actions from "@/components/UI/DataDisplay/Actions";
import Pagination from "@/components/UI/DataDisplay/Pagination";
import PartnersFilter from "./PartnersFilter";
import CreatePartner from "./CreatePartner";
import EditPartner from "./EditPartner";
import { BASIC_STATUS_BADGES, getStatusBadge } from "@/config/constants/status";

const endpoints = adminEndpoints.partners;

const getPartnerTypeLabel = (value: string): string => {
  const labels: Record<string, string> = {
    supplier: "Nhà cung cấp",
    client: "Khách hàng",
    partner: "Đối tác",
    sponsor: "Nhà tài trợ",
    other: "Khác",
  };
  return labels[value] || value;
};

interface Partner {
  id: number;
  name: string;
  type?: string;
  logo?: string;
  website?: string;
  status?: string;
  sort_order?: number;
}

interface AdminPartnersProps {
  title?: string;
  createButtonText?: string;
}

export default function AdminPartners({
  title = "Quản lý đối tác",
  createButtonText = "Thêm đối tác mới",
}: AdminPartnersProps) {
  const {
    data, actions, ui,
    createModal, editModal, deleteModal,
    handleDeleteConfirm, openCreate, openEdit, openDelete,
  } = useCrudList({
    endpoint: endpoints.list,
    deleteSuccessMessage: "Đã xóa đối tác thành công",
  });

  const { items, loading, pagination, filters, hasData } = data;
  const { getSerialNumber } = ui;

  return (
    <div className="admin-partners">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        <button
          onClick={() => openCreate(endpoints.create)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none transition-colors"
        >
          {createButtonText}
        </button>
      </div>

      <PartnersFilter
        initialFilters={filters}
        onUpdateFilters={actions.updateFilters}
      />

      <div className="bg-white shadow-md rounded-lg overflow-hidden mt-6 border border-gray-100">
        {loading ? (
          <SkeletonLoader type="table" rows={5} columns={8} />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50/80">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    STT
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Tên đối tác
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Phân loại
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">
                    Logo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Website
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">
                    Thứ tự
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.length > 0 ? items.map((item: Partner, index) => {
                  const badge = getStatusBadge(item.status || "", BASIC_STATUS_BADGES);
                  return (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getSerialNumber(index)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{item.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-[10px] font-bold">
                          {getPartnerTypeLabel(item.type || "")}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {item.logo ? (
                          <div className="flex justify-center">
                            <Image
                              src={item.logo}
                              alt={item.name}
                              width={100}
                              height={48}
                              className="h-10 w-auto object-contain grayscale hover:grayscale-0 transition-all"
                            />
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">No logo</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {item.website ? (
                          <a
                            href={item.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-800 hover:underline inline-flex items-center gap-1"
                          >
                            {item.website}
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-colors border ${badge.className}`}
                        >
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center font-medium">
                        {item.sort_order ?? 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                        <Actions
                          item={item}
                          onEdit={() => openEdit(item, endpoints)}
                          onDelete={() => openDelete(item, endpoints)}
                        />
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500 italic">
                      Chưa có đối tác nào trong danh sách
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
        <CreatePartner
          show={createModal.isOpen}
          createApi={createModal.data.createApi}
          onClose={createModal.close}
          onSuccess={() => {
            createModal.close();
            actions.refresh();
          }}
        />
      )}

      {editModal.isOpen && editModal.data && (
        <EditPartner
          show={editModal.isOpen}
          target={editModal.data}
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
          message={`Bạn có chắc chắn muốn xóa đối tác "${deleteModal.data.displayName}"? Hành động này không thể khôi phục.`}
          onClose={deleteModal.close}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
}

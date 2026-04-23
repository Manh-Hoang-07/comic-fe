"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import api from "@/lib/api/client";
import { env } from "@/config/env";
import { useCrudList } from "@/hooks";
import { adminEndpoints } from "@/lib/api/endpoints";
import SkeletonLoader from "@/components/UI/Feedback/SkeletonLoader";
import ConfirmModal from "@/components/UI/Feedback/ConfirmModal";
import Actions from "@/components/UI/DataDisplay/Actions";
import Pagination from "@/components/UI/DataDisplay/Pagination";
import BannersFilter from "./BannersFilter";
import CreateBanner from "./CreateBanner";
import EditBanner from "./EditBanner";
import { BASIC_STATUS, BASIC_STATUS_BADGES, getStatusBadge } from "@/config/constants/status";
import { formatDateTime as formatDate } from "@/utils/formatters";

const endpoints = adminEndpoints.banners;

const getImageUrl = (path: string | null): string | null => {
  if (!path) return null;
  if (typeof path === "string" && (path.startsWith("http://") || path.startsWith("https://"))) {
    return path;
  }
  if (typeof path === "string" && path.startsWith("/")) {
    return `${env.apiUrl}${path}`;
  }
  return path;
};

interface Banner {
  id: number;
  title: string;
  subtitle?: string;
  image?: string;
  location?: { name: string };
  location_name?: string;
  sort_order?: number;
  status?: string;
  start_date?: string;
  end_date?: string;
  deleted_at?: string;
}

interface AdminBannersProps {
  title?: string;
  createButtonText?: string;
}

export default function AdminBanners({ title = "Quản lý banner", createButtonText = "Thêm banner mới" }: AdminBannersProps) {
  const {
    data, actions, ui, toast,
    createModal, editModal, deleteModal,
    handleDeleteConfirm, openCreate, openEdit,
  } = useCrudList({
    endpoint: endpoints.list,
    deleteSuccessMessage: "Đã xóa banner thành công",
  });

  const { items, loading, pagination, filters, hasData } = data;
  const { getSerialNumber } = ui;

  const [locationEnums, setLocationEnums] = useState<Array<{ id: number; name: string }>>([]);

  useEffect(() => {
    const fetchLocationEnums = async () => {
      try {
        const locationResponse = await api.get(adminEndpoints.bannerLocations.list);
        if (locationResponse.data?.success) {
          setLocationEnums(locationResponse.data.data || []);
        } else {
          setLocationEnums([]);
        }
      } catch (e) {
        setLocationEnums([]);
      }
    };
    fetchLocationEnums();
  }, []);

  const toggleStatus = async (banner: Banner) => {
    try {
      const newStatus = banner.status === "active" ? "inactive" : "active";
      const response = await api.patch(adminEndpoints.banners.updateStatus(banner.id), { status: newStatus });
      if (response.data?.success) {
        toast.success(`Đã ${newStatus === "active" ? "kích hoạt" : "vô hiệu hóa"} banner`);
        actions.refresh();
      } else {
        toast.error("Không thể cập nhật trạng thái banner");
      }
    } catch (error) {
      toast.error("Không thể cập nhật trạng thái banner");
    }
  };

  const restoreBanner = async (banner: Banner) => {
    try {
      const response = await api.put(adminEndpoints.banners.restore(banner.id));
      if (response.data?.success) {
        toast.success("Banner đã được khôi phục thành công");
        actions.refresh();
      } else {
        toast.error("Không thể khôi phục banner");
      }
    } catch (error) {
      toast.error("Không thể khôi phục banner");
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    if (target) {
      target.onerror = null;
      target.style.display = "none";
    }
  };

  return (
    <div className="admin-banners">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        <button
          onClick={() => openCreate(endpoints.create)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
        >
          {createButtonText}
        </button>
      </div>

      <BannersFilter initialFilters={filters} statusEnums={BASIC_STATUS} locationEnums={locationEnums} onUpdateFilters={actions.updateFilters} />

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {loading ? (
          <SkeletonLoader type="table" rows={5} columns={7} />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Banner</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vị trí</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thứ tự</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((banner: Banner, index) => {
                  const badge = getStatusBadge(banner.status || "", BASIC_STATUS_BADGES);
                  return (
                    <tr key={banner.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getSerialNumber(index)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {banner.image ? (
                              <Image
                                src={getImageUrl(banner.image) || ""}
                                alt={banner.title}
                                width={40}
                                height={40}
                                className="h-10 w-10 rounded-full object-cover"
                                crossOrigin={banner.image?.startsWith("http") ? "anonymous" : undefined}
                                onError={handleImageError}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-xs text-gray-500">N/A</span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{banner.title}</div>
                            <div className="text-sm text-gray-500">{banner.subtitle || "—"}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{banner.location?.name || banner.location_name || "—"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{banner.sort_order || 0}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col space-y-1">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${badge.className}`}>
                            {badge.label}
                          </span>
                          {(banner.start_date || banner.end_date) && (
                            <div className="text-xs text-gray-500">
                              {banner.start_date && <div>Bắt đầu: {formatDate(banner.start_date)}</div>}
                              {banner.end_date && <div>Kết thúc: {formatDate(banner.end_date)}</div>}
                            </div>
                          )}
                          {banner.deleted_at && <div className="text-xs text-red-600 font-medium">Đã xóa</div>}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Actions
                          item={banner}
                          showView={false}
                          showDelete={false}
                          onEdit={() => openEdit(banner, endpoints)}
                          additionalActions={[
                            {
                              label: banner.status === "active" ? "Vô hiệu hóa" : "Kích hoạt",
                              action: () => toggleStatus(banner),
                              icon: banner.status === "active" ? "eye-off" : "eye",
                            },
                            {
                              label: banner.deleted_at ? "Khôi phục" : "Xóa",
                              action: () => (banner.deleted_at ? restoreBanner(banner) : deleteModal.open({
                                id: banner.id,
                                displayName: banner.title,
                                deleteApi: adminEndpoints.banners.delete(banner.id)
                              })),
                              icon: banner.deleted_at ? "refresh" : "trash",
                            },
                          ]}
                        />
                      </td>
                    </tr>
                  );
                })}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-gray-500 italic">
                      Không tìm thấy banner nào
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
        <CreateBanner
          show={createModal.isOpen}
          createApi={createModal.data.createApi}
          statusEnums={BASIC_STATUS}
          locationEnums={locationEnums.map(l => ({ value: l.id, name: l.name, label: l.name }))}
          onClose={createModal.close}
          onSuccess={() => {
            createModal.close();
            actions.refresh();
          }}
        />
      )}

      {editModal.isOpen && editModal.data && (
        <EditBanner
          show={editModal.isOpen}
          target={editModal.data}
          statusEnums={BASIC_STATUS}
          locationEnums={locationEnums.map(l => ({ value: l.id, name: l.name, label: l.name }))}
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
          message={`Bạn có chắc chắn muốn xóa banner "${deleteModal.data.displayName}"?`}
          onClose={deleteModal.close}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
}

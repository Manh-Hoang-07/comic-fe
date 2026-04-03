"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import api from "@/lib/api/client";
import { useAdminListPage } from "@/hooks/useAdminListPage";
import { adminEndpoints } from "@/lib/api/endpoints";
import SkeletonLoader from "@/components/UI/Feedback/SkeletonLoader";
import ConfirmModal from "@/components/UI/Feedback/ConfirmModal";
import Actions from "@/components/UI/DataDisplay/Actions";
import Pagination from "@/components/UI/DataDisplay/Pagination";
import BannersFilter from "./BannersFilter";
import CreateBanner from "./CreateBanner";
import EditBanner from "./EditBanner";

const getStatusLabel = (status: string, statusEnums: any[]): string => {
  const found = statusEnums.find((s) => s.value === status);
  return found?.label || found?.name || status || "Không xác định";
};

const getStatusClass = (status: string, statusEnums: any[]): string => {
  const found = statusEnums.find((s) => s.value === status);
  return found?.class || found?.badge_class || found?.color_class || "bg-gray-100 text-gray-800";
};

const formatDate = (dateStr?: string): string => {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? "—" : date.toLocaleDateString("vi-VN", { year: "numeric", month: "short", day: "numeric" });
};

const getImageUrl = (path: string | null): string | null => {
  if (!path) return null;
  if (typeof path === "string" && (path.startsWith("http://") || path.startsWith("https://"))) {
    return path;
  }
  if (typeof path === "string" && path.startsWith("/")) {
    return `${process.env.NEXT_PUBLIC_API_BASE_URL || ""}${path}`;
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
    showSuccess,
    showError,
    refresh,
  } = useAdminListPage({
    endpoints: {
      list: adminEndpoints.banners.list,
      create: adminEndpoints.banners.create,
      update: (id) => adminEndpoints.banners.update(id),
      delete: (id) => adminEndpoints.banners.delete(id),
    },
    messages: {
      createSuccess: "Banner đã được tạo thành công",
      updateSuccess: "Banner đã được cập nhật thành công",
      deleteSuccess: "Banner đã được xóa thành công",
    },
  });

  const [statusEnums, setStatusEnums] = useState<any[]>([]);
  const [locationEnums, setLocationEnums] = useState<any[]>([]);

  const fetchEnums = async () => {
    try {
      const statusResponse = await api.get(adminEndpoints.enums.byName("basic_status"));
      if (statusResponse.data?.success) {
        setStatusEnums(statusResponse.data.data || []);
      } else {
        setStatusEnums([]);
      }
    } catch (e) {
      setStatusEnums([]);
    }

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

  useEffect(() => {
    fetchEnums();
  }, []);

  const toggleStatus = async (banner: Banner) => {
    try {
      const newStatus = banner.status === "active" ? "inactive" : "active";
      const response = await api.patch(adminEndpoints.banners.updateStatus(banner.id), { status: newStatus });
      if (response.data?.success) {
        showSuccess(`Đã ${newStatus === "active" ? "kích hoạt" : "vô hiệu hóa"} banner`);
        refresh();
      } else {
        showError("Không thể cập nhật trạng thái banner");
      }
    } catch (error) {
      showError("Không thể cập nhật trạng thái banner");
    }
  };

  const restoreBanner = async (banner: Banner) => {
    try {
      const response = await api.put(adminEndpoints.banners.restore(banner.id));
      if (response.data?.success) {
        showSuccess("Banner đã được khôi phục thành công");
        refresh();
      } else {
        showError("Không thể khôi phục banner");
      }
    } catch (error) {
      showError("Không thể khôi phục banner");
    }
  };

  const handleImageError = (e: any) => {
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
        <button onClick={openCreateModal} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none">
          {createButtonText}
        </button>
      </div>

      <BannersFilter initialFilters={filters} statusEnums={statusEnums} locationEnums={locationEnums} onUpdateFilters={updateFilters} />

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
                {items.map((banner: Banner, index) => (
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
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(banner.status || "", statusEnums)}`}>
                          {getStatusLabel(banner.status || "", statusEnums)}
                        </span>
                        {(banner.start_date || banner.end_date) && (
                          <div className="text-xs text-gray-500">
                            {banner.start_date && <div>Bắt đầu: {formatDate(banner.start_date)}</div>}
                            {banner.end_date && <div>Kết thúc: {formatDate(banner.end_date)}</div>}
                          </div>
                        )}
                        {banner.deleted_at && <div className="text-xs text-red-600">Đã xóa</div>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Actions
                        item={banner}
                        showView={false}
                        showDelete={false}
                        onEdit={() => openEditModal(banner)}
                        additionalActions={[
                          {
                            label: banner.status === "active" ? "Vô hiệu hóa" : "Kích hoạt",
                            action: () => toggleStatus(banner),
                            icon: banner.status === "active" ? "eye-off" : "eye",
                          },
                          {
                            label: banner.deleted_at ? "Khôi phục" : "Xóa",
                            action: () => (banner.deleted_at ? restoreBanner(banner) : openDeleteModal(banner)),
                            icon: banner.deleted_at ? "refresh" : "trash",
                          },
                        ]}
                      />
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      Không có dữ liệu
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {hasData && <Pagination currentPage={pagination.page} totalPages={pagination.totalPages} totalItems={pagination.totalItems} onPageChange={changePage} />}

      {modals.create && (
        <CreateBanner show={modals.create} statusEnums={statusEnums} locationEnums={locationEnums} apiErrors={apiErrors} onClose={closeCreateModal} onCreated={handleCreate} />
      )}

      {modals.edit && selectedItem && (
        <EditBanner
          show={modals.edit}
          bannerId={selectedItem.id}
          statusEnums={statusEnums}
          locationEnums={locationEnums}
          apiErrors={apiErrors}
          onClose={closeEditModal}
          onUpdated={(data) => handleUpdate(selectedItem.id, data)}
        />
      )}

      {selectedItem && (
        <ConfirmModal
          show={modals.delete}
          title="Xác nhận xóa"
          message={`Bạn có chắc chắn muốn xóa banner ${(selectedItem as Banner).title || ""}?`}
          onClose={closeDeleteModal}
          onConfirm={() => handleDelete(selectedItem.id)}
        />
      )}
    </div>
  );
}



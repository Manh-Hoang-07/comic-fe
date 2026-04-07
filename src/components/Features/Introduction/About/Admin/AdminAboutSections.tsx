"use client";

import { useListPage } from "@/hooks";
import useModal from "@/hooks/ui-ux/useModal";
import { adminEndpoints } from "@/lib/api/endpoints";
import SkeletonLoader from "@/components/UI/Feedback/SkeletonLoader";
import ConfirmModal from "@/components/UI/Feedback/ConfirmModal";
import Actions from "@/components/UI/DataDisplay/Actions";
import Pagination from "@/components/UI/DataDisplay/Pagination";
import AboutSectionsFilter from "./AboutSectionsFilter";
import CreateAboutSection from "./CreateAboutSection";
import EditAboutSection from "./EditAboutSection";
import { useToastContext } from "@/contexts/ToastContext";
import api from "@/lib/api/client";

// Enum helpers
const getAboutSectionTypeLabel = (value: string): string => {
  const labels: Record<string, string> = {
    history: "Lịch sử",
    mission: "Sứ mệnh",
    vision: "Tầm nhìn",
    values: "Giá trị cốt lõi",
    culture: "Văn hóa",
    achievement: "Thành tựu",
    other: "Khác",
  };
  return labels[value] || value;
};

const formatDate = (dateStr?: string): string => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? "-" : date.toLocaleString("vi-VN");
};

interface AboutSection {
  id: number;
  title: string;
  slug?: string;
  section_type?: string;
  status?: string;
  sort_order?: number;
  created_at?: string;
}

interface AdminAboutSectionsProps {
  title?: string;
  createButtonText?: string;
}

export default function AdminAboutSections({
  title = "Quản lý giới thiệu",
  createButtonText = "Thêm section mới",
}: AdminAboutSectionsProps) {
  const { data, actions, ui } = useListPage({
    endpoint: adminEndpoints.aboutSections.list,
  });
  
  const { items, loading, pagination, filters, hasData } = data;
  const { getSerialNumber } = ui;
  const { showSuccess, showError } = useToastContext();

  const createModal = useModal<{ createApi: string }>();
  const editModal = useModal<{ fetchApi?: string; initialData?: any; updateApi: string }>();
  const deleteModal = useModal<{ id: number | string; title?: string; deleteApi: string }>();

  const handleDeleteConfirm = async () => {
    if (!deleteModal.data?.deleteApi) return;
    try {
      await api.delete(deleteModal.data.deleteApi);
      showSuccess("Đã xóa section thành công");
      deleteModal.close();
      actions.refresh();
    } catch (error: any) {
      showError(error.response?.data?.message || "Có lỗi xảy ra khi xóa");
    }
  };

  return (
    <div className="admin-about-sections">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        <button
          onClick={() => createModal.open({ createApi: adminEndpoints.aboutSections.create })}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
        >
          {createButtonText}
        </button>
      </div>

      <AboutSectionsFilter
        initialFilters={filters}
        onUpdateFilters={actions.updateFilters}
      />

      <div className="bg-white shadow-md rounded-lg overflow-hidden mt-4">
        {loading ? (
          <SkeletonLoader type="table" rows={5} columns={8} />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    STT
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tiêu đề
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Slug
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                    Loại
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                    Thứ tự
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tạo lúc
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-right">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.length > 0 ? items.map((item: AboutSection, index) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getSerialNumber(index)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.slug || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      {getAboutSectionTypeLabel(item.section_type || "")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${item.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                          }`}
                      >
                        {item.status === "active" ? "Hoạt động" : "Không hoạt động"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      {item.sort_order ?? 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(item.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                      <Actions
                        item={item}
                        onEdit={() => editModal.open({
                          fetchApi: adminEndpoints.aboutSections.show(item.id),
                          updateApi: adminEndpoints.aboutSections.update(item.id)
                        })}
                        showView={false}
                        showDelete={false}
                        additionalActions={[
                          {
                            label: "Xóa",
                            action: () => deleteModal.open({
                              id: item.id,
                              title: item.title,
                              deleteApi: adminEndpoints.aboutSections.delete(item.id)
                            }),
                            icon: "trash",
                          },
                        ]}
                      />
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-10 text-center text-gray-500 italic">
                      Không tìm thấy section nào
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
        <CreateAboutSection
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
        <EditAboutSection
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
          message={`Bạn có chắc chắn muốn xóa section "${deleteModal.data.title}"?`}
          onClose={deleteModal.close}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
}




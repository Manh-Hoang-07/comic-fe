"use client";

import { useState, useEffect } from "react";
import { useListPage } from "@/hooks";
import useModal from "@/hooks/ui-ux/useModal";
import { adminEndpoints } from "@/lib/api/endpoints";
import SkeletonLoader from "@/components/UI/Feedback/SkeletonLoader";
import ConfirmModal from "@/components/UI/Feedback/ConfirmModal";
import Actions from "@/components/UI/DataDisplay/Actions";
import Pagination from "@/components/UI/DataDisplay/Pagination";
import ProjectsFilter from "./ProjectsFilter";
import CreateProject from "./CreateProject";
import EditProject from "./EditProject";
import { useToastContext } from "@/contexts/ToastContext";
import api from "@/lib/api/client";

const getProjectStatusArray = () => [
  { value: "planning", label: "Đang lập kế hoạch" },
  { value: "in_progress", label: "Đang thực hiện" },
  { value: "completed", label: "Hoàn thành" },
  { value: "on_hold", label: "Tạm dừng" },
  { value: "cancelled", label: "Đã hủy" },
];

const getProjectStatusLabel = (value: string): string => {
  const status = getProjectStatusArray().find((s) => s.value === value);
  return status?.label || value;
};

const getProjectStatusClass = (value: string): string => {
  const classes: Record<string, string> = {
    planning: "bg-gray-100 text-gray-800 border-gray-200",
    in_progress: "bg-blue-100 text-blue-800 border-blue-200",
    completed: "bg-green-100 text-green-800 border-green-200",
    on_hold: "bg-yellow-100 text-yellow-800 border-yellow-200",
    cancelled: "bg-red-100 text-red-800 border-red-200",
  };
  return classes[value] || "bg-gray-100 text-gray-800";
};

const formatDate = (dateStr?: string): string => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? "-" : date.toLocaleDateString("vi-VN");
};

interface Project {
  id: number;
  name: string;
  location?: string;
  status?: string;
  featured?: boolean;
  created_at?: string;
}

interface AdminProjectsProps {
  title?: string;
  createButtonText?: string;
}

export default function AdminProjects({
  title = "Quản lý dự án",
  createButtonText = "Thêm dự án mới",
}: AdminProjectsProps) {
  const { data, actions, ui } = useListPage({
    endpoint: adminEndpoints.projects.list,
  });
  
  const { items, loading, pagination, filters, hasData } = data;
  const { getSerialNumber } = ui;
  const { showSuccess, showError } = useToastContext();

  const createModal = useModal<{ createApi: string }>();
  const editModal = useModal<{ fetchApi?: string; initialData?: any; updateApi: string }>();
  const deleteModal = useModal<{ id: number | string; name?: string; deleteApi: string }>();

  const [statusEnums, setStatusEnums] = useState<Array<{ value: string; label?: string; name?: string }>>([]);

  useEffect(() => {
    setStatusEnums(getProjectStatusArray());
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteModal.data?.deleteApi) return;
    try {
      await api.delete(deleteModal.data.deleteApi);
      showSuccess("Dự án đã được xóa thành công");
      deleteModal.close();
      actions.refresh();
    } catch (error: any) {
      showError(error.response?.data?.message || "Có lỗi xảy ra khi xóa");
    }
  };

  return (
    <div className="admin-projects">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        <button
          onClick={() => createModal.open({ createApi: adminEndpoints.projects.create })}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none transition-colors"
        >
          {createButtonText}
        </button>
      </div>

      <ProjectsFilter
        initialFilters={filters}
        statusEnums={statusEnums}
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
                    Tên dự án
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Địa điểm
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">
                    Nổi bật
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Ngày tạo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.length > 0 ? items.map((project: Project, index) => (
                  <tr key={project.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getSerialNumber(index)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-gray-900 line-clamp-1">{project.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {project.location || "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span
                        className={`px-2.5 py-1 inline-flex text-[10px] font-bold uppercase rounded-full border ${getProjectStatusClass(
                          project.status || ""
                        )}`}
                      >
                        {getProjectStatusLabel(project.status || "")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {project.featured ? (
                        <span className="px-2 py-0.5 text-[10px] font-black uppercase rounded bg-amber-100 text-amber-700 border border-amber-200">
                          Nổi bật
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(project.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                      <Actions
                        item={project}
                        showView={false}
                        showDelete={false}
                        onEdit={() => editModal.open({
                          fetchApi: adminEndpoints.projects.show(project.id),
                          updateApi: adminEndpoints.projects.update(project.id)
                        })}
                        additionalActions={[
                          {
                            label: project.featured ? "Bỏ nổi bật" : "Đánh dấu nổi bật",
                            action: () => { },
                            icon: "star",
                          },
                          {
                            label: "Xóa",
                            action: () => deleteModal.open({
                              id: project.id,
                              name: project.name,
                              deleteApi: adminEndpoints.projects.delete(project.id)
                            }),
                            icon: "trash",
                          },
                        ]}
                      />
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500 italic">
                      Không tìm thấy dự án nào ứng với bộ lọc
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
        <CreateProject
          show={createModal.isOpen}
          createApi={createModal.data.createApi}
          statusEnums={statusEnums}
          onClose={createModal.close}
          onSuccess={() => {
            createModal.close();
            actions.refresh();
          }}
        />
      )}

      {editModal.isOpen && editModal.data && (
        <EditProject
          show={editModal.isOpen}
          target={editModal.data}
          statusEnums={statusEnums}
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
          message={`Bạn có chắc chắn muốn xóa dự án "${deleteModal.data.name}"? Thao tác này không thể hoàn tác.`}
          onClose={deleteModal.close}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
}




"use client";

import { useState, useEffect } from "react";
import { useAdminListPage } from "@/hooks/useAdminListPage";
import { adminEndpoints } from "@/lib/api/endpoints";
import SkeletonLoader from "@/components/UI/Feedback/SkeletonLoader";
import ConfirmModal from "@/components/UI/Feedback/ConfirmModal";
import Actions from "@/components/UI/DataDisplay/Actions";
import Pagination from "@/components/UI/DataDisplay/Pagination";
import ProjectsFilter from "./ProjectsFilter";
import CreateProject from "./CreateProject";
import EditProject from "./EditProject";

const getProjectStatusArray = () => [
  { value: "planning", label: "Đang lập kế hoạch" },
  { value: "in_progres", label: "Đang thực hiện" },
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
    planning: "bg-gray-100 text-gray-800",
    in_progress: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    on_hold: "bg-yellow-100 text-yellow-800",
    cancelled: "bg-red-100 text-red-800",
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
      list: adminEndpoints.projects.list,
      create: adminEndpoints.projects.create,
      update: (id) => adminEndpoints.projects.update(id),
      delete: (id) => adminEndpoints.projects.delete(id),
      show: (id) => adminEndpoints.projects.show(id),
    },
    messages: {
      createSuccess: "Dự án đã được tạo thành công",
      updateSuccess: "Dự án đã được cập nhật thành công",
      deleteSuccess: "Dự án đã được xóa thành công",
    },
    fetchDetailBeforeEdit: true,
  });

  const [statusEnums, setStatusEnums] = useState<Array<{ value: string; label?: string; name?: string }>>([]);

  useEffect(() => {
    setStatusEnums(getProjectStatusArray());
  }, []);

  return (
    <div className="admin-projects">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
        >
          {createButtonText}
        </button>
      </div>

      <ProjectsFilter
        initialFilters={filters}
        statusEnums={statusEnums}
        onUpdateFilters={updateFilters}
      />

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
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
                    Tên dự án
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Địa điểm
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nổi bật
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày tạo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((project: Project, index) => (
                  <tr key={project.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getSerialNumber(index)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{project.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {project.location || "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getProjectStatusClass(
                          project.status || ""
                        )}`}
                      >
                        {getProjectStatusLabel(project.status || "")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {project.featured ? (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Nổi bật
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(project.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Actions
                        item={project}
                        showView={false}
                        showDelete={false}
                        onEdit={() => openEditModal(project)}
                        additionalActions={[
                          {
                            label: project.featured ? "Bỏ nổi bật" : "Đánh dấu nổi bật",
                            action: () => { },
                            icon: "star",
                          },
                          {
                            label: "Xóa",
                            action: () => openDeleteModal(project),
                            icon: "trash",
                          },
                        ]}
                      />
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
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

      {modals.create && (
        <CreateProject
          show={modals.create}
          statusEnums={statusEnums}
          apiErrors={apiErrors}
          onClose={closeCreateModal}
          onCreated={handleCreate}
        />
      )}

      {modals.edit && selectedItem && (
        <EditProject
          show={modals.edit}
          project={selectedItem}
          statusEnums={statusEnums}
          apiErrors={apiErrors}
          onClose={closeEditModal}
          onUpdated={(data) => handleUpdate(selectedItem.id, data)}
        />
      )}

      {selectedItem && (
        <ConfirmModal
          show={modals.delete}
          title="Xác nhận xóa"
          message={`Bạn có chắc chắn muốn xóa dự án ${(selectedItem as Project).name || ""}?`}
          onClose={closeDeleteModal}
          onConfirm={() => handleDelete(selectedItem.id)}
        />
      )}
    </div>
  );
}



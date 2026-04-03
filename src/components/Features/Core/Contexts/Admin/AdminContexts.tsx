"use client";

import { useState, useEffect } from "react";
import { useListPage } from "@/hooks";
import { adminEndpoints } from "@/lib/api/endpoints";
import SkeletonLoader from "@/components/UI/Feedback/SkeletonLoader";
import ConfirmModal from "@/components/UI/Feedback/ConfirmModal";
import Actions from "@/components/UI/DataDisplay/Actions";
import Pagination from "@/components/UI/DataDisplay/Pagination";
import ContextsFilter from "./ContextsFilter";
import CreateContext from "./CreateContext";
import EditContext from "./EditContext";

const getBasicStatusArray = () => [
  { value: "active", label: "Hoạt động" },
  { value: "inactive", label: "Ngừng hoạt động" },
];

const getTypeLabel = (value: string): string => {
  const labels: Record<string, string> = {
    system: "System",
    shop: "Shop",
    team: "Team",
    project: "Project",
    department: "Department",
    organization: "Organization",
  };
  return labels[value] || value;
};

const getStatusLabel = (value: string): string => {
  const status = getBasicStatusArray().find((s) => s.value === value);
  return status?.label || value;
};

const getStatusClass = (value: string): string => {
  const classes: Record<string, string> = {
    active: "bg-green-100 text-green-800",
    inactive: "bg-gray-100 text-gray-800",
  };
  return classes[value] || "bg-gray-100 text-gray-800";
};

interface Context {
  id: number;
  type?: string;
  code?: string;
  name?: string;
  status?: string;
}

interface AdminContextsProps {
  title?: string;
  createButtonText?: string;
}

export default function AdminContexts({
  title = "Quản lý contexts",
  createButtonText = "Thêm context mới",
}: AdminContextsProps) {
  const {
    items,
    loading,
    pagination,
    filters,
    apiErrors,
    hasData,
    getSerialNumber,
    modal,
    actions,
  } = useListPage({
    endpoints: {
      list: adminEndpoints.contexts.list,
      create: adminEndpoints.contexts.create,
      update: (id) => adminEndpoints.contexts.update(id),
      delete: (id) => adminEndpoints.contexts.delete(id),
      show: (id) => adminEndpoints.contexts.show(id),
    },
    messages: {
      createSuccess: "Đã tạo thành công",
      updateSuccess: "Đã cập nhật thành công",
      deleteSuccess: "Đã xóa thành công",
    },
    fetchDetailBeforeEdit: true,
  });

  const [statusEnums, setStatusEnums] = useState<Array<{ value: string; label?: string; name?: string }>>([]);

  useEffect(() => {
    setStatusEnums(getBasicStatusArray());
  }, []);

  return (
    <div className="admin-contexts">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        <button
          onClick={() => modal.open("create")}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
        >
          {createButtonText}
        </button>
      </div>

      <ContextsFilter
        initialFilters={filters}
        statusEnums={statusEnums}
        onUpdateFilters={actions.updateFilters}
      />

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {loading ? (
          <SkeletonLoader type="table" rows={5} columns={6} />
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((context: Context, index) => (
                <tr key={context.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getSerialNumber(index)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <code className="px-2 py-1 bg-gray-100 rounded text-xs">{context.id}</code>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {getTypeLabel(context.type || "")}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{context.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(context.status || "")}`}>
                      {getStatusLabel(context.status || "")}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Actions
                      item={context}
                      onEdit={() => modal.open("edit", context)}
                      onDelete={() => modal.open("delete", context)}
                    />
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">Không có dữ liệu</td>
                </tr>
              )}
            </tbody>
          </table>
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

      {modal.state.create && (
        <CreateContext
          show={modal.state.create}
          statusEnums={statusEnums}
          apiErrors={apiErrors}
          onClose={() => modal.close("create")}
          onCreated={actions.create}
        />
      )}

      {modal.state.edit && modal.selected && (
        <EditContext
          show={modal.state.edit}
          context={modal.selected}
          statusEnums={statusEnums}
          apiErrors={apiErrors}
          onClose={() => modal.close("edit")}
          onUpdated={(data) => actions.update(modal.selected.id, data)}
        />
      )}

      {modal.selected && (
        <ConfirmModal
          show={modal.state.delete}
          title="Xác nhận xóa"
          message={`Bạn có chắc chắn muốn xóa context ${(modal.selected as Context).name || ""}?`}
          onClose={() => modal.close("delete")}
          onConfirm={() => actions.delete(modal.selected.id)}
        />
      )}
    </div>
  );
}

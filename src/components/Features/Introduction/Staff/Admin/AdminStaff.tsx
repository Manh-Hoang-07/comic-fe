"use client";

import { useListPage } from "@/hooks";
import { adminEndpoints } from "@/lib/api/endpoints";
import SkeletonLoader from "@/components/UI/Feedback/SkeletonLoader";
import ConfirmModal from "@/components/UI/Feedback/ConfirmModal";
import Actions from "@/components/UI/DataDisplay/Actions";
import Pagination from "@/components/UI/DataDisplay/Pagination";
import StaffFilter from "./StaffFilter";
import CreateStaff from "./CreateStaff";
import EditStaff from "./EditStaff";

interface Staff {
  id: number;
  name: string;
  position: string;
  department?: string;
  email?: string;
  phone?: string;
  status?: string;
  sort_order?: number;
}

interface AdminStaffProps {
  title?: string;
  createButtonText?: string;
}

export default function AdminStaff({
  title = "Quản lý nhân viên",
  createButtonText = "Thêm nhân viên mới",
}: AdminStaffProps) {
  const { data, modal, actions, ui } = useListPage({
    endpoints: {
      list: adminEndpoints.staff.list,
      create: adminEndpoints.staff.create,
      update: (id) => adminEndpoints.staff.update(id),
      delete: (id) => adminEndpoints.staff.delete(id),
      show: (id) => adminEndpoints.staff.show(id),
    },
    messages: {
      createSuccess: "Đã tạo thành công",
      updateSuccess: "Đã cập nhật thành công",
      deleteSuccess: "Đã xóa thành công",
    },
    fetchDetailBeforeEdit: true,
  });
  const { items, loading, pagination, filters, apiErrors, hasData } = data;
  const { getSerialNumber } = ui;

  return (
    <div className="admin-staff">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        <button
          onClick={() => modal.open("create")}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
        >
          {createButtonText}
        </button>
      </div>

      <StaffFilter
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    STT
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Tên
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Chức vụ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Phòng ban
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Thứ tự
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((item: Staff, index) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {getSerialNumber(index)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{item.position}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{item.department || "-"}</td>
                    <td className="px-6 py-4 text-sm">
                      {item.email ? (
                        <a
                          href={`mailto:${item.email}`}
                          className="text-blue-600 hover:underline"
                        >
                          {item.email}
                        </a>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${item.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                          }`}
                      >
                        {item.status === "active" ? "Hoạt động" : "Không hoạt động"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {item.sort_order ?? 0}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <Actions
                        item={item}
                        onEdit={() => modal.open("edit", item)}
                        showView={false}
                        showDelete={false}
                        additionalActions={[
                          {
                            label: "Xóa",
                            action: () => modal.open("delete", item),
                            icon: "trash",
                          },
                        ]}
                      />
                    </td>
                  </tr>
                ))}
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

      {modal.state.create && (
        <CreateStaff
          show={modal.state.create}
          apiErrors={apiErrors}
          onClose={() => modal.close("create")}
          onCreated={actions.create}
        />
      )}

      {modal.state.edit && modal.selected && (
        <EditStaff
          show={modal.state.edit}
          staff={modal.selected}
          apiErrors={apiErrors}
          onClose={() => modal.close("edit")}
          onUpdated={(data) => actions.update(modal.selected.id, data)}
        />
      )}

      {modal.selected && (
        <ConfirmModal
          show={modal.state.delete}
          title="Xác nhận xóa"
          message={`Bạn có chắc chắn muốn xóa ${(modal.selected as Staff).name || ""}?`}
          onClose={() => modal.close("delete")}
          onConfirm={() => actions.delete(modal.selected.id)}
        />
      )}
    </div>
  );
}




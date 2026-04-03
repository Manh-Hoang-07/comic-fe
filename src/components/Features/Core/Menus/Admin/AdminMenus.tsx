"use client";

import { useState, useCallback, useEffect } from "react";
import api from "@/lib/api/client";
import { adminEndpoints } from "@/lib/api/endpoints";
import { useListPage } from "@/hooks";
import SkeletonLoader from "@/components/UI/Feedback/SkeletonLoader";
import ConfirmModal from "@/components/UI/Feedback/ConfirmModal";
import Actions from "@/components/UI/DataDisplay/Actions";
import Pagination from "@/components/UI/DataDisplay/Pagination";
import MenusFilter from "./MenusFilter";
import CreateMenu from "./CreateMenu";
import EditMenu from "./EditMenu";

interface Menu {
  id: number;
  code: string;
  name: string;
  path?: string;
  type?: string;
  status?: string;
  icon?: string;
  show_in_menu?: boolean;
  deleted_at?: string;
  parent?: { id: number; name: string };
  group?: string;
}

interface AdminMenusProps {
  title?: string;
  createButtonText?: string;
}

const getTypeLabel = (type?: string): string => {
  const typeMap: Record<string, string> = {
    route: "Route",
    group: "Group",
    link: "Link",
  };
  return typeMap[type || ""] || type || "—";
};

export default function AdminMenus({ title = "Quản lý menu", createButtonText = "Thêm menu mới" }: AdminMenusProps) {
  const {
    items,
    loading,
    pagination,
    filters,
    apiErrors,
    hasData,
    getSerialNumber, toast,
    modal,
    actions,
  } = useListPage({
    endpoints: {
      list: adminEndpoints.menus.list,
      create: adminEndpoints.menus.create,
      update: (id) => adminEndpoints.menus.update(id),
      delete: (id) => adminEndpoints.menus.delete(id),
    },
    messages: {
      createSuccess: "Menu đã được tạo thành công",
      updateSuccess: "Menu đã được cập nhật thành công",
      deleteSuccess: "Menu đã được xóa thành công",
      deleteError: "Không thể xóa menu",
    },
  });

  const [statusEnums, setStatusEnums] = useState<any[]>([]);
  const [parentMenus, setParentMenus] = useState<any[]>([]);
  const [permissions, setPermissions] = useState<any[]>([]);

  const fetchEnums = useCallback(async () => {
    try {
      setStatusEnums([
        { value: "active", label: "Hoạt động", class: "bg-green-100 text-green-800" },
        { value: "inactive", label: "Ngừng hoạt động", class: "bg-gray-100 text-gray-800" },
      ]);
    } catch (e) {
      setStatusEnums([]);
    }

    try {
      const response = await api.get(adminEndpoints.menus.tree);
      if (response.data?.success) {
        setParentMenus(response.data.data || []);
      } else {
        setParentMenus(response.data?.data || response.data || []);
      }
    } catch (e) {
      setParentMenus([]);
    }

    try {
      const response = await api.get(adminEndpoints.permissions.list);
      if (response.data?.success) {
        setPermissions(response.data.data || []);
      } else {
        const data = response.data?.data || response.data || [];
        // Handle different pagination structures if needed, or simple list
        setPermissions(Array.isArray(data) ? data : data.items || data.data || []);
      }
    } catch (e) {
      setPermissions([]);
    }
  }, []);

  useEffect(() => {
    fetchEnums();
  }, [fetchEnums]);

  // Hook into create/update to refresh enums after
  const customHandleCreate = async (data: any) => {
    await actions.create(data);
    fetchEnums();
  };

  const customHandleUpdate = async (id: any, data: any) => {
    await actions.update(id, data);
    fetchEnums();
  };

  const restoreMenu = async (menu: Menu) => {
    try {
      const response = await api.put(adminEndpoints.menus.restore(menu.id));
      if (response.data?.success) {
        toast.success("Menu đã được khôi phục thành công");
        actions.refresh();
      } else {
        toast.error("Không thể khôi phục menu");
      }
    } catch (error) {
      toast.error("Không thể khôi phục menu");
    }
  };

  const getStatusLabel = (status?: string): string => {
    const found = statusEnums.find((s) => s.value === status);
    return found?.label || found?.name || status || "Không xác định";
  };

  const getStatusClass = (status?: string): string => {
    const found = statusEnums.find((s) => s.value === status);
    return found?.class || found?.badge_class || found?.color_class || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="admin-menus">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        <button onClick={() => modal.open("create")} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none">
          {createButtonText}
        </button>
      </div>

      <MenusFilter initialFilters={filters} statusEnums={statusEnums} parentMenus={parentMenus} onUpdateFilters={actions.updateFilters} />

      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        {loading ? (
          <SkeletonLoader type="table" rows={5} columns={6} />
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Menu</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Path</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nhóm</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((menu: Menu, index) => (
                <tr key={menu.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getSerialNumber(index)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-lg">{menu.icon || "📋"}</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{menu.name}</div>
                        <div className="text-sm text-gray-500">{menu.code}</div>
                        {menu.parent && <div className="text-xs text-gray-400">Cha: {menu.parent.name}</div>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="max-w-xs truncate" title={menu.path || "—"}>
                      {menu.path || "—"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">{getTypeLabel(menu.type)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${menu.group === 'client' ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800'}`}>
                      {menu.group === 'client' ? 'Client' : 'Admin'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-1">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(menu.status)}`}>
                        {getStatusLabel(menu.status)}
                      </span>
                      {!menu.show_in_menu && (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">Ẩn trong menu</span>
                      )}
                      {menu.deleted_at && <div className="text-xs text-red-600">Đã xóa</div>}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Actions
                      item={menu}
                      showView={false}
                      showDelete={false}
                      onEdit={() => modal.open("edit", menu)}
                      additionalActions={[
                        {
                          label: menu.deleted_at ? "Khôi phục" : "Xóa",
                          action: () => (menu.deleted_at ? restoreMenu(menu) : modal.open("delete", menu)),
                          icon: menu.deleted_at ? "refresh" : "trash",
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
        )}
      </div>

      {hasData && <Pagination currentPage={pagination.page} totalPages={pagination.totalPages} totalItems={pagination.totalItems} onPageChange={actions.changePage} />}

      {modal.state.create && (
        <CreateMenu
          show={modal.state.create}
          statusEnums={statusEnums}
          parentMenus={parentMenus}
          permissions={permissions}
          apiErrors={apiErrors}
          onClose={() => modal.close("create")}
          onCreated={customHandleCreate}
        />
      )}

      {modal.state.edit && modal.selected && (
        <EditMenu
          show={modal.state.edit}
          menu={modal.selected}
          statusEnums={statusEnums}
          parentMenus={parentMenus}
          permissions={permissions}
          apiErrors={apiErrors}
          onClose={() => modal.close("edit")}
          onUpdated={(data) => customHandleUpdate(modal.selected.id, data)}
        />
      )}

      {modal.selected && (
        <ConfirmModal
          show={modal.state.delete}
          title="Xác nhận xóa"
          message={`Bạn có chắc chắn muốn xóa menu ${(modal.selected as Menu).name || ""}?`}
          onClose={() => modal.close("delete")}
          onConfirm={() => actions.delete(modal.selected.id)}
        />
      )}
    </div>
  );
}





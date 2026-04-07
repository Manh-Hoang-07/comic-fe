"use client";

import { useState, useCallback, useEffect } from "react";
import api from "@/lib/api/client";
import { adminEndpoints } from "@/lib/api/endpoints";
import { useListPage } from "@/hooks";
import useModal from "@/hooks/ui-ux/useModal";
import SkeletonLoader from "@/components/UI/Feedback/SkeletonLoader";
import ConfirmModal from "@/components/UI/Feedback/ConfirmModal";
import Actions from "@/components/UI/DataDisplay/Actions";
import Pagination from "@/components/UI/DataDisplay/Pagination";
import { useToastContext } from "@/contexts/ToastContext";
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
  const { data, actions, ui } = useListPage({
    endpoint: adminEndpoints.menus.list,
  });
  
  const { items, loading, pagination, filters, hasData } = data;
  const { getSerialNumber } = ui;
  const { showSuccess, showError } = useToastContext();

  const [statusEnums, setStatusEnums] = useState<any[]>([]);
  const [parentMenus, setParentMenus] = useState<any[]>([]);
  const [permissions, setPermissions] = useState<any[]>([]);

  const fetchEnums = useCallback(async () => {
    try {
      setStatusEnums([
        { value: "active", label: "Hoạt động", class: "bg-green-100 text-green-800" },
        { value: "inactive", label: "Ngừng hoạt động", class: "bg-gray-100 text-gray-800" },
      ]);
      
      const [treeRes, permRes] = await Promise.all([
        api.get(adminEndpoints.menus.tree),
        api.get(adminEndpoints.permissions.list)
      ]);

      if (treeRes.data?.success || treeRes.data) {
        setParentMenus(treeRes.data.data || treeRes.data || []);
      }

      if (permRes.data?.success || permRes.data) {
        const pData = permRes.data.data || permRes.data || [];
        setPermissions(Array.isArray(pData) ? pData : pData.items || pData.data || []);
      }
    } catch (e) {
      console.error("Failed to fetch enums", e);
    }
  }, []);

  useEffect(() => {
    fetchEnums();
  }, [fetchEnums]);

  const restoreMenu = async (menu: Menu) => {
    try {
      const response = await api.put(adminEndpoints.menus.restore(menu.id));
      if (response.data?.success) {
        showSuccess("Menu đã được khôi phục thành công");
        actions.refresh();
        fetchEnums();
      } else {
        showError("Không thể khôi phục menu");
      }
    } catch (error) {
      showError("Không thể khôi phục menu");
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

  const createModal = useModal<{ createApi: string }>();
  const editModal = useModal<{ fetchApi?: string; initialData?: any; updateApi: string }>();
  const deleteModal = useModal<{ id: number; name?: string; deleteApi: string }>();

  const handleDeleteConfirm = async () => {
    if (!deleteModal.data?.deleteApi) return;
    try {
      await api.delete(deleteModal.data.deleteApi);
      showSuccess("Menu đã được xóa thành công");
      deleteModal.close();
      actions.refresh();
      fetchEnums();
    } catch (error: any) {
      showError(error.response?.data?.message || "Có lỗi xảy ra khi xóa");
    }
  };

  return (
    <div className="admin-menus">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        <button 
          onClick={() => createModal.open({ createApi: adminEndpoints.menus.create })} 
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
        >
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
                      onEdit={() => editModal.open({ 
                        fetchApi: adminEndpoints.menus.show(menu.id),
                        updateApi: adminEndpoints.menus.update(menu.id)
                      })}
                      additionalActions={[
                        {
                          label: menu.deleted_at ? "Khôi phục" : "Xóa",
                          action: () => (menu.deleted_at ? restoreMenu(menu) : deleteModal.open({
                            id: menu.id,
                            name: menu.name,
                            deleteApi: adminEndpoints.menus.delete(menu.id)
                          })),
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

      {createModal.isOpen && createModal.data && (
        <CreateMenu
          show={createModal.isOpen}
          createApi={createModal.data.createApi}
          statusEnums={statusEnums}
          parentMenus={parentMenus}
          permissions={permissions}
          onClose={createModal.close}
          onSuccess={() => {
            createModal.close();
            actions.refresh();
            fetchEnums();
          }}
        />
      )}

      {editModal.isOpen && editModal.data && (
        <EditMenu
          show={editModal.isOpen}
          target={editModal.data}
          statusEnums={statusEnums}
          parentMenus={parentMenus}
          permissions={permissions}
          onClose={editModal.close}
          onSuccess={() => {
            editModal.close();
            actions.refresh();
            fetchEnums();
          }}
        />
      )}

      {deleteModal.isOpen && deleteModal.data && (
        <ConfirmModal
          show={deleteModal.isOpen}
          title="Xác nhận xóa"
          message={`Bạn có chắc chắn muốn xóa menu "${deleteModal.data.name || ""}"?`}
          onClose={deleteModal.close}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
}





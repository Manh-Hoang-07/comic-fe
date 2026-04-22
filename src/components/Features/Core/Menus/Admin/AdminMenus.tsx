"use client";

import { useState, useCallback, useEffect } from "react";
import api from "@/lib/api/client";
import { adminEndpoints } from "@/lib/api/endpoints";
import { useCrudList } from "@/hooks";
import { BASIC_STATUS, BASIC_STATUS_BADGES, getStatusBadge } from "@/config/constants/status";
import SkeletonLoader from "@/components/UI/Feedback/SkeletonLoader";
import ConfirmModal from "@/components/UI/Feedback/ConfirmModal";
import Actions from "@/components/UI/DataDisplay/Actions";
import Pagination from "@/components/UI/DataDisplay/Pagination";
import MenusFilter from "./MenusFilter";
import CreateMenu from "./CreateMenu";
import EditMenu from "./EditMenu";
import { type Menu, type AdminMenusProps } from "./Constants/types";
import { MenuTreeItem } from "@/hooks/data/system/useMenus";

const endpoints = adminEndpoints.menus;



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
    data, actions, ui,
    createModal, editModal, deleteModal,
    handleDeleteConfirm: defaultDeleteConfirm, openCreate, openEdit, openDelete,
    toast,
  } = useCrudList({
    endpoint: endpoints.list,
    deleteSuccessMessage: "Menu đã được xóa thành công",
  });

  const { items, loading, pagination, filters, hasData } = data;
  const { getSerialNumber } = ui;

  const [parentMenus, setParentMenus] = useState<MenuTreeItem[]>([]);
  const [permissions, setPermissions] = useState<Array<{ id: number; name: string; code: string }>>([]);

  const fetchRelatedData = useCallback(async () => {
    try {
      const [treeRes, permRes] = await Promise.all([
        api.get(adminEndpoints.menus.tree),
        api.get(adminEndpoints.permissions.simple)
      ]);

      if (treeRes.data?.success || treeRes.data) {
        setParentMenus(treeRes.data.data || treeRes.data || []);
      }

      if (permRes.data?.success || permRes.data) {
        const pData = permRes.data.data || permRes.data || [];
        setPermissions(Array.isArray(pData) ? pData : pData.items || pData.data || []);
      }
    } catch (e) {
      console.error("Failed to fetch related data", e);
    }
  }, []);

  useEffect(() => {
    fetchRelatedData();
  }, [fetchRelatedData]);

  const restoreMenu = async (menu: Menu) => {
    try {
      const response = await api.put(endpoints.restore(menu.id));
      if (response.data?.success) {
        toast.success("Menu đã được khôi phục thành công");
        actions.refresh();
        fetchRelatedData();
      } else {
        toast.error("Không thể khôi phục menu");
      }
    } catch (error) {
      toast.error("Không thể khôi phục menu");
    }
  };

  const handleDeleteConfirm = async () => {
    await defaultDeleteConfirm();
    fetchRelatedData();
  };

  return (
    <div className="admin-menus">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        <button
          onClick={() => openCreate(endpoints.create)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
        >
          {createButtonText}
        </button>
      </div>

      <MenusFilter initialFilters={filters as Record<string, string>} statusEnums={BASIC_STATUS} parentMenus={parentMenus as any} onUpdateFilters={actions.updateFilters as any} />

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
              {items.map((menu: Menu, index) => {
                const badge = getStatusBadge(menu.status || "", BASIC_STATUS_BADGES);
                return (
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
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${badge.className}`}>
                          {badge.label}
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
                        onEdit={() => openEdit(menu, endpoints)}
                        additionalActions={[
                          {
                            label: menu.deleted_at ? "Khôi phục" : "Xóa",
                            action: () => (menu.deleted_at ? restoreMenu(menu) : openDelete(menu, endpoints)),
                            icon: menu.deleted_at ? "refresh" : "trash",
                          },
                        ]}
                      />
                    </td>
                  </tr>
                );
              })}
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
          statusEnums={BASIC_STATUS}
          parentMenus={parentMenus}
          permissions={permissions}
          onClose={createModal.close}
          onSuccess={() => {
            createModal.close();
            actions.refresh();
            fetchRelatedData();
          }}
        />
      )}

      {editModal.isOpen && editModal.data && (
        <EditMenu
          show={editModal.isOpen}
          target={editModal.data}
          statusEnums={BASIC_STATUS}
          parentMenus={parentMenus}
          permissions={permissions}
          onClose={editModal.close}
          onSuccess={() => {
            editModal.close();
            actions.refresh();
            fetchRelatedData();
          }}
        />
      )}

      {deleteModal.isOpen && deleteModal.data && (
        <ConfirmModal
          show={deleteModal.isOpen}
          title="Xác nhận xóa"
          message={`Bạn có chắc chắn muốn xóa menu "${deleteModal.data.displayName || ""}"?`}
          onClose={deleteModal.close}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
}

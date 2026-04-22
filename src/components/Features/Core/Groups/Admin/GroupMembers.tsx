"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api/client";
import { adminEndpoints } from "@/lib/api/endpoints";
import { useToastContext } from "@/contexts/ToastContext";
import SkeletonLoader from "@/components/UI/Feedback/SkeletonLoader";
import ConfirmModal from "@/components/UI/Feedback/ConfirmModal";
import Actions from "@/components/UI/DataDisplay/Actions";
import AddMemberModal from "./AddMemberModal";
import EditMemberRolesModal from "./EditMemberRolesModal";
import useModal from "@/hooks/ui-ux/useModal";
import { useCrudList } from "@/hooks";
import MemberFilter from "./MemberFilter";
import Pagination from "@/components/UI/DataDisplay/Pagination";

interface GroupMember {
  user_id: number;
  user?: {
    id: number;
    username: string;
    email: string;
  };
  role_id?: number;
  role?: {
    id: number;
    code: string;
    name: string;
  };
  roles?: Array<{
    id: number;
    code: string;
    name: string;
  }>;
}

interface Group {
  id: number;
  name?: string;
  code: string;
  owner_id?: number;
}

interface GroupMembersProps {
  groupId: number;
}

export default function GroupMembers({ groupId }: GroupMembersProps) {
  const router = useRouter();
  const [group, setGroup] = useState<Group | null>(null);
  const { showError } = useToastContext();

  const endpoint = useMemo(() => adminEndpoints.groups.members.list(groupId), [groupId]);
  
  const transformItem = useCallback((item: any) => ({
      ...item,
      id: item.user_id,
  }), []);

  const {
      data,
      actions,
      ui,
      deleteModal,
      handleDeleteConfirm,
      openDelete
  } = useCrudList({
      endpoint,
      deleteSuccessMessage: "Thành viên đã được xóa khỏi nhóm thành công",
      transformItem,
  });

  const { items, loading, pagination, filters, hasData } = data;
  const { getSerialNumber } = ui;

  const addMemberModal = useModal();
  const editRolesModal = useModal<GroupMember>();

  useEffect(() => {
    const loadGroup = async () => {
      try {
        const response = await api.get(adminEndpoints.groups.show(groupId));
        const groupData = response.data?.data || response.data;
        if (!groupData) {
          showError("Không tìm thấy group");
          router.push("/admin/groups");
        } else {
          setGroup(groupData);
        }
      } catch (error) {
        // Only push if we are still on this page
        if (window.location.pathname.includes(`/admin/groups/${groupId}/members`)) {
          showError("Không thể tải thông tin group");
          router.push("/admin/groups");
        }
      }
    };

    loadGroup();
  }, [groupId, router, showError]);

  const getMemberRoles = (member: GroupMember) => {
    if (member.roles && Array.isArray(member.roles)) {
      return member.roles;
    }
    if (member.role) {
      return [member.role];
    }
    return [];
  };

  const isOwner = (member: GroupMember): boolean => {
    return group ? member.user_id === group.owner_id : false;
  };

  const handleMemberAdded = () => {
    addMemberModal.close();
    actions.refresh();
  };

  const handleRolesUpdated = () => {
    editRolesModal.close();
    actions.refresh();
  };

  const handleDeleteMember = (member: GroupMember) => {
      // Mock CrudEndpoints as useCrudList expects the full object
      const mockEndpoints = {
          list: "",
          create: "",
          show: (id: string | number) => "",
          update: (id: string | number) => "",
          delete: (id: string | number) => adminEndpoints.groups.members.remove(groupId, id)
      };
      openDelete(member, mockEndpoints, "user.username");
  };

  return (
    <div className="admin-group-members">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-primary">Quản lý Thành viên</h1>
          {group && (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-gray-500">Nhóm:</span>
              <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-bold rounded uppercase border border-blue-100">
                {group.name}
              </span>
              <code className="text-xs text-gray-400 bg-gray-50 px-1 rounded">{group.code}</code>
            </div>
          )}
        </div>
        <button
          onClick={() => addMemberModal.open()}
          className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 shadow-sm"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Thêm thành viên
        </button>
      </div>

      <MemberFilter
          initialFilters={filters}
          onUpdateFilters={actions.updateFilters}
      />

      <div className="bg-white shadow-md rounded-lg overflow-hidden mt-6">
        {loading ? (
          <SkeletonLoader type="table" rows={10} columns={5} />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">STT</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tên người dùng</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Vai trò</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((member: any, index: number) => (
                  <tr key={member.user_id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getSerialNumber(index)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs mr-3">
                          {member.user?.username?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{member.user?.username || "N/A"}</span>
                        {isOwner(member) && (
                          <span className="ml-2 px-1.5 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-700 rounded uppercase">Chủ nhóm</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.user?.email || "N/A"}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {getMemberRoles(member).map((role: any) => (
                          <span key={role.id} className="px-2 py-0.5 text-[11px] font-bold rounded bg-blue-100 text-blue-800 uppercase">
                            {role.name || role.code}
                          </span>
                        ))}
                        {getMemberRoles(member).length === 0 && <span className="text-xs text-gray-400 italic">Chưa có vai trò</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <Actions
                        item={member}
                        showView={false}
                        showEdit={false}
                        showDelete={!isOwner(member)}
                        deleteTitle="Xóa thành viên"
                        onDelete={() => handleDeleteMember(member)}
                        additionalActions={[
                          {
                            label: "Sửa vai trò",
                            icon: "key",
                            action: () => editRolesModal.open(member),
                            className: "text-green-600 hover:text-green-700",
                          },
                        ]}
                      />
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 italic">
                      {loading ? "Đang tải dữ liệu..." : "Chưa có thành viên nào thỏa mãn bộ lọc"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {hasData && (
          <div className="mt-6">
              <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  totalItems={pagination.totalItems}
                  onPageChange={actions.changePage}
              />
          </div>
      )}

      {addMemberModal.isOpen && (
        <AddMemberModal
          show={addMemberModal.isOpen}
          groupId={groupId}
          onClose={addMemberModal.close}
          onMemberAdded={handleMemberAdded}
        />
      )}

      {editRolesModal.isOpen && editRolesModal.data && (
        <EditMemberRolesModal
          show={editRolesModal.isOpen}
          groupId={groupId}
          member={editRolesModal.data}
          onClose={editRolesModal.close}
          onRolesUpdated={handleRolesUpdated}
        />
      )}

      {deleteModal.isOpen && deleteModal.data && (
        <ConfirmModal
          show={deleteModal.isOpen}
          title="Xác nhận xóa"
          message={`Bạn có chắc chắn muốn xóa thành viên "${deleteModal.data.displayName || ""}" khỏi nhóm?`}
          onClose={deleteModal.close}
          onConfirm={handleDeleteConfirm}
          confirmText="Xác nhận xóa"
        />
      )}
    </div>
  );
}





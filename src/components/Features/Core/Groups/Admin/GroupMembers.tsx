"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api/client";
import { adminEndpoints } from "@/lib/api/endpoints";
import { useToastContext } from "@/contexts/ToastContext";
import SkeletonLoader from "@/components/UI/Feedback/SkeletonLoader";
import ConfirmModal from "@/components/UI/Feedback/ConfirmModal";
import AddMemberModal from "./AddMemberModal";
import EditMemberRolesModal from "./EditMemberRolesModal";

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
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [apiErrors, setApiErrors] = useState<Record<string, any> | null>(null);
  const [modals, setModals] = useState({ addMember: false, editRoles: false, delete: false });
  const [selectedMember, setSelectedMember] = useState<GroupMember | null>(null);
  const { showSuccess, showError } = useToastContext();

  const loadGroup = useCallback(async () => {
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
      showError("Không thể tải thông tin group");
      router.push("/admin/groups");
    }
  }, [groupId, router, showError]);

  const loadMembers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(adminEndpoints.groups.members.list(groupId));

      let membersData: GroupMember[] = [];
      if (response.data?.success && Array.isArray(response.data.data)) {
        membersData = response.data.data;
      } else if (Array.isArray(response.data)) {
        membersData = response.data;
      } else if (Array.isArray(response.data?.data)) {
        membersData = response.data.data;
      }

      setMembers(membersData);
    } catch (error: any) {
      showError("Không thể tải danh sách members");
      setMembers([]);
    } finally {
      setLoading(false);
    }
  }, [groupId, showError]);

  useEffect(() => {
    Promise.all([loadGroup(), loadMembers()]);
  }, [loadGroup, loadMembers]);

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

  const openAddMemberModal = () => {
    setModals((prev) => ({ ...prev, addMember: true }));
    setApiErrors(null);
  };

  const closeAddMemberModal = () => {
    setModals((prev) => ({ ...prev, addMember: false }));
    setApiErrors(null);
  };

  const openEditRolesModal = (member: GroupMember) => {
    setSelectedMember(member);
    setModals((prev) => ({ ...prev, editRoles: true }));
    setApiErrors(null);
  };

  const closeEditRolesModal = () => {
    setSelectedMember(null);
    setModals((prev) => ({ ...prev, editRoles: false }));
    setApiErrors(null);
  };

  const confirmRemoveMember = (member: GroupMember) => {
    setSelectedMember(member);
    setModals((prev) => ({ ...prev, delete: true }));
  };

  const closeDeleteModal = () => {
    setSelectedMember(null);
    setModals((prev) => ({ ...prev, delete: false }));
  };

  const handleMemberAdded = async () => {
    closeAddMemberModal();
    await loadMembers();
    showSuccess("Thêm member thành công");
  };

  const handleRolesUpdated = async () => {
    closeEditRolesModal();
    await loadMembers();
    showSuccess("Cập nhật roles thành công");
  };

  const removeMember = async () => {
    if (!selectedMember) return;
    setLoading(true);
    try {
      await api.delete(adminEndpoints.groups.members.remove(groupId, selectedMember.user_id));
      showSuccess("Xóa member thành công");
      closeDeleteModal();
      await loadMembers();
    } catch (error: any) {
      showError("Không thể xóa member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="group-members">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Quản lý Members</h1>
          {group && (
            <p className="text-sm text-gray-500 mt-1">
              Group: <span className="font-medium">{group.name}</span> ({group.code})
            </p>
          )}
        </div>
        <button onClick={openAddMemberModal} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none">
          Thêm member
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {loading ? (
          <SkeletonLoader type="table" rows={5} columns={5} />
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roles</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {members.map((member, index) => (
                <tr key={member.user_id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{member.user?.username || "N/A"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.user?.email || "N/A"}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {getMemberRoles(member).map((role) => (
                        <span key={role.id} className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {role.name || role.code}
                        </span>
                      ))}
                      {getMemberRoles(member).length === 0 && <span className="text-xs text-gray-400">Chưa có role</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditRolesModal(member)}
                        className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Sửa roles
                      </button>
                      <button
                        onClick={() => confirmRemoveMember(member)}
                        disabled={isOwner(member)}
                        className={`px-3 py-1 text-xs rounded ${isOwner(member)
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-red-600 text-white hover:bg-red-700"
                          }`}
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && members.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    Không có members
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {modals.addMember && (
        <AddMemberModal
          show={modals.addMember}
          groupId={groupId}
          apiErrors={apiErrors || undefined}
          onClose={closeAddMemberModal}
          onMemberAdded={handleMemberAdded}
        />
      )}

      {modals.editRoles && selectedMember && (
        <EditMemberRolesModal
          show={modals.editRoles}
          groupId={groupId}
          member={selectedMember}
          apiErrors={apiErrors || undefined}
          onClose={closeEditRolesModal}
          onRolesUpdated={handleRolesUpdated}
        />
      )}

      {modals.delete && selectedMember && (
        <ConfirmModal
          show={modals.delete}
          title="Xác nhận xóa"
          message={`Bạn có chắc chắn muốn xóa member ${selectedMember.user?.username || ""} khỏi group?`}
          onClose={closeDeleteModal}
          onConfirm={removeMember}
        />
      )}
    </div>
  );
}




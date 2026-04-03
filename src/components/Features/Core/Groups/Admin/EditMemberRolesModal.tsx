"use client";

import { useState, useEffect, useMemo } from "react";
import Modal from "@/components/UI/Feedback/Modal";
import FormWrapper from "@/components/UI/Forms/FormWrapper";
import MultipleSelect from "@/components/UI/Forms/MultipleSelect";
import api from "@/lib/api/client";
import { adminEndpoints } from "@/lib/api/endpoints";

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

interface EditMemberRolesModalProps {
  show: boolean;
  groupId: number;
  member?: GroupMember | null;
  apiErrors?: Record<string, any>;
  onRolesUpdated?: () => void;
  onClose?: () => void;
}

const DEFAULT_API_ERRORS = {};

export default function EditMemberRolesModal({
  show,
  groupId,
  member,
  apiErrors = DEFAULT_API_ERRORS,
  onRolesUpdated,
  onClose,
}: EditMemberRolesModalProps) {
  const [roles, setRoles] = useState<any[]>([]);
  const [localApiErrors, setLocalApiErrors] = useState<Record<string, any>>(apiErrors);

  useEffect(() => {
    if (JSON.stringify(apiErrors) !== JSON.stringify(localApiErrors)) {
      setLocalApiErrors(apiErrors);
    }
  }, [apiErrors, localApiErrors]);

  useEffect(() => {
    if (show) {
      loadRoles();
    }
  }, [show]);

  const loadRoles = async () => {
    try {
      const response = await api.get(adminEndpoints.roles.simple || `${adminEndpoints.roles.list}?limit=1000`);
      if (response.data?.success) {
        setRoles(response.data.data || []);
      } else {
        const fallbackResponse = await api.get(`${adminEndpoints.roles.list}?limit=1000`);
        if (fallbackResponse.data?.success) {
          setRoles(fallbackResponse.data.data || []);
        } else {
          const data = fallbackResponse.data?.data || fallbackResponse.data || [];
          setRoles(Array.isArray(data) ? data : data.items || data.data || []);
        }
      }
    } catch (error) {
      setRoles([]);
    }
  };

  const defaultValues = useMemo(() => {
    let roleIds: number[] = [];
    if (member?.roles && Array.isArray(member.roles)) {
      roleIds = member.roles.map((role) => role.id);
    } else if (member?.role_id) {
      roleIds = [member.role_id];
    } else if (member?.role?.id) {
      roleIds = [member.role.id];
    }

    return {
      role_ids: roleIds,
    };
  }, [member]);


  const roleOptions = useMemo(() => {
    return (roles || []).map((opt) => ({
      value: opt.id,
      label: opt.name || opt.code || String(opt.id),
    }));
  }, [roles]);

  const handleSubmit = async (formData: any) => {
    if (!groupId || !member?.user_id) return;

    setLocalApiErrors({});

    try {
      const dataToSubmit = {
        role_ids: Array.isArray(formData.role_ids) ? formData.role_ids : [formData.role_ids].filter(Boolean),
      };

      await api.put(adminEndpoints.groups.members.updateRoles(groupId, member.user_id), dataToSubmit);
      onRolesUpdated?.();
      onClose?.();
    } catch (err: any) {
      const payload = err?.response?.data;
      if (payload?.errors) {
        setLocalApiErrors(payload.errors);
      } else if (Array.isArray(payload?.message) && payload.message.length) {
        setLocalApiErrors({ general: payload.message.join(", ") });
      } else if (typeof payload?.message === "string") {
        setLocalApiErrors({ general: payload.message });
      }
    }
  };

  const handleClose = () => {
    onClose?.();
  };

  if (!show) return null;

  return (
    <Modal show={show} onClose={handleClose} title="Sửa roles của member" size="lg">
      <div className="space-y-6">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600 space-y-1">
            <div>
              <span className="font-medium">User:</span> {member?.user?.username || "N/A"}
            </div>
            <div>
              <span className="font-medium">Email:</span> {member?.user?.email || "N/A"}
            </div>
          </div>
        </div>

        <FormWrapper
          defaultValues={defaultValues}
          apiErrors={localApiErrors}
          submitText="Cập nhật roles"
          onSubmit={handleSubmit}
          onCancel={handleClose}
        >
          {({ form, errors, clearError }: any) => (
            <MultipleSelect
              value={form.role_ids || []}
              onChange={(value: Array<string | number>) => {
                form.role_ids = value;
                clearError("role_ids");
              }}
              label="Roles"
              options={roleOptions}
              error={errors.role_ids}
              placeholder="Chọn roles..."
            />
          )}
        </FormWrapper>
      </div>
    </Modal>
  );
}





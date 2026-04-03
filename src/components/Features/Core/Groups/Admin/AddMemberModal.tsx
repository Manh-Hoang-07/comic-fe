"use client";

import { useState, useEffect, useMemo } from "react";
import Modal from "@/components/UI/Feedback/Modal";
import FormWrapper from "@/components/UI/Forms/FormWrapper";
import SearchableSelect from "@/components/UI/Forms/SearchableSelect";
import MultipleSelect from "@/components/UI/Forms/MultipleSelect";
import api from "@/lib/api/client";
import { adminEndpoints } from "@/lib/api/endpoints";

interface AddMemberModalProps {
  show: boolean;
  groupId: number;
  apiErrors?: Record<string, any>;
  onMemberAdded?: () => void;
  onClose?: () => void;
}

const DEFAULT_API_ERRORS = {};

export default function AddMemberModal({
  show,
  groupId,
  apiErrors = DEFAULT_API_ERRORS,
  onMemberAdded,
  onClose,
}: AddMemberModalProps) {
  const [roles, setRoles] = useState<any[]>([]);
  const [localApiErrors, setLocalApiErrors] = useState<Record<string, any>>(apiErrors || DEFAULT_API_ERRORS);

  useEffect(() => {
    if (JSON.stringify(apiErrors) !== JSON.stringify(localApiErrors)) {
      setLocalApiErrors(apiErrors || DEFAULT_API_ERRORS);
    }
  }, [apiErrors, localApiErrors]);

  useEffect(() => {
    if (show) {
      loadRoles();
    }
  }, [show]);

  const loadRoles = async () => {
    try {
      const response = await api.get(`${adminEndpoints.roles.list}?limit=1000`);
      if (response.data?.success) {
        setRoles(response.data.data || []);
      } else {
        const data = response.data?.data || response.data || [];
        setRoles(Array.isArray(data) ? data : data.items || data.data || []);
      }
    } catch (error) {
      setRoles([]);
    }
  };

  const defaultValues = {
    user_id: null,
    role_ids: [],
  };


  const roleOptions = useMemo(() => {
    return (roles || []).map((opt) => ({
      value: opt.id,
      label: opt.name || opt.code || String(opt.id),
    }));
  }, [roles]);

  const handleSubmit = async (formData: any) => {
    if (!groupId) return;

    // Validate
    const errors: Record<string, string> = {};
    if (!formData.user_id) {
      errors.user_id = "User là bắt buộc";
    }
    if (!formData.role_ids || (Array.isArray(formData.role_ids) && formData.role_ids.length === 0)) {
      errors.role_ids = "Ít nhất một role là bắt buộc";
    }

    if (Object.keys(errors).length > 0) {
      setLocalApiErrors(errors);
      return;
    }

    setLocalApiErrors({});

    try {
      const dataToSubmit = {
        user_id: formData.user_id,
        role_ids: Array.isArray(formData.role_ids) ? formData.role_ids : [formData.role_ids].filter(Boolean),
      };

      await api.post(adminEndpoints.groups.members.add(groupId), dataToSubmit);
      onMemberAdded?.();
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
    <Modal show={show} onClose={handleClose} title="Thêm member vào group" size="lg">
      <div className="space-y-6">
        <FormWrapper
          defaultValues={defaultValues}
          apiErrors={localApiErrors}
          submitText="Thêm member"
          onSubmit={handleSubmit}
          onCancel={handleClose}
        >
          {({ form, errors, clearError }: any) => (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">User</label>
                <SearchableSelect
                  value={form.user_id}
                  onChange={(value: string | number | null) => {
                    form.user_id = value;
                    clearError("user_id");
                  }}
                  searchApi={adminEndpoints.users.list}
                  placeholder="Tìm kiếm user..."
                  labelField="username"
                  error={errors.user_id}
                />
              </div>

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
            </>
          )}
        </FormWrapper>
      </div>
    </Modal>
  );
}





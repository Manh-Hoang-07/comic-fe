"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Modal from "@/components/UI/Feedback/Modal";
import FormWrapper from "@/components/UI/Forms/FormWrapper";
import MultipleSelect from "@/components/UI/Forms/MultipleSelect";
import api from "@/lib/api/client";
import { adminEndpoints } from "@/lib/api/endpoints";

interface AssignPermissionsProps {
  show: boolean;
  role?: any;
  onPermissionsAssigned?: () => void;
  onClose?: () => void;
}

export default function AssignPermissions({
  show,
  role,
  onPermissionsAssigned,
  onClose,
}: AssignPermissionsProps) {
  const [roleDetail, setRoleDetail] = useState<any>(null);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [apiErrors, setApiErrors] = useState<Record<string, string | string[]>>({});
  const [formData, setFormData] = useState<{ permission_ids: number[] }>({ permission_ids: [] });

  const fetchRoleDetail = useCallback(async () => {
    if (!role?.id) return;

    try {
      const response = await api.get(adminEndpoints.roles.show(role.id));
      if (response.data?.success && response.data?.data) {
        const roleData = response.data.data;
        setRoleDetail(roleData);
        // Extract permission_ids from permissions array if exists
        let permissionIds: number[] = [];
        if (roleData.permissions && Array.isArray(roleData.permissions)) {
          permissionIds = roleData.permissions.map((p: any) => p.id);
        }
        setFormData({ permission_ids: permissionIds });
      } else {
        setRoleDetail(role || {});
      }
    } catch (error) {
      setRoleDetail(role || {});
    }
  }, [role]);

  const loadPermissions = useCallback(async () => {
    setLoading(true);
    try {
      // Try simple endpoint first
      try {
        const response = await api.get(adminEndpoints.permissions.simple);
        if (response.data?.success) {
          setPermissions(response.data.data || []);
          return;
        }
      } catch (e) {
        // Fallback to list endpoint
      }

      // Fallback to list endpoint
      const fallbackResponse = await api.get(`${adminEndpoints.permissions.list}?limit=1000`);
      if (fallbackResponse.data?.success) {
        setPermissions(fallbackResponse.data.data || []);
      }
    } catch (error) {
      setPermissions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (show && role?.id) {
      Promise.all([fetchRoleDetail(), loadPermissions()]);
    }
  }, [show, role?.id, fetchRoleDetail, loadPermissions]);

  const permissionOptions = useMemo(() => {
    return (permissions || []).map((opt) => ({
      value: opt.id,
      label: opt.name || opt.code,
    }));
  }, [permissions]);

  const formTitle = `Gán quyền cho ${roleDetail?.name || roleDetail?.code || "vai trò"}`;

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.permission_ids || formData.permission_ids.length === 0) {
      errors.permission_ids = "Vui lòng chọn ít nhất một quyền.";
    }
    setApiErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (data: Record<string, any>) => {
    if (!validateForm() || !role?.id) return;

    setLoading(true);
    try {
      const dataToSubmit = {
        permission_ids: Array.isArray(data.permission_ids)
          ? data.permission_ids
          : [data.permission_ids].filter(Boolean),
      };

      await api.post(adminEndpoints.roles.assignPermissions(role.id), dataToSubmit);
      onPermissionsAssigned?.();
      onClose?.();
    } catch (err: any) {
      if (err.response?.data?.errors) {
        setApiErrors(err.response.data.errors);
      } else {
        setApiErrors({ general: "Không thể gán quyền" });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose?.();
  };

  if (!show) return null;

  return (
    <Modal show={show} onClose={handleClose} title={formTitle} size="lg" loading={loading}>
      <FormWrapper
        defaultValues={formData}
        apiErrors={apiErrors}
        onSubmit={handleSubmit}
        onCancel={handleClose}
        submitText="Cập nhật quyền"
      >
        {({ form, errors, clearError, isSubmitting }) => {
          const permissionError: string | undefined = (errors.permission_ids ||
            (apiErrors.permission_ids
              ? (Array.isArray(apiErrors.permission_ids)
                ? apiErrors.permission_ids[0]
                : String(apiErrors.permission_ids))
              : undefined)) as string | undefined;

          return (
            <>
              {/* Thông tin role */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">
                  <div>
                    <strong>Mã code:</strong> {roleDetail?.code || "N/A"}
                  </div>
                  <div>
                    <strong>Tên:</strong> {roleDetail?.name || "N/A"}
                  </div>
                </div>
              </div>

              {/* Permissions */}
              <MultipleSelect
                value={formData.permission_ids}
                onChange={(value) => {
                  setFormData({ permission_ids: value as number[] });
                  clearError("permission_ids");
                }}
                options={permissionOptions}
                placeholder="Chọn quyền..."
                error={permissionError}
              />
            </>
          );
        }}
      </FormWrapper>
    </Modal>
  );
}




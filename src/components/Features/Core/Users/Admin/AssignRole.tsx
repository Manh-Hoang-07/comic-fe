"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Modal from "@/components/UI/Feedback/Modal";
import MultipleSelect from "@/components/UI/Forms/MultipleSelect";
import api from "@/lib/api/client";
import { adminEndpoints } from "@/lib/api/endpoints";
import { useToastContext } from "@/contexts/ToastContext";

const assignRoleSchema = z.object({
  role_ids: z.array(z.number()).min(1, "Vui lòng chọn ít nhất một vai trò"),
});

type AssignRoleValues = z.infer<typeof assignRoleSchema>;

interface AssignRoleProps {
  show: boolean;
  target: { assignApi: string; user: any } | null;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function AssignRole({
  show,
  target,
  onSuccess,
  onClose,
}: AssignRoleProps) {
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { showError, showSuccess } = useToastContext();

  const {
    handleSubmit,
    control,
    reset,
    setError,
    formState: { isSubmitting, errors },
  } = useForm<AssignRoleValues>({
    resolver: zodResolver(assignRoleSchema),
    defaultValues: {
      role_ids: [],
    },
  });

  const loadInitialData = useCallback(async () => {
    if (!target?.user?.id) return;
    setLoading(true);
    try {
      // 1. Load detail to get current roles
      const userResponse = await api.get(adminEndpoints.users.show(target.user.id));
      const userData = userResponse.data?.data || userResponse.data;
      
      let roleIds: number[] = [];
      if (Array.isArray(userData.role_ids)) {
        roleIds = userData.role_ids.map((id: any) => Number(id));
      } else if (Array.isArray(userData.user_role_assignments)) {
        roleIds = userData.user_role_assignments.map((a: any) => Number(a.role_id || a.role?.id)).filter(Boolean);
      } else if (Array.isArray(userData.roles)) {
        roleIds = userData.roles.map((r: any) => Number(r.id)).filter(Boolean);
      }
      reset({ role_ids: roleIds });

      // 2. Load all available roles
      const rolesResponse = await api.get(adminEndpoints.roles.simple || `${adminEndpoints.roles.list}?limit=1000`);
      setRoles(rolesResponse.data?.data || rolesResponse.data || []);
    } catch (error) {
      showError("Không thể tải thông tin quyền");
    } finally {
      setLoading(false);
    }
  }, [target?.user?.id, reset, showError]);

  useEffect(() => {
    if (show && target) {
      loadInitialData();
    } else {
      reset({ role_ids: [] });
    }
  }, [show, target, loadInitialData, reset]);

  const roleOptions = useMemo(() => {
    return (roles || [])
      .map((opt: any) => ({
        value: Number(opt.id),
        label: opt.name || opt.label || String(opt.id),
      }))
      .filter((opt: any) => !isNaN(opt.value));
  }, [roles]);

  const onFormSubmit = async (data: AssignRoleValues) => {
    if (!target?.assignApi) return;

    try {
      await api.put(target.assignApi, {
        role_ids: data.role_ids,
      });
      showSuccess("Vai trò đã được phân công thành công");
      onSuccess?.();
    } catch (error: any) {
      const payload = error?.response?.data;
      if (payload?.errors) {
        Object.keys(payload.errors).forEach((field) => {
          const value = payload.errors[field];
          setError(field as any, {
            message: Array.isArray(value) ? value[0] : String(value)
          });
        });
      } else {
        showError(payload?.message || "Có lỗi xảy ra khi phân quyền");
      }
    }
  };

  if (!show || !target) return null;

  return (
    <Modal
      show={show}
      onClose={onClose || (() => { })}
      title="Phân quyền người dùng"
      size="lg"
      loading={loading || isSubmitting}
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        <header className="border-b border-gray-200 pb-3 flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </span>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Phân quyền</h3>
            <p className="text-sm text-gray-500">Chọn vai trò áp dụng cho người dùng</p>
          </div>
        </header>

        <div className="mb-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
          <div className="text-sm text-gray-600 space-y-2">
            <div className="flex items-center">
              <span className="w-20 font-medium text-gray-500">Họ tên:</span>
              <span className="text-gray-900 font-semibold">{target.user?.name || target.user?.username || "..."}</span>
            </div>
            <div className="flex items-center">
              <span className="w-20 font-medium text-gray-500">Email:</span>
              <span className="text-gray-900">{target.user?.email || "..."}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Controller
            name="role_ids"
            control={control}
            render={({ field }) => (
              <MultipleSelect
                value={field.value}
                onChange={field.onChange}
                options={roleOptions}
                label="Danh sách vai trò"
                placeholder="Chọn vai trò..."
                error={errors.role_ids?.message}
              />
            )}
          />
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-50 transition-all active:scale-95"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            disabled={isSubmitting || loading}
            className="px-8 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isSubmitting ? "Đang cập nhật..." : "Cập nhật quyền"}
          </button>
        </div>
      </form>
    </Modal>
  );
}




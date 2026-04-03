"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Modal from "@/components/UI/Feedback/Modal";
import MultipleSelect from "@/components/UI/Forms/MultipleSelect";
import api from "@/lib/api/client";
import { adminEndpoints } from "@/lib/api/endpoints";

const assignRoleSchema = z.object({
  role_ids: z.array(z.number()).min(1, "Vui lòng chọn ít nhất một vai trò"),
});

type AssignRoleValues = z.infer<typeof assignRoleSchema>;

interface AssignRoleProps {
  show: boolean;
  user?: any;
  onRoleAssigned?: () => void;
  onClose?: () => void;
}

export default function AssignRole({
  show,
  user,
  onRoleAssigned,
  onClose,
}: AssignRoleProps) {
  const [userDetail, setUserDetail] = useState<any>(null);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

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

  const fetchUserDetail = useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const response = await api.get(adminEndpoints.users.show(user.id));
      if (response.data?.success && response.data?.data) {
        const data = response.data.data;
        setUserDetail(data);

        // Extract role IDs
        let roleIds: number[] = [];

        // 1. Prioritize flat role_ids from API
        if (Array.isArray(data.role_ids)) {
          roleIds = data.role_ids.map((id: number | string) => Number(id));
        }
        // 2. Fallback to user_role_assignments
        else if (Array.isArray(data.user_role_assignments)) {
          roleIds = data.user_role_assignments
            .map((a: any) => Number(a.role_id || a.role?.id))
            .filter((id: number) => !isNaN(id));
        }
        // 3. Fallback to roles array
        else if (Array.isArray(data.roles)) {
          roleIds = data.roles.map((r: any) => Number(r.id)).filter((id: number) => !isNaN(id));
        }

        reset({ role_ids: roleIds });
      }
    } catch (error) {
      console.error("Failed to fetch user detail:", error);
    } finally {
      setLoading(false);
    }
  }, [user, reset]);

  const loadRoles = useCallback(async () => {
    try {
      const response = await api.get(adminEndpoints.roles.simple || `${adminEndpoints.roles.list}?limit=1000`);
      if (response.data?.success) {
        setRoles(response.data.data || []);
      }
    } catch (error) {
      console.error("Failed to load roles:", error);
    }
  }, []);

  useEffect(() => {
    if (show && user?.id) {
      fetchUserDetail();
      loadRoles();
    } else if (!show) {
      setUserDetail(null);
      reset({ role_ids: [] });
    }
  }, [show, user?.id, fetchUserDetail, loadRoles, reset]);

  const roleOptions = useMemo(() => {
    return (roles || [])
      .map((opt: any) => ({
        value: Number(opt.id),
        label: opt.name || opt.label || String(opt.id),
      }))
      .filter((opt: any) => !isNaN(opt.value));
  }, [roles]);

  const onFormSubmit = async (data: AssignRoleValues) => {
    if (!user?.id) return;

    try {
      await api.put(adminEndpoints.users.assignRoles(user.id), {
        role_ids: data.role_ids,
      });
      onRoleAssigned?.();
      onClose?.();
    } catch (error: any) {
      const payload = error?.response?.data;
      if (payload?.errors) {
        Object.keys(payload.errors).forEach((field) => {
          const value = payload.errors[field];
          setError(field as any, {
            message: Array.isArray(value) ? value[0] : String(value)
          });
        });
      }
    }
  };

  if (!show) return null;

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
              <span className="text-gray-900 font-semibold">{userDetail?.name || userDetail?.username || "..."}</span>
            </div>
            <div className="flex items-center">
              <span className="w-20 font-medium text-gray-500">Email:</span>
              <span className="text-gray-900">{userDetail?.email || "..."}</span>
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



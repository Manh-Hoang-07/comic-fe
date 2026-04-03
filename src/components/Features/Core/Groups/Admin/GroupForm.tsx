"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Modal from "@/components/UI/Feedback/Modal";
import FormField from "@/components/UI/Forms/FormField";
import SingleSelectEnhanced from "@/components/UI/Forms/SingleSelectEnhanced";
import api from "@/lib/api/client";
import { adminEndpoints } from "@/lib/api/endpoints";

// 1. Define Group Schema
const groupSchema = z.object({
  type: z.string().min(1, "Loại group là bắt buộc").max(100, "Loại tối đa 100 ký tự"),
  context_id: z.coerce.number().optional().nullable(),
  code: z.string().min(1, "Mã code là bắt buộc").max(100, "Mã code không được vượt quá 100 ký tự"),
  name: z.string().min(1, "Tên group là bắt buộc").max(255, "Tên group không được vượt quá 255 ký tự"),
  description: z.string().max(500, "Mô tả không được vượt quá 500 ký tự").optional().nullable(),
  metadata: z.record(z.any()).default({}),
  metadata_json: z.string().optional().nullable(),
});

type GroupFormValues = z.infer<typeof groupSchema>;

interface Group {
  id?: number;
  type?: string;
  context_id?: number | null;
  code?: string;
  name?: string;
  description?: string;
  metadata?: Record<string, any>;
}

interface GroupFormProps {
  show: boolean;
  group?: Group | null;
  apiErrors?: Record<string, string | string[]>;
  loading?: boolean;
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
}

const getTypeLabel = (type?: string): string => {
  if (!type) return "";
  return type.charAt(0).toUpperCase() + type.slice(1);
};

export default function GroupForm({
  show,
  group,
  apiErrors = {},
  loading = false,
  onSubmit,
  onCancel,
}: GroupFormProps) {
  const [contexts, setContexts] = useState<Array<{ id: number; name: string; type: string }>>([]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<GroupFormValues>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      type: "",
      context_id: null,
      code: "",
      name: "",
      description: "",
      metadata: {},
      metadata_json: "",
    },
  });

  const selectedType = useWatch({ control, name: "type" });

  const contextOptions = useMemo(() =>
    contexts.map((ctx) => ({ value: ctx.id, label: `${ctx.name} (${ctx.type})` })),
    [contexts]);

  // Load Contexts
  useEffect(() => {
    if (show) {
      const loadContexts = async () => {
        try {
          const response = await api.get(`${adminEndpoints.contexts.list}?limit=1000`);
          const data = response.data?.data || response.data || [];
          setContexts(Array.isArray(data) ? data : []);
        } catch (err) {
          console.error("Failed to load contexts", err);
        }
      };
      loadContexts();
    }
  }, [show]);

  // Reset/Initialize
  useEffect(() => {
    if (show) {
      if (group) {
        reset({
          type: group.type || "",
          context_id: group.context_id || null,
          code: group.code || "",
          name: group.name || "",
          description: group.description || "",
          metadata: group.metadata || {},
          metadata_json: group.metadata ? JSON.stringify(group.metadata, null, 2) : "",
        });
      } else {
        reset({
          type: "",
          context_id: null,
          code: "",
          name: "",
          description: "",
          metadata: {},
          metadata_json: "",
        });
      }
    }
  }, [group, show, reset]);

  // Map API Errors
  useEffect(() => {
    if (apiErrors) {
      Object.keys(apiErrors).forEach((key) => {
        const message = Array.isArray(apiErrors[key]) ? apiErrors[key][0] : String(apiErrors[key]);
        setError(key as any, { message });
      });
    }
  }, [apiErrors, setError]);

  const handleFormSubmit = (data: GroupFormValues) => {
    // Basic validation for context_id on creation
    if (!group && !data.context_id) {
      setError("context_id", { message: "Context là bắt buộc khi tạo mới" });
      return;
    }

    let finalMetadata = data.metadata;

    // Handle JSON metadata if visible
    if (selectedType !== "shop" && selectedType !== "team" && data.metadata_json) {
      try {
        finalMetadata = JSON.parse(data.metadata_json);
      } catch (e) {
        setError("metadata_json", { message: "JSON không hợp lệ" });
        return;
      }
    }

    const submitData = {
      ...data,
      metadata: finalMetadata,
    };

    // Cleanup metadata_json from submit
    delete (submitData as any).metadata_json;

    onSubmit?.(submitData);
  };

  const formTitle = group ? "Chỉnh sửa group" : "Thêm group mới";

  if (!show) return null;

  return (
    <Modal show={show} onClose={onCancel || (() => { })} title={formTitle} size="xl" loading={loading || isSubmitting}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8 p-1">

        {/* SECTION: THÔNG TIN CHÍNH */}
        <section className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6">
          <header className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Thông tin Group</h3>
              <p className="text-xs text-gray-500">Phân loại và định danh cho group</p>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Loại group"
              {...register("type")}
              error={errors.type?.message}
              disabled={!!group}
              placeholder="shop, team, project, department..."
              required
              helpText={group ? "Không thể thay đổi loại group" : ""}
            />

            {!group && (
              <Controller
                name="context_id"
                control={control}
                render={({ field }) => (
                  <SingleSelectEnhanced
                    {...field}
                    label="Context"
                    options={contextOptions}
                    placeholder="-- Chọn context --"
                    error={errors.context_id?.message}
                    required
                  />
                )}
              />
            )}

            <FormField
              label="Mã code"
              {...register("code")}
              error={errors.code?.message}
              disabled={!!group}
              placeholder="shop-001, team-dev..."
              required
            />

            <FormField
              label="Tên group"
              {...register("name")}
              error={errors.name?.message}
              placeholder="Ví dụ: Development Team, Shop A..."
              required
            />
          </div>

          <FormField
            label="Mô tả"
            type="textarea"
            rows={3}
            {...register("description")}
            error={errors.description?.message}
            placeholder="Nhập mô tả chi tiết về group..."
          />
        </section>

        {/* SECTION: THÔNG TIN BỔ SUNG (METADATA) */}
        {selectedType && (
          <section className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6">
            <header className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Thông tin bổ sung</h3>
                <p className="text-xs text-gray-500">Dữ liệu đặc thù cho loại {getTypeLabel(selectedType)}</p>
              </div>
            </header>

            {selectedType === "shop" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Địa chỉ"
                  {...register("metadata.address")}
                  placeholder="Nhập địa chỉ shop..."
                />
                <FormField
                  label="Số điện thoại"
                  {...register("metadata.phone")}
                  placeholder="Nhập SĐT liên hệ..."
                />
                <FormField
                  label="Email"
                  type="email"
                  {...register("metadata.email")}
                  placeholder="shop@example.com"
                />
              </div>
            )}

            {selectedType === "team" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Leader"
                  {...register("metadata.leader")}
                  placeholder="Tên trưởng nhóm..."
                />
                <FormField
                  label="Số lượng members"
                  type="number"
                  {...register("metadata.members_count", { valueAsNumber: true })}
                  placeholder="0"
                />
              </div>
            )}

            {selectedType !== "shop" && selectedType !== "team" && (
              <FormField
                label="Cấu hình (JSON)"
                type="textarea"
                rows={5}
                {...register("metadata_json")}
                error={errors.metadata_json?.message}
                placeholder='{ "key": "value" }'
                className="font-mono text-sm"
              />
            )}
          </section>
        )}

        {/* FOOTER ACTIONS */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-8 py-3 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all active:scale-95"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            disabled={isSubmitting || loading}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isSubmitting ? "Đang xử lý..." : group ? "Cập nhật group" : "Thêm group mới"}
          </button>
        </div>
      </form>
    </Modal>
  );
}




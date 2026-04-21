"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Modal from "@/components/UI/Feedback/Modal";
import FormField from "@/components/UI/Forms/FormField";
import SingleSelectEnhanced from "@/components/UI/Forms/SingleSelectEnhanced";
import { adminEndpoints } from "@/lib/api/endpoints";
import { wardSchema, type WardFormValues } from "./wardSchema";

export interface AdminWardFormEntity {
  id?: number;
  code?: string;
  name?: string;
  type?: string | null;
  province_id?: number;
  status?: string | null;
}

interface WardFormProps {
  show: boolean;
  ward?: AdminWardFormEntity | null;
  apiErrors?: Record<string, string | string[]> | null;
  loading?: boolean;
  onSubmit?: (data: WardFormValues) => void;
  onCancel?: () => void;
}

const WARD_TYPES = [
  { value: "Ward", label: "Phường" },
  { value: "Commune", label: "Xã" },
  { value: "Township", label: "Thị trấn" },
];

export default function WardForm({
  show,
  ward,
  apiErrors = {},
  loading = false,
  onSubmit,
  onCancel,
}: WardFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm<WardFormValues>({
    resolver: zodResolver(wardSchema),
    defaultValues: {
      code: "",
      name: "",
      type: "Ward",
      province_id: 1,
      status: "active",
    },
  });

  useEffect(() => {
    if (show) {
      if (ward) {
        reset({
          code: ward.code || "",
          name: ward.name || "",
          type: ward.type || "Ward",
          province_id: ward.province_id || 1,
          status: (ward.status === "active" || ward.status === "inactive" ? ward.status : "active"),
        });
      } else {
        reset({
          code: "",
          name: "",
          type: "Phường",
          province_id: 1,
          status: "active",
        });
      }
    }
  }, [ward, show, reset]);

  useEffect(() => {
    if (apiErrors) {
      Object.keys(apiErrors).forEach((key) => {
        const message = Array.isArray(apiErrors[key])
          ? apiErrors[key][0]
          : String(apiErrors[key]);
        setError(key as any, { message });
      });
    }
  }, [apiErrors, setError]);

  const formTitle = ward ? "Chỉnh sửa Phường/Xã" : "Thêm Phường/Xã";

  if (!show) return null;

  const handleInternalSubmit = (data: WardFormValues) => {
    onSubmit?.(data);
  };

  return (
    <Modal
      show={show}
      onClose={onCancel || (() => { })}
      title={formTitle}
      size="lg"
      loading={loading || isSubmitting}
    >
      <form
        onSubmit={handleSubmit(handleInternalSubmit)}
        className="space-y-6 p-1"
      >
        <section className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Mã phường/xã"
              {...register("code")}
              placeholder="VD: 26734"
              error={errors.code?.message}
              required
              disabled={!!ward?.id}
            />
            <FormField
              label="Tên phường/xã"
              {...register("name")}
              placeholder="Phường Bến Nghé"
              error={errors.name?.message}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <SingleSelectEnhanced
                  {...field}
                  label="Loại"
                  options={WARD_TYPES}
                  error={errors.type?.message}
                />
              )}
            />
            <Controller
              name="province_id"
              control={control}
              render={({ field }) => (
                <SingleSelectEnhanced
                  {...field}
                  label="Tỉnh/Thành"
                  searchApi={adminEndpoints.location.provinces.simple}
                  labelField="name"
                  valueField="id"
                  error={errors.province_id?.message}
                  required
                />
              )}
            />
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <SingleSelectEnhanced
                  {...field}
                  label="Trạng thái"
                  options={[
                    { value: "active", label: "Hoạt động" },
                    { value: "inactive", label: "Ngừng hoạt động" },
                  ]}
                  error={errors.status?.message}
                  required
                />
              )}
            />
          </div>
        </section>

        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-all active:scale-95"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isSubmitting
              ? "Đang xử lý..."
              : ward
                ? "Cập nhật Phường/Xã"
                : "Thêm Phường/Xã"}
          </button>
        </div>
      </form>
    </Modal>
  );
}



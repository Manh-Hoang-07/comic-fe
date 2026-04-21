"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Modal from "@/components/UI/Feedback/Modal";
import FormField from "@/components/UI/Forms/FormField";
import SingleSelectEnhanced from "@/components/UI/Forms/SingleSelectEnhanced";
import { adminEndpoints } from "@/lib/api/endpoints";
import { provinceSchema, type ProvinceFormValues } from "./provinceSchema";

export interface AdminProvinceFormEntity {
  id?: number;
  code?: string;
  name?: string;
  type?: string | null;
  phone_code?: string | null;
  country_id?: number;
  status?: string | null;
}

interface ProvinceFormProps {
  show: boolean;
  province?: AdminProvinceFormEntity | null;
  apiErrors?: Record<string, string | string[]> | null;
  loading?: boolean;
  onSubmit?: (data: ProvinceFormValues) => void;
  onCancel?: () => void;
}

const PROVINCE_TYPES = [
  { value: "Province", label: "Tỉnh" },
  { value: "Municipality", label: "Thành phố Trung ương" },
];

export default function ProvinceForm({
  show,
  province,
  apiErrors = {},
  loading = false,
  onSubmit,
  onCancel,
}: ProvinceFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ProvinceFormValues>({
    resolver: zodResolver(provinceSchema),
    defaultValues: {
      code: "",
      name: "",
      type: "Province",
      phone_code: "",
      country_id: 1,
      status: "active",
    },
  });

  useEffect(() => {
    if (show) {
      if (province) {
        reset({
          code: province.code || "",
          name: province.name || "",
          type: province.type || "Province",
          phone_code: province.phone_code || "",
          country_id: province.country_id || 1,
          status: (province.status === "active" || province.status === "inactive" ? province.status : "active"),
        });
      } else {
        reset({
          code: "",
          name: "",
          type: "Tỉnh",
          phone_code: "",
          country_id: 1,
          status: "active",
        });
      }
    }
  }, [province, show, reset]);

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

  const formTitle = province ? "Chỉnh sửa Tỉnh/Thành phố" : "Thêm Tỉnh/Thành phố";

  if (!show) return null;

  const handleInternalSubmit = (data: ProvinceFormValues) => {
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
              label="Mã tỉnh/thành"
              {...register("code")}
              placeholder="VD: 79"
              error={errors.code?.message}
              required
              disabled={!!province?.id}
            />
            <FormField
              label="Tên tỉnh/thành"
              {...register("name")}
              placeholder="Hồ Chí Minh"
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
                  options={PROVINCE_TYPES}
                  error={errors.type?.message}
                />
              )}
            />
            <FormField
              label="Mã điện thoại"
              {...register("phone_code")}
              placeholder="28"
              error={errors.phone_code?.message}
            />
            <Controller
              name="country_id"
              control={control}
              render={({ field }) => (
                <SingleSelectEnhanced
                  {...field}
                  label="Quốc gia"
                  searchApi={adminEndpoints.location.countries.simple}
                  labelField="name"
                  valueField="id"
                  error={errors.country_id?.message}
                  required
                />
              )}
            />
          </div>

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
              : province
                ? "Cập nhật Tỉnh/Thành phố"
                : "Thêm Tỉnh/Thành phố"}
          </button>
        </div>
      </form>
    </Modal>
  );
}



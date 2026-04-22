"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Modal from "@/components/UI/Feedback/Modal";
import FormField from "@/components/UI/Forms/FormField";
import SingleSelectEnhanced from "@/components/UI/Forms/SingleSelectEnhanced";
import { countrySchema, type CountryFormValues } from "./Constants/schemas";
import { type Country, type CountryFormProps } from "./Constants/types";


export default function CountryForm({
  show,
  country,
  apiErrors = {},
  loading = false,
  onSubmit,
  onCancel,
}: CountryFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CountryFormValues>({
    resolver: zodResolver(countrySchema),
    defaultValues: {
      code: "",
      name: "",
      official_name: "",
      phone_code: "",
      currency_code: "",
      status: "active",
    },
  });

  useEffect(() => {
    if (show) {
      if (country) {
        reset({
          code: country.code || "",
          name: country.name || "",
          official_name: country.official_name || "",
          phone_code: country.phone_code || "",
          currency_code: country.currency_code || "",
          status: (country.status === "active" || country.status === "inactive" ? country.status : "active"),
        });
      } else {
        reset({
          code: "",
          name: "",
          official_name: "",
          phone_code: "",
          currency_code: "",
          status: "active",
        });
      }
    }
  }, [country, show, reset]);

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

  const formTitle = country ? "Chỉnh sửa quốc gia" : "Thêm quốc gia mới";

  if (!show) return null;

  const handleInternalSubmit = (data: CountryFormValues) => {
    onSubmit?.({
      ...data,
      code: data.code.toUpperCase(),
      currency_code: data.currency_code?.toUpperCase() || undefined,
    });
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
              label="Mã quốc gia"
              {...register("code")}
              placeholder="VD: VN, US"
              error={errors.code?.message}
              required
              disabled={!!country?.id}
            />
            <FormField
              label="Tên quốc gia"
              {...register("name")}
              placeholder="Việt Nam"
              error={errors.name?.message}
              required
            />
          </div>

          <FormField
            label="Tên đầy đủ (official_name)"
            {...register("official_name")}
            placeholder="Cộng hòa Xã hội chủ nghĩa Việt Nam"
            error={errors.official_name?.message}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              label="Mã điện thoại"
              {...register("phone_code")}
              placeholder="+84"
              error={errors.phone_code?.message}
            />
            <FormField
              label="Mã tiền tệ"
              {...register("currency_code")}
              placeholder="VND"
              error={errors.currency_code?.message}
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
            disabled={loading || isSubmitting}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading || isSubmitting
              ? "Đang xử lý..."
              : country
                ? "Cập nhật quốc gia"
                : "Thêm quốc gia"}
          </button>
        </div>
      </form>
    </Modal>
  );
}



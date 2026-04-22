"use client";

import { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Modal from "@/components/UI/Feedback/Modal";
import FormField from "@/components/UI/Forms/FormField";
import ImageUploader from "@/components/UI/Forms/ImageUploader";
import SingleSelectEnhanced from "@/components/UI/Forms/SingleSelectEnhanced";
import LocationSelector from "@/components/Features/Core/Locations/Shared/LocationSelector";
import { userSchema, type UserFormValues } from "./Constants/schemas";
import { type User, type UserFormProps } from "./Constants/types";


export default function UserForm({
  show,
  user,
  statusEnums = [],
  genderEnums = [],
  apiErrors = {},
  loading = false,
  onSubmit,
  onCancel,
}: UserFormProps) {
  const formTitle = user ? "Chỉnh sửa người dùng" : "Thêm người dùng mới";

  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: "",
      email: "",
      phone: "",
      password: "",
      name: "",
      gender: "",
      birthday: "",
      country_id: null,
      province_id: null,
      ward_id: null,
      address: "",
      image: "",
      about: "",
      status: "active",
      remove_image: false,
    },
  });

  // Reset form when user or show state changes
  useEffect(() => {
    if (show) {
      if (user) {
        reset({
          username: user.username || "",
          email: user.email || "",
          phone: user.phone || "",
          password: "", // Don't fill password on edit
          name: user.name || "",
          gender: user.gender || "",
          birthday: user.birthday || "",
          country_id: user.country_id || null,
          province_id: user.province_id || null,
          ward_id: user.ward_id || null,
          address: user.address || "",
          image: user.image || "",
          about: user.about || "",
          status: user.status || "active",
          remove_image: false,
        });
      } else {
        reset({
          username: "",
          email: "",
          phone: "",
          password: "",
          name: "",
          gender: "",
          birthday: "",
          address: "",
          image: "",
          about: "",
          status: "active",
          remove_image: false,
        });
      }
    }
  }, [user, show, reset]);

  // Handle API errors
  useEffect(() => {
    if (apiErrors) {
      Object.keys(apiErrors).forEach((key) => {
        const message = Array.isArray(apiErrors[key]) ? apiErrors[key][0] : String(apiErrors[key]);
        setError(key as any, { message });
      });
    }
  }, [apiErrors, setError]);

  const statusOptions = useMemo(() =>
    statusEnums.map(opt => ({ value: opt.value, label: opt.label || opt.name || opt.value })),
    [statusEnums]);

  const genderOptions = useMemo(() =>
    genderEnums.map(opt => ({ value: opt.value, label: opt.label || opt.name || opt.value })),
    [genderEnums]);

  if (!show) return null;

  return (
    <Modal show={show} onClose={onCancel || (() => { })} title={formTitle} size="xl" loading={loading || isSubmitting}>
      <form onSubmit={handleSubmit((data) => onSubmit?.(data))} className="space-y-8 p-1">

        {/* SECTION: THÔNG TIN CƠ BẢN */}
        <section className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6">
          <header className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Thông tin cơ bản</h3>
              <p className="text-xs text-gray-500">Thông tin định danh và tài khoản</p>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Tên đăng nhập"
              {...register("username")}
              error={errors.username?.message}
              placeholder="Nhập tên đăng nhập"
              required
            />
            <FormField
              label="Email"
              type="email"
              {...register("email")}
              error={errors.email?.message}
              placeholder="example@domain.com"
              required
            />
            <FormField
              label="Số điện thoại"
              type="tel"
              {...register("phone")}
              error={errors.phone?.message}
              placeholder="09xxx..."
            />
            {!user && (
              <FormField
                label="Mật khẩu"
                type="password"
                {...register("password")}
                error={errors.password?.message}
                required
                placeholder="Ít nhất 6 ký tự"
              />
            )}
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <SingleSelectEnhanced
                  {...field}
                  label="Trạng thái"
                  options={statusOptions}
                  placeholder="-- Chọn trạng thái --"
                  error={errors.status?.message}
                  required
                />
              )}
            />
          </div>
        </section>

        {/* SECTION: THÔNG TIN CHI TIẾT */}
        <section className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6">
          <header className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm5 3h.01" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Hồ sơ người dùng</h3>
              <p className="text-xs text-gray-500">Thông tin hiển thị cá nhân</p>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Họ tên"
              {...register("name")}
              error={errors.name?.message}
              placeholder="Nguyễn Văn A"
              required
            />
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <SingleSelectEnhanced
                  {...field}
                  label="Giới tính"
                  options={genderOptions}
                  placeholder="-- Chọn giới tính --"
                  error={errors.gender?.message}
                />
              )}
            />
            <FormField
              label="Ngày sinh"
              type="date"
              {...register("birthday")}
              error={errors.birthday?.message}
            />
            <div className="md:col-span-2">
              <LocationSelector
                control={control}
                errors={errors}
                watch={watch}
                setValue={setValue}
                isAdmin={false}
                required={false}
              />
            </div>
            <div className="md:col-span-2">
              <FormField
                label="Địa chỉ cụ thể"
                {...register("address")}
                error={errors.address?.message}
                placeholder="Số nhà, tên đường..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-2">
              <label className="text-sm font-semibold text-gray-700">Ảnh đại diện</label>
              <Controller
                name="image"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <ImageUploader
                    value={value}
                    onChange={onChange}
                    onRemove={() => setValue("remove_image", true)}
                  />
                )}
              />
            </div>
            <div className="md:col-span-2">
              <FormField
                label="Giới thiệu"
                type="textarea"
                rows={4}
                {...register("about")}
                error={errors.about?.message}
                placeholder="Một vài dòng giới thiệu về bản thân..."
              />
            </div>
          </div>
        </section>

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
            {isSubmitting ? "Đang xử lý..." : user ? "Cập nhật người dùng" : "Thêm người dùng"}
          </button>
        </div>
      </form>
    </Modal>
  );
}





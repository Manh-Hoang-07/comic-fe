"use client";

import { useForm, Controller } from "react-hook-form";
import { useEffect, useMemo } from "react";
import { ContentTemplate } from "@/types/api";
import FormField from "@/components/UI/Forms/FormField";
import SingleSelectEnhanced from "@/components/UI/Forms/SingleSelectEnhanced";

interface FormProps {
    initialData?: Partial<ContentTemplate>;
    onSubmit: (data: any) => void;
    apiErrors?: any;
    loading?: boolean;
    onCancel?: () => void;
}

export default function ContentTemplateForm({
    initialData,
    onSubmit,
    apiErrors,
    loading = false,
    onCancel,
}: FormProps) {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        control,
        setError,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: initialData || {
            status: "active",
            category: "render",
            type: "email",
        },
    });

    const category = watch("category");

    useEffect(() => {
        if (initialData) {
            Object.entries(initialData).forEach(([key, value]) => {
                let val = value;
                if (key === 'metadata' && value && typeof value === 'object') {
                    val = JSON.stringify(value, null, 2);
                }
                if (key === 'variables' && Array.isArray(value)) {
                    val = value.join(', ');
                }
                setValue(key as any, val);
            });
        }
    }, [initialData, setValue]);

    // Handle API errors
    useEffect(() => {
        if (apiErrors && typeof apiErrors === 'object') {
            Object.keys(apiErrors).forEach((key) => {
                const message = Array.isArray(apiErrors[key]) ? apiErrors[key][0] : String(apiErrors[key]);
                if (key !== 'message' && key !== 'error' && key !== 'success') {
                    setError(key as any, { message });
                }
            });
        }
    }, [apiErrors, setError]);

    const onFormSubmit = (data: any) => {
        const formattedData = { ...data };

        // Parse variables if they are a string
        if (typeof formattedData.variables === "string") {
            try {
                formattedData.variables = formattedData.variables
                    .split(',')
                    .map((v: string) => v.trim())
                    .filter(Boolean);
            } catch (e) {
                console.error("Failed to parse variables", e);
            }
        }

        // Parse metadata if it's a string
        if (typeof formattedData.metadata === 'string' && formattedData.metadata.trim()) {
            try {
                formattedData.metadata = JSON.parse(formattedData.metadata);
            } catch (e) {
                console.error("Failed to parse metadata", e);
            }
        }

        onSubmit(formattedData);
    };

    const categoryOptions = [
        { value: "render", label: "Render (HTML/Text)" },
        { value: "file", label: "File (Word/Excel/PDF)" },
    ];

    const typeOptions = [
        { value: "email", label: "Email" },
        { value: "telegram", label: "Telegram" },
        { value: "zalo", label: "Zalo" },
        { value: "sms", label: "SMS" },
        { value: "pdf_generated", label: "PDF Generated" },
        { value: "file_word", label: "File Word" },
        { value: "file_excel", label: "File Excel" },
    ];

    const statusOptions = [
        { value: "active", label: "Hoạt động" },
        { value: "inactive", label: "Tạm ngưng" },
    ];

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
            {/* SECTION 1: THÔNG TIN CƠ BẢN */}
            <section className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6">
                <header className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Thông tin cơ bản</h3>
                        <p className="text-xs text-gray-500">Mã định danh và phân loại mẫu</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        label="Mã (Code)"
                        {...register("code", { required: "Vui lòng nhập mã" })}
                        error={errors.code?.message?.toString()}
                        placeholder="Ví dụ: registration_succes"
                        required
                    />

                    <FormField
                        label="Tên mẫu"
                        {...register("name", { required: "Vui lòng nhập tên" })}
                        error={errors.name?.message?.toString()}
                        placeholder="Ví dụ: Xác nhận đăng ký"
                        required
                    />

                    <Controller
                        name="category"
                        control={control}
                        rules={{ required: "Vui lòng chọn phân loại" }}
                        render={({ field }) => (
                            <SingleSelectEnhanced
                                {...field}
                                label="Phân loại"
                                options={categoryOptions}
                                placeholder="-- Chọn phân loại --"
                                error={errors.category?.message?.toString()}
                                required
                            />
                        )}
                    />

                    <Controller
                        name="type"
                        control={control}
                        rules={{ required: "Vui lòng chọn loại" }}
                        render={({ field }) => (
                            <SingleSelectEnhanced
                                {...field}
                                label="Kênh/Loại"
                                options={typeOptions}
                                placeholder="-- Chọn loại --"
                                error={errors.type?.message?.toString()}
                                required
                            />
                        )}
                    />

                    <div className="md:col-span-2">
                        <Controller
                            name="status"
                            control={control}
                            render={({ field }) => (
                                <SingleSelectEnhanced
                                    {...field}
                                    label="Trạng thái"
                                    options={statusOptions}
                                    placeholder="-- Chọn trạng thái --"
                                    error={errors.status?.message?.toString()}
                                />
                            )}
                        />
                    </div>
                </div>
            </section>

            {/* SECTION 2: NỘI DUNG */}
            <section className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6">
                <header className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Nội dung Template</h3>
                        <p className="text-xs text-gray-500">Nội dung chi tiết của mẫu {category === 'render' ? 'nội dung' : 'đường dẫn file'}</p>
                    </div>
                </header>

                {category === 'render' ? (
                    <FormField
                        label="Nội dung"
                        type="textarea"
                        rows={8}
                        {...register("content")}
                        error={errors.content?.message?.toString()}
                        placeholder="Nhập nội dung template, hỗ trợ biến dạng {{variable_name}}"
                        helpText="Sử dụng cú pháp {{variable}} để chèn biến động."
                    />
                ) : (
                    <FormField
                        label="Đường dẫn File (Path)"
                        {...register("file_path")}
                        error={errors.file_path?.message?.toString()}
                        placeholder="Ví dụ: templates/contract_v1.docx"
                    />
                )}
            </section>

            {/* SECTION 3: METADATA & BIẾN */}
            <section className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6">
                <header className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Metadata & Biến</h3>
                        <p className="text-xs text-gray-500">Cấu hình nâng cao và khai báo tham số</p>
                    </div>
                </header>

                <div className="space-y-4">
                    <FormField
                        label="Biến khả dụng (Variables)"
                        {...register("variables")}
                        error={errors.variables?.message?.toString()}
                        placeholder="Ví dụ: name, email, otp (cách nhau bởi dấu phẩy)"
                    />

                    <FormField
                        label="Metadata (JSON format)"
                        type="textarea"
                        rows={4}
                        {...register("metadata")}
                        error={errors.metadata?.message?.toString()}
                        placeholder='{"subject": "Chào mừng thành viên mới"}'
                        helpText="Cấu hình JSON bổ sung (Ví dụ Email cần subject, Telegram cần chatId,...)"
                    />
                </div>
            </section>

            {/* ERROR DISPLAY */}
            {apiErrors && (typeof apiErrors === 'string' || apiErrors.message || apiErrors.error) && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 font-medium animate-in fade-in slide-in-from-top-1">
                    {typeof apiErrors === 'string'
                        ? apiErrors
                        : (apiErrors.message || apiErrors.error || 'Đã xảy ra lỗi, vui lòng kiểm tra lại.')}
                </div>
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
                    {isSubmitting || loading ? (
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Đang xử lý...
                        </div>
                    ) : (
                        initialData?.id ? "Cập nhật mẫu" : "Tạo mẫu mới"
                    )}
                </button>
            </div>
        </form>
    );
}



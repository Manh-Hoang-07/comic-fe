"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AdminComicCategory } from "@/types/comic";
import FormField from "@/components/UI/Forms/FormField";
import CKEditor from "@/components/UI/Forms/CKEditor";
import { userEndpoints } from "@/lib/api/endpoints";

const categorySchema = z.object({
    name: z.string().min(1, "Tên danh mục không được để trống").max(255, "Tên tối đa 255 ký tự"),
    description: z.string().max(10000, "Mô tả tối đa 10000 ký tự").optional().nullable().or(z.literal("")),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface ComicCategoryFormProps {
    category?: AdminComicCategory | null;
    onSuccess: (data: any) => Promise<any>;
    onCancel: () => void;
    apiErrors?: any;
}

export default function ComicCategoryForm({
    category,
    onSuccess,
    onCancel,
    apiErrors: externalErrors,
}: ComicCategoryFormProps) {
    const {
        register,
        handleSubmit,
        control,
        reset,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<CategoryFormValues>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: "",
            description: "",
        },
    });

    useEffect(() => {
        if (category) {
            reset({
                name: category.name || "",
                description: category.description || "",
            });
        } else {
            reset({
                name: "",
                description: "",
            });
        }
    }, [category, reset]);

    // Handle external API errors
    useEffect(() => {
        if (externalErrors) {
            Object.keys(externalErrors).forEach((key) => {
                const message = Array.isArray(externalErrors[key])
                    ? externalErrors[key][0]
                    : String(externalErrors[key]);
                setError(key as any, { message });
            });
        }
    }, [externalErrors, setError]);

    const handleFormSubmit = async (values: CategoryFormValues) => {
        try {
            await onSuccess(values);
        } catch (error) {
            // Error handled by hook
        }
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8 p-1">
            <div className="space-y-6">
                <FormField
                    label="Tên danh mục"
                    {...register("name")}
                    required
                    placeholder="Ví dụ: Hài hước, Kinh dị, Hành động..."
                    error={errors.name?.message}
                />

                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Mô tả danh mục</label>
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                        <Controller
                            name="description"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                                <CKEditor
                                    value={value || ""}
                                    onChange={onChange}
                                    placeholder="Nhập mô tả chi tiết về thể loại này..."
                                    uploadUrl={userEndpoints.uploads.image}
                                />
                            )}
                        />
                    </div>
                    {errors.description && (
                        <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>
                    )}
                </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-100 pt-8">
                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-xl border border-gray-300 bg-white px-8 py-3 font-bold text-gray-700 transition-all hover:bg-gray-50 active:scale-95"
                >
                    Hủy bỏ
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-xl bg-blue-600 px-10 py-3 font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50"
                >
                    {isSubmitting ? "Đang xử lý..." : category ? "Cập nhật danh mục" : "Tạo danh mục mới"}
                </button>
            </div>
        </form>
    );
}



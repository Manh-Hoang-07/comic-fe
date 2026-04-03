"use client";

import { useEffect, useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { adminComicService } from "@/lib/api/admin/comic";
import { AdminComic, AdminComicCategory } from "@/types/comic";
import FormField from "@/components/UI/Forms/FormField";
import ImageUploader from "@/components/UI/Forms/ImageUploader";
import MultipleSelect from "@/components/UI/Forms/MultipleSelect";
import CKEditor from "@/components/UI/Forms/CKEditor";
import SingleSelectEnhanced from "@/components/UI/Forms/SingleSelectEnhanced";
import { useToastContext } from "@/contexts/ToastContext";
import Modal from "@/components/UI/Feedback/Modal";
import { userEndpoints } from "@/lib/api/endpoints";

const comicSchema = z.object({
    title: z.string().min(1, "Tiêu đề không được để trống").max(255, "Tiêu đề tối đa 255 ký tự"),
    author: z.string().min(1, "Tác giả không được để trống").max(255, "Tác giả tối đa 255 ký tự"),
    description: z.string().max(10000, "Mô tả tối đa 10000 ký tự").optional().nullable().or(z.literal("")),
    status: z.enum(["draft", "published", "completed", "hidden"]).default("draft"),
    is_featured: z.boolean().default(false),
    category_ids: z.array(z.string()).min(1, "Vui lòng chọn ít nhất một danh mục"),
    cover_image: z.string().optional().nullable().or(z.literal("")),
});

type ComicFormValues = z.infer<typeof comicSchema>;

interface ComicFormProps {
    show: boolean;
    comic?: AdminComic | null;
    apiErrors?: any;
    onSuccess: (data: any) => Promise<any>;
    onCancel: () => void;
}

export default function ComicForm({
    show,
    comic,
    apiErrors: externalErrors,
    onSuccess,
    onCancel,
}: ComicFormProps) {
    const [categories, setCategories] = useState<AdminComicCategory[]>([]);
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [coverUrl, setCoverUrl] = useState<string>("");
    const { showSuccess } = useToastContext();

    const {
        register,
        handleSubmit,
        control,
        reset,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<ComicFormValues>({
        resolver: zodResolver(comicSchema),
        defaultValues: {
            title: "",
            author: "",
            description: "",
            status: "draft",
            is_featured: false,
            category_ids: [],
            cover_image: "",
        },
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (show) {
            if (comic) {
                reset({
                    title: comic.title || "",
                    author: comic.author || "",
                    description: comic.description || "",
                    status: comic.status || "draft",
                    is_featured: comic.is_featured || false,
                    category_ids: comic.categories?.map((c) => String(c.id)) || [],
                    cover_image: comic.cover_image || "",
                });
                setCoverUrl(comic.cover_image || "");
            } else {
                reset({
                    title: "",
                    author: "",
                    description: "",
                    status: "draft",
                    is_featured: false,
                    category_ids: [],
                    cover_image: "",
                });
                setCoverUrl("");
                setCoverFile(null);
            }
        }
    }, [comic, show, reset]);

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

    const fetchCategories = async () => {
        try {
            const response = await adminComicService.getCategories({ limit: 100 });
            setCategories(response.data as any);
        } catch (error) {
            console.error("Failed to fetch categories:", error);
        }
    };

    const handleFormSubmit = async (values: ComicFormValues) => {
        try {
            const dataToSubmit = {
                ...values,
                category_ids: values.category_ids.map(Number),
            };

            const savedItem = await onSuccess(dataToSubmit);

            if (coverFile && savedItem?.id) {
                await adminComicService.uploadCover(savedItem.id, coverFile);
                showSuccess("Đã cập nhật ảnh bìa");
            }
        } catch (error) {
            // Error handled by useAdminListPage/ToastContext
        }
    };

    const categoryOptions = useMemo(
        () =>
            categories.map((cat) => ({
                value: String(cat.id),
                label: cat.name,
            })),
        [categories]
    );

    const statusOptions = [
        { value: "draft", label: "Bản nháp" },
        { value: "published", label: "Công khai" },
        { value: "completed", label: "Hoàn tất" },
        { value: "hidden", label: "Ẩn danh" },
    ];

    const formTitle = comic ? "Chỉnh sửa truyện" : "Thêm truyện mới";

    return (
        <Modal
            show={show}
            onClose={onCancel}
            title={formTitle}
            size="xl"
            loading={isSubmitting}
        >
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8 p-1">
                {/* SECTION: THÔNG TIN CHÍNH */}
                <section className="space-y-6 rounded-2xl border border-gray-100 bg-gray-50/50 p-6">
                    <header className="mb-2 flex items-center space-x-3">
                        <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Thông tin chính</h3>
                            <p className="text-xs text-gray-500">Tên truyện, tác giả và các thiết lập cơ bản</p>
                        </div>
                    </header>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="md:col-span-2">
                            <FormField
                                label="Tiêu đề truyện"
                                {...register("title")}
                                required
                                placeholder="Ví dụ: Đấu Phá Thương Khung, Solo Leveling..."
                                error={errors.title?.message}
                            />
                        </div>

                        <FormField
                            label="Tác giả / Nhóm dịch"
                            {...register("author")}
                            required
                            placeholder="Tên tác giả hoặc studio..."
                            error={errors.author?.message}
                        />

                        <Controller
                            name="status"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                                <div className="space-y-1">
                                    <label className="mb-1 block text-sm font-semibold text-gray-700">
                                        Trạng thái <span className="text-red-500">*</span>
                                    </label>
                                    <SingleSelectEnhanced
                                        value={value}
                                        options={statusOptions}
                                        onChange={onChange}
                                        placeholder="Chọn trạng thái..."
                                        error={errors.status?.message}
                                    />
                                </div>
                            )}
                        />

                        <div className="pt-2 md:col-span-2">
                            <Controller
                                name="is_featured"
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                    <FormField
                                        type="checkbox"
                                        checkboxLabel={
                                            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
                                                Đánh dấu là truyện nổi bật (Featured)
                                            </span>
                                        }
                                        value={value}
                                        onChange={(e) => onChange(e.target.checked)}
                                    />
                                )}
                            />
                        </div>
                    </div>
                </section>

                {/* SECTION: HÌNH ẢNH & PHÂN LOẠI */}
                <section className="space-y-6 rounded-2xl border border-gray-100 bg-gray-50/50 p-6">
                    <header className="mb-2 flex items-center space-x-3">
                        <div className="rounded-lg bg-purple-100 p-2 text-purple-600">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2-2v12a2 2 0 002 2z"
                                />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Hình ảnh & Danh mục</h3>
                            <p className="text-xs text-gray-500">Ảnh bìa và phân loại theo thể loại</p>
                        </div>
                    </header>

                    <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-2">
                        <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-6">
                            <label className="mb-4 self-start text-sm font-semibold text-gray-700">
                                Ảnh bìa truyện
                            </label>
                            <ImageUploader
                                value={coverUrl}
                                autoUpload={false}
                                onChange={(val) => {
                                    if (val instanceof File) {
                                        setCoverFile(val);
                                        setCoverUrl(URL.createObjectURL(val));
                                    } else if (typeof val === "string") {
                                        setCoverUrl(val);
                                    } else {
                                        setCoverUrl("");
                                        setCoverFile(null);
                                    }
                                }}
                            />
                            <p className="mt-4 text-center text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                Tỷ lệ khuyên dùng 3:4
                            </p>
                        </div>

                        <div className="flex h-full flex-col justify-center space-y-4">
                            <label className="block text-sm font-semibold text-gray-700">Danh mục truyện *</label>
                            <Controller
                                name="category_ids"
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                    <MultipleSelect
                                        value={value}
                                        options={categoryOptions}
                                        onChange={onChange}
                                        placeholder="Chọn một hoặc nhiều danh mục..."
                                    />
                                )}
                            />
                            {errors.category_ids && (
                                <p className="mt-1 text-xs font-bold text-red-500">{errors.category_ids.message}</p>
                            )}
                            <p className="mt-2 text-xs text-gray-400">
                                Chọn ít nhất một thể loại để người đọc dễ dàng tìm kiếm.
                            </p>
                        </div>
                    </div>
                </section>

                {/* SECTION: MÔ TẢ CHI TIẾT */}
                <section className="space-y-6 rounded-2xl border border-gray-100 bg-gray-50/50 p-6">
                    <header className="mb-2 flex items-center space-x-3">
                        <div className="rounded-lg bg-green-100 p-2 text-green-600">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                                />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Mô tả nội dung</h3>
                            <p className="text-xs text-gray-500">Giới thiệu tóm tắt hoặc nội dung chi tiết của truyện</p>
                        </div>
                    </header>

                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                        <Controller
                            name="description"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                                <CKEditor
                                    value={value || ""}
                                    onChange={onChange}
                                    placeholder="Viết giới thiệu nội dung truyện tại đây..."
                                    uploadUrl={userEndpoints.uploads.image}
                                />
                            )}
                        />
                    </div>
                    {errors.description && (
                        <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>
                    )}
                </section>

                {/* Actions */}
                <div className="flex justify-end gap-3 border-t border-gray-100 px-1 pt-8">
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
                        className="rounded-xl bg-blue-600 px-12 py-3 font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50"
                    >
                        {isSubmitting ? "Đang xử lý..." : comic ? "Cập nhật truyện" : "Tạo truyện mới"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}



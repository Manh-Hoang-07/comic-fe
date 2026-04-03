"use client";

import { useEffect, useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AdminChapter, AdminComic } from "@/types/comic";
import FormField from "@/components/UI/Forms/FormField";
import SingleSelectEnhanced from "@/components/UI/Forms/SingleSelectEnhanced";
import { useToastContext } from "@/contexts/ToastContext";
import { adminComicService } from "@/lib/api/admin/comic";

const chapterSchema = z.object({
    chapter_index: z.coerce.number().int().min(1, "Số thứ tự phải lớn hơn 0"),
    title: z.string().min(1, "Tiêu đề không được để trống").max(255, "Tiêu đề tối đa 255 ký tự"),
    chapter_label: z.string().max(100, "Nhãn tối đa 100 ký tự").optional().nullable().or(z.literal("")),
    status: z.enum(["published", "draft"]).default("published"),
    comic_id: z.coerce.number({ required_error: "Vui lòng chọn bộ truyện" }).min(1, "Vui lòng chọn bộ truyện"),
    team_id: z.coerce.number().optional().nullable(),
});

type ChapterFormValues = z.infer<typeof chapterSchema>;

interface ChapterFormProps {
    chapter?: AdminChapter | null;
    comicId?: number | string | null;
    onSuccess: (data: any) => Promise<any>;
    onCancel: () => void;
    apiErrors?: any;
}

export default function ChapterForm({
    chapter,
    comicId,
    onSuccess,
    onCancel,
    apiErrors: externalErrors,
}: ChapterFormProps) {
    const [comics, setComics] = useState<AdminComic[]>([]);
    const [loadingComics, setLoadingComics] = useState(false);

    const {
        register,
        handleSubmit,
        control,
        reset,
        setError,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<ChapterFormValues>({
        resolver: zodResolver(chapterSchema),
        defaultValues: {
            chapter_index: 1,
            title: "",
            chapter_label: "",
            status: "published",
            comic_id: comicId ? Number(comicId) : undefined,
            team_id: null,
        },
    });

    useEffect(() => {
        fetchComics();
    }, []);

    const fetchComics = async () => {
        try {
            setLoadingComics(true);
            const response = await adminComicService.getComics({ limit: 1000 });
            setComics(response.data as any);
        } catch (error) {
            console.error("Failed to fetch comics:", error);
        } finally {
            setLoadingComics(false);
        }
    };

    const comicOptions = useMemo(
        () => comics.map((c) => ({ value: String(c.id), label: c.title })),
        [comics]
    );

    useEffect(() => {
        if (chapter) {
            reset({
                chapter_index: chapter.chapter_index,
                title: chapter.title,
                chapter_label: chapter.chapter_label || "",
                status: chapter.status as "published" | "draft",
                comic_id: chapter.comic_id,
                team_id: chapter.team_id || null,
            });
        }
    }, [chapter, reset]);

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

    const handleFormSubmit = async (values: ChapterFormValues) => {
        try {
            await onSuccess(values);
        } catch (error) {
            // Error handled by hook
        }
    };

    const statusOptions = [
        { value: "published", label: "Công khai (Published)" },
        { value: "draft", label: "Bản nháp (Draft)" },
    ];

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8 p-1">
            {/* SECTION: BỘ TRUYỆN */}
            <section className="space-y-6 rounded-2xl border border-gray-100 bg-gray-50/50 p-6">
                <header className="mb-2 flex items-center space-x-3">
                    <div className="rounded-lg bg-purple-100 p-2 text-purple-600">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Bộ truyện</h3>
                        <p className="text-xs text-gray-500">Chọn bộ truyện mà chương này thuộc về</p>
                    </div>
                </header>

                <Controller
                    name="comic_id"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                        <div className="space-y-1">
                            <label className="mb-1 block text-sm font-semibold text-gray-700">
                                Chọn bộ truyện <span className="text-red-500">*</span>
                            </label>
                            <SingleSelectEnhanced
                                value={value ? String(value) : ""}
                                options={comicOptions}
                                onChange={(val) => onChange(Number(val))}
                                placeholder={loadingComics ? "Đang tải danh sách..." : "Tìm kiếm bộ truyện..."}
                                error={errors.comic_id?.message}
                                disabled={!!comicId || !!chapter}
                            />
                            {(!!comicId || !!chapter) && (
                                <p className="text-[10px] text-gray-400 font-medium italic mt-1">
                                    * Không thể thay đổi bộ truyện sau khi đã xác định ngữ cảnh
                                </p>
                            )}
                        </div>
                    )}
                />
            </section>

            {/* SECTION: THÔNG TIN CHƯƠNG */}
            <section className="space-y-6 rounded-2xl border border-gray-100 bg-gray-50/50 p-6">
                <header className="mb-2 flex items-center space-x-3">
                    <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Nội dung chương</h3>
                        <p className="text-xs text-gray-500">Tiêu đề, nhãn và thứ tự hiển thị của chương</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="md:col-span-2">
                        <FormField
                            label="Tiêu đề chính thức"
                            {...register("title")}
                            required
                            placeholder="Nhập tiêu đề chương (ví dụ: Khởi đầu mới)..."
                            error={errors.title?.message}
                        />
                    </div>

                    <FormField
                        label="Số thứ tự chương"
                        {...register("chapter_index")}
                        type="number"
                        required
                        min="1"
                        placeholder="Ví dụ: 1"
                        helpText="Dùng để sắp xếp danh sách"
                        error={errors.chapter_index?.message}
                    />

                    <FormField
                        label="Nhãn hiển thị (Label)"
                        {...register("chapter_label")}
                        placeholder="Chương 1, Chapter 1..."
                        helpText="Tên ngắn gọn hiện ngoài danh sách"
                        error={errors.chapter_label?.message}
                    />
                </div>
            </section>

            {/* SECTION: THIẾT LẬP & PHÂN QUYỀN */}
            <section className="space-y-6 rounded-2xl border border-gray-100 bg-gray-50/50 p-6">
                <header className="mb-2 flex items-center space-x-3">
                    <div className="rounded-lg bg-orange-100 p-2 text-orange-600">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Thiết lập & Phân quyền</h3>
                        <p className="text-xs text-gray-500">Quản lý trạng thái và nhóm dịch phụ trách</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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

                    <FormField
                        label="ID Nhóm dịch (Team ID)"
                        {...register("team_id")}
                        type="number"
                        placeholder="Nhập ID nhóm dịch (nếu có)..."
                        helpText="Để trống nếu không thuộc nhóm nào"
                        error={errors.team_id?.message}
                    />
                </div>
            </section>

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
                    className="rounded-xl bg-blue-600 px-12 py-3 font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50"
                >
                    {isSubmitting ? "Đang xử lý..." : chapter ? "Cập nhật chương" : "Tạo chương mới"}
                </button>
            </div>
        </form>
    );
}



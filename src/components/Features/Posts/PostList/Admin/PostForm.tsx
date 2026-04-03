"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Modal from "@/components/UI/Feedback/Modal";
import FormField from "@/components/UI/Forms/FormField";
import ImageUploader from "@/components/UI/Forms/ImageUploader";
import CKEditor from "@/components/UI/Forms/CKEditor";
import SingleSelectEnhanced from "@/components/UI/Forms/SingleSelectEnhanced";
import SearchableSelect from "@/components/UI/Forms/SearchableSelect";
import MultipleSelect from "@/components/UI/Forms/MultipleSelect";
import { adminEndpoints } from "@/lib/api/endpoints";
import api from "@/lib/api/client";

// 1. Định nghĩa Post Schema (Declarative)
const postSchema = z.object({
  name: z.string().min(1, "Tiêu đề là bắt buộc").max(255, "Tiêu đề không được vượt quá 255 ký tự"),
  excerpt: z.string().max(500, "Tóm tắt tối đa 500 ký tự").optional().nullable().or(z.literal("")),
  content: z.string().min(1, "Nội dung là bắt buộc"),
  cover_image: z.string().min(1, "Ảnh bìa là bắt buộc"),
  image: z.string().optional().nullable().or(z.literal("")),
  post_type: z.string().default("text"),
  video_url: z.string().url("Video URL không hợp lệ").or(z.literal("")).optional().nullable(),
  audio_url: z.string().url("Audio URL không hợp lệ").or(z.literal("")).optional().nullable(),
  status: z.string().min(1, "Trạng thái là bắt buộc").default("draft"),
  published_at: z.string().optional().nullable().or(z.literal("")),
  primary_postcategory_id: z.coerce.number({ invalid_type_error: "Vui lòng chọn danh mục chính" }).positive("Vui lòng chọn danh mục chính"),
  category_ids: z.array(z.number()).default([]),
  tag_ids: z.array(z.number()).default([]),
  is_featured: z.boolean().default(false),
  is_pinned: z.boolean().default(false),
  meta_title: z.string().max(255, "Meta Title quá dài").optional().nullable().or(z.literal("")),
  meta_description: z.string().max(500, "Meta Description quá dài").optional().nullable().or(z.literal("")),
  canonical_url: z.string().url("URL không hợp lệ").or(z.literal("")).optional().nullable(),
  og_title: z.string().max(255, "OG Title quá dài").optional().nullable().or(z.literal("")),
  og_description: z.string().max(500, "OG Description quá dài").optional().nullable().or(z.literal("")),
  og_image: z.string().optional().nullable().or(z.literal("")),
});

type PostFormValues = z.infer<typeof postSchema>;

interface PostFormProps {
  show: boolean;
  post?: any;
  statusEnums?: Array<{ value: string; label?: string; name?: string }>;
  postTypeEnums?: Array<{ value: string; label?: string; name?: string }>;
  categoryEnums?: Array<{ value: number; label?: string; name?: string }>;
  tagEnums?: Array<{ value: number; label?: string; name?: string }>;
  apiErrors?: Record<string, string | string[]>;
  onSubmit?: (data: PostFormValues) => void;
  onCancel?: () => void;
}

const formatDateTimeForInput = (dateString?: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 16);
};

export default function PostForm({
  show,
  post,
  statusEnums = [],
  postTypeEnums = [],
  categoryEnums,
  tagEnums,
  apiErrors = {},
  onSubmit,
  onCancel,
}: PostFormProps) {
  const [categoryOptions, setCategoryOptions] = useState<Array<{ value: number; label: string }>>([]);
  const [tagOptions, setTagOptions] = useState<Array<{ value: number; label: string }>>([]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      name: "",
      excerpt: "",
      content: "",
      cover_image: "",
      image: "",
      post_type: "text",
      video_url: "",
      audio_url: "",
      status: "draft",
      published_at: "",
      primary_postcategory_id: undefined,
      category_ids: [],
      tag_ids: [],
      is_featured: false,
      is_pinned: false,
      meta_title: "",
      meta_description: "",
      canonical_url: "",
      og_title: "",
      og_description: "",
      og_image: "",
    },
  });

  const postType = watch("post_type");

  // Load Categories & Tags
  useEffect(() => {
    if (show) {
      if (categoryEnums || tagEnums) {
        if (categoryEnums) {
          setCategoryOptions(categoryEnums.map(c => ({ value: c.value, label: c.label || c.name || String(c.value) })));
        }
        if (tagEnums) {
          setTagOptions(tagEnums.map(t => ({ value: t.value, label: t.label || t.name || String(t.value) })));
        }
      }

      if (!categoryEnums || !tagEnums) {
        const fetchData = async () => {
          try {
            const [catRes, tagRes] = await Promise.all([
              !categoryEnums ? api.get(adminEndpoints.postCategories.list) : Promise.resolve({ data: { data: [] } }),
              !tagEnums ? api.get(adminEndpoints.postTags.list) : Promise.resolve({ data: { data: [] } })
            ]);

            if (!categoryEnums) {
              const catData = catRes.data?.data || [];
              setCategoryOptions(catData.map((c: any) => ({ value: c.id, label: c.name })));
            }
            if (!tagEnums) {
              const tagData = tagRes.data?.data || [];
              setTagOptions(tagData.map((t: any) => ({ value: t.id, label: t.name })));
            }
          } catch (err) {
            console.error("Failed to load options", err);
          }
        };
        fetchData();
      }
    }
  }, [show, categoryEnums, tagEnums]);

  // Reset/Initialize form
  useEffect(() => {
    if (show) {
      if (post) {
        reset({
          name: post.name || "",
          excerpt: post.excerpt || "",
          content: post.content || "",
          cover_image: post.cover_image || "",
          image: post.image || "",
          post_type: post.post_type || "text",
          video_url: post.video_url || "",
          audio_url: post.audio_url || "",
          status: post.status || "draft",
          published_at: post.published_at ? formatDateTimeForInput(post.published_at) : "",
          primary_postcategory_id: post.primary_postcategory_id,
          category_ids: post.categories?.map((c: any) => c.id) || [],
          tag_ids: post.tags?.map((t: any) => t.id) || [],
          is_featured: !!post.is_featured,
          is_pinned: !!post.is_pinned,
          meta_title: post.meta_title || "",
          meta_description: post.meta_description || "",
          canonical_url: post.canonical_url || "",
          og_title: post.og_title || "",
          og_description: post.og_description || "",
          og_image: post.og_image || "",
        });
      } else {
        reset({
          name: "",
          excerpt: "",
          content: "",
          cover_image: "",
          image: "",
          post_type: "text",
          video_url: "",
          audio_url: "",
          status: "draft",
          published_at: "",
          primary_postcategory_id: undefined,
          category_ids: [],
          tag_ids: [],
          is_featured: false,
          is_pinned: false,
          meta_title: "",
          meta_description: "",
          canonical_url: "",
          og_title: "",
          og_description: "",
          og_image: "",
        });
      }
    }
  }, [post, reset, show]);

  // Handle API Errors
  useEffect(() => {
    if (apiErrors) {
      Object.keys(apiErrors).forEach((key) => {
        const message = Array.isArray(apiErrors[key]) ? apiErrors[key][0] : String(apiErrors[key]);
        setError(key as any, { message });
      });
    }
  }, [apiErrors, setError]);

  const statusOptions = useMemo(() =>
    statusEnums.map(opt => ({ value: opt.value, label: opt.label || (opt as any).name || opt.value })),
    [statusEnums]
  );

  const postTypeOptions = useMemo(() =>
    postTypeEnums.map(opt => ({ value: opt.value, label: opt.label || (opt as any).name || opt.value })),
    [postTypeEnums]
  );

  const formTitle = post ? "Chỉnh sửa bài viết" : "Thêm bài viết mới";

  if (!show) return null;

  return (
    <Modal show={show} onClose={onCancel || (() => { })} title={formTitle} size="xl" loading={isSubmitting}>
      <form onSubmit={handleSubmit((data) => onSubmit?.(data as PostFormValues))} className="space-y-8 p-1">

        {/* SECTION: THÔNG TIN BÀI VIẾT */}
        <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Thông tin bài viết</h3>
              <p className="text-xs text-gray-500">Tiêu đề, trạng thái và tóm tắt nội dung</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <FormField
                label="Tiêu đề"
                placeholder="Nhập tiêu đề bài viết"
                {...register("name")}
                error={errors.name?.message}
                required
              />
            </div>

            <FormField
              label="Ngày xuất bản"
              type="datetime-local"
              {...register("published_at")}
              error={errors.published_at?.message}
            />

            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <SingleSelectEnhanced
                  {...field}
                  options={statusOptions}
                  label="Trạng thái"
                  placeholder="-- Chọn trạng thái --"
                  error={errors.status?.message}
                  required
                />
              )}
            />

            <Controller
              name="post_type"
              control={control}
              render={({ field }) => (
                <SingleSelectEnhanced
                  {...field}
                  options={postTypeOptions}
                  label="Loại bài viết"
                  placeholder="-- Chọn loại --"
                  error={errors.post_type?.message}
                />
              )}
            />

            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-semibold text-gray-700">Tóm tắt</label>
              <Controller
                name="excerpt"
                control={control}
                render={({ field }) => (
                  <CKEditor
                    {...field}
                    value={field.value || ""}
                    height="180px"
                    placeholder="Nhập tóm tắt bài viết..."
                  />
                )}
              />
              {errors.excerpt && <p className="text-xs text-red-500 mt-1">{errors.excerpt.message}</p>}
            </div>
          </div>
        </div>

        {/* SECTION: HÌNH ẢNH */}
        <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Hình ảnh</h3>
              <p className="text-xs text-gray-500">Ảnh bìa và ảnh đại diện bài viết</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700">Ảnh bìa (Cover)</label>
              <Controller
                name="cover_image"
                control={control}
                render={({ field }) => (
                  <ImageUploader {...field} />
                )}
              />
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700">Ảnh đại diện</label>
              <Controller
                name="image"
                control={control}
                render={({ field }) => (
                  <ImageUploader {...field} />
                )}
              />
            </div>
          </div>
        </div>

        {/* SECTION: NỘI DUNG CHI TIẾT */}
        <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Nội dung chi tiết <span className="text-red-500">*</span></h3>
          </div>
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <CKEditor
                {...field}
                height="450px"
              />
            )}
          />
          {errors.content && <p className="text-sm text-red-500 font-medium">{errors.content.message}</p>}

          {postType === "video" && (
            <FormField
              label="Video URL"
              placeholder="https://youtube.com/..."
              {...register("video_url")}
              error={errors.video_url?.message}
            />
          )}

          {postType === "audio" && (
            <FormField
              label="Audio URL"
              placeholder="https://..."
              {...register("audio_url")}
              error={errors.audio_url?.message}
            />
          )}
        </div>

        {/* SECTION: PHÂN LOẠI */}
        <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg text-green-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Phân loại & Hiển thị</h3>
              <p className="text-xs text-gray-500">Giúp người dùng dễ dàng tìm thấy bài viết</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Controller
              name="primary_postcategory_id"
              control={control}
              render={({ field }) => (
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Danh mục chính <span className="text-red-500">*</span></label>
                  <SearchableSelect
                    {...field}
                    searchApi={adminEndpoints.postCategories.list}
                    labelField="name"
                    placeholder="Chọn danh mục chính"
                    error={errors.primary_postcategory_id?.message}
                  />
                </div>
              )}
            />

            <Controller
              name="category_ids"
              control={control}
              render={({ field }) => (
                <MultipleSelect
                  {...field}
                  options={categoryOptions}
                  label="Danh mục bổ sung"
                  placeholder="Chọn danh mục"
                />
              )}
            />

            <Controller
              name="tag_ids"
              control={control}
              render={({ field }) => (
                <MultipleSelect
                  {...field}
                  options={tagOptions}
                  label="Thẻ bài viết"
                  placeholder="Chọn thẻ"
                />
              )}
            />

            <div className="grid grid-cols-2 gap-4 h-fit self-end">
              <label className="flex items-center space-x-3 p-3 bg-white rounded-xl border border-gray-200 cursor-pointer hover:bg-blue-50 transition-colors">
                <input type="checkbox" {...register("is_featured")} className="w-5 h-5 rounded text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Nổi bật</span>
              </label>
              <label className="flex items-center space-x-3 p-3 bg-white rounded-xl border border-gray-200 cursor-pointer hover:bg-blue-50 transition-colors">
                <input type="checkbox" {...register("is_pinned")} className="w-5 h-5 rounded text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Ghim đầu</span>
              </label>
            </div>
          </div>
        </div>

        {/* SECTION: SEO */}
        <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Tối ưu SEO</h3>
              <p className="text-xs text-gray-500">Cấu hình thẻ Meta cho các công cụ tìm kiếm</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Meta Title" {...register("meta_title")} error={errors.meta_title?.message} />
            <FormField label="Canonical URL" {...register("canonical_url")} error={errors.canonical_url?.message} />
            <div className="md:col-span-2">
              <FormField label="Meta Description" type="textarea" rows={2} {...register("meta_description")} error={errors.meta_description?.message} />
            </div>
            <FormField label="OG Title" {...register("og_title")} error={errors.og_title?.message} />
            <div className="md:col-span-1 space-y-4">
              <label className="block text-sm font-semibold text-gray-700">OG Image</label>
              <Controller
                name="og_image"
                control={control}
                render={({ field }) => <ImageUploader {...field} />}
              />
            </div>
            <div className="md:col-span-2">
              <FormField label="OG Description" type="textarea" rows={2} {...register("og_description")} error={errors.og_description?.message} />
            </div>
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="flex justify-end space-x-4 pt-8 border-t border-gray-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-8 py-3 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all active:scale-95"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isSubmitting ? "Đang xử lý..." : post ? "Cập nhật bài viết" : "Tạo bài viết mới"}
          </button>
        </div>
      </form>
    </Modal>
  );
}




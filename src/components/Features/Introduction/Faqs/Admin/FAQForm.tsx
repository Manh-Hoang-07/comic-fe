"use client";

import { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Modal from "@/components/UI/Feedback/Modal";
import FormField from "@/components/UI/Forms/FormField";

// 1. Define FAQ Schema
const faqSchema = z.object({
  question: z.string().min(1, "Câu hỏi là bắt buộc").max(500, "Câu hỏi không được vượt quá 500 ký tự"),
  answer: z.string().min(1, "Câu trả lời là bắt buộc").max(2000, "Câu trả lời không được vượt quá 2000 ký tự"),
  status: z.string().min(1, "Trạng thái là bắt buộc").default("active"),
  sort_order: z.coerce.number().int().min(0, "Thứ tự không được âm").default(0),
});

type FAQFormValues = z.infer<typeof faqSchema>;

const getBasicStatusArray = () => [
  { value: "active", label: "Hoạt động" },
  { value: "inactive", label: "Ngừng hoạt động" },
];

interface FAQ {
  id?: number;
  question?: string;
  answer?: string;
  status?: string;
  sort_order?: number;
}

interface FAQFormProps {
  show: boolean;
  faq?: FAQ | null;
  apiErrors?: Record<string, string | string[]>;
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
}

export default function FAQForm({
  show,
  faq,
  apiErrors = {},
  onSubmit,
  onCancel,
}: FAQFormProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FAQFormValues>({
    resolver: zodResolver(faqSchema),
    defaultValues: {
      question: "",
      answer: "",
      status: "active",
      sort_order: 0,
    },
  });

  const statusOptions = useMemo(() => getBasicStatusArray(), []);

  // Reset/Initialize
  useEffect(() => {
    if (show) {
      if (faq) {
        reset({
          question: faq.question || "",
          answer: faq.answer || "",
          status: faq.status || "active",
          sort_order: faq.sort_order || 0,
        });
      } else {
        reset({
          question: "",
          answer: "",
          status: "active",
          sort_order: 0,
        });
      }
    }
  }, [faq, show, reset]);

  // Map API Errors
  useEffect(() => {
    if (apiErrors) {
      Object.keys(apiErrors).forEach((key) => {
        const message = Array.isArray(apiErrors[key]) ? apiErrors[key][0] : String(apiErrors[key]);
        setError(key as any, { message });
      });
    }
  }, [apiErrors, setError]);

  const formTitle = faq ? "Chỉnh sửa FAQ" : "Thêm FAQ mới";

  if (!show) return null;

  return (
    <Modal show={show} onClose={onCancel || (() => { })} title={formTitle} size="lg" loading={isSubmitting}>
      <form onSubmit={handleSubmit((data) => onSubmit?.(data))} className="space-y-8 p-1">

        <section className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6">
          <header className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Nội dung câu hỏi</h3>
              <p className="text-xs text-gray-500">Người dùng sẽ thấy câu hỏi và câu trả lời này</p>
            </div>
          </header>

          <div className="space-y-4">
            <FormField
              label="Câu hỏi"
              {...register("question")}
              placeholder="Ví dụ: Làm thế nào để đăng ký tài khoản?"
              error={errors.question?.message}
              required
            />

            <FormField
              label="Câu trả lời"
              type="textarea"
              rows={5}
              {...register("answer")}
              placeholder="Nhập câu trả lời chi tiết..."
              error={errors.answer?.message}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                name="status"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <FormField
                    label="Trạng thái"
                    required
                    type="select"
                    value={value}
                    onChange={onChange}
                    options={statusOptions}
                  />
                )}
              />
              <FormField
                label="Thứ tự hiển thị"
                type="number"
                {...register("sort_order")}
                error={errors.sort_order?.message}
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
            disabled={isSubmitting}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isSubmitting ? "Đang xử lý..." : faq ? "Cập nhật FAQ" : "Thêm FAQ"}
          </button>
        </div>
      </form>
    </Modal>
  );
}





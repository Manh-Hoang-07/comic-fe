import { z } from "zod";
import { statusField, sortOrderField, optionalText, optionalImage } from "./common";

export const testimonialSchema = z.object({
  client_name: z.string().min(1, "Tên khách hàng là bắt buộc").max(100, "Tên khách hàng không được vượt quá 100 ký tự"),
  client_position: optionalText(100, "Chức vụ"),
  client_company: optionalText(100, "Công ty"),
  client_avatar: optionalImage,
  content: z.string().min(1, "Nội dung là bắt buộc").max(2000, "Nội dung không được vượt quá 2000 ký tự"),
  rating: z.coerce.number().min(1, "Đánh giá tối thiểu 1 sao").max(5, "Đánh giá tối đa 5 sao").optional().nullable(),
  project_id: z.coerce.number().optional().nullable(),
  featured: z.boolean().default(false),
  status: statusField,
  sort_order: sortOrderField,
});
export type TestimonialFormValues = z.infer<typeof testimonialSchema>;

import { z } from "zod";
import { nameField, optionalText, optionalImage, statusField, sortOrderField, optionalNumber, booleanField } from "@/config/validations/common";

export const testimonialSchema = z.object({
  client_name: nameField("Tên khách hàng", 100),
  client_position: optionalText(100, "Chức vụ"),
  client_company: optionalText(100, "Công ty"),
  client_avatar: optionalImage,
  content: z.string().min(1, "Nội dung là bắt buộc").max(2000, "Nội dung không được vượt quá 2000 ký tự"),
  rating: z.coerce.number().min(1, "Đánh giá tối thiểu 1 sao").max(5, "Đánh giá tối đa 5 sao").optional().nullable(),
  project_id: optionalNumber,
  featured: booleanField(),
  status: statusField,
  sort_order: sortOrderField,
});

export type TestimonialFormValues = z.infer<typeof testimonialSchema>;

import { z } from "zod";
import { nameField, requiredImage, sortOrderField, booleanField, stringArrayRequired, metaFields } from "@/config/validations/common";

export const projectSchema = z.object({
  name: nameField("Tên dự án"),
  slug: z.string().max(255, "Slug không được vượt quá 255 ký tự").optional().nullable(),
  description: z.string().min(1, "Mô tả chi tiết là bắt buộc"),
  short_description: z.string().max(500, "Mô tả ngắn tối đa 500 ký tự").optional().nullable(),
  cover_image: requiredImage("Ảnh bìa"),
  location: z.string().max(255, "Địa điểm tối đa 255 ký tự").optional().nullable(),
  area: z.coerce.number().positive("Diện tích phải là số dương").optional().nullable(),
  start_date: z.string().optional().nullable(),
  end_date: z.string().optional().nullable(),
  status: z.string().min(1, "Trạng thái là bắt buộc").default("planning"),
  client_name: z.string().max(255, "Tên khách hàng tối đa 255 ký tự").optional().nullable(),
  budget: z.coerce.number().positive("Ngân sách phải là số dương").optional().nullable(),
  images: stringArrayRequired("Ảnh dự án"),
  featured: booleanField(),
  sort_order: sortOrderField,
  ...metaFields,
});

export type ProjectFormValues = z.infer<typeof projectSchema>;

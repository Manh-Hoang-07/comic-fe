import { z } from "zod";
import { nameField, statusField, sortOrderField, optionalText, requiredImage, metaFields } from "./common";

export const projectSchema = z.object({
  name: nameField("Tên dự án"),
  slug: optionalText(255, "Slug"),
  description: z.string().min(1, "Mô tả chi tiết là bắt buộc"),
  short_description: optionalText(500, "Mô tả ngắn"),
  cover_image: requiredImage("Ảnh bìa"),
  location: optionalText(255, "Địa điểm"),
  area: z.coerce.number().positive("Diện tích phải là số dương").optional().nullable(),
  start_date: z.string().optional().nullable(),
  end_date: z.string().optional().nullable(),
  status: z.string().min(1, "Trạng thái là bắt buộc").default("planning"),
  client_name: optionalText(255, "Tên khách hàng"),
  budget: z.coerce.number().positive("Ngân sách phải là số dương").optional().nullable(),
  images: z.array(z.string()).min(1, "Bộ sưu tập ảnh dự án phải có ít nhất 1 ảnh"),
  featured: z.boolean().default(false),
  sort_order: sortOrderField,
  ...metaFields,
});
export type ProjectFormValues = z.infer<typeof projectSchema>;

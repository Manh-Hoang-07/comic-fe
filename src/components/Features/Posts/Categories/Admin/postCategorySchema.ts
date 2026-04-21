import { z } from "zod";
import { statusField, sortOrderField, optionalImage, optionalUrl, metaFields, optionalNumber } from "@/config/validations/common";

export const postCategorySchema = z.object({
  name: z.string().min(1, "Tên danh mục là bắt buộc").max(255, "Tên danh mục không được vượt quá 255 ký tự"),
  description: z.string().optional().nullable(),
  image: optionalImage,
  og_image: optionalImage,
  status: statusField,
  sort_order: sortOrderField,
  parent_id: optionalNumber,
  meta_title: metaFields.meta_title,
  meta_description: metaFields.meta_description,
  canonical_url: optionalUrl,
});

export type PostCategoryFormValues = z.infer<typeof postCategorySchema>;

import { z } from "zod";
import {
  nameField,
  requiredImage,
  optionalImage,
  optionalUrl,
  optionalText,
  numberArrayField,
  booleanField,
  metaFields,
} from "@/config/validations/common";

export const postSchema = z.object({
  name: nameField("Tiêu đề"),
  excerpt: optionalText(500, "Tóm tắt"),
  content: z.string().min(1, "Nội dung là bắt buộc"),
  cover_image: requiredImage("Ảnh bìa"),
  image: optionalImage,
  post_type: z.string().default("text"),
  video_url: optionalUrl,
  audio_url: optionalUrl,
  status: z.string().min(1, "Trạng thái là bắt buộc").default("draft"),
  published_at: z.string().optional().nullable().or(z.literal("")),
  primary_postcategory_id: z.coerce.number({ invalid_type_error: "Vui lòng chọn danh mục chính" }).positive("Vui lòng chọn danh mục chính"),
  category_ids: numberArrayField,
  tag_ids: numberArrayField,
  is_featured: booleanField(),
  is_pinned: booleanField(),
  ...metaFields,
  og_title: optionalText(255, "OG Title"),
  og_description: optionalText(500, "OG Description"),
  og_image: optionalImage,
});

export type PostFormValues = z.infer<typeof postSchema>;

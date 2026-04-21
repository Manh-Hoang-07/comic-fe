import { z } from "zod";
import {
  statusField,
  sortOrderField,
  optionalImage,
  optionalText,
  stringArrayRequired,
  booleanField,
} from "@/config/validations/common";

export const gallerySchema = z.object({
  title: z.string().min(1, "Tiêu đề là bắt buộc").max(255, "Tiêu đề tối đa 255 ký tự"),
  slug: optionalText(255, "Slug"),
  description: optionalText(1000, "Mô tả"),
  cover_image: optionalImage,
  images: stringArrayRequired("Ảnh gallery"),
  featured: booleanField(),
  status: statusField,
  sort_order: sortOrderField,
});

export type GalleryFormValues = z.infer<typeof gallerySchema>;

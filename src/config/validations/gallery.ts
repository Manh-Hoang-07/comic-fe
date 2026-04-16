import { z } from "zod";
import { nameField, statusField, sortOrderField, optionalText, optionalImage } from "./common";

export const gallerySchema = z.object({
  title: nameField("Tiêu đề"),
  slug: optionalText(255, "Slug"),
  description: optionalText(1000, "Mô tả"),
  cover_image: optionalImage,
  images: z.array(z.string()).min(1, "Vui lòng chọn ít nhất 1 ảnh"),
  featured: z.boolean().default(false),
  status: statusField,
  sort_order: sortOrderField,
});
export type GalleryFormValues = z.infer<typeof gallerySchema>;

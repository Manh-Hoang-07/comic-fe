import { z } from "zod";
import { statusField, sortOrderField, optionalImage, optionalUrl, optionalText } from "@/config/validations/common";

export const aboutSectionSchema = z.object({
  title: z.string().min(1, "Tiêu đề là bắt buộc").max(255, "Tiêu đề tối đa 255 ký tự"),
  slug: optionalText(255, "Slug"),
  content: z.string().min(1, "Nội dung là bắt buộc"),
  image: optionalImage,
  video_url: optionalUrl,
  section_type: z.string().min(1, "Loại Section là bắt buộc").default("history"),
  status: statusField,
  sort_order: sortOrderField,
});

export type AboutSectionFormValues = z.infer<typeof aboutSectionSchema>;

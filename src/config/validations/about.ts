import { z } from "zod";
import { nameField, statusField, sortOrderField, optionalText, optionalImage, optionalUrl } from "./common";

export const aboutSectionSchema = z.object({
  title: nameField("Tiêu đề"),
  slug: optionalText(255, "Slug"),
  content: z.string().min(1, "Nội dung là bắt buộc"),
  image: optionalImage,
  video_url: optionalUrl,
  section_type: z.string().min(1, "Loại Section là bắt buộc").default("history"),
  status: statusField,
  sort_order: sortOrderField,
});
export type AboutSectionFormValues = z.infer<typeof aboutSectionSchema>;

import { z } from "zod";
import { nameField, optionalText, optionalNumber } from "@/config/validations/common";

export const chapterSchema = z.object({
  chapter_index: z.coerce.number().int().min(1, "Số thứ tự phải lớn hơn 0"),
  title: nameField("Tiêu đề"),
  chapter_label: optionalText(100, "Nhãn"),
  status: z.enum(["published", "draft"]).default("published"),
  comic_id: z.coerce.number({ required_error: "Vui lòng chọn bộ truyện" }).min(1, "Vui lòng chọn bộ truyện"),
  team_id: optionalNumber,
});

export type ChapterFormValues = z.infer<typeof chapterSchema>;

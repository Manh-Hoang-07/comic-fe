import { z } from "zod";
import {
  nameField,
  optionalImage,
  optionalText,
  booleanField,
  stringArrayRequired,
} from "@/config/validations/common";

export const comicSchema = z.object({
  title: nameField("Tiêu đề"),
  author: nameField("Tác giả"),
  description: optionalText(10000, "Mô tả"),
  status: z.enum(["draft", "published", "completed", "hidden"]).default("draft"),
  is_featured: booleanField(),
  category_ids: stringArrayRequired("Thể loại"),
  cover_image: optionalImage,
});

export type ComicFormValues = z.infer<typeof comicSchema>;

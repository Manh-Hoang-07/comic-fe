import { z } from "zod";
import { nameField, optionalText } from "@/config/validations/common";

export const comicCategorySchema = z.object({
  name: nameField("Tên danh mục"),
  description: optionalText(10000, "Mô tả"),
});

export type ComicCategoryFormValues = z.infer<typeof comicCategorySchema>;

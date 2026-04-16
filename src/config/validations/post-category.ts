import { z } from "zod";
import { nameField, statusField, sortOrderField, optionalText, optionalImage, metaFields } from "./common";

export const postCategorySchema = z.object({
  name: nameField("Tên danh mục"),
  description: optionalText(500),
  image: optionalImage,
  status: statusField,
  sort_order: sortOrderField,
  parent_id: z.coerce.number().optional().nullable(),
  ...metaFields,
});
export type PostCategoryFormValues = z.infer<typeof postCategorySchema>;

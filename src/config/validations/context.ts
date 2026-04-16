import { z } from "zod";
import { nameField, statusField, optionalText } from "./common";

export const contextSchema = z.object({
  type: z.string().min(1, "Loại context là bắt buộc").max(100, "Loại context tối đa 100 ký tự"),
  code: optionalText(100, "Mã code"),
  name: nameField("Tên context"),
  status: statusField,
});
export type ContextFormValues = z.infer<typeof contextSchema>;

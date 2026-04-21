import { z } from "zod";
import { statusField, nameField } from "@/config/validations/common";

export const contextSchema = z.object({
  type: z.string().min(1, "Loại context là bắt buộc").max(100, "Loại context tối đa 100 ký tự"),
  code: z.string().max(100, "Mã code tối đa 100 ký tự").optional().nullable(),
  name: nameField("Tên context"),
  status: statusField,
});

export type ContextFormValues = z.infer<typeof contextSchema>;

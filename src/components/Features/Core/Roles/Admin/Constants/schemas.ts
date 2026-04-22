import { z } from "zod";
import { statusField, optionalNumber, numberArrayField } from "@/config/validations/common";

export const roleSchema = z.object({
  code: z.string().min(1, "Mã code là bắt buộc").max(100, "Mã code không được vượt quá 100 ký tự"),
  name: z.string().min(1, "Tên vai trò là bắt buộc").max(150, "Tên vai trò không được vượt quá 150 ký tự"),
  parent_id: optionalNumber,
  status: statusField,
  context_ids: numberArrayField,
});

export type RoleFormValues = z.infer<typeof roleSchema>;

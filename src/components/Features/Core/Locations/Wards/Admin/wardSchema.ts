import { z } from "zod";
import { statusEnumField, optionalText } from "@/config/validations/common";

export const wardSchema = z.object({
  code: z
    .string()
    .min(1, "Mã phường/xã là bắt buộc")
    .max(20, "Mã không được vượt quá 20 ký tự"),
  name: z
    .string()
    .min(1, "Tên phường/xã là bắt buộc")
    .max(191, "Tên không được vượt quá 191 ký tự"),
  type: optionalText(),
  province_id: z.coerce.number().min(1, "Tỉnh/Thành là bắt buộc"),
  status: statusEnumField,
});

export type WardFormValues = z.infer<typeof wardSchema>;

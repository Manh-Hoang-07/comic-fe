import { z } from "zod";
import { statusEnumField, optionalText } from "@/config/validations/common";

export const provinceSchema = z.object({
  code: z
    .string()
    .min(1, "Mã tỉnh/thành là bắt buộc")
    .max(20, "Mã không được vượt quá 20 ký tự"),
  name: z
    .string()
    .min(1, "Tên tỉnh/thành là bắt buộc")
    .max(191, "Tên không được vượt quá 191 ký tự"),
  type: optionalText(),
  phone_code: optionalText(),
  country_id: z.coerce.number().min(1, "Quốc gia là bắt buộc"),
  status: statusEnumField,
});

export type ProvinceFormValues = z.infer<typeof provinceSchema>;

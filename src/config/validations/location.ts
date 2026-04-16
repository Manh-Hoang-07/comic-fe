import { z } from "zod";
import { statusEnumField } from "./common";

export const countrySchema = z.object({
  code: z.string().min(1, "Mã quốc gia là bắt buộc").max(10, "Mã không được vượt quá 10 ký tự"),
  name: z.string().min(1, "Tên quốc gia là bắt buộc").max(191, "Tên không được vượt quá 191 ký tự"),
  official_name: z.string().optional().nullable(),
  phone_code: z.string().optional().nullable(),
  currency_code: z.string().optional().nullable(),
  status: statusEnumField,
});
export type CountryFormValues = z.infer<typeof countrySchema>;

export const provinceSchema = z.object({
  code: z.string().min(1, "Mã tỉnh/thành là bắt buộc").max(20, "Mã không được vượt quá 20 ký tự"),
  name: z.string().min(1, "Tên tỉnh/thành là bắt buộc").max(191, "Tên không được vượt quá 191 ký tự"),
  type: z.string().optional().nullable(),
  phone_code: z.string().optional().nullable(),
  country_id: z.coerce.number().min(1, "Quốc gia là bắt buộc"),
  status: statusEnumField,
});
export type ProvinceFormValues = z.infer<typeof provinceSchema>;

export const wardSchema = z.object({
  code: z.string().min(1, "Mã phường/xã là bắt buộc").max(20, "Mã không được vượt quá 20 ký tự"),
  name: z.string().min(1, "Tên phường/xã là bắt buộc").max(191, "Tên không được vượt quá 191 ký tự"),
  type: z.string().optional().nullable(),
  province_id: z.coerce.number().min(1, "Tỉnh/Thành là bắt buộc"),
  status: statusEnumField,
});
export type WardFormValues = z.infer<typeof wardSchema>;

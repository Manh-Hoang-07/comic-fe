import { z } from "zod";
import { statusEnumField, optionalText } from "@/config/validations/common";

export const countrySchema = z.object({
  code: z
    .string()
    .min(1, "Mã quốc gia là bắt buộc")
    .max(10, "Mã không được vượt quá 10 ký tự"),
  name: z
    .string()
    .min(1, "Tên quốc gia là bắt buộc")
    .max(191, "Tên không được vượt quá 191 ký tự"),
  official_name: optionalText(),
  phone_code: optionalText(),
  currency_code: optionalText(),
  status: statusEnumField,
});

export type CountryFormValues = z.infer<typeof countrySchema>;

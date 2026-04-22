import { z } from "zod";
import { statusField, nameField } from "@/config/validations/common";

export const countrySchema = z.object({
  code: z
    .string()
    .min(1, "Mã quốc gia là bắt buộc")
    .max(5, "Mã quốc gia tối đa 5 ký tự"),
  name: nameField("Tên quốc gia"),
  official_name: z.string().max(255, "Tên đầy đủ tối đa 255 ký tự").optional(),
  phone_code: z.string().max(10, "Mã điện thoại tối đa 10 ký tự").optional(),
  currency_code: z.string().max(10, "Mã tiền tệ tối đa 10 ký tự").optional(),
  status: statusField,
});

export type CountryFormValues = z.infer<typeof countrySchema>;

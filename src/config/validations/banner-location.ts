import { z } from "zod";
import { nameField, statusField, optionalText } from "./common";

export const bannerLocationSchema = z.object({
  code: z.string()
    .min(1, "Mã vị trí là bắt buộc")
    .regex(/^[a-z0-9_]+$/, "Mã vị trí chỉ chứa chữ cái thường, số và dấu gạch dưới")
    .max(100, "Mã tối đa 100 ký tự"),
  name: nameField("Tên vị trí"),
  description: optionalText(500, "Mô tả"),
  status: statusField,
});
export type BannerLocationFormValues = z.infer<typeof bannerLocationSchema>;

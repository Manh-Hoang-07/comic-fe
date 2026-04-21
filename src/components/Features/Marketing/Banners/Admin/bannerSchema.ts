import { z } from "zod";
import { statusField, sortOrderField, optionalImage, optionalUrl, optionalText } from "@/config/validations/common";

export const bannerSchema = z.object({
  title: z.string().min(1, "Tiêu đề là bắt buộc").max(255, "Tiêu đề quá dài"),
  subtitle: optionalText(255, "Phụ đề"),
  description: z.string().optional().nullable(),
  image: z.string().min(1, "Hình ảnh desktop là bắt buộc"),
  mobile_image: optionalImage,
  link: optionalUrl,
  link_target: z.enum(["_self", "_blank"]).default("_self"),
  button_text: optionalText(50, "Text nút"),
  button_color: z.string().regex(/^#[0-9A-F]{6}$/i, "Màu không hợp lệ").default("#ff6b6b"),
  text_color: z.string().regex(/^#[0-9A-F]{6}$/i, "Màu không hợp lệ").default("#ffffff"),
  location_id: z.coerce.number({ invalid_type_error: "Vị trí là bắt buộc" }).positive("Vị trí không hợp lệ"),
  sort_order: sortOrderField,
  status: statusField,
  start_date: z.string().optional().nullable(),
  end_date: z.string().optional().nullable(),
});

export type BannerFormValues = z.infer<typeof bannerSchema>;

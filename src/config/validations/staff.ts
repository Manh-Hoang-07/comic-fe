import { z } from "zod";
import { statusField, sortOrderField, optionalText, optionalImage, optionalUrl } from "./common";

export const staffSchema = z.object({
  name: z.string().min(1, "Họ tên là bắt buộc").max(100, "Họ tên không được vượt quá 100 ký tự"),
  position: z.string().min(1, "Chức vụ là bắt buộc").max(100, "Chức vụ không được vượt quá 100 ký tự"),
  department: optionalText(100, "Phòng ban"),
  bio: optionalText(1000, "Tiểu sử"),
  avatar: optionalImage,
  email: z.string().email("Email không hợp lệ").or(z.literal("")).optional().nullable(),
  phone: optionalText(20, "Số điện thoại"),
  social_links: z.object({
    facebook: optionalUrl,
    linkedin: optionalUrl,
    twitter: optionalUrl,
  }).optional(),
  experience: z.coerce.number().min(0, "Kinh nghiệm không được âm").default(0),
  expertise: optionalText(500, "Chuyên môn"),
  status: statusField,
  sort_order: sortOrderField,
});
export type StaffFormValues = z.infer<typeof staffSchema>;

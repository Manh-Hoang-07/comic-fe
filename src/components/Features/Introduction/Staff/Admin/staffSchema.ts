import { z } from "zod";
import { nameField, optionalText, optionalImage, optionalUrl, statusField, sortOrderField, optionalEmailField } from "@/config/validations/common";

export const staffSchema = z.object({
  name: nameField("Họ tên", 100),
  position: nameField("Chức vụ", 100),
  department: optionalText(100, "Phòng ban"),
  bio: optionalText(1000, "Tiểu sử"),
  avatar: optionalImage,
  email: optionalEmailField,
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

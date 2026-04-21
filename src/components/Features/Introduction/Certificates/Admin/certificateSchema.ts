import { z } from "zod";
import { nameField, requiredImage, optionalText, statusField, sortOrderField } from "@/config/validations/common";

export const certificateSchema = z.object({
  name: nameField("Tên chứng chỉ"),
  image: requiredImage("Ảnh chứng chỉ"),
  issued_by: optionalText(255, "Cơ quan cấp"),
  issued_date: z.string().optional().nullable(),
  expiry_date: z.string().optional().nullable(),
  certificate_number: optionalText(100, "Số chứng chỉ"),
  description: optionalText(1000, "Mô tả"),
  type: z.string().min(1, "Loại chứng chỉ là bắt buộc").default("license"),
  status: statusField,
  sort_order: sortOrderField,
});

export type CertificateFormValues = z.infer<typeof certificateSchema>;

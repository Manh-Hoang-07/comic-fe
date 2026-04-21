import { z } from "zod";
import { nameField, requiredImage, optionalText, optionalUrl, statusField, sortOrderField } from "@/config/validations/common";

export const partnerSchema = z.object({
  name: nameField("Tên đối tác"),
  logo: requiredImage("Logo"),
  website: optionalUrl,
  description: optionalText(500, "Mô tả"),
  type: z.string().min(1, "Loại đối tác là bắt buộc").default("client"),
  status: statusField,
  sort_order: sortOrderField,
});

export type PartnerFormValues = z.infer<typeof partnerSchema>;

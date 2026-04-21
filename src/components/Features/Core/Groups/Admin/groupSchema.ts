import { z } from "zod";
import { codeField, nameField, optionalText, optionalNumber } from "@/config/validations/common";

export const groupSchema = z.object({
  type: z.string().min(1, "Loại group là bắt buộc").max(100, "Loại tối đa 100 ký tự"),
  context_id: optionalNumber,
  code: codeField("Mã code"),
  name: nameField("Tên group"),
  description: optionalText(500),
  metadata: z.record(z.any()).default({}),
  metadata_json: z.string().optional().nullable(),
});

export type GroupFormValues = z.infer<typeof groupSchema>;

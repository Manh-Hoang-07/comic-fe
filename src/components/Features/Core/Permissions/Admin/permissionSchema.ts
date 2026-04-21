import { z } from "zod";
import { statusField, optionalNumber } from "@/config/validations/common";

export const permissionSchema = z.object({
  code: z.string().min(1, "Mã code là bắt buộc").max(120, "Mã code tối đa 120 ký tự"),
  name: z.string().min(1, "Tên quyền là bắt buộc").max(150, "Tên quyền tối đa 150 ký tự"),
  scope: z.string().min(1, "Phạm vi là bắt buộc").default("context"),
  parent_id: optionalNumber,
  status: statusField,
});

export type PermissionFormValues = z.infer<typeof permissionSchema>;

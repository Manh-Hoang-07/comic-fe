import { z } from "zod";
import { statusField, codeField, nameField, optionalNumber } from "@/config/validations/common";

export const permissionSchema = z.object({
  code: codeField("Mã định danh"),
  name: nameField("Tên quyền"),
  scope: z.string().min(1, "Scope là bắt buộc").default("context"),
  parent_id: optionalNumber,
  status: statusField,
});

export type PermissionFormValues = z.infer<typeof permissionSchema>;

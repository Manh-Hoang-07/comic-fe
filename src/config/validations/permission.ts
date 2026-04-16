import { z } from "zod";
import { codeField, nameField, statusField } from "./common";

export const permissionSchema = z.object({
  code: codeField("Mã code", 120),
  name: nameField("Tên quyền", 150),
  scope: z.string().min(1, "Phạm vi là bắt buộc").default("context"),
  parent_id: z.coerce.number().optional().nullable(),
  status: statusField,
});
export type PermissionFormValues = z.infer<typeof permissionSchema>;

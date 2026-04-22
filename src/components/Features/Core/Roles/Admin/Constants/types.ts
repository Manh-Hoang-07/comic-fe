import { EditTarget } from "@/hooks/crud/useFormModal";

export interface Role {
  id: number;
  code?: string;
  name?: string;
  parent_id?: number | null;
  status?: string;
  contexts?: Array<{ id: number; name: string; type: string }>;
  displayName?: string;
}

export interface RoleFormProps {
  show: boolean;
  role?: Role | null;
  statusEnums?: Array<{ value: string; label: string; name?: string }>;
  apiErrors?: Record<string, string | string[]> | null;
  loading?: boolean;
  onSubmit?: (data: Record<string, unknown>) => void;
  onCancel?: () => void;
}

export interface AdminRolesProps {
  title?: string;
  createButtonText?: string;
}

export interface CreateRoleProps {
  show: boolean;
  createApi: string;
  statusEnums?: Array<{ value: string; label: string; name?: string }>;
  onSuccess?: () => void;
  onClose?: () => void;
}

export interface EditRoleProps {
  show: boolean;
  target: EditTarget | null;
  statusEnums?: Array<{ value: string; label: string; name?: string }>;
  onSuccess?: () => void;
  onClose?: () => void;
}

export interface AssignPermissionsProps {
  show: boolean;
  role?: Record<string, any>;
  onPermissionsAssigned?: () => void;
  onClose?: () => void;
}

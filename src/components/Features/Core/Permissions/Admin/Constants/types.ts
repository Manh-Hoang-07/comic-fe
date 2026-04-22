import { EditTarget } from "@/hooks/crud/useFormModal";

export interface Permission {
  id: number;
  code?: string;
  name?: string;
  scope?: string;
  parent_id?: number | null;
  status?: string;
}

export interface PermissionFormProps {
  show: boolean;
  permission?: Permission | null;
  statusEnums?: Array<{ value: string; label: string; name?: string }>;
  apiErrors?: Record<string, string | string[]> | null;
  loading?: boolean;
  onSubmit?: (data: Record<string, unknown>) => void;
  onCancel?: () => void;
}

export interface AdminPermissionsProps {
  title?: string;
  createButtonText?: string;
}


export interface CreatePermissionProps {
  show: boolean;
  createApi: string;
  statusEnums?: Array<{ value: string; label: string; name?: string }>;
  onSuccess?: () => void;
  onClose?: () => void;
}

export interface EditPermissionProps {
  show: boolean;
  target: EditTarget | null;
  statusEnums?: Array<{ value: string; label: string; name?: string }>;
  onSuccess?: () => void;
  onClose?: () => void;
}

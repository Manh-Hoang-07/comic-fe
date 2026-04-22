import { EditTarget } from "@/hooks/crud/useFormModal";

export interface User {
  id: number;
  username: string;
  email: string;
  phone?: string | null;
  name?: string;
  gender?: string;
  birthday?: string;
  country_id?: number | null;
  province_id?: number | null;
  ward_id?: number | null;
  address?: string;
  image?: string | null;
  about?: string;
  status?: string;
  displayName?: string;
}

export interface UserFormProps {
  show: boolean;
  user?: User | null;
  statusEnums?: Array<{ value: string; label: string; name?: string }>;
  genderEnums?: Array<{ value: string; label: string; name?: string }>;
  apiErrors?: Record<string, string | string[]> | null;
  loading?: boolean;
  onSubmit?: (data: Record<string, unknown>) => void;
  onCancel?: () => void;
}

export interface AdminUsersProps {
  title?: string;
  createButtonText?: string;
}

export interface CreateUserProps {
  show: boolean;
  createApi: string;
  statusEnums?: Array<{ value: string; label: string; name?: string }>;
  genderEnums?: Array<{ value: string; label: string; name?: string }>;
  onSuccess?: () => void;
  onClose?: () => void;
}

export interface EditUserProps {
  show: boolean;
  target: EditTarget | null;
  statusEnums?: Array<{ value: string; label: string; name?: string }>;
  genderEnums?: Array<{ value: string; label: string; name?: string }>;
  onSuccess?: () => void;
  onClose?: () => void;
}

export interface ChangePasswordTarget {
  passApi: string;
  user: Record<string, unknown>;
}

export interface ChangePasswordProps {
  show: boolean;
  target: ChangePasswordTarget | null;
  onSuccess?: () => void;
  onClose?: () => void;
}

export interface AssignRoleTarget {
  user: any;
}

export interface AssignRoleProps {
  show: boolean;
  target: AssignRoleTarget | null;
  onSuccess?: () => void;
  onClose?: () => void;
}

export interface ChangePasswordFormProps {
  show: boolean;
  user?: Record<string, unknown>;
  apiErrors?: Record<string, string | string[]> | null;
  onSubmit?: (data: Record<string, unknown>) => void;
  onCancel?: () => void;
}


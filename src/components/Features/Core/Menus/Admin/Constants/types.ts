import { MenuTreeItem } from "@/hooks/data/system/useMenus";
import { EditTarget } from "@/hooks/crud/useFormModal";

export interface Menu {
  id: number;
  code: string;
  name: string;
  path?: string | null;
  api_path?: string | null;
  icon?: string | null;
  type?: string;
  status?: string;
  parent_id?: number | string | null;
  sort_order?: number;
  is_public?: boolean;
  show_in_menu?: boolean;
  required_permission_id?: number | string | null;
  group?: string;
  deleted_at?: string;
  parent?: { id: number; name: string };
  displayName?: string; // For tree display
}

export interface AdminMenusProps {
  title?: string;
  createButtonText?: string;
}


export interface MenuFormProps {
  show: boolean;
  menu?: Menu | null;
  statusEnums?: Array<{ value: string; label: string }>;
  parentMenus?: MenuTreeItem[];
  permissions?: Array<{ id: number; name: string; code: string }>;
  apiErrors?: Record<string, string | string[]> | null;
  loading?: boolean;
  onSubmit?: (data: Record<string, unknown>) => void;
  onCancel?: () => void;
}

export interface CreateMenuProps {
  show: boolean;
  createApi: string;
  statusEnums?: Array<{ value: string; label: string; name?: string }>;
  parentMenus?: MenuTreeItem[];
  permissions?: Array<{ id: number; name: string; code: string }>;
  onSuccess?: () => void;
  onClose?: () => void;
}

export interface EditMenuProps {
  show: boolean;
  target: EditTarget | null;
  statusEnums?: Array<{ value: string; label: string; name?: string }>;
  parentMenus?: MenuTreeItem[];
  permissions?: Array<{ id: number; name: string; code: string }>;
  onSuccess?: () => void;
  onClose?: () => void;
}


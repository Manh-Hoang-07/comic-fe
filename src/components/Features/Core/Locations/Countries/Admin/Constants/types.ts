import { EditTarget } from "@/hooks/crud/useFormModal";

export interface Country {
  id: number;
  code?: string;
  name?: string;
  official_name?: string | null;
  phone_code?: string | null;
  currency_code?: string | null;
  status?: string | null;
  displayName?: string;
}

export interface AdminCountriesProps {
  title?: string;
  createButtonText?: string;
}


export interface CountryFormProps {
  show: boolean;
  country?: Country | null;
  apiErrors?: Record<string, string | string[]> | null;
  loading?: boolean;
  onSubmit?: (data: Record<string, any>) => void;
  onCancel?: () => void;
}


export interface CreateCountryProps {
  show: boolean;
  createApi: string;
  onSuccess?: () => void;
  onClose?: () => void;
}

export interface EditCountryProps {
  show: boolean;
  target: EditTarget | null;
  onSuccess?: () => void;
  onClose?: () => void;
}

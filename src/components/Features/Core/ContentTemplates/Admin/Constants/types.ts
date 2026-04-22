import { ContentTemplate } from "@/types/api";
import { EditTarget } from "@/hooks/crud/useFormModal";

export interface ContentTemplateFormProps {
    initialData?: Partial<ContentTemplate>;
    onSubmit: (data: Record<string, unknown>) => void;
    apiErrors?: Record<string, string | string[]> | null;
    loading?: boolean;
    onCancel?: () => void;
}

export interface CreateContentTemplateProps {
    show: boolean;
    createApi: string;
    onSuccess?: () => void;
    onClose?: () => void;
}

export interface EditContentTemplateProps {
    show: boolean;
    target: EditTarget | null;
    onSuccess?: () => void;
    onClose?: () => void;
}

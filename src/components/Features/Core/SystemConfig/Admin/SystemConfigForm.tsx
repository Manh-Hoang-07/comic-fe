"use client";

import { useState, useEffect } from "react";
import { useSystemConfig } from "@/hooks";
import FormField from "@/components/UI/Forms/FormField";
import ImageUploader from "@/components/UI/Forms/ImageUploader";
import { api } from "@/lib/api/client";
import { adminEndpoints } from "@/lib/api/endpoints";
import { useToastContext } from "@/contexts/ToastContext";

interface ConfigField {
    key: string;
    label: string;
    type: "text" | "number" | "textarea" | "image" | "email" | "password" | "checkbox" | "custom";
    placeholder?: string;
    description?: string;
    component?: React.ComponentType<{
        value: unknown;
        onChange: (value: unknown) => void;
        formData?: Record<string, unknown>;
        onUpdate?: (key: string, value: unknown) => void;
    }>;
}

interface SystemConfigFormProps {
    group: string;
    fields: ConfigField[];
}

export default function SystemConfigForm({ group, fields }: SystemConfigFormProps) {
    const { data: configData, loading, refresh } = useSystemConfig(group, { isAdmin: true, enableCache: false });
    const { showSuccess, showError } = useToastContext();
    const [formData, setFormData] = useState<Record<string, unknown>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (configData) {
            setFormData(configData);
        }
    }, [configData]);

    const handleChange = (key: string, value: unknown) => {
        setFormData((prev) => ({
            ...prev,
            [key]: value,
        }));
        // Clear error when field changes
        if (errors[key]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[key];
                return newErrors;
            });
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        fields.forEach(field => {
            const value = formData[field.key] as string;
            if (field.type === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                newErrors[field.key] = "Email không hợp lệ";
            }
            if (field.type === "number" && value && isNaN(Number(value))) {
                newErrors[field.key] = "Giá trị phải là số";
            }
            // Add more common validations here if needed
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            showError("Vui lòng kiểm tra lại thông tin");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await api.post(adminEndpoints.systemConfigs.update(group), formData) as { data: any };
            if (response.data.success) {
                showSuccess("Cập nhật cấu hình thành công");
                refresh();
            } else {
                showError(response.data.message || "Đã có lỗi xảy ra");
            }
        } catch (error: unknown) {
            console.error("Failed to update config:", error);
            const e = error as { response?: { data?: { message?: string } } };
            showError(e.response?.data?.message || "Lỗi kết nối server");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading && !configData) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-3 text-gray-500">Đang tải cấu hình...</span>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
                {fields.map((field) => (
                    <div key={field.key} className="space-y-2">
                        {field.type === "image" ? (
                            <div className="space-y-3">
                                <label className="block text-sm font-medium text-gray-700">
                                    {field.label}
                                    {field.description && (
                                        <span className="block text-xs font-normal text-gray-500 mt-1">
                                            {field.description}
                                        </span>
                                    )}
                                </label>
                                <ImageUploader
                                    value={formData[field.key] as string | null}
                                    defaultUrl={(formData[field.key] as string) || undefined}
                                    onChange={(value) => handleChange(field.key, value)}
                                    onRemove={() => handleChange(field.key, null)}
                                />
                                {errors[field.key] && <p className="text-sm text-red-500">{errors[field.key]}</p>}
                            </div>
                        ) : field.type === "custom" && field.component ? (
                            <field.component
                                value={formData[field.key]}
                                onChange={(value) => handleChange(field.key, value)}
                                formData={formData}
                                onUpdate={handleChange}
                            />
                        ) : (
                            <FormField
                                label={field.label}
                                type={field.type === "textarea" ? "textarea" : field.type}
                                value={field.type === "checkbox" ? !!formData[field.key] : (formData[field.key] as string) ?? ""}
                                placeholder={field.placeholder}
                                helpText={field.description}
                                error={errors[field.key]}
                                onChange={(e) => {
                                    const value = field.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
                                    handleChange(field.key, value);
                                }}
                            />
                        )}
                    </div>
                ))}
            </div>

            <div className="flex justify-end pt-6 border-t border-gray-100">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 focus:ring-4 focus:ring-primary/20 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                    {isSubmitting ? (
                        <>
                            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Đang lưu...
                        </>
                    ) : (
                        "Lưu thay đổi"
                    )}
                </button>
            </div>
        </form>
    );
}




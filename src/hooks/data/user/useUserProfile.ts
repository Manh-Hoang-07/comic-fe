"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { userService } from "@/lib/api/user";
import type { UserData } from "@/lib/api/user";
import { useAuthStore } from "@/lib/store/authStore";
import { useToastContext } from "@/contexts/ToastContext";

// ===== TYPES =====
export interface UserProfile {
    id: number;
    name?: string;
    email: string;
    phone?: string;
    address?: string;
    about?: string;
    image?: string;
    birthday?: string;
    gender?: string;
    country_id?: number | null;
    province_id?: number | null;
    ward_id?: number | null;
    created_at?: string;
}

// ===== VALIDATION SCHEMAS =====

// Schema cho form cập nhật profile
export const updateProfileSchema = z.object({
    name: z.string().min(1, "Họ và tên là bắt buộc").max(100, "Họ và tên tối đa 100 ký tự"),
    birthday: z.string().optional(),
    gender: z.string().optional(),
    address: z.string().max(255, "Địa chỉ tối đa 255 ký tự").optional(),
    country_id: z.number().nullable().optional(),
    province_id: z.number().nullable().optional(),
    ward_id: z.number().nullable().optional(),
    about: z.string().max(1000, "Giới thiệu tối đa 1000 ký tự").optional(),
});

export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;

// Schema cho form đổi mật khẩu
export const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, "Mật khẩu hiện tại là bắt buộc"),
    newPassword: z.string()
        .min(1, "Mật khẩu mới là bắt buộc")
        .min(6, "Mật khẩu mới phải có ít nhất 6 ký tự")
        .max(100, "Mật khẩu mới quá dài"),
    confirmPassword: z.string().min(1, "Xác nhận mật khẩu là bắt buộc"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
});

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

// ===== HELPER =====
function flattenProfileData(data: UserData): UserProfile {
    return {
        ...data,
        name: data.profile?.name || data.name,
        image: data.profile?.image || data.image,
        birthday: data.profile?.birthday || data.birthday,
        gender: data.profile?.gender || data.gender,
        address: data.profile?.address || data.address,
        country_id: data.profile?.country_id ? Number(data.profile.country_id) : null,
        province_id: data.profile?.province_id ? Number(data.profile.province_id) : null,
        ward_id: data.profile?.ward_id ? Number(data.profile.ward_id) : null,
        about: data.profile?.about || data.about,
    };
}

// ===== HOOK =====
export function useUserProfile() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const { showSuccess, showError } = useToastContext();

    // Form cho cập nhật profile
    const {
        register: registerProfile,
        handleSubmit: handleSubmitProfile,
        reset: resetProfile,
        watch: watchProfile,
        setValue: setValueProfile,
        control: controlProfile,
        formState: { errors: profileErrors },
    } = useForm<UpdateProfileFormValues>({
        resolver: zodResolver(updateProfileSchema),
    });

    // Form cho đổi mật khẩu
    const {
        register: registerPassword,
        handleSubmit: handleSubmitPassword,
        reset: resetPassword,
        formState: { errors: passwordErrors },
    } = useForm<ChangePasswordFormValues>({
        resolver: zodResolver(changePasswordSchema),
    });

    // Fetch user profile from API
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await userService.getProfile();

                if (response.success && response.data) {
                    setProfile(flattenProfileData(response.data));
                }
            } catch (error) {
                console.error("Failed to fetch profile:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    // Handler: Cập nhật profile
    const onSubmitProfile = async (data: UpdateProfileFormValues) => {
        if (!profile) return;

        setIsUpdating(true);
        try {
            const response = await userService.updateProfile({
                name: data.name,
                birthday: data.birthday || undefined,
                gender: data.gender || undefined,
                address: data.address || undefined,
                country_id: data.country_id || undefined,
                province_id: data.province_id || undefined,
                ward_id: data.ward_id || undefined,
                about: data.about || undefined,
            });

            if (response.success && response.data) {
                const updatedProfile = flattenProfileData(response.data);
                setProfile(updatedProfile);

                // Update auth store
                useAuthStore.getState().setUser(updatedProfile);

                // Close modal
                setIsEditModalOpen(false);

                showSuccess(response.message || "Cập nhật thông tin thành công!");
            }
        } catch (error: unknown) {
            const e = error as { response?: { data?: { message?: string } }; message?: string };
            showError(e.response?.data?.message || "Có lỗi xảy ra khi cập nhật thông tin");
        } finally {
            setIsUpdating(false);
        }
    };

    // Handler: Đổi mật khẩu
    const onSubmitPassword = async (data: ChangePasswordFormValues) => {
        setIsChangingPassword(true);
        try {
            const response = await userService.changePassword({
                old_password: data.currentPassword,
                password: data.newPassword,
                password_confirmation: data.confirmPassword,
            });

            if (response.success) {
                // Reset form
                resetPassword();

                // Close modal
                setIsPasswordModalOpen(false);

                showSuccess(response.message || "Đổi mật khẩu thành công!");
            }
        } catch (error: unknown) {
            const e = error as { response?: { data?: { message?: string } }; message?: string };
            showError(e.response?.data?.message || "Có lỗi xảy ra khi đổi mật khẩu");
        } finally {
            setIsChangingPassword(false);
        }
    };

    // Open edit modal và populate form
    const openEditModal = async () => {
        try {
            const response = await userService.getProfile();
            if (response.success && response.data) {
                const userData = flattenProfileData(response.data);
                setProfile(userData);

                resetProfile({
                    name: userData.name || "",
                    birthday: userData.birthday ? new Date(userData.birthday).toISOString().split('T')[0] : "",
                    gender: userData.gender || "",
                    address: userData.address || "",
                    country_id: userData.country_id || null,
                    province_id: userData.province_id || null,
                    ward_id: userData.ward_id || null,
                    about: userData.about || "",
                });
                setIsEditModalOpen(true);
            }
        } catch (error) {
            console.error("Failed to refetch profile before edit:", error);
            showError("Không thể tải thông tin mới nhất. Vui lòng thử lại.");
        }
    };

    // Open password modal và reset form
    const openPasswordModal = () => {
        resetPassword({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        });
        setIsPasswordModalOpen(true);
    };

    return {
        profile,
        isLoading,
        isEditModalOpen,
        isPasswordModalOpen,
        isUpdating,
        isChangingPassword,
        // Profile form
        registerProfile,
        handleSubmitProfile,
        watchProfile,
        setValueProfile,
        controlProfile,
        profileErrors,
        // Password form
        registerPassword,
        handleSubmitPassword,
        passwordErrors,
        // Handlers
        onSubmitProfile,
        onSubmitPassword,
        openEditModal,
        openPasswordModal,
        setIsEditModalOpen,
        setIsPasswordModalOpen,
    };
}

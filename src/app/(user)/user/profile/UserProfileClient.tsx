"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/UI/Navigation/Button";
import FormField from "@/components/UI/Forms/FormField";
import Modal from "@/components/UI/Feedback/Modal";
import { userService } from "@/lib/api/user";
import { useAuthStore } from "@/lib/store/authStore";
import { useToastContext } from "@/contexts/ToastContext";
import LocationSelector from "@/components/Features/Core/Locations/Shared/LocationSelector";

// ===== TYPES =====
interface UserProfile {
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
const updateProfileSchema = z.object({
    name: z.string().min(1, "Họ và tên là bắt buộc").max(100, "Họ và tên tối đa 100 ký tự"),
    birthday: z.string().optional(),
    gender: z.string().optional(),
    address: z.string().max(255, "Địa chỉ tối đa 255 ký tự").optional(),
    country_id: z.number().nullable().optional(),
    province_id: z.number().nullable().optional(),
    ward_id: z.number().nullable().optional(),
    about: z.string().max(1000, "Giới thiệu tối đa 1000 ký tự").optional(),
});

type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;

// Schema cho form đổi mật khẩu
const changePasswordSchema = z.object({
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

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

// ===== COMPONENT =====
export default function UserProfileClient() {
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
                    // Flatten profile data
                    const userData = {
                        ...response.data,
                        name: response.data.profile?.name || response.data.name,
                        image: response.data.profile?.image || response.data.image,
                        birthday: response.data.profile?.birthday || response.data.birthday,
                        gender: response.data.profile?.gender || response.data.gender,
                        address: response.data.profile?.address || response.data.address,
                        country_id: response.data.profile?.country_id ? Number(response.data.profile.country_id) : null,
                        province_id: response.data.profile?.province_id ? Number(response.data.profile.province_id) : null,
                        ward_id: response.data.profile?.ward_id ? Number(response.data.profile.ward_id) : null,
                        about: response.data.profile?.about || response.data.about,
                    };
                    setProfile(userData);
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
                // Update local state with flattened data
                const updatedProfile = {
                    ...response.data,
                    name: response.data.profile?.name || response.data.name,
                    image: response.data.profile?.image || response.data.image,
                    birthday: response.data.profile?.birthday || response.data.birthday,
                    gender: response.data.profile?.gender || response.data.gender,
                    address: response.data.profile?.address || response.data.address,
                    country_id: response.data.profile?.country_id ? Number(response.data.profile.country_id) : null,
                    province_id: response.data.profile?.province_id ? Number(response.data.profile.province_id) : null,
                    ward_id: response.data.profile?.ward_id ? Number(response.data.profile.ward_id) : null,
                    about: response.data.profile?.about || response.data.about,
                };
                setProfile(updatedProfile);

                // Update auth store
                useAuthStore.getState().setUser(updatedProfile);

                // Close modal
                setIsEditModalOpen(false);

                showSuccess(response.message || "Cập nhật thông tin thành công!");
            }
        } catch (error: any) {
            showError(error.response?.data?.message || "Có lỗi xảy ra khi cập nhật thông tin");
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
        } catch (error: any) {
            showError(error.response?.data?.message || "Có lỗi xảy ra khi đổi mật khẩu");
        } finally {
            setIsChangingPassword(false);
        }
    };

    // Open edit modal và populate form
    const openEditModal = async () => {
        try {
            // Refetch profile to get latest data
            const response = await userService.getProfile();
            if (response.success && response.data) {
                const userData = {
                    ...response.data,
                    name: response.data.profile?.name || response.data.name,
                    image: response.data.profile?.image || response.data.image,
                    birthday: response.data.profile?.birthday || response.data.birthday,
                    gender: response.data.profile?.gender || response.data.gender,
                    address: response.data.profile?.address || response.data.address,
                    country_id: response.data.profile?.country_id ? Number(response.data.profile.country_id) : null,
                    province_id: response.data.profile?.province_id ? Number(response.data.profile.province_id) : null,
                    ward_id: response.data.profile?.ward_id ? Number(response.data.profile.ward_id) : null,
                    about: response.data.profile?.about || response.data.about,
                };
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

    if (isLoading) {
        return (
            <div className="p-6">
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="ml-2 text-gray-600">Đang tải thông tin...</p>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="p-6">
                <div className="text-center py-12">
                    <p className="text-gray-600">Không tìm thấy thông tin tài khoản.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 w-full">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Thông tin cá nhân</h1>

            <div className="bg-white shadow rounded-lg">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-medium text-gray-900">Thông tin tài khoản</h2>
                        <div className="flex space-x-2">
                            <Button variant="secondary" onClick={openPasswordModal}>
                                Đổi mật khẩu
                            </Button>
                            <Button onClick={openEditModal}>
                                Chỉnh sửa
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <div className="flex items-center mb-6">
                        <div className="flex-shrink-0 h-24 w-24 rounded-full bg-gray-300 flex items-center justify-center">
                            {profile.image ? (
                                <Image
                                    src={profile.image}
                                    alt={profile.name || "User"}
                                    width={96}
                                    height={96}
                                    className="h-24 w-24 rounded-full object-cover"
                                />
                            ) : (
                                <span className="text-2xl font-medium text-gray-700">
                                    {profile.name?.charAt(0) || "U"}
                                </span>
                            )}
                        </div>
                        <div className="ml-6">
                            <h3 className="text-xl font-medium text-gray-900">{profile.name || "User"}</h3>
                            <p className="text-sm text-gray-500">Thành viên từ {profile.created_at ? new Date(profile.created_at).toLocaleDateString("vi-VN") : "N/A"}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Họ và tên</h4>
                            <p className="text-sm text-gray-900">{profile.name || "Chưa cập nhật"}</p>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Email</h4>
                            <p className="text-sm text-gray-900">{profile.email}</p>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Số điện thoại</h4>
                            <p className="text-sm text-gray-900">{profile.phone || "Chưa cập nhật"}</p>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Ngày sinh</h4>
                            <p className="text-sm text-gray-900">{profile.birthday ? new Date(profile.birthday).toLocaleDateString("vi-VN") : "Chưa cập nhật"}</p>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Giới tính</h4>
                            <p className="text-sm text-gray-900">{profile.gender === "male" ? "Nam" : profile.gender === "female" ? "Nữ" : profile.gender === "other" ? "Khác" : "Chưa cập nhật"}</p>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Địa chỉ</h4>
                            <p className="text-sm text-gray-900">{profile.address || "Chưa cập nhật"}</p>
                        </div>

                        <div className="md:col-span-2">
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Giới thiệu</h4>
                            <p className="text-sm text-gray-900">{profile.about || "Chưa cập nhật"}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Profile Modal */}
            <Modal
                show={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Chỉnh sửa thông tin"
                size="lg"
            >
                <form onSubmit={handleSubmitProfile(onSubmitProfile)} className="space-y-4">
                    <FormField
                        label="Họ và tên"
                        placeholder="Nhập họ và tên"
                        {...registerProfile("name")}
                        error={profileErrors.name?.message}
                        required
                    />

                    <FormField
                        label="Ngày sinh"
                        type="date"
                        {...registerProfile("birthday")}
                        error={profileErrors.birthday?.message}
                    />

                    <div className="space-y-1">
                        <label className="block text-sm font-semibold text-gray-700">Giới tính</label>
                        <select
                            {...registerProfile("gender")}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                        >
                            <option value="">Chọn giới tính</option>
                            <option value="male">Nam</option>
                            <option value="female">Nữ</option>
                            <option value="other">Khác</option>
                        </select>
                        {profileErrors.gender && (
                            <p className="text-xs text-red-500">{profileErrors.gender.message}</p>
                        )}
                    </div>

                    <LocationSelector
                        control={controlProfile}
                        errors={profileErrors}
                        watch={watchProfile}
                        setValue={setValueProfile}
                        required
                    />

                    <FormField
                        label="Địa chỉ cụ thể"
                        placeholder="Số nhà, tên đường..."
                        {...registerProfile("address")}
                        error={profileErrors.address?.message}
                    />

                    <FormField
                        label="Giới thiệu"
                        type="textarea"
                        rows={4}
                        placeholder="Viết một vài dòng giới thiệu về bản thân..."
                        {...registerProfile("about")}
                        error={profileErrors.about?.message}
                    />

                    <div className="flex justify-end space-x-2 pt-4">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setIsEditModalOpen(false)}
                        >
                            Hủy
                        </Button>
                        <Button type="submit" disabled={isUpdating}>
                            {isUpdating ? "Đang lưu..." : "Lưu thay đổi"}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Change Password Modal */}
            <Modal
                show={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
                title="Đổi mật khẩu"
                size="md"
            >
                <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-4">
                    <FormField
                        label="Mật khẩu hiện tại"
                        type="password"
                        placeholder="Nhập mật khẩu hiện tại"
                        {...registerPassword("currentPassword")}
                        error={passwordErrors.currentPassword?.message}
                        required
                    />

                    <FormField
                        label="Mật khẩu mới"
                        type="password"
                        placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
                        {...registerPassword("newPassword")}
                        error={passwordErrors.newPassword?.message}
                        required
                    />

                    <FormField
                        label="Xác nhận mật khẩu mới"
                        type="password"
                        placeholder="Nhập lại mật khẩu mới"
                        {...registerPassword("confirmPassword")}
                        error={passwordErrors.confirmPassword?.message}
                        required
                    />

                    <div className="flex justify-end space-x-2 pt-4">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setIsPasswordModalOpen(false)}
                        >
                            Hủy
                        </Button>
                        <Button type="submit" disabled={isChangingPassword}>
                            {isChangingPassword ? "Đang xử lý..." : "Đổi mật khẩu"}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}



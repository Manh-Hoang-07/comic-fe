"use client";

import Image from "next/image";
import { Button } from "@/components/UI/Navigation/Button";
import FormField from "@/components/UI/Forms/FormField";
import Modal from "@/components/UI/Feedback/Modal";
import LocationSelector from "@/components/Features/Core/Locations/Shared/LocationSelector";
import { useUserProfile } from "@/hooks/data/user/useUserProfile";

export default function UserProfile() {
    const {
        profile,
        isLoading,
        isEditModalOpen,
        isPasswordModalOpen,
        isUpdating,
        isChangingPassword,
        registerProfile,
        handleSubmitProfile,
        watchProfile,
        setValueProfile,
        controlProfile,
        profileErrors,
        registerPassword,
        handleSubmitPassword,
        passwordErrors,
        onSubmitProfile,
        onSubmitPassword,
        openEditModal,
        openPasswordModal,
        setIsEditModalOpen,
        setIsPasswordModalOpen,
    } = useUserProfile();

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
                        control={controlProfile as unknown as import("react-hook-form").Control<import("react-hook-form").FieldValues>}
                        errors={profileErrors}
                        watch={watchProfile as unknown as import("react-hook-form").UseFormWatch<import("react-hook-form").FieldValues>}
                        setValue={setValueProfile as unknown as import("react-hook-form").UseFormSetValue<import("react-hook-form").FieldValues>}
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

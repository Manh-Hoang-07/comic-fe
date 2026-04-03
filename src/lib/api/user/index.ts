import { api } from "@/lib/api/client";
import { userEndpoints } from "@/lib/api/endpoints";

// --- Types ---

export interface UserProfileResponse {
    success: boolean;
    data: UserData;
}

export interface UserData {
    id: number;
    username?: string;
    email: string;
    phone?: string;
    status?: string;
    // Nested profile object from API
    profile?: {
        name?: string;
        image?: string;
        birthday?: string;
        gender?: string;
        address?: string;
        country_id?: number | string | bigint | null;
        province_id?: number | string | bigint | null;
        ward_id?: number | string | bigint | null;
        about?: string;
    };
    // Flattened properties for convenience/compatibility if needed
    name?: string;
    image?: string;
    birthday?: string;
    gender?: string;
    address?: string;
    country_id?: number | string | bigint | null;
    province_id?: number | string | bigint | null;
    ward_id?: number | string | bigint | null;
    about?: string;
    created_at?: string;
    updated_at?: string;
}

export interface UpdateProfileRequest {
    name?: string;
    image?: string;
    birthday?: string; // YYYY-MM-DD
    gender?: string; // male, female, other
    address?: string;
    country_id?: number | null;
    province_id?: number | null;
    ward_id?: number | null;
    about?: string;
}

export interface UpdateProfileResponse {
    success: boolean;
    message: string;
    data: UserData;
}

export interface ChangePasswordRequest {
    old_password: string;
    password: string;
    password_confirmation: string;
}

export interface ChangePasswordResponse {
    success: boolean;
    message: string;
}

// --- Service ---

export const userService = {
    /**
     * Get current user profile
     */
    getProfile: async (): Promise<UserProfileResponse> => {
        const response = await api.get<UserProfileResponse>(userEndpoints.profile.me);
        return response.data;
    },

    /**
     * Update user profile information
     */
    updateProfile: async (data: UpdateProfileRequest): Promise<UpdateProfileResponse> => {
        const response = await api.patch<UpdateProfileResponse>(userEndpoints.profile.update, data);
        return response.data;
    },

    /**
     * Change user password
     */
    changePassword: async (data: ChangePasswordRequest): Promise<ChangePasswordResponse> => {
        const response = await api.patch<ChangePasswordResponse>(userEndpoints.profile.changePassword, data);
        return response.data;
    }
};



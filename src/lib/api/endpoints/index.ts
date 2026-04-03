import { adminEndpoints } from './admin';
import { publicEndpoints as basePublicEndpoints } from './public';
import { userEndpoints } from './user';

/**
 * Re-exporting for compatibility and ease of use
 */
export { adminEndpoints, userEndpoints };

// Maintain the original publicEndpoints structure for backward compatibility
export const publicEndpoints = {
    ...basePublicEndpoints,
    auth: userEndpoints.auth,
    users: {
        me: userEndpoints.profile.me,
        updateProfile: userEndpoints.profile.update,
        changePassword: userEndpoints.profile.changePassword,
    }
} as const;

export type AdminEndpoints = typeof adminEndpoints;
export type PublicEndpoints = typeof publicEndpoints;
export type UserEndpoints = typeof userEndpoints;



import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
    roles?: string[];
    [key: string]: any;
}

export const authService = {
    setToken(token: string): void {
        localStorage.setItem('accessToken', token);
    },

    getToken(): string | null {
        return localStorage.getItem('accessToken');
    },

    removeToken(): void {
        localStorage.removeItem('accessToken');
    },

    getRolesFromToken(token: string): string[] {
        try {
            const decoded: DecodedToken = jwtDecode(token);
            return decoded.roles || [];
        } catch (error) {
            console.error('Failed to decode JWT token:', error);
            return [];
        }
    },

    getRedirectPath(roles: string[]): string | null {
        if (roles.includes('ROLE_ADMIN')) return '/admin';
        if (roles.includes('ROLE_USER')) return '/user';
        return null;
    }
};

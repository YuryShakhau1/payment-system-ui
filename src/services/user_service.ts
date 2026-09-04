import {apiClient} from "./api_client";
import {User} from "../pages/users/UserTable.tsx";

export const userService = {

    fetchUser: async (isAdmin: boolean, userId: string | null): Promise<User> => {
        const url = isAdmin ? `/users/${userId}` : '/users/me';
        let userRes = await apiClient.get<User>(url);
        return userRes.data;
    }
}
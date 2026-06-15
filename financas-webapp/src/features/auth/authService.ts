import api from "../../services/api";

export interface AuthResponse {
    id: number;
    token: string;
    username: string;
    name: string;
}

const authService = {
    register(username: string, password: string, name: string) {
        return api.post<AuthResponse, { username: string; password: string; name: string }>(
            '/auth/register', { username, password, name }
        );
    },
    
    login(username: string, password: string) {
        return api.post<AuthResponse, { username: string; password: string }>(
            '/auth/login', { username, password }
        );
    },
};

export default authService;
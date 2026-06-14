import api from "../../services/api";

export interface AuthResponse {
    id: number;
    token: string;
    username: string;
    name: string;
}

const authService = {
    login(username: string, password: string) {
        return api.post<AuthResponse, { username: string; password: string }>(
            '/auth/login', { username, password }
        );
    },
    
    register(username: string, password: string, name: string) {
        return api.post<AuthResponse, { username: string; password: string; name: string }>(
            '/auth/register', { username, password, name }
        );
    },
};

export default authService;
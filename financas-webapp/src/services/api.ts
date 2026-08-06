const BASE_URL = 'http://localhost:8080';

interface RequestOptions {
    method?: string;
    headers?: Record<string, string>;
    body?: string;
}

const api = {
    async request<T>(
        endpoint: string,
        options: RequestOptions = {},
        token?: string
    ): Promise<T> {
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        };

        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        const response = await fetch(`${BASE_URL}${endpoint}`, {
            ...options,
            headers,
        });

        const raw = await response.text();
        const data = raw ? JSON.parse(raw) : null;

        if (!response.ok) {
            throw new Error(data?.message || 'API request failed');
        }

        return data as T;
    },

    get<T>(endpoint: string, token?: string): Promise<T> {
        return this.request<T>(
            endpoint,
            { method: 'GET' },
            token
        );
    },

    post<T, B>(
        endpoint: string,
        body: B,
        token?: string
    ): Promise<T> {
        return this.request<T>(
            endpoint,
            {
                method: 'POST',
                body: JSON.stringify(body)
            },
            token
        );
    },

    delete<T>(endpoint: string, token?: string): Promise<T> {
        return this.request<T>(
            endpoint,
            { method: 'DELETE' },
            token
        );
    },
}

export default api;
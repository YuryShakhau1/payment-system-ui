import axios from 'axios';

export const apiClient = axios.create({
    baseURL: 'http://localhost:8100',
    // baseURL: 'http://api.payment-system.local',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

apiClient.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('accessToken');

        if (accessToken) {
            config.headers.set('Authorization', `Bearer ${accessToken}`);
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (originalRequest.url === '/auth/login' || originalRequest.url === '/auth/users/change-password') {
            return Promise.reject(error);
        }

        if (
            error.response &&
            error.response.status === 401 &&
            !originalRequest._retry &&
            localStorage.getItem('accessToken')
        ) {
            if (originalRequest.url === '/auth/token/refresh') {
                return Promise.reject(error);
            }

            originalRequest._retry = true;

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({resolve, reject});
                })
                    .then((token) => {
                        originalRequest.headers.set('Authorization', `Bearer ${token}`);
                        return apiClient(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            isRefreshing = true;
            try {
                const response = await apiClient.post('/auth/token/refresh');

                const {accessToken} = response.data;
                localStorage.setItem('accessToken', accessToken);
                originalRequest.headers.set('Authorization', `Bearer ${accessToken}`);
                processQueue(null, accessToken);
                return apiClient(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);

                localStorage.removeItem('accessToken');
                window.location.href = '/login';

                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

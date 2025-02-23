import axios from '../utils/axiosConfig';

export const authService = {
    login: async (username, password) => {
        const response = await axios.post('/auth/login', { username, password });
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        return response.data;
    },

    register: async (userData) => {
        return await axios.post('/auth/register', userData);
    },

    logout: async () => {
        try {
            await axios.post('/auth/logout');
        } finally {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        }
    },

    validateToken: async () => {
        try {
            const response = await axios.get('/auth/validate');
            return response.data;
        } catch {
            return null;
        }
    }
};
import axios from 'axios';
import type { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: API_BASE_URL,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Add auth token to requests
        this.client.interceptors.request.use((config) => {
            const token = localStorage.getItem('auth_token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });

        // Handle errors
        this.client.interceptors.response.use(
            (response) => response,
            (error: AxiosError) => {
                if (error.response?.status === 401) {
                    // Token expired or invalid
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('currentUser_v1');
                    window.location.href = '/login';
                }
                return Promise.reject(error);
            }
        );
    }

    // Auth endpoints
    async signup(name: string, email: string, password: string) {
        const response = await this.client.post('/auth/signup', { name, email, password });
        if (response.data.token) {
            localStorage.setItem('auth_token', response.data.token);
        }
        return response.data;
    }

    async login(email: string, password: string) {
        const response = await this.client.post('/auth/login', { email, password });
        if (response.data.token) {
            localStorage.setItem('auth_token', response.data.token);
        }
        return response.data;
    }

    async logout() {
        await this.client.post('/auth/logout');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('currentUser_v1');
    }

    async getCurrentUser() {
        const response = await this.client.get('/auth/me');
        return response.data;
    }

    // User endpoints
    async getAllUsers() {
        const response = await this.client.get('/users');
        return response.data;
    }

    async getUserById(id: string) {
        const response = await this.client.get(`/users/${id}`);
        return response.data;
    }

    async updateProfile(id: string, data: any) {
        const response = await this.client.put(`/users/${id}`, data);
        return response.data;
    }

    async completeOnboarding(id: string, data: any) {
        const response = await this.client.post(`/users/${id}/complete-onboarding`, data);
        return response.data;
    }

    // Project endpoints
    async getAllProjects() {
        const response = await this.client.get('/users/projects/all');
        return response.data;
    }

    async getProjectById(id: string) {
        const response = await this.client.get(`/users/projects/${id}`);
        return response.data;
    }

    // Admin endpoints
    async getPendingUsers() {
        const response = await this.client.get('/admin/pending-users');
        return response.data;
    }

    async approveUser(id: string) {
        const response = await this.client.post(`/admin/approve/${id}`);
        return response.data;
    }

    async rejectUser(id: string) {
        const response = await this.client.post(`/admin/reject/${id}`);
        return response.data;
    }

    // Upload endpoints
    async uploadProfileImage(file: File) {
        const formData = new FormData();
        formData.append('image', file);
        const response = await this.client.post('/upload/profile-image', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data.url;
    }

    async uploadBannerImage(file: File) {
        const formData = new FormData();
        formData.append('image', file);
        const response = await this.client.post('/upload/banner-image', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data.url;
    }

    async uploadProjectImage(file: File) {
        const formData = new FormData();
        formData.append('image', file);
        const response = await this.client.post('/upload/project-image', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data.url;
    }
}

export default new ApiService();

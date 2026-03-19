// src/services/api.ts
import axios from 'axios';
import type { AuthResponse, UploadResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Add auth token interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const uploadFile = async (
  file: File,
  onUploadProgress?: (percent: number) => void
): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('video', file);
  // Include user metadata if logged in
  const userStr = localStorage.getItem('user');
  if (userStr) {
    const user = JSON.parse(userStr);
    formData.append('metadata', JSON.stringify({ userId: user.id, appId: 'web' }));
  }

  const response = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      if (onUploadProgress && progressEvent.total) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onUploadProgress(percent);
      }
    },
  });
  return response.data;
};

export const startTranscoding = async (
  videoId: string,
  targetFormat: string,
  quality: string
): Promise<{ job_id: string }> => {
  const response = await api.post(`/videos/${videoId}/transcode`, {
    target_format: targetFormat,
    quality: quality,
  });
  return response.data;
};

export const getJobStatus = async (jobId: string): Promise<unknown> => {
  const response = await api.get(`/jobs/${jobId}`);
  return response.data;
};

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const register = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await api.post('/auth/register', { email, password });
  return response.data;
};

export default api;
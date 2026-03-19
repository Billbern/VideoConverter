// src/types/index.ts
export interface User {
  id: string;
  email: string;
  username?: string;
  tier: 'free' | 'pro' | 'enterprise';
  storageLimit: number; // bytes
}

export interface Video {
  id: string;
  originalFilename: string;
  fileSize: number;
  uploadStatus: 'pending' | 'uploading' | 'uploaded' | 'failed';
  createdAt: string;
}

export interface TranscodingJob {
  id: string;
  videoId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  targetFormat: string;
  quality: string;
  progress?: number; // 0-100
  outputUrl?: string;
  errorMessage?: string;
}

export interface UploadResponse {
  task_id: string;
  status: string;
  message: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}
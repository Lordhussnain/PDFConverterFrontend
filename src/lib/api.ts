// src/lib/api.ts
import type { UploadSessionRequest, UploadSessionResponse, CreateJobRequest, CreateJobResponse, JobStatusResponse, DownloadResponse, User } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:3000/api/v1';
const AUTH_API_BASE_URL = import.meta.env.VITE_AUTH_API_URL || 'http://127.0.0.1:3001/api/v1/auth';

const handleApiResponse = async (response: Response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'An unknown error occurred');
  }
  return data;
};

export const api = {
  createUploadSession: async (data: UploadSessionRequest): Promise<UploadSessionResponse> => {
    const response = await fetch(`${API_BASE_URL}/uploads/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleApiResponse(response);
  },

  uploadFileToS3: async (uploadUrl: string, file: File): Promise<void> => {
    const response = await fetch(uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': file.type },
      body: file,
    });
    if (!response.ok) {
      throw new Error(`Failed to upload file to S3: ${response.statusText}`);
    }
  },

  completeUploadSession: async (sessionId: string): Promise<{ sessionId: string }> => {
    const response = await fetch(`${API_BASE_URL}/uploads/sessions/${sessionId}/complete`, { method: 'PUT' });
    return handleApiResponse(response);
  },

  createJob: async (data: CreateJobRequest): Promise<CreateJobResponse> => {
    const response = await fetch(`${API_BASE_URL}/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleApiResponse(response);
  },

  getJobStatus: async (jobId: string): Promise<JobStatusResponse> => {
    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`);
    return handleApiResponse(response);
  },

  getDownloadUrl: async (jobId: string, resultId: string): Promise<DownloadResponse> => {
    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/results/${resultId}/download`);
    return handleApiResponse(response);
  },
};

export const authApi = {
  signup: async (credentials: any) => {
    const response = await fetch(`${AUTH_API_BASE_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return handleApiResponse(response);
  },

  login: async (credentials: any) => {
    const response = await fetch(`${AUTH_API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return handleApiResponse(response);
  },

  logout: async () => {
    const response = await fetch(`${AUTH_API_BASE_URL}/logout`, { method: 'POST' });
    return handleApiResponse(response);
  },

  checkAuth: async (): Promise<{ success: boolean; user: User }> => {
    const response = await fetch(`${AUTH_API_BASE_URL}/check-auth`, {
      method: 'GET',
    });
    return handleApiResponse(response);
  },

  verifyEmail: async (data: { code: string }) => {
    const response = await fetch(`${AUTH_API_BASE_URL}/verify-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleApiResponse(response);
  },

  resendVerificationCode: async (data: { email: string }) => {
    const response = await fetch(`${AUTH_API_BASE_URL}/resend-verification-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleApiResponse(response);
  },

  forgotPassword: async (data: { email: string }) => {
    const response = await fetch(`${AUTH_API_BASE_URL}/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleApiResponse(response);
  },

  resetPassword: async (data: { token: string; password: any }) => {
    const response = await fetch(`${AUTH_API_BASE_URL}/reset-password/${data.token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: data.password }),
    });
    return handleApiResponse(response);
  },
};
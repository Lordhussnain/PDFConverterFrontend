// src/lib/api.ts
import axios, { type AxiosInstance } from 'axios';
import type { UploadSessionRequest, UploadSessionResponse, CreateJobRequest, CreateJobResponse, JobStatusResponse, DownloadResponse, User } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:3001api/v1';
const AUTH_API_BASE_URL = import.meta.env.VITE_AUTH_API_URL || 'http://127.0.0.1:3001/api/v1/auth';

// 1. Create Axios instances
const apiInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Crucial for sending cookies (session/auth)
});

const authApiInstance: AxiosInstance = axios.create({
  baseURL: AUTH_API_BASE_URL,
  withCredentials: true, // Crucial for receiving and sending cookies
});

// 2. Helper to handle Axios responses and errors
const handleAxiosResponse = (response: any) => {
  return response.data;
};

const handleAxiosError = (error: any) => {
  const message = error.response?.data?.message || error.message || 'An unknown error occurred';
  throw new Error(message);
};

export const api = {
  createUploadSession: async (data: UploadSessionRequest): Promise<UploadSessionResponse> => {
    try {
      const response = await apiInstance.post('/uploads/sessions', data);
      return handleAxiosResponse(response);
    } catch (error) {
      throw handleAxiosError(error);
    }
  },

  // Note: Direct S3 upload (PUT) usually requires standard fetch or a dedicated S3 client, 
  // as it bypasses our backend API. We will keep the original fetch implementation for S3 upload 
  // as it's a direct file transfer to a pre-signed URL, which is typically simpler with native Fetch/PUT.
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
    try {
      const response = await apiInstance.put(`/uploads/sessions/${sessionId}/complete`);
      return handleAxiosResponse(response);
    } catch (error) {
      throw handleAxiosError(error);
    }
  },

  createJob: async (data: CreateJobRequest): Promise<CreateJobResponse> => {
    try {
      const response = await apiInstance.post('/jobs', data);
      return handleAxiosResponse(response);
    } catch (error) {
      throw handleAxiosError(error);
    }
  },

  getJobStatus: async (jobId: string): Promise<JobStatusResponse> => {
    try {
      const response = await apiInstance.get(`/jobs/${jobId}`);
      return handleAxiosResponse(response);
    } catch (error) {
      throw handleAxiosError(error);
    }
  },

  getDownloadUrl: async (jobId: string, resultId: string): Promise<DownloadResponse> => {
    try {
      const response = await apiInstance.get(`/jobs/${jobId}/results/${resultId}/download`);
      return handleAxiosResponse(response);
    } catch (error) {
      throw handleAxiosError(error);
    }
  },
};

export const authApi = {
  signup: async (credentials: any) => {
    try {
      const response = await authApiInstance.post('/signup', credentials);
      return handleAxiosResponse(response);
    } catch (error) {
      throw handleAxiosError(error);
    }
  },

  login: async (credentials: any) => {
    try {
      const response = await authApiInstance.post('/login', credentials);
      return handleAxiosResponse(response);
    } catch (error) {
      throw handleAxiosError(error);
    }
  },

  logout: async () => {
    try {
      const response = await authApiInstance.post('/logout');
      return handleAxiosResponse(response);
    } catch (error) {
      throw handleAxiosError(error);
    }
  },

  checkAuth: async (): Promise<{ success: boolean; user: User }> => {
    try {
      const response = await authApiInstance.get('/check-auth');
      return handleAxiosResponse(response);
    } catch (error) {
      throw handleAxiosError(error);
    }
  },

  verifyEmail: async (data: { code: string }) => {
    try {
      const response = await authApiInstance.post('/verify-email', data);
      return handleAxiosResponse(response);
    } catch (error) {
      throw handleAxiosError(error);
    }
  },

  resendVerificationCode: async (data: { email: string }) => {
    try {
      const response = await authApiInstance.post('/resend-verification-code', data);
      return handleAxiosResponse(response);
    } catch (error) {
      throw handleAxiosError(error);
    }
  },

  forgotPassword: async (data: { email: string }) => {
    try {
      const response = await authApiInstance.post('/forgot-password', data);
      return handleAxiosResponse(response);
    } catch (error) {
      throw handleAxiosError(error);
    }
  },

  resetPassword: async (data: { token: string; password: any }) => {
    try {
      const response = await authApiInstance.post(`/reset-password/${data.token}`, { password: data.password });
      return handleAxiosResponse(response);
    } catch (error) {
      throw handleAxiosError(error);
    }
  },
};
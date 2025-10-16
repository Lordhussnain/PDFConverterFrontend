// src/lib/api.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:3000/api/v1';

import type { UploadSessionRequest, UploadSessionResponse, CreateJobRequest, CreateJobResponse, JobStatusResponse, DownloadResponse } from '@/types';

const handleApiResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(errorData.error || 'An unknown error occurred');
  }
  return response.json();
};

export const api = {
  createUploadSession: async (data: UploadSessionRequest): Promise<UploadSessionResponse> => {
    const response = await fetch(`${API_BASE_URL}/uploads/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleApiResponse(response);
  },

  uploadFileToS3: async (uploadUrl: string, file: File): Promise<void> => {
    const response = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
      },
      body: file,
    });
    if (!response.ok) {
      throw new Error(`Failed to upload file to S3: ${response.statusText}`);
    }
  },

  completeUploadSession: async (sessionId: string): Promise<{ sessionId: string }> => {
    const response = await fetch(`${API_BASE_URL}/uploads/sessions/${sessionId}/complete`, {
      method: 'PUT',
    });
    return handleApiResponse(response);
  },

  createJob: async (data: CreateJobRequest): Promise<CreateJobResponse> => {
    const response = await fetch(`${API_BASE_URL}/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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
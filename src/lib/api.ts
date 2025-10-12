const API_BASE_URL = '/api/v1'; // Adjust if your API is hosted elsewhere

interface UploadSessionRequest {
  filename: string;
  size?: number;
}

interface UploadSessionResponse {
  sessionId: string;
  key: string; // S3 object key
  uploadUrl: string; // Pre-signed URL for direct S3 PUT upload (ASSUMPTION: your backend provides this)
}

interface CreateJobRequest {
  sessionId: string;
  outputs?: Array<{ format: string }>;
}

interface CreateJobResponse {
  jobId: string;
  location: string;
}

interface JobResult {
  outputUrl: string;
  format: string;
  size: number;
}

interface JobStatusResponse {
  jobId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled';
  outputs: string; // JSON string of requested output formats
  results: JobResult[];
  logs: any[]; // Adjust type as needed
  createdAt: string;
  startedAt: string | null;
  finishedAt: string | null;
}

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
};
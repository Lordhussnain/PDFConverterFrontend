export type FileStatus = "pending" | "uploading" | "processing" | "completed" | "failed" | "cancelled" | "pending-upload-session" | "queued";

export interface ConversionOptions {
  pageRange?: string;
  ocr?: boolean;
  quality?: number; // 1-100
  targetFormat: string;
}

export interface QueueItem {
  id: string;
  file: File;
  status: FileStatus;
  progress: number; // 0-100
  options: ConversionOptions;
  sessionId?: string; // New: Backend upload session ID
  s3Key?: string; // New: S3 object key from backend
  uploadUrl?: string; // New: Pre-signed S3 upload URL (ASSUMPTION)
  jobId?: string; // New: Backend job ID
  result?: {
    url: string;
    size: number;
    format?: string; // Added format to result
  };
}

// New API Response Types
export interface UploadSessionResponse {
  sessionId: string;
  key: string; // S3 object key
  uploadUrl: string; // Pre-signed URL for direct S3 PUT upload (ASSUMPTION)
}

export interface CreateJobResponse {
  jobId: string;
  location: string;
}

export interface JobResultItem {
  outputUrl: string;
  format: string;
  size: number;
}

export interface JobStatusResponse {
  jobId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled';
  outputs: string; // JSON string of requested output formats
  results: JobResultItem[];
  logs: any[];
  createdAt: string;
  startedAt: string | null;
  finishedAt: string | null;
}
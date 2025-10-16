export interface User {
  _id: string;
  userName: string;
  email: string;
  phoneNumber: string;
  isVerified: boolean;
}

export type FileStatus = "pending" | "uploading" | "processing" | "completed" | "failed" | "cancelled" | "pending-upload-session" | "queued";

export interface ConversionOptions {
  pageRange?: string;
  ocr?: boolean;
  quality?: number; // 1-100
  targetFormat: string;
}

// Frontend-specific result structure for QueueItem
export interface ConversionResult {
  url: string; // Full download URL
  size?: number; // Made optional as backend example doesn't provide it
  format?: string;
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
  result?: ConversionResult; // Uses the frontend-specific result
}

// New API Request Types
export interface UploadSessionRequest {
  filename: string;
  size: number;
}

export interface CreateJobRequest {
  sessionId: string;
  outputs: Array<{ format: string }>;
}

// New API Response Types (matching backend structure)
export interface UploadSessionResponse {
  sessionId: string;
  key: string; // S3 object key
  uploadUrl: string; // Pre-signed URL for direct S3 PUT upload (ASSUMPTION)
}

export interface CreateJobResponse {
  jobId: string;
  location: string;
}

// Backend's raw job result item
export interface BackendJobResult {
  id: string;
  jobId: string;
  outputKey: string; // S3 object key, e.g., "conversions/jobId/output.docx"
  format: string; // Extracted from outputKey, e.g., "docx", "png", "txt"
  meta: any | null; // Optional metadata (JSON-like, could be object or null)
  createdAt: string; // ISO date string
  // size is missing from backend example, so we won't include it here.
}

// Backend's raw job log item
export interface JobLog {
  id: string;
  jobId: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  createdAt: string;
}

// Backend's raw job status response
export interface JobStatusResponse {
  jobId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled';
  outputs: string; // JSON string, e.g., '[{"format":"docx"}]'; parse with JSON.parse() to get array<{ format: string }>
  results: BackendJobResult[]; // Use the backend's raw result type
  logs: JobLog[]; // Use the backend's raw log type
  createdAt: string;
  startedAt: string | null;
  finishedAt: string | null;
}

// Frontend-specific job result item with download URL
export interface JobResultItem extends BackendJobResult {
  outputUrl: string; // Full download URL (constructed from outputKey)
  size?: number; // Optional size in bytes
}

// New download response type
export interface DownloadResponse {
  downloadUrl: string;
}
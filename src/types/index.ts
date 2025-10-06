export type FileStatus = "pending" | "uploading" | "processing" | "completed" | "failed" | "cancelled";

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
  result?: {
    url: string;
    size: number;
  };
}
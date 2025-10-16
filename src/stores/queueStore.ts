import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { arrayMove } from '@dnd-kit/sortable';
import type { QueueItem, FileStatus, ConversionOptions, UploadSessionResponse, CreateJobResponse } from '@/types';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface QueueState {
  files: QueueItem[];
  addFiles: (files: File[]) => Promise<void>;
  removeFile: (id: string) => void;
  reorderFiles: (activeId: string, overId: string) => void;
  updateFileFormat: (id: string, format: string) => void;
  updateFileOptions: (id: string, options: Partial<ConversionOptions>) => void;
  clearQueue: () => void;
  startConversion: (fileIds: string[]) => Promise<string | undefined>;
  updateFileProgress: (id: string, progress: number) => void;
  updateFileStatus: (id: string, status: FileStatus) => void;
  setConversionResult: (id: string, result: { url: string;  format?: string }) => void;
  retryConversion: (id: string) => Promise<void>;
}

const useQueueStore = create<QueueState>((set, get) => ({
  files: [],
  addFiles: async (newFiles) => {
    const initialNewQueueItems: QueueItem[] = newFiles
      .filter(file => file.type === 'application/pdf')
      .map(file => ({
        id: uuidv4(),
        file,
        status: 'pending-upload-session',
        progress: 0,
        options: {
          targetFormat: 'DOCX',
          ocr: false,
          quality: 80,
          pageRange: '',
        },
      }));

    // Add all new items to the queue immediately with their initial status
    set((state) => {
      const existingPendingFiles = state.files.filter(f => f.status === 'pending' || f.status === 'pending-upload-session');
      return { files: [...existingPendingFiles, ...initialNewQueueItems] };
    });

    // Process each new item asynchronously to create upload sessions
    for (const item of initialNewQueueItems) {
      try {
        const session: UploadSessionResponse = await api.createUploadSession({
          filename: item.file.name,
          size: item.file.size,
        });
        set((state) => ({
          files: state.files.map((f) =>
            f.id === item.id
              ? { ...f, sessionId: session.sessionId, s3Key: session.key, uploadUrl: session.uploadUrl, status: 'pending' }
              : f
          ),
        }));
      } catch (error: any) {
        toast.error(`Failed to create upload session for ${item.file.name}.`, {
          description: error.message,
        });
        set((state) => ({
          files: state.files.map((f) =>
            f.id === item.id ? { ...f, status: 'failed' } : f
          ),
        }));
      }
    }
  },
  removeFile: (id) => set((state) => ({
    files: state.files.filter(file => file.id !== id),
  })),
  reorderFiles: (activeId, overId) => set(state => {
    const oldIndex = state.files.findIndex(f => f.id === activeId);
    const newIndex = state.files.findIndex(f => f.id === overId);
    if (oldIndex === -1 || newIndex === -1) return state;
    return { files: arrayMove(state.files, oldIndex, newIndex) };
  }),
  updateFileFormat: (id, format) => set(state => ({
    files: state.files.map(file => 
      file.id === id 
        ? { ...file, options: { ...file.options, targetFormat: format } } 
        : file
    ),
  })),
  updateFileOptions: (id, newOptions) => set(state => ({
    files: state.files.map(file =>
      file.id === id
        ? { ...file, options: { ...file.options, ...newOptions } }
        : file
    ),
  })),
  clearQueue: () => set(state => ({ 
    files: state.files.filter(f => f.status !== 'pending' && f.status !== 'pending-upload-session') 
  })),
  startConversion: async (fileIds) => {
    const filesToConvert = get().files.filter(f => fileIds.includes(f.id) && f.status === 'pending');
    if (filesToConvert.length === 0) {
      toast.error("No files ready for conversion.");
      return;
    }

    const jobPromises = filesToConvert.map(async (file) => {
      if (!file.sessionId || !file.uploadUrl) {
        toast.error(`Missing session details for ${file.file.name}. Please re-add the file.`);
        set((state) => ({
          files: state.files.map((f) =>
            f.id === file.id ? { ...f, status: 'failed' } : f
          ),
        }));
        return null;
      }

      try {
        // 1. Upload file to S3
        set((state) => ({
          files: state.files.map((f) =>
            f.id === file.id ? { ...f, status: 'uploading', progress: 0 } : f
          ),
        }));
        toast.loading(`Uploading ${file.file.name}...`, { id: file.id });
        await api.uploadFileToS3(file.uploadUrl, file.file);
        toast.success(`Uploaded ${file.file.name}.`, { id: file.id });

        // 2. Complete upload session
        await api.completeUploadSession(file.sessionId);

        // 3. Create conversion job
        const job: CreateJobResponse = await api.createJob({
          sessionId: file.sessionId,
          outputs: [{ format: file.options.targetFormat }],
        });

        set((state) => ({
          files: state.files.map((f) =>
            f.id === file.id ? { ...f, jobId: job.jobId, status: 'queued', progress: 0 } : f
          ),
        }));
        return job.jobId;
      } catch (error: any) {
        toast.error(`Conversion failed for ${file.file.name}.`, {
          description: error.message,
          id: file.id,
        });
        set((state) => ({
          files: state.files.map((f) =>
            f.id === file.id ? { ...f, status: 'failed' } : f
          ),
        }));
        return null;
      }
    });

    const jobIds = (await Promise.all(jobPromises)).filter(Boolean) as string[];
    // For simplicity, we'll return the first job ID if multiple files are converted.
    // In a real app, you might want to track multiple jobs or a single "batch job".
    return jobIds.length > 0 ? jobIds[0] : undefined;
  },
  updateFileProgress: (id, progress) => set(state => ({
    files: state.files.map(file => 
      file.id === id ? { ...file, progress } : file
    ),
  })),
  updateFileStatus: (id, status) => set(state => ({
    files: state.files.map(file => 
      file.id === id ? { ...file, status, progress: status === 'completed' ? 100 : file.progress } : file
    ),
  })),
  setConversionResult: (id, result) => set(state => ({
    files: state.files.map(file =>
      file.id === id ? { ...file, result, status: 'completed', progress: 100 } : file
    ),
  })),
  retryConversion: async (id) => {
    const fileToRetry = get().files.find(f => f.id === id);
    if (!fileToRetry) return;

    // Reset status and clear previous job/session info for a fresh start
    set((state) => ({
      files: state.files.map((f) =>
        f.id === id
          ? { ...f, status: 'pending-upload-session', progress: 0, result: undefined, sessionId: undefined, s3Key: undefined, uploadUrl: undefined, jobId: undefined }
          : f
      ),
    }));

    try {
      // Re-create upload session
      const session: UploadSessionResponse = await api.createUploadSession({
        filename: fileToRetry.file.name,
        size: fileToRetry.file.size,
      });
      set((state) => ({
        files: state.files.map((f) =>
          f.id === id
            ? { ...f, sessionId: session.sessionId, s3Key: session.key, uploadUrl: session.uploadUrl, status: 'pending' }
            : f
        ),
      }));
      toast.info(`Retrying conversion for ${fileToRetry.file.name}.`);
    } catch (error: any) {
      toast.error(`Failed to retry conversion for ${fileToRetry.file.name}.`, {
        description: error.message,
      });
      set((state) => ({
        files: state.files.map((f) =>
          f.id === id ? { ...f, status: 'failed' } : f
        ),
      }));
    }
  },
}));

export default useQueueStore;
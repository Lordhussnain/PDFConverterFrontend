import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { arrayMove } from '@dnd-kit/sortable';
import { QueueItem, FileStatus, ConversionOptions } from '@/types';

interface QueueState {
  files: QueueItem[];
  addFiles: (files: File[]) => void;
  removeFile: (id: string) => void;
  reorderFiles: (activeId: string, overId: string) => void;
  updateFileFormat: (id: string, format: string) => void;
  updateFileOptions: (id: string, options: Partial<ConversionOptions>) => void;
  clearQueue: () => void;
  startConversion: (fileIds: string[]) => string;
  updateFileProgress: (id: string, progress: number) => void;
  updateFileStatus: (id: string, status: FileStatus) => void;
  setConversionResult: (id: string, result: { url: string; size: number }) => void;
  retryConversion: (id: string) => void;
}

const useQueueStore = create<QueueState>((set) => ({
  files: [],
  addFiles: (newFiles) => set((state) => {
    const newQueueItems: QueueItem[] = newFiles
      .filter(file => file.type === 'application/pdf')
      .map(file => ({
        id: uuidv4(),
        file,
        status: 'pending',
        progress: 0,
        options: {
          targetFormat: 'DOCX',
          ocr: false,
          quality: 80,
          pageRange: '',
        },
      }));
    // We only keep files that are pending, so the queue is cleared on new uploads
    const pendingFiles = state.files.filter(f => f.status === 'pending');
    return { files: [...pendingFiles, ...newQueueItems] };
  }),
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
    files: state.files.filter(f => f.status !== 'pending') 
  })),
  startConversion: (fileIds) => {
    const jobId = uuidv4();
    set(state => ({
      files: state.files.map(file => 
        fileIds.includes(file.id)
          ? { ...file, status: 'uploading', jobId: jobId }
          : file
      )
    }));
    return jobId;
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
  retryConversion: (id) => set(state => ({
    files: state.files.map(file =>
      file.id === id
        ? { ...file, status: 'uploading', progress: 0, result: undefined }
        : file
    ),
  })),
}));

export default useQueueStore;
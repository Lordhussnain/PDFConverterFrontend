import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { QueueItem } from '@/types';

interface QueueState {
  files: QueueItem[];
  addFiles: (files: File[]) => void;
  removeFile: (id: string) => void;
  updateFileFormat: (id: string, format: string) => void;
  clearQueue: () => void;
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
          targetFormat: 'DOCX', // Default format
        },
      }));
    return { files: [...state.files, ...newQueueItems] };
  }),
  removeFile: (id) => set((state) => ({
    files: state.files.filter(file => file.id !== id),
  })),
  updateFileFormat: (id, format) => set(state => ({
    files: state.files.map(file => 
      file.id === id 
        ? { ...file, options: { ...file.options, targetFormat: format } } 
        : file
    ),
  })),
  clearQueue: () => set({ files: [] }),
}));

export default useQueueStore;
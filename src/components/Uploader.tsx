import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import useQueueStore from '@/stores/queueStore';
import { UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Uploader = () => {
  const addFiles = useQueueStore((state) => state.addFiles);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    addFiles(acceptedFiles);
  }, [addFiles]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    noClick: true,
    noKeyboard: true,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer ${
        isDragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
      }`}
    >
      <input {...getInputProps()} />
      <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
      <p className="mt-4 text-lg font-semibold">
        Drop PDFs here or choose files
      </p>
      <p className="text-muted-foreground mt-1">
        Convert to DOCX, PPTX, JPG, TXT & more.
      </p>
      <Button onClick={open} className="mt-6">
        Choose PDFs
      </Button>
    </div>
  );
};

export default Uploader;
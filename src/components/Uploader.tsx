import { useCallback } from 'react';
import { useDropzone, type FileRejection, type DropzoneRootProps } from 'react-dropzone';
import useQueueStore from '@/stores/queueStore';
import { UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { toast } from "sonner";
import React from 'react'; // Import React for React.HTMLAttributes

// Define a type that combines HTMLMotionProps with DropzoneRootProps
interface MotionDropzoneRootProps extends HTMLMotionProps<'div'>, DropzoneRootProps {}

const Uploader = () => {
  const addFiles = useQueueStore((state) => state.addFiles);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    addFiles(acceptedFiles);
  }, [addFiles]);

  const onDropRejected = useCallback((fileRejections: FileRejection[]) => {
    fileRejections.forEach(({ file, errors }) => {
      toast.error(`${file.name} was rejected.`, {
        description: errors.map(e => e.message).join(', '),
      });
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    onDropRejected,
    accept: { 'application/pdf': ['.pdf'] },
    noClick: true,
    noKeyboard: true,
  });

  return (
    <motion.div
      {...(getRootProps() as MotionDropzoneRootProps)}
      className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer ${
        isDragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
      }`}
      animate={{ scale: isDragActive ? 1.02 : 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <input {...getInputProps()} />
      <motion.div
        className="flex flex-col items-center"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
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
      </motion.div>
    </motion.div>
  );
};

export default Uploader;
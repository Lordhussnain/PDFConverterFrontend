import { useCallback } from 'react';
import { useDropzone, type FileRejection } from 'react-dropzone';
import useQueueStore from '@/stores/queueStore';
import { UploadCloud, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { toast } from "sonner";
import useAuthStore from '@/stores/authStore';

// Frontend limits (Backend must enforce these securely)
const GUEST_FILE_LIMIT = 3;
const AUTHED_FILE_LIMIT = 10;

const Uploader = () => {
  const addFiles = useQueueStore((state) => state.addFiles);
  const allFiles = useQueueStore((state) => state.files);
  const { isAuthenticated, isLoading: isAuthLoading } = useAuthStore();
  
  const currentFileCount = allFiles.length;
  
  const maxFiles = isAuthenticated ? AUTHED_FILE_LIMIT : GUEST_FILE_LIMIT;
  const isLimitReached = currentFileCount >= maxFiles;

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const filesToAdd = acceptedFiles.slice(0, maxFiles - currentFileCount);
    
    if (filesToAdd.length < acceptedFiles.length) {
      toast.warning(`Only ${maxFiles - currentFileCount} more file(s) can be added.`, {
        description: `The remaining ${acceptedFiles.length - filesToAdd.length} file(s) were ignored.`,
      });
    }

    if (filesToAdd.length > 0) {
      addFiles(filesToAdd);
    }
  }, [addFiles, currentFileCount, maxFiles]);

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
    disabled: isLimitReached || isAuthLoading,
  });

  const limitMessage = isAuthenticated
    ? `You have reached the daily limit of ${AUTHED_FILE_LIMIT} files. Upgrade to Pro for unlimited conversions.`
    : `Sign up to convert more than ${GUEST_FILE_LIMIT} files.`;

  return (
    <motion.div
      // Cast to any to resolve onDrag type conflict
      {...(getRootProps() as any)}
      className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
        isLimitReached
          ? 'border-destructive/50 bg-destructive/5'
          : isDragActive
          ? 'border-primary bg-primary/10'
          : 'border-border hover:border-primary/50 cursor-pointer'
      }`}
      animate={{ scale: isDragActive && !isLimitReached ? 1.02 : 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <input {...getInputProps()} />
      <motion.div
        className="flex flex-col items-center"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        {isLimitReached ? (
          <>
            <Lock className="mx-auto h-12 w-12 text-destructive" />
            <p className="mt-4 text-lg font-semibold text-destructive">
              Conversion Limit Reached
            </p>
            <p className="text-muted-foreground mt-1 max-w-sm">
              {limitMessage}
            </p>
            {!isAuthenticated && (
              <Button onClick={() => {}} className="mt-6" disabled>
                Sign Up / Log In
              </Button>
            )}
            {isAuthenticated && (
              <Button onClick={() => {}} className="mt-6" disabled>
                View Pricing
              </Button>
            )}
          </>
        ) : (
          <>
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
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Uploader;
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useQueueStore from '@/stores/queueStore';
import ProgressCard from '@/components/ProgressCard';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from "sonner";
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

const JobPage = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const allFiles = useQueueStore((state) => state.files);
  const files = allFiles.filter(f => f.jobId === jobId);
  const { updateFileProgress, updateFileStatus, setConversionResult } = useQueueStore();

  useEffect(() => {
    const simulateProcess = (id: string, fileName: string) => {
      // 1. Simulate Upload
      const uploadInterval = setInterval(() => {
        const currentFile = useQueueStore.getState().files.find(f => f.id === id);
        if (!currentFile || currentFile.progress >= 100) {
          clearInterval(uploadInterval);
          if (currentFile && currentFile.progress >= 100) {
            updateFileStatus(id, 'processing');
            // 2. Simulate Processing
            setTimeout(() => {
              if (Math.random() < 0.1) {
                updateFileStatus(id, 'failed');
                toast.error(`Conversion failed for ${fileName}.`);
              } else {
                setConversionResult(id, { url: '#', size: Math.random() * 1000000 });
                toast.success(`Successfully converted ${fileName}.`);
              }
            }, 2000 + Math.random() * 3000);
          }
          return;
        }
        useQueueStore.getState().updateFileProgress(id, currentFile.progress + 10);
      }, 200);
    };

    files.forEach(file => {
      if (file.status === 'uploading' && file.progress === 0) {
        simulateProcess(file.id, file.file.name);
      }
    });
  }, [jobId, files, updateFileProgress, updateFileStatus, setConversionResult]);

  const completedFiles = files.filter(f => f.status === 'completed');
  const isJobDone = files.every(f => f.status === 'completed' || f.status === 'failed');

  const handleDownloadAll = async () => {
    if (completedFiles.length === 0) return;

    const toastId = toast.loading("Creating your ZIP file...");

    try {
      const zip = new JSZip();

      // Since the conversion is simulated, we'll create dummy files.
      // In a real app, you would fetch the content from item.result.url.
      for (const item of completedFiles) {
        const originalFileName = item.file.name.split('.').slice(0, -1).join('.');
        const newExtension = item.options.targetFormat.toLowerCase();
        const newFileName = `${originalFileName}.${newExtension}`;
        const dummyContent = `This is the converted content for ${item.file.name}.`;
        zip.file(newFileName, dummyContent);
      }

      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `conversion-job-${jobId}.zip`);
      
      toast.success("ZIP file created successfully!", { id: toastId });
    } catch (error) {
      console.error("Failed to create ZIP file", error);
      toast.error("Failed to create ZIP file.", { id: toastId });
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <motion.div
        className="max-w-3xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.h1 variants={itemVariants} className="text-2xl font-bold mb-2">Your Conversion is in Progress</motion.h1>
        <motion.p variants={itemVariants} className="text-muted-foreground mb-6">
          You can safely close this tab. We'll keep converting your files in the background.
        </motion.p>
        <motion.div
          className="space-y-4"
          variants={containerVariants}
        >
          {files.map(item => (
            <motion.div key={item.id} variants={itemVariants}>
              <ProgressCard item={item} />
            </motion.div>
          ))}
        </motion.div>
        {isJobDone && completedFiles.length > 0 && (
          <motion.div
            className="mt-8 flex justify-end"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: files.length * 0.1 + 0.5 }}
          >
            <Button size="lg" onClick={handleDownloadAll}>
              <Download className="mr-2 h-5 w-5" />
              Download All as ZIP ({completedFiles.length})
            </Button>
          </motion.div>
        )}
      </motion.div>
    </main>
  );
};

export default JobPage;
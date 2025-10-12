import { useParams } from 'react-router-dom';
import useQueueStore from '@/stores/queueStore';
import ProgressCard from '@/components/ProgressCard';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from "sonner";
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { useQuery, type Query, type UseQueryOptions } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { JobStatusResponse, JobResultItem } from '@/types';

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
  const filesInJob = allFiles.filter(f => f.jobId === jobId);
  const { updateFileStatus, setConversionResult } = useQueueStore();

  const queryOptions = {
    queryKey: ['jobStatus', jobId as string] as const,
    queryFn: () => api.getJobStatus(jobId!),
    enabled: !!jobId,
    refetchInterval: (query: Query<JobStatusResponse, Error, JobStatusResponse, readonly ['jobStatus', string]>) => {
      const data = query.state.data;
      // Poll every 2 seconds until job is completed or failed
      if (data && (data.status === 'completed' || data.status === 'failed' || data.status === 'cancelled')) {
        return false;
      }
      return 2000;
    },
    onSuccess: (data: JobStatusResponse) => {
      if (data.status === 'completed') {
        toast.success(`Job ${jobId} completed!`);
        data.results.forEach((result: JobResultItem) => {
          const file = filesInJob.find(f => f.options.targetFormat.toLowerCase() === result.format.toLowerCase());
          if (file) {
            setConversionResult(file.id, { url: result.outputUrl, size: result.size, format: result.format });
          }
        });
      } else if (data.status === 'failed' || data.status === 'cancelled') {
        toast.error(`Job ${jobId} ${data.status}.`);
        filesInJob.forEach(file => {
          if (file.status !== 'completed') {
            updateFileStatus(file.id, data.status);
          }
        });
      } else if (data.status === 'processing') {
        filesInJob.forEach(file => {
          if (file.status === 'queued') {
            updateFileStatus(file.id, 'processing');
          }
        });
      }
    },
    onError: (err: Error) => {
      toast.error(`Failed to fetch job status: ${err.message}`);
      filesInJob.forEach(file => {
        if (file.status !== 'completed') {
          updateFileStatus(file.id, 'failed');
        }
      });
    }
  } satisfies UseQueryOptions<JobStatusResponse, Error, JobStatusResponse, readonly ['jobStatus', string]>;

  const { data: jobStatus, isLoading, isError, error } = useQuery(queryOptions);

  const completedFiles = filesInJob.filter(f => f.status === 'completed' && f.result);
  const isJobDone = jobStatus?.status === 'completed' || jobStatus?.status === 'failed' || jobStatus?.status === 'cancelled';

  const handleDownloadAll = async () => {
    if (completedFiles.length === 0) return;

    const toastId = toast.loading("Creating your ZIP file...");

    try {
      const zip = new JSZip();

      for (const item of completedFiles) {
        if (item.result?.url) {
          const response = await fetch(item.result.url);
          if (!response.ok) {
            throw new Error(`Failed to fetch ${item.result.url}`);
          }
          const blob = await response.blob();
          const originalFileName = item.file.name.split('.').slice(0, -1).join('.');
          const newExtension = item.result.format?.toLowerCase() || item.options.targetFormat.toLowerCase();
          const newFileName = `${originalFileName}.${newExtension}`;
          zip.file(newFileName, blob);
        }
      }

      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `conversion-job-${jobId}.zip`);
      
      toast.success("ZIP file created successfully!", { id: toastId });
    } catch (error) {
      console.error("Failed to create ZIP file", error);
      toast.error("Failed to create ZIP file.", { id: toastId });
    }
  };

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-8 text-center">
        <p className="text-lg text-muted-foreground">Loading job status...</p>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="container mx-auto px-4 py-8 text-center">
        <p className="text-lg text-destructive">Error: {error?.message || 'Could not load job status.'}</p>
      </main>
    );
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
          {filesInJob.map(item => (
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
            transition={{ delay: filesInJob.length * 0.1 + 0.5 }}
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
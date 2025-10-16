import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import useQueueStore from '@/stores/queueStore';
import ProgressCard from '@/components/ProgressCard';
import { Button } from '@/components/ui/button';
import { Download, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { api } from '@/lib/api';
import type { JobStatusResponse, BackendJobResult, JobResultItem, DownloadResponse } from '@/types';

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
  const filesInJob = allFiles.filter((f) => f.jobId === jobId);
  const { updateFileStatus, setConversionResult } = useQueueStore();
  const [hasProcessedCompletion, setHasProcessedCompletion] = useState(false);

  const { data: jobStatus, isLoading, isError, error } = useQuery<JobStatusResponse, Error>({
    queryKey: ['jobStatus', jobId as string],
    queryFn: () => api.getJobStatus(jobId!),
    enabled: !!jobId,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data && (data.status === 'completed' || data.status === 'failed' || data.status === 'cancelled')) {
        return false; // Stop refetching when job is done
      }
      return 2000; // Continue refetching every 2 seconds
    },
  } as UseQueryOptions<JobStatusResponse, Error>);

  // Handle job status updates and fetch download URLs
  useEffect(() => {
    if (!jobStatus || hasProcessedCompletion) return;

    const updateJobStatus = async () => {
      if (jobStatus.status === 'completed') {
        if (!hasProcessedCompletion) {
          toast.success(`Job ${jobId} completed!`, { id: 'job-completed' });
          setHasProcessedCompletion(true);

          const resultsWithUrls = await Promise.all(
            jobStatus.results.map(async (backendResult: BackendJobResult) => {
              try {
                const downloadResponse: DownloadResponse = await api.getDownloadUrl(jobStatus.jobId, backendResult.id);
                return {
                  ...backendResult,
                  outputUrl: downloadResponse.downloadUrl,
                  size: backendResult.meta?.size || 0,
                } as JobResultItem;
              } catch (error) {
                console.error(`Failed to get download URL for result ${backendResult.id}:`, error);
                return {
                  ...backendResult,
                  outputUrl: '',
                  size: backendResult.meta?.size || 0,
                } as JobResultItem;
              }
            })
          );

          resultsWithUrls.forEach((result: JobResultItem) => {
            const file = filesInJob.find((f) => f.options.targetFormat.toLowerCase() === result.format.toLowerCase());
            if (file) {
              setConversionResult(file.id, {
                url: result.outputUrl,
                format: result.format,
              });
            }
          });
        }
      } else if (jobStatus.status === 'failed' || jobStatus.status === 'cancelled') {
        toast.error(`Job ${jobId} ${jobStatus.status}.`, { id: 'job-error' });
        filesInJob.forEach((file) => {
          if (file.status !== 'completed') {
            updateFileStatus(file.id, jobStatus.status);
          }
        });
      } else if (jobStatus.status === 'processing') {
        filesInJob.forEach((file) => {
          if (file.status === 'queued') {
            updateFileStatus(file.id, 'processing');
          }
        });
      }
    };

    updateJobStatus().catch((err) => {
      console.error('Failed to process job status update:', err);
      toast.error(`Failed to process job status: ${err.message}`, { id: 'job-error' });
      filesInJob.forEach((file) => {
        if (file.status !== 'completed') {
          updateFileStatus(file.id, 'failed');
        }
      });
    });
  }, [jobStatus, jobId, filesInJob, setConversionResult, updateFileStatus, hasProcessedCompletion]);

  const completedFiles = filesInJob.filter((f) => f.status === 'completed' && f.result);
  const isJobDone = jobStatus?.status === 'completed' || jobStatus?.status === 'failed' || jobStatus?.status === 'cancelled';
  const isJobCompleted = jobStatus?.status === 'completed';

  const handleDownloadAll = async () => {
    if (completedFiles.length === 0) return;

    const toastId = toast.loading('Creating your ZIP file...');

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

      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `conversion-job-${jobId}.zip`);

      toast.success('ZIP file created successfully!', { id: toastId });
    } catch (error) {
      console.error('Failed to create ZIP file', error);
      toast.error('Failed to create ZIP file.', { id: toastId });
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
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <motion.div className="max-w-3xl mx-auto" initial="hidden" animate="visible" variants={containerVariants}>
        {isJobCompleted ? (
          <>
            <motion.div variants={itemVariants} className="flex items-center gap-4 mb-6">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <h1 className="text-2xl font-bold">Conversion Complete!</h1>
                <p className="text-muted-foreground">Your files are ready for download.</p>
              </div>
            </motion.div>
          </>
        ) : (
          <>
            <motion.h1 variants={itemVariants} className="text-2xl font-bold mb-2">
              Your Conversion is in Progress
            </motion.h1>
            <motion.p variants={itemVariants} className="text-muted-foreground mb-6">
              You can safely close this tab. We'll keep converting your files in the background.
            </motion.p>
          </>
        )}

        <motion.div className="space-y-4" variants={containerVariants}>
          {filesInJob.map((item) => (
            <motion.div key={item.id} variants={itemVariants}>
              <ProgressCard item={item} />
            </motion.div>
          ))}
        </motion.div>

        {isJobCompleted && completedFiles.length > 0 && (
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

        {isJobDone && !isJobCompleted && (
          <motion.div
            className="mt-8 flex items-center gap-4 p-4 bg-destructive/10 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <AlertCircle className="h-6 w-6 text-destructive" />
            <div>
              <p className="font-medium">Conversion {jobStatus?.status}</p>
              <p className="text-sm text-muted-foreground">
                {jobStatus?.status === 'failed' ? 'Something went wrong during conversion.' : 'The conversion was cancelled.'}
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </main>
  );
};

export default JobPage;
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useQueueStore from '@/stores/queueStore';
import ProgressCard from '@/components/ProgressCard';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

const JobPage = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const files = useQueueStore((state) => state.files.filter(f => f.jobId === jobId));
  const { updateFileProgress, updateFileStatus, setConversionResult } = useQueueStore();

  useEffect(() => {
    const simulateProcess = (id: string) => {
      // 1. Simulate Upload
      const uploadInterval = setInterval(() => {
        useQueueStore.getState().updateFileProgress(id, useQueueStore.getState().files.find(f => f.id === id)!.progress + 10);
        if (useQueueStore.getState().files.find(f => f.id === id)!.progress >= 100) {
          clearInterval(uploadInterval);
          updateFileStatus(id, 'processing');

          // 2. Simulate Processing
          setTimeout(() => {
            // Randomly fail 10% of the time
            if (Math.random() < 0.1) {
              updateFileStatus(id, 'failed');
            } else {
              setConversionResult(id, { url: '#', size: Math.random() * 1000000 });
            }
          }, 2000 + Math.random() * 3000); // Random processing time
        }
      }, 200);
    };

    files.forEach(file => {
      if (file.status === 'uploading' && file.progress === 0) {
        simulateProcess(file.id);
      }
    });
  }, [jobId, files, updateFileProgress, updateFileStatus, setConversionResult]);

  const completedFiles = files.filter(f => f.status === 'completed');
  const isJobDone = files.every(f => f.status === 'completed' || f.status === 'failed');

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Your Conversion is in Progress</h1>
        <p className="text-muted-foreground mb-6">
          You can safely close this tab. We'll keep converting your files in the background.
        </p>
        <div className="space-y-4">
          {files.map(item => (
            <ProgressCard key={item.id} item={item} />
          ))}
        </div>
        {isJobDone && completedFiles.length > 0 && (
          <div className="mt-8 flex justify-end">
            <Button size="lg">
              <Download className="mr-2 h-5 w-5" />
              Download All as ZIP ({completedFiles.length})
            </Button>
          </div>
        )}
      </div>
    </main>
  );
};

export default JobPage;
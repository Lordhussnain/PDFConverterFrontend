import { useNavigate } from 'react-router-dom';
import Uploader from '@/components/Uploader';
import QueueList from '@/components/QueueList';
import { Button } from '@/components/ui/button';
import useQueueStore from '@/stores/queueStore';

const HomePage = () => {
  const navigate = useNavigate();
  const files = useQueueStore((state) => state.files.filter(f => f.status === 'pending'));
  const { clearQueue, startConversion } = useQueueStore();

  const handleConvert = () => {
    const fileIds = files.map(f => f.id);
    const jobId = startConversion(fileIds);
    navigate(`/job/${jobId}`);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <Uploader />
        <QueueList />
        {files.length > 0 && (
          <div className="mt-8 flex justify-end gap-4">
            <Button variant="outline" onClick={clearQueue}>
              Clear All
            </Button>
            <Button size="lg" onClick={handleConvert}>
              Convert Now ({files.length})
            </Button>
          </div>
        )}
      </div>
    </main>
  );
};

export default HomePage;
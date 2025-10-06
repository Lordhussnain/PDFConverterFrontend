import { useNavigate } from 'react-router-dom';
import Uploader from '@/components/Uploader';
import QueueList from '@/components/QueueList';
import { Button } from '@/components/ui/button';
import useQueueStore from '@/stores/queueStore';
import { motion, AnimatePresence } from 'framer-motion';

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
        <AnimatePresence>
          {files.length > 0 && (
            <motion.div
              className="mt-8 flex justify-end gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <Button variant="outline" onClick={clearQueue}>
                Clear All
              </Button>
              <Button size="lg" onClick={handleConvert}>
                Convert Now ({files.length})
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
};

export default HomePage;
import { useNavigate } from 'react-router-dom';
import Uploader from '@/components/Uploader';
import QueueList from '@/components/QueueList';
import { Button } from '@/components/ui/button';
import useQueueStore from '@/stores/queueStore';
import { motion, AnimatePresence } from 'framer-motion';

const HomePage = () => {
  const navigate = useNavigate();
  const allFiles = useQueueStore((state) => state.files);
  const files = allFiles.filter(f => f.status === 'pending');
  const { clearQueue, startConversion } = useQueueStore();

  const handleConvert = () => {
    const fileIds = files.map(f => f.id);
    const jobId = startConversion(fileIds);
    navigate(`/job/${jobId}`);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <motion.h1 
            className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            The Ultimate PDF Converter
          </motion.h1>
          <motion.p 
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Quickly and easily convert your PDF files to a variety of formats.
            Secure, fast, and free.
          </motion.p>
        </div>

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
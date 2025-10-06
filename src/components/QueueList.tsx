import useQueueStore from '@/stores/queueStore';
import FileCard from './FileCard';

const QueueList = () => {
  const files = useQueueStore((state) => state.files);

  if (files.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 space-y-4">
      {files.map((item) => (
        <FileCard key={item.id} item={item} />
      ))}
    </div>
  );
};

export default QueueList;
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import FileCard from './FileCard';
import { QueueItem } from '@/types';
import { motion } from 'framer-motion';

interface DraggableFileCardProps {
  item: QueueItem;
}

const DraggableFileCard = ({ item }: DraggableFileCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 'auto',
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      layout
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: -100, transition: { duration: 0.2 } }}
      transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 30 }}
    >
      <FileCard item={item} dragListeners={listeners} />
    </motion.div>
  );
};

export default DraggableFileCard;
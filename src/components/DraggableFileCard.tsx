import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import FileCard from './FileCard';
import { QueueItem } from '@/types';

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
    <div ref={setNodeRef} style={style} {...attributes}>
      <FileCard item={item} dragListeners={listeners} />
    </div>
  );
};

export default DraggableFileCard;
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import useQueueStore from '@/stores/queueStore';
import DraggableFileCard from './DraggableFileCard';
import { AnimatePresence } from 'framer-motion';

const QueueList = () => {
  const allFiles = useQueueStore((state) => state.files);
  const files = allFiles.filter(f => f.status === 'pending');
  const reorderFiles = useQueueStore((state) => state.reorderFiles);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (files.length === 0) {
    return null;
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      reorderFiles(active.id as string, over.id as string);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="mt-8 space-y-4">
        <SortableContext
          items={files.map(f => f.id)}
          strategy={verticalListSortingStrategy}
        >
          <AnimatePresence>
            {files.map((item) => (
              <DraggableFileCard key={item.id} item={item} />
            ))}
          </AnimatePresence>
        </SortableContext>
      </div>
    </DndContext>
  );
};

export default QueueList;
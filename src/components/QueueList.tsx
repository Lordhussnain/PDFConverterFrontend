import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import useQueueStore from '@/stores/queueStore';
import DraggableFileCard from './DraggableFileCard';

const QueueList = () => {
  const files = useQueueStore((state) => state.files.filter(f => f.status === 'pending'));
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
          {files.map((item) => (
            <DraggableFileCard key={item.id} item={item} />
          ))}
        </SortableContext>
      </div>
    </DndContext>
  );
};

export default QueueList;
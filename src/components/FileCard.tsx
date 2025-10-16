import { useState } from 'react';
import { File, X, GripVertical, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { QueueItem } from '@/types';
import useQueueStore from '@/stores/queueStore';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from '@/components/ui/badge';
import ConversionOptionsDialog from './ConversionOptionsDialog';

interface FileCardProps {
  item: QueueItem;
  dragListeners?: Record<string, any>;
}

const supportedFormats = ["DOCX", "PPTX", "JPG", "TXT", "EPUB", "XLSX"];

const FileCard = ({ item, dragListeners }: FileCardProps) => {
  const { removeFile, updateFileFormat } = useQueueStore();
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <>
      <Card>
        <CardContent className="p-4 flex items-center gap-2 sm:gap-4">
          {dragListeners && (
            <button {...dragListeners} className="cursor-grab touch-none p-2 -ml-2 focus:outline-none focus:ring-2 focus:ring-ring rounded">
              <GripVertical className="h-5 w-5 text-muted-foreground" />
            </button>
          )}
          <File className="h-8 w-8 text-muted-foreground flex-shrink-0" />
          <div className="flex-grow min-w-0">
            <p className="font-semibold truncate" title={item.file.name}>{item.file.name}</p>
            <p className="text-sm text-muted-foreground">
              {formatFileSize(item.file.size)}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-sm text-muted-foreground hidden sm:inline">To:</span>
              <Select
                value={item.options.targetFormat}
                onValueChange={(value) => updateFileFormat(item.id, value)}
              >
                <SelectTrigger className="w-[110px] sm:w-[120px]">
                  <SelectValue placeholder="Format" />
                </SelectTrigger>
                <SelectContent>
                  {supportedFormats.map(format => (
                    <SelectItem
                      key={format}
                      value={format}
                      className="flex items-center justify-between"
                    >
                      {format}
                      {format === 'PPTX' && (
                        <Badge variant="secondary" className="ml-2">
                          Coming Soon
                        </Badge>
                      )}
                      {format === 'JPG' && (
                        <Badge variant="secondary" className="ml-2">
                          Coming Soon
                        </Badge>
                      )}
                      {format === 'TXT' && (
                        <Badge variant="secondary" className="ml-2">
                          Coming Soon
                        </Badge>
                      )}
                      {format === 'EPUB' && (
                        <Badge variant="secondary" className="ml-2">
                          Coming Soon
                        </Badge>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-primary flex-shrink-0"
            onClick={() => setIsOptionsOpen(true)}
            aria-label="Conversion options"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-destructive flex-shrink-0"
            onClick={() => removeFile(item.id)}
            aria-label="Remove file"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
      <ConversionOptionsDialog
        item={item}
        isOpen={isOptionsOpen}
        onOpenChange={setIsOptionsOpen}
      />
    </>
  );
};

export default FileCard;
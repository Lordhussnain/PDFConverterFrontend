import { File, CheckCircle, AlertCircle, Loader, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { QueueItem } from '@/types';
import useQueueStore from '@/stores/queueStore';
import { toast } from "sonner";

interface ProgressCardProps {
  item: QueueItem;
}

const ProgressCard = ({ item }: ProgressCardProps) => {
  const { retryConversion } = useQueueStore();

  const handleRetry = async () => {
    await retryConversion(item.id);
    toast.info(`Retrying conversion for ${item.file.name}.`); // Explicitly calling toast.info
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusInfo = () => {
    switch (item.status) {
      case 'pending-upload-session':
        return { icon: <Loader className="h-6 w-6 text-muted-foreground animate-spin" />, text: 'Preparing upload session...' };
      case 'pending':
        return { icon: <File className="h-6 w-6 text-muted-foreground" />, text: 'Ready for conversion' };
      case 'uploading':
        return { icon: <Loader className="h-6 w-6 text-primary animate-spin" />, text: `Uploading... ${item.progress}%` };
      case 'queued':
        return { icon: <Loader className="h-6 w-6 text-primary animate-spin" />, text: 'Queued for processing...' };
      case 'processing':
        return { icon: <Loader className="h-6 w-6 text-primary animate-spin" />, text: 'Processing...' };
      case 'completed':
        return { icon: <CheckCircle className="h-6 w-6 text-green-500" />, text: 'Completed' };
      case 'failed':
        return { icon: <AlertCircle className="h-6 w-6 text-destructive" />, text: 'Failed' };
      case 'cancelled':
        return { icon: <AlertCircle className="h-6 w-6 text-muted-foreground" />, text: 'Cancelled' };
      default:
        return { icon: <File className="h-6 w-6 text-muted-foreground" />, text: 'Unknown Status' };
    }
  };

  const { icon, text } = getStatusInfo();

  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-4">
        <div className="flex-shrink-0">{icon}</div>
        <div className="flex-grow min-w-0">
          <p className="font-semibold truncate" title={item.file.name}>{item.file.name}</p>
          <p className="text-sm text-muted-foreground">
            {formatFileSize(item.file.size)} · <span className="font-medium">{text}</span>
          </p>
          {(item.status === 'uploading' || item.status === 'processing' || item.status === 'queued') && (
            <Progress value={item.progress > 0 ? item.progress : undefined} className="mt-2 h-2" />
          )}
        </div>
        {item.status === 'completed' && item.result && (
          <Button asChild>
            <a href={item.result.url} download={item.file.name.replace('.pdf', `.${item.result.format?.toLowerCase() || item.options.targetFormat.toLowerCase()}`)}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </a>
          </Button>
        )}
        {(item.status === 'failed' || item.status === 'cancelled') && (
          <Button variant="outline" onClick={handleRetry}>Retry</Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ProgressCard;
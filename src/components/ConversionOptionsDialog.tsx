import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { QueueItem } from "@/types"
import useQueueStore from "@/stores/queueStore"

interface ConversionOptionsDialogProps {
  item: QueueItem;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const ConversionOptionsDialog = ({ item, isOpen, onOpenChange }: ConversionOptionsDialogProps) => {
  const { updateFileOptions } = useQueueStore();
  const { options } = item;

  const handleOptionChange = (key: string, value: any) => {
    updateFileOptions(item.id, { [key]: value });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Conversion Options</DialogTitle>
          <DialogDescription>
            Fine-tune the settings for converting <span className="font-semibold truncate inline-block max-w-xs align-bottom">{item.file.name}</span>.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* Page Range */}
          <div className="space-y-2">
            <Label htmlFor="page-range">Page Range</Label>
            <Input
              id="page-range"
              placeholder="e.g., 1-5, 8, 11-13"
              value={options.pageRange || ''}
              onChange={(e) => handleOptionChange('pageRange', e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Specify pages to convert. Leave blank for all pages.
            </p>
          </div>

          {/* OCR for DOCX and TXT */}
          {(options.targetFormat === 'DOCX' || options.targetFormat === 'TXT') && (
            <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <Label htmlFor="ocr" className="cursor-pointer">Enable OCR</Label>
                <p className="text-sm text-muted-foreground">
                  Recognize text in scanned PDFs.
                </p>
              </div>
              <Switch
                id="ocr"
                checked={options.ocr || false}
                onCheckedChange={(checked) => handleOptionChange('ocr', checked)}
              />
            </div>
          )}

          {/* Quality for JPG */}
          {options.targetFormat === 'JPG' && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="quality">Image Quality</Label>
                <span className="font-semibold w-12 text-right">{options.quality || 80}%</span>
              </div>
              <Slider
                id="quality"
                min={10}
                max={100}
                step={10}
                value={[options.quality || 80]}
                onValueChange={(value) => handleOptionChange('quality', value[0])}
                className="pt-2"
              />
              <p className="text-sm text-muted-foreground">
                Higher quality results in a larger file size.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConversionOptionsDialog;
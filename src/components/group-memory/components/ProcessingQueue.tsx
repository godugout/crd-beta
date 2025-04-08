
import React from 'react';
import { Trash2, Info, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export interface ProcessingQueueProps {
  queue: any[];
  onRemoveFromQueue: (index: number) => void;
  onClearQueue: () => void;
  onProcessAll: () => void;
  isProcessing?: boolean;
}

const ProcessingQueue = ({ 
  queue, 
  onRemoveFromQueue, 
  onClearQueue, 
  onProcessAll,
  isProcessing = false
}: ProcessingQueueProps) => {
  const hasItems = queue.length > 0;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Processing Queue</h3>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearQueue} 
            className="text-xs" 
            aria-label="Clear all items from queue"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Clear
          </Button>
        </div>
      </div>
      
      <ScrollArea className="h-40 rounded-md border">
        <div className="p-2 space-y-1">
          {queue.map((item, index) => (
            <Card key={index} className="flex items-center justify-between p-2">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs line-clamp-1">{item.name || item.file?.name || 'Item'}</span>
                <Badge variant="secondary" className="text-[0.6rem]">+1 Point</Badge>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => onRemoveFromQueue(index)}
                className="h-6 w-6"
                aria-label="Remove item from queue"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </Card>
          ))}
          {!hasItems && (
            <div className="text-center text-muted-foreground text-xs p-4">
              Queue is empty
            </div>
          )}
        </div>
      </ScrollArea>
      
      <div className="flex justify-end">
        <Button
          onClick={onProcessAll}
          disabled={!hasItems || isProcessing}
          className="w-full sm:w-auto text-xs"
        >
          {isProcessing ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Processing...
            </>
          ) : (
            <>
              <Edit className="h-3 w-3 mr-1" /> 
              Process All
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ProcessingQueue;

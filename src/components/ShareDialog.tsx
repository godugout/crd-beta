
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  cardId: string;
}

export const ShareDialog: React.FC<ShareDialogProps> = ({ isOpen, onClose, cardId }) => {
  const { toast } = useToast();
  const shareUrl = `${window.location.origin}/view/${cardId}`;
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        toast({
          title: "Link copied",
          description: "The card link has been copied to your clipboard"
        });
      })
      .catch(() => {
        toast({
          title: "Copy failed",
          description: "Failed to copy link to clipboard",
          variant: "destructive"
        });
      });
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share this card</DialogTitle>
          <DialogDescription>
            Share this card with others or copy the link
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center space-x-2 mt-2">
          <Input 
            readOnly 
            value={shareUrl}
            className="flex-1"
          />
          <Button variant="outline" size="icon" onClick={handleCopyLink}>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        
        {navigator.share && (
          <Button 
            onClick={() => {
              navigator.share({
                title: 'Check out this card',
                url: shareUrl
              }).then(() => onClose());
            }}
            className="w-full mt-2"
          >
            <Share2 className="mr-2 h-4 w-4" /> Share via device
          </Button>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

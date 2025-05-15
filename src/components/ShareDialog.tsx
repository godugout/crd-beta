
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Share2, X, Check } from 'lucide-react';
import { showToast } from '@/lib/adapters/toastAdapter';

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url: string;
  imageUrl?: string;
}

const ShareDialog: React.FC<ShareDialogProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  url, 
  imageUrl 
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      showToast({
        title: "Link copied",
        description: "The link has been copied to your clipboard"
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      showToast({
        title: "Failed to copy",
        description: "Please try again or copy the link manually",
        variant: "destructive"
      });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url,
          text: `Check out my card: ${title}`
        });
        showToast({
          title: "Shared successfully",
          description: "Thank you for sharing!"
        });
      } catch (err) {
        // User probably canceled the share operation
        if ((err as Error).name !== 'AbortError') {
          showToast({
            title: "Failed to share",
            description: "Please try again later",
            variant: "destructive"
          });
        }
      }
    } else {
      handleCopy();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Card</DialogTitle>
          <DialogDescription>
            Share this card with friends or on social media
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {imageUrl && (
            <div className="mb-4 flex justify-center">
              <img 
                src={imageUrl} 
                alt={title} 
                className="w-32 h-44 object-cover rounded-md" 
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="share-link">Copy Link</Label>
            <div className="flex space-x-2">
              <Input 
                id="share-link" 
                value={url} 
                readOnly 
                className="flex-1" 
              />
              <Button onClick={handleCopy} variant="outline" className="flex-shrink-0">
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          
          <div className="mt-4 flex justify-center">
            <Button onClick={handleShare} className="w-full">
              <Share2 className="h-4 w-4 mr-2" />
              Share Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ShareDialog;

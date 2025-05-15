
import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Cross1Icon } from '@radix-ui/react-icons';
import { Copy } from 'lucide-react';
import { toastUtils } from '@/lib/utils/toast-utils';

interface ShareDialogProps {
  cardId?: string;
  cardTitle?: string;
  shareUrl?: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const ShareDialog: React.FC<ShareDialogProps> = ({
  cardId,
  cardTitle = 'this CRD',
  shareUrl,
  isOpen,
  onOpenChange,
}) => {
  const [copied, setCopied] = useState(false);
  
  const url = shareUrl || `${window.location.origin}/card/${cardId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(url)
      .then(() => {
        setCopied(true);
        toastUtils.success(
          "Link copied",
          "Share link copied to clipboard"
        );
        
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((error) => {
        console.error('Failed to copy:', error);
        toastUtils.error(
          "Copy failed",
          "Could not copy to clipboard"
        );
      });
  };

  const handleSocialShare = (platform: string) => {
    let shareLink = '';
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(`Check out ${cardTitle} on Cardshow`);
    
    switch (platform) {
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
        break;
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'email':
        shareLink = `mailto:?subject=${encodedTitle}&body=${encodedUrl}`;
        break;
      default:
        return;
    }
    
    window.open(shareLink, '_blank');
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/50 fixed inset-0 z-50 backdrop-blur-sm animate-fade-in" />
        <Dialog.Content className="fixed z-50 top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[90vw] max-w-md p-6 bg-white rounded-lg shadow-lg animate-scale-in">
          <Dialog.Title className="text-lg font-bold mb-2">
            Share {cardTitle}
          </Dialog.Title>
          
          <Dialog.Description className="text-sm text-gray-600 mb-4">
            Share this card with others using the link below or via social media.
          </Dialog.Description>
          
          {/* Share link */}
          <div className="flex items-center mb-6">
            <input
              type="text"
              value={url}
              readOnly
              className="flex-1 p-2 border rounded-l-md bg-gray-50 text-sm"
            />
            <Button
              type="button"
              variant={copied ? "ghost" : "default"}
              className="rounded-l-none"
              onClick={handleCopy}
            >
              <Copy className="h-4 w-4 mr-1" />
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
          
          {/* Social share buttons */}
          <div className="flex justify-center space-x-4 mb-6">
            <button
              onClick={() => handleSocialShare('twitter')}
              className="text-blue-400 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50 transition-colors"
              title="Share on Twitter"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3Z" />
              </svg>
            </button>
            
            <button
              onClick={() => handleSocialShare('facebook')}
              className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50 transition-colors"
              title="Share on Facebook"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </button>
            
            <button
              onClick={() => handleSocialShare('email')}
              className="text-gray-600 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors"
              title="Share via Email"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
          
          {/* Close button */}
          <Dialog.Close asChild>
            <button
              className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100"
              aria-label="Close"
            >
              <Cross1Icon className="h-4 w-4" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ShareDialog;

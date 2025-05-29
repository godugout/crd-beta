
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Share, Save, Copy } from 'lucide-react';
import { toast } from 'sonner';

const SaveRemixSection: React.FC = () => {
  const handleSave = () => {
    toast.success('Card saved to your collection');
  };

  const handleDownload = () => {
    toast.success('Downloading card image...');
  };

  const handleShare = () => {
    toast.success('Share link copied to clipboard');
  };

  const handleRemix = () => {
    toast.success('Opening card editor...');
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium text-white mb-2">Save & Share</h3>
        <p className="text-sm text-gray-400 mb-4">Save your customized card or share with others</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={handleSave}
          className="h-12 flex-col gap-1 bg-green-600 hover:bg-green-700 text-white"
        >
          <Save className="h-4 w-4" />
          <span className="text-xs">Save</span>
        </Button>

        <Button
          onClick={handleDownload}
          variant="outline"
          className="h-12 flex-col gap-1 bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-gray-700/50"
        >
          <Download className="h-4 w-4" />
          <span className="text-xs">Download</span>
        </Button>

        <Button
          onClick={handleShare}
          variant="outline"
          className="h-12 flex-col gap-1 bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-gray-700/50"
        >
          <Share className="h-4 w-4" />
          <span className="text-xs">Share</span>
        </Button>

        <Button
          onClick={handleRemix}
          variant="outline"
          className="h-12 flex-col gap-1 bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-gray-700/50"
        >
          <Copy className="h-4 w-4" />
          <span className="text-xs">Remix</span>
        </Button>
      </div>
    </div>
  );
};

export default SaveRemixSection;

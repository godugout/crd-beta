
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Share2, Save } from 'lucide-react';
import { useOaklandMemoryOperations } from '@/hooks/useOaklandMemoryOperations';

interface QuickActionsSectionProps {
  onExport?: () => void;
  memoryData?: {
    title: string;
    subtitle: string;
    description: string;
    player?: string;
    date?: string;
    tags: string[];
  };
  selectedTemplate?: any;
}

const QuickActionsSection: React.FC<QuickActionsSectionProps> = ({
  onExport,
  memoryData,
  selectedTemplate
}) => {
  const { saveMemory, exportCard, shareMemory, isSaving, isExporting } = useOaklandMemoryOperations();

  const handleSave = async () => {
    if (!memoryData || !selectedTemplate) {
      return;
    }

    await saveMemory({
      ...memoryData,
      template_id: selectedTemplate.id,
      memory_type: 'card',
      visibility: 'public'
    });
  };

  const handleExport = async () => {
    await exportCard('png');
    if (onExport) {
      onExport();
    }
  };

  const handleShare = async () => {
    await shareMemory();
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-300 mb-3">Quick Actions</h3>
      
      <div className="space-y-2">
        <Button
          onClick={handleSave}
          disabled={isSaving || !memoryData?.title || !selectedTemplate}
          className="w-full bg-gradient-to-r from-[#EFB21E] to-yellow-400 hover:from-yellow-400 hover:to-[#EFB21E] text-[#003831] font-bold transition-all duration-200"
        >
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Memory'}
        </Button>

        <Button
          onClick={handleExport}
          disabled={isExporting || !selectedTemplate}
          variant="outline"
          className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 bg-gray-800"
        >
          <Download className="h-4 w-4 mr-2" />
          {isExporting ? 'Exporting...' : 'Export Card'}
        </Button>

        <Button
          onClick={handleShare}
          variant="outline"
          className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 bg-gray-800"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </div>

      <div className="text-xs text-gray-500 mt-3 leading-relaxed">
        Save your Oakland A's memory to your collection, export as an image, or share with fellow fans.
      </div>
    </div>
  );
};

export default QuickActionsSection;

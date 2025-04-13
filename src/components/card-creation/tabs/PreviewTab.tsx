
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Download, Share2, Save } from 'lucide-react';
import SimpleCardRenderer from '@/components/card/SimpleCardRenderer';
import { toast } from 'sonner';

interface PreviewTabProps {
  onSave: () => void;
  cardImage?: string | null;
  cardTitle?: string;
  cardEffect?: string;
}

const PreviewTab: React.FC<PreviewTabProps> = ({ 
  onSave, 
  cardImage = '',
  cardTitle = 'My Card',
  cardEffect = ''
}) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [isExporting, setIsExporting] = useState(false);
  
  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      toast.success('Card exported successfully!');
    }, 1500);
  };
  
  const handleShare = () => {
    toast.info('Sharing functionality will be implemented soon!');
  };
  
  return (
    <div>
      <h2 className={`text-xl font-semibold mb-4 ${isMobile ? 'text-center' : 'text-left'}`}>Preview Your Card</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="aspect-[2.5/3.5] w-full max-w-[300px] mx-auto">
            <SimpleCardRenderer 
              imageUrl={cardImage || 'https://images.unsplash.com/photo-1614315517650-3771cf72d18a?q=80&w=2070&auto=format&fit=crop'}
              title={cardTitle}
              tags={['Custom', 'CRD']}
              className={`shadow-lg ${cardEffect}`}
            />
          </div>
        </div>
        
        <div className="space-y-6">
          <div>
            <h3 className="font-medium mb-2">Card Details</h3>
            <div className="bg-gray-50 p-4 rounded-md space-y-2">
              <p><span className="font-medium">Title:</span> {cardTitle}</p>
              <p><span className="font-medium">Effects:</span> {cardEffect || 'None'}</p>
              <p><span className="font-medium">Created:</span> {new Date().toLocaleDateString()}</p>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Export Options</h3>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline"
                className="flex items-center gap-2"
                onClick={handleExport}
                disabled={isExporting}
              >
                <Download size={16} />
                {isExporting ? 'Exporting...' : 'Export as Image'}
              </Button>
              
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={handleShare}
              >
                <Share2 size={16} />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end mt-8">
        <Button 
          className="bg-litmus-green hover:bg-litmus-green/90 text-white px-6 flex items-center gap-2"
          onClick={onSave}
        >
          <Save size={16} />
          Save CRD
        </Button>
      </div>
    </div>
  );
};

export default PreviewTab;

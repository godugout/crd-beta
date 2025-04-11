
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ChevronRight } from 'lucide-react';
import CardScanUpload from '../CardScanUpload';
import { CardDesignState } from '../CardCreator';

interface UploadTabProps {
  cardData: CardDesignState;
  setCardData: React.Dispatch<React.SetStateAction<CardDesignState>>;
  onImageCaptured: (imageUrl: string) => void;
  onContinue: () => void;
}

const UploadTab: React.FC<UploadTabProps> = ({ cardData, setCardData, onImageCaptured, onContinue }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Upload CRD Image</h2>
          <CardScanUpload onImageCaptured={onImageCaptured} />
          <p className="text-sm text-gray-500 mt-4">
            For best results, use a high-quality image with a 2.5:3.5 aspect ratio
          </p>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">CRD Details</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-sm font-medium">TITLE</Label>
              <Input 
                id="title" 
                placeholder="Enter title for your CRD" 
                value={cardData.title}
                onChange={(e) => setCardData({...cardData, title: e.target.value})}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="description" className="text-sm font-medium">DESCRIPTION</Label>
              <Textarea 
                id="description" 
                placeholder="Describe your CRD"
                value={cardData.description}
                onChange={(e) => setCardData({...cardData, description: e.target.value})}
                className="mt-1 resize-none" 
                rows={4}
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end mt-6">
        <Button 
          type="button"
          disabled={!cardData.imageUrl}
          className="bg-litmus-green hover:bg-litmus-green/90 text-white px-6"
          onClick={onContinue}
        >
          Continue <ChevronRight size={16} className="ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default UploadTab;

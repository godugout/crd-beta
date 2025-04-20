
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Save } from 'lucide-react';

interface CardPreviewProps {
  cardData: any;
  onSave: () => void;
  onCancel: () => void;
}

const CardPreview: React.FC<CardPreviewProps> = ({
  cardData,
  onSave,
  onCancel
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <Card className="w-[350px] aspect-[2.5/3.5] relative">
          {cardData.imageUrl ? (
            <img
              src={cardData.imageUrl}
              alt={cardData.title}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              Upload an image to preview
            </div>
          )}
        </Card>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSave}>
          <Save className="w-4 h-4 mr-2" />
          Save Card
        </Button>
      </div>
    </div>
  );
};

export default CardPreview;

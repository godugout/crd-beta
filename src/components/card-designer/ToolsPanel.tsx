
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ImageIcon, Type, Square, Plus } from 'lucide-react';

interface ToolsPanelProps {
  onAddLayer: (type: 'image' | 'text' | 'shape') => void;
}

const ToolsPanel: React.FC<ToolsPanelProps> = ({ onAddLayer }) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Tools</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-2 p-2">
        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => onAddLayer('image')}
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Add Image
          </Button>
          
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => onAddLayer('text')}
          >
            <Type className="h-4 w-4 mr-2" />
            Add Text
          </Button>
          
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => onAddLayer('shape')}
          >
            <Square className="h-4 w-4 mr-2" />
            Add Shape
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ToolsPanel;

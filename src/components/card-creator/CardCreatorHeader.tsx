
import React from 'react';
import { Button } from '@/components/ui/button';
import { Settings, Lightbulb, Shuffle, Save } from 'lucide-react';

interface CardCreatorHeaderProps {
  showSidebar: boolean;
  autoRotate: boolean;
  isLoading: boolean;
  onToggleSidebar: () => void;
  onToggleAutoRotate: () => void;
  onRandomize: () => void;
  onSave: () => void;
}

export const CardCreatorHeader: React.FC<CardCreatorHeaderProps> = ({
  showSidebar,
  autoRotate,
  isLoading,
  onToggleSidebar,
  onToggleAutoRotate,
  onRandomize,
  onSave
}) => {
  return (
    <div className="p-4 bg-black/20 backdrop-blur-sm border-b border-white/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="text-white hover:bg-white/10"
          >
            <Settings className="h-4 w-4 mr-2" />
            {showSidebar ? 'Hide' : 'Show'} Controls
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleAutoRotate}
            className="text-white hover:bg-white/10"
          >
            <Lightbulb className="h-4 w-4 mr-2" />
            {autoRotate ? 'Stop' : 'Start'} Rotation
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRandomize}
            disabled={isLoading}
            className="border-white/20 text-white hover:bg-white/10"
          >
            <Shuffle className="h-4 w-4 mr-2" />
            Surprise Me!
          </Button>
          
          <Button
            onClick={onSave}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Saving...' : 'Save Card'}
          </Button>
        </div>
      </div>
    </div>
  );
};

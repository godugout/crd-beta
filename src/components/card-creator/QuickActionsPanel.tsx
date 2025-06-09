
import React from 'react';
import { Button } from '@/components/ui/button';
import { Shuffle, Save } from 'lucide-react';

interface QuickActionsPanelProps {
  isLoading: boolean;
  onRandomize: () => void;
  onSave: () => void;
}

export const QuickActionsPanel: React.FC<QuickActionsPanelProps> = ({
  isLoading,
  onRandomize,
  onSave
}) => {
  return (
    <div className="pt-4 border-t border-white/10">
      <Button
        onClick={onRandomize}
        disabled={isLoading}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white mb-3"
      >
        <Shuffle className="h-4 w-4 mr-2" />
        Surprise Me!
      </Button>
      
      <Button
        onClick={onSave}
        disabled={isLoading}
        className="w-full bg-green-600 hover:bg-green-700 text-white"
      >
        <Save className="h-4 w-4 mr-2" />
        {isLoading ? 'Saving...' : 'Save & Continue'}
      </Button>
    </div>
  );
};

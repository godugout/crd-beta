
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface QuickActionsSectionProps {
  onExport: () => void;
}

const QuickActionsSection: React.FC<QuickActionsSectionProps> = ({
  onExport
}) => {
  return (
    <div className="pt-4 border-t border-gray-700">
      <Button
        onClick={onExport}
        variant="outline"
        className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 bg-gray-800"
      >
        <Download className="h-4 w-4 mr-2" />
        Export
      </Button>
    </div>
  );
};

export default QuickActionsSection;

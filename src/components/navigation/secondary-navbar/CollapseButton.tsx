
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CollapseButtonProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export const CollapseButton: React.FC<CollapseButtonProps> = ({ isCollapsed, onToggle }) => {
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={onToggle}
      className="ml-2 h-8 w-8 p-0"
      aria-label={isCollapsed ? "Expand navigation" : "Collapse navigation"}
    >
      {isCollapsed ? (
        <ChevronDown className="h-4 w-4" />
      ) : (
        <ChevronUp className="h-4 w-4" />
      )}
    </Button>
  );
};

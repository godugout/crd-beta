
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Grid3X3 } from 'lucide-react';

interface SidebarHeaderProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  collapsed,
  onToggleCollapse
}) => {
  return (
    <div className="p-4 border-b border-gray-700 flex items-center justify-between bg-gray-800">
      {!collapsed && (
        <div className="flex items-center gap-2">
          <Grid3X3 className="h-5 w-5 text-gray-400" />
          <span className="font-semibold text-white">Controls</span>
        </div>
      )}
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggleCollapse}
        className="p-2 hover:bg-[#EFB21E]/10 text-gray-400 hover:text-[#EFB21E]"
      >
        {collapsed ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </Button>
    </div>
  );
};

export default SidebarHeader;

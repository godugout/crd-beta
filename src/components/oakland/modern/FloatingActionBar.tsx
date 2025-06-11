
import React from 'react';
import { Button } from '@/components/ui/button';
import { Type, Palette, Sparkles, Download, FileText, Printer } from 'lucide-react';
import { cn } from '@/lib/utils';
import { OaklandCardTemplate } from '@/lib/data/oaklandCardTemplates';

interface FloatingActionBarProps {
  selectedTemplate: OaklandCardTemplate | null;
  onEditText: () => void;
  onEditColors: () => void;
  onEditEffects: () => void;
  onExport: (format: 'png' | 'pdf' | 'print') => void;
  activePanel: string | null;
}

const FloatingActionBar: React.FC<FloatingActionBarProps> = ({
  selectedTemplate,
  onEditText,
  onEditColors,
  onEditEffects,
  onExport,
  activePanel
}) => {
  if (!selectedTemplate) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
      <div className="bg-white rounded-full shadow-lg border border-gray-200 p-2 flex items-center gap-2">
        {/* Edit Tools */}
        <Button
          variant={activePanel === 'text' ? 'default' : 'ghost'}
          size="sm"
          onClick={onEditText}
          className={cn(
            "rounded-full",
            activePanel === 'text' && "bg-[#003831] text-[#EFB21E] hover:bg-[#002620]"
          )}
        >
          <Type className="h-4 w-4" />
          <span className="ml-2 hidden sm:inline">Text</span>
        </Button>

        <Button
          variant={activePanel === 'colors' ? 'default' : 'ghost'}
          size="sm"
          onClick={onEditColors}
          className={cn(
            "rounded-full",
            activePanel === 'colors' && "bg-[#003831] text-[#EFB21E] hover:bg-[#002620]"
          )}
        >
          <Palette className="h-4 w-4" />
          <span className="ml-2 hidden sm:inline">Colors</span>
        </Button>

        <Button
          variant={activePanel === 'effects' ? 'default' : 'ghost'}
          size="sm"
          onClick={onEditEffects}
          className={cn(
            "rounded-full",
            activePanel === 'effects' && "bg-[#003831] text-[#EFB21E] hover:bg-[#002620]"
          )}
        >
          <Sparkles className="h-4 w-4" />
          <span className="ml-2 hidden sm:inline">Effects</span>
        </Button>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-300 mx-2" />

        {/* Export Options */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onExport('png')}
          className="rounded-full"
        >
          <Download className="h-4 w-4" />
          <span className="ml-2 hidden sm:inline">PNG</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onExport('pdf')}
          className="rounded-full"
        >
          <FileText className="h-4 w-4" />
          <span className="ml-2 hidden sm:inline">PDF</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onExport('print')}
          className="rounded-full"
        >
          <Printer className="h-4 w-4" />
          <span className="ml-2 hidden sm:inline">Print</span>
        </Button>
      </div>
    </div>
  );
};

export default FloatingActionBar;


import React from 'react';
import { Button } from '@/components/ui/button';
import { Type, Palette, Sparkles, Download, FileText, Printer, Wand2 } from 'lucide-react';
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
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200/60 p-2 flex items-center gap-2">
        {/* Edit Tools Section */}
        <div className="flex items-center gap-1">
          <Button
            variant={activePanel === 'text' ? 'default' : 'ghost'}
            size="sm"
            onClick={onEditText}
            className={cn(
              "rounded-xl font-medium transition-all duration-200",
              activePanel === 'text' 
                ? "bg-gradient-to-r from-[#003831] to-[#2F5233] text-[#EFB21E] shadow-lg hover:from-[#002620] hover:to-[#1e3a26]" 
                : "hover:bg-gray-100 text-gray-700"
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
              "rounded-xl font-medium transition-all duration-200",
              activePanel === 'colors' 
                ? "bg-gradient-to-r from-[#003831] to-[#2F5233] text-[#EFB21E] shadow-lg hover:from-[#002620] hover:to-[#1e3a26]" 
                : "hover:bg-gray-100 text-gray-700"
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
              "rounded-xl font-medium transition-all duration-200",
              activePanel === 'effects' 
                ? "bg-gradient-to-r from-[#003831] to-[#2F5233] text-[#EFB21E] shadow-lg hover:from-[#002620] hover:to-[#1e3a26]" 
                : "hover:bg-gray-100 text-gray-700"
            )}
          >
            <Sparkles className="h-4 w-4" />
            <span className="ml-2 hidden sm:inline">Effects</span>
          </Button>
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-gradient-to-b from-transparent via-gray-300 to-transparent mx-2" />

        {/* Export Section */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onExport('png')}
            className="rounded-xl hover:bg-[#EFB21E]/10 hover:text-[#003831] text-gray-700 font-medium transition-all duration-200"
          >
            <Download className="h-4 w-4" />
            <span className="ml-2 hidden sm:inline">PNG</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onExport('pdf')}
            className="rounded-xl hover:bg-[#EFB21E]/10 hover:text-[#003831] text-gray-700 font-medium transition-all duration-200"
          >
            <FileText className="h-4 w-4" />
            <span className="ml-2 hidden sm:inline">PDF</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onExport('print')}
            className="rounded-xl hover:bg-[#EFB21E]/10 hover:text-[#003831] text-gray-700 font-medium transition-all duration-200"
          >
            <Printer className="h-4 w-4" />
            <span className="ml-2 hidden sm:inline">Print</span>
          </Button>
        </div>

        {/* Magic Enhance Button */}
        <div className="w-px h-8 bg-gradient-to-b from-transparent via-gray-300 to-transparent mx-2" />
        
        <Button
          variant="ghost"
          size="sm"
          className="rounded-xl bg-gradient-to-r from-[#EFB21E]/10 to-[#003831]/10 hover:from-[#EFB21E]/20 hover:to-[#003831]/20 text-[#003831] font-medium transition-all duration-200 border border-[#EFB21E]/20"
        >
          <Wand2 className="h-4 w-4" />
          <span className="ml-2 hidden sm:inline">Enhance</span>
        </Button>
      </div>

      {/* Floating Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#003831]/10 to-[#EFB21E]/10 rounded-2xl blur-xl -z-10" />
    </div>
  );
};

export default FloatingActionBar;

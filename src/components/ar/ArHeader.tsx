
import React from 'react';
import { Button } from '@/components/ui/button';
import { CrdButton } from '@/components/ui/crd-button';
import { ChevronLeft, Share2, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface ArHeaderProps {
  onExitAr: () => void;
  onToggleSelector: () => void;
  onRemoveSelected: () => void;
  selectedCardId: string | null;
}

const ArHeader: React.FC<ArHeaderProps> = ({
  onExitAr,
  onToggleSelector,
  onRemoveSelected,
  selectedCardId
}) => {
  return (
    <>
      {/* Add/Remove Card Buttons */}
      <div className="absolute top-16 right-4 z-50 flex flex-col gap-2">
        <CrdButton
          variant="outline"
          size="icon"
          className="bg-black/50 text-white border-white/20 transition-all hover:bg-black/70"
          onClick={onToggleSelector}
          aria-label="Add card"
        >
          <Plus className="h-4 w-4" />
        </CrdButton>
        
        {selectedCardId && (
          <CrdButton
            variant="outline"
            size="icon"
            className="bg-black/50 text-white border-white/20 transition-all hover:bg-black/70"
            onClick={onRemoveSelected}
            aria-label="Remove card"
          >
            <Trash2 className="h-4 w-4" />
          </CrdButton>
        )}
      </div>
      
      {/* Exit AR Button */}
      <CrdButton
        variant="outline"
        size="sm"
        className="absolute top-4 left-4 z-50 bg-black/50 text-white border-white/20 transition-all hover:bg-black/70"
        onClick={onExitAr}
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        <span className="crd-text-medium">Exit AR</span>
      </CrdButton>
      
      {/* Share Button */}
      <CrdButton
        variant="outline"
        size="icon"
        className="absolute top-4 right-4 z-50 bg-black/50 text-white border-white/20 transition-all hover:bg-black/70"
        onClick={() => toast.success('Sharing options opened')}
        aria-label="Share"
      >
        <Share2 className="h-4 w-4" />
      </CrdButton>
      
      {/* Mouse instructions */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-40 bg-black/40 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm crd-text-small">
        Mouse drag to move • Fast mouse movement to spin cards
      </div>
    </>
  );
};

export default ArHeader;

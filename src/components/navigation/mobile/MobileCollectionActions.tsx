
import React from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Collection } from '@/lib/types';
import { Edit, Trash2, Share2, Plus, MoreVertical } from 'lucide-react';
import { MobileTouchButton } from '@/components/ui/mobile-controls';

interface MobileCollectionActionsProps {
  collection: Collection;
  onEdit: () => void;
  onDelete: () => void;
  onShare: () => void;
  onAddCards?: () => void;
}

const MobileCollectionActions = ({
  collection,
  onEdit,
  onDelete,
  onShare,
  onAddCards
}: MobileCollectionActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <MobileTouchButton variant="ghost" size="sm" hapticFeedback>
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Actions</span>
        </MobileTouchButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
          <Edit className="h-4 w-4 mr-2" />
          Edit Collection
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onShare} className="cursor-pointer">
          <Share2 className="h-4 w-4 mr-2" />
          Share Collection
        </DropdownMenuItem>
        {onAddCards && (
          <DropdownMenuItem onClick={onAddCards} className="cursor-pointer">
            <Plus className="h-4 w-4 mr-2" />
            Add Cards
          </DropdownMenuItem>
        )}
        <DropdownMenuItem 
          onClick={onDelete} 
          className="cursor-pointer text-red-500 focus:text-red-500"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Collection
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MobileCollectionActions;

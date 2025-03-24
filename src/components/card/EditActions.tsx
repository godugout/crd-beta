
import React from 'react';
import { Edit, Share2, Tag, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface EditActionsProps {
  onFlip: (e: React.MouseEvent) => void;
  onShare: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
}

export const EditActions: React.FC<EditActionsProps> = ({ 
  onFlip, 
  onShare, 
  onDelete 
}) => {
  return (
    <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
      <div className="flex space-x-2 bg-white/90 backdrop-blur-sm rounded-full p-1.5 shadow-subtle">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            toast.info('Edit feature coming soon');
          }}
          className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
          title="Edit"
        >
          <Edit size={16} className="text-cardshow-slate" />
        </button>
        <button 
          onClick={onShare}
          className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
          title="Share"
        >
          <Share2 size={16} className="text-cardshow-slate" />
        </button>
        <button 
          onClick={onFlip}
          className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
          title="Flip card"
        >
          <Tag size={16} className="text-cardshow-slate" />
        </button>
        <button 
          onClick={onDelete}
          className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
          title="Delete"
        >
          <Trash2 size={16} className="text-red-500" />
        </button>
      </div>
    </div>
  );
};

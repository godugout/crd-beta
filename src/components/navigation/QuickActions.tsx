
import React from 'react';
import { Eye, Copy, Share, Edit, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface QuickActionsProps {
  cardId: string;
  onView?: () => void;
  onEdit?: () => void;
  onShare?: () => void;
  onDuplicate?: () => void;
  onFavorite?: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  cardId,
  onView,
  onEdit,
  onShare,
  onDuplicate,
  onFavorite
}) => {
  const navigate = useNavigate();

  const handleView = () => {
    if (onView) {
      onView();
    } else {
      navigate(`/immersive/${cardId}`);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit();
    } else {
      navigate(`/cards/edit/${cardId}`);
    }
  };

  const handleShare = () => {
    if (onShare) {
      onShare();
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/card/${cardId}`);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleDuplicate = () => {
    if (onDuplicate) {
      onDuplicate();
    } else {
      navigate(`/cards/create?duplicate=${cardId}`);
    }
  };

  const handleFavorite = () => {
    if (onFavorite) {
      onFavorite();
    } else {
      toast.success('Added to favorites!');
    }
  };

  return (
    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
      <div className="flex items-center space-x-2">
        <Button
          size="sm"
          variant="secondary"
          onClick={handleView}
          className="h-8 w-8 p-0 rounded-full bg-white/90 hover:bg-white"
        >
          <Eye className="h-4 w-4" />
        </Button>
        
        <Button
          size="sm"
          variant="secondary"
          onClick={handleEdit}
          className="h-8 w-8 p-0 rounded-full bg-white/90 hover:bg-white"
        >
          <Edit className="h-4 w-4" />
        </Button>
        
        <Button
          size="sm"
          variant="secondary"
          onClick={handleDuplicate}
          className="h-8 w-8 p-0 rounded-full bg-white/90 hover:bg-white"
        >
          <Copy className="h-4 w-4" />
        </Button>
        
        <Button
          size="sm"
          variant="secondary"
          onClick={handleShare}
          className="h-8 w-8 p-0 rounded-full bg-white/90 hover:bg-white"
        >
          <Share className="h-4 w-4" />
        </Button>
        
        <Button
          size="sm"
          variant="secondary"
          onClick={handleFavorite}
          className="h-8 w-8 p-0 rounded-full bg-white/90 hover:bg-white"
        >
          <Heart className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default QuickActions;

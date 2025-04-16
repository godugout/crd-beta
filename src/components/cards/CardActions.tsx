
import React from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Edit, Trash2, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CardActionsProps {
  /**
   * Function to call when "View" button is clicked
   */
  onView?: () => void;
  
  /**
   * Function to call when "Edit" button is clicked
   */
  onEdit?: () => void;
  
  /**
   * Function to call when "Share" button is clicked
   */
  onShare?: () => void;
  
  /**
   * Function to call when "Delete" button is clicked
   */
  onDelete?: () => void;
  
  /**
   * Optional className for styling
   */
  className?: string;
  
  /**
   * Variant style for the buttons
   * @default "outline"
   */
  variant?: "default" | "outline" | "secondary" | "ghost";
  
  /**
   * Size of the buttons
   * @default "sm"
   */
  size?: "default" | "sm" | "lg" | "icon";
}

/**
 * Component that renders action buttons for cards
 */
const CardActions: React.FC<CardActionsProps> = ({
  onView,
  onEdit,
  onShare,
  onDelete,
  className,
  variant = "outline",
  size = "sm"
}) => {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {onView && (
        <Button 
          variant={variant} 
          size={size}
          onClick={onView}
          className="flex items-center"
        >
          <Eye className="h-4 w-4 mr-1" />
          View
        </Button>
      )}
      
      {onEdit && (
        <Button 
          variant={variant} 
          size={size}
          onClick={onEdit}
          className="flex items-center"
        >
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
      )}
      
      {onShare && (
        <Button 
          variant={variant} 
          size={size}
          onClick={onShare}
          className="flex items-center"
        >
          <Share2 className="h-4 w-4 mr-1" />
          Share
        </Button>
      )}
      
      {onDelete && (
        <Button 
          variant={variant} 
          size={size}
          onClick={onDelete}
          className="flex items-center text-red-600 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      )}
    </div>
  );
};

export default CardActions;

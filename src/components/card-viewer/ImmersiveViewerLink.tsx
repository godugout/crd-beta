
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Maximize2 } from 'lucide-react';
import { Card } from '@/lib/types';

interface ImmersiveViewerLinkProps {
  card: Card;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

const ImmersiveViewerLink: React.FC<ImmersiveViewerLinkProps> = ({
  card,
  variant = 'default',
  size = 'default',
  className
}) => {
  const navigate = useNavigate();
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/immersive-viewer/${card.id}`);
  };
  
  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleClick}
    >
      <Maximize2 className="h-4 w-4 mr-2" />
      Immersive View
    </Button>
  );
};

export default ImmersiveViewerLink;

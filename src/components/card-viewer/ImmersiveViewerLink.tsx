
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/lib/types';
import { Box } from 'lucide-react';

interface ImmersiveViewerLinkProps {
  card: Card;
  className?: string;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'secondary';
}

const ImmersiveViewerLink: React.FC<ImmersiveViewerLinkProps> = ({ 
  card, 
  className, 
  size = 'default',
  variant = 'default'
}) => {
  const navigate = useNavigate();

  const handleViewIn3D = () => {
    navigate(`/cards/${card.id}/immersive`);
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleViewIn3D}
    >
      <Box className="mr-2 h-4 w-4" />
      View in 3D
    </Button>
  );
};

export default ImmersiveViewerLink;


import React from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const CreateButton: React.FC = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <Button 
      asChild
      variant="gradient" 
      size={isMobile ? "icon" : "default"}
      className="mr-4"
    >
      <Link to="/cards/create">
        <Plus className="h-4 w-4" />
        {!isMobile && <span>Create</span>}
      </Link>
    </Button>
  );
};

export default CreateButton;

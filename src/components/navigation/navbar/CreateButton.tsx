
import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import { CrdButton } from '@/components/ui/crd-button';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const CreateButton: React.FC = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <CrdButton 
      asChild
      variant="spectrum" 
      size={isMobile ? "sm" : "sm"}
      className={`${isMobile ? 'px-3' : 'px-4'}`}
    >
      <Link to="/cards/create" className="flex items-center">
        <PlusCircle className="h-4 w-4 mr-1" />
        {!isMobile && <span>Card</span>}
      </Link>
    </CrdButton>
  );
};

export default CreateButton;

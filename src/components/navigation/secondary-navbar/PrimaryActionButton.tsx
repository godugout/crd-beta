
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface PrimaryActionProps {
  action: {
    label: string;
    icon?: React.ReactNode;
    onClick?: () => void;
    href?: string;
  };
  isCollapsed: boolean;
}

export const PrimaryActionButton: React.FC<PrimaryActionProps> = ({ 
  action,
  isCollapsed
}) => {
  if (isCollapsed) return null;
  
  return (
    <Button asChild className="bg-athletics-gold text-gray-900 hover:bg-athletics-gold-dark mr-2">
      {action.href ? (
        <Link to={action.href}>
          {action.icon}
          {action.label}
        </Link>
      ) : (
        <button onClick={action.onClick}>
          {action.icon}
          {action.label}
        </button>
      )}
    </Button>
  );
};

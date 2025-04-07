
import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface QuickMomentCardProps {
  title: string;
  icon: string;
  onClick: () => void;
  className?: string;
}

const QuickMomentCard: React.FC<QuickMomentCardProps> = ({
  title,
  icon,
  onClick,
  className
}) => {
  return (
    <Card 
      className={cn(
        "p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors h-24",
        className
      )}
      onClick={onClick}
    >
      <div className="text-2xl mb-2">{icon}</div>
      <p className="text-sm font-medium text-center">{title}</p>
    </Card>
  );
};

export default QuickMomentCard;


import React from 'react';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import NavigationItem from './NavigationItem';
import { NavigationGroup as NavGroupType } from './types';

interface NavigationGroupProps {
  group: NavGroupType;
  isCurrentSection: boolean;
  isLastGroup: boolean;
  isActive: (path: string) => boolean;
  onNavigate: (path: string) => void;
}

const NavigationGroup: React.FC<NavigationGroupProps> = ({
  group,
  isCurrentSection,
  isLastGroup,
  isActive,
  onNavigate
}) => {
  return (
    <div className={cn(
      "px-2 mb-4",
      // Highlight current section
      isCurrentSection ? "bg-muted/50 rounded-md" : ""
    )}>
      <p className="px-4 py-2 text-xs font-semibold text-muted-foreground">{group.title}</p>
      
      {group.items.map((item) => (
        <NavigationItem 
          key={item.path}
          item={item}
          isActive={isActive(item.path)}
          onNavigate={onNavigate}
        />
      ))}
      
      {!isLastGroup && <Separator className="my-2" />}
    </div>
  );
};

export default NavigationGroup;


import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { MobileTouchButton } from '@/components/ui/mobile-controls';
import { NavigationItem as NavItemType } from './types';

interface NavigationItemProps {
  item: NavItemType;
  isActive: boolean;
  onNavigate: (path: string) => void;
}

const NavigationItem: React.FC<NavigationItemProps> = ({ item, isActive, onNavigate }) => {
  return (
    <MobileTouchButton
      variant="ghost"
      className={cn(
        "w-full justify-start mb-1",
        item.highlight && "bg-[#EFB21E]/10 text-[#006341] font-medium",
        item.title === 'Dugout Labs' && "bg-amber-50 text-amber-700",
        isActive && "bg-muted font-medium"
      )}
      onClick={() => onNavigate(item.path)}
      hapticFeedback={false}
    >
      <Link to={item.path} className="flex items-center w-full">
        <item.icon className="h-5 w-5 mr-3" />
        {item.title}
      </Link>
    </MobileTouchButton>
  );
};

export default NavigationItem;

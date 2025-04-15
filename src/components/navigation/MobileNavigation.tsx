
import React from 'react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth'; // Use our modified hook

import { navigationGroups } from './mobile/navigationData';
import NavigationGroup from './mobile/NavigationGroup';
import NavigationFooter from './mobile/NavigationFooter';
import { useNavigationSection } from './mobile/useNavigationSection';

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ isOpen, onClose }) => {
  const auth = useAuth();
  const { user, signOut } = auth;
  const { isActive, currentSection } = useNavigationSection();
  
  // Handle navigation and closing menu
  const handleNavigate = (path: string) => {
    onClose();
  };

  // Handle sign out
  const handleSignOut = async () => {
    if (signOut) {
      await signOut();
      onClose();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0">
        <div className="flex flex-col h-full">
          <SheetHeader className="p-4 text-left border-b">
            <SheetTitle>CardShow</SheetTitle>
          </SheetHeader>
          
          {/* Back button for easy one-handed operation */}
          <div className="px-4 py-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start text-muted-foreground"
              onClick={onClose}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
          
          {/* Navigation sections */}
          <div className="flex-1 overflow-auto py-2">
            {navigationGroups.map((group, groupIndex) => (
              <NavigationGroup
                key={group.title}
                group={group}
                isCurrentSection={group.title === currentSection}
                isLastGroup={groupIndex === navigationGroups.length - 1}
                isActive={isActive}
                onNavigate={handleNavigate}
              />
            ))}
          </div>
          
          {/* Footer with authentication */}
          <NavigationFooter
            onSignOut={handleSignOut}
            onClose={onClose}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavigation;

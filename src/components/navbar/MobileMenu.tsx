
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { User } from '@/lib/types';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSignOut: () => Promise<void>;
  user?: User;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, onSignOut, user }) => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await onSignOut();
    onClose();
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>CardShow</SheetTitle>
          <SheetDescription>
            Explore your digital card collection
          </SheetDescription>
        </SheetHeader>
        
        {user && (
          <div className="flex items-center space-x-4 py-4">
            <Avatar className="h-10 w-10">
              <div className="bg-gray-200 h-full w-full flex items-center justify-center text-gray-800 font-medium">
                {user.name ? user.name.charAt(0).toUpperCase() : '?'}
              </div>
            </Avatar>
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
        )}
        
        <Separator className="my-4" />
        
        <div className="grid gap-1 py-2">
          <Button variant="ghost" onClick={() => handleNavigation("/")}>Home</Button>
          <Button variant="ghost" onClick={() => handleNavigation("/gallery")}>Cards</Button>
          <Button variant="ghost" onClick={() => handleNavigation("/collections")}>Collections</Button>
          <Button variant="ghost" onClick={() => handleNavigation("/packs")}>Memory Packs</Button>
          <Button variant="ghost" onClick={() => handleNavigation("/editor")}>Create Card</Button>
          <Button variant="ghost" onClick={() => handleNavigation("/oakland")}>Oakland A's</Button>
          <Button variant="ghost" onClick={() => handleNavigation("/gameday")} className="bg-[#EFB21E]/10 text-[#006341] font-medium">
            Game Day Mode
          </Button>
        </div>
        
        <Separator className="my-4" />
        
        <div className="grid gap-1 py-2">
          <Button variant="ghost" onClick={() => handleNavigation("/ar-card-viewer")}>AR Card Viewer</Button>
          <Button variant="ghost" onClick={() => handleNavigation("/card-comparison")}>Card Comparison</Button>
          <Button variant="ghost" onClick={() => handleNavigation("/animation")}>Card Animation</Button>
          <Button variant="ghost" onClick={() => handleNavigation("/pbr")}>PBR Demo</Button>
        </div>
        
        <SheetFooter className="absolute bottom-0 left-0 right-0 p-4 border-t">
          {user ? (
            <Button variant="outline" className="w-full" onClick={handleSignOut}>Sign Out</Button>
          ) : (
            <Button className="w-full" onClick={() => handleNavigation("/auth")}>Sign In</Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;


import React from 'react';
import { Link } from 'react-router-dom';
import { Grid3X3, FolderOpen, Image, LogOut, UserIcon, Sparkles } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User as UserType } from '@/lib/types';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface MobileMenuProps {
  user: UserType | null;
  isOpen: boolean;
  onClose: () => void;
  onSignOut: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ user, isOpen, onClose, onSignOut }) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
      <div className="px-4 py-2 space-y-1">
        {user ? (
          <>
            <div className="border-b border-gray-100 py-4 mb-2">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatarUrl || undefined} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-cardshow-slate truncate max-w-[200px]">{user.email}</div>
                </div>
              </div>
            </div>
            
            <Link 
              to="/gallery" 
              className="flex items-center py-3 px-2 hover:bg-gray-50 rounded-md"
              onClick={onClose}
            >
              <Grid3X3 size={18} className="mr-3 text-cardshow-slate" />
              <span>Gallery</span>
            </Link>
            
            <Link 
              to="/collections" 
              className="flex items-center py-3 px-2 hover:bg-gray-50 rounded-md"
              onClick={onClose}
            >
              <FolderOpen size={18} className="mr-3 text-cardshow-slate" />
              <span>Collections</span>
            </Link>
            
            <Link 
              to="/editor" 
              className="flex items-center py-3 px-2 hover:bg-gray-50 rounded-md"
              onClick={onClose}
            >
              <Image size={18} className="mr-3 text-cardshow-slate" />
              <span>Create New Card</span>
            </Link>
            
            <Accordion type="single" collapsible className="border-0">
              <AccordionItem value="demos" className="border-0">
                <AccordionTrigger className="py-3 px-2 hover:bg-gray-50 rounded-md">
                  <div className="flex items-center">
                    <Sparkles size={18} className="mr-3 text-cardshow-slate" />
                    <span>Demos</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <Link 
                    to="/signature" 
                    className="flex items-center py-2 pl-8 pr-2 hover:bg-gray-50 rounded-md"
                    onClick={onClose}
                  >
                    <span>Signature Demo</span>
                  </Link>
                  <Link 
                    to="/pbr" 
                    className="flex items-center py-2 pl-8 pr-2 hover:bg-gray-50 rounded-md"
                    onClick={onClose}
                  >
                    <span>PBR Demo</span>
                  </Link>
                  <Link 
                    to="/card-detector" 
                    className="flex items-center py-2 pl-8 pr-2 hover:bg-gray-50 rounded-md"
                    onClick={onClose}
                  >
                    <span>Card Detector</span>
                  </Link>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            <Separator className="my-2" />
            
            <button 
              onClick={() => {
                onSignOut();
                onClose();
              }} 
              className="flex items-center py-3 px-2 hover:bg-gray-50 rounded-md w-full text-left"
            >
              <LogOut size={18} className="mr-3 text-cardshow-slate" />
              <span>Sign Out</span>
            </button>
          </>
        ) : (
          <>
            <Link 
              to="/auth" 
              className="flex items-center py-3 px-2 hover:bg-gray-50 rounded-md"
              onClick={onClose}
            >
              <UserIcon size={18} className="mr-3 text-cardshow-slate" />
              <span>Sign In</span>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;

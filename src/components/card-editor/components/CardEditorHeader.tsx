
import React from 'react';
import { Button } from '@/components/ui/button';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { FlaskConical } from 'lucide-react';

interface CardEditorHeaderProps {
  title: string;
}

const CardEditorHeader: React.FC<CardEditorHeaderProps> = ({ title }) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl md:text-4xl font-bold">{title} <span className="text-orange-500">CRD</span></h1>
      <div className="flex items-center gap-3">
        <Button variant="outline" size={isMobile ? "sm" : "default"} className="hidden md:flex">Switch to Multiple</Button>
        <Button 
          variant="outline" 
          size={isMobile ? "sm" : "default"}
          className="text-amber-600 border-amber-200 bg-amber-50 hover:bg-amber-100"
        >
          <FlaskConical className="h-4 w-4 mr-2" />
          Labs Mode
        </Button>
      </div>
    </div>
  );
};

export default CardEditorHeader;

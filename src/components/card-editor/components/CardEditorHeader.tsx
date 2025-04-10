
import React from 'react';
import { Button } from '@/components/ui/button';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import LabsButton from '@/components/navigation/components/LabsButton';

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
        <LabsButton variant="highlight" className={isMobile ? "scale-90" : ""} />
      </div>
    </div>
  );
};

export default CardEditorHeader;

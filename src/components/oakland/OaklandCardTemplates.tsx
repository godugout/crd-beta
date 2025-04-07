
import React from 'react';
import { cn } from '@/lib/utils';

export type OaklandTemplateType = 'classic' | 'moneyball' | 'dynasty' | 'coliseum' | 'tailgate';

interface OaklandCardTemplateProps {
  type: OaklandTemplateType;
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void; // Add onClick handler prop
}

const OaklandCardTemplate: React.FC<OaklandCardTemplateProps> = ({
  type,
  className,
  children,
  onClick
}) => {
  const getTemplateStyles = () => {
    switch (type) {
      case 'classic':
        return 'bg-gradient-to-br from-[#003831] to-[#006341] border-[#EFB21E] border-4';
      case 'moneyball':
        return 'bg-gradient-to-r from-[#003831] via-[#004C35] to-[#003831] border-[#FFFFFF] border-2';
      case 'dynasty':
        return 'bg-gradient-to-b from-[#003831] to-[#006341] border-[#EFB21E] border-[6px] shadow-xl';
      case 'coliseum':
        return 'bg-[url("/oakland/coliseum-bg.jpg")] bg-cover bg-center border-[#EFB21E] border-2';
      case 'tailgate':
        return 'bg-[url("/oakland/tailgate-bg.jpg")] bg-cover bg-center border-[#003831] border-4';
      default:
        return 'bg-gradient-to-br from-[#003831] to-[#006341] border-[#EFB21E] border-2';
    }
  };

  return (
    <div 
      className={cn(
        "relative rounded-xl overflow-hidden aspect-[2.5/3.5] flex flex-col",
        getTemplateStyles(),
        className
      )}
      onClick={onClick} // Add onClick handler
    >
      {children}
    </div>
  );
};

export default OaklandCardTemplate;

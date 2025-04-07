
import React from 'react';
import { cn } from '@/lib/utils';
import { Baseball, Trophy, ChartBar, Stadium, Users } from 'lucide-react';

export type OaklandTemplateType = 'classic' | 'moneyball' | 'dynasty' | 'coliseum' | 'tailgate';

export interface OaklandTemplateMetadata {
  name: string;
  description: string;
  icon: React.ReactNode;
  years: string;
}

export const oaklandTemplates: Record<OaklandTemplateType, OaklandTemplateMetadata> = {
  classic: {
    name: 'Classic A\'s',
    description: 'Traditional green and gold design with clean borders',
    icon: <Baseball className="h-5 w-5" />,
    years: '1968-Present'
  },
  dynasty: {
    name: '70s Dynasty',
    description: 'Celebrating the championship era of the 1970s',
    icon: <Trophy className="h-5 w-5" />,
    years: '1972-1974'
  },
  moneyball: {
    name: 'Moneyball',
    description: 'Minimal design inspired by the analytical revolution',
    icon: <ChartBar className="h-5 w-5" />,
    years: '2002'
  },
  coliseum: {
    name: 'Coliseum',
    description: 'Tribute to the Oakland Coliseum and its history',
    icon: <Stadium className="h-5 w-5" />,
    years: '1968-2024'
  },
  tailgate: {
    name: 'Tailgate',
    description: 'Celebrating the fan experience in the parking lot',
    icon: <Users className="h-5 w-5" />,
    years: 'All Years'
  }
};

interface OaklandCardTemplateProps {
  type: OaklandTemplateType;
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
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
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default OaklandCardTemplate;

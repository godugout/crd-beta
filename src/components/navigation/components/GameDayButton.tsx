
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface GameDayButtonProps {
  className?: string;
}

const GameDayButton: React.FC<GameDayButtonProps> = ({ className }) => {
  return (
    <Link
      to="/game-day"
      className={cn(
        "text-[#006341] bg-[#EFB21E]/10 hover:bg-[#EFB21E]/20",
        "px-3 py-2 rounded-md text-sm font-medium transition-colors",
        className
      )}
    >
      Game Day Mode
    </Link>
  );
};

export default GameDayButton;

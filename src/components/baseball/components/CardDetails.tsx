
import React from 'react';
import { Award, Calendar, Copyright, Crop, Flame, Info, Medal, DollarSign, Timer, Users, Eye } from 'lucide-react';
import { CardData } from '../types/BaseballCard';
import { Button } from '@/components/ui/button';

interface CardDetailsProps {
  card: CardData;
}

const CardDetails: React.FC<CardDetailsProps> = ({ card }) => {
  return (
    <div className="absolute top-1/2 right-4 transform -translate-y-1/2 w-64 md:w-80 bg-black/60 backdrop-blur-md p-4 rounded-lg border-l-4 border-blue-500 text-white">
      <h3 className="text-lg font-bold flex items-center mb-4">
        <Info className="mr-2 h-5 w-5 text-blue-400" /> Auction Details
      </h3>
      
      <div className="space-y-3 text-sm">
        <div className="flex items-center">
          <DollarSign className="mr-2 h-4 w-4 text-green-400" />
          <span className="text-gray-400">Current Bid:</span>
          <span className="ml-auto font-medium text-green-400">{card.value}</span>
        </div>
        
        <div className="flex items-center">
          <Timer className="mr-2 h-4 w-4 text-blue-400" />
          <span className="text-gray-400">Time Left:</span>
          <span className="ml-auto font-medium">12:45</span>
        </div>
        
        <div className="flex items-center">
          <Users className="mr-2 h-4 w-4 text-blue-400" />
          <span className="text-gray-400">Total Bidders:</span>
          <span className="ml-auto font-medium">24</span>
        </div>
        
        <div className="flex items-center">
          <Eye className="mr-2 h-4 w-4 text-blue-400" />
          <span className="text-gray-400">Watching:</span>
          <span className="ml-auto font-medium">156</span>
        </div>
        
        <div className="flex items-center">
          <Award className="mr-2 h-4 w-4 text-yellow-400" />
          <span className="text-gray-400">Condition:</span>
          <span className="ml-auto font-medium">{card.condition}</span>
        </div>
        
        <div className="flex items-center">
          <Calendar className="mr-2 h-4 w-4 text-blue-400" />
          <span className="text-gray-400">Year:</span>
          <span className="ml-auto font-medium">{card.year}</span>
        </div>

        <div className="pt-4">
          <Button className="w-full bg-green-600 hover:bg-green-700">
            Place Bid
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CardDetails;

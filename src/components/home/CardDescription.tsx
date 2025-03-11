
import React from 'react';
import { Share2, Upload } from 'lucide-react';
import { CardData } from '@/types/card';
import { Button } from '@/components/ui/button';

interface CardDescriptionProps {
  card: CardData;
}

const CardDescription = ({ card }: CardDescriptionProps) => {
  return (
    <div className="bg-white p-6 shadow-md mt-6 rounded-lg">
      <h2 className="text-xl font-bold mb-2">{card.name}</h2>
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">{card.team}</span>
        <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">#{card.jersey}</span>
        <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">{card.year}</span>
      </div>
      <p className="text-gray-700 mb-6">{card.description}</p>
      
      <div className="flex flex-wrap gap-4">
        <Button className="flex items-center" variant="default">
          <Share2 className="mr-2 h-4 w-4" />
          Share Card
        </Button>
        <Button className="flex items-center" variant="secondary">
          <Upload className="mr-2 h-4 w-4" />
          Download
        </Button>
      </div>
    </div>
  );
};

export default CardDescription;

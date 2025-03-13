
import React, { useState } from 'react';
import { Share2, Upload, Heart } from 'lucide-react';
import { CardData } from '@/types/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface CardDescriptionProps {
  card: CardData;
}

const CardDescription = ({ card }: CardDescriptionProps) => {
  const [isLiked, setIsLiked] = useState(false);
  
  const handleShare = () => {
    // In a real implementation, this would use the Web Share API
    // or copy a link to the clipboard
    navigator.clipboard.writeText(`Check out this awesome card: ${card.name} #${card.jersey}`);
    toast.success('Link copied to clipboard!');
  };
  
  const handleDownload = () => {
    // In a real implementation, this would generate and download the card
    toast.success('Card download started!');
  };
  
  const handleLike = () => {
    setIsLiked(!isLiked);
    toast.success(isLiked ? 'Removed from favorites' : 'Added to favorites!');
  };
  
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
        <Button className="flex items-center" variant="default" onClick={handleShare}>
          <Share2 className="mr-2 h-4 w-4" />
          Share Card
        </Button>
        <Button className="flex items-center" variant="secondary" onClick={handleDownload}>
          <Upload className="mr-2 h-4 w-4" />
          Download
        </Button>
        <Button 
          className={`flex items-center ${isLiked ? 'bg-pink-500 hover:bg-pink-600' : ''}`} 
          variant={isLiked ? "default" : "outline"}
          onClick={handleLike}
        >
          <Heart className={`mr-2 h-4 w-4 ${isLiked ? 'fill-white' : ''}`} />
          {isLiked ? 'Favorited' : 'Add to Favorites'}
        </Button>
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-100">
        <h3 className="font-medium text-sm text-gray-600 mb-2">Card Details</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-gray-500">Card Type:</span> 
            <span className="ml-1">{card.cardType}</span>
          </div>
          <div>
            <span className="text-gray-500">Artist:</span> 
            <span className="ml-1">{card.artist}</span>
          </div>
          <div>
            <span className="text-gray-500">Set:</span> 
            <span className="ml-1">{card.set}</span>
          </div>
          <div>
            <span className="text-gray-500">Card Number:</span> 
            <span className="ml-1">{card.cardNumber}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDescription;

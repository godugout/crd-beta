
import React, { useState } from 'react';
import { useCards } from '@/context/CardContext';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, 
  Share2, 
  Download, 
  Heart, 
  Edit2,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { DetailedViewCard, ensureDetailedViewCard } from '@/types/detailedCardTypes';

interface CardDetailViewProps {
  cardId: string;
  onBack: () => void;
}

const CardDetailView: React.FC<CardDetailViewProps> = ({ cardId, onBack }) => {
  const { getCard, deleteCard } = useCards();
  const [liked, setLiked] = useState(false);
  
  const rawCardData = getCard(cardId);
  // Ensure we have a properly formatted card with all required fields
  const cardData = rawCardData ? ensureDetailedViewCard(rawCardData) : null;
  
  if (!cardData) {
    return (
      <div className="p-8 text-center">
        <p>Card not found</p>
        <Button onClick={onBack} className="mt-4">
          Back to Gallery
        </Button>
      </div>
    );
  }
  
  const handleLike = () => {
    setLiked(!liked);
    toast.success(liked ? 'Removed from favorites' : 'Added to favorites');
  };
  
  const handleShare = () => {
    // In a real app, implement sharing functionality
    navigator.clipboard.writeText(`Check out this card: ${cardData.title}`);
    toast.success('Link copied to clipboard');
  };
  
  const handleDownload = () => {
    // In a real app, implement download functionality
    toast.success('Downloading card...');
  };
  
  const handleDelete = () => {
    // In a real app, add confirmation dialog
    deleteCard(cardId);
    toast.success('Card deleted');
    onBack();
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  return (
    <div className="container mx-auto max-w-4xl px-4">
      <div className="mb-6">
        <Button
          variant="ghost"
          className="flex items-center text-gray-400 hover:text-white pl-0"
          onClick={onBack}
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Back to Gallery
        </Button>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Card display */}
        <div className="lg:w-2/3">
          <div className="flex justify-center">
            <div 
              className="aspect-[2.5/3.5] w-full max-w-md rounded-lg overflow-hidden"
              style={{
                borderRadius: cardData.designMetadata?.cardStyle?.borderRadius || '8px',
                boxShadow: `0 0 20px ${cardData.designMetadata?.cardStyle?.shadowColor || 'rgba(0,0,0,0.2)'}`,
                border: `${cardData.designMetadata?.cardStyle?.frameWidth || 2}px solid ${cardData.designMetadata?.cardStyle?.frameColor || '#000'}`,
              }}
            >
              <img 
                src={cardData.imageUrl} 
                alt={cardData.title} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <div className="flex justify-center gap-2 mt-6">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 text-gray-300"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 text-gray-300"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "flex items-center gap-2",
                liked ? "text-red-500 border-red-500" : "text-gray-300"
              )}
              onClick={handleLike}
            >
              <Heart className="h-4 w-4" fill={liked ? "currentColor" : "none"} />
              {liked ? 'Liked' : 'Like'}
            </Button>
          </div>
        </div>
        
        {/* Card info */}
        <div className="lg:w-1/3">
          <Card className="bg-gray-900 border-gray-700 text-white">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <h1 className="text-2xl font-bold">{cardData.title}</h1>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white"
                    onClick={handleDelete}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-gray-300">{cardData.description}</p>
              </div>
              
              <div className="mt-6 space-y-4">
                <div>
                  <h3 className="text-sm text-gray-400 uppercase">Card Type</h3>
                  <p className="text-white">{cardData.designMetadata?.cardMetadata?.cardType || 'Standard'}</p>
                </div>
                
                <div>
                  <h3 className="text-sm text-gray-400 uppercase">Category</h3>
                  <p className="text-white">{cardData.designMetadata?.cardMetadata?.category || 'General'}</p>
                </div>
                
                <div>
                  <h3 className="text-sm text-gray-400 uppercase">Series</h3>
                  <p className="text-white">{cardData.designMetadata?.cardMetadata?.series || 'Base'}</p>
                </div>
                
                <div>
                  <h3 className="text-sm text-gray-400 uppercase">Created</h3>
                  <p className="text-white">{formatDate(cardData.createdAt)}</p>
                </div>
                
                <div>
                  <h3 className="text-sm text-gray-400 uppercase">Tags</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {cardData.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="bg-gray-800 hover:bg-gray-700">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-8 space-y-4">
                <h3 className="text-sm text-gray-400 uppercase">Market Status</h3>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center p-2 bg-gray-800 rounded">
                    <p className="text-xs text-gray-400">Printable</p>
                    <p className="font-medium">{cardData.designMetadata?.marketMetadata?.isPrintable || false}</p>
                  </div>
                  <div className="text-center p-2 bg-gray-800 rounded">
                    <p className="text-xs text-gray-400">For Sale</p>
                    <p className="font-medium">{cardData.designMetadata?.marketMetadata?.isForSale || false}</p>
                  </div>
                  <div className="text-center p-2 bg-gray-800 rounded">
                    <p className="text-xs text-gray-400">In Catalog</p>
                    <p className="font-medium">{cardData.designMetadata?.marketMetadata?.includeInCatalog || false}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CardDetailView;

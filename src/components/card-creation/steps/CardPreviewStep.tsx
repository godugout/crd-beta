
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, Download, Share } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface CardPreviewStepProps {
  cardData: any;
  effectClasses: string;
  onSave: () => void;
}

const CardPreviewStep: React.FC<CardPreviewStepProps> = ({
  cardData,
  effectClasses,
  onSave
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Preview Your CRD</h2>
        <p className="text-gray-500 mb-4">
          Review your card before saving it to your collection
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div>
          <div className="aspect-[2.5/3.5] rounded-lg overflow-hidden shadow-xl"
            style={{
              backgroundColor: cardData.backgroundColor,
              borderRadius: cardData.borderRadius,
              borderColor: cardData.borderColor,
              borderWidth: '2px',
              borderStyle: 'solid',
            }}
          >
            <div className="relative w-full h-full">
              <img 
                src={cardData.imageUrl} 
                alt={cardData.title || "Card preview"} 
                className={`w-full h-full object-cover ${effectClasses}`}
              />
              
              {cardData.title && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                  <h3 className="text-white text-sm font-bold truncate">
                    {cardData.title}
                  </h3>
                  {cardData.player && (
                    <p className="text-white/80 text-xs truncate">
                      {cardData.player}
                      {cardData.team && ` • ${cardData.team}`}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-center gap-3 mt-4">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Download className="h-4 w-4" /> Download
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Share className="h-4 w-4" /> Share
            </Button>
          </div>
        </div>
        
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium text-lg mb-2">Card Details</h3>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Title</p>
                  <p className="font-medium">{cardData.title || 'Untitled Card'}</p>
                </div>
                
                {cardData.description && (
                  <div>
                    <p className="text-sm text-gray-500">Description</p>
                    <p>{cardData.description}</p>
                  </div>
                )}
                
                {(cardData.player || cardData.team) && (
                  <div className="flex gap-x-8">
                    {cardData.player && (
                      <div>
                        <p className="text-sm text-gray-500">Player</p>
                        <p>{cardData.player}</p>
                      </div>
                    )}
                    
                    {cardData.team && (
                      <div>
                        <p className="text-sm text-gray-500">Team</p>
                        <p>{cardData.team}</p>
                      </div>
                    )}
                  </div>
                )}
                
                {cardData.tags.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-500">Tags</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {cardData.tags.map((tag: string) => (
                        <span key={tag} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {(cardData.category || cardData.series) && (
                  <div className="flex gap-x-8">
                    {cardData.category && (
                      <div>
                        <p className="text-sm text-gray-500">Category</p>
                        <p>{cardData.category}</p>
                      </div>
                    )}
                    
                    {cardData.series && (
                      <div>
                        <p className="text-sm text-gray-500">Series</p>
                        <p>{cardData.series}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <div className="bg-gray-50 rounded-lg p-4 border">
            <h3 className="font-medium mb-2">Card Options</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${cardData.makePrintAvailable ? 'bg-green-500' : 'bg-gray-200'}`}>
                  {cardData.makePrintAvailable && <Check className="w-3 h-3 text-white" />}
                </div>
                <span>Available for printing</span>
              </li>
              <li className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${cardData.includeInCatalog ? 'bg-green-500' : 'bg-gray-200'}`}>
                  {cardData.includeInCatalog && <Check className="w-3 h-3 text-white" />}
                </div>
                <span>Include in CRD catalog</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end mt-6">
        <Button 
          onClick={onSave} 
          className="flex items-center gap-2"
          size="lg"
        >
          <Check className="h-4 w-4" /> Save CRD
        </Button>
      </div>
    </div>
  );
};

export default CardPreviewStep;

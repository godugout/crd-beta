
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FlipHorizontal, Download, Share } from 'lucide-react';
import { CardStyle } from './hooks/useCardEditorState';
import { toast } from 'sonner';
import '../card-editor/cardEffects.css';

interface CardPreviewProps {
  title: string;
  description: string;
  player: string;
  team: string;
  year: string;
  tags: string[];
  imageUrl: string;
  cardStyle: CardStyle;
  selectedEffects: string[];
}

const CardPreview: React.FC<CardPreviewProps> = ({
  title,
  description,
  player,
  team,
  year,
  tags,
  imageUrl,
  cardStyle,
  selectedEffects
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleShare = () => {
    toast.success('Sharing options opened');
  };

  const handleDownload = () => {
    toast.success('Card downloaded');
  };

  // Get effect classes based on selected effects
  const getEffectClasses = () => {
    const effectMap: Record<string, string> = {
      'refractor': 'card-refractor-effect',
      'prism': 'card-prism-effect',
      'chrome': 'card-chrome-effect',
      'gold': 'card-gold-effect',
      'vintage': 'card-vintage-effect',
      'standard': '',
      'modern': 'card-style-modern',
      'bold': 'card-style-bold',
      'minimal': 'card-style-minimal'
    };
    
    return selectedEffects
      .map(effect => effectMap[effect] || '')
      .filter(className => className)
      .join(' ');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Card Preview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col items-center space-y-6">
          <div className="perspective-800 w-full max-w-[280px]">
            <div 
              className={`w-full relative preserve-3d transition-transform duration-700 ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
              style={{ aspectRatio: '2.5/3.5' }}
            >
              {/* Front of card */}
              <div 
                className="absolute w-full h-full backface-hidden"
                style={{ 
                  borderWidth: `${cardStyle.borderWidth}px`,
                  borderColor: cardStyle.borderColor,
                  borderStyle: 'solid',
                  borderRadius: cardStyle.borderRadius,
                  backgroundColor: cardStyle.backgroundColor
                }}
              >
                {imageUrl && (
                  <div className="relative w-full h-full">
                    <img 
                      src={imageUrl} 
                      alt="Card preview" 
                      className="w-full h-full object-cover"
                      style={{ 
                        borderRadius: cardStyle.borderWidth > 0 ? 
                          `calc(${cardStyle.borderRadius} - ${cardStyle.borderWidth}px)` : 
                          cardStyle.borderRadius,
                        filter: `brightness(${cardStyle.brightness}%) contrast(${cardStyle.contrast}%) saturate(${cardStyle.saturation}%)`
                      }}
                    />
                    {/* Apply all selected effects */}
                    {selectedEffects.map((effect, idx) => {
                      const effectClass = effect === 'refractor' ? 'card-refractor-effect' : 
                                          effect === 'prism' ? 'card-prism-effect' :
                                          effect === 'chrome' ? 'card-chrome-effect' :
                                          effect === 'gold' ? 'card-gold-effect' :
                                          effect === 'vintage' ? 'card-vintage-effect' : '';
                      return effectClass ? (
                        <div key={effect} className={`absolute inset-0 ${effectClass}`} style={{zIndex: 10 + idx}}></div>
                      ) : null;
                    })}
                    
                    {/* Card info overlay at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 z-20">
                      <h3 className="font-bold text-white text-lg leading-tight">{title}</h3>
                      
                      {player && (
                        <p className="text-white/90 text-sm mt-1">{player}</p>
                      )}
                      
                      {tags && tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {tags.slice(0, 3).map((tag, index) => (
                            <span 
                              key={index}
                              className="inline-flex text-xs bg-blue-500/80 text-white px-1.5 py-0.5 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Back of card */}
              <div 
                className="absolute w-full h-full backface-hidden rotate-y-180 bg-gray-100 p-4"
                style={{ 
                  borderWidth: `${cardStyle.borderWidth}px`,
                  borderColor: cardStyle.borderColor,
                  borderStyle: 'solid',
                  borderRadius: cardStyle.borderRadius,
                  backgroundColor: cardStyle.backgroundColor
                }}
              >
                <div className="h-full flex flex-col">
                  <h3 className="text-xl font-bold mb-2">{title}</h3>
                  
                  {(player || team || year) && (
                    <div className="mb-3 text-sm">
                      {player && <p><strong>Player:</strong> {player}</p>}
                      {team && <p><strong>Team:</strong> {team}</p>}
                      {year && <p><strong>Year:</strong> {year}</p>}
                    </div>
                  )}
                  
                  <p className="text-gray-700 text-sm flex-grow">{description}</p>
                  
                  {tags && tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-auto pt-2">
                      {tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="inline-flex text-xs bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleFlip}>
              <FlipHorizontal className="mr-2 h-4 w-4" />
              Flip Card
            </Button>
            <Button variant="outline" onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button variant="outline" onClick={handleShare}>
              <Share className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
        
        <div>
          <div className="bg-gray-50 rounded-lg p-6 border">
            <h3 className="text-lg font-semibold mb-4">Card Details</h3>
            
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">Title</dt>
                <dd className="text-gray-900 mt-1">{title || 'Untitled Card'}</dd>
              </div>
              
              {player && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Player</dt>
                  <dd className="text-gray-900 mt-1">{player}</dd>
                </div>
              )}
              
              {team && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Team</dt>
                  <dd className="text-gray-900 mt-1">{team}</dd>
                </div>
              )}
              
              {year && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Year</dt>
                  <dd className="text-gray-900 mt-1">{year}</dd>
                </div>
              )}
              
              {selectedEffects.length > 0 && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Special Effects</dt>
                  <dd className="text-gray-900 mt-1">
                    <div className="flex flex-wrap gap-1">
                      {selectedEffects.map((effect, index) => (
                        <span key={effect} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                          {effect.charAt(0).toUpperCase() + effect.slice(1)}
                        </span>
                      ))}
                    </div>
                  </dd>
                </div>
              )}
              
              {tags && tags.length > 0 && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Tags</dt>
                  <dd className="mt-1 flex flex-wrap gap-1">
                    {tags.map((tag, index) => (
                      <span key={index} className="bg-gray-100 px-2 py-1 rounded text-sm">
                        {tag}
                      </span>
                    ))}
                  </dd>
                </div>
              )}
              
              {description && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Description</dt>
                  <dd className="text-gray-900 mt-1 text-sm">{description}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardPreview;


import React from 'react';
import { Button } from '@/components/ui/button';

interface CardEditorPreviewProps {
  imageUrl: string;
  title: string;
  description: string;
  tags: string[];
  player?: string;
  team?: string;
  year?: string;
  cardStyle: {
    borderRadius: string;
    borderColor?: string;
    backgroundColor?: string;
    effect?: string;
  };
}

const CardEditorPreview: React.FC<CardEditorPreviewProps> = ({
  imageUrl,
  title,
  description,
  tags,
  player,
  team,
  year,
  cardStyle
}) => {
  return (
    <div className="bg-gray-900 rounded-lg p-4 md:p-6 text-white">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl">Preview</h3>
        <Button variant="ghost" size="icon" className="text-white">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 3H3M21 3L13 11M21 3V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21 13V21M21 21H13M21 21L13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Button>
      </div>
      
      {imageUrl ? (
        <div 
          className="aspect-[2.5/3.5] rounded-md overflow-hidden mb-4" 
          style={{
            borderRadius: cardStyle.borderRadius,
            borderColor: cardStyle.borderColor || '#48BB78',
            backgroundColor: cardStyle.backgroundColor || 'transparent',
            borderWidth: '2px',
            borderStyle: 'solid'
          }}
        >
          <img 
            src={imageUrl} 
            alt="Card preview" 
            className="w-full h-full object-cover" 
            style={{ 
              filter: cardStyle.effect === 'vintage' ? 'sepia(0.5)' : 
                    cardStyle.effect === 'chrome' ? 'contrast(1.1) brightness(1.1)' : 'none'
            }}
          />
        </div>
      ) : (
        <div className="aspect-[2.5/3.5] bg-gray-800 rounded-md flex items-center justify-center mb-4">
          <p className="text-gray-400">Upload an image to preview</p>
        </div>
      )}
      
      <div className="space-y-2">
        <h4 className="font-semibold text-xl">{title || "No title yet"}</h4>
        <p className="text-gray-300 text-sm">{description || "Add a description to your CRD"}</p>
        
        {/* Tags display */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {tags.map((tag: string, index: number) => (
              <span key={index} className="bg-gray-800 text-xs rounded-full px-2 py-1">{tag}</span>
            ))}
          </div>
        )}
        
        {/* Additional card details */}
        <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
          {player && (
            <div>
              <p className="text-gray-400">Player</p>
              <p>{player}</p>
            </div>
          )}
          {team && (
            <div>
              <p className="text-gray-400">Team</p>
              <p>{team}</p>
            </div>
          )}
          {year && (
            <div>
              <p className="text-gray-400">Year</p>
              <p>{year}</p>
            </div>
          )}
        </div>
      </div>
      
      <Button 
        variant="outline" 
        className="w-full mt-4 text-white border-white hover:bg-gray-800"
      >
        Add back
      </Button>
    </div>
  );
};

export default CardEditorPreview;


import React from 'react';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface CardPreviewProps {
  title: string;
  description: string;
  player: string;
  team: string;
  year: string;
  tags: string[];
  imageUrl: string;
  cardStyle: any;
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
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h3 className="font-semibold text-lg mb-4">Preview Your CRD</h3>
        
        {imageUrl ? (
          <div className={`aspect-[2.5/3.5] max-w-xs mx-auto border-2 border-litmus-green overflow-hidden 
            ${selectedEffects.includes('shadow') ? 'shadow-lg' : ''}
            ${selectedEffects.includes('glow') ? 'shadow-glow' : ''}
          `}
            style={{ 
              borderRadius: cardStyle.borderRadius,
              borderColor: cardStyle.borderColor || '#48BB78'
            }}
          >
            <img
              src={imageUrl}
              alt="Card preview"
              className={`w-full h-full object-cover
                ${selectedEffects.includes('texture') ? 'after:content-[""] after:absolute after:inset-0 after:bg-texture-overlay' : ''}
                ${selectedEffects.includes('shine') ? 'shimmer-effect' : ''}
              `}
              style={{ 
                borderRadius: `calc(${cardStyle.borderRadius} - 2px)`,
                filter: cardStyle.effect === 'vintage' ? 'sepia(0.5)' : 
                       cardStyle.effect === 'chrome' ? 'contrast(1.1) brightness(1.1)' : 'none'
              }}
            />
          </div>
        ) : (
          <div className="aspect-[2.5/3.5] max-w-xs mx-auto border border-dashed rounded-lg flex items-center justify-center bg-gray-50">
            <p className="text-gray-400">Upload an image to preview</p>
          </div>
        )}
      </div>
      
      <div className="space-y-4">
        <div>
          <Label className="text-sm text-gray-500">Title</Label>
          <h3 className="text-xl font-semibold">{title || "Untitled CRD"}</h3>
        </div>
        
        {description && (
          <div>
            <Label className="text-sm text-gray-500">Description</Label>
            <p className="text-gray-800">{description}</p>
          </div>
        )}
        
        <div className="grid grid-cols-3 gap-2">
          {player && (
            <div>
              <Label className="text-sm text-gray-500">Player</Label>
              <p className="text-gray-800">{player}</p>
            </div>
          )}
          
          {team && (
            <div>
              <Label className="text-sm text-gray-500">Team</Label>
              <p className="text-gray-800">{team}</p>
            </div>
          )}
          
          {year && (
            <div>
              <Label className="text-sm text-gray-500">Year</Label>
              <p className="text-gray-800">{year}</p>
            </div>
          )}
        </div>
        
        {tags.length > 0 && (
          <div>
            <Label className="text-sm text-gray-500">Tags</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
          </div>
        )}
        
        <div>
          <Label className="text-sm text-gray-500">Card Style</Label>
          <p className="text-gray-800 capitalize">{cardStyle.effect}</p>
        </div>
        
        {selectedEffects.length > 0 && (
          <div>
            <Label className="text-sm text-gray-500">Applied Effects</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {selectedEffects.map((effect) => (
                <Badge key={effect} variant="outline" className="capitalize">{effect}</Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardPreview;

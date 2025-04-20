
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getAssetBundle } from '@/lib/assetManager';
import { ChevronLeft, ChevronRight, Share, Download, Tag } from 'lucide-react';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';

interface AssetCardDisplayProps {
  bundleId: string;
  onClose?: () => void;
}

export const AssetCardDisplay: React.FC<AssetCardDisplayProps> = ({ 
  bundleId,
  onClose
}) => {
  const [bundle, setBundle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  useEffect(() => {
    const loadBundle = async () => {
      try {
        setLoading(true);
        const data = await getAssetBundle(bundleId);
        setBundle(data);
      } catch (err: any) {
        console.error('Error loading card:', err);
        setError(err.message || 'Failed to load card data');
      } finally {
        setLoading(false);
      }
    };
    
    loadBundle();
  }, [bundleId]);
  
  const handleNextImage = () => {
    if (bundle && bundle.media.length > activeImageIndex + 1) {
      setActiveImageIndex(activeImageIndex + 1);
    }
  };
  
  const handlePrevImage = () => {
    if (activeImageIndex > 0) {
      setActiveImageIndex(activeImageIndex - 1);
    }
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: bundle?.card?.title || 'Shared Card',
        text: bundle?.card?.description || 'Check out this card!',
        url: window.location.href
      }).catch(error => {
        console.error('Error sharing:', error);
        navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard');
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };
  
  const handleDownload = () => {
    if (bundle && bundle.media.length > 0) {
      const media = bundle.media[activeImageIndex];
      const imageUrl = `https://wxlwhqlbxyuyujhqeyur.supabase.co/storage/v1/object/public/card-images/${media.storage_path}`;
      
      const a = document.createElement('a');
      a.href = imageUrl;
      a.download = media.original_filename || 'card-image.jpg';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast.success('Downloading image...');
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Spinner size="lg" />
      </div>
    );
  }
  
  if (error || !bundle) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error || 'Failed to load card'}</p>
        {onClose && (
          <Button onClick={onClose} className="mt-4">
            Close
          </Button>
        )}
      </div>
    );
  }
  
  const card = bundle.card;
  const media = bundle.media;
  const activeMedia = media[activeImageIndex];
  const imageUrl = `https://wxlwhqlbxyuyujhqeyur.supabase.co/storage/v1/object/public/card-images/${activeMedia.storage_path}`;
  
  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="md:w-1/2 relative">
        <Card className="overflow-hidden">
          <div className="aspect-[2.5/3.5] bg-black relative">
            <img 
              src={imageUrl}
              alt={card.title}
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x400?text=Image+Error';
              }}
            />
            
            {media.length > 1 && (
              <div className="absolute inset-x-0 bottom-4 flex justify-center gap-1">
                {media.map((_, idx) => (
                  <button
                    key={idx}
                    className={`w-2 h-2 rounded-full ${
                      idx === activeImageIndex ? 'bg-white' : 'bg-white/40'
                    }`}
                    onClick={() => setActiveImageIndex(idx)}
                  />
                ))}
              </div>
            )}
          </div>
        </Card>
        
        {media.length > 1 && (
          <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-between px-2 pointer-events-none">
            {activeImageIndex > 0 && (
              <Button 
                variant="secondary"
                size="icon"
                className="pointer-events-auto rounded-full bg-white/80 hover:bg-white shadow-lg"
                onClick={handlePrevImage}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
            
            {activeImageIndex < media.length - 1 && (
              <Button 
                variant="secondary"
                size="icon"
                className="pointer-events-auto rounded-full bg-white/80 hover:bg-white shadow-lg"
                onClick={handleNextImage}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>
      
      <div className="md:w-1/2">
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-2xl font-bold">{card.title}</h2>
            
            {card.description && (
              <p className="text-gray-700">{card.description}</p>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              {card.team_id && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Team</h3>
                  <p>{card.team_id}</p>
                </div>
              )}
              
              {card.design_metadata?.year && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Year</h3>
                  <p>{card.design_metadata.year}</p>
                </div>
              )}
            </div>
            
            {card.tags && card.tags.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {card.tags.map((tag: string) => (
                    <div 
                      key={tag}
                      className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm flex items-center gap-1"
                    >
                      <Tag size={12} />
                      <span>{tag}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="pt-4 flex flex-wrap gap-3">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={handleShare}
              >
                <Share className="h-4 w-4" />
                Share
              </Button>
              
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
              
              {onClose && (
                <Button onClick={onClose}>
                  Close
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

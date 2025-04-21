
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useCards } from '@/context/CardContext';
import { ArrowLeft, Eye, Smartphone, Share2, Download } from 'lucide-react';
import { Card } from '@/lib/types';
import { sampleCards } from '@/lib/data/sampleCards';
import { toast } from '@/hooks/use-toast';
import { adaptToCard } from '@/lib/adapters/cardAdapter';
import { DEFAULT_DESIGN_METADATA } from '@/lib/utils/cardDefaults';
import { DetailedViewCard, ensureDetailedViewCard } from '@/types/detailedCardTypes';
import PageLayout from '@/components/navigation/PageLayout';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1518770660439-4636190af475';

const CardDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cards, getCard } = useCards();
  const [showViewer, setShowViewer] = useState(false);
  const [viewMode, setViewMode] = useState<'standard' | 'immersive' | 'ar'>('standard');
  const [resolvedCard, setResolvedCard] = useState<DetailedViewCard | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!id) {
      console.error('CardDetail: No ID provided in URL params');
      return;
    }
    
    console.log('CardDetail: Rendering for ID:', id);
    
    let foundCard = sampleCards.find(c => c.id === id);
    
    if (!foundCard) {
      console.log('CardDetail: Card not found in sampleCards, checking context for ID:', id);
      foundCard = getCard ? getCard(id) : cards.find(c => c.id === id);
    }
    
    if (foundCard) {
      console.log('CardDetail: Found card:', foundCard.title, 'with imageUrl:', foundCard.imageUrl);
      
      const processedCard = ensureDetailedViewCard(adaptToCard({
        ...foundCard,
        imageUrl: foundCard.imageUrl || FALLBACK_IMAGE,
        thumbnailUrl: foundCard.thumbnailUrl || foundCard.imageUrl || FALLBACK_IMAGE,
        designMetadata: foundCard.designMetadata || DEFAULT_DESIGN_METADATA,
        createdAt: foundCard.createdAt || new Date().toISOString(),
        updatedAt: foundCard.updatedAt || new Date().toISOString(),
        userId: foundCard.userId || 'anonymous',
        effects: foundCard.effects || []
      }));
      
      setResolvedCard(processedCard);
      
      if (processedCard.imageUrl && processedCard.imageUrl !== FALLBACK_IMAGE) {
        const img = new Image();
        img.onerror = () => {
          console.error('CardDetail: Image failed to preload:', processedCard.imageUrl);
          const updatedCard = ensureDetailedViewCard(adaptToCard({ 
            ...processedCard, 
            imageUrl: FALLBACK_IMAGE,
            thumbnailUrl: FALLBACK_IMAGE 
          }));
          setResolvedCard(updatedCard);
        };
        img.src = processedCard.imageUrl;
      }
    } else {
      console.error('CardDetail: Card not found at all for ID:', id);
      toast({
        title: "Card not found",
        description: "The requested card could not be found",
        variant: "destructive"
      });
    }
  }, [id, cards, getCard]);
  
  if (!resolvedCard) {
    return (
      <div className="min-h-screen bg-gray-900">
        <PageLayout
          title="Card Not Found"
          description="The requested card could not be found"
        >
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center mb-6">
              <Button variant="ghost" onClick={() => navigate(-1)} className="mr-2">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </Button>
            </div>
            
            <div className="text-center py-16">
              <h1 className="text-3xl font-bold mb-4">Card Not Found</h1>
              <p className="text-gray-600 mb-8">
                The card you're looking for doesn't exist or has been removed.
              </p>
              <Button onClick={() => navigate('/cards')}>
                Browse All Cards
              </Button>
            </div>
          </div>
        </PageLayout>
      </div>
    );
  }
  
  const handleViewImmersive = () => {
    navigate(`/immersive/${id}`);
  };
  
  const handleViewAR = () => {
    navigate(`/ar-card-viewer/${id}`);
  };
  
  const handleShare = () => {
    const shareUrl = window.location.href;
    
    if (navigator.share) {
      navigator.share({
        title: resolvedCard.title,
        text: resolvedCard.description || `Check out this ${resolvedCard.title} card!`,
        url: shareUrl,
      })
      .then(() => toast({
        title: "Shared successfully",
        description: "Card has been shared"
      }))
      .catch(error => {
        console.error('Error sharing card:', error);
        navigator.clipboard.writeText(shareUrl).then(() => {
          toast({
            title: "Link copied",
            description: "Card URL copied to clipboard"
          });
        });
      });
    } else {
      navigator.clipboard.writeText(shareUrl).then(() => {
        toast({
          title: "Link copied",
          description: "Card URL copied to clipboard"
        });
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <PageLayout
        title={resolvedCard?.title || "Card Detail"}
        description={resolvedCard?.description || "View card details"}
      >
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" onClick={() => navigate(-1)} className="mr-2">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </Button>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline"
                size="sm"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button
                variant="outline"
                size="sm"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/70 p-6 rounded-lg backdrop-blur-sm">
                <div className="relative mx-auto max-w-md">
                  <div className="aspect-[2.5/3.5] w-full rounded-lg overflow-hidden border-2 border-gray-600/30 shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10">
                    <img 
                      src={resolvedCard.imageUrl} 
                      alt={resolvedCard.title} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                      }}
                    />
                  </div>
                </div>
                
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={handleViewImmersive}
                    className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
                  >
                    <Eye className="h-5 w-5 mr-2" />
                    View Immersive 3D
                  </Button>
                  
                  <Button
                    onClick={handleViewAR}
                    variant="outline"
                    className="border-purple-500/50 text-purple-300 hover:bg-purple-900/20"
                  >
                    <Smartphone className="h-5 w-5 mr-2" />
                    View in AR
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="md:col-span-1">
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/70 p-6 rounded-lg backdrop-blur-sm">
                <h1 className="text-2xl font-bold mb-2">{resolvedCard.title}</h1>
                
                {resolvedCard.description && (
                  <p className="text-gray-300 mb-6">{resolvedCard.description}</p>
                )}
                
                <div className="space-y-6">
                  {resolvedCard.player && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-400">Player</h3>
                      <p className="text-white">{resolvedCard.player}</p>
                    </div>
                  )}
                  
                  {resolvedCard.team && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-400">Team</h3>
                      <p className="text-white">{resolvedCard.team}</p>
                    </div>
                  )}
                  
                  {resolvedCard.year && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-400">Year</h3>
                      <p className="text-white">{resolvedCard.year}</p>
                    </div>
                  )}
                  
                  {resolvedCard.cardNumber && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-400">Card #</h3>
                      <p className="text-white">{resolvedCard.cardNumber}</p>
                    </div>
                  )}
                  
                  {resolvedCard.set && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-400">Set</h3>
                      <p className="text-white">{resolvedCard.set}</p>
                    </div>
                  )}
                  
                  {resolvedCard.cardType && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-400">Type</h3>
                      <p className="text-white">{resolvedCard.cardType}</p>
                    </div>
                  )}
                </div>
                
                {resolvedCard.stats && Object.keys(resolvedCard.stats).length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Stats</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {resolvedCard.stats.battingAverage && (
                        <div className="bg-gray-800/50 p-2 rounded">
                          <div className="text-xs text-gray-400">Batting Average</div>
                          <div className="text-lg font-semibold">{resolvedCard.stats.battingAverage}</div>
                        </div>
                      )}
                      
                      {resolvedCard.stats.homeRuns && (
                        <div className="bg-gray-800/50 p-2 rounded">
                          <div className="text-xs text-gray-400">Home Runs</div>
                          <div className="text-lg font-semibold">{resolvedCard.stats.homeRuns}</div>
                        </div>
                      )}
                      
                      {resolvedCard.stats.rbis && (
                        <div className="bg-gray-800/50 p-2 rounded">
                          <div className="text-xs text-gray-400">RBIs</div>
                          <div className="text-lg font-semibold">{resolvedCard.stats.rbis}</div>
                        </div>
                      )}
                      
                      {resolvedCard.stats.era && (
                        <div className="bg-gray-800/50 p-2 rounded">
                          <div className="text-xs text-gray-400">ERA</div>
                          <div className="text-lg font-semibold">{resolvedCard.stats.era}</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {resolvedCard.tags && resolvedCard.tags.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {resolvedCard.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-gray-800/80 text-gray-300 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {resolvedCard.effects && resolvedCard.effects.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Special Effects</h3>
                    <div className="flex flex-wrap gap-2">
                      {resolvedCard.effects.map((effect, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-purple-800/30 border border-purple-500/30 text-purple-300 text-xs rounded-full"
                        >
                          {effect}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    </div>
  );
};

export default CardDetail;

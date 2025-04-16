
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCards } from '@/context/CardContext';
import CardViewer from '@/components/card-viewer/CardViewer';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Share2, Info } from 'lucide-react';
import PageLayout from '@/components/navigation/PageLayout';
import { toast } from 'sonner';

const CardViewerPage = () => {
  const { id } = useParams<{ id: string }>();
  const { cards, getCardById } = useCards();
  const [fullscreen, setFullscreen] = useState(false);
  const [showInfo, setShowInfo] = useState(true);
  const navigate = useNavigate();
  
  const card = id ? getCardById(id) : undefined;
  const cardIndex = card ? cards.findIndex(c => c.id === card.id) : -1;
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && fullscreen) {
        setFullscreen(false);
      } else if (e.key === 'ArrowLeft' && cardIndex > 0) {
        navigate(`/view/${cards[cardIndex - 1].id}`);
      } else if (e.key === 'ArrowRight' && cardIndex < cards.length - 1) {
        navigate(`/view/${cards[cardIndex + 1].id}`);
      } else if (e.key === 'i') {
        setShowInfo(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fullscreen, cardIndex, cards, navigate]);
  
  if (!card) {
    return (
      <PageLayout
        title="Card Not Found"
        description="The card you're looking for doesn't exist."
      >
        <div className="flex flex-col items-center justify-center py-16">
          <h2 className="text-2xl font-bold mb-4">Card Not Found</h2>
          <p className="text-gray-500 mb-6">The card you're looking for may have been removed or doesn't exist.</p>
          <Button onClick={() => navigate('/')}>Back to Collection</Button>
        </div>
      </PageLayout>
    );
  }
  
  const navigateToCard = (direction: 'next' | 'prev') => {
    if (direction === 'prev' && cardIndex > 0) {
      navigate(`/view/${cards[cardIndex - 1].id}`);
    } else if (direction === 'next' && cardIndex < cards.length - 1) {
      navigate(`/view/${cards[cardIndex + 1].id}`);
    }
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: card.title,
        text: card.description || `Check out this ${card.title} card!`,
        url: window.location.href
      }).then(() => {
        toast.success('Card shared successfully!');
      }).catch((error) => {
        console.error('Error sharing card:', error);
        navigator.clipboard.writeText(window.location.href)
          .then(() => toast.success('Link copied to clipboard'))
          .catch(() => toast.error('Failed to copy link'));
      });
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => toast.success('Link copied to clipboard'))
        .catch(() => toast.error('Failed to copy link'));
    }
  };
  
  const handleCapture = () => {
    // Future implementation for saving card image
    toast.info('Card snapshot feature coming soon');
  };

  const renderCardInfo = () => {
    if (!showInfo) return null;
    
    return (
      <div className="fixed top-0 right-0 bottom-0 w-80 z-30 bg-gray-900/95 backdrop-blur-sm shadow-xl text-white overflow-y-auto">
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Card Information</h2>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setShowInfo(false)}
              className="text-white hover:bg-gray-800"
            >
              <Info size={18} />
            </Button>
          </div>
          
          <h3 className="text-xl font-bold mb-1">{card.title}</h3>
          {card.description && (
            <p className="text-gray-300 mb-4">{card.description}</p>
          )}
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Value & Condition */}
            <div className="bg-gray-800/70 p-3 rounded-lg">
              <p className="text-xs text-gray-500">ESTIMATED VALUE</p>
              <p className="font-medium text-green-400 text-lg">$6,600,000+</p>
            </div>
            
            <div className="bg-gray-800/70 p-3 rounded-lg">
              <p className="text-xs text-gray-500">CONDITION</p>
              <p className="font-medium">PSA 3 VG</p>
            </div>
            
            {/* Rarity & Career */}
            <div className="bg-gray-800/70 p-3 rounded-lg">
              <p className="text-xs text-gray-500">RARITY SCORE</p>
              <p className="font-medium text-amber-400">9.8/10</p>
            </div>
            
            <div className="bg-gray-800/70 p-3 rounded-lg">
              <p className="text-xs text-gray-500">CAREER</p>
              <p className="font-medium">1909-1917</p>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="border-b border-gray-800 mb-4">
            <div className="flex">
              <button className="pb-2 px-4 border-b-2 border-blue-500 text-blue-400">
                Overview
              </button>
              <button className="pb-2 px-4 text-gray-500">
                Career Stats
              </button>
              <button className="pb-2 px-4 text-gray-500">
                Rankings
              </button>
            </div>
          </div>
          
          {/* Stats */}
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Home Runs</span>
                <span className="text-amber-500 font-bold">101</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-500 to-amber-400" style={{ width: '85%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">RBIs</span>
                <span className="text-blue-400 font-bold">1,732</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-blue-400" style={{ width: '92%' }}></div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-800">
              <div>
                <p className="text-xs text-gray-500">BATTING AVG</p>
                <p className="font-bold">0.342</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">ERA</p>
                <p className="font-bold">2.88</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">WINS</p>
                <p className="font-bold">94</p>
              </div>
            </div>
            
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700" 
              onClick={handleShare}
            >
              <Share2 className="mr-2 h-4 w-4" /> Share with Collector Network
            </Button>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <>
      <PageLayout
        title={card.title}
        description={card.description || "Viewing card details"}
        className={fullscreen ? 'hidden' : ''}
      >
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center mb-4 gap-2">
            <Button variant="ghost" onClick={() => navigate('/')}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Collection
            </Button>
            
            <div className="ml-auto flex gap-2">
              <Button
                variant="outline"
                onClick={() => navigateToCard('prev')}
                disabled={cardIndex <= 0}
              >
                <ChevronLeft className="mr-1" size={16} />
                Previous
              </Button>
              
              <Button
                variant="outline"
                onClick={() => navigateToCard('next')}
                disabled={cardIndex >= cards.length - 1}
              >
                Next
                <ChevronRight className="ml-1" size={16} />
              </Button>
            </div>
          </div>
          
          <div className="relative h-[600px] w-full bg-gray-900 rounded-lg overflow-hidden">
            <CardViewer 
              card={card}
              onFullscreenToggle={() => setFullscreen(true)}
              onShare={handleShare}
              onCapture={handleCapture}
              onBack={() => navigate('/')}
            />
            
            {renderCardInfo()}
          </div>
          
          {/* Related Cards */}
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Related Cards</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
              {cards.filter(c => c.id !== card.id).slice(0, 6).map(relatedCard => (
                <div 
                  key={relatedCard.id} 
                  className="aspect-[3/4] rounded-lg overflow-hidden cursor-pointer relative group"
                  onClick={() => navigate(`/view/${relatedCard.id}`)}
                >
                  <img 
                    src={relatedCard.imageUrl || '/images/card-placeholder.png'} 
                    alt={relatedCard.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-2">
                      <h4 className="text-white text-sm font-medium truncate">{relatedCard.title}</h4>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PageLayout>
      
      {fullscreen && (
        <div className="fixed inset-0 z-50 bg-black">
          <CardViewer
            card={card}
            fullscreen={true}
            onFullscreenToggle={() => setFullscreen(false)}
            onShare={handleShare}
            onCapture={handleCapture}
            onClose={() => setFullscreen(false)}
          />
          
          {renderCardInfo()}
        </div>
      )}
    </>
  );
};

export default CardViewerPage;

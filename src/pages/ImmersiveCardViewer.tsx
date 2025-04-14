import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCards } from '@/context/CardContext';
import PageLayout from '@/components/navigation/PageLayout';
import { toast } from 'sonner';
import CardBackground from '@/components/home/card-viewer/CardBackground';
import { CardImage } from '@/components/cards/CardImage';
import CardShopBackground from '@/components/home/card-viewer/CardShopBackground';
import MiniActionBar from '@/components/ui/MiniActionBar';
import { 
  ChevronDown, BarChart2, Info, X, PieChart, Award, 
  Clock, Calendar, Users, ZoomIn, ZoomOut, Lightbulb,
  Layers, Undo, Redo, Share2, Grid, Book, Mail, Shuffle,
  ChevronsLeft, ChevronsRight, Fullscreen
} from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';
import RelatedCardsSlider from '@/components/card-viewer/RelatedCardsSlider';
import { Button } from '@/components/ui/button';
import CardEffectsPanel from '@/components/immersive-viewer/CardEffectsPanel';
import MultiCardView from '@/components/immersive-viewer/MultiCardView';
import { useCardEffects } from '@/hooks/useCardEffects';

const ImmersiveCardViewer = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { cards, getCardById } = useCards();
  const { visualEffectsEnabled } = useSettings();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardPosition, setCardPosition] = useState({ x: 0, y: 0, rotation: 0 });
  const [showCartoonBackground, setShowCartoonBackground] = useState(true);
  const [showStatsPanel, setShowStatsPanel] = useState(false);
  const [activeStat, setActiveStat] = useState<'overview' | 'career' | 'rankings' | 'recent'>('overview');
  const [zoom, setZoom] = useState(1);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [multiCardMode, setMultiCardMode] = useState(false);
  const [showEffectsPanel, setShowEffectsPanel] = useState(false);
  const [isAutoMoving, setIsAutoMoving] = useState(true);
  const [showCardBack, setShowCardBack] = useState(false);
  const [selectedCardBack, setSelectedCardBack] = useState<string | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const cardEffects = useCardEffects();
  const [activeEffects, setActiveEffects] = useState<string[]>([]);
  const [effectIntensity, setEffectIntensity] = useState({
    refractor: 0.6,
    holographic: 0.7,
    shimmer: 0.5,
    vintage: 0.4,
    gold: 0.65
  });

  useEffect(() => {
    if (id) {
      const card = getCardById ? getCardById(id) : cards.find(c => c.id === id);
      
      if (card) {
        const effects = [];
        if (card.designMetadata?.cardStyle?.effect === 'holographic') effects.push('Holographic');
        if (card.designMetadata?.cardStyle?.effect === 'refractor') effects.push('Refractor');
        if (card.designMetadata?.cardStyle?.effect === 'gold') effects.push('Gold Foil');
        if (card.designMetadata?.cardStyle?.effect === 'vintage') effects.push('Vintage');
        setActiveEffects(effects);
        if (card.id) {
          cardEffects.setCardEffects(card.id, effects);
        }
      }
      setIsLoading(false);
    }
  }, [id, cards, getCardById, cardEffects]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current || !isAutoMoving) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    const rotationX = (y - 0.5) * -10;
    const rotationY = (x - 0.5) * 10;
    
    setMousePosition({ x, y });
    
    if (cardRef.current) {
      cardRef.current.style.transition = 'transform 0.3s ease-out';
      cardRef.current.style.transform = `
        perspective(1000px) 
        rotateX(${rotationX}deg) 
        rotateY(${rotationY}deg)
        scale(${zoom})
      `;
    }
  }, [zoom, isAutoMoving]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const moveStep = 10;
    const rotationStep = 5;
    const zoomStep = 0.1;
    const maxZoom = 3.0;
    const minZoom = 0.5;

    switch (e.key) {
      case 'ArrowUp':
        setCardPosition(prev => ({ ...prev, y: prev.y - moveStep }));
        e.preventDefault();
        break;
      case 'ArrowDown':
        setCardPosition(prev => ({ ...prev, y: prev.y + moveStep }));
        e.preventDefault();
        break;
      case 'ArrowLeft':
        setCardPosition(prev => ({ ...prev, x: prev.x - moveStep }));
        e.preventDefault();
        break;
      case 'ArrowRight':
        setCardPosition(prev => ({ ...prev, x: prev.x + moveStep }));
        e.preventDefault();
        break;
      case '[':
        setCardPosition(prev => ({ ...prev, rotation: prev.rotation - rotationStep }));
        e.preventDefault();
        break;
      case ']':
        setCardPosition(prev => ({ ...prev, rotation: prev.rotation + rotationStep }));
        e.preventDefault();
        break;
      case 'r':
      case 'R':
        handleCardReset();
        e.preventDefault();
        break;
      case 'f':
      case 'F':
        setIsFlipped(prev => !prev);
        e.preventDefault();
        break;
      case 'i':
      case 'I':
        setShowStatsPanel(prev => !prev);
        e.preventDefault();
        break;
      case '+':
      case '=':
        setZoom(prev => Math.min(maxZoom, prev + zoomStep));
        e.preventDefault();
        break;
      case '-':
      case '_':
        setZoom(prev => Math.max(minZoom, prev - zoomStep));
        e.preventDefault();
        break;
      case 'm':
      case 'M':
        setMultiCardMode(prev => !prev);
        e.preventDefault();
        break;
      case 'e':
      case 'E':
        setShowEffectsPanel(prev => !prev);
        e.preventDefault();
        break;
      case 'b':
      case 'B':
        setShowCardBack(prev => !prev);
        e.preventDefault();
        break;
      case 'a':
      case 'A':
        setIsAutoMoving(prev => !prev);
        e.preventDefault();
        break;
      case 'Escape':
        if (showEffectsPanel) {
          setShowEffectsPanel(false);
        } else if (showStatsPanel) {
          setShowStatsPanel(false);
        } else if (multiCardMode) {
          setMultiCardMode(false);
        } else {
          handleClose();
        }
        e.preventDefault();
        break;
    }
  }, [setCardPosition, setIsFlipped, setZoom]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
  
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = -Math.sign(e.deltaY) * 0.1;
        setZoom(prev => Math.min(3.0, Math.max(0.5, prev + delta)));
      }
    };
    
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);
  
  const handleClose = () => {
    navigate('/cards');
  };
  
  const handleCardClick = (cardId: string) => {
    navigate(`/view/${cardId}`);
  };
  
  const handleCardFlip = (flipped: boolean) => {
    setIsFlipped(flipped);
  };
  
  const handleUpdateCardPosition = (x: number, y: number, rotation: number) => {
    setCardPosition({ x, y, rotation });
  };
  
  const handleCardReset = () => {
    setCardPosition({ x: 0, y: 0, rotation: 0 });
    setZoom(1);
    toast.info('Card position reset');
  };

  const toggleBackgroundStyle = () => {
    setShowCartoonBackground(prev => !prev);
    toast.success(showCartoonBackground ? 'Switched to abstract background' : 'Switched to card shop background');
  };

  const toggleStatsPanel = () => {
    setShowStatsPanel(prev => !prev);
    if (showEffectsPanel && !showStatsPanel) {
      setShowEffectsPanel(false);
    }
    
    if (!showStatsPanel) {
      toast.info('Stats panel opened', {
        description: 'Use keyboard shortcuts for more options'
      });
    }
  };
  
  const toggleEffectsPanel = () => {
    setShowEffectsPanel(prev => !prev);
    if (showStatsPanel && !showEffectsPanel) {
      setShowStatsPanel(false);
    }
    
    if (!showEffectsPanel) {
      toast.info('Effects panel opened', {
        description: 'Customize card visual effects'
      });
    }
  };
  
  const toggleMultiCardMode = () => {
    setMultiCardMode(prev => !prev);
    if (!multiCardMode) {
      toast.info('Multi-card view activated', {
        description: 'Compare cards side by side'
      });
    }
  };
  
  const toggleAutoMoving = () => {
    setIsAutoMoving(prev => !prev);
    toast.info(isAutoMoving ? 'Auto movement disabled' : 'Auto movement enabled');
  };
  
  const handleZoomIn = () => {
    setZoom(prev => Math.min(3.0, prev + 0.1));
  };
  
  const handleZoomOut = () => {
    setZoom(prev => Math.max(0.5, prev - 0.1));
  };
  
  const toggleCardBack = () => {
    setShowCardBack(prev => !prev);
    if (!showCardBack) {
      toast.info('Card back customization enabled');
    }
  };
  
  const handleSelectCardBack = (backId: string | null) => {
    setSelectedCardBack(backId);
    toast.success('Card back updated');
  };
  
  const getRelatedCards = () => {
    if (!id) return [];
    
    const currentCard = getCardById ? 
      getCardById(id) : 
      cards.find(card => card.id === id);
      
    if (!currentCard) return [];
    
    return cards
      .filter(card => 
        card.id !== id && (
          (currentCard.tags && card.tags && 
            currentCard.tags.some(tag => card.tags?.includes(tag))) ||
          (currentCard.player && card.player && currentCard.player === card.player) ||
          (currentCard.year && card.year && currentCard.year === card.year) ||
          (currentCard.team && card.team && currentCard.team === card.team)
        )
      )
      .slice(0, 8);
  };
  
  const handleToggleEffect = (effect: string) => {
    if (id) {
      cardEffects.toggleEffect(id, effect);
      setActiveEffects(prev => {
        if (prev.includes(effect)) {
          return prev.filter(e => e !== effect);
        } else {
          return [...prev, effect];
        }
      });
      
      toast.info(`${effect} effect ${activeEffects.includes(effect) ? 'disabled' : 'enabled'}`);
    }
  };
  
  const handleEffectIntensityChange = (effect: string, value: number) => {
    setEffectIntensity(prev => ({
      ...prev,
      [effect.toLowerCase()]: value
    }));
  };
  
  if (!id) {
    return (
      <PageLayout title="Card Viewer" description="View your card in immersive mode">
        <div className="container mx-auto py-12 text-center">
          <h2 className="text-2xl font-bold mb-4">No card selected</h2>
          <p className="mb-6">Please select a card from your gallery to view.</p>
          <button 
            className="bg-primary text-white px-4 py-2 rounded"
            onClick={() => navigate('/cards')}
          >
            Go to Gallery
          </button>
        </div>
      </PageLayout>
    );
  }
  
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }
  
  const currentCard = getCardById ? getCardById(id) : cards.find(card => card.id === id);
  const relatedCards = getRelatedCards();
  
  if (!currentCard) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-white text-lg">Card not found</div>
      </div>
    );
  }

  const cardStats = {
    battingAverage: currentCard.battingAverage || '0.342',
    homeRuns: currentCard.homeRuns || '101',
    rbis: currentCard.rbis || '1,732',
    era: currentCard.era || '2.88',
    wins: currentCard.wins || '94',
    strikeouts: currentCard.strikeouts || '891',
    careerYears: currentCard.careerYears || '1909-1917',
    ranking: currentCard.ranking || '9.8/10',
    estimatedValue: currentCard.estimatedValue || '$6,600,000+',
    condition: currentCard.condition || 'PSA 3 VG'
  };
  
  return (
    <div className="fixed inset-0 bg-black flex flex-col">
      <div className="absolute inset-0 overflow-hidden z-0">
        {showCartoonBackground ? (
          <CardShopBackground />
        ) : (
          <CardBackground activeEffects={activeEffects} />
        )}
      </div>
      
      <button
        className="absolute top-4 right-4 z-50 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full"
        onClick={handleClose}
      >
        <X size={24} />
      </button>
      
      <div className="absolute top-4 left-4 z-50 flex space-x-2">
        <button
          className="bg-black/40 hover:bg-black/60 text-white p-2 rounded-full"
          onClick={handleCardReset}
          title="Reset card position (R)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 2v6h6"></path>
            <path d="M3 13a9 9 0 1 0 3-7.7L3 8"></path>
          </svg>
        </button>
        
        <button
          className="bg-black/40 hover:bg-black/60 text-white p-2 rounded-full"
          onClick={toggleBackgroundStyle}
          title={showCartoonBackground ? "Switch to abstract background" : "Switch to card shop background"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
        </button>
        
        <button
          className={`bg-black/40 hover:bg-black/60 text-white p-2 rounded-full ${
            showStatsPanel ? "bg-blue-600/70" : ""
          }`}
          onClick={toggleStatsPanel}
          title="Toggle stats panel (I)"
        >
          <BarChart2 size={24} />
        </button>
        
        <button
          className={`bg-black/40 hover:bg-black/60 text-white p-2 rounded-full ${
            showEffectsPanel ? "bg-blue-600/70" : ""
          }`}
          onClick={toggleEffectsPanel}
          title="Toggle effects panel (E)"
        >
          <Lightbulb size={24} />
        </button>
        
        <button
          className={`bg-black/40 hover:bg-black/60 text-white p-2 rounded-full ${
            multiCardMode ? "bg-blue-600/70" : ""
          }`}
          onClick={toggleMultiCardMode}
          title="Toggle multi-card view (M)"
        >
          <Grid size={24} />
        </button>
        
        <button
          className={`bg-black/40 hover:bg-black/60 text-white p-2 rounded-full ${
            isAutoMoving ? "bg-blue-600/70" : ""
          }`}
          onClick={toggleAutoMoving}
          title="Toggle auto movement (A)"
        >
          <Shuffle size={24} />
        </button>
        
        <button
          className={`bg-black/40 hover:bg-black/60 text-white p-2 rounded-full ${
            showCardBack ? "bg-blue-600/70" : ""
          }`}
          onClick={toggleCardBack}
          title="Customize card back (B)"
        >
          <ChevronsLeft size={24} className={isFlipped ? "" : "hidden"} />
          <ChevronsRight size={24} className={isFlipped ? "hidden" : ""} />
        </button>
        
        <button
          className="bg-black/40 hover:bg-black/60 text-white p-2 rounded-full"
          onClick={handleZoomIn}
          title="Zoom in (+)"
        >
          <ZoomIn size={24} />
        </button>
        
        <button
          className="bg-black/40 hover:bg-black/60 text-white p-2 rounded-full"
          onClick={handleZoomOut}
          title="Zoom out (-)"
        >
          <ZoomOut size={24} />
        </button>
        
        <button
          className="bg-black/40 hover:bg-black/60 text-white p-2 rounded-full"
          onClick={() => {
            if (!document.fullscreenElement) {
              document.documentElement.requestFullscreen();
            } else {
              document.exitFullscreen();
            }
          }}
          title="Toggle fullscreen"
        >
          <Fullscreen size={24} />
        </button>
      </div>
      
      <div 
        ref={containerRef}
        className={`relative flex-1 flex items-center justify-center overflow-hidden z-10 transition-all duration-300 ease-in-out ${
          showStatsPanel ? 'md:mr-96' : ''
        } ${showEffectsPanel ? 'md:ml-96' : ''}`}
        onMouseMove={handleMouseMove}
      >
        {multiCardMode ? (
          <MultiCardView 
            mainCardId={id}
            relatedCards={relatedCards}
            onCardClick={handleCardClick}
            zoom={zoom}
            activeEffects={activeEffects}
            effectIntensity={effectIntensity}
            autoMove={isAutoMoving}
          />
        ) : (
          <div 
            ref={cardRef}
            className="w-full max-w-lg transform transition-transform duration-300"
            style={{
              transform: `translate(${cardPosition.x}px, ${cardPosition.y}px) rotate(${cardPosition.rotation}deg) scale(${zoom})`,
              transformStyle: 'preserve-3d',
              transition: 'transform 0.3s ease-out'
            }}
          >
            <CardImage
              card={currentCard}
              className={`mx-auto transform-gpu ${activeEffects.join(' ').toLowerCase()}`}
              flippable={true}
              enable3D={visualEffectsEnabled}
              autoRotate={false}
              onFlip={handleCardFlip}
            />
          </div>
        )}
        
        <div className="absolute inset-0 pointer-events-none z-20">
          {activeEffects.includes('Holographic') && (
            <div 
              className="absolute inset-0 bg-gradient-radial from-white/20 to-transparent" 
              style={{
                opacity: effectIntensity.holographic * 0.3,
                backgroundPosition: `${mousePosition.x * 100}% ${mousePosition.y * 100}%`,
                backgroundSize: '200% 200%',
                mixBlendMode: 'overlay'
              }}
            />
          )}
          
          {activeEffects.includes('Refractor') && (
            <div 
              className="absolute inset-0 bg-gradient-conic from-cyan-500 via-blue-500 to-purple-500" 
              style={{
                opacity: effectIntensity.refractor * 0.2,
                backgroundPosition: `${mousePosition.x * 100}% ${mousePosition.y * 100}%`,
                backgroundSize: '200% 200%',
                mixBlendMode: 'color-dodge'
              }}
            />
          )}
        </div>
      </div>

      <div 
        className={`fixed top-0 right-0 bottom-0 w-full md:w-96 bg-gray-900/95 backdrop-blur-md shadow-2xl z-30 overflow-y-auto transition-transform duration-300 transform ${
          showStatsPanel ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Card Information</h2>
            <button 
              onClick={() => setShowStatsPanel(false)}
              className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400"
            >
              <X size={18} />
            </button>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white">{currentCard.title || '1909-11 T206 Honus Wagner'}</h3>
            <p className="text-gray-400 text-sm">{currentCard.description || 'Rare vintage baseball card'}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-gray-400 text-xs uppercase">Estimated Value</p>
              <p className="text-green-500 text-xl font-bold">{cardStats.estimatedValue}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-gray-400 text-xs uppercase">Condition</p>
              <p className="text-white text-xl font-bold">{cardStats.condition}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-gray-400 text-xs uppercase">Rarity Score</p>
              <p className="text-yellow-500 text-xl font-bold">{cardStats.ranking}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-gray-400 text-xs uppercase">Career</p>
              <p className="text-white text-xl font-bold">{cardStats.careerYears}</p>
            </div>
          </div>
          
          <div className="mb-4 border-b border-gray-800">
            <div className="flex space-x-2">
              {[
                { id: 'overview', label: 'Overview', icon: <Info size={16} /> },
                { id: 'career', label: 'Career Stats', icon: <PieChart size={16} /> },
                { id: 'rankings', label: 'Rankings', icon: <Award size={16} /> },
                { id: 'recent', label: 'Recent', icon: <Clock size={16} /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  className={`px-4 py-2 flex items-center space-x-1 ${
                    activeStat === tab.id 
                      ? 'text-blue-400 border-b-2 border-blue-400' 
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                  onClick={() => setActiveStat(tab.id as any)}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          {activeStat === 'overview' && (
            <div className="space-y-4">
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-white font-medium">Home Runs</h4>
                  <span className="text-amber-500 font-bold">{cardStats.homeRuns}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-white font-medium">RBIs</h4>
                  <span className="text-blue-500 font-bold">{cardStats.rbis}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                </div>
              </div>
              
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-xs">BATTING AVG</p>
                    <p className="text-white text-lg font-bold">{cardStats.battingAverage}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">ERA</p>
                    <p className="text-white text-lg font-bold">{cardStats.era}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">WINS</p>
                    <p className="text-white text-lg font-bold">{cardStats.wins}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeStat === 'career' && (
            <div className="space-y-4">
              <div className="bg-gray-800/50 rounded-lg overflow-hidden">
                <div className="p-4">
                  <h4 className="text-white font-medium mb-2">Career Statistics</h4>
                  <p className="text-sm text-gray-400">Pittsburgh Pirates (1900-1917)</p>
                </div>
                
                <table className="w-full text-sm">
                  <thead className="bg-gray-800 text-gray-400">
                    <tr>
                      <th className="py-2 px-4 text-left">Season</th>
                      <th className="py-2 px-2 text-right">AVG</th>
                      <th className="py-2 px-2 text-right">HR</th>
                      <th className="py-2 px-2 text-right">RBI</th>
                    </tr>
                  </thead>
                  <tbody className="text-white">
                    {[
                      { year: '1909', avg: '.339', hr: '12', rbi: '104' },
                      { year: '1910', avg: '.320', hr: '9', rbi: '89' },
                      { year: '1911', avg: '.334', hr: '15', rbi: '132' },
                      { year: '1912', avg: '.324', hr: '11', rbi: '118' },
                      { year: '1913', avg: '.345', hr: '17', rbi: '124' }
                    ].map((season, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-800/30' : ''}>
                        <td className="py-2 px-4">{season.year}</td>
                        <td className="py-2 px-2 text-right">{season.avg}</td>
                        <td className="py-2 px-2 text-right">{season.hr}</td>
                        <td className="py-2 px-2 text-right">{season.rbi}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <h4 className="text-white font-medium mb-3">Career Highlights</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    <span>8× National League batting champion</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    <span>World Series champion (1909)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    <span>National Baseball Hall of Fame (1936)</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
          
          {activeStat === 'rankings' && (
            <div className="space-y-4">
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <h4 className="text-white font-medium mb-3">Historical Rankings</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">All-Time Greats</span>
                      <span className="text-white">#5</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Shortstops</span>
                      <span className="text-white">#1</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Dead Ball Era</span>
                      <span className="text-white">#2</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" style={{ width: '98%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <h4 className="text-white font-medium mb-3">Card Market Value</h4>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <p className="text-gray-400 text-xs">LAST SOLD</p>
                    <p className="text-white text-lg font-bold">$6.6M</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">ESTIMATED 2025</p>
                    <p className="text-green-400 text-lg font-bold">$7.2M</p>
                  </div>
                </div>
                <div className="h-24 bg-gray-900 rounded-lg overflow-hidden">
                  <div className="h-full flex items-end">
                    <div className="flex-1 h-[30%] bg-blue-500 mx-0.5"></div>
                    <div className="flex-1 h-[40%] bg-blue-500 mx-0.5"></div>
                    <div className="flex-1 h-[35%] bg-blue-500 mx-0.5"></div>
                    <div className="flex-1 h-[50%] bg-blue-500 mx-0.5"></div>
                    <div className="flex-1 h-[60%] bg-blue-500 mx-0.5"></div>
                    <div className="flex-1 h-[70%] bg-blue-500 mx-0.5"></div>
                    <div className="flex-1 h-[80%] bg-green-500 mx-0.5"></div>
                    <div className="flex-1 h-[90%] bg-green-500 mx-0.5"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeStat === 'recent' && (
            <div className="space-y-4">
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-white font-medium">Recent Sales History</h4>
                  <span className="text-xs text-blue-400">View All</span>
                </div>
                
                <div className="space-y-3">
                  {[
                    { date: 'Apr 2023', price: '$6,600,000', condition: 'PSA 3 VG', trend: 'up' },
                    { date: 'Sep 2019', price: '$5,200,000', condition: 'PSA 3 VG', trend: 'up' },
                    { date: 'May 2015', price: '$2,800,000', condition: 'PSA 2 GOOD', trend: 'up' },
                    { date: 'Apr 2012', price: '$1,200,000', condition: 'PSA 1 POOR', trend: 'up' }
                  ].map((sale, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-700">
                      <div>
                        <p className="text-white">{sale.price}</p>
                        <p className="text-xs text-gray-400">{sale.date} • {sale.condition}</p>
                      </div>
                      <div className={sale.trend === 'up' ? 'text-green-400' : 'text-red-400'}>
                        {sale.trend === 'up' ? '↑' : '↓'} 
                        <span className="ml-1">{idx === 0 ? '27%' : idx === 1 ? '85%' : '133%'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-white font-medium">In The News</h4>
                  <span className="text-xs text-blue-400">View All</span>
                </div>
                
                <div className="space-y-3">
                  {[
                    { title: 'T206 Wagner Sets New Auction Record', date: '2 months ago' },
                    { title: 'Rare Baseball Cards: A History of the T206 Wagner', date: '6 months ago' },
                    { title: 'Investment Guide: Vintage Baseball Cards in 2025', date: '8 months ago' }
                  ].map((article, idx) => (
                    <div key={idx} className="py-2 border-b border-gray-700">
                      <p className="text-white text-sm">{article.title}</p>
                      <p className="text-xs text-gray-400">{article.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-6 pt-4 border-t border-gray-800">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg flex items-center justify-center">
              <Users size={16} className="mr-2" />
              Share with Collector Network
            </button>
          </div>
        </div>
      </div>
      
      <div 
        className={`fixed top-0 left-0 bottom-0 w-full md:w-96 bg-gray-900/95 backdrop-blur-md shadow-2xl z-30 overflow-y-auto transition-transform duration-300 transform ${
          showEffectsPanel ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <CardEffectsPanel 
          activeEffects={activeEffects}
          onToggleEffect={handleToggleEffect}
          effectIntensity={effectIntensity}
          onEffectIntensityChange={handleEffectIntensityChange}
          onClose={() => setShowEffectsPanel(false)}
        />
      </div>
      
      <div 
        className={`fixed left-0 right-0 bottom-0 h-64 bg-gray-900/95 backdrop-blur-md shadow-2xl z-30 overflow-x-auto transition-transform duration-300 transform ${
          showCardBack ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">Card Back Options</h3>
            <button 
              onClick={() => setShowCardBack(false)}
              className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400"
            >
              <X size={18} />
            </button>
          </div>
          
          <div className="flex space-x-4 overflow-x-auto pb-4">
            <div 
              className={`relative flex-shrink-0 h-40 w-28 bg-gray-800 rounded-lg cursor-pointer border-2 ${
                selectedCardBack === null ? 'border-blue-500' : 'border-transparent'
              }`}
              onClick={() => handleSelectCardBack(null)}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white text-xs text-center p-2">Default Card Back</span>
              </div>
            </div>
            
            {['classic', 'modern', 'premium', 'vintage', 'custom'].map((style) => (
              <div 
                key={style}
                className={`relative flex-shrink-0 h-40 w-28 bg-gray-800 rounded-lg cursor-pointer border-2 ${
                  selectedCardBack === style ? 'border-blue-500' : 'border-transparent'
                }`}
                onClick={() => handleSelectCardBack(style)}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white capitalize text-xs text-center p-2">{style} Style</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center mt-2">
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => {
                setShowCardBack(false);
                setIsFlipped(true);
                toast.success('Card back updated! Card flipped to show back.');
              }}
            >
              Apply & View Back
            </Button>
          </div>
        </div>
      </div>
      
      {relatedCards.length > 0 && !showStatsPanel && !multiCardMode && (
        <div className="p-4 bg-black/90 z-10">
          <h3 className="text-white text-lg font-medium mb-3">Related Cards</h3>
          <RelatedCardsSlider cards={relatedCards} onCardClick={handleCardClick} />
        </div>
      )}

      <div className="fixed bottom-4 right-4 z-20 bg-black/70 backdrop-blur-sm rounded-lg p-3 text-white text-xs max-w-xs">
        <h4 className="font-medium mb-2">Keyboard Controls:</h4>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          <div>
            <kbd className="bg-gray-800 px-1 rounded">Arrow Keys</kbd> 
            <span className="ml-1">Move Card</span>
          </div>
          <div>
            <kbd className="bg-gray-800 px-1 rounded">[</kbd>/<kbd className="bg-gray-800 px-1 rounded">]</kbd> 
            <span className="ml-1">Rotate</span>
          </div>
          <div>
            <kbd className="bg-gray-800 px-1 rounded">F</kbd> 
            <span className="ml-1">Flip card</span>
          </div>
          <div>
            <kbd className="bg-gray-800 px-1 rounded">I</kbd> 
            <span className="ml-1">Stats panel</span>
          </div>
          <div>
            <kbd className="bg-gray-800 px-1 rounded">E</kbd> 
            <span className="ml-1">Effects panel</span>
          </div>
          <div>
            <kbd className="bg-gray-800 px-1 rounded">M</kbd> 
            <span className="ml-1">Multi-card view</span>
          </div>
          <div>
            <kbd className="bg-gray-800 px-1 rounded">+</kbd>/<kbd className="bg-gray-800 px-1 rounded">-</kbd> 
            <span className="ml-1">Zoom in/out</span>
          </div>
          <div>
            <kbd className="bg-gray-800 px-1 rounded">A</kbd> 
            <span className="ml-1">Auto movement</span>
          </div>
          <div>
            <kbd className="bg-gray-800 px-1 rounded">B</kbd> 
            <span className="ml-1">Card back</span>
          </div>
          <div>
            <kbd className="bg-gray-800 px-1 rounded">R</kbd> 
            <span className="ml-1">Reset position</span>
          </div>
          <div>
            <kbd className="bg-gray-800 px-1 rounded">Esc</kbd> 
            <span className="ml-1">Close panels</span>
          </div>
        </div>
        <div className="mt-2 text-gray-400 text-[10px]">
          Scroll with Ctrl/⌘ + wheel to zoom. Mouse over to see card effects.
        </div>
      </div>
    </div>
  );
};

export default ImmersiveCardViewer;

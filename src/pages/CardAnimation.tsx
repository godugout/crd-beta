
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ChevronLeft, Play, Pause, Save, Download, RotateCw, Sparkles, Layers, Zap } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { BASEBALL_CARDS } from '@/components/baseball/hooks/useBaseballCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type AnimationType = 'flip' | 'fade' | 'zoom' | 'slide' | 'rotate' | 'glint';
type CardPosition = 'start' | 'preview';

const CardAnimation = () => {
  const [selectedCardId, setSelectedCardId] = useState(BASEBALL_CARDS[0].id);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationType, setAnimationType] = useState<AnimationType>('flip');
  const [animationDuration, setAnimationDuration] = useState(1000);
  const [cardPosition, setCardPosition] = useState<CardPosition>('start');
  const [effects, setEffects] = useState({
    glow: false,
    shadow: true,
    reflection: false,
    particles: false,
  });
  
  const selectedCard = BASEBALL_CARDS.find(card => card.id === selectedCardId);
  
  const handlePlayAnimation = () => {
    setIsPlaying(true);
    setCardPosition('preview');
    
    // Simulate animation completion
    setTimeout(() => {
      setIsPlaying(false);
      toast.success("Animation complete!");
      
      // Return card to starting position after animation
      setTimeout(() => {
        setCardPosition('start');
      }, 500);
    }, animationDuration);
  };
  
  const handleSaveAnimation = () => {
    toast.success("Animation saved to your library");
  };
  
  const handleExportAnimation = () => {
    toast.success("Animation exported as MP4", {
      description: "Your animation has been downloaded to your device."
    });
  };
  
  const handleToggleEffect = (effect: keyof typeof effects) => {
    setEffects({
      ...effects,
      [effect]: !effects[effect]
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="absolute top-16 left-4 z-50 mt-2">
        <Button asChild variant="ghost">
          <Link to="/gallery" className="flex items-center">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Return to Gallery
          </Link>
        </Button>
      </div>
      
      <main className="flex-1 pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold">Card Animation Studio</h1>
                <p className="text-gray-600">
                  Create custom card animations for presentations, social media, or digital displays.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                  <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="font-semibold">Animation Preview</h2>
                    <div className="flex gap-2">
                      <Button 
                        variant={isPlaying ? "outline" : "default"}
                        size="sm"
                        onClick={handlePlayAnimation}
                        disabled={isPlaying}
                      >
                        {isPlaying ? (
                          <>
                            <Pause className="mr-1 h-4 w-4" />
                            Playing...
                          </>
                        ) : (
                          <>
                            <Play className="mr-1 h-4 w-4" />
                            Play Animation
                          </>
                        )}
                      </Button>
                      
                      <Select
                        value={selectedCardId}
                        onValueChange={setSelectedCardId}
                      >
                        <SelectTrigger className="w-[180px] text-sm">
                          <SelectValue placeholder="Select Card" />
                        </SelectTrigger>
                        <SelectContent>
                          {BASEBALL_CARDS.map(card => (
                            <SelectItem key={card.id} value={card.id}>
                              {card.player} ({card.year})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="aspect-video bg-gray-900 relative flex items-center justify-center overflow-hidden">
                    {selectedCard && (
                      <div 
                        className={`
                          w-64 h-96 transition-all duration-${animationDuration}ms
                          ${cardPosition === 'preview' ? getAnimationClass(animationType) : ''}
                          ${effects.glow ? 'drop-shadow-[0_0_15px_rgba(59,130,246,0.7)]' : ''}
                          ${effects.shadow ? 'shadow-xl' : ''}
                          ${effects.reflection ? 'after:content-[""] after:absolute after:bottom-[-50%] after:left-0 after:w-full after:h-full after:bg-gradient-to-b after:from-black/20 after:to-transparent after:opacity-50 after:blur-sm after:transform after:scale-y-[-0.9] after:origin-bottom' : ''}
                        `}
                      >
                        <img 
                          src={selectedCard.imageUrl} 
                          alt={selectedCard.title}
                          className="w-full h-full object-contain rounded-lg"
                        />
                        
                        {effects.particles && (
                          <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute w-2 h-2 bg-yellow-300 rounded-full animate-float-1 opacity-70" style={{ top: '10%', left: '20%' }}></div>
                            <div className="absolute w-1 h-1 bg-blue-300 rounded-full animate-float-2 opacity-70" style={{ top: '50%', left: '10%' }}></div>
                            <div className="absolute w-2 h-2 bg-purple-300 rounded-full animate-float-3 opacity-70" style={{ top: '30%', right: '15%' }}></div>
                            <div className="absolute w-1 h-1 bg-green-300 rounded-full animate-float-2 opacity-70" style={{ bottom: '20%', right: '30%' }}></div>
                            <div className="absolute w-2 h-2 bg-red-300 rounded-full animate-float-1 opacity-70" style={{ bottom: '40%', left: '30%' }}></div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="absolute bottom-4 right-4 flex gap-2">
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        className="bg-white/10 hover:bg-white/20"
                        onClick={handleSaveAnimation}
                      >
                        <Save className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                      
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        className="bg-white/10 hover:bg-white/20"
                        onClick={handleExportAnimation}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Export
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-1">
                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                  <div className="p-4 border-b">
                    <h2 className="font-semibold">Animation Settings</h2>
                  </div>
                  
                  <Tabs defaultValue="basics">
                    <div className="border-b px-4">
                      <TabsList className="mt-2">
                        <TabsTrigger value="basics">Basics</TabsTrigger>
                        <TabsTrigger value="effects">Effects</TabsTrigger>
                        <TabsTrigger value="advanced">Advanced</TabsTrigger>
                      </TabsList>
                    </div>
                    
                    <TabsContent value="basics" className="p-4 space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Animation Type</label>
                        <Select 
                          value={animationType}
                          onValueChange={(value) => setAnimationType(value as AnimationType)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="flip">3D Flip</SelectItem>
                            <SelectItem value="fade">Fade In/Out</SelectItem>
                            <SelectItem value="zoom">Zoom</SelectItem>
                            <SelectItem value="slide">Slide</SelectItem>
                            <SelectItem value="rotate">Rotate</SelectItem>
                            <SelectItem value="glint">Glint Effect</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1.5">
                          <label className="text-sm font-medium">Duration (ms)</label>
                          <span className="text-sm text-gray-500">{animationDuration}ms</span>
                        </div>
                        <Slider
                          value={[animationDuration]}
                          min={500}
                          max={3000}
                          step={100}
                          onValueChange={(values) => setAnimationDuration(values[0])}
                        />
                      </div>
                      
                      <div className="pt-2">
                        <h3 className="text-sm font-medium mb-3">Animation Preview</h3>
                        <div className="grid grid-cols-3 gap-3">
                          {(['flip', 'fade', 'zoom'] as AnimationType[]).map((type) => (
                            <button
                              key={type}
                              className={`p-2 text-center rounded border transition-colors ${
                                animationType === type 
                                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                                  : 'border-gray-200 hover:bg-gray-50'
                              }`}
                              onClick={() => setAnimationType(type)}
                            >
                              <div className="flex justify-center mb-1">
                                {type === 'flip' && <RotateCw className="h-5 w-5" />}
                                {type === 'fade' && <Layers className="h-5 w-5" />}
                                {type === 'zoom' && <Sparkles className="h-5 w-5" />}
                              </div>
                              <span className="text-xs capitalize">{type}</span>
                            </button>
                          ))}
                          
                          {(['slide', 'rotate', 'glint'] as AnimationType[]).map((type) => (
                            <button
                              key={type}
                              className={`p-2 text-center rounded border transition-colors ${
                                animationType === type 
                                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                                  : 'border-gray-200 hover:bg-gray-50'
                              }`}
                              onClick={() => setAnimationType(type)}
                            >
                              <div className="flex justify-center mb-1">
                                {type === 'slide' && <ArrowRight className="h-5 w-5" />}
                                {type === 'rotate' && <RotateCw className="h-5 w-5" />}
                                {type === 'glint' && <Zap className="h-5 w-5" />}
                              </div>
                              <span className="text-xs capitalize">{type}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="effects" className="p-4 space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex gap-2 items-center">
                            <div className="h-8 w-8 flex items-center justify-center bg-blue-50 text-blue-500 rounded-full">
                              <Sparkles className="h-4 w-4" />
                            </div>
                            <label className="text-sm font-medium">Glow Effect</label>
                          </div>
                          <Switch
                            checked={effects.glow}
                            onCheckedChange={() => handleToggleEffect('glow')}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex gap-2 items-center">
                            <div className="h-8 w-8 flex items-center justify-center bg-gray-100 text-gray-500 rounded-full">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2v1"></path>
                                <path d="M3 13v-2"></path>
                                <path d="M21 13v-2"></path>
                                <path d="M15.536 8.464l.707-.707"></path>
                                <path d="M7.757 16.243l.707-.707"></path>
                                <path d="M7.757 8.464l-.707-.707"></path>
                                <path d="M15.536 16.243l-.707-.707"></path>
                                <path d="M18 21H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2zM12 9v6"></path>
                              </svg>
                            </div>
                            <label className="text-sm font-medium">Shadow</label>
                          </div>
                          <Switch
                            checked={effects.shadow}
                            onCheckedChange={() => handleToggleEffect('shadow')}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex gap-2 items-center">
                            <div className="h-8 w-8 flex items-center justify-center bg-cyan-50 text-cyan-500 rounded-full">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 9h18v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"></path>
                                <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"></path>
                                <path d="M12 6v3"></path>
                              </svg>
                            </div>
                            <label className="text-sm font-medium">Reflection</label>
                          </div>
                          <Switch
                            checked={effects.reflection}
                            onCheckedChange={() => handleToggleEffect('reflection')}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex gap-2 items-center">
                            <div className="h-8 w-8 flex items-center justify-center bg-amber-50 text-amber-500 rounded-full">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 7v6h-6"></path>
                                <path d="m21 13-5.434-5.434A4 4 0 0 0 12.28 6.3L7 11l-5 5 3 3 5-5 4.3-4.28a4 4 0 0 0-1.275-3.286L8.59 2"></path>
                              </svg>
                            </div>
                            <label className="text-sm font-medium">Particles</label>
                          </div>
                          <Switch
                            checked={effects.particles}
                            onCheckedChange={() => handleToggleEffect('particles')}
                          />
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="advanced" className="p-4 space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Animation Easing</label>
                        <Select defaultValue="ease-out">
                          <SelectTrigger>
                            <SelectValue placeholder="Select easing" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ease">Ease</SelectItem>
                            <SelectItem value="ease-in">Ease In</SelectItem>
                            <SelectItem value="ease-out">Ease Out</SelectItem>
                            <SelectItem value="ease-in-out">Ease In Out</SelectItem>
                            <SelectItem value="linear">Linear</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Animation Delay (ms)</label>
                        <Slider
                          defaultValue={[0]}
                          min={0}
                          max={2000}
                          step={100}
                        />
                        <div className="flex justify-between mt-1">
                          <span className="text-xs text-gray-500">0ms</span>
                          <span className="text-xs text-gray-500">2000ms</span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Animation Iterations</label>
                        <Select defaultValue="1">
                          <SelectTrigger>
                            <SelectValue placeholder="Select iterations" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 (run once)</SelectItem>
                            <SelectItem value="2">2 times</SelectItem>
                            <SelectItem value="3">3 times</SelectItem>
                            <SelectItem value="infinite">Infinite</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2">
                        <label className="text-sm font-medium">Auto-reverse animation</label>
                        <Switch defaultChecked={false} />
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Define animations keyframes for the particle effects */}
      <style jsx global>{`
        @keyframes float-1 {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-10px) translateX(5px); }
        }
        
        @keyframes float-2 {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-15px) translateX(-5px); }
        }
        
        @keyframes float-3 {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-5px) translateX(-10px); }
        }
        
        .animate-float-1 {
          animation: float-1 3s ease-in-out infinite;
        }
        
        .animate-float-2 {
          animation: float-2 4s ease-in-out infinite;
        }
        
        .animate-float-3 {
          animation: float-3 5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

// Helper function to get the animation class based on the animation type
const getAnimationClass = (type: AnimationType): string => {
  switch (type) {
    case 'flip':
      return 'rotate-y-180';
    case 'fade':
      return 'opacity-0';
    case 'zoom':
      return 'scale-150';
    case 'slide':
      return 'translate-x-full';
    case 'rotate':
      return 'rotate-360';
    case 'glint':
      return 'before:content-[""] before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/80 before:to-transparent before:translate-x-full before:skew-x-12 before:animate-glint';
    default:
      return '';
  }
};

export default CardAnimation;

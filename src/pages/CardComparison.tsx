
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ChevronLeft, Plus, X, ArrowLeft, ArrowRight, Maximize2, Minimize2 } from 'lucide-react';
import { BASEBALL_CARDS } from '@/components/baseball/hooks/useBaseballCard';
import { CardData } from '@/components/baseball/types/BaseballCard';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";

const CardComparison = () => {
  const [selectedCards, setSelectedCards] = useState<CardData[]>([]);
  const [comparisonMode, setComparisonMode] = useState<'visual' | 'stats'>('visual');
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const handleAddCard = (card: CardData) => {
    if (selectedCards.length < 3) {
      setSelectedCards([...selectedCards, card]);
    }
  };
  
  const handleRemoveCard = (index: number) => {
    const newCards = [...selectedCards];
    newCards.splice(index, 1);
    setSelectedCards(newCards);
  };
  
  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
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
                <h1 className="text-3xl font-bold">Card Comparison Tool</h1>
                <p className="text-gray-600">
                  Compare multiple cards side by side to analyze differences in stats, design, and value.
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleToggleFullscreen}
                >
                  {isFullscreen ? (
                    <>
                      <Minimize2 className="mr-1 h-4 w-4" />
                      Exit Fullscreen
                    </>
                  ) : (
                    <>
                      <Maximize2 className="mr-1 h-4 w-4" />
                      Fullscreen
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            <div className={`bg-white shadow-lg rounded-lg overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''}`}>
              {isFullscreen && (
                <div className="bg-gray-100 p-2 flex justify-between items-center">
                  <h2 className="font-semibold">Card Comparison</h2>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleToggleFullscreen}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              
              <div className="border-b">
                <Tabs defaultValue="visual" onValueChange={(value) => setComparisonMode(value as 'visual' | 'stats')}>
                  <div className="px-6">
                    <TabsList className="mt-4">
                      <TabsTrigger value="visual">Visual Comparison</TabsTrigger>
                      <TabsTrigger value="stats">Stats Comparison</TabsTrigger>
                    </TabsList>
                  </div>
                </Tabs>
              </div>
              
              {selectedCards.length === 0 ? (
                <div className="p-10 text-center">
                  <div className="w-24 h-36 mx-auto bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                    <Plus className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No Cards Selected</h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    Select up to three cards to compare their characteristics side by side.
                  </p>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button>Add Card to Compare</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center" className="w-56">
                      {BASEBALL_CARDS.map(card => (
                        <DropdownMenuItem 
                          key={card.id}
                          onClick={() => handleAddCard(card)}
                        >
                          {card.player} ({card.year})
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold">Comparing {selectedCards.length} Card{selectedCards.length !== 1 ? 's' : ''}</h3>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" disabled={selectedCards.length >= 3}>
                          <Plus className="mr-1 h-4 w-4" />
                          Add Card
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {BASEBALL_CARDS
                          .filter(card => !selectedCards.some(c => c.id === card.id))
                          .map(card => (
                            <DropdownMenuItem 
                              key={card.id}
                              onClick={() => handleAddCard(card)}
                            >
                              {card.player} ({card.year})
                            </DropdownMenuItem>
                          ))
                        }
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <ResizablePanelGroup direction="horizontal" className="min-h-[500px]">
                    {selectedCards.map((card, index) => (
                      <React.Fragment key={card.id}>
                        <ResizablePanel defaultSize={100 / selectedCards.length}>
                          <div className="h-full p-3 relative">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="absolute top-0 right-0 z-10" 
                              onClick={() => handleRemoveCard(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                            
                            {comparisonMode === 'visual' ? (
                              <div className="flex flex-col h-full">
                                <div className="text-center mb-2">
                                  <h4 className="font-semibold text-sm">{card.player}</h4>
                                  <p className="text-xs text-gray-500">{card.year} {card.manufacturer}</p>
                                </div>
                                
                                <div className="flex-1 flex items-center justify-center bg-gray-100 rounded-lg p-2">
                                  <div className="relative w-full max-w-[200px] mx-auto">
                                    <img 
                                      src={card.imageUrl} 
                                      alt={card.title}
                                      className="w-full h-auto"
                                    />
                                  </div>
                                </div>
                                
                                <div className="mt-3 text-sm">
                                  <div className="flex justify-between py-1">
                                    <span className="text-gray-600">Card #:</span>
                                    <span>{card.cardNumber}</span>
                                  </div>
                                  <div className="flex justify-between py-1">
                                    <span className="text-gray-600">Position:</span>
                                    <span>{card.position}</span>
                                  </div>
                                  <div className="flex justify-between py-1">
                                    <span className="text-gray-600">Team:</span>
                                    <span>{card.team}</span>
                                  </div>
                                  <div className="flex justify-between py-1">
                                    <span className="text-gray-600">Value:</span>
                                    <span className="font-semibold">{card.value}</span>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="h-full flex flex-col">
                                <div className="text-center mb-2">
                                  <h4 className="font-semibold text-sm">{card.player}</h4>
                                  <p className="text-xs text-gray-500">{card.year} {card.manufacturer}</p>
                                </div>
                                
                                <div className="flex-1 overflow-auto px-2">
                                  <h5 className="font-medium text-sm mb-2">Career Statistics</h5>
                                  
                                  {card.stats && (
                                    <div className="space-y-3">
                                      {card.stats.battingAverage && (
                                        <div>
                                          <p className="text-xs text-gray-500 mb-1">Batting Average</p>
                                          <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
                                            <div 
                                              className="h-full bg-blue-600 rounded-full flex items-center px-2"
                                              style={{ width: `${parseFloat(card.stats.battingAverage) * 100}%` }}
                                            >
                                              <span className="text-xs text-white font-medium">{card.stats.battingAverage}</span>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                      
                                      {card.stats.homeRuns && (
                                        <div>
                                          <p className="text-xs text-gray-500 mb-1">Home Runs</p>
                                          <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
                                            <div 
                                              className="h-full bg-green-600 rounded-full flex items-center px-2"
                                              style={{ width: `${Math.min((parseInt(card.stats.homeRuns) / 800) * 100, 100)}%` }}
                                            >
                                              <span className="text-xs text-white font-medium">{card.stats.homeRuns}</span>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                      
                                      {card.stats.rbis && (
                                        <div>
                                          <p className="text-xs text-gray-500 mb-1">RBIs</p>
                                          <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
                                            <div 
                                              className="h-full bg-purple-600 rounded-full flex items-center px-2"
                                              style={{ width: `${Math.min((parseInt(card.stats.rbis) / 2500) * 100, 100)}%` }}
                                            >
                                              <span className="text-xs text-white font-medium">{card.stats.rbis}</span>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                      
                                      {card.stats.era && (
                                        <div>
                                          <p className="text-xs text-gray-500 mb-1">ERA</p>
                                          <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
                                            <div 
                                              className="h-full bg-orange-600 rounded-full flex items-center px-2"
                                              style={{ width: `${Math.min((5 - parseFloat(card.stats.era)) / 5 * 100, 100)}%` }}
                                            >
                                              <span className="text-xs text-white font-medium">{card.stats.era}</span>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                  
                                  <div className="mt-4">
                                    <h5 className="font-medium text-sm mb-2">Card Details</h5>
                                    <div className="space-y-2">
                                      <div className="flex justify-between">
                                        <span className="text-xs text-gray-500">Rarity:</span>
                                        <div className="flex items-center">
                                          <div className="w-32 h-2 bg-gray-200 rounded-full mr-2">
                                            <div 
                                              className="h-full bg-yellow-500 rounded-full"
                                              style={{ width: `${(card.rarityScore / 10) * 100}%` }}
                                            ></div>
                                          </div>
                                          <span className="text-xs">{card.rarityScore}/10</span>
                                        </div>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-xs text-gray-500">Condition:</span>
                                        <span className="text-xs font-medium">{card.condition}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </ResizablePanel>
                        
                        {index < selectedCards.length - 1 && (
                          <ResizableHandle withHandle />
                        )}
                      </React.Fragment>
                    ))}
                  </ResizablePanelGroup>
                  
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" onClick={() => setSelectedCards([])}>
                      Clear All
                    </Button>
                    
                    <div className="flex-1"></div>
                    
                    <Button variant="outline" size="icon">
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CardComparison;

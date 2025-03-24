
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCards } from '@/context/CardContext';
import { GalleryHorizontal, ChevronLeft, Info, Layers, Award, Tag, RotateCcw, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/lib/types';

const BaseballCardViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cards } = useCards();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  
  // Filter cards for only baseball cards with appropriate tags
  const baseballCards = cards.filter(card => 
    card.tags?.some(tag => ['baseball', 'vintage'].includes(tag.toLowerCase()))
  );
  
  useEffect(() => {
    // Find index of card with matching ID if provided
    if (id) {
      const index = baseballCards.findIndex(card => card.id === id);
      if (index !== -1) {
        setCurrentCardIndex(index);
      }
    }
    
    // Simulate loading time for the 3D scene
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [id, baseballCards]);
  
  const currentCard = baseballCards[currentCardIndex];
  
  const nextCard = () => {
    setIsFlipped(false);
    setRotation({ x: 0, y: 0 });
    setCurrentCardIndex((prev) => (prev + 1) % baseballCards.length);
  };
  
  const prevCard = () => {
    setIsFlipped(false);
    setRotation({ x: 0, y: 0 });
    setCurrentCardIndex((prev) => 
      prev === 0 ? baseballCards.length - 1 : prev - 1
    );
  };
  
  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };
  
  // 3D movement handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartPosition({ x: e.clientX, y: e.clientY });
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - startPosition.x;
    const deltaY = e.clientY - startPosition.y;
    
    setRotation({
      y: rotation.y + deltaX * 0.5,
      x: rotation.x - deltaY * 0.5
    });
    
    setStartPosition({ x: e.clientX, y: e.clientY });
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  const resetRotation = () => {
    setRotation({ x: 0, y: 0 });
  };
  
  if (!currentCard) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black p-4">
        <div className="text-white text-center">
          <GalleryHorizontal className="w-12 h-12 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">No Baseball Cards Found</h1>
          <p className="mb-6">There are no vintage baseball cards in your collection.</p>
          <Button onClick={() => navigate('/gallery')}>
            Back to Gallery
          </Button>
        </div>
      </div>
    );
  }
  
  // Extract year and card set from title, if available
  const cardInfo = {
    year: currentCard.title.match(/(\d{4})/)?.[1] || 'Unknown',
    set: currentCard.title.split(' ')[0] || 'Unknown Set',
    player: currentCard.title.split('#')[1]?.trim().split(' ').slice(1).join(' ') || 
            currentCard.title.split(' ').slice(-2).join(' '),
    number: currentCard.title.match(/#(\d+)/)?.[1] || 'N/A'
  };
  
  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black z-50">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cardshow-blue mb-4"></div>
            <p className="text-white text-lg">Loading card viewer...</p>
          </div>
        </div>
      )}
      
      {/* Top navigation bar */}
      <div className="absolute top-0 left-0 right-0 z-40 p-4 flex justify-between items-center">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/gallery')}
          className="text-white hover:bg-white/10"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Gallery
        </Button>
        
        <div className="flex items-center gap-2">
          <span className="text-white/70 text-sm">
            {currentCardIndex + 1} of {baseballCards.length}
          </span>
          <div className="flex gap-1">
            <Button 
              variant="outline" 
              size="sm"
              onClick={prevCard}
              className="bg-white/10 border-0 hover:bg-white/20 text-white h-8"
            >
              Previous
            </Button>
            <Button 
              variant="outline"
              size="sm"
              onClick={nextCard}
              className="bg-white/10 border-0 hover:bg-white/20 text-white h-8"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main 3D card display */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* 3D card container */}
        <div 
          className="relative perspective-1000"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Floating effect and light reflection */}
          <div className="absolute -inset-20 bg-gradient-radial from-blue-500/20 to-transparent opacity-50 blur-2xl"></div>
          <div className="absolute -inset-10 bg-gradient-radial from-yellow-500/10 to-transparent opacity-30 animate-pulse"></div>
          
          {/* The card itself */}
          <div 
            className={`relative preserve-3d transition-transform duration-700 cursor-grab ${isDragging ? 'cursor-grabbing' : ''}`}
            style={{ 
              transform: `rotateY(${isFlipped ? '180deg' : '0deg'}) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
              transformStyle: 'preserve-3d',
              width: '300px',
              height: '420px'
            }}
          >
            {/* Front face */}
            <div 
              className="absolute w-full h-full backface-hidden rounded-xl overflow-hidden shadow-2xl"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <img 
                src={currentCard.imageUrl} 
                alt={currentCard.title}
                className="w-full h-full object-cover"
              />
              
              {/* Card shine/holographic effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent opacity-50 pointer-events-none"></div>
            </div>
            
            {/* Back face */}
            <div 
              className="absolute w-full h-full backface-hidden bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden shadow-2xl flex flex-col p-6"
              style={{ 
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)'
              }}
            >
              <h3 className="text-white text-xl font-bold mb-4">{currentCard.title}</h3>
              <p className="text-gray-300 text-sm mb-4">{currentCard.description}</p>
              
              <div className="bg-black/30 rounded-lg p-4 mt-auto">
                <h4 className="text-white text-sm font-semibold mb-2">Card Information</h4>
                <ul className="text-gray-300 text-xs space-y-1">
                  <li className="flex justify-between">
                    <span>Year:</span>
                    <span className="font-medium">{cardInfo.year}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Set:</span>
                    <span className="font-medium">{cardInfo.set}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Card #:</span>
                    <span className="font-medium">{cardInfo.number}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Condition:</span>
                    <span className="font-medium">Mint</span>
                  </li>
                </ul>
              </div>
              
              <div className="absolute bottom-3 right-3">
                <div className="flex justify-center items-center w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-lg">
                  <span className="text-xs text-white font-bold">MINT</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Floating rotate indicator */}
          {!isDragging && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-white/30 animate-bounce">
                <div className="flex items-center gap-1">
                  <RotateCcw className="h-5 w-5" />
                  <span className="text-sm">Drag to rotate</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* ESPN-style stats sidebar */}
      <div className="absolute top-20 bottom-20 right-4 w-80 bg-black/80 backdrop-blur-sm rounded-lg p-4 border border-gray-800 shadow-2xl">
        <div className="flex flex-col h-full">
          {/* Card name and logo header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white font-bold text-xl">{cardInfo.player}</h2>
            <div className="bg-red-600 text-white text-xs font-bold py-1 px-2 rounded">
              ESPN
            </div>
          </div>
          
          {/* Stats section */}
          <div className="mb-6">
            <div className="border-l-4 border-red-600 pl-2 mb-2">
              <h3 className="text-gray-400 text-sm font-semibold uppercase">Card Details</h3>
            </div>
            
            <div className="bg-gray-900/50 rounded-md p-3 mb-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-xs">YEAR</p>
                  <p className="text-white font-bold">{cardInfo.year}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">SET</p>
                  <p className="text-white font-bold">{cardInfo.set}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">CARD #</p>
                  <p className="text-white font-bold">{cardInfo.number}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">RARITY</p>
                  <p className="text-white font-bold">High</p>
                </div>
              </div>
            </div>
            
            {/* Market value */}
            <div className="border-l-4 border-red-600 pl-2 mb-2">
              <h3 className="text-gray-400 text-sm font-semibold uppercase">Market Value</h3>
            </div>
            
            <div className="bg-gray-900/50 rounded-md p-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-400 text-xs">PSA 10</p>
                <p className="text-white font-bold">$12,500</p>
              </div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-400 text-xs">PSA 9</p>
                <p className="text-white font-bold">$6,200</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-gray-400 text-xs">PSA 8</p>
                <p className="text-white font-bold">$2,100</p>
              </div>
            </div>
          </div>
          
          {/* Tags */}
          <div className="border-l-4 border-red-600 pl-2 mb-2">
            <h3 className="text-gray-400 text-sm font-semibold uppercase">Tags</h3>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-auto">
            {currentCard.tags?.map((tag, index) => (
              <div key={index} className="bg-gray-800 text-gray-300 text-xs py-1 px-2 rounded-full flex items-center">
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </div>
            ))}
          </div>
          
          {/* Source */}
          <div className="mt-auto pt-4 border-t border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs">SOURCE</p>
                <a 
                  href="https://www.net54baseball.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  net54baseball.com
                </a>
              </div>
              <img 
                src="/placeholder.svg" 
                alt="Net54baseball" 
                className="h-8 w-8 rounded"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-2 z-40">
        <Button
          onClick={resetRotation}
          className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-0"
        >
          <Layers className="h-4 w-4 mr-2" />
          Reset View
        </Button>
        <Button
          onClick={flipCard}
          className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-0"
        >
          <RotateCw className="h-4 w-4 mr-2" />
          Flip Card
        </Button>
        <Button
          className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-0"
        >
          <Award className="h-4 w-4 mr-2" />
          Add to Collection
        </Button>
      </div>
    </div>
  );
};

export default BaseballCardViewer;

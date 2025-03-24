import React, { useRef, useState, useEffect } from 'react';
import { 
  Award, 
  BarChart4, 
  Calendar, 
  Clock, 
  Copyright, 
  Crop, 
  Dumbbell, 
  Flame,
  Info, 
  Medal, 
  Ruler, 
  User 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useParams } from 'react-router-dom';

type CardData = {
  id: string;
  title: string;
  year: string;
  player: string;
  team: string;
  position: string;
  manufacturer: string;
  cardNumber: string;
  value: string;
  rarityScore: number;
  condition: string;
  imageUrl: string;
  backImageUrl?: string;
  stats?: {
    battingAverage?: string;
    homeRuns?: string;
    rbis?: string;
    era?: string;
    wins?: string;
    strikeouts?: string;
  };
};

const BASEBALL_CARDS: CardData[] = [
  {
    id: "t206-wagner",
    title: "1909-11 T206 Honus Wagner",
    year: "1909-11",
    player: "Honus Wagner",
    team: "Pittsburgh Pirates",
    position: "Shortstop",
    manufacturer: "American Tobacco Company",
    cardNumber: "T206",
    value: "$6,600,000+",
    rarityScore: 9.8,
    condition: "PSA 3 VG",
    imageUrl: "/lovable-uploads/a38aa501-ea2d-4416-9699-1e69b1826233.png",
    stats: {
      battingAverage: ".327",
      homeRuns: "101",
      rbis: "1,732"
    }
  },
  {
    id: "1952-topps-mantle",
    title: "1952 Topps #311 Mickey Mantle",
    year: "1952",
    player: "Mickey Mantle",
    team: "New York Yankees",
    position: "Center Field",
    manufacturer: "Topps",
    cardNumber: "#311",
    value: "$5,200,000+",
    rarityScore: 9.2,
    condition: "PSA 9 MINT",
    imageUrl: "/lovable-uploads/667e6ad2-af96-40ac-bd16-a69778e14b21.png",
    backImageUrl: "/lovable-uploads/c381b388-5693-44a6-852b-93af5f0d5217.png",
    stats: {
      battingAverage: ".298",
      homeRuns: "536",
      rbis: "1,509"
    }
  },
  {
    id: "1933-goudey-ruth",
    title: "1933 Goudey #53 Babe Ruth",
    year: "1933",
    player: "Babe Ruth",
    team: "New York Yankees",
    position: "Outfield",
    manufacturer: "Goudey",
    cardNumber: "#53",
    value: "$500,000+",
    rarityScore: 8.7,
    condition: "PSA 8 NM-MT",
    imageUrl: "/lovable-uploads/79a099b9-c77a-491e-9755-ba25419791f5.png",
    stats: {
      battingAverage: ".342",
      homeRuns: "714",
      rbis: "2,213"
    }
  }
];

const BaseballCardRenderer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isFlipped, setIsFlipped] = useState(false);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const [cardData, setCardData] = useState<CardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    
    const card = id 
      ? BASEBALL_CARDS.find(card => card.id === id) 
      : BASEBALL_CARDS[0];
      
    if (card) {
      setCardData(card);
    }
    
    setIsLoading(false);
  }, [id]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardContainerRef.current) return;
    
    const rect = cardContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const maxRotation = 12;
    
    const newRotateY = ((x - centerX) / centerX) * maxRotation;
    const newRotateX = ((centerY - y) / centerY) * maxRotation;
    
    setRotateX(newRotateX);
    setRotateY(newRotateY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
  };
  
  if (isLoading || !cardData) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-64 h-96 bg-gray-800 rounded-lg"></div>
          <div className="mt-4 h-4 bg-gray-800 rounded w-48"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-gray-900 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4 text-white">
        <div className="container mx-auto max-w-7xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-red-600 border-none text-white uppercase font-bold px-3 py-1">
                Live
              </Badge>
              <span className="text-xs text-gray-300">Card Showcase</span>
            </div>
            <div className="text-xs text-gray-300">
              {cardData.manufacturer} • {cardData.year}
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mt-2">{cardData.title}</h1>
        </div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          ref={cardContainerRef}
          className="perspective-1000 w-64 md:w-80 h-96 md:h-[480px]"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div 
            className="preserve-3d relative w-full h-full transition-transform duration-700 ease-out floating-card"
            style={{ 
              transform: `
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg) 
                ${isFlipped ? 'rotateY(180deg)' : ''}
              `,
            }}
          >
            <div 
              className={`backface-hidden absolute w-full h-full rounded-lg shadow-2xl
                          bg-cover bg-center overflow-hidden`}
              style={{ backgroundImage: `url(${cardData.imageUrl})` }}
            >
              <div className="card-shine absolute inset-0"></div>
            </div>
            
            <div 
              className={`backface-hidden absolute w-full h-full rounded-lg shadow-2xl
                          bg-cover bg-center overflow-hidden`}
              style={{ 
                transform: 'rotateY(180deg)',
                backgroundImage: cardData.backImageUrl ? `url(${cardData.backImageUrl})` : 'linear-gradient(45deg, #2c3e50, #34495e)'
              }}
            >
              {!cardData.backImageUrl && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-white text-center">
                  <h3 className="text-xl font-bold mb-4">{cardData.player}</h3>
                  <p className="text-sm mb-6">{cardData.team} • {cardData.position}</p>
                  
                  {cardData.stats && (
                    <div className="grid grid-cols-2 gap-4 w-full">
                      {cardData.stats.battingAverage && (
                        <div className="text-center">
                          <p className="text-xs mb-1">AVG</p>
                          <p className="text-lg font-bold">{cardData.stats.battingAverage}</p>
                        </div>
                      )}
                      {cardData.stats.homeRuns && (
                        <div className="text-center">
                          <p className="text-xs mb-1">HR</p>
                          <p className="text-lg font-bold">{cardData.stats.homeRuns}</p>
                        </div>
                      )}
                      {cardData.stats.rbis && (
                        <div className="text-center">
                          <p className="text-xs mb-1">RBI</p>
                          <p className="text-lg font-bold">{cardData.stats.rbis}</p>
                        </div>
                      )}
                      {cardData.stats.era && (
                        <div className="text-center">
                          <p className="text-xs mb-1">ERA</p>
                          <p className="text-lg font-bold">{cardData.stats.era}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-1/2 right-4 transform -translate-y-1/2 w-64 md:w-80 bg-black/60 backdrop-blur-md p-4 rounded-lg border-l-4 border-blue-500 text-white">
        <h3 className="text-lg font-bold flex items-center mb-4">
          <Info className="mr-2 h-5 w-5 text-blue-400" /> Card Details
        </h3>
        
        <div className="space-y-3 text-sm">
          <div className="flex items-center">
            <User className="mr-2 h-4 w-4 text-blue-400" />
            <span className="text-gray-400">Player:</span>
            <span className="ml-auto font-medium">{cardData.player}</span>
          </div>
          
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4 text-blue-400" />
            <span className="text-gray-400">Year:</span>
            <span className="ml-auto font-medium">{cardData.year}</span>
          </div>
          
          <div className="flex items-center">
            <Copyright className="mr-2 h-4 w-4 text-blue-400" />
            <span className="text-gray-400">Manufacturer:</span>
            <span className="ml-auto font-medium">{cardData.manufacturer}</span>
          </div>
          
          <div className="flex items-center">
            <Crop className="mr-2 h-4 w-4 text-blue-400" />
            <span className="text-gray-400">Card #:</span>
            <span className="ml-auto font-medium">{cardData.cardNumber}</span>
          </div>
          
          <div className="flex items-center">
            <Flame className="mr-2 h-4 w-4 text-orange-400" />
            <span className="text-gray-400">Estimated Value:</span>
            <span className="ml-auto font-medium text-green-400">{cardData.value}</span>
          </div>
          
          <div className="flex items-center">
            <Award className="mr-2 h-4 w-4 text-yellow-400" />
            <span className="text-gray-400">Condition:</span>
            <span className="ml-auto font-medium">{cardData.condition}</span>
          </div>
          
          <div className="pt-2">
            <div className="flex items-center mb-1">
              <Medal className="mr-2 h-4 w-4 text-amber-400" />
              <span className="text-gray-400">Rarity Score:</span>
              <span className="ml-auto font-medium">{cardData.rarityScore}/10</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-1.5">
              <div 
                className="bg-amber-400 h-1.5 rounded-full" 
                style={{ width: `${(cardData.rarityScore/10) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      
      {cardData.stats && (
        <div className="absolute top-1/2 left-4 transform -translate-y-1/2 w-64 md:w-72 bg-black/60 backdrop-blur-md p-4 rounded-lg border-r-4 border-red-500 text-white hidden lg:block">
          <h3 className="text-lg font-bold flex items-center mb-4">
            <BarChart4 className="mr-2 h-5 w-5 text-red-400" /> Career Stats
          </h3>
          
          <div className="space-y-4">
            {cardData.stats.battingAverage && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-400">Batting Average</span>
                  <span className="font-bold">{cardData.stats.battingAverage}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${parseFloat(cardData.stats.battingAverage) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            {cardData.stats.homeRuns && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-400">Home Runs</span>
                  <span className="font-bold">{cardData.stats.homeRuns}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full" 
                    style={{ width: `${Math.min(parseInt(cardData.stats.homeRuns) / 800, 1) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            {cardData.stats.rbis && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-400">RBIs</span>
                  <span className="font-bold">{cardData.stats.rbis}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full" 
                    style={{ width: `${Math.min(parseInt(cardData.stats.rbis.replace(',', '')) / 2500, 1) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
        <div className="container mx-auto flex justify-center">
          <Button 
            onClick={toggleFlip}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Flip Card
          </Button>
        </div>
      </div>
      
      <div className="absolute bottom-20 left-0 right-0 p-4">
        <div className="container mx-auto flex justify-center gap-2">
          {BASEBALL_CARDS.map((card) => (
            <a 
              key={card.id}
              href={`/baseball-card-viewer/${card.id}`}
              className={`w-3 h-3 rounded-full transition-all ${
                cardData.id === card.id ? 'bg-white scale-125' : 'bg-gray-500 hover:bg-gray-300'
              }`}
              aria-label={card.title}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BaseballCardRenderer;

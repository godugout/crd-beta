
import React from 'react';
import { CardData } from '@/types/card';

interface CardBackProps {
  card: CardData;
}

const CardBack: React.FC<CardBackProps> = ({ card }) => {
  // Function to generate a geometric pattern based on card theme
  const getPatternStyle = () => {
    const { backgroundColor, textColor } = card;
    
    // Create different pattern styles based on card type
    let patternStyle = {};
    
    // Determine pattern type based on card theme
    switch (card.cardType) {
      case "Artist Series":
        patternStyle = {
          backgroundImage: `repeating-linear-gradient(45deg, ${backgroundColor}22, ${backgroundColor}22 10px, ${backgroundColor}44 10px, ${backgroundColor}44 20px)`,
          backgroundSize: '100% 100%',
        };
        break;
      default:
        // Default diagonal pattern
        patternStyle = {
          backgroundImage: `repeating-linear-gradient(45deg, ${backgroundColor}11, ${backgroundColor}33 10px)`,
          backgroundSize: '100% 100%',
        };
    }
    
    return patternStyle;
  };

  // Get some lyrics or quotes based on the card name
  const getQuote = () => {
    const nameToQuote: Record<string, string> = {
      "Prince": "Dearly beloved, we are gathered here today to get through this thing called life.",
      "Michael Jordan": "I've missed more than 9,000 shots in my career. I've lost almost 300 games. 26 times, I've been trusted to take the game winning shot and missed. I've failed over and over and over again in my life. And that is why I succeed.",
      "Elvis Presley": "Truth is like the sun. You can shut it out for a time, but it ain't goin' away.",
      "Bob Marley": "One good thing about music, when it hits you, you feel no pain.",
      "Tupac Shakur": "I'm not saying I'm gonna change the world, but I guarantee that I will spark the brain that will change the world.",
      "Notorious B.I.G.": "Stay far from timid, only make moves when your heart's in it."
    };
    
    return nameToQuote[card.name] || "Legacy lives on through the game.";
  };

  return (
    <div className="absolute inset-0 flex flex-col p-6 bg-white overflow-hidden">
      {/* Pattern background */}
      <div 
        className="absolute inset-0 opacity-90"
        style={getPatternStyle()}
      />
      
      {/* Card details overlay */}
      <div className="relative z-10 flex flex-col h-full">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold" style={{ color: card.backgroundColor }}>
            {card.name}
          </h2>
          <div className="flex justify-center items-center gap-2">
            <span className="text-sm font-medium">{card.team}</span>
            <span className="flex items-center justify-center h-5 w-5 rounded-full bg-gray-200 text-xs font-bold">
              {card.jersey}
            </span>
          </div>
        </div>
        
        <div className="mb-4 text-center">
          <span className="inline-block px-3 py-1 rounded-full text-xs" 
                style={{ 
                  backgroundColor: card.backgroundColor,
                  color: card.textColor
                }}>
            {card.set} • #{card.cardNumber}
          </span>
        </div>
        
        <div className="flex-grow flex flex-col justify-center">
          <div className="text-center italic mb-6 px-4">
            "{getQuote()}"
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex flex-col">
              <span className="text-gray-500 text-xs">Artist</span>
              <span className="font-medium">{card.artist}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500 text-xs">Year</span>
              <span className="font-medium">{card.year}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500 text-xs">Effect</span>
              <span className="font-medium">{card.specialEffect}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500 text-xs">Series</span>
              <span className="font-medium">{card.cardType}</span>
            </div>
          </div>
        </div>
        
        <div className="mt-auto pt-4 text-xs text-center text-gray-400">
          Tap to flip
        </div>
      </div>
    </div>
  );
};

export default CardBack;


import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';

// Baseball card data from the renderer
const BASEBALL_CARDS = [
  {
    id: "t206-wagner",
    title: "1909-11 T206 Honus Wagner",
    year: "1909-11",
    player: "Honus Wagner",
    team: "Pittsburgh Pirates",
    value: "$6,600,000+",
    imageUrl: "/lovable-uploads/a38aa501-ea2d-4416-9699-1e69b1826233.png",
  },
  {
    id: "1952-topps-mantle",
    title: "1952 Topps #311 Mickey Mantle",
    year: "1952",
    player: "Mickey Mantle",
    team: "New York Yankees",
    value: "$5,200,000+",
    imageUrl: "/lovable-uploads/667e6ad2-af96-40ac-bd16-a69778e14b21.png",
  },
  {
    id: "1933-goudey-ruth",
    title: "1933 Goudey #53 Babe Ruth",
    year: "1933",
    player: "Babe Ruth",
    team: "New York Yankees",
    value: "$500,000+",
    imageUrl: "/lovable-uploads/79a099b9-c77a-491e-9755-ba25419791f5.png",
  }
];

// Group cards by era
const cardsByEra = BASEBALL_CARDS.reduce((acc, card) => {
  const era = parseInt(card.year.split('-')[0], 10);
  const eraKey = era < 1950 ? 'Pre-1950 Vintage' : 'Modern Era';
  
  if (!acc[eraKey]) {
    acc[eraKey] = [];
  }
  
  acc[eraKey].push(card);
  return acc;
}, {} as Record<string, typeof BASEBALL_CARDS>);

const BaseballCardSidebar = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 bg-gray-800/80 backdrop-blur-sm">
        <h2 className="text-xl font-bold text-white">Card Collection</h2>
        <p className="text-sm text-gray-400">Explore rare baseball cards</p>
      </div>
      
      <Separator className="bg-gray-700" />
      
      <div className="flex-1 overflow-auto p-3">
        <Accordion type="multiple" defaultValue={['Pre-1950 Vintage', 'Modern Era']} className="space-y-3">
          {Object.entries(cardsByEra).map(([era, cards]) => (
            <AccordionItem key={era} value={era} className="border-gray-700">
              <AccordionTrigger className="text-white hover:text-white hover:no-underline py-2 px-1">
                <span className="flex items-center">
                  {era}
                  <Badge className="ml-2 bg-gray-700 text-gray-300">{cards.length}</Badge>
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-1">
                  {cards.map((card) => (
                    <Card 
                      key={card.id} 
                      className={`overflow-hidden cursor-pointer transition-all duration-200 hover:bg-gray-700 ${id === card.id ? 'bg-gray-700 ring-2 ring-blue-500' : 'bg-gray-800'}`}
                      onClick={() => navigate(`/baseball-card-viewer/${card.id}`)}
                    >
                      <CardContent className="p-3 flex space-x-3">
                        <div className="h-16 w-12 rounded overflow-hidden bg-gray-900 flex-shrink-0">
                          <img 
                            src={card.imageUrl} 
                            alt={card.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-white truncate">{card.player}</h3>
                          <p className="text-xs text-gray-400">{card.year} • {card.team}</p>
                          <p className="text-xs font-semibold text-green-400 mt-1">{card.value}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      
      <Separator className="bg-gray-700" />
      
      <div className="p-3 bg-gray-800/50">
        <div className="text-xs text-gray-400 mb-1">Explore more at</div>
        <div className="text-sm font-medium text-blue-400">CardShow Auctions</div>
      </div>
    </div>
  );
};

export default BaseballCardSidebar;

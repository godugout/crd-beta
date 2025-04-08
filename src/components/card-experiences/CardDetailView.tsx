
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCards } from '@/context/CardContext';
import { 
  ChevronLeft, 
  Share,
  Heart,
  CircleUser,
  ChevronDown,
  CircleCheck,
  Printer
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface CardDetailViewProps {
  cardId: string;
  onBack: () => void;
}

const CardDetailView: React.FC<CardDetailViewProps> = ({ cardId, onBack }) => {
  const { cards } = useCards();
  const [liked, setLiked] = useState(false);
  const [collected, setCollected] = useState(false);
  const [activeTab, setActiveTab] = useState('info');
  
  const card = cards.find(c => c.id === cardId);
  
  if (!card) {
    return (
      <div className="container py-12 text-center">
        <p>Card not found</p>
        <Button onClick={onBack} className="mt-4">Go back</Button>
      </div>
    );
  }
  
  // Get template style if available
  const templateStyle = card.designMetadata?.cardStyle || {
    borderRadius: '8px',
    borderColor: '#22c55e',
    frameColor: '#22c55e',
    frameWidth: 3,
    shadowColor: 'rgba(34, 197, 94, 0.5)',
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-4">
          <button 
            onClick={onBack}
            className="flex items-center text-sm text-gray-400 hover:text-white"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back to Cards
          </button>
          
          <div className="flex items-center space-x-2 text-sm">
            <Link to="/project/topps-project70" className="text-gray-400 hover:text-white">
              Topps Project70
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-600" />
            <span>Paige x Nas</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <div className="relative">
              <div 
                className="rounded-lg overflow-hidden"
                style={{
                  borderRadius: templateStyle.borderRadius || '8px',
                  boxShadow: `0 0 20px ${templateStyle.shadowColor || 'rgba(34, 197, 94, 0.5)'}`,
                  border: `${templateStyle.frameWidth || 3}px solid ${templateStyle.borderColor || templateStyle.frameColor || '#22c55e'}`,
                }}
              >
                <img 
                  src={card.imageUrl} 
                  alt={card.title}
                  className="w-full h-auto"
                />
              </div>
              
              <div className="absolute bottom-4 left-4">
                <Badge className="bg-gray-900 text-white border border-gray-700">
                  CARD {card.id.slice(0, 4)}
                </Badge>
              </div>
              
              <div className="absolute bottom-4 right-4">
                <Badge className="bg-green-500 hover:bg-green-600">
                  TOPPS
                </Badge>
              </div>
            </div>
            
            <div className="flex justify-center mt-6 space-x-8">
              <div className="text-center">
                <p className="text-xs text-gray-400 mb-1">1</p>
                <p className="text-gray-300">of 1</p>
              </div>
              
              <Button 
                variant="outline" 
                className="flex flex-col items-center h-auto py-2 border-gray-700"
                onClick={() => setActiveTab('history')}
              >
                <svg className="w-5 h-5 mb-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <span className="text-xs">History</span>
              </Button>
              
              <Button 
                variant={liked ? "default" : "outline"}
                className={`flex flex-col items-center h-auto py-2 ${
                  liked ? "bg-red-500 text-white border-red-500" : "border-gray-700"
                }`}
                onClick={() => setLiked(!liked)}
              >
                <Heart className={`w-5 h-5 mb-1 ${liked ? "fill-current" : ""}`} />
                <span className="text-xs">Liked</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="flex flex-col items-center h-auto py-2 border-gray-700"
              >
                <Share className="w-5 h-5 mb-1" />
                <span className="text-xs">Share</span>
              </Button>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold mb-1">{card.title}</h1>
                  <p className="text-gray-400">
                    Remix of the 1965 <br />Satchel Paige
                  </p>
                </div>
                
                <Button variant="ghost" className="rounded-full p-2">
                  <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24">
                    <path d="M12 3C10.9 3 10 3.9 10 5C10 6.1 10.9 7 12 7C13.1 7 14 6.1 14 5C14 3.9 13.1 3 12 3ZM12 17C10.9 17 10 17.9 10 19C10 20.1 10.9 21 12 21C13.1 21 14 20.1 14 19C14 17.9 13.1 17 12 17ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10Z" fill="currentColor" />
                  </svg>
                </Button>
              </div>
              
              <div className="flex items-center mt-4 mb-6">
                <Badge className="bg-green-500 text-white mr-2">$83 USD</Badge>
                <Badge className="bg-gray-800 text-white border border-gray-700">NFS</Badge>
              </div>
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
                <TabsList className="grid grid-cols-3 mb-6">
                  <TabsTrigger value="info">Info</TabsTrigger>
                  <TabsTrigger value="fans">Fans</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>
                
                <TabsContent value="info" className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400">Card 53 in <Link to="/projects/topps70" className="text-blue-400 hover:underline">Topps Project70®</Link></p>
                  </div>
                  
                  <div className="bg-gray-900 rounded-lg p-4">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center mr-3">
                        <CircleUser className="text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Creator</p>
                        <p className="text-sm text-gray-400">DJ Skee</p>
                      </div>
                      <div className="ml-auto">
                        <Badge className="bg-amber-400 text-black">23</Badge>
                      </div>
                      <Button className="ml-2 bg-green-500 hover:bg-green-600">
                        Printable
                      </Button>
                    </div>
                    
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                        <img src="/lovable-uploads/7bb9f93e-4a42-4b96-9429-8b2966efd3a6.png" alt="Owner avatar" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-medium">Owner</p>
                        <p className="text-sm text-gray-400">@jaybhai</p>
                      </div>
                      <Button variant="outline" className="ml-auto border-gray-700">
                        View Showcase
                      </Button>
                    </div>
                  </div>
                  
                  <div className="bg-gray-900 rounded-lg p-4">
                    <div className="flex justify-between mb-3">
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full overflow-hidden mr-2">
                          <img src="/lovable-uploads/7bb9f93e-4a42-4b96-9429-8b2966efd3a6.png" alt="Bidder avatar" className="w-full h-full object-cover" />
                        </div>
                        <p className="text-sm">Highest bid by <span className="text-blue-400">@jaybhai</span></p>
                      </div>
                    </div>
                    
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-2xl font-bold">1.46 ETH</p>
                        <p className="text-sm text-gray-400">$2,764.89</p>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button className="bg-blue-500 hover:bg-blue-600">
                          Buy now
                        </Button>
                        <Button variant="outline" className="border-gray-700">
                          Place bid
                        </Button>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-800 text-sm text-gray-400 flex justify-between">
                      <div>Service fee: 1.5%</div>
                      <div>0.003 ETH</div>
                      <div>$4.62</div>
                    </div>
                  </div>
                  
                  <Button className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600">
                    <Printer className="h-4 w-4" />
                    Request Printing
                  </Button>
                </TabsContent>
                
                <TabsContent value="fans">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <CircleUser className="h-8 w-8 text-gray-400 mr-3" />
                      <div>
                        <p className="font-medium">@collector123</p>
                        <p className="text-sm text-gray-400">Liked this card</p>
                      </div>
                      <Badge className="ml-auto">2h ago</Badge>
                    </div>
                    
                    <div className="flex items-center">
                      <CircleUser className="h-8 w-8 text-gray-400 mr-3" />
                      <div>
                        <p className="font-medium">@cardlover</p>
                        <p className="text-sm text-gray-400">Added to wishlist</p>
                      </div>
                      <Badge className="ml-auto">5h ago</Badge>
                    </div>
                    
                    <div className="flex items-center">
                      <CircleUser className="h-8 w-8 text-gray-400 mr-3" />
                      <div>
                        <p className="font-medium">@sportsfan</p>
                        <p className="text-sm text-gray-400">Shared this card</p>
                      </div>
                      <Badge className="ml-auto">1d ago</Badge>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="history">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mr-3">
                        <CircleCheck className="text-white h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">Created</p>
                        <p className="text-sm text-gray-400">by DJ Skee</p>
                      </div>
                      <Badge className="ml-auto">Apr 15, 2023</Badge>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center mr-3">
                        <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                          <path d="M9 12L11 14L15 10M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">Purchased</p>
                        <p className="text-sm text-gray-400">by @jaybhai for 1.2 ETH</p>
                      </div>
                      <Badge className="ml-auto">Apr 18, 2023</Badge>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center mr-3">
                        <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                          <path d="M15 10L19 14M19 14L15 18M19 14H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">Listed</p>
                        <p className="text-sm text-gray-400">for 1.5 ETH</p>
                      </div>
                      <Badge className="ml-auto">May 2, 2023</Badge>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
        
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            Featured in these <span className="text-green-500 ml-2">Collections</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeaturedCollection
              name="Card Remixes"
              coverUrl="/lovable-uploads/93353027-d213-4314-8ab9-0d38bb552e8a.png"
              owner="@jaybhai"
              itemCount={28}
              images={[
                "/lovable-uploads/38b125d7-2257-4d56-98fa-c1ff2a7be7ea.png",
                "/lovable-uploads/f07b9e90-98ec-4e0c-bca4-71acd9ae9924.png",
                "/lovable-uploads/7bb9f93e-4a42-4b96-9429-8b2966efd3a6.png",
              ]}
            />
            
            <FeaturedCollection
              name="Hip Hop Card Art"
              coverUrl="/lovable-uploads/f07b9e90-98ec-4e0c-bca4-71acd9ae9924.png"
              owner="@nastradamus"
              itemCount={9}
              images={[
                "/lovable-uploads/f07b9e90-98ec-4e0c-bca4-71acd9ae9924.png",
                "/lovable-uploads/38b125d7-2257-4d56-98fa-c1ff2a7be7ea.png",
                "/lovable-uploads/7bb9f93e-4a42-4b96-9429-8b2966efd3a6.png",
              ]}
            />
            
            <FeaturedCollection
              name="Topps Project70"
              coverUrl="/lovable-uploads/38b125d7-2257-4d56-98fa-c1ff2a7be7ea.png"
              owner="@topps_official"
              itemCount={700}
              images={[
                "/lovable-uploads/7bb9f93e-4a42-4b96-9429-8b2966efd3a6.png", 
                "/lovable-uploads/38b125d7-2257-4d56-98fa-c1ff2a7be7ea.png",
                "/lovable-uploads/93353027-d213-4314-8ab9-0d38bb552e8a.png",
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

interface FeaturedCollectionProps {
  name: string;
  coverUrl: string;
  owner: string;
  itemCount: number;
  images: string[];
}

const FeaturedCollection: React.FC<FeaturedCollectionProps> = ({
  name,
  coverUrl,
  owner,
  itemCount,
  images
}) => {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
      <Link to={`/collection/${name.toLowerCase().replace(/\s+/g, '-')}`}>
        <div className="aspect-video relative">
          <img src={coverUrl} alt={name} className="w-full h-full object-cover" />
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-semibold">{name}</h3>
          <p className="text-sm text-gray-400">By {owner}</p>
          
          <div className="grid grid-cols-3 gap-2 mt-3">
            {images.map((img, index) => (
              <div key={index} className="aspect-square rounded-md overflow-hidden">
                <img src={img} alt={`Collection thumbnail ${index + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          
          <p className="mt-3 text-sm font-medium">{itemCount} ITEMS</p>
        </div>
      </Link>
    </div>
  );
};

const ChevronRight = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}><path d="m9 18 6-6-6-6"/></svg>
);

export default CardDetailView;

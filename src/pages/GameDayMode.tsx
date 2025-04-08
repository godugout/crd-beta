
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Camera, Image, MapPin, Clock, Share, Star, Bookmark, Upload, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import QuickCapture from '@/components/game-day/QuickCapture';
import GameDetails from '@/components/game-day/GameDetails';
import OfflineIndicator from '@/components/game-day/OfflineIndicator';
import { useLocationService } from '@/hooks/useLocationService';
import { useConnectivity } from '@/hooks/useConnectivity';

const GameDayMode = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('capture');
  const { 
    location, 
    nearbyStadium,
    stadiumSection,
    isLocating,
    locationError 
  } = useLocationService();

  const { 
    isOnline, 
    offlineItems, 
    syncOfflineItems 
  } = useConnectivity();

  // Auto-detect sections at Coliseum
  useEffect(() => {
    if (nearbyStadium?.name === 'Oakland Coliseum') {
      toast.success(`Welcome to ${nearbyStadium.name}!`);
    }
  }, [nearbyStadium]);

  // Process sync when coming back online
  useEffect(() => {
    if (isOnline && offlineItems.length > 0) {
      syncOfflineItems().then(syncedCount => {
        if (syncedCount > 0) {
          toast.success(`Synced ${syncedCount} memories from offline storage`);
        }
      });
    }
  }, [isOnline, offlineItems]);

  // Get today's game info
  const todayGameInfo = nearbyStadium?.todayGame || {
    opponent: 'Unknown Team',
    date: new Date().toLocaleDateString(),
    time: '1:05 PM',
    isHomeGame: true
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar />
      
      {!isOnline && <OfflineIndicator itemCount={offlineItems.length} />}
      
      <main className="container mx-auto pt-20 px-4">
        {/* Stadium Context Banner */}
        <div className="bg-gradient-to-r from-[#003831] to-[#006341] rounded-lg p-4 mb-4 text-white shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold">Game Day Mode</h1>
              <div className="flex items-center text-sm mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                {isLocating ? (
                  <span>Locating...</span>
                ) : locationError ? (
                  <span>Location unavailable</span>
                ) : nearbyStadium ? (
                  <span>{nearbyStadium.name} {stadiumSection ? `• Section ${stadiumSection}` : ''}</span>
                ) : (
                  <span>Not at a stadium</span>
                )}
              </div>
            </div>
            
            <div className="flex flex-col items-end">
              <Badge variant="outline" className="bg-white/10 border-white/20">
                {todayGameInfo.isHomeGame ? 'Home' : 'Away'}
              </Badge>
              <div className="flex items-center text-xs mt-2">
                <Clock className="h-3 w-3 mr-1" />
                <span>{todayGameInfo.time}</span>
              </div>
            </div>
          </div>
          
          {nearbyStadium && (
            <div className="mt-3 text-sm flex items-center justify-between">
              <div>
                <span className="font-semibold text-[#EFB21E]">Today:</span> A's vs {todayGameInfo.opponent}
              </div>
              <Button 
                variant="secondary" 
                size="sm" 
                className="h-8 bg-white/10 hover:bg-white/20 border-none"
                onClick={() => navigate('/oakland/create')}
              >
                Create Memory
              </Button>
            </div>
          )}
        </div>
        
        <Tabs defaultValue="capture" className="mb-8" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="capture">Capture</TabsTrigger>
            <TabsTrigger value="gameinfo">Game Info</TabsTrigger>
            <TabsTrigger value="saved">
              Saved
              {offlineItems.length > 0 && (
                <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
                  {offlineItems.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="capture">
            <QuickCapture 
              stadiumContext={nearbyStadium} 
              isOnline={isOnline}
            />
          </TabsContent>
          
          <TabsContent value="gameinfo">
            <GameDetails 
              gameInfo={todayGameInfo} 
              stadiumInfo={nearbyStadium}
            />
          </TabsContent>
          
          <TabsContent value="saved">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Saved Items</h3>
                {!isOnline && offlineItems.length > 0 && (
                  <div className="flex items-center text-sm text-amber-600">
                    <WifiOff className="h-4 w-4 mr-1" />
                    <span>Will sync when online</span>
                  </div>
                )}
              </div>
              
              {offlineItems.length === 0 ? (
                <Card className="p-8 text-center text-gray-500">
                  <Image className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p>No saved items yet.</p>
                  <p className="text-sm mt-2">
                    Items captured while offline will appear here
                  </p>
                </Card>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {offlineItems.map(item => (
                    <Card key={item.id} className="overflow-hidden">
                      <div className="aspect-[3/4] bg-gray-100 relative">
                        {item.imageUrl ? (
                          <img 
                            src={item.imageUrl} 
                            alt={item.title || 'Memory'} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Image className="h-8 w-8 opacity-30" />
                          </div>
                        )}
                        
                        {!isOnline && (
                          <div className="absolute top-2 right-2">
                            <Badge variant="outline" className="bg-black/50 text-white border-none">
                              Offline
                            </Badge>
                          </div>
                        )}
                      </div>
                      <div className="p-2">
                        <h4 className="font-medium text-sm truncate">{item.title || 'Untitled'}</h4>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-gray-500">
                            {new Date(item.createdAt).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                          </span>
                          
                          <div className="flex space-x-1">
                            <Button size="icon" variant="ghost" className="h-7 w-7">
                              <Share className="h-3 w-3" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-7 w-7">
                              <Star className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
              
              {isOnline && offlineItems.length > 0 && (
                <Button 
                  variant="default" 
                  className="w-full mt-2" 
                  onClick={syncOfflineItems}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Sync {offlineItems.length} items now
                </Button>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      {/* Fixed Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-3">
        <div className="grid grid-cols-5 gap-1">
          <Button 
            variant={activeTab === 'capture' ? 'default' : 'outline'} 
            className="h-16 flex flex-col items-center justify-center"
            onClick={() => setActiveTab('capture')}
          >
            <Camera className="h-5 w-5 mb-1" />
            <span className="text-xs">Capture</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-16 flex flex-col items-center justify-center"
            onClick={() => navigate('/oakland/create')}
          >
            <Image className="h-5 w-5 mb-1" />
            <span className="text-xs">Memory</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-16 flex flex-col items-center justify-center"
            onClick={() => navigate('/gallery')}
          >
            <Bookmark className="h-5 w-5 mb-1" />
            <span className="text-xs">Gallery</span>
          </Button>
          
          <Button 
            variant={activeTab === 'gameinfo' ? 'default' : 'outline'} 
            className="h-16 flex flex-col items-center justify-center"
            onClick={() => setActiveTab('gameinfo')}
          >
            <MapPin className="h-5 w-5 mb-1" />
            <span className="text-xs">Stadium</span>
          </Button>
          
          <Button 
            variant={activeTab === 'saved' ? 'default' : 'outline'} 
            className="h-16 flex flex-col items-center justify-center relative"
            onClick={() => setActiveTab('saved')}
          >
            {offlineItems.length > 0 && (
              <Badge variant="destructive" className="absolute top-1 right-3 h-5 w-5 p-0 flex items-center justify-center">
                {offlineItems.length}
              </Badge>
            )}
            <Upload className="h-5 w-5 mb-1" />
            <span className="text-xs">Saved</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GameDayMode;

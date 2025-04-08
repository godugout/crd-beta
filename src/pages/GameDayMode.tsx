
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import QuickCapture from '@/components/game-day/QuickCapture';
import GameDetails from '@/components/game-day/GameDetails';
import OfflineIndicator from '@/components/game-day/OfflineIndicator';
import BottomNavBar from '@/components/game-day/BottomNavBar';
import StadiumContextBanner from '@/components/game-day/StadiumContextBanner';
import SavedItemsTab from '@/components/game-day/SavedItemsTab';
import { useLocationService } from '@/hooks/useLocationService';
import { useConnectivity } from '@/hooks/useConnectivity';

const GameDayMode = () => {
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

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar />
      
      {!isOnline && <OfflineIndicator itemCount={offlineItems.length} />}
      
      <main className="container mx-auto pt-20 px-4">
        {/* Stadium Context Banner */}
        <StadiumContextBanner 
          isLocating={isLocating}
          locationError={locationError}
          nearbyStadium={nearbyStadium}
          stadiumSection={stadiumSection}
        />
        
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
              gameInfo={nearbyStadium?.todayGame || {
                opponent: 'Unknown Team',
                date: new Date().toLocaleDateString(),
                time: '1:05 PM',
                isHomeGame: true
              }} 
              stadiumInfo={nearbyStadium}
            />
          </TabsContent>
          
          <TabsContent value="saved">
            <SavedItemsTab
              isOnline={isOnline}
              offlineItems={offlineItems}
              syncOfflineItems={syncOfflineItems}
            />
          </TabsContent>
        </Tabs>
      </main>
      
      {/* Fixed Action Bar */}
      <BottomNavBar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        offlineItemsCount={offlineItems.length}
      />
    </div>
  );
};

export default GameDayMode;


import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { TabsContent } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import QuickCapture from '@/components/game-day/QuickCapture';
import GameDetails from '@/components/game-day/GameDetails';
import OfflineIndicator from '@/components/game-day/OfflineIndicator';
import GameDayHeader from '@/components/game-day/GameDayHeader';
import GameDayTabs from '@/components/game-day/GameDayTabs';
import GameDayActionBar from '@/components/game-day/GameDayActionBar';
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
        <GameDayHeader 
          nearbyStadium={nearbyStadium}
          stadiumSection={stadiumSection}
          isLocating={isLocating}
          locationError={locationError}
          todayGameInfo={todayGameInfo}
        />
        
        <GameDayTabs 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          offlineItemsCount={offlineItems.length}
        />
        
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
          <SavedItemsTab 
            items={offlineItems}
            isOnline={isOnline}
            onSync={syncOfflineItems}
          />
        </TabsContent>
      </main>
      
      <GameDayActionBar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        offlineItemsCount={offlineItems.length}
      />
    </div>
  );
};

export default GameDayMode;


import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { AnimatePresence, motion } from 'framer-motion';
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
import { useNavigationState } from '@/hooks/useNavigationState';
import MetaTags from '@/components/shared/MetaTags';

const GameDayMode = () => {
  // Use navigation state to persist tab selection across page navigations
  const [activeTab, setActiveTab] = useNavigationState({ 
    key: 'gameDayTab',
    defaultState: 'capture',
    sessionOnly: false // Remember tab across sessions
  });
  
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
  }, [isOnline, offlineItems, syncOfflineItems]);

  // Get today's game info
  const todayGameInfo = nearbyStadium?.todayGame || {
    opponent: 'Unknown Team',
    date: new Date().toLocaleDateString(),
    time: '1:05 PM',
    isHomeGame: true
  };

  // Animation variants
  const tabContentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <MetaTags 
        title="Game Day Mode" 
        description="Capture live game moments and memories with CardShow's Game Day Mode"
        type="article"
        section="Features"
        keywords={['game day', 'live capture', 'baseball memories', 'stadium experience', 'sports']}
      />
      
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
        
        <Tabs value={activeTab}>
          <AnimatePresence initial={false}>
            <motion.div
              key={activeTab}
              variants={tabContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <TabsContent value="capture" forceMount>
                {activeTab === 'capture' && (
                  <QuickCapture 
                    stadiumContext={nearbyStadium} 
                    isOnline={isOnline}
                  />
                )}
              </TabsContent>
              
              <TabsContent value="gameinfo" forceMount>
                {activeTab === 'gameinfo' && (
                  <GameDetails 
                    gameInfo={todayGameInfo} 
                    stadiumInfo={nearbyStadium}
                  />
                )}
              </TabsContent>
              
              <TabsContent value="saved" forceMount>
                {activeTab === 'saved' && (
                  <SavedItemsTab 
                    items={offlineItems}
                    isOnline={isOnline}
                    onSync={syncOfflineItems}
                  />
                )}
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
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

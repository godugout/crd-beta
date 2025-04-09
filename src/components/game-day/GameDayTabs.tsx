
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

interface GameDayTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  offlineItemsCount: number;
}

const GameDayTabs: React.FC<GameDayTabsProps> = ({
  activeTab,
  setActiveTab,
  offlineItemsCount
}) => {
  const tabs = [
    { id: 'capture', label: 'Capture' },
    { id: 'gameinfo', label: 'Game Info' },
    { id: 'saved', label: 'Saved' }
  ];

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid grid-cols-3 mb-4 relative">
        <AnimatePresence>
          <motion.div
            key={activeTab}
            className="absolute bottom-0 h-0.5 bg-primary rounded-full"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 1,
              x: `${tabs.findIndex(tab => tab.id === activeTab) * 100}%`,
              width: `${100 / tabs.length}%`
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </AnimatePresence>
        
        {tabs.map(tab => (
          <TabsTrigger 
            key={tab.id}
            value={tab.id}
            className="relative data-[state=active]:bg-transparent data-[state=active]:shadow-none transition-all"
          >
            <span>{tab.label}</span>
            
            {tab.id === 'saved' && offlineItemsCount > 0 && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
              >
                <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
                  {offlineItemsCount}
                </Badge>
              </motion.div>
            )}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default GameDayTabs;

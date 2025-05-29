
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Card } from '@/lib/types';
import CustomizationPanel from './CustomizationPanel';
import EnvironmentGridSelector from './EnvironmentGridSelector';

interface UnifiedSettingsPanelProps {
  card: Card;
  isOpen: boolean;
  onClose: () => void;
  activeTab: 'scenes' | 'customize';
  onTabChange: (tab: 'scenes' | 'customize') => void;
  environmentType: string;
  onEnvironmentChange: (environment: string) => void;
  lightingSettings: any;
  onUpdateLighting: (settings: any) => void;
  materialSettings?: any;
  onUpdateMaterial?: (settings: any) => void;
  onShareCard?: () => void;
  onDownloadCard?: () => void;
  isUserCustomized?: boolean;
}

const UnifiedSettingsPanel: React.FC<UnifiedSettingsPanelProps> = ({
  card,
  isOpen,
  onClose,
  activeTab,
  onTabChange,
  environmentType,
  onEnvironmentChange,
  lightingSettings,
  onUpdateLighting,
  materialSettings,
  onUpdateMaterial,
  onShareCard,
  onDownloadCard,
  isUserCustomized
}) => {
  return (
    <motion.div 
      className={`fixed top-0 right-0 h-full w-[420px] bg-gray-900/95 backdrop-blur-xl text-white shadow-2xl z-40 overflow-hidden`}
      initial={{ x: '100%' }}
      animate={{ x: isOpen ? 0 : '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 180 }}
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-bold">Display Settings</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/10">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Card Info */}
        <div className="p-6 bg-white/5 border-b border-white/10">
          <h3 className="font-medium text-lg">{card.title}</h3>
          {card.description && (
            <p className="text-sm text-gray-300 mt-1 line-clamp-2">{card.description}</p>
          )}
        </div>

        {/* Tabs */}
        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={onTabChange} className="h-full flex flex-col">
            <TabsList className="grid grid-cols-2 mx-6 mt-4 bg-gray-800/50">
              <TabsTrigger value="scenes" className="text-white data-[state=active]:bg-white/20">
                Scenes
              </TabsTrigger>
              <TabsTrigger value="customize" className="text-white data-[state=active]:bg-white/20">
                Customize Card
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-hidden mt-4">
              <TabsContent value="scenes" className="h-full m-0">
                <EnvironmentGridSelector
                  environmentType={environmentType}
                  onEnvironmentChange={onEnvironmentChange}
                />
              </TabsContent>

              <TabsContent value="customize" className="h-full m-0">
                <div className="h-full overflow-y-auto">
                  <CustomizationPanel
                    card={card}
                    isOpen={true}
                    onClose={() => {}}
                    lightingSettings={lightingSettings}
                    onUpdateLighting={onUpdateLighting}
                    materialSettings={materialSettings}
                    onUpdateMaterial={onUpdateMaterial}
                    onShareCard={onShareCard}
                    onDownloadCard={onDownloadCard}
                    isUserCustomized={isUserCustomized}
                  />
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </motion.div>
  );
};

export default UnifiedSettingsPanel;

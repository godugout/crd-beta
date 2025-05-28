
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Palette, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EnvironmentSelector from './EnvironmentSelector';

interface ImmersiveSettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: 'environment' | 'settings';
  onTabChange: (tab: 'environment' | 'settings') => void;
  environmentType: string;
  onEnvironmentChange: (environment: string) => void;
}

const ImmersiveSettingsPanel: React.FC<ImmersiveSettingsPanelProps> = ({
  isOpen,
  onClose,
  activeTab,
  onTabChange,
  environmentType,
  onEnvironmentChange
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          
          {/* Sliding Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-80 bg-gray-900/95 backdrop-blur-xl border-l border-white/20 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/20">
              <h2 className="text-white font-semibold">Viewer Settings</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={onTabChange} className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-2 mx-4 mt-4 bg-black/40">
                <TabsTrigger value="environment" className="text-white data-[state=active]:bg-white/20">
                  <Palette className="h-4 w-4 mr-2" />
                  Environment
                </TabsTrigger>
                <TabsTrigger value="settings" className="text-white data-[state=active]:bg-white/20">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="environment" className="flex-1 p-4">
                <div className="space-y-4">
                  <h3 className="text-white font-medium">Choose Environment</h3>
                  <EnvironmentSelector
                    environmentType={environmentType}
                    onEnvironmentChange={onEnvironmentChange}
                  />
                  <div className="text-white/70 text-sm">
                    Select from our collection of photorealistic 360° environments to enhance your card viewing experience.
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="settings" className="flex-1 p-4">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-white font-medium mb-4">Viewer Controls</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-white/80 text-sm">Auto-rotate</span>
                        <input type="checkbox" className="toggle" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white/80 text-sm">Enable shadows</span>
                        <input type="checkbox" className="toggle" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white/80 text-sm">High quality rendering</span>
                        <input type="checkbox" className="toggle" defaultChecked />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-white font-medium mb-4">Performance</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-white/80 text-sm block mb-2">Render Quality</label>
                        <select className="w-full bg-black/40 border border-white/20 rounded px-3 py-2 text-white">
                          <option value="high">High Quality</option>
                          <option value="medium">Medium Quality</option>
                          <option value="low">Low Quality</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-white/80 text-sm block mb-2">Frame Rate Limit</label>
                        <select className="w-full bg-black/40 border border-white/20 rounded px-3 py-2 text-white">
                          <option value="60">60 FPS</option>
                          <option value="30">30 FPS</option>
                          <option value="unlimited">Unlimited</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ImmersiveSettingsPanel;

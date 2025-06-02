
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface CollapsibleInfoPanelProps {
  isExpanded: boolean;
  onToggle: () => void;
  environmentType: string;
  activeEffects: string[];
  lightingSettings?: any;
}

const CollapsibleInfoPanel: React.FC<CollapsibleInfoPanelProps> = ({
  isExpanded,
  onToggle,
  environmentType,
  activeEffects,
  lightingSettings
}) => {
  return (
    <div className="w-full">
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="w-full px-4 py-2 bg-black/60 backdrop-blur-md text-white/90 text-xs border-t border-white/10 hover:bg-black/70 transition-all duration-200 flex items-center justify-center gap-2"
      >
        <span>Scene Info</span>
        {isExpanded ? (
          <ChevronDown className="h-3 w-3" />
        ) : (
          <ChevronUp className="h-3 w-3" />
        )}
      </button>

      {/* Expandable Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="overflow-hidden bg-black/60 backdrop-blur-md border-t border-white/5"
          >
            <div className="p-4 space-y-3">
              {/* Environment Info */}
              <div className="flex items-center justify-between">
                <span className="text-white/70 text-xs">Environment:</span>
                <span className="text-white text-xs capitalize font-medium">
                  {environmentType.replace('_', ' ')}
                </span>
              </div>

              {/* Active Effects */}
              <div className="flex items-center justify-between">
                <span className="text-white/70 text-xs">Effects:</span>
                <span className="text-white text-xs font-medium">
                  {activeEffects.length > 0 ? activeEffects.join(', ') : 'None'}
                </span>
              </div>

              {/* Dynamic Lighting Status */}
              {lightingSettings?.useDynamicLighting !== undefined && (
                <div className="flex items-center justify-between">
                  <span className="text-white/70 text-xs">Dynamic Lighting:</span>
                  <span className={`text-xs font-medium ${
                    lightingSettings.useDynamicLighting ? 'text-green-400' : 'text-white/60'
                  }`}>
                    {lightingSettings.useDynamicLighting ? 'Active' : 'Off'}
                  </span>
                </div>
              )}

              {/* Light Intensity */}
              {lightingSettings?.primaryLight?.intensity && (
                <div className="flex items-center justify-between">
                  <span className="text-white/70 text-xs">Light Intensity:</span>
                  <span className="text-white text-xs font-medium">
                    {Math.round(lightingSettings.primaryLight.intensity * 100)}%
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CollapsibleInfoPanel;

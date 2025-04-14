
import React, { useState } from 'react';
import { Settings, HelpCircle, Info, Keyboard } from 'lucide-react';
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';

interface MiniActionBarProps {
  className?: string;
}

const MiniActionBar: React.FC<MiniActionBarProps> = ({ className = '' }) => {
  const [activePanel, setActivePanel] = useState<'help' | 'keyboard' | 'info' | null>(null);

  // Toggle panel visibility when clicking on the same icon
  const togglePanel = (panel: 'help' | 'keyboard' | 'info') => {
    setActivePanel(currentPanel => currentPanel === panel ? null : panel);
  };

  // Close panel when pressing Escape
  useKeyboardShortcut('Escape', () => {
    if (activePanel) setActivePanel(null);
  });

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      {/* Floating panel for content */}
      {activePanel && (
        <div className="absolute bottom-14 right-0 w-64 md:w-80 bg-white dark:bg-gray-900 rounded-lg shadow-lg p-4 border border-border mb-2 animate-fade-in">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">
              {activePanel === 'help' && 'Instructions'}
              {activePanel === 'keyboard' && 'Keyboard Shortcuts'}
              {activePanel === 'info' && 'Information'}
            </h3>
            <button 
              onClick={() => setActivePanel(null)}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto text-sm">
            {activePanel === 'help' && (
              <div className="space-y-2">
                <p>• Move your mouse over the card to see the 3D effect</p>
                <p>• Click the card to flip it and see the back</p>
                <p>• Use the buttons at the bottom to navigate between cards</p>
                <p>• Toggle effects using the settings panel</p>
                <p>• Take a snapshot to save the current view</p>
              </div>
            )}

            {activePanel === 'keyboard' && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Flip card:</span>
                  <kbd className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">Space</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Next card:</span>
                  <kbd className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">→</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Previous card:</span>
                  <kbd className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">←</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Reset position:</span>
                  <kbd className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">R</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Toggle effects:</span>
                  <kbd className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">E</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Take snapshot:</span>
                  <kbd className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">S</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Close panels:</span>
                  <kbd className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">Esc</kbd>
                </div>
              </div>
            )}

            {activePanel === 'info' && (
              <div className="space-y-2">
                <p><strong>Card Viewer</strong></p>
                <p>This interactive 3D card viewer lets you experience your trading cards in a new dimension. Explore different visual effects, take snapshots, and enjoy the immersive viewing experience.</p>
                <p>Use the buttons at the bottom right to access more features and settings.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2 shadow-lg bg-white dark:bg-gray-900 p-2 rounded-full border border-border">
        <button
          onClick={() => togglePanel('help')}
          className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 ${activePanel === 'help' ? 'bg-gray-100 dark:bg-gray-800 text-primary' : ''}`}
          title="Instructions"
        >
          <HelpCircle size={18} />
        </button>
        
        <button
          onClick={() => togglePanel('keyboard')}
          className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 ${activePanel === 'keyboard' ? 'bg-gray-100 dark:bg-gray-800 text-primary' : ''}`}
          title="Keyboard Shortcuts"
        >
          <Keyboard size={18} />
        </button>
        
        <button
          onClick={() => togglePanel('info')}
          className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 ${activePanel === 'info' ? 'bg-gray-100 dark:bg-gray-800 text-primary' : ''}`}
          title="Information"
        >
          <Info size={18} />
        </button>
      </div>
      
      {!activePanel && (
        <div className="fixed bottom-16 right-4 text-xs text-gray-500 dark:text-gray-400 pointer-events-none">
          Click icons for help & shortcuts
        </div>
      )}
    </div>
  );
};

export default MiniActionBar;

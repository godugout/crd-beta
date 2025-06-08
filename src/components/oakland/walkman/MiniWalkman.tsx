
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Maximize2 } from 'lucide-react';
import { AudioMemory } from '@/lib/types/oaklandTypes';

interface MiniWalkmanProps {
  currentTape: AudioMemory | null;
  isPlaying: boolean;
  onPlay: () => void;
  onExpand: () => void;
}

const MiniWalkman: React.FC<MiniWalkmanProps> = ({
  currentTape,
  isPlaying,
  onPlay,
  onExpand
}) => {
  return (
    <Card className="oakland-memory-card w-64 cursor-pointer group hover:scale-105 transition-transform">
      <div className="p-4">
        {/* Walkman Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="text-oakland-gold-primary font-display font-bold text-sm">
            🎧 WALKMAN
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onExpand}
            className="text-gray-400 hover:text-white"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Cassette Display */}
        {currentTape && (
          <div className="bg-gray-900 rounded-lg p-3 mb-3">
            <div className="text-center">
              <div className="text-yellow-400 font-nostalgia text-xs mb-1">
                {currentTape.cassette_label}
              </div>
              <div className="text-white font-medium text-sm truncate">
                {currentTape.title}
              </div>
              <div className="text-gray-400 text-xs truncate">
                {currentTape.description}
              </div>
            </div>
            
            {/* Tape Reels Animation */}
            <div className="flex justify-center items-center mt-2 space-x-4">
              <div 
                className={`w-6 h-6 border-2 border-gray-600 rounded-full ${
                  isPlaying ? 'animate-spin' : ''
                }`}
                style={{ animationDuration: '2s' }}
              >
                <div className="w-2 h-2 bg-gray-600 rounded-full m-auto mt-1"></div>
              </div>
              <div className="text-gray-500 text-xs">▶</div>
              <div 
                className={`w-6 h-6 border-2 border-gray-600 rounded-full ${
                  isPlaying ? 'animate-spin' : ''
                }`}
                style={{ animationDuration: '2.3s' }}
              >
                <div className="w-2 h-2 bg-gray-600 rounded-full m-auto mt-1"></div>
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={onPlay}
            className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-900/20"
            disabled={!currentTape}
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>
        </div>

        {/* Status */}
        <div className="text-center mt-2">
          <div className="text-gray-400 text-xs">
            {isPlaying ? 'Playing...' : currentTape ? 'Paused' : 'No tape'}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MiniWalkman;

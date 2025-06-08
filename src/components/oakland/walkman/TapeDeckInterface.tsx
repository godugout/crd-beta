
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  X,
  Clock,
  Users
} from 'lucide-react';
import { AudioMemory } from '@/lib/types/oaklandTypes';

interface TapeDeckInterfaceProps {
  tapes: AudioMemory[];
  currentTape: AudioMemory | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  onTapeSelect: (tape: AudioMemory) => void;
  onPlay: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
}

const TapeDeckInterface: React.FC<TapeDeckInterfaceProps> = ({
  tapes,
  currentTape,
  isPlaying,
  currentTime,
  duration,
  volume,
  onTapeSelect,
  onPlay,
  onSeek,
  onVolumeChange,
  onNext,
  onPrev,
  onClose
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getMemoryTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      'game_reaction': '⚾',
      'story': '📖',
      'chant': '📢',
      'protest_speech': '✊',
      'celebration': '🎉'
    };
    return icons[type] || '🎵';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-display font-bold text-white">
          🎧 Oakland Walkman
        </h2>
        <Button
          variant="ghost"
          onClick={onClose}
          className="text-gray-400 hover:text-white"
        >
          <X className="h-6 w-6" />
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Tape Display */}
        <div className="lg:col-span-2 space-y-4">
          {/* Tape Deck */}
          <div className="bg-gradient-to-b from-gray-700 to-gray-800 rounded-xl p-6 border-2 border-gray-600">
            {currentTape ? (
              <div className="space-y-4">
                {/* Cassette Label */}
                <div className="bg-yellow-400 text-black px-4 py-2 rounded font-nostalgia text-center">
                  {currentTape.cassette_label}
                </div>
                
                {/* Tape Info */}
                <div className="text-center">
                  <h3 className="text-xl font-display text-white mb-2">
                    {currentTape.title}
                  </h3>
                  <p className="text-gray-300 text-sm mb-3">
                    {currentTape.description}
                  </p>
                  <div className="flex justify-center gap-2 mb-4">
                    <Badge className="oakland-emotion-badge">
                      {getMemoryTypeIcon(currentTape.memory_type)} {currentTape.memory_type}
                    </Badge>
                    <Badge variant="outline" className="border-gray-500 text-gray-300">
                      <Users className="h-3 w-3 mr-1" />
                      {currentTape.plays_count} plays
                    </Badge>
                  </div>
                </div>

                {/* Tape Reels */}
                <div className="flex justify-center items-center space-x-8 my-6">
                  <div 
                    className={`w-16 h-16 border-4 border-gray-500 rounded-full flex items-center justify-center ${
                      isPlaying ? 'animate-spin' : ''
                    }`}
                    style={{ animationDuration: '3s' }}
                  >
                    <div className="w-6 h-6 bg-gray-600 rounded-full"></div>
                  </div>
                  <div className="text-2xl text-gray-400">
                    {isPlaying ? '▶' : '⏸'}
                  </div>
                  <div 
                    className={`w-16 h-16 border-4 border-gray-500 rounded-full flex items-center justify-center ${
                      isPlaying ? 'animate-spin' : ''
                    }`}
                    style={{ animationDuration: '2.5s' }}
                  >
                    <div className="w-6 h-6 bg-gray-600 rounded-full"></div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <Slider
                    value={[currentTime]}
                    max={duration || 100}
                    step={1}
                    onValueChange={([value]) => onSeek(value)}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-500 text-xl mb-2">No tape loaded</div>
                <div className="text-gray-400 text-sm">Select a tape from the collection</div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="bg-gray-800 rounded-xl p-4">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <Button
                variant="ghost"
                onClick={onPrev}
                className="text-gray-400 hover:text-white"
                disabled={!currentTape}
              >
                <SkipBack className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                onClick={onPlay}
                className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-900/20 p-3"
                disabled={!currentTape}
              >
                {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
              </Button>
              <Button
                variant="ghost"
                onClick={onNext}
                className="text-gray-400 hover:text-white"
                disabled={!currentTape}
              >
                <SkipForward className="h-6 w-6" />
              </Button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center space-x-3">
              <Volume2 className="h-5 w-5 text-gray-400" />
              <Slider
                value={[volume * 100]}
                max={100}
                step={1}
                onValueChange={([value]) => onVolumeChange(value / 100)}
                className="flex-1"
              />
            </div>
          </div>
        </div>

        {/* Tape Collection */}
        <div className="space-y-4">
          <h3 className="text-lg font-display text-white">Tape Collection</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {tapes.map((tape) => (
              <div
                key={tape.id}
                onClick={() => onTapeSelect(tape)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  currentTape?.id === tape.id
                    ? 'bg-yellow-900/30 border border-yellow-500'
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                <div className="text-yellow-400 font-nostalgia text-xs mb-1">
                  {tape.cassette_label}
                </div>
                <div className="text-white font-medium text-sm truncate">
                  {tape.title}
                </div>
                <div className="text-gray-400 text-xs truncate">
                  {tape.description}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <Badge variant="outline" className="text-xs border-gray-600 text-gray-400">
                    {getMemoryTypeIcon(tape.memory_type)} {tape.memory_type}
                  </Badge>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatTime(tape.duration)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TapeDeckInterface;

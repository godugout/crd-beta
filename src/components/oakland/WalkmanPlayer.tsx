
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Pause, SkipBack, SkipForward, Volume2, X } from 'lucide-react';
import { useAudioMemories } from '@/hooks/useAudioMemories';
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
  if (!currentTape) return null;

  return (
    <Card className="w-48 bg-gradient-to-b from-gray-800 to-gray-900 border-yellow-500 cursor-pointer transform hover:scale-105 transition-transform">
      <CardContent className="p-3" onClick={onExpand}>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onPlay();
            }}
            className="text-yellow-500 hover:text-yellow-400"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-yellow-500 font-mono truncate">
              {currentTape.cassette_label || 'Oakland Memories'}
            </div>
            <div className="text-xs text-white truncate">
              {currentTape.title}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface FullTapeDeckProps {
  tapes: AudioMemory[];
  currentTape: AudioMemory | null;
  isPlaying: boolean;
  currentTime: number;
  onTapeSelect: (tape: AudioMemory) => void;
  onPlay: () => void;
  onSeek: (time: number) => void;
  onClose: () => void;
}

const FullTapeDeck: React.FC<FullTapeDeckProps> = ({
  tapes,
  currentTape,
  isPlaying,
  currentTime,
  onTapeSelect,
  onPlay,
  onSeek,
  onClose
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl p-8 max-w-2xl w-full mx-4 border-2 border-yellow-500">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-yellow-500 font-mono">
          OAKLAND WALKMAN
        </h2>
        <Button variant="ghost" onClick={onClose} className="text-white">
          <X className="h-6 w-6" />
        </Button>
      </div>

      {/* Tape Selection */}
      <div className="mb-6">
        <h3 className="text-white mb-3 font-mono">Select Tape:</h3>
        <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
          {tapes.map((tape) => (
            <Button
              key={tape.id}
              variant={currentTape?.id === tape.id ? "default" : "outline"}
              size="sm"
              onClick={() => onTapeSelect(tape)}
              className={`text-xs justify-start ${
                currentTape?.id === tape.id
                  ? 'bg-yellow-500 text-black'
                  : 'border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black'
              }`}
            >
              {tape.cassette_label || 'Oakland Memories'}
            </Button>
          ))}
        </div>
      </div>

      {/* Current Tape Display */}
      {currentTape && (
        <div className="mb-6 p-4 bg-black rounded-lg border border-yellow-500">
          <div className="text-yellow-500 font-mono text-sm mb-1">
            {currentTape.cassette_label || 'Oakland Memories'}
          </div>
          <div className="text-white font-bold">
            {currentTape.title}
          </div>
          {currentTape.description && (
            <div className="text-gray-300 text-sm mt-2">
              {currentTape.description}
            </div>
          )}
          <div className="text-xs text-yellow-500 mt-2">
            Era: {currentTape.era?.replace('_', ' ').toUpperCase()}
            {currentTape.game_date && ` • ${currentTape.game_date}`}
            {currentTape.opponent && ` vs ${currentTape.opponent}`}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mb-4">
        <Button variant="ghost" className="text-yellow-500">
          <SkipBack className="h-6 w-6" />
        </Button>
        <Button
          onClick={onPlay}
          className="bg-yellow-500 text-black hover:bg-yellow-400 rounded-full w-12 h-12"
        >
          {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
        </Button>
        <Button variant="ghost" className="text-yellow-500">
          <SkipForward className="h-6 w-6" />
        </Button>
        <Button variant="ghost" className="text-yellow-500">
          <Volume2 className="h-5 w-5" />
        </Button>
      </div>

      {/* Progress Bar */}
      {currentTape && (
        <div className="flex items-center gap-3 text-yellow-500 text-sm">
          <span>{formatTime(currentTime)}</span>
          <div 
            className="flex-1 h-2 bg-gray-700 rounded-full cursor-pointer"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const percent = (e.clientX - rect.left) / rect.width;
              onSeek(percent * (currentTape.duration || 0));
            }}
          >
            <div 
              className="h-full bg-yellow-500 rounded-full transition-all"
              style={{ 
                width: `${currentTape.duration ? (currentTime / currentTape.duration) * 100 : 0}%` 
              }}
            />
          </div>
          <span>{formatTime(currentTape.duration || 0)}</span>
        </div>
      )}
    </div>
  );
};

export const WalkmanPlayer: React.FC = () => {
  const { audioMemories, playAudio, stopAudio, currentlyPlaying } = useAudioMemories();
  const [currentTape, setCurrentTape] = useState<AudioMemory | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Set initial tape when audio memories load
  useEffect(() => {
    if (audioMemories.length > 0 && !currentTape) {
      setCurrentTape(audioMemories[0]);
    }
  }, [audioMemories, currentTape]);

  const handlePlay = () => {
    if (!currentTape) return;
    
    if (isPlaying) {
      audioRef.current?.pause();
      stopAudio();
    } else {
      audioRef.current?.play();
      playAudio(currentTape.id);
    }
    setIsPlaying(!isPlaying);
  };

  const handleTapeSelect = (tape: AudioMemory) => {
    setCurrentTape(tape);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.load();
    }
  };

  const handleSeek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  return (
    <>
      {/* Mini Player (Fixed Bottom Right) */}
      {!isExpanded && (
        <div className="fixed bottom-6 right-6 z-50">
          <MiniWalkman 
            currentTape={currentTape}
            isPlaying={isPlaying}
            onPlay={handlePlay}
            onExpand={() => setIsExpanded(true)}
          />
        </div>
      )}
      
      {/* Full Tape Deck Modal */}
      {isExpanded && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
          <FullTapeDeck 
            tapes={audioMemories}
            currentTape={currentTape}
            isPlaying={isPlaying}
            currentTime={currentTime}
            onTapeSelect={handleTapeSelect}
            onPlay={handlePlay}
            onSeek={handleSeek}
            onClose={() => setIsExpanded(false)}
          />
        </div>
      )}
      
      {/* Hidden Audio Element */}
      {currentTape && (
        <audio 
          ref={audioRef}
          src={currentTape.audio_url}
          onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
          onEnded={() => setIsPlaying(false)}
          onLoadedMetadata={() => {
            // Update duration in state if needed
          }}
        />
      )}
    </>
  );
};

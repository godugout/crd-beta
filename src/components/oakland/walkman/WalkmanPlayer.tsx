
import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipBack, SkipForward, Volume2, Maximize2, X } from 'lucide-react';
import { AudioMemory } from '@/lib/types/oaklandTypes';
import TapeDeckInterface from './TapeDeckInterface';
import MiniWalkman from './MiniWalkman';

interface WalkmanPlayerProps {
  audioMemories?: AudioMemory[];
}

const WalkmanPlayer: React.FC<WalkmanPlayerProps> = ({ audioMemories = [] }) => {
  const [currentTape, setCurrentTape] = useState<AudioMemory | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Sample audio memories for demo
  const sampleTapes: AudioMemory[] = audioMemories.length > 0 ? audioMemories : [
    {
      id: '1',
      user_id: 'demo',
      title: 'Walk-off Victory vs Angels',
      description: 'The crowd goes wild after that amazing walk-off!',
      audio_url: '/audio/walkoff-crowd.mp3',
      duration: 180,
      memory_type: 'game_reaction',
      tags: ['walkoff', 'victory', 'angels'],
      cassette_label: 'RALLY TAPE #1',
      plays_count: 45,
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      user_id: 'demo',
      title: 'Last Game at Coliseum',
      description: 'Emotional farewell to our beloved ballpark',
      audio_url: '/audio/farewell-coliseum.mp3',
      duration: 240,
      memory_type: 'story',
      tags: ['farewell', 'coliseum', 'emotional'],
      cassette_label: 'GOODBYE OAKLAND',
      plays_count: 89,
      created_at: new Date().toISOString()
    },
    {
      id: '3',
      user_id: 'demo',
      title: 'Lets Go Oakland Chant',
      description: 'Classic crowd chant from the bleachers',
      audio_url: '/audio/lets-go-oakland.mp3',
      duration: 60,
      memory_type: 'chant',
      tags: ['chant', 'crowd', 'classic'],
      cassette_label: 'BLEACHER CHANTS',
      plays_count: 156,
      created_at: new Date().toISOString()
    }
  ];

  useEffect(() => {
    if (sampleTapes.length > 0 && !currentTape) {
      setCurrentTape(sampleTapes[0]);
    }
  }, [sampleTapes.length]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTape]);

  // Set volume programmatically when volume state changes
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
    }
  }, [volume]);

  const handlePlay = () => {
    const audio = audioRef.current;
    if (!audio || !currentTape) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (time: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.currentTime = time;
    setCurrentTime(time);
  };

  const handleTapeSelect = (tape: AudioMemory) => {
    setCurrentTape(tape);
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleNextTape = () => {
    const currentIndex = sampleTapes.findIndex(tape => tape.id === currentTape?.id);
    const nextIndex = (currentIndex + 1) % sampleTapes.length;
    handleTapeSelect(sampleTapes[nextIndex]);
  };

  const handlePrevTape = () => {
    const currentIndex = sampleTapes.findIndex(tape => tape.id === currentTape?.id);
    const prevIndex = currentIndex === 0 ? sampleTapes.length - 1 : currentIndex - 1;
    handleTapeSelect(sampleTapes[prevIndex]);
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
          <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
            <TapeDeckInterface 
              tapes={sampleTapes}
              currentTape={currentTape}
              isPlaying={isPlaying}
              currentTime={currentTime}
              duration={duration}
              volume={volume}
              onTapeSelect={handleTapeSelect}
              onPlay={handlePlay}
              onSeek={handleSeek}
              onVolumeChange={setVolume}
              onNext={handleNextTape}
              onPrev={handlePrevTape}
              onClose={() => setIsExpanded(false)}
            />
          </div>
        </div>
      )}
      
      {/* Hidden Audio Element */}
      {currentTape && (
        <audio 
          ref={audioRef}
          src={currentTape.audio_url}
          preload="metadata"
        />
      )}
    </>
  );
};

export default WalkmanPlayer;

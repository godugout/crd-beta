
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useJumbotronContent } from '@/hooks/useJumbotronContent';
import { JumbotronContent } from '@/lib/types/oaklandTypes';

interface BulbMatrixProps {
  message: string;
  speed: number;
  color: 'green' | 'gold' | 'red' | 'white' | 'protest_red';
  effect: 'scroll' | 'flash' | 'typewriter' | 'matrix';
}

const BulbMatrix: React.FC<BulbMatrixProps> = ({ message, speed, color, effect }) => {
  const [displayText, setDisplayText] = useState('');
  const [position, setPosition] = useState(0);

  const colorClasses = {
    green: 'text-green-400 drop-shadow-[0_0_10px_#4ade80]',
    gold: 'text-yellow-400 drop-shadow-[0_0_10px_#facc15]',
    red: 'text-red-500 drop-shadow-[0_0_10px_#ef4444]',
    white: 'text-white drop-shadow-[0_0_10px_#ffffff]',
    protest_red: 'text-red-600 drop-shadow-[0_0_15px_#dc2626] animate-pulse'
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    switch (effect) {
      case 'scroll':
        interval = setInterval(() => {
          setPosition((prev) => {
            const newPos = (prev + 1) % (message.length + 20);
            const startIndex = Math.max(0, newPos - 20);
            const endIndex = Math.min(message.length, newPos);
            setDisplayText(message.slice(startIndex, endIndex));
            return newPos;
          });
        }, speed);
        break;

      case 'typewriter':
        setPosition(0);
        interval = setInterval(() => {
          setPosition((prev) => {
            if (prev >= message.length) {
              setTimeout(() => setPosition(0), 2000);
              return 0;
            }
            setDisplayText(message.slice(0, prev + 1));
            return prev + 1;
          });
        }, speed);
        break;

      case 'flash':
        interval = setInterval(() => {
          setDisplayText(displayText === message ? '' : message);
        }, speed);
        break;

      case 'matrix':
        setDisplayText(message);
        break;

      default:
        setDisplayText(message);
    }

    return () => clearInterval(interval);
  }, [message, speed, effect, displayText]);

  return (
    <div className="bg-black p-8 rounded-lg border-4 border-yellow-600 min-h-[120px] flex items-center justify-center">
      <div className="font-mono text-2xl md:text-4xl font-bold text-center">
        <span className={`${colorClasses[color]} ${effect === 'matrix' ? 'animate-bounce' : ''}`}>
          {displayText || message}
        </span>
      </div>
    </div>
  );
};

interface MessageBroadcasterProps {
  onBroadcast: (message: string, settings: BroadcastSettings) => void;
  characterLimit: number;
}

interface BroadcastSettings {
  display_type: 'scroll' | 'flash' | 'typewriter' | 'matrix';
  color_scheme: 'green' | 'gold' | 'red' | 'white' | 'protest_red';
  category: 'cheer' | 'protest' | 'memory' | 'announcement' | 'tribute';
}

const MessageBroadcaster: React.FC<MessageBroadcasterProps> = ({ onBroadcast, characterLimit }) => {
  const [message, setMessage] = useState('');
  const [settings, setSettings] = useState<BroadcastSettings>({
    display_type: 'scroll',
    color_scheme: 'green',
    category: 'cheer'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && message.length <= characterLimit) {
      onBroadcast(message.trim(), settings);
      setMessage('');
    }
  };

  const suggestedMessages = [
    "LET'S GO OAKLAND!",
    "SELL THE TEAM!",
    "RALLY POSSUM LIVES!",
    "OAKLAND FOREVER!",
    "WE STAYED IN THE STANDS!"
  ];

  return (
    <Card className="bg-gray-900 border-yellow-500">
      <CardContent className="p-6">
        <h3 className="text-yellow-500 font-bold mb-4 font-mono">BROADCAST YOUR MESSAGE</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message for the jumbotron..."
              maxLength={characterLimit}
              className="bg-black border-yellow-500 text-white placeholder-gray-400 font-mono"
            />
            <div className="text-xs text-gray-400 mt-1">
              {message.length}/{characterLimit} characters
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Select 
              value={settings.display_type} 
              onValueChange={(value: any) => setSettings(prev => ({ ...prev, display_type: value }))}
            >
              <SelectTrigger className="bg-black border-yellow-500 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scroll">Scroll</SelectItem>
                <SelectItem value="flash">Flash</SelectItem>
                <SelectItem value="typewriter">Typewriter</SelectItem>
                <SelectItem value="matrix">Matrix</SelectItem>
              </SelectContent>
            </Select>

            <Select 
              value={settings.color_scheme} 
              onValueChange={(value: any) => setSettings(prev => ({ ...prev, color_scheme: value }))}
            >
              <SelectTrigger className="bg-black border-yellow-500 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="green">Oakland Green</SelectItem>
                <SelectItem value="gold">Gold</SelectItem>
                <SelectItem value="red">Red</SelectItem>
                <SelectItem value="white">White</SelectItem>
                <SelectItem value="protest_red">Protest Red</SelectItem>
              </SelectContent>
            </Select>

            <Select 
              value={settings.category} 
              onValueChange={(value: any) => setSettings(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger className="bg-black border-yellow-500 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cheer">Cheer</SelectItem>
                <SelectItem value="protest">Protest</SelectItem>
                <SelectItem value="memory">Memory</SelectItem>
                <SelectItem value="announcement">Announcement</SelectItem>
                <SelectItem value="tribute">Tribute</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            type="submit" 
            disabled={!message.trim() || message.length > characterLimit}
            className="w-full bg-yellow-500 text-black hover:bg-yellow-400 font-bold"
          >
            BROADCAST MESSAGE
          </Button>
        </form>

        {/* Quick Select Messages */}
        <div className="mt-4">
          <div className="text-sm text-gray-400 mb-2">Quick Select:</div>
          <div className="flex flex-wrap gap-2">
            {suggestedMessages.map((msg) => (
              <Button
                key={msg}
                variant="outline"
                size="sm"
                onClick={() => setMessage(msg)}
                className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black text-xs"
              >
                {msg}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const RetroJumbotron: React.FC = () => {
  const { currentMessage, createMessage, voteForMessage } = useJumbotronContent();
  const [previewMessage, setPreviewMessage] = useState<string>('');
  const [previewSettings, setPreviewSettings] = useState<BroadcastSettings>({
    display_type: 'scroll',
    color_scheme: 'green',
    category: 'cheer'
  });

  const handleBroadcast = async (message: string, settings: BroadcastSettings) => {
    try {
      await createMessage({
        user_id: 'temp-user-id', // This should come from auth context
        message,
        display_type: settings.display_type,
        color_scheme: settings.color_scheme,
        category: settings.category,
        priority: 1,
        is_active: true,
        moderation_status: 'pending',
        vote_count: 0
      });
    } catch (error) {
      console.error('Failed to broadcast message:', error);
    }
  };

  const handleVote = () => {
    if (currentMessage) {
      voteForMessage(currentMessage.id);
    }
  };

  // Use preview message if set, otherwise use current message
  const displayMessage = previewMessage || currentMessage?.message || 'WELCOME TO OAK.FAN';
  const displaySettings = previewMessage ? previewSettings : {
    display_type: currentMessage?.display_type || 'scroll',
    color_scheme: currentMessage?.color_scheme || 'green',
    category: currentMessage?.category || 'announcement'
  };

  return (
    <div className="space-y-6">
      {/* Main Jumbotron Display */}
      <div className="relative">
        <BulbMatrix
          message={displayMessage}
          speed={200}
          color={displaySettings.color_scheme}
          effect={displaySettings.display_type}
        />
        
        {currentMessage && !previewMessage && (
          <div className="absolute bottom-2 right-2">
            <Button
              onClick={handleVote}
              variant="ghost"
              size="sm"
              className="text-yellow-500 hover:text-yellow-400"
            >
              👍 {currentMessage.vote_count}
            </Button>
          </div>
        )}
      </div>

      {/* Message Broadcaster */}
      <MessageBroadcaster
        onBroadcast={handleBroadcast}
        characterLimit={80}
      />

      {/* Preview Controls */}
      <Card className="bg-gray-900 border-yellow-500">
        <CardContent className="p-4">
          <h4 className="text-yellow-500 font-mono mb-2">PREVIEW MODE</h4>
          <div className="flex gap-2">
            <Input
              value={previewMessage}
              onChange={(e) => setPreviewMessage(e.target.value)}
              placeholder="Test your message..."
              className="bg-black border-yellow-500 text-white placeholder-gray-400 font-mono"
            />
            <Button
              onClick={() => setPreviewMessage('')}
              variant="outline"
              className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black"
            >
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

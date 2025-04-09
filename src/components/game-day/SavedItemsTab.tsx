
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Image, WifiOff, Upload, Share, Star } from 'lucide-react';

interface SavedItem {
  id: string;
  title?: string;
  imageUrl?: string;
  createdAt: string;
  tags?: string[];
}

interface SavedItemsTabProps {
  items: SavedItem[];
  isOnline: boolean;
  onSync: () => Promise<number>;
}

const SavedItemsTab: React.FC<SavedItemsTabProps> = ({ items, isOnline, onSync }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">Saved Items</h3>
        {!isOnline && items.length > 0 && (
          <div className="flex items-center text-sm text-amber-600">
            <WifiOff className="h-4 w-4 mr-1" />
            <span>Will sync when online</span>
          </div>
        )}
      </div>
      
      {items.length === 0 ? (
        <Card className="p-8 text-center text-gray-500">
          <Image className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p>No saved items yet.</p>
          <p className="text-sm mt-2">
            Items captured while offline will appear here
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {items.map(item => (
            <Card key={item.id} className="overflow-hidden">
              <div className="aspect-[3/4] bg-gray-100 relative">
                {item.imageUrl ? (
                  <img 
                    src={item.imageUrl} 
                    alt={item.title || 'Memory'} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Image className="h-8 w-8 opacity-30" />
                  </div>
                )}
                
                {!isOnline && (
                  <div className="absolute top-2 right-2">
                    <Badge variant="outline" className="bg-black/50 text-white border-none">
                      Offline
                    </Badge>
                  </div>
                )}
              </div>
              <div className="p-2">
                <h4 className="font-medium text-sm truncate">{item.title || 'Untitled'}</h4>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-gray-500">
                    {new Date(item.createdAt).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                  </span>
                  
                  <div className="flex space-x-1">
                    <Button size="icon" variant="ghost" className="h-7 w-7">
                      <Share className="h-3 w-3" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7">
                      <Star className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      
      {isOnline && items.length > 0 && (
        <Button 
          variant="default" 
          className="w-full mt-2" 
          onClick={onSync}
        >
          <Upload className="h-4 w-4 mr-2" />
          Sync {items.length} items now
        </Button>
      )}
    </div>
  );
};

export default SavedItemsTab;

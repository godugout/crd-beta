
import React, { useState } from 'react';
import { Card } from '@/lib/types/cardTypes';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Download, 
  Share2, 
  BookOpen, 
  Tag, 
  Plus, 
  X 
} from 'lucide-react';

interface FinalizeStepProps {
  cardData: Partial<Card>;
  onUpdate: (updates: Partial<Card>) => void;
}

const FinalizeStep: React.FC<FinalizeStepProps> = ({ cardData, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<string>("details");
  const [tagInput, setTagInput] = useState<string>('');
  
  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    
    const newTags = [...(cardData.tags || []), tagInput.trim()];
    
    onUpdate({
      tags: newTags
    });
    
    setTagInput('');
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = (cardData.tags || []).filter(tag => tag !== tagToRemove);
    
    onUpdate({
      tags: newTags
    });
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };
  
  const handleVisibilityChange = (isPublic: boolean) => {
    onUpdate({
      isPublic
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium">Finalize Your Card</h2>
        <p className="text-sm text-gray-500 mt-1">
          Add final details and prepare your card for sharing
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="sharing">Sharing</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="card-title-final">Card Title</Label>
              <Input
                id="card-title-final"
                value={cardData.title || ''}
                onChange={(e) => onUpdate({ title: e.target.value })}
                placeholder="Enter a title for your card"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label>Tags</Label>
              <div className="flex mt-1 gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add a tag"
                  onKeyDown={handleKeyDown}
                  className="flex-1"
                />
                <Button type="button" onClick={handleAddTag}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-3">
                {(cardData.tags || []).map((tag, index) => (
                  <Badge key={`${tag}-${index}`} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button 
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                
                {(cardData.tags || []).length === 0 && (
                  <p className="text-sm text-gray-500">No tags added yet</p>
                )}
              </div>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="card-visibility" className="text-base">Visibility</Label>
                <p className="text-sm text-gray-500">Make your card public in the community</p>
              </div>
              <Switch
                id="card-visibility"
                checked={cardData.isPublic || false}
                onCheckedChange={handleVisibilityChange}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="sharing" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-lg p-2">
                  <Share2 className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <h3 className="font-medium">Share Direct Link</h3>
                  <p className="text-sm text-gray-500 mt-1">Share your card with a direct link</p>
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
              <div className="flex items-start">
                <div className="bg-purple-100 rounded-lg p-2">
                  <BookOpen className="h-5 w-5 text-purple-600" />
                </div>
                <div className="ml-3">
                  <h3 className="font-medium">Add to Collection</h3>
                  <p className="text-sm text-gray-500 mt-1">Add this card to one of your collections</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md mt-4">
            <h3 className="text-sm font-medium mb-1">Community Features</h3>
            <p className="text-xs text-gray-500">
              Public cards can be viewed, liked and commented on by the community.
              You'll get notifications when someone interacts with your cards.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="export" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
              <div className="flex items-start">
                <div className="bg-green-100 rounded-lg p-2">
                  <Download className="h-5 w-5 text-green-600" />
                </div>
                <div className="ml-3">
                  <h3 className="font-medium">Download Image</h3>
                  <p className="text-sm text-gray-500 mt-1">Download as high resolution image</p>
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer opacity-70">
              <div className="flex items-start">
                <div className="bg-amber-100 rounded-lg p-2">
                  <Tag className="h-5 w-5 text-amber-600" />
                </div>
                <div className="ml-3">
                  <h3 className="font-medium">Order Physical Card</h3>
                  <p className="text-sm text-gray-500 mt-1">Coming soon!</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md mt-4">
            <h3 className="text-sm font-medium mb-1">Available Formats</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge>JPG</Badge>
              <Badge>PNG</Badge>
              <Badge>PDF</Badge>
              <Badge variant="outline">SVG (Coming Soon)</Badge>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinalizeStep;

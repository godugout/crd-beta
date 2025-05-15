
import React, { useState } from 'react';
import { Card } from '@/lib/types/cardTypes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { X, Plus, Download, Share, Copy, MessageSquare } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface FinalizeStepProps {
  cardData: Partial<Card>;
  onUpdate: (updates: Partial<Card>) => void;
}

const FinalizeStep: React.FC<FinalizeStepProps> = ({ cardData, onUpdate }) => {
  const { toast } = useToast();
  const [tags, setTags] = useState<string[]>(cardData.tags || []);
  const [newTag, setNewTag] = useState<string>('');
  const [isPublic, setIsPublic] = useState<boolean>(!!cardData.isPublic);
  
  // Handle adding a new tag
  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      const updatedTags = [...tags, newTag];
      setTags(updatedTags);
      onUpdate({ tags: updatedTags });
      setNewTag('');
    }
  };
  
  // Handle removing a tag
  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = tags.filter(tag => tag !== tagToRemove);
    setTags(updatedTags);
    onUpdate({ tags: updatedTags });
  };
  
  // Handle toggle for public/private
  const handleTogglePublic = (checked: boolean) => {
    setIsPublic(checked);
    onUpdate({ isPublic: checked });
  };
  
  // Handle copy link
  const handleCopyLink = () => {
    // In a real app, this would copy a link to the clipboard
    toast({
      title: "Link Copied",
      description: "Card link copied to clipboard",
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
      
      <Tabs defaultValue="metadata">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="metadata">Metadata</TabsTrigger>
          <TabsTrigger value="sharing">Sharing</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
        </TabsList>
        
        <TabsContent value="metadata" className="space-y-4">
          {/* Tags input */}
          <div>
            <Label htmlFor="tags">Tags</Label>
            <div className="flex items-center space-x-2 mt-1">
              <Input
                id="tags"
                placeholder="Add tag (e.g., rookie, vintage)"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                className="flex-1"
              />
              <Button variant="outline" onClick={handleAddTag} disabled={!newTag}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Tags display */}
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
              {tags.length === 0 && (
                <p className="text-sm text-gray-500">No tags added yet</p>
              )}
            </div>
          </div>
          
          {/* Card visibility */}
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="card-public">Make card public</Label>
              <p className="text-sm text-gray-500">Allow others to see this card in public galleries</p>
            </div>
            <Switch
              id="card-public"
              checked={isPublic}
              onCheckedChange={handleTogglePublic}
            />
          </div>
          
          {/* Additional notes */}
          <div>
            <Label htmlFor="card-notes">Additional Notes</Label>
            <Textarea
              id="card-notes"
              placeholder="Add any notes about this card (not visible to others)"
              className="mt-1"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="sharing" className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-sm mb-2">Share Your Card</h3>
            <div className="flex items-center space-x-2">
              <Input 
                value="https://cardshow.com/card/example-id"
                readOnly
                className="flex-1"
              />
              <Button variant="outline" onClick={handleCopyLink}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="w-full">
              <MessageSquare className="h-4 w-4 mr-2" />
              Message
            </Button>
            <Button variant="outline" className="w-full">
              <Share className="h-4 w-4 mr-2" />
              Social
            </Button>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-sm mb-1">Collection</h3>
            <p className="text-xs text-blue-800 mb-2">
              Add this card to a collection to organize your cards
            </p>
            <Button variant="outline" size="sm" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add to Collection
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="export" className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Export Options</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                Download as JPG
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                Download as PNG
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                Download as PDF
              </Button>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h3 className="font-medium mb-2">Print Options</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="print-ready">Print-ready version</Label>
                <Switch id="print-ready" />
              </div>
              
              <Button variant="outline" className="w-full">
                Prepare for Printing
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinalizeStep;

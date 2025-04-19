import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useCollections } from '@/hooks/useCollections';
import { Collection } from '@/lib/types';

interface CreateCollectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCardIds?: string[];
}

const CreateCollectionDialog: React.FC<CreateCollectionDialogProps> = ({ isOpen, onClose, selectedCardIds = [] }) => {
  const [collectionName, setCollectionName] = useState('');
  const [collectionDescription, setCollectionDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const { createCollection } = useCollections();
  const { toast } = useToast();

  const handleCreateCollection = async () => {
    if (!collectionName) {
      toast({
        title: "Error",
        description: "Collection name is required.",
        variant: "destructive",
      });
      return;
    }

    try {
      const newCollection: Partial<Collection> = {
        title: collectionName,
        description: collectionDescription,
        visibility: isPublic ? 'public' : 'private',
        cards: selectedCardIds.map(id => ({ id })),
      };

      await createCollection(newCollection);
      toast({
        title: "Success",
        description: "Collection created successfully.",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create collection.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Collection</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value={collectionName} onChange={(e) => setCollectionName(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea id="description" value={collectionDescription} onChange={(e) => setCollectionDescription(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="public" className="text-right">
              Public
            </Label>
            <input type="checkbox" id="public" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleCreateCollection}>Create collection</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCollectionDialog;

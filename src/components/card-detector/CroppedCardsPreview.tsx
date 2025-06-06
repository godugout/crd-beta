
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  Save, 
  Tag, 
  Trash2,
  Edit3,
  Check,
  X
} from 'lucide-react';
import { toast } from 'sonner';

interface CroppedCard {
  id: string;
  imageUrl: string;
  title: string;
  tags: string[];
  metadata: Record<string, any>;
}

interface CroppedCardsPreviewProps {
  croppedCards: CroppedCard[];
  onSaveToCollection: () => void;
}

const CroppedCardsPreview: React.FC<CroppedCardsPreviewProps> = ({
  croppedCards,
  onSaveToCollection
}) => {
  const [cards, setCards] = useState<CroppedCard[]>(croppedCards);
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editTags, setEditTags] = useState('');

  const handleEditCard = (card: CroppedCard) => {
    setEditingCard(card.id);
    setEditTitle(card.title);
    setEditTags(card.tags.join(', '));
  };

  const handleSaveEdit = () => {
    if (!editingCard) return;
    
    const updatedCards = cards.map(card => 
      card.id === editingCard 
        ? {
            ...card,
            title: editTitle,
            tags: editTags.split(',').map(tag => tag.trim()).filter(tag => tag)
          }
        : card
    );
    
    setCards(updatedCards);
    setEditingCard(null);
    toast.success('Card updated');
  };

  const handleCancelEdit = () => {
    setEditingCard(null);
    setEditTitle('');
    setEditTags('');
  };

  const handleDeleteCard = (cardId: string) => {
    const updatedCards = cards.filter(card => card.id !== cardId);
    setCards(updatedCards);
    toast.success('Card removed');
  };

  const handleDownloadCard = (card: CroppedCard) => {
    const link = document.createElement('a');
    link.download = `${card.title.replace(/\s+/g, '_')}.png`;
    link.href = card.imageUrl;
    link.click();
    toast.success('Card downloaded');
  };

  const handleDownloadAll = () => {
    cards.forEach((card, index) => {
      setTimeout(() => {
        handleDownloadCard(card);
      }, index * 100); // Stagger downloads
    });
    toast.success(`Downloading ${cards.length} cards`);
  };

  if (cards.length === 0) {
    return null;
  }

  return (
    <Card className="p-6 bg-gray-800/50 border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">
          Cropped Cards ({cards.length})
        </h2>
        <div className="flex gap-2">
          <Button
            onClick={handleDownloadAll}
            variant="outline"
            className="border-blue-500 text-blue-400 hover:bg-blue-500/10"
          >
            <Download className="h-4 w-4 mr-2" />
            Download All
          </Button>
          <Button
            onClick={onSaveToCollection}
            className="bg-green-600 hover:bg-green-700"
          >
            <Save className="h-4 w-4 mr-2" />
            Save to Collection
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {cards.map((card) => (
          <Card key={card.id} className="bg-gray-900/50 border-gray-600 overflow-hidden">
            <div className="relative group">
              <img
                src={card.imageUrl}
                alt={card.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  onClick={() => handleEditCard(card)}
                  size="sm"
                  variant="secondary"
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => handleDownloadCard(card)}
                  size="sm"
                  variant="secondary"
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => handleDeleteCard(card.id)}
                  size="sm"
                  variant="destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="p-4">
              {editingCard === card.id ? (
                <div className="space-y-3">
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Card title"
                    className="bg-gray-800 border-gray-600"
                  />
                  <Input
                    value={editTags}
                    onChange={(e) => setEditTags(e.target.value)}
                    placeholder="Tags (comma separated)"
                    className="bg-gray-800 border-gray-600"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSaveEdit}
                      size="sm"
                      className="flex-1"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={handleCancelEdit}
                      size="sm"
                      variant="outline"
                      className="flex-1"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="font-semibold text-white mb-2 truncate">
                    {card.title}
                  </h3>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {card.tags.length > 0 ? (
                      card.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs bg-blue-600/20 text-blue-400"
                        >
                          {tag}
                        </Badge>
                      ))
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-xs text-gray-500 border-gray-600"
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        No tags
                      </Badge>
                    )}
                  </div>

                  <div className="text-xs text-gray-400 space-y-1">
                    <div>Confidence: {Math.round((card.metadata.confidence || 0) * 100)}%</div>
                    <div>Type: {card.metadata.type || 'unknown'}</div>
                    {card.metadata.originalBounds && (
                      <div>
                        Size: {Math.round(card.metadata.originalBounds.width)} × {Math.round(card.metadata.originalBounds.height)}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {cards.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No cards available</p>
        </div>
      )}
    </Card>
  );
};

export default CroppedCardsPreview;

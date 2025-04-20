
import React from 'react';
import { useCards } from '@/context/CardContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Trash2, Share, Download } from 'lucide-react';
import { toast } from 'sonner';

interface CardDetailViewProps {
  cardId: string;
  onBack: () => void;
}

const CardDetailView: React.FC<CardDetailViewProps> = ({ cardId, onBack }) => {
  const { getCardById, deleteCard } = useCards();
  const card = getCardById(cardId);

  if (!card) {
    return (
      <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-2xl font-bold mb-4">Card Not Found</h2>
        <Button onClick={onBack}>Back to Gallery</Button>
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this card?")) {
      deleteCard(card.id);
      onBack();
    }
  };

  const handleShare = () => {
    toast.info("Sharing functionality coming soon");
  };

  const handleDownload = () => {
    toast.info("Download functionality coming soon");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Button variant="outline" size="sm" onClick={onBack} className="mr-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Gallery
        </Button>
        <h1 className="text-3xl font-bold">{card.title}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Card Image */}
        <div className="md:col-span-2">
          <div className="relative rounded-lg overflow-hidden border shadow-md bg-card">
            <img 
              src={card.imageUrl} 
              alt={card.title} 
              className="w-full h-auto object-contain"
              style={{ maxHeight: '600px' }}
            />
          </div>
        </div>

        {/* Card Details */}
        <div>
          <div className="bg-card rounded-lg border p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">{card.title}</h2>
            
            <p className="text-muted-foreground mb-6">
              {card.description || "No description provided."}
            </p>
            
            {card.tags && card.tags.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {card.tags.map(tag => (
                    <span 
                      key={tag}
                      className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Card metadata */}
            {card.player && (
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Player Information</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Player:</span>
                    <div className="font-medium">{card.player}</div>
                  </div>
                  {card.team && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Team:</span>
                      <div className="font-medium">{card.team}</div>
                    </div>
                  )}
                  {card.position && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Position:</span>
                      <div className="font-medium">{card.position}</div>
                    </div>
                  )}
                  {card.year && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Year:</span>
                      <div className="font-medium">{card.year}</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Design metadata */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Card Design</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm">
                  <span className="text-muted-foreground">Template:</span>
                  <div className="font-medium">{card.designMetadata?.cardStyle.template}</div>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Effect:</span>
                  <div className="font-medium">{card.designMetadata?.cardStyle.effect}</div>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Category:</span>
                  <div className="font-medium">{card.designMetadata?.cardMetadata.category}</div>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Card Type:</span>
                  <div className="font-medium">{card.designMetadata?.cardMetadata.cardType}</div>
                </div>
              </div>
            </div>

            {/* Card actions */}
            <div className="flex flex-col gap-3 mt-6">
              <Button className="w-full" variant="outline" disabled>
                <Edit className="h-4 w-4 mr-2" />
                Edit Card
              </Button>
              <Button onClick={handleShare} variant="outline" className="w-full">
                <Share className="h-4 w-4 mr-2" />
                Share Card
              </Button>
              <Button onClick={handleDownload} variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button onClick={handleDelete} variant="destructive" className="w-full">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Card
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDetailView;

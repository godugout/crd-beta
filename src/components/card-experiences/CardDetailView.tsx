
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '@/lib/types';
import { useCards } from '@/context/CardContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Share2, Trash } from 'lucide-react';
import { toast } from 'sonner';
import CardDetailedView from '@/components/cards/CardDetailed';
import DeleteConfirmationDialog from '@/components/dialogs/DeleteConfirmationDialog';
import ShareDialog from '@/components/dialogs/ShareDialog';

const CardDetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCardById, deleteCard } = useCards();
  const [card, setCard] = useState<Card | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  
  useEffect(() => {
    if (id) {
      try {
        const foundCard = getCardById(id);
        if (foundCard) {
          setCard(foundCard);
        } else {
          toast.error('Card not found');
          navigate('/cards');
        }
      } catch (error) {
        console.error('Error fetching card:', error);
        toast.error('Failed to load card');
      } finally {
        setIsLoading(false);
      }
    }
  }, [id, getCardById, navigate]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (!card) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Card Not Found</h2>
        <p className="mt-2 text-muted-foreground">The card you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/cards')} className="mt-4">
          Back to Cards
        </Button>
      </div>
    );
  }
  
  const handleDelete = async () => {
    try {
      await deleteCard(card.id);
      toast.success('Card deleted successfully');
      navigate('/cards');
    } catch (error) {
      console.error('Error deleting card:', error);
      toast.error('Failed to delete card');
    }
    setShowDeleteDialog(false);
  };
  
  const handleShare = () => {
    setShowShareDialog(true);
  };
  
  // Create an empty function to satisfy the TypeScript requirement
  const handleEdit = () => {
    navigate(`/cards/${card.id}/edit`);
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CardDetailedView 
            card={card}
            showActions={false}
          />
        </div>
        
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Actions</h2>
            <div className="flex flex-col gap-3">
              <Button onClick={handleEdit} className="w-full flex items-center justify-center gap-2">
                <Edit className="h-4 w-4" />
                Edit Card
              </Button>
              
              <Button onClick={handleShare} variant="outline" className="w-full flex items-center justify-center gap-2">
                <Share2 className="h-4 w-4" />
                Share Card
              </Button>
              
              <Button onClick={() => setShowDeleteDialog(true)} variant="destructive" className="w-full flex items-center justify-center gap-2">
                <Trash className="h-4 w-4" />
                Delete Card
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {showDeleteDialog && (
        <DeleteConfirmationDialog
          isOpen={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onDelete={handleDelete}
          itemName={card.title}
        />
      )}
      
      {showShareDialog && (
        <ShareDialog
          isOpen={showShareDialog}
          onClose={() => setShowShareDialog(false)}
          title={card.title}
          description={card.description || ''}
          url={window.location.href}
        />
      )}
    </div>
  );
};

export default CardDetailView;

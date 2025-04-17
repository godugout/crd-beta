import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageLayout from '@/components/navigation/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardRarity } from '@/lib/types';
import { useCards } from '@/hooks/useCards';
import { toast } from 'sonner';
import { adaptToCard } from '@/lib/adapters/typeAdapters';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { MoreHorizontal, Edit, Trash2, Plus } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { DEFAULT_DESIGN_METADATA } from '@/lib/utils/cardDefaults';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1518770660439-4636190af475';

interface Series {
  id: string;
  name: string;
  description: string;
  coverImageUrl: string;
  artistId: string;
  createdAt: string;
  updatedAt: string;
  releaseDate: string;
  totalCards: number;
  isPublished: boolean;
  cardIds: string[];
  releaseType: string;
  cards?: Card[];
}

const SeriesViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { cards, updateCard } = useCards();
  const [series, setSeries] = useState<Series | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [releaseType, setReleaseType] = useState('');
  const [cardList, setCardList] = useState<Card[]>([]);
  const [newCardId, setNewCardId] = useState('');
  
  useEffect(() => {
    // Mock series data for demonstration
    const mockSeries: Series = {
      id: id || 'series-1',
      name: 'Mock Series',
      description: 'A series of mock cards',
      coverImageUrl: FALLBACK_IMAGE,
      artistId: 'artist-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      releaseDate: new Date().toISOString(),
      totalCards: 3,
      isPublished: true,
      cardIds: ['card-1', 'card-2', 'card-3'],
      releaseType: 'standard',
      cards: [
        adaptToCard({
          id: 'card-1',
          title: 'Card 1',
          imageUrl: FALLBACK_IMAGE,
          description: 'Description for Card 1',
          designMetadata: DEFAULT_DESIGN_METADATA
        }),
        adaptToCard({
          id: 'card-2',
          title: 'Card 2',
          imageUrl: FALLBACK_IMAGE,
          description: 'Description for Card 2',
          designMetadata: DEFAULT_DESIGN_METADATA
        }),
        adaptToCard({
          id: 'card-3',
          title: 'Card 3',
          imageUrl: FALLBACK_IMAGE,
          description: 'Description for Card 3',
          designMetadata: DEFAULT_DESIGN_METADATA
        }),
      ],
    };
    setSeries(mockSeries);
  }, [id]);
  
  useEffect(() => {
    if (series) {
      setName(series.name);
      setDescription(series.description);
      setCoverImageUrl(series.coverImageUrl);
      setReleaseDate(series.releaseDate);
      setReleaseType(series.releaseType);
      setCardList(series.cards || []);
    }
  }, [series]);
  
  const handleEditClick = () => {
    setIsEditing(true);
  };
  
  const handleSaveClick = () => {
    // Save logic here
    setIsEditing(false);
    toast.success('Series updated successfully');
  };
  
  const handleCancelClick = () => {
    setIsEditing(false);
    if (series) {
      setName(series.name);
      setDescription(series.description);
      setCoverImageUrl(series.coverImageUrl);
      setReleaseDate(series.releaseDate);
      setReleaseType(series.releaseType);
      setCardList(series.cards || []);
    }
  };
  
  const handleAddCard = () => {
    if (newCardId) {
      const newCard = adaptToCard({
        id: newCardId,
        title: `Card ${newCardId}`,
        imageUrl: FALLBACK_IMAGE,
        description: `Description for Card ${newCardId}`,
        designMetadata: DEFAULT_DESIGN_METADATA
      });
      setCardList([...cardList, newCard]);
      setNewCardId('');
    }
  };

  const handleRemoveCard = (cardId: string) => {
    setCardList(cardList.filter(card => card.id !== cardId));
  };
  
  const handleCardDetail = (cardId: string) => {
    navigate(`/cards/${cardId}`);
  };
  
  if (!series) {
    return (
      <PageLayout title="Series Not Found" description="Series details">
        <div>Series not found</div>
      </PageLayout>
    );
  }
  
  return (
    <PageLayout title={series.name} description="Series details">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">{series.name}</h1>
          <div>
            {!isEditing ? (
              <Button onClick={handleEditClick}>Edit Series</Button>
            ) : (
              <>
                <Button onClick={handleSaveClick}>Save</Button>
                <Button variant="secondary" onClick={handleCancelClick}>Cancel</Button>
              </>
            )}
          </div>
        </div>
        
        {isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input type="text" id="name" value={name} onChange={e => setName(e.target.value)} />
              
              <Label htmlFor="description">Description</Label>
              <Input type="text" id="description" value={description} onChange={e => setDescription(e.target.value)} />
              
              <Label htmlFor="coverImageUrl">Cover Image URL</Label>
              <Input type="text" id="coverImageUrl" value={coverImageUrl} onChange={e => setCoverImageUrl(e.target.value)} />
              
              <Label htmlFor="releaseDate">Release Date</Label>
              <Input type="date" id="releaseDate" value={releaseDate} onChange={e => setReleaseDate(e.target.value)} />
              
              <Label htmlFor="releaseType">Release Type</Label>
              <Input type="text" id="releaseType" value={releaseType} onChange={e => setReleaseType(e.target.value)} />
            </div>
            
            <div>
              <Label htmlFor="newCardId">Add Card by ID</Label>
              <div className="flex space-x-2">
                <Input
                  type="text"
                  id="newCardId"
                  value={newCardId}
                  onChange={e => setNewCardId(e.target.value)}
                />
                <Button onClick={handleAddCard}>Add Card</Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <img src={series.coverImageUrl} alt={series.name} className="rounded-md" />
              <p>{series.description}</p>
              <p>Release Date: {series.releaseDate}</p>
              <p>Release Type: {series.releaseType}</p>
            </div>
          </div>
        )}
        
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Cards in Series</h2>
          <Table>
            <TableCaption>A list of cards in this series.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Rarity</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cardList.map((card) => {
                // Fix the CardRarity comparison
                // Instead of directly comparing with string "one-of-one"
                // Check if card.rarity is ONE_OF_ONE from CardRarity enum
                const isOneOfOne = card.rarity === CardRarity.ONE_OF_ONE;
                
                return (
                  <TableRow key={card.id}>
                    <TableCell className="font-medium">
                      <img src={card.imageUrl} alt={card.title} className="w-20 h-auto rounded-md" />
                    </TableCell>
                    <TableCell>{card.title}</TableCell>
                    <TableCell>{card.rarity}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleCardDetail(card.id)}>
                            <Edit className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleRemoveCard(card.id)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </PageLayout>
  );
};

export default SeriesViewPage;

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, Series, CardRarity } from '@/lib/types';
import { useEnhancedCards } from '@/context/CardEnhancedContext';
import PageLayout from '@/components/navigation/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardGallery } from '@/components/CardGallery';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Skeleton } from '@/components/ui/skeleton';
import { Edit, Trash2, Plus, ArrowLeft } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from 'sonner';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from '@/lib/utils';
import { DEFAULT_DESIGN_METADATA } from '@/lib/utils/cardDefaults';

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().optional(),
  releaseDate: z.string().optional(),
  releaseType: z.enum(['standard', 'limited']),
  isPublished: z.boolean().default(false),
  coverImageUrl: z.string().optional(),
})

const SeriesViewPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    cards,
    series,
    getSeries,
    updateSeries,
    deleteSeries,
    addCardToSeries,
    removeCardFromSeries,
  } = useEnhancedCards();
  const [isLoading, setIsLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentSeries, setCurrentSeries] = useState<Series | undefined>(undefined);
  const [seriesCards, setSeriesCards] = useState<Card[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
	const [selectedRarity, setSelectedRarity] = useState<CardRarity | 'all'>('all');
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [newCardDescription, setNewCardDescription] = useState('');
  const [newCardImageUrl, setNewCardImageUrl] = useState('');
  const [newCardRarity, setNewCardRarity] = useState<CardRarity>('common');
  const [newCardEffects, setNewCardEffects] = useState<string[]>([]);
  const { toast } = useToast();

  // Form setup
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      releaseDate: new Date().toISOString(),
      releaseType: 'standard',
      isPublished: false,
      coverImageUrl: '',
    },
  })

  // Load series and cards
  useEffect(() => {
    if (id) {
      const foundSeries = getSeries(id);
      setCurrentSeries(foundSeries);
      setIsLoading(false);
    }
  }, [id, getSeries]);

  useEffect(() => {
    if (currentSeries) {
      const filteredCards = cards.filter(card => card.seriesId === currentSeries.id);
      setSeriesCards(filteredCards);
    }
  }, [cards, currentSeries]);

  // Handle series update
  const handleUpdateSeries = async (values: z.infer<typeof formSchema>) => {
    if (currentSeries) {
      const updatedSeriesData = {
        ...currentSeries,
        ...values,
      };
      const updatedSeries = updateSeries(currentSeries.id, updatedSeriesData);
      if (updatedSeries) {
        setCurrentSeries(updatedSeries);
        setIsEditDialogOpen(false);
        toast({
          title: "Series updated successfully!",
          description: "Your series details have been updated.",
        })
      } else {
        toast({
          title: "Failed to update series",
          description: "There was an error updating the series details.",
          variant: "destructive",
        })
      }
    }
  };

  // Handle series deletion
  const handleDeleteSeries = () => {
    if (currentSeries) {
      const deleted = deleteSeries(currentSeries.id);
      if (deleted) {
        navigate('/series');
        toast({
          title: "Series deleted successfully!",
          description: "The series has been removed.",
        })
      } else {
        toast({
          title: "Failed to delete series",
          description: "There was an error deleting the series.",
          variant: "destructive",
        })
      }
    }
  };

  // Handle card addition to series
  const handleAddCardToSeries = () => {
    if (currentSeries) {
      // Basic card data
      const newCardData = {
        title: newCardTitle,
        description: newCardDescription,
        imageUrl: newCardImageUrl,
        thumbnailUrl: newCardImageUrl,
        rarity: newCardRarity,
        effects: newCardEffects,
        designMetadata: DEFAULT_DESIGN_METADATA,
      };

      // Add card to series
      addCardToSeries(newCardData.title, currentSeries.id);
      setIsAddingCard(false);
      setNewCardTitle('');
      setNewCardDescription('');
      setNewCardImageUrl('');
      setNewCardRarity('common');
      setNewCardEffects([]);
      toast({
        title: "Card added to series!",
        description: "The new card has been added to the series.",
      })
    }
  };

  // Handle card removal from series
  const handleRemoveCardFromSeries = (cardId: string) => {
    if (currentSeries) {
      removeCardFromSeries(cardId, currentSeries.id);
      toast({
        title: "Card removed from series!",
        description: "The card has been removed from the series.",
      })
    }
  };

  // Filter cards based on search term and rarity
  const filteredCards = React.useMemo(() => {
    let filtered = seriesCards;

    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(card =>
        card.title.toLowerCase().includes(lowerSearchTerm) ||
        card.description.toLowerCase().includes(lowerSearchTerm)
      );
    }

    if (selectedRarity !== 'all') {
      filtered = filtered.filter(card => card.rarity === selectedRarity);
    }

    return filtered;
  }, [seriesCards, searchTerm, selectedRarity]);

  if (isLoading || !currentSeries) {
    return (
      <PageLayout title="Loading Series..." description="Please wait">
        <div className="max-w-7xl mx-auto p-4">
          <LoadingState text="Loading series" size="lg" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title={currentSeries.title} description={currentSeries.description}>
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => navigate('/series')} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Series
        </Button>

        {/* Series Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{currentSeries.title}</h1>
            <p className="text-muted-foreground">{currentSeries.description}</p>
          </div>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Series
            </Button>
            <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Series
            </Button>
          </div>
        </div>

        {/* Series Cover Image */}
        {currentSeries.coverImageUrl && (
          <div className="mb-8">
            <AspectRatio ratio={16 / 9}>
              <img
                src={currentSeries.coverImageUrl}
                alt={currentSeries.title}
                className="w-full h-full object-cover rounded-md"
              />
            </AspectRatio>
          </div>
        )}

        {/* Series Stats */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card rounded-md p-4 shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground">Total Cards</h3>
            <p className="text-2xl font-bold">{seriesCards.length}</p>
          </div>
          <div className="bg-card rounded-md p-4 shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground">Release Date</h3>
            <p className="text-2xl font-bold">{currentSeries.releaseDate}</p>
          </div>
          <div className="bg-card rounded-md p-4 shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground">Release Type</h3>
            <p className="text-2xl font-bold">{currentSeries.releaseType}</p>
          </div>
          <div className="bg-card rounded-md p-4 shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground">Published</h3>
            <p className="text-2xl font-bold">{currentSeries.isPublished ? 'Yes' : 'No'}</p>
          </div>
        </div>

        {/* Series Actions */}
        <div className="mb-8 flex items-center justify-between">
          <Input
            type="text"
            placeholder="Search cards..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
          <div className="flex items-center space-x-4">
            <Label htmlFor="rarity">Filter by Rarity:</Label>
            <Select value={selectedRarity} onValueChange={(value) => setSelectedRarity(value as CardRarity)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Rarities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Rarities</SelectItem>
                <SelectItem value="common">Common</SelectItem>
                <SelectItem value="uncommon">Uncommon</SelectItem>
                <SelectItem value="rare">Rare</SelectItem>
                <SelectItem value="exclusive">Exclusive</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => setIsAddingCard(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Card
            </Button>
          </div>
        </div>

        {/* Card Gallery */}
        {filteredCards.length > 0 ? (
          <CardGallery cards={filteredCards} />
        ) : (
          <div className="text-center">
            <p>No cards found in this series.</p>
          </div>
        )}
      </div>

      {/* Edit Series Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogTrigger asChild>
          <div></div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Series</DialogTitle>
            <DialogDescription>
              Make changes to your series here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleUpdateSeries)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Series Title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Series Description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="releaseDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Release Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        defaultValue={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="releaseType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Release Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a release type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="limited">Limited</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isPublished"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-sm">Published</FormLabel>
                      <FormDescription>
                        Whether this series is publicly visible.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit">Update Series</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Series Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogTrigger asChild>
          <div></div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Series</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this series? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Button variant="destructive" onClick={handleDeleteSeries}>
              Delete Series
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Card Dialog */}
      <Dialog open={isAddingCard} onOpenChange={setIsAddingCard}>
        <DialogTrigger asChild>
          <div></div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Card to Series</DialogTitle>
            <DialogDescription>
              Create a new card and add it to this series.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input id="title" value={newCardTitle} onChange={(e) => setNewCardTitle(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input id="description" value={newCardDescription} onChange={(e) => setNewCardDescription(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="imageUrl" className="text-right">
                Image URL
              </Label>
              <Input id="imageUrl" value={newCardImageUrl} onChange={(e) => setNewCardImageUrl(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rarity" className="text-right">
                Rarity
              </Label>
              <Select value={newCardRarity} onValueChange={(value) => setNewCardRarity(value as CardRarity)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a rarity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="common">Common</SelectItem>
                  <SelectItem value="uncommon">Uncommon</SelectItem>
                  <SelectItem value="rare">Rare</SelectItem>
                  <SelectItem value="exclusive">Exclusive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleAddCardToSeries}>Add Card</Button>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default SeriesViewPage;

import { Checkbox } from "@/components/ui/checkbox"
import {
  FormDescription,
  FormLabel,
} from "@/components/ui/form"

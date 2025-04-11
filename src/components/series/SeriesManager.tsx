
import React, { useState } from 'react';
import { useEnhancedCards } from '@/context/CardEnhancedContext';
import { Series } from '@/lib/types/CardTypes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Calendar, Trash2, Plus, DragDropIcon, Eye, Edit, PlusCircle, ListFilter, 
  Calendar as CalendarIcon, Grid, Table
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger 
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SeriesManagerProps {
  initialSeries?: Series;
}

const SeriesManager: React.FC<SeriesManagerProps> = ({ initialSeries }) => {
  const { cards, series, addSeries, updateSeries, addCardToSeries, removeCardFromSeries } = useEnhancedCards();
  const [editMode, setEditMode] = useState(!initialSeries);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const [formData, setFormData] = useState<Partial<Series>>({
    id: initialSeries?.id,
    title: initialSeries?.title || '',
    description: initialSeries?.description || '',
    coverImageUrl: initialSeries?.coverImageUrl || '',
    artistId: initialSeries?.artistId || '',
    releaseDate: initialSeries?.releaseDate ? new Date(initialSeries.releaseDate).toISOString().split('T')[0] : '',
    totalCards: initialSeries?.totalCards || 0,
    isPublished: initialSeries?.isPublished ?? false,
    cardIds: initialSeries?.cardIds || [],
    releaseType: initialSeries?.releaseType || 'standard',
  });
  
  const [showAddCardDialog, setShowAddCardDialog] = useState(false);
  
  // Get series cards
  const seriesCards = cards.filter(card => 
    formData.cardIds?.includes(card.id)
  );
  
  // Get available cards (not in this series)
  const availableCards = cards.filter(card => 
    !formData.cardIds?.includes(card.id)
  );
  
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, upload to server
      const url = URL.createObjectURL(file);
      setFormData({ ...formData, coverImageUrl: url });
    }
  };
  
  const handleAddCard = (cardId: string) => {
    if (addCardToSeries(cardId, formData.id!)) {
      setFormData({
        ...formData,
        cardIds: [...(formData.cardIds || []), cardId],
        totalCards: (formData.totalCards || 0) + 1
      });
      setShowAddCardDialog(false);
    }
  };
  
  const handleRemoveCard = (cardId: string) => {
    if (removeCardFromSeries(cardId, formData.id!)) {
      setFormData({
        ...formData,
        cardIds: (formData.cardIds || []).filter(id => id !== cardId),
        totalCards: (formData.totalCards || 0) - 1
      });
    }
  };
  
  const handleSave = () => {
    if (!formData.title) {
      toast.error('Series title is required');
      return;
    }
    
    try {
      if (initialSeries) {
        updateSeries(initialSeries.id, formData);
        toast.success('Series updated successfully');
      } else {
        addSeries(formData);
        toast.success('Series created successfully');
      }
      setEditMode(false);
    } catch (error) {
      console.error('Error saving series:', error);
      toast.error('Failed to save series');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold">
            {initialSeries ? 'Series Details' : 'Create New Series'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {initialSeries ? 'View and edit series information' : 'Create a new card series'}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
          {initialSeries && !editMode && (
            <Button onClick={() => setEditMode(true)} variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit Series
            </Button>
          )}
          
          {editMode && (
            <Button onClick={handleSave}>
              Save Series
            </Button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {editMode ? (
            <Card>
              <CardHeader>
                <CardTitle>Series Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="title">Series Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Enter series title"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Enter series description"
                      className="w-full min-h-[100px] mt-1 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="releaseDate">Release Date</Label>
                      <div className="relative mt-1">
                        <Input
                          id="releaseDate"
                          type="date"
                          value={formData.releaseDate}
                          onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="releaseType">Release Type</Label>
                      <Select
                        value={formData.releaseType}
                        onValueChange={(value) => setFormData({ ...formData, releaseType: value as 'standard' | 'limited' | 'exclusive' })}
                      >
                        <SelectTrigger id="releaseType" className="mt-1">
                          <SelectValue placeholder="Select release type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="limited">Limited Edition</SelectItem>
                          <SelectItem value="exclusive">Exclusive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="coverImage">Cover Image</Label>
                    <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-6">
                      {formData.coverImageUrl ? (
                        <div className="relative">
                          <img
                            src={formData.coverImageUrl}
                            alt="Cover preview"
                            className="max-h-[300px] mx-auto rounded"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            className="absolute top-2 right-2 h-8 w-8 p-0"
                            onClick={() => setFormData({ ...formData, coverImageUrl: '' })}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center">
                          <Plus className="h-12 w-12 text-gray-400" />
                          <p className="mt-2 text-sm text-gray-500">Upload a cover image</p>
                          <label className="mt-4">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="sr-only"
                            />
                            <Button type="button" variant="outline" size="sm">
                              Choose File
                            </Button>
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isPublished"
                      checked={formData.isPublished}
                      onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor="isPublished">Publish series</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Series Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="aspect-video relative rounded-md overflow-hidden">
                    {formData.coverImageUrl ? (
                      <img
                        src={formData.coverImageUrl}
                        alt={formData.title}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <p className="text-muted-foreground">No cover image</p>
                      </div>
                    )}
                    
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        formData.isPublished 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {formData.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-2xl font-bold">{formData.title}</h2>
                      <p className="text-muted-foreground">{formData.description}</p>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Release Date: </span>
                      <span className="font-medium ml-1">
                        {formData.releaseDate 
                          ? new Date(formData.releaseDate).toLocaleDateString() 
                          : 'Not set'}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <span className="mr-2">Release Type:</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        formData.releaseType === 'limited' 
                          ? 'bg-purple-100 text-purple-800' 
                          : formData.releaseType === 'exclusive'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                      }`}>
                        {formData.releaseType?.charAt(0).toUpperCase() + formData.releaseType?.slice(1)}
                      </span>
                    </div>
                    
                    <div className="text-sm">
                      <span>Total Cards: </span>
                      <span className="font-medium">{formData.totalCards || 0}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Series Cards</CardTitle>
              <div className="flex items-center space-x-2">
                <div className="flex p-1 border rounded-md">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1 rounded ${viewMode === 'grid' ? 'bg-primary text-white' : ''}`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1 rounded ${viewMode === 'list' ? 'bg-primary text-white' : ''}`}
                  >
                    <Table className="h-4 w-4" />
                  </button>
                </div>
                
                <Dialog open={showAddCardDialog} onOpenChange={setShowAddCardDialog}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Card
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>Add Card to Series</DialogTitle>
                      <DialogDescription>
                        Select a card from your collection to add to this series
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 max-h-[500px] overflow-y-auto p-1">
                      {availableCards.length > 0 ? (
                        availableCards.map(card => (
                          <Card key={card.id} className="cursor-pointer hover:border-primary overflow-hidden"
                            onClick={() => handleAddCard(card.id)}
                          >
                            <div className="aspect-[2.5/3.5] relative">
                              <img 
                                src={card.imageUrl} 
                                alt={card.title} 
                                className="object-cover w-full h-full"
                              />
                            </div>
                            <CardContent className="p-3">
                              <h4 className="font-medium truncate">{card.title}</h4>
                              <div className="flex justify-between items-center mt-1">
                                <span className="text-xs text-muted-foreground">{card.rarity}</span>
                                <Button size="sm" variant="outline" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddCard(card.id);
                                  }}
                                >
                                  Add
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <div className="col-span-3 text-center py-8">
                          <p className="text-muted-foreground">No cards available to add</p>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {seriesCards.length > 0 ? (
                <div>
                  {viewMode === 'grid' ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {seriesCards.map(card => (
                        <Card key={card.id} className="overflow-hidden">
                          <div className="aspect-[2.5/3.5] relative">
                            <img 
                              src={card.imageUrl} 
                              alt={card.title} 
                              className="object-cover w-full h-full"
                            />
                            {editMode && (
                              <Button
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 h-8 w-8 rounded-full"
                                onClick={() => handleRemoveCard(card.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                          <CardContent className="p-2">
                            <h4 className="font-medium text-sm truncate">{card.title}</h4>
                            <div className="flex justify-between items-center mt-1">
                              <span className="text-xs text-muted-foreground">{card.cardNumber || '—'}</span>
                              <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs">
                                {card.rarity}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      
                      {editMode && (
                        <Card className="border-dashed border-2 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors"
                          onClick={() => setShowAddCardDialog(true)}
                        >
                          <CardContent className="flex flex-col items-center justify-center h-full py-12">
                            <PlusCircle className="h-12 w-12 text-muted-foreground mb-4" />
                            <p className="font-medium">Add Card</p>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  ) : (
                    <div className="rounded-md border overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-slate-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Card
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Number
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Rarity
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Release Date
                            </th>
                            {editMode && (
                              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                              </th>
                            )}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {seriesCards.map(card => (
                            <tr key={card.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-10 w-7 mr-3">
                                    <img src={card.imageUrl} alt={card.title} className="h-10 w-7 object-cover rounded" />
                                  </div>
                                  <div className="text-sm font-medium text-gray-900">{card.title}</div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">{card.cardNumber || '—'}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  card.rarity === 'rare' || card.rarity === 'ultra-rare'
                                    ? 'bg-green-100 text-green-800'
                                    : card.rarity === 'legendary' || card.rarity === 'one-of-one'
                                      ? 'bg-purple-100 text-purple-800'
                                      : 'bg-blue-100 text-blue-800'
                                }`}>
                                  {card.rarity}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">
                                  {card.releaseDate 
                                    ? new Date(card.releaseDate).toLocaleDateString() 
                                    : 'Not set'}
                                </div>
                              </td>
                              {editMode && (
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleRemoveCard(card.id)}
                                  >
                                    Remove
                                  </Button>
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No cards in this series</p>
                  {editMode && (
                    <Button onClick={() => setShowAddCardDialog(true)} className="mt-4">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Cards
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Series Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm text-muted-foreground">Series Title</Label>
                <p className="font-medium">{formData.title || 'Untitled Series'}</p>
              </div>
              
              <div>
                <Label className="text-sm text-muted-foreground">Status</Label>
                <p className="font-medium">
                  <span className={`inline-block px-2 py-1 mt-1 rounded-full text-xs font-medium ${
                    formData.isPublished 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {formData.isPublished ? 'Published' : 'Draft'}
                  </span>
                </p>
              </div>
              
              <div>
                <Label className="text-sm text-muted-foreground">Release Date</Label>
                <div className="flex items-center mt-1">
                  <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                  <p className="font-medium">
                    {formData.releaseDate 
                      ? new Date(formData.releaseDate).toLocaleDateString() 
                      : 'Not set'}
                  </p>
                </div>
              </div>
              
              <div>
                <Label className="text-sm text-muted-foreground">Cards</Label>
                <p className="font-medium">{seriesCards.length} cards</p>
              </div>
              
              <div>
                <Label className="text-sm text-muted-foreground">Release Type</Label>
                <p className="font-medium">
                  {formData.releaseType?.charAt(0).toUpperCase() + formData.releaseType?.slice(1)}
                </p>
              </div>
              
              {initialSeries && (
                <>
                  <div className="border-t pt-4 mt-4">
                    <Label className="text-sm text-muted-foreground">Created</Label>
                    <p className="font-medium">
                      {new Date(initialSeries.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div>
                    <Label className="text-sm text-muted-foreground">Last Updated</Label>
                    <p className="font-medium">
                      {new Date(initialSeries.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </>
              )}
              
              <div className="border-t pt-4 mt-4">
                {editMode ? (
                  <Button className="w-full" onClick={handleSave}>
                    {initialSeries ? 'Update Series' : 'Create Series'}
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <Button className="w-full" onClick={() => setEditMode(true)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Series
                    </Button>
                    <Button className="w-full" variant="outline">
                      <Eye className="mr-2 h-4 w-4" />
                      Preview Series
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SeriesManager;


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Upload, SortDesc } from 'lucide-react';
import { Series } from '@/lib/types/enhancedCardTypes';
import { useEnhancedCards } from '@/context/CardEnhancedContext';
import { toast } from 'sonner';

interface SeriesManagerProps {
  initialSeries?: Series;
}

const SeriesManager: React.FC<SeriesManagerProps> = ({ initialSeries }) => {
  const navigate = useNavigate();
  const { addSeries, updateSeries } = useEnhancedCards();
  const [isUploading, setIsUploading] = useState(false);
  
  const [seriesData, setSeriesData] = useState<Partial<Series>>(initialSeries || {
    title: '',
    description: '',
    coverImageUrl: '',
    artistId: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    releaseDate: '',
    totalCards: 0,
    isPublished: false,
    cardIds: [],
    cards: [],
    releaseType: 'standard',
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSeriesData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSwitchChange = (checked: boolean) => {
    setSeriesData(prev => ({ ...prev, isPublished: checked }));
  };
  
  const handleReleaseTypeChange = (type: 'standard' | 'limited' | 'exclusive') => {
    setSeriesData(prev => ({ ...prev, releaseType: type }));
  };
  
  const handleUploadCover = () => {
    setIsUploading(true);
    setTimeout(() => {
      setSeriesData(prev => ({ ...prev, coverImageUrl: 'https://placehold.co/600x400/png' }));
      setIsUploading(false);
      toast.success('Cover image uploaded');
    }, 1000);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const seriesWithId = initialSeries?.id 
      ? { ...seriesData, updatedAt: new Date().toISOString() } as Series
      : { ...seriesData, id: uuidv4(), updatedAt: new Date().toISOString() } as Series;
      
    if (initialSeries?.id) {
      updateSeries(initialSeries.id, seriesWithId);
      toast.success('Series updated successfully');
    } else {
      addSeries(seriesWithId);
      toast.success('Series created successfully');
    }
    
    navigate('/series');
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Series
        </Button>
        <h2 className="text-3xl font-bold mb-2">
          {initialSeries ? 'Edit Series' : 'Create New Series'}
        </h2>
        <p className="text-muted-foreground">
          {initialSeries 
            ? 'Update your series information and settings'
            : 'Create a new series to group your cards together'}
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Series Title</Label>
            <Input 
              id="title"
              name="title"
              placeholder="Enter series title"
              value={seriesData.title || ''}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description"
              name="description"
              placeholder="Describe your series"
              value={seriesData.description || ''}
              onChange={handleChange}
              rows={5}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="releaseDate">Release Date</Label>
            <Input 
              id="releaseDate"
              name="releaseDate"
              type="date"
              value={seriesData.releaseDate || ''}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <Label>Release Type</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {(['standard', 'limited', 'exclusive'] as const).map(type => (
                <Button
                  key={type}
                  type="button"
                  variant={seriesData.releaseType === type ? "default" : "outline"}
                  onClick={() => handleReleaseTypeChange(type)}
                  className="capitalize"
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>
          
          <div>
            <Label>Cover Image</Label>
            <div className="mt-2">
              {seriesData.coverImageUrl ? (
                <div className="relative w-full h-40 mb-2 overflow-hidden rounded-lg">
                  <img 
                    src={seriesData.coverImageUrl} 
                    alt="Series cover" 
                    className="w-full h-full object-cover"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={handleUploadCover}
                    className="absolute bottom-2 right-2"
                  >
                    Change Image
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-32 border-dashed flex flex-col gap-2 items-center justify-center"
                  onClick={handleUploadCover}
                  disabled={isUploading}
                >
                  <Upload className="h-6 w-6 text-muted-foreground" />
                  <span>{isUploading ? 'Uploading...' : 'Upload Cover Image'}</span>
                </Button>
              )}
            </div>
          </div>
          
          {initialSeries && (
            <div className="flex items-center gap-2 pt-2">
              <div className="flex-grow">
                <h4 className="font-medium">Cards in Series</h4>
                <p className="text-sm text-muted-foreground">
                  {initialSeries.cardIds?.length || 0} cards in this series
                </p>
              </div>
              
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => navigate(`/series/${initialSeries.id}/cards`)}
              >
                <SortDesc className="mr-2 h-4 w-4" />
                Manage Cards
              </Button>
            </div>
          )}
          
          <div className="flex items-center space-x-2 pt-4">
            <Switch
              id="isPublished"
              checked={seriesData.isPublished || false}
              onCheckedChange={handleSwitchChange}
            />
            <div>
              <Label htmlFor="isPublished">Publish Series</Label>
              <p className="text-sm text-muted-foreground">
                {seriesData.isPublished
                  ? 'This series is visible to everyone'
                  : 'This series is only visible to you'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/series')}
          >
            Cancel
          </Button>
          <Button type="submit">
            {initialSeries ? 'Update Series' : 'Create Series'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SeriesManager;

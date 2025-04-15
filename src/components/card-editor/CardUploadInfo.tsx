
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import ImageUploader from '@/components/dam/ImageUploader';
import { X, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CardUploadInfoProps {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  player: string;
  setPlayer: (value: string) => void;
  team: string;
  setTeam: (value: string) => void;
  year: string;
  setYear: (value: string) => void;
  tags: string[];
  setTags: (tags: string[]) => void;
  imageUrl: string;
  setImageUrl: (url: string) => void;
  onFileChange: (file: File) => void;
}

const CARD_CATEGORIES = ['Sports', 'Movies', 'Music', 'Art', 'Collectibles'];
const CARD_TYPES = ['Classic', 'Handcrafted', 'Refractor', 'Holographic', 'Digital'];
const CARD_SERIES = ['80s VCR', 'Retro', 'Modern', 'Vintage', 'Limited Edition'];

const CardUploadInfo: React.FC<CardUploadInfoProps> = ({
  title,
  setTitle,
  description,
  setDescription,
  player,
  setPlayer,
  team,
  setTeam,
  year,
  setYear,
  tags,
  setTags,
  imageUrl,
  setImageUrl,
  onFileChange
}) => {
  const [tagInput, setTagInput] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [cardType, setCardType] = React.useState('');
  const [series, setSeries] = React.useState('');
  
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
        setTagInput('');
      }
    }
  };
  
  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };
  
  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">Upload CRD Image</h3>
          
          <div className="flex flex-col md:flex-row gap-4">
            {imageUrl ? (
              <div className="relative aspect-[2.5/3.5] w-48 border rounded-lg overflow-hidden">
                <img
                  src={imageUrl}
                  alt="Card preview"
                  className="w-full h-full object-contain"
                />
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className="absolute top-2 right-2 p-1 bg-white rounded-full shadow hover:bg-gray-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="aspect-[2.5/3.5] w-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-4">
                <ImageUploader
                  onUploadComplete={setImageUrl}
                  title="Upload Card"
                  maxSizeMB={5}
                />
              </div>
            )}
            
            <div className="aspect-[2.5/3.5] w-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center">
              <div className="text-gray-400 text-center p-4">
                <span className="block">Back of Card</span>
                <span className="text-xs">(Optional)</span>
              </div>
            </div>
          </div>
          
          <p className="text-sm text-gray-500 mt-4">
            For best results, use a high-quality image with a 2.5:3.5 aspect ratio
          </p>
        </div>
      </div>
      
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-6">
        <h3 className="text-lg font-medium mb-4">CRD Details</h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="card-title" className="text-sm text-gray-600 uppercase">Title</Label>
            <Input
              id="card-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title for your CRD"
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="card-description" className="text-sm text-gray-600 uppercase">Description</Label>
            <Textarea
              id="card-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your CRD"
              rows={3}
              className="w-full"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="card-category" className="text-sm text-gray-600 uppercase">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {CARD_CATEGORIES.map(cat => (
                    <SelectItem key={cat} value={cat.toLowerCase()}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="card-type" className="text-sm text-gray-600 uppercase">Type</Label>
              <Select value={cardType} onValueChange={setCardType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  {CARD_TYPES.map(type => (
                    <SelectItem key={type} value={type.toLowerCase()}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="card-series" className="text-sm text-gray-600 uppercase">Series</Label>
              <Select value={series} onValueChange={setSeries}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Series" />
                </SelectTrigger>
                <SelectContent>
                  {CARD_SERIES.map(s => (
                    <SelectItem key={s} value={s.toLowerCase()}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2 mt-2">
            <Label htmlFor="card-tags" className="text-sm text-gray-600 uppercase">Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  #{tag}
                  <button 
                    type="button" 
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex items-center">
              <Input
                id="card-tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Add tags and press Enter"
                className="flex-1"
              />
              <button
                type="button"
                onClick={() => {
                  if (tagInput.trim() && !tags.includes(tagInput.trim())) {
                    setTags([...tags, tagInput.trim()]);
                    setTagInput('');
                  }
                }}
                className="ml-2 p-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Make available for printing</h3>
            <p className="text-sm text-gray-500">
              Let us know if anyone requests prints and you can work with a CRD Collective printer or use your own
            </p>
          </div>
          <div className="flex items-center">
            <input type="checkbox" id="allow-printing" className="h-4 w-4 text-green-600" />
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Include in CRD Catalog</h3>
            <p className="text-sm text-gray-500">
              Contribute to our official CRD Catalog for limited print releases and special edition NFTs
            </p>
          </div>
          <div className="flex items-center">
            <input type="checkbox" id="include-catalog" className="h-4 w-4 text-green-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardUploadInfo;

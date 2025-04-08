import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import CardUpload from '@/components/card-upload/CardUpload';
import { useCards } from '@/context/CardContext';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';

// Card template definitions
const CARD_TEMPLATES = [
  {
    id: 'nostalgic',
    name: 'Cardshow Nostalgia Series',
    color: 'bg-green-500',
    style: {
      borderRadius: '8px',
      borderColor: '#22c55e',
      frameColor: '#22c55e',
      frameWidth: 3,
      shadowColor: 'rgba(34, 197, 94, 0.5)',
    }
  },
  {
    id: 'classic',
    name: 'Classic Cardboard',
    color: 'bg-rose-500',
    style: {
      borderRadius: '4px',
      borderColor: '#f43f5e',
      frameColor: '#f43f5e',
      frameWidth: 2,
      shadowColor: 'rgba(244, 63, 94, 0.4)',
    }
  },
  {
    id: 'nifty',
    name: 'Nifty Framework',
    color: 'bg-purple-500',
    style: {
      borderRadius: '12px',
      borderColor: '#a855f7',
      frameColor: '#a855f7',
      frameWidth: 4,
      shadowColor: 'rgba(168, 85, 247, 0.6)',
    }
  },
];

// Card categories
const CARD_CATEGORIES = [
  { value: 'sports', label: 'Sports' },
  { value: 'movies', label: 'Movies' },
  { value: 'music', label: 'Music' },
  { value: 'gaming', label: 'Gaming' },
  { value: 'comics', label: 'Comics' },
  { value: 'pop-art', label: 'Pop Art' },
  { value: 'street-art', label: 'Street Art' },
];

// Card types
const CARD_TYPES = [
  { value: 'handcrafted', label: 'Handcrafted' },
  { value: 'ai-generated', label: 'AI Generated' },
  { value: 'photograph', label: 'Photograph' },
  { value: 'vintage', label: 'Vintage' },
  { value: 'remix', label: 'Remix' },
];

// Card series
const CARD_SERIES = [
  { value: '80s-vcr', label: '80s VCR' },
  { value: 'pixel-art', label: 'Pixel Art' },
  { value: 'vintage-baseball', label: 'Vintage Baseball' },
  { value: 'basketball-legends', label: 'Basketball Legends' },
  { value: 'comic-heroes', label: 'Comic Heroes' },
];

interface CardCreatorProps {
  onComplete?: (card: any) => void;
}

const CardCreator: React.FC<CardCreatorProps> = ({ onComplete }) => {
  const navigate = useNavigate();
  const { addCard } = useCards();
  
  const [imageUrl, setImageUrl] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [cardType, setCardType] = useState<string>('');
  const [series, setSeries] = useState<string>('');
  const [tags, setTags] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('nostalgic');
  
  // Marketplace options
  const [isPrintable, setIsPrintable] = useState<boolean>(true);
  const [isForSale, setIsForSale] = useState<boolean>(false);
  const [includeInCatalog, setIncludeInCatalog] = useState<boolean>(false);

  const handleImageUpload = (file: File, url: string) => {
    setImageUrl(url);
  };
  
  const getSelectedTemplateStyle = () => {
    return CARD_TEMPLATES.find(template => template.id === selectedTemplate)?.style || CARD_TEMPLATES[0].style;
  };

  const handleSubmit = async () => {
    if (!title.trim() || !imageUrl) {
      toast.error('Please provide a title and upload an image');
      return;
    }

    try {
      // Process tags
      const tagArray = tags
        .split(/,|#/)
        .map(tag => tag.trim())
        .filter(Boolean)
        .map(tag => tag.startsWith('#') ? tag : `#${tag}`);
      
      const templateStyle = getSelectedTemplateStyle();
      
      const newCard = await addCard({
        title,
        description,
        imageUrl,
        thumbnailUrl: imageUrl,
        tags: tagArray,
        designMetadata: {
          cardStyle: {
            template: selectedTemplate,
            effect: selectedTemplate,
            ...templateStyle,
          },
          textStyle: {
            titleColor: '#FFFFFF',
            titleAlignment: 'left',
            titleWeight: 'bold',
            descriptionColor: '#FFFFFF',
          },
          marketMetadata: {
            isPrintable,
            isForSale,
            includeInCatalog
          },
          cardMetadata: {
            category,
            cardType,
            series
          }
        }
      });

      toast.success('Card created successfully!');
      
      if (onComplete && newCard) {
        onComplete(newCard);
      } else {
        navigate('/gallery');
      }
    } catch (error) {
      console.error('Error creating card:', error);
      toast.error('Failed to create card');
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-6 text-white">Create a Card</h1>
          
          <div className="mb-8 space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Upload Card Files</h2>
              <p className="text-gray-400 mb-4 text-sm">Drag or choose your file to upload</p>
              
              <div className="rounded-lg overflow-hidden mb-4">
                <CardUpload 
                  onImageUpload={handleImageUpload}
                  initialImageUrl={imageUrl}
                />
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Card Details</h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-gray-300 uppercase text-xs tracking-wider mb-1 block">Title</Label>
                  <Input 
                    id="title" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Name your card"
                    className="bg-gray-900 border-gray-700 text-white"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description" className="text-gray-300 uppercase text-xs tracking-wider mb-1 block">Description</Label>
                  <Textarea 
                    id="description" 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add a description for your card"
                    className="bg-gray-900 border-gray-700 text-white resize-none min-h-[100px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-4">
                <div>
                  <Label htmlFor="category" className="text-gray-300 uppercase text-xs tracking-wider mb-1 block">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-700 text-white">
                      {CARD_CATEGORIES.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="type" className="text-gray-300 uppercase text-xs tracking-wider mb-1 block">Type</Label>
                  <Select value={cardType} onValueChange={setCardType}>
                    <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-700 text-white">
                      {CARD_TYPES.map(type => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="series" className="text-gray-300 uppercase text-xs tracking-wider mb-1 block">Series</Label>
                  <Select value={series} onValueChange={setSeries}>
                    <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                      <SelectValue placeholder="Series" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-700 text-white">
                      {CARD_SERIES.map(s => (
                        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="mt-4">
                <Label htmlFor="tags" className="text-gray-300 uppercase text-xs tracking-wider mb-1 block">Tags</Label>
                <Input 
                  id="tags" 
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="#SPORTS #HANDCRAFTED #80SVCR"
                  className="bg-gray-900 border-gray-700 text-white"
                />
              </div>
              
              <div className="space-y-4 mt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Make available for printing</h3>
                    <p className="text-sm text-gray-400">See if there is any fan interest in prints of your card. We'll let you know if anyone requests prints and you can work with a CRD Collective printer or use your own.</p>
                  </div>
                  <Switch 
                    checked={isPrintable} 
                    onCheckedChange={setIsPrintable}
                    className="data-[state=checked]:bg-green-500"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Add to the market for sale</h3>
                    <p className="text-sm text-gray-400">Put up for purchase as a digital download or sell physical cards on the Cardshow Market.</p>
                  </div>
                  <Switch 
                    checked={isForSale} 
                    onCheckedChange={setIsForSale}
                    className="data-[state=checked]:bg-green-500"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Include in CRD Catalog</h3>
                    <p className="text-sm text-gray-400">Contribute to our official CRD Catalog for limited print releases and special edition NFTs.</p>
                  </div>
                  <Switch 
                    checked={includeInCatalog} 
                    onCheckedChange={setIncludeInCatalog}
                    className="data-[state=checked]:bg-green-500"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Customize Design</h2>
              <p className="text-gray-400 mb-4 text-sm">Customize your card with a new card frame and elements</p>
              
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-gray-800 aspect-square rounded-lg flex items-center justify-center cursor-pointer">
                  <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
                    <Plus className="h-6 w-6 text-white" />
                  </div>
                </div>
                
                {CARD_TEMPLATES.map((template) => (
                  <div 
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={cn(
                      "bg-gray-800 aspect-square rounded-lg flex items-center justify-center cursor-pointer",
                      selectedTemplate === template.id && "ring-2 ring-white"
                    )}
                  >
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${template.color}`} />
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <Button
            onClick={handleSubmit}
            className="w-full md:w-auto px-8 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full"
          >
            Create Card
          </Button>
        </div>
        
        <div className="lg:w-80">
          <div className="sticky top-24">
            <Card className="bg-gray-900 border-gray-700 text-white">
              <CardContent className="p-4">
                <h3 className="text-xl font-semibold mb-2">Preview</h3>
                
                <div className="relative mb-4">
                  <div 
                    className="aspect-[2.5/3.5] rounded-lg overflow-hidden"
                    style={{
                      borderRadius: getSelectedTemplateStyle().borderRadius,
                      boxShadow: `0 0 20px ${getSelectedTemplateStyle().shadowColor}`,
                      border: `${getSelectedTemplateStyle().frameWidth}px solid ${getSelectedTemplateStyle().frameColor}`,
                    }}
                  >
                    {imageUrl ? (
                      <img 
                        src={imageUrl} 
                        alt="Card preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                        <p className="text-gray-500">No image</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-bold text-lg">{title || 'No title'}</h4>
                  <p className="text-sm text-gray-300">{description || 'No description added yet'}</p>
                </div>
                
                {title && imageUrl && (
                  <Button 
                    onClick={handleSubmit}
                    className="mt-6 w-full bg-green-500 hover:bg-green-600 text-white"
                  >
                    Create Card
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardCreator;

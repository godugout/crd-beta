import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Save, QrCode, ImagePlus, Palette, Type, Layers, PenTool, 
  MousePointer, Maximize2, X, Plus
} from 'lucide-react';
import { toast } from 'sonner';
import { CardRarity, HotspotData } from '@/lib/types/cardTypes';
import { Slider } from '@/components/ui/slider';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface CardDesignerProps {
  initialCard?: any;
  onSave: (cardData: any) => Promise<void>;
}

const CardDesigner: React.FC<CardDesignerProps> = ({ initialCard, onSave }) => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLDivElement>(null);
  
  const [title, setTitle] = useState(initialCard?.title || '');
  const [description, setDescription] = useState(initialCard?.description || '');
  const [imageUrl, setImageUrl] = useState(initialCard?.imageUrl || '');
  const [rarity, setRarity] = useState<CardRarity>(initialCard?.rarity || 'common');
  const [cardNumber, setCardNumber] = useState(initialCard?.cardNumber || '');
  const [seriesId, setSeriesId] = useState(initialCard?.seriesId || '');
  const [editionSize, setEditionSize] = useState(initialCard?.editionSize || 1);
  const [releaseDate, setReleaseDate] = useState(initialCard?.releaseDate || new Date().toISOString().split('T')[0]);
  const [qrCodeData, setQrCodeData] = useState(initialCard?.qrCodeData || '');
  const [hotspots, setHotspots] = useState<HotspotData[]>(initialCard?.hotspots || []);
  
  // Designer state
  const [activeTemplate, setActiveTemplate] = useState('standard');
  const [showHotspots, setShowHotspots] = useState(true);
  const [isAddingHotspot, setIsAddingHotspot] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [artistInfo, setArtistInfo] = useState({
    name: initialCard?.artist?.name || '',
    bio: initialCard?.artist?.bio || '',
    showSignature: initialCard?.showSignature || false,
    showLogo: initialCard?.showLogo || false,
    signatureUrl: initialCard?.artist?.signature || '',
    logoUrl: initialCard?.artist?.logoUrl || ''
  });
  
  // Card style state
  const [cardStyle, setCardStyle] = useState({
    borderRadius: initialCard?.designMetadata?.borderRadius || 12,
    borderWidth: initialCard?.designMetadata?.borderWidth || 0,
    borderColor: initialCard?.designMetadata?.borderColor || '#000000',
    backgroundColor: initialCard?.designMetadata?.backgroundColor || '#ffffff',
    textColor: initialCard?.designMetadata?.textColor || '#000000',
    effectType: initialCard?.designMetadata?.effectType || 'none',
    effectIntensity: initialCard?.designMetadata?.effectIntensity || 50,
    showOverlay: initialCard?.designMetadata?.showOverlay || false,
    overlayColor: initialCard?.designMetadata?.overlayColor || 'rgba(0,0,0,0.3)',
    textShadow: initialCard?.designMetadata?.textShadow || false
  });
  
  // Card templates
  const cardTemplates = [
    { id: 'standard', name: 'Standard', previewUrl: '/placeholder.svg' },
    { id: 'holographic', name: 'Holographic', previewUrl: '/placeholder.svg' },
    { id: 'vintage', name: 'Vintage', previewUrl: '/placeholder.svg' },
    { id: 'modern', name: 'Modern', previewUrl: '/placeholder.svg' },
    { id: 'minimalist', name: 'Minimalist', previewUrl: '/placeholder.svg' }
  ];
  
  // Sample series for demo purposes
  const sampleSeries = [
    { id: 'series-001', name: 'First Edition Collection' },
    { id: 'series-002', name: 'Limited Edition Memorabilia' },
    { id: 'series-003', name: 'Special Release' }
  ];
  
  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, you would upload the file to a storage service
      // and get back a URL. For now, we'll use a local URL.
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    }
  };
  
  // Add a hotspot
  const addHotspot = () => {
    setIsAddingHotspot(true);
    setActiveHotspot(null);
  };
  
  // Handle click on canvas for hotspot placement
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (!isAddingHotspot || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    const newHotspot: HotspotData = {
      id: `hotspot-${Date.now()}`,
      x,
      y,
      width: 20,
      height: 20,
      content: 'New hotspot',
      type: 'text',
      visible: true
    };
    
    setHotspots([...hotspots, newHotspot]);
    setActiveHotspot(newHotspot.id);
    setIsAddingHotspot(false);
    toast.success('Hotspot added');
  };
  
  // Delete a hotspot
  const deleteHotspot = (id: string) => {
    setHotspots(hotspots.filter(hotspot => hotspot.id !== id));
    setActiveHotspot(null);
    toast.success('Hotspot deleted');
  };
  
  // Update hotspot content
  const updateHotspotContent = (id: string, content: string) => {
    setHotspots(hotspots.map(hotspot => {
      if (hotspot.id === id) {
        return { ...hotspot, content };
      }
      return hotspot;
    }));
  };
  
  // Handle save
  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Please enter a card title');
      return;
    }
    
    if (!imageUrl) {
      toast.error('Please upload an image');
      return;
    }
    
    const cardData = {
      title,
      description,
      imageUrl,
      rarity,
      cardNumber,
      seriesId,
      editionSize: Number(editionSize),
      releaseDate,
      qrCodeData,
      hotspots,
      artist: {
        name: artistInfo.name,
        bio: artistInfo.bio,
        signature: artistInfo.signatureUrl,
        logoUrl: artistInfo.logoUrl
      },
      designMetadata: {
        ...cardStyle,
        template: activeTemplate,
        showSignature: artistInfo.showSignature,
        showLogo: artistInfo.showLogo
      }
    };
    
    try {
      await onSave(cardData);
      toast.success('Card saved successfully');
      navigate('/cards');
    } catch (error) {
      console.error('Error saving card:', error);
      toast.error('Failed to save card');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
      <div className="lg:col-span-2 space-y-6">
        <Tabs defaultValue="design">
          <TabsList className="grid grid-cols-5 w-full md:w-[600px]">
            <TabsTrigger value="design">
              <Palette className="h-4 w-4 mr-2" />
              Design
            </TabsTrigger>
            <TabsTrigger value="metadata">
              <Layers className="h-4 w-4 mr-2" />
              Metadata
            </TabsTrigger>
            <TabsTrigger value="artist">
              <PenTool className="h-4 w-4 mr-2" />
              Artist
            </TabsTrigger>
            <TabsTrigger value="hotspots">
              <MousePointer className="h-4 w-4 mr-2" />
              Hotspots
            </TabsTrigger>
            <TabsTrigger value="qr">
              <QrCode className="h-4 w-4 mr-2" />
              QR Code
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="design" className="space-y-4 pt-4">
            <div>
              <Label>Card Template</Label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-2">
                {cardTemplates.map(template => (
                  <div
                    key={template.id}
                    onClick={() => setActiveTemplate(template.id)}
                    className={`border rounded p-2 cursor-pointer ${
                      activeTemplate === template.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="aspect-[2.5/3.5] bg-gray-100 rounded mb-1">
                      <img 
                        src={template.previewUrl} 
                        alt={template.name}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <p className="text-xs text-center truncate">{template.name}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Border Radius</Label>
                <Slider
                  value={[cardStyle.borderRadius]}
                  min={0}
                  max={24}
                  step={1}
                  onValueChange={(value) => setCardStyle({...cardStyle, borderRadius: value[0]})}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0px</span>
                  <span>{cardStyle.borderRadius}px</span>
                  <span>24px</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Border Width</Label>
                <Slider
                  value={[cardStyle.borderWidth]}
                  min={0}
                  max={10}
                  step={1}
                  onValueChange={(value) => setCardStyle({...cardStyle, borderWidth: value[0]})}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0px</span>
                  <span>{cardStyle.borderWidth}px</span>
                  <span>10px</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="borderColor">Border Color</Label>
                <div className="flex mt-1">
                  <Input 
                    id="borderColor"
                    type="color"
                    value={cardStyle.borderColor}
                    onChange={(e) => setCardStyle({...cardStyle, borderColor: e.target.value})}
                    className="w-12 h-10 p-1 rounded-l-md"
                  />
                  <Input 
                    type="text"
                    value={cardStyle.borderColor}
                    onChange={(e) => setCardStyle({...cardStyle, borderColor: e.target.value})}
                    className="flex-1 rounded-l-none"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="backgroundColor">Background Color</Label>
                <div className="flex mt-1">
                  <Input 
                    id="backgroundColor"
                    type="color"
                    value={cardStyle.backgroundColor}
                    onChange={(e) => setCardStyle({...cardStyle, backgroundColor: e.target.value})}
                    className="w-12 h-10 p-1 rounded-l-md"
                  />
                  <Input 
                    type="text"
                    value={cardStyle.backgroundColor}
                    onChange={(e) => setCardStyle({...cardStyle, backgroundColor: e.target.value})}
                    className="flex-1 rounded-l-none"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="textColor">Text Color</Label>
                <div className="flex mt-1">
                  <Input 
                    id="textColor"
                    type="color"
                    value={cardStyle.textColor}
                    onChange={(e) => setCardStyle({...cardStyle, textColor: e.target.value})}
                    className="w-12 h-10 p-1 rounded-l-md"
                  />
                  <Input 
                    type="text"
                    value={cardStyle.textColor}
                    onChange={(e) => setCardStyle({...cardStyle, textColor: e.target.value})}
                    className="flex-1 rounded-l-none"
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Effect Type</Label>
                <Select
                  value={cardStyle.effectType}
                  onValueChange={(value) => setCardStyle({...cardStyle, effectType: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select effect" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="holographic">Holographic</SelectItem>
                    <SelectItem value="prism">Prism</SelectItem>
                    <SelectItem value="foil">Foil</SelectItem>
                    <SelectItem value="vintage">Vintage</SelectItem>
                    <SelectItem value="glow">Glow</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {cardStyle.effectType !== 'none' && (
                <div className="space-y-2">
                  <Label>Effect Intensity</Label>
                  <Slider
                    value={[cardStyle.effectIntensity]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => setCardStyle({...cardStyle, effectIntensity: value[0]})}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Subtle</span>
                    <span>{cardStyle.effectIntensity}%</span>
                    <span>Intense</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="overlay"
                  checked={cardStyle.showOverlay}
                  onCheckedChange={(checked) => setCardStyle({...cardStyle, showOverlay: checked})}
                />
                <Label htmlFor="overlay">Show Text Overlay</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="textShadow"
                  checked={cardStyle.textShadow}
                  onCheckedChange={(checked) => setCardStyle({...cardStyle, textShadow: checked})}
                />
                <Label htmlFor="textShadow">Text Shadow Effect</Label>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="metadata" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Card Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter card title"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="rarity">Rarity</Label>
                <Select
                  value={rarity}
                  onValueChange={(value: CardRarity) => setRarity(value)}
                >
                  <SelectTrigger id="rarity" className="mt-1">
                    <SelectValue placeholder="Select rarity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="common">Common</SelectItem>
                    <SelectItem value="uncommon">Uncommon</SelectItem>
                    <SelectItem value="rare">Rare</SelectItem>
                    <SelectItem value="ultra-rare">Ultra Rare</SelectItem>
                    <SelectItem value="legendary">Legendary</SelectItem>
                    <SelectItem value="one-of-one">One of One</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="e.g. 1/100"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="series">Series</Label>
                <Select
                  value={seriesId}
                  onValueChange={setSeriesId}
                >
                  <SelectTrigger id="series" className="mt-1">
                    <SelectValue placeholder="Select series" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {sampleSeries.map(series => (
                      <SelectItem key={series.id} value={series.id}>
                        {series.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editionSize">Edition Size</Label>
                <Input
                  id="editionSize"
                  type="number"
                  min="1"
                  value={editionSize}
                  onChange={(e) => setEditionSize(parseInt(e.target.value) || 1)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="releaseDate">Release Date</Label>
                <Input
                  id="releaseDate"
                  type="date"
                  value={releaseDate}
                  onChange={(e) => setReleaseDate(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter card description"
                className="w-full min-h-[100px] mt-1 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm"
              />
            </div>
            
            <div>
              <Label htmlFor="cardImage">Card Image</Label>
              <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-6">
                {imageUrl ? (
                  <div className="relative">
                    <img
                      src={imageUrl}
                      alt="Card preview"
                      className="max-h-[300px] mx-auto rounded"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2 h-8 w-8 p-0"
                      onClick={() => setImageUrl('')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <ImagePlus className="h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">Upload an image</p>
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
          </TabsContent>
          
          <TabsContent value="artist" className="space-y-4 pt-4">
            <div>
              <Label htmlFor="artistName">Artist Name</Label>
              <Input
                id="artistName"
                value={artistInfo.name}
                onChange={(e) => setArtistInfo({...artistInfo, name: e.target.value})}
                placeholder="Enter artist name"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="artistBio">Artist Bio</Label>
              <textarea
                id="artistBio"
                value={artistInfo.bio}
                onChange={(e) => setArtistInfo({...artistInfo, bio: e.target.value})}
                placeholder="Enter artist bio"
                className="w-full min-h-[100px] mt-1 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Switch
                    id="showSignature"
                    checked={artistInfo.showSignature}
                    onCheckedChange={(checked) => 
                      setArtistInfo({...artistInfo, showSignature: checked})
                    }
                  />
                  <Label htmlFor="showSignature">Include Signature</Label>
                </div>
                
                {artistInfo.showSignature && (
                  <>
                    <Label htmlFor="signatureUpload">Upload Signature Image</Label>
                    <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-4">
                      {artistInfo.signatureUrl ? (
                        <div className="relative">
                          <img
                            src={artistInfo.signatureUrl}
                            alt="Signature preview"
                            className="max-h-[100px] mx-auto"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            className="absolute top-2 right-2 h-8 w-8 p-0"
                            onClick={() => setArtistInfo({...artistInfo, signatureUrl: ''})}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center cursor-pointer">
                          <PenTool className="h-8 w-8 text-gray-400" />
                          <p className="mt-1 text-xs text-gray-500">Upload signature</p>
                          <input
                            id="signatureUpload"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                // In a real app, upload to server
                                const url = URL.createObjectURL(file);
                                setArtistInfo({...artistInfo, signatureUrl: url});
                              }
                            }}
                            className="sr-only"
                          />
                        </label>
                      )}
                    </div>
                  </>
                )}
              </div>
              
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Switch
                    id="showLogo"
                    checked={artistInfo.showLogo}
                    onCheckedChange={(checked) => 
                      setArtistInfo({...artistInfo, showLogo: checked})
                    }
                  />
                  <Label htmlFor="showLogo">Include Artist Logo</Label>
                </div>
                
                {artistInfo.showLogo && (
                  <>
                    <Label htmlFor="logoUpload">Upload Logo Image</Label>
                    <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-4">
                      {artistInfo.logoUrl ? (
                        <div className="relative">
                          <img
                            src={artistInfo.logoUrl}
                            alt="Logo preview"
                            className="max-h-[100px] mx-auto"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            className="absolute top-2 right-2 h-8 w-8 p-0"
                            onClick={() => setArtistInfo({...artistInfo, logoUrl: ''})}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center cursor-pointer">
                          <ImagePlus className="h-8 w-8 text-gray-400" />
                          <p className="mt-1 text-xs text-gray-500">Upload logo</p>
                          <input
                            id="logoUpload"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                // In a real app, upload to server
                                const url = URL.createObjectURL(file);
                                setArtistInfo({...artistInfo, logoUrl: url});
                              }
                            }}
                            className="sr-only"
                          />
                        </label>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="hotspots" className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div className="space-x-2">
                <Button 
                  variant={isAddingHotspot ? "default" : "outline"} 
                  onClick={addHotspot}
                  disabled={isAddingHotspot}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Hotspot
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowHotspots(!showHotspots)}
                >
                  {showHotspots ? 'Hide Hotspots' : 'Show Hotspots'}
                </Button>
              </div>
              
              {isAddingHotspot && (
                <p className="text-sm text-muted-foreground">
                  Click on the image to place hotspot
                </p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <div 
                  ref={canvasRef}
                  className="relative border rounded-lg overflow-hidden aspect-[2.5/3.5]"
                  onClick={handleCanvasClick}
                >
                  {imageUrl ? (
                    <img 
                      src={imageUrl}
                      alt="Card preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <p className="text-muted-foreground">Upload an image first</p>
                    </div>
                  )}
                  
                  {/* Render hotspots */}
                  {showHotspots && hotspots.map(hotspot => (
                    <div
                      key={hotspot.id}
                      className={`absolute border-2 ${
                        activeHotspot === hotspot.id 
                          ? 'border-blue-500' 
                          : 'border-white'
                      }`}
                      style={{
                        left: `${hotspot.x}%`,
                        top: `${hotspot.y}%`,
                        width: `${hotspot.width}%`,
                        height: `${hotspot.height}%`,
                        transform: 'translate(-50%, -50%)',
                        cursor: 'pointer'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveHotspot(activeHotspot === hotspot.id ? null : hotspot.id);
                      }}
                    >
                      <div 
                        className={`w-full h-full bg-blue-500 bg-opacity-20 flex items-center justify-center ${
                          activeHotspot === hotspot.id ? 'visible' : 'invisible'
                        }`}
                      >
                        <span className="text-xs text-white bg-blue-500 px-1 rounded">
                          {hotspot.type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Hotspot Properties</h3>
                {activeHotspot ? (
                  <div className="space-y-3">
                    {hotspots.map(hotspot => {
                      if (hotspot.id === activeHotspot) {
                        return (
                          <div key={hotspot.id} className="space-y-3">
                            <div>
                              <Label htmlFor="hotspotType">Type</Label>
                              <Select
                                value={hotspot.type}
                                onValueChange={(value) => {
                                  setHotspots(hotspots.map(h => {
                                    if (h.id === hotspot.id) {
                                      return { ...h, type: value as 'text' | 'link' | 'image' | 'video' };
                                    }
                                    return h;
                                  }));
                                }}
                              >
                                <SelectTrigger id="hotspotType" className="mt-1">
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="text">Text</SelectItem>
                                  <SelectItem value="link">Link</SelectItem>
                                  <SelectItem value="image">Image</SelectItem>
                                  <SelectItem value="video">Video</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div>
                              <Label htmlFor="hotspotContent">Content</Label>
                              <Input
                                id="hotspotContent"
                                value={hotspot.content}
                                onChange={(e) => updateHotspotContent(hotspot.id, e.target.value)}
                                className="mt-1"
                              />
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Switch
                                id="hotspotVisible"
                                checked={hotspot.visible}
                                onCheckedChange={(checked) => {
                                  setHotspots(hotspots.map(h => {
                                    if (h.id === hotspot.id) {
                                      return { ...h, visible: checked };
                                    }
                                    return h;
                                  }));
                                }}
                              />
                              <Label htmlFor="hotspotVisible">Visible by default</Label>
                            </div>
                            
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deleteHotspot(hotspot.id)}
                            >
                              Delete Hotspot
                            </Button>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {isAddingHotspot 
                      ? 'Click on the image to place a new hotspot' 
                      : 'Select a hotspot to edit its properties'}
                  </p>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="qr" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="qrCodeData">QR Code Content</Label>
                <div className="mt-1">
                  <Input
                    id="qrCodeData"
                    value={qrCodeData}
                    onChange={(e) => setQrCodeData(e.target.value)}
                    placeholder="Enter URL or text for QR code"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    This can be a URL, text, or contact information that the QR code will encode.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col items-center justify-center">
                {qrCodeData ? (
                  <div className="text-center">
                    {/* In a real app, generate an actual QR code */}
                    <div className="w-32 h-32 border-2 mx-auto mb-2 bg-gray-100 flex items-center justify-center">
                      <QrCode className="h-16 w-16 text-gray-400" />
                    </div>
                    <p className="text-sm">QR Code Preview</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Enter QR code content to generate a preview
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="border rounded-lg p-4 bg-blue-50 text-blue-800">
              <h3 className="text-sm font-medium mb-2">About QR Codes on Cards</h3>
              <p className="text-xs">
                QR codes can enhance your cards by providing:
              </p>
              <ul className="text-xs list-disc list-inside space-y-1 mt-2">
                <li>Links to exclusive digital content</li>
                <li>Authentication verification</li>
                <li>Artist profiles and portfolios</li>
                <li>Video content related to the card</li>
                <li>Interactive experiences</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <div>
        <div className="bg-white rounded-lg border p-4 shadow-sm sticky top-4">
          <h3 className="font-medium mb-4">Card Preview</h3>
          
          <div 
            className={`relative mx-auto aspect-[2.5/3.5] max-w-[300px] overflow-hidden`}
            style={{
              borderRadius: `${cardStyle.borderRadius}px`,
              border: cardStyle.borderWidth ? `${cardStyle.borderWidth}px solid ${cardStyle.borderColor}` : 'none',
              backgroundColor: cardStyle.backgroundColor
            }}
          >
            {imageUrl && (
              <img 
                src={imageUrl}
                alt="Card preview"
                className="w-full h-full object-cover"
              />
            )}
            
            {cardStyle.showOverlay && (
              <div 
                className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4"
                style={{ color: cardStyle.textColor }}
              >
                <h3 
                  className={`font-bold text-lg mb-1 ${cardStyle.textShadow ? 'text-shadow' : ''}`}
                >
                  {title || 'Card Title'}
                </h3>
                
                {cardNumber && (
                  <p className={`text-xs ${cardStyle.textShadow ? 'text-shadow' : ''}`}>
                    {cardNumber}
                  </p>
                )}
              </div>
            )}
            
            {qrCodeData && (
              <div className="absolute top-2 right-2 bg-white rounded-md p-1 shadow">
                <QrCode className="h-5 w-5" />
              </div>
            )}
            
            {artistInfo.showLogo && artistInfo.logoUrl && (
              <div className="absolute top-2 left-2">
                <img 
                  src={artistInfo.logoUrl} 
                  alt="Artist Logo" 
                  className="h-8 w-8 object-contain"
                />
              </div>
            )}
            
            {artistInfo.showSignature && artistInfo.signatureUrl && (
              <div className="absolute bottom-16 right-4">
                <img 
                  src={artistInfo.signatureUrl} 
                  alt="Artist Signature" 
                  className="h-8 object-contain"
                />
              </div>
            )}
          </div>
          
          <div className="flex justify-center mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              className="mr-2"
            >
              <Maximize2 className="h-4 w-4 mr-1" />
              Full Preview
            </Button>
          </div>
          
          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Title:</span>
              <span className="font-medium truncate max-w-[150px]">{title || 'Not set'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Rarity:</span>
              <span className="font-medium">{rarity.charAt(0).toUpperCase() + rarity.slice(1)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Card Number:</span>
              <span className="font-medium">{cardNumber || 'Not set'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Edition Size:</span>
              <span className="font-medium">{editionSize}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Series:</span>
              <span className="font-medium truncate max-w-[150px]">
                {sampleSeries.find(s => s.id === seriesId)?.name || 'None'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Template:</span>
              <span className="font-medium">
                {cardTemplates.find(t => t.id === activeTemplate)?.name || 'Standard'}
              </span>
            </div>
          </div>
          
          <Button className="w-full mt-6" onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save Card
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CardDesigner;

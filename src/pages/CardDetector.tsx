
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { 
  CropIcon, 
  ChevronRight, 
  Upload, 
  SaveAll, 
  X, 
  Users, 
  UserRound,
  Ticket,
  FileText,
  CreditCard,
  PenTool,
  ImageIcon,
  SlidersHorizontal
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ImageEditor } from '@/components/card-upload';
import { useCards } from '@/context/CardContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OaklandMemorySearch } from '@/components/oakland/gallery';
import { MemorabiliaType } from '@/components/card-upload/cardDetection';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const CardDetector = () => {
  const [showEditor, setShowEditor] = useState(false);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [editorImage, setEditorImage] = useState<string | null>(null);
  const [detectionMode, setDetectionMode] = useState<'individual' | 'group'>('individual');
  const [searchTerm, setSearchTerm] = useState('');
  const [autoEnhance, setAutoEnhance] = useState(true);
  const [memorabiliaTypes, setMemorabiliaTypes] = useState<{[key in MemorabiliaType]: boolean}>({
    card: true,
    ticket: true,
    photo: true,
    program: true,
    autograph: true,
    face: true,
    unknown: true
  });
  const { addCard } = useCards();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (file.type.startsWith('image/')) {
      setCurrentFile(file);
      const imageUrl = URL.createObjectURL(file);
      setEditorImage(imageUrl);
      setShowEditor(true);
    } else {
      toast.error('Please upload an image file');
    }
  };

  const handleCropComplete = (croppedFile: File, croppedUrl: string, memorabiliaType?: MemorabiliaType) => {
    // Get appropriate description based on memorabilia type
    const getDescription = () => {
      switch (memorabiliaType) {
        case 'ticket':
          return 'Ticket stub detected with Card Detector';
        case 'program':
          return 'Program/scorecard detected with Card Detector';
        case 'autograph':
          return 'Autographed item detected with Card Detector';
        case 'card':
          return 'Baseball card detected with Card Detector';
        case 'face':
          return detectionMode === 'group' 
            ? 'Person detected from group photo with Card Detector'
            : 'Person detected with Card Detector';
        case 'photo':
          return 'Photo detected with Card Detector';
        default:
          return 'Item detected with Card Detector';
      }
    };

    // Get appropriate tags based on memorabilia type
    const getTags = () => {
      const tags = ['card detector', 'auto-detected'];
      
      if (memorabiliaType) {
        tags.push(memorabiliaType);
      }
      
      if (detectionMode === 'group') {
        tags.push('group photo');
      }
      
      if (autoEnhance) {
        tags.push('enhanced');
      }
      
      return tags;
    };
    
    // Create card object matching the expected Card type structure
    const newCard = {
      title: croppedFile.name.split('.')[0] || getDefaultTitle(memorabiliaType),
      description: getDescription(),
      imageUrl: croppedUrl,
      thumbnailUrl: croppedUrl,
      tags: getTags(),
      userId: 'dev-user-id',
      isPublic: false
    };

    addCard(newCard);
    
    toast.success('Card added to your gallery!', {
      description: 'Your detected item has been successfully added'
    });
  };

  const getDefaultTitle = (type?: MemorabiliaType) => {
    switch (type) {
      case 'ticket': return 'Ticket Stub';
      case 'program': return 'Program/Scorecard';
      case 'autograph': return 'Autographed Item';
      case 'card': return 'Baseball Card';
      case 'face': return 'Person';
      case 'photo': return 'Photo';
      default: return 'New Card';
    }
  };

  const handleBatchProcessing = (files: File[], urls: string[], types?: MemorabiliaType[]) => {
    if (files.length === 0) return;
    
    let processedCount = 0;
    
    files.forEach((file, index) => {
      const itemType = types?.[index] || 'unknown';
      
      const newCard = {
        title: `${getDefaultTitle(itemType)} ${index + 1}`,
        description: `${getDefaultTitle(itemType)} detected from batch processing with Card Detector`,
        imageUrl: urls[index],
        thumbnailUrl: urls[index],
        tags: ['card detector', 'batch processed', itemType, 'auto-detected'],
        userId: 'dev-user-id',
        isPublic: false
      };

      addCard(newCard).then(() => {
        processedCount++;
        if (processedCount === files.length) {
          toast.success(`${files.length} items added to your gallery!`);
        }
      });
    });
  };

  const toggleMemorabiliaType = (type: MemorabiliaType) => {
    setMemorabiliaTypes(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 pt-16 pb-24">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex items-center text-sm text-gray-500 py-4">
            <Link to="/" className="hover:text-cardshow-blue">Home</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-cardshow-dark font-medium">Card Detector</span>
          </div>
          
          <div className="py-6">
            <div className="flex items-center gap-3 mb-2">
              <CropIcon className="h-6 w-6 text-cardshow-blue" />
              <h1 className="text-3xl font-bold text-cardshow-dark">Card Detector</h1>
            </div>
            <p className="text-cardshow-slate mb-8">
              Upload an image to automatically detect, enhance, and crop items like ticket stubs, 
              baseball cards, programs, or autographs
            </p>
            
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
              <Tabs defaultValue="upload" className="w-full">
                <TabsList className="mb-6 grid w-full grid-cols-2">
                  <TabsTrigger value="upload">Upload & Detect</TabsTrigger>
                  <TabsTrigger value="settings">Detection Settings</TabsTrigger>
                </TabsList>
                
                <TabsContent value="upload">
                  {!showEditor ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="bg-blue-50 p-6 rounded-full mb-6">
                        <Upload className="h-12 w-12 text-cardshow-blue" />
                      </div>
                      <h2 className="text-xl font-semibold mb-2">
                        Upload an image with {detectionMode === 'group' ? 'people' : 'memorabilia or cards'}
                      </h2>
                      <p className="text-cardshow-slate text-center max-w-md mb-6">
                        {detectionMode === 'group' 
                          ? "Upload a group photo, and we'll automatically detect faces and let you create cards for each person."
                          : "Upload an image containing memorabilia like ticket stubs, baseball cards, programs, or autographs, and we'll automatically detect and enhance them for you."}
                      </p>
                      <Button
                        size="lg"
                        className="relative"
                        onClick={() => document.getElementById('card-upload')?.click()}
                      >
                        {detectionMode === 'group' ? 'Upload Group Photo' : 'Select Image'}
                        <input
                          id="card-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </Button>
                    </div>
                  ) : (
                    <div className="py-6">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">
                          {detectionMode === 'group' ? 'Detected People' : 'Detected Items'}
                        </h2>
                        <Button 
                          variant="outline" 
                          onClick={() => document.getElementById('card-upload')?.click()}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Another Image
                          <input
                            id="card-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                          />
                        </Button>
                      </div>
                      
                      <div className="text-sm text-cardshow-slate mb-4">
                        <p>Use the editor to adjust the selection boxes around each detected {detectionMode === 'group' ? 'person' : 'item'}.</p>
                      </div>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="settings">
                  <div className="space-y-6 py-4">
                    {/* Detection Mode Selection */}
                    <div>
                      <h3 className="text-lg font-medium mb-3">Detection Mode</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div 
                          className={`flex flex-col items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            detectionMode === 'individual' 
                              ? 'border-cardshow-blue bg-blue-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setDetectionMode('individual')}
                        >
                          <CreditCard className={`h-8 w-8 mb-2 ${detectionMode === 'individual' ? 'text-cardshow-blue' : 'text-gray-400'}`} />
                          <h4 className="font-medium">Memorabilia Mode</h4>
                          <p className="text-xs text-center text-gray-500 mt-1">
                            Best for ticket stubs, cards, programs, and autographs
                          </p>
                        </div>
                        <div 
                          className={`flex flex-col items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            detectionMode === 'group' 
                              ? 'border-cardshow-blue bg-blue-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setDetectionMode('group')}
                        >
                          <Users className={`h-8 w-8 mb-2 ${detectionMode === 'group' ? 'text-cardshow-blue' : 'text-gray-400'}`} />
                          <h4 className="font-medium">Group Mode</h4>
                          <p className="text-xs text-center text-gray-500 mt-1">Best for photos with multiple people</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Memorabilia Types */}
                    {detectionMode === 'individual' && (
                      <div>
                        <h3 className="text-lg font-medium mb-3">Memorabilia Types to Detect</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-start space-x-2">
                            <Checkbox 
                              id="detect-cards" 
                              checked={memorabiliaTypes.card}
                              onCheckedChange={() => toggleMemorabiliaType('card')}
                            />
                            <div className="grid gap-1.5 leading-none">
                              <Label 
                                htmlFor="detect-cards" 
                                className="flex items-center gap-2 font-medium text-sm cursor-pointer"
                              >
                                <CreditCard className="h-4 w-4" /> Baseball Cards
                              </Label>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-2">
                            <Checkbox 
                              id="detect-tickets" 
                              checked={memorabiliaTypes.ticket}
                              onCheckedChange={() => toggleMemorabiliaType('ticket')}
                            />
                            <div className="grid gap-1.5 leading-none">
                              <Label 
                                htmlFor="detect-tickets" 
                                className="flex items-center gap-2 font-medium text-sm cursor-pointer"
                              >
                                <Ticket className="h-4 w-4" /> Ticket Stubs
                              </Label>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-2">
                            <Checkbox 
                              id="detect-programs" 
                              checked={memorabiliaTypes.program}
                              onCheckedChange={() => toggleMemorabiliaType('program')}
                            />
                            <div className="grid gap-1.5 leading-none">
                              <Label 
                                htmlFor="detect-programs" 
                                className="flex items-center gap-2 font-medium text-sm cursor-pointer"
                              >
                                <FileText className="h-4 w-4" /> Programs & Scorecards
                              </Label>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-2">
                            <Checkbox 
                              id="detect-autographs" 
                              checked={memorabiliaTypes.autograph}
                              onCheckedChange={() => toggleMemorabiliaType('autograph')}
                            />
                            <div className="grid gap-1.5 leading-none">
                              <Label 
                                htmlFor="detect-autographs" 
                                className="flex items-center gap-2 font-medium text-sm cursor-pointer"
                              >
                                <PenTool className="h-4 w-4" /> Autographed Items
                              </Label>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Enhancement settings */}
                    <div>
                      <h3 className="text-lg font-medium mb-3">Enhancement Settings</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-sm font-medium">Auto-enhance detected items</Label>
                            <p className="text-xs text-slate-500">
                              Automatically improve image quality based on item type
                            </p>
                          </div>
                          <Switch
                            checked={autoEnhance}
                            onCheckedChange={setAutoEnhance}
                          />
                        </div>
                        
                        {autoEnhance && (
                          <div className="pl-2 border-l-2 border-blue-100 mt-2 space-y-2">
                            <div className="flex items-center gap-2 text-xs text-slate-600">
                              <SlidersHorizontal className="h-3 w-3" />
                              <span>Restore faded colors on baseball cards</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-600">
                              <SlidersHorizontal className="h-3 w-3" />
                              <span>Enhance contrast on ticket stubs</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-600">
                              <SlidersHorizontal className="h-3 w-3" />
                              <span>Improve text legibility on programs</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-600">
                              <SlidersHorizontal className="h-3 w-3" />
                              <span>Optimize autograph visibility</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Naming Template */}
                    <div>
                      <h3 className="text-lg font-medium mb-3">Naming Template</h3>
                      <OaklandMemorySearch 
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        placeholder={detectionMode === 'group' ? "Person {index} - {date}" : "{type} {index} - {date}"}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Use {'{index}'} for numbering, {'{date}'} for today's date, and {'{type}'} for detected item type
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <ImageEditor
        showEditor={showEditor}
        setShowEditor={setShowEditor}
        editorImage={editorImage}
        currentFile={currentFile}
        onCropComplete={handleCropComplete}
        batchProcessingMode={detectionMode === 'group'}
        onBatchProcessComplete={handleBatchProcessing}
        enabledMemorabiliaTypes={Object.entries(memorabiliaTypes)
          .filter(([_, enabled]) => enabled)
          .map(([type]) => type as MemorabiliaType)}
        autoEnhance={autoEnhance}
      />
    </div>
  );
};

export default CardDetector;


import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ProgressSteps } from '@/components/ui/progress-steps';
import { toast } from 'sonner';
import { useCards } from '@/context/CardContext';
import { 
  ChevronRight, 
  ArrowLeft, 
  ArrowRight, 
  Package, 
  Image, 
  Lock, 
  Check,
  X
} from 'lucide-react';
import { Card } from '@/lib/types';
import CardItem from '@/components/CardItem';
import { 
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle
} from '@/components/ui/resizable';
import { Progress } from '@/components/ui/progress';

const MemoryPackCreator = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = id !== undefined && id !== 'new';
  
  // State for the pack creation process
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [packData, setPackData] = useState({
    name: '',
    description: '',
    wrapperColor: '#3b82f6',
    wrapperPattern: 'solid',
    isPublic: false,
    allowComments: true
  });
  
  const { cards, collections, addCollection, updateCollection } = useCards();
  const [loading, setLoading] = useState(false);
  
  const steps = [
    "Select Cards",
    "Design Pack",
    "Add Details",
    "Review & Share"
  ];
  
  // Load existing pack data if editing
  useEffect(() => {
    if (isEditMode && id) {
      const existingCollection = collections.find(c => c.id === id);
      if (existingCollection) {
        setPackData({
          name: existingCollection.name,
          description: existingCollection.description || '',
          wrapperColor: existingCollection?.designMetadata?.wrapperColor || '#3b82f6',
          wrapperPattern: existingCollection?.designMetadata?.wrapperPattern || 'solid',
          isPublic: existingCollection?.visibility === 'public',
          allowComments: existingCollection?.allowComments !== false
        });
        
        // Get cards in this collection
        const collectionCards = cards.filter(card => card.collectionId === id);
        setSelectedCards(collectionCards.map(card => card.id));
      } else {
        toast.error('Memory Pack not found');
        navigate('/packs');
      }
    }
  }, [isEditMode, id, collections, cards, navigate]);
  
  const handleCardSelection = (cardId: string) => {
    setSelectedCards(prev => 
      prev.includes(cardId) 
        ? prev.filter(id => id !== cardId) 
        : [...prev, cardId]
    );
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPackData(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePatternChange = (pattern: string) => {
    setPackData(prev => ({ ...prev, wrapperPattern: pattern }));
  };
  
  const handleVisibilityChange = (isPublic: boolean) => {
    setPackData(prev => ({ ...prev, isPublic }));
  };
  
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPackData(prev => ({ ...prev, wrapperColor: e.target.value }));
  };
  
  const goToNextStep = () => {
    if (currentStep === 0 && selectedCards.length === 0) {
      toast.error('Please select at least one card for your pack');
      return;
    }
    
    if (currentStep === 2 && !packData.name) {
      toast.error('Please enter a name for your pack');
      return;
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const savePack = async () => {
    try {
      setLoading(true);
      
      // Prepare collection data
      const collectionData = {
        name: packData.name,
        description: packData.description,
        designMetadata: {
          wrapperColor: packData.wrapperColor,
          wrapperPattern: packData.wrapperPattern,
          packType: 'memory-pack'
        },
        visibility: packData.isPublic ? 'public' : 'private',
        allowComments: packData.allowComments
      };
      
      let collectionId;
      
      if (isEditMode && id) {
        // Update existing collection/pack
        await updateCollection(id, collectionData);
        collectionId = id;
        toast.success('Memory Pack updated successfully');
      } else {
        // Create new collection/pack
        const newCollection = await addCollection(collectionData);
        collectionId = newCollection?.id;
        toast.success('Memory Pack created successfully');
      }
      
      // If successful, update cards to associate with this collection
      if (collectionId) {
        // Add selected cards to collection
        const promises = selectedCards.map(cardId => {
          const card = cards.find(c => c.id === cardId);
          if (card && card.collectionId !== collectionId) {
            return { cardId, collectionId };
          }
          return null;
        }).filter(Boolean);
        
        // Navigate to the pack detail view
        navigate(`/packs/${collectionId}`);
      }
      
    } catch (error) {
      console.error('Error saving pack:', error);
      toast.error('Failed to save Memory Pack');
    } finally {
      setLoading(false);
    }
  };
  
  // Get available cards (not already in other packs)
  const availableCards = cards.filter(card => 
    !card.collectionId || card.collectionId === id || selectedCards.includes(card.id)
  );
  
  // Get selected card objects
  const selectedCardObjects = cards.filter(card => 
    selectedCards.includes(card.id)
  );
  
  // Render different content based on the current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Select Cards
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Select Cards for Your Memory Pack</h2>
            <p className="text-gray-500">
              Choose the cards you want to include in this memory pack. Click a card to select or deselect it.
            </p>
            
            {availableCards.length === 0 ? (
              <div className="text-center p-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500 mb-4">You don't have any cards to add to a pack yet.</p>
                <Button onClick={() => navigate('/editor')}>Create a Card</Button>
              </div>
            ) : (
              <>
                <div className="pb-4 border-b mb-4">
                  <p className="text-sm text-cardshow-slate">
                    {selectedCards.length} {selectedCards.length === 1 ? 'card' : 'cards'} selected
                  </p>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {availableCards.map(card => (
                    <div 
                      key={card.id} 
                      className={`relative cursor-pointer transition-all ${
                        selectedCards.includes(card.id) 
                          ? 'ring-2 ring-cardshow-blue' 
                          : 'hover:opacity-90'
                      }`}
                      onClick={() => handleCardSelection(card.id)}
                    >
                      <div className="aspect-[2.5/3.5] rounded overflow-hidden">
                        <img 
                          src={card.thumbnailUrl || card.imageUrl} 
                          alt={card.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {selectedCards.includes(card.id) && (
                        <div className="absolute top-2 right-2 bg-cardshow-blue text-white rounded-full w-6 h-6 flex items-center justify-center">
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        );
        
      case 1: // Design Pack
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Design Your Pack Wrapper</h2>
            <p className="text-gray-500">
              Customize how your memory pack will look when shared or displayed in your collection.
            </p>
            
            <ResizablePanelGroup direction="horizontal">
              <ResizablePanel defaultSize={60} minSize={30}>
                <div className="p-4 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Wrapper Color
                    </label>
                    <div className="flex gap-3">
                      <Input 
                        type="color" 
                        value={packData.wrapperColor}
                        onChange={handleColorChange}
                        className="w-12 h-10" 
                      />
                      <Input 
                        type="text" 
                        value={packData.wrapperColor}
                        onChange={handleColorChange}
                        className="flex-1" 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pattern Style
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {['solid', 'striped', 'dotted', 'gradient', 'zigzag', 'checker'].map(pattern => (
                        <div
                          key={pattern}
                          className={`border rounded-lg p-3 text-center cursor-pointer ${
                            packData.wrapperPattern === pattern 
                              ? 'border-cardshow-blue bg-blue-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => handlePatternChange(pattern)}
                        >
                          <div 
                            className={`h-10 mb-2 rounded ${
                              pattern === 'striped' ? 'bg-striped' :
                              pattern === 'dotted' ? 'bg-dotted' :
                              pattern === 'gradient' ? 'bg-gradient-to-r' :
                              pattern === 'zigzag' ? 'bg-zigzag' :
                              pattern === 'checker' ? 'bg-checker' :
                              ''
                            }`}
                            style={{
                              backgroundColor: pattern === 'solid' ? packData.wrapperColor : undefined,
                              backgroundImage: pattern === 'gradient' 
                                ? `linear-gradient(to right, ${packData.wrapperColor}, white)` 
                                : undefined,
                              backgroundSize: pattern === 'dotted' || pattern === 'checker' ? '20px 20px' : undefined
                            }}
                          ></div>
                          <span className="text-xs capitalize">{pattern}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ResizablePanel>
              
              <ResizableHandle withHandle />
              
              <ResizablePanel defaultSize={40} minSize={30}>
                <div className="p-4">
                  <h3 className="text-sm font-medium mb-4">Pack Preview</h3>
                  
                  <div 
                    className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-lg"
                    style={{
                      backgroundColor: packData.wrapperPattern === 'solid' ? packData.wrapperColor : undefined,
                      backgroundImage: packData.wrapperPattern === 'gradient' 
                        ? `linear-gradient(to right, ${packData.wrapperColor}, white)` 
                        : undefined
                    }}
                  >
                    {/* Pack cover design */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                      <div className="font-bold text-lg text-white text-shadow">
                        {packData.name || "Memory Pack"}
                      </div>
                      
                      {/* Card stack preview */}
                      <div className="mt-4 relative">
                        {selectedCardObjects.slice(0, 3).map((card, idx, arr) => (
                          <div 
                            key={card.id}
                            className="absolute rounded shadow-md overflow-hidden"
                            style={{
                              width: '60px',
                              height: '84px',
                              transform: `rotate(${(idx - arr.length / 2 + 0.5) * 10}deg)`,
                              zIndex: arr.length - idx,
                              top: idx * 5,
                              left: idx * 5
                            }}
                          >
                            <img 
                              src={card.thumbnailUrl || card.imageUrl} 
                              alt={card.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-12 text-sm text-white text-shadow">
                        {selectedCards.length} {selectedCards.length === 1 ? 'card' : 'cards'}
                      </div>
                    </div>
                  </div>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        );
        
      case 2: // Add Details
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Pack Details</h2>
            <p className="text-gray-500">
              Add a title, description, and set visibility options for your memory pack.
            </p>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Pack Name <span className="text-red-500">*</span>
                </label>
                <Input
                  id="name"
                  name="name"
                  value={packData.name}
                  onChange={handleInputChange}
                  placeholder="Enter a name for your memory pack"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <Textarea
                  id="description"
                  name="description"
                  value={packData.description}
                  onChange={handleInputChange}
                  placeholder="Describe what makes this collection of memories special"
                  rows={4}
                />
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="text-lg font-medium mb-3">Visibility Settings</h3>
                
                <div className="flex flex-col gap-4">
                  <div 
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer ${
                      packData.isPublic 
                        ? 'border-cardshow-blue bg-blue-50' 
                        : 'border-gray-200'
                    }`}
                    onClick={() => handleVisibilityChange(true)}
                  >
                    <div className="flex items-center">
                      <div className={`p-2 rounded-full ${packData.isPublic ? 'bg-blue-100' : 'bg-gray-100'}`}>
                        <Image className={`h-5 w-5 ${packData.isPublic ? 'text-cardshow-blue' : 'text-gray-400'}`} />
                      </div>
                      <div className="ml-3">
                        <p className="font-medium">Public</p>
                        <p className="text-xs text-gray-500">Anyone can view this pack</p>
                      </div>
                    </div>
                    {packData.isPublic && <Check className="h-5 w-5 text-cardshow-blue" />}
                  </div>
                  
                  <div 
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer ${
                      !packData.isPublic 
                        ? 'border-cardshow-blue bg-blue-50' 
                        : 'border-gray-200'
                    }`}
                    onClick={() => handleVisibilityChange(false)}
                  >
                    <div className="flex items-center">
                      <div className={`p-2 rounded-full ${!packData.isPublic ? 'bg-blue-100' : 'bg-gray-100'}`}>
                        <Lock className={`h-5 w-5 ${!packData.isPublic ? 'text-cardshow-blue' : 'text-gray-400'}`} />
                      </div>
                      <div className="ml-3">
                        <p className="font-medium">Private</p>
                        <p className="text-xs text-gray-500">Only you can view this pack</p>
                      </div>
                    </div>
                    {!packData.isPublic && <Check className="h-5 w-5 text-cardshow-blue" />}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 3: // Review & Share
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Review & Share Your Memory Pack</h2>
            <p className="text-gray-500">
              Review your memory pack details before saving and sharing.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div>
                <h3 className="text-sm uppercase text-gray-500">Pack Name</h3>
                <p className="font-medium">{packData.name || "Untitled Pack"}</p>
              </div>
              
              {packData.description && (
                <div>
                  <h3 className="text-sm uppercase text-gray-500">Description</h3>
                  <p>{packData.description}</p>
                </div>
              )}
              
              <div>
                <h3 className="text-sm uppercase text-gray-500">Contents</h3>
                <p>{selectedCards.length} {selectedCards.length === 1 ? 'card' : 'cards'} selected</p>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedCardObjects.slice(0, 5).map(card => (
                    <div 
                      key={card.id}
                      className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow"
                    >
                      <img 
                        src={card.thumbnailUrl || card.imageUrl} 
                        alt={card.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                  
                  {selectedCards.length > 5 && (
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600 font-medium border-2 border-white">
                      +{selectedCards.length - 5}
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm uppercase text-gray-500">Visibility</h3>
                <p className="flex items-center">
                  {packData.isPublic ? (
                    <>
                      <Image className="h-4 w-4 mr-1 text-gray-500" />
                      <span>Public</span>
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 mr-1 text-gray-500" />
                      <span>Private</span>
                    </>
                  )}
                </p>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                Ready to save your memory pack? Click "Save Pack" below to create it.
                You can edit or update it anytime.
              </p>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto max-w-6xl px-4 pt-16 pb-24">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 py-4 mt-4">
          <Link to="/" className="hover:text-cardshow-blue">Home</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link to="/collections" className="hover:text-cardshow-blue">Collections</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-cardshow-dark font-medium">
            {isEditMode ? 'Edit Memory Pack' : 'Create Memory Pack'}
          </span>
        </div>
        
        <div className="py-6">
          <div className="flex items-center gap-3 mb-2">
            <Package className="h-6 w-6 text-cardshow-blue" />
            <h1 className="text-3xl font-bold text-cardshow-dark">
              {isEditMode ? 'Edit Memory Pack' : 'Create Memory Pack'}
            </h1>
          </div>
          <p className="text-cardshow-slate">
            Bundle your cards into themed memory packs with custom wrappers and descriptions
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
          <ProgressSteps 
            steps={steps} 
            currentStep={currentStep}
            className="mb-8" 
          />
          
          <div className="py-6">
            {renderStepContent()}
          </div>
          
          <div className="flex justify-between items-center pt-8 border-t">
            <Button
              variant="outline"
              disabled={currentStep === 0}
              onClick={goToPreviousStep}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            
            {currentStep < steps.length - 1 ? (
              <Button
                onClick={goToNextStep}
                disabled={currentStep === 0 && selectedCards.length === 0}
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                disabled={loading || !packData.name || selectedCards.length === 0}
                onClick={savePack}
              >
                {loading ? (
                  <span>Saving...</span>
                ) : (
                  <>
                    <Package className="h-4 w-4 mr-2" />
                    Save Pack
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MemoryPackCreator;

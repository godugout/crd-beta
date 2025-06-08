
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shuffle, Save, Settings, Palette, Lightbulb } from 'lucide-react';
import { useCards } from '@/context/CardContext';
import { toast } from 'sonner';
import Card3DRenderer from '@/components/card-viewer/Card3DRenderer';

// Sample templates with quick preview data
const quickTemplates = [
  { id: 'chrome', name: 'Chrome', preview: 'https://images.unsplash.com/photo-1518770660439-4636190af475', effects: ['Chrome'] },
  { id: 'vintage', name: 'Vintage', preview: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4', effects: ['Vintage'] },
  { id: 'hologram', name: 'Hologram', preview: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43', effects: ['Hologram'] },
  { id: 'neon', name: 'Neon', preview: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab', effects: ['Neon'] },
];

// Environment presets
const environments = [
  { id: 'studio', name: 'Studio', preset: 'studio' },
  { id: 'sunset', name: 'Sunset', preset: 'sunset' },
  { id: 'warehouse', name: 'Warehouse', preset: 'warehouse' },
  { id: 'forest', name: 'Forest', preset: 'forest' },
];

// Style variations
const styleVariations = [
  'Classic', 'Modern', 'Retro', 'Futuristic', 'Minimal', 'Bold'
];

const StreamlinedCardCreator: React.FC = () => {
  const navigate = useNavigate();
  const { addCard } = useCards();
  
  // State for the live card preview
  const [currentCard, setCurrentCard] = useState({
    id: 'preview-card',
    title: 'Your Amazing Card',
    description: 'Start customizing to make it yours',
    imageUrl: quickTemplates[0].preview,
    thumbnailUrl: quickTemplates[0].preview,
    userId: 'user',
    tags: [],
    effects: quickTemplates[0].effects,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    designMetadata: {
      cardStyle: {
        template: quickTemplates[0].id,
        effect: 'chrome',
        borderRadius: '8px',
        borderColor: '#000000',
      }
    },
    layers: []
  });

  const [selectedTemplate, setSelectedTemplate] = useState(quickTemplates[0]);
  const [selectedEnvironment, setSelectedEnvironment] = useState(environments[0]);
  const [selectedStyle, setSelectedStyle] = useState(styleVariations[0]);
  const [autoRotate, setAutoRotate] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);

  // Apply random style on load
  useEffect(() => {
    const randomStyle = styleVariations[Math.floor(Math.random() * styleVariations.length)];
    setSelectedStyle(randomStyle);
  }, []);

  const handleTemplateChange = (template: typeof quickTemplates[0]) => {
    setSelectedTemplate(template);
    setCurrentCard(prev => ({
      ...prev,
      imageUrl: template.preview,
      thumbnailUrl: template.preview,
      effects: template.effects,
      designMetadata: {
        ...prev.designMetadata,
        cardStyle: {
          ...prev.designMetadata?.cardStyle,
          template: template.id,
          effect: template.effects[0]?.toLowerCase()
        }
      }
    }));
    toast.success(`Applied ${template.name} template`);
  };

  const handleRandomizeStyle = () => {
    const randomTemplate = quickTemplates[Math.floor(Math.random() * quickTemplates.length)];
    const randomEnvironment = environments[Math.floor(Math.random() * environments.length)];
    const randomStyle = styleVariations[Math.floor(Math.random() * styleVariations.length)];
    
    setSelectedTemplate(randomTemplate);
    setSelectedEnvironment(randomEnvironment);
    setSelectedStyle(randomStyle);
    
    handleTemplateChange(randomTemplate);
    toast.success('🎲 Randomized your card style!');
  };

  const handleSaveCard = async () => {
    try {
      const cardData = {
        title: currentCard.title,
        description: currentCard.description,
        imageUrl: currentCard.imageUrl,
        thumbnailUrl: currentCard.thumbnailUrl,
        tags: [selectedTemplate.name, selectedStyle, selectedEnvironment.name],
        metadata: {
          template: selectedTemplate.id,
          environment: selectedEnvironment.id,
          style: selectedStyle
        },
        designMetadata: currentCard.designMetadata,
        effects: currentCard.effects,
        layers: currentCard.layers || [],
      };

      await addCard(cardData);
      toast.success('Card saved successfully! 🔥');
      navigate('/gallery');
    } catch (error) {
      console.error('Error saving card:', error);
      toast.error('Failed to save card. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex">
      {/* Main 3D Preview Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Controls */}
        <div className="p-4 bg-black/20 backdrop-blur-sm border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSidebar(!showSidebar)}
                className="text-white hover:bg-white/10"
              >
                <Settings className="h-4 w-4 mr-2" />
                {showSidebar ? 'Hide' : 'Show'} Controls
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAutoRotate(!autoRotate)}
                className="text-white hover:bg-white/10"
              >
                <Lightbulb className="h-4 w-4 mr-2" />
                {autoRotate ? 'Stop' : 'Start'} Rotation
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRandomizeStyle}
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Shuffle className="h-4 w-4 mr-2" />
                Randomize
              </Button>
              
              <Button
                onClick={handleSaveCard}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Card
              </Button>
            </div>
          </div>
        </div>

        {/* 3D Card Preview */}
        <div className="flex-1 relative">
          <Canvas
            camera={{ position: [0, 0, 5], fov: 50 }}
            style={{ background: 'transparent' }}
          >
            <Environment preset={selectedEnvironment.preset as any} />
            <ambientLight intensity={0.6} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            
            <Card3DRenderer 
              card={currentCard as any}
              isFlipped={false}
              activeEffects={currentCard.effects}
              effectIntensities={{}}
            />
            
            <OrbitControls 
              enablePan={false}
              enableZoom={true}
              minDistance={3}
              maxDistance={8}
              autoRotate={autoRotate}
              autoRotateSpeed={1}
            />
          </Canvas>
          
          {/* Style Badge */}
          <div className="absolute top-4 left-4">
            <Badge variant="secondary" className="bg-black/50 text-white border-white/20">
              {selectedStyle} • {selectedTemplate.name} • {selectedEnvironment.name}
            </Badge>
          </div>
        </div>
      </div>

      {/* Customization Sidebar */}
      {showSidebar && (
        <div className="w-80 bg-black/40 backdrop-blur-md border-l border-white/10 p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Templates */}
            <div>
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Templates
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {quickTemplates.map((template) => (
                  <Card
                    key={template.id}
                    className={`cursor-pointer transition-all hover:scale-105 ${
                      selectedTemplate.id === template.id
                        ? 'ring-2 ring-blue-500 bg-blue-900/20'
                        : 'bg-gray-800/50 hover:bg-gray-700/50'
                    }`}
                    onClick={() => handleTemplateChange(template)}
                  >
                    <CardContent className="p-3">
                      <div className="aspect-[3/4] bg-gray-600 rounded mb-2 overflow-hidden">
                        <img 
                          src={template.preview} 
                          alt={template.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-white text-xs text-center">{template.name}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Environments */}
            <div>
              <h3 className="text-white font-semibold mb-3">Environments</h3>
              <div className="grid grid-cols-2 gap-2">
                {environments.map((env) => (
                  <Button
                    key={env.id}
                    variant={selectedEnvironment.id === env.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedEnvironment(env)}
                    className={`${
                      selectedEnvironment.id === env.id
                        ? 'bg-blue-600 text-white'
                        : 'border-white/20 text-white hover:bg-white/10'
                    }`}
                  >
                    {env.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Styles */}
            <div>
              <h3 className="text-white font-semibold mb-3">Styles</h3>
              <div className="grid grid-cols-2 gap-2">
                {styleVariations.map((style) => (
                  <Button
                    key={style}
                    variant={selectedStyle === style ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedStyle(style)}
                    className={`${
                      selectedStyle === style
                        ? 'bg-blue-600 text-white'
                        : 'border-white/20 text-white hover:bg-white/10'
                    }`}
                  >
                    {style}
                  </Button>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-4 border-t border-white/10">
              <Button
                onClick={handleRandomizeStyle}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white mb-3"
              >
                <Shuffle className="h-4 w-4 mr-2" />
                Surprise Me!
              </Button>
              
              <Button
                onClick={handleSaveCard}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                Save & Continue
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StreamlinedCardCreator;

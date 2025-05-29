import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Card } from '@/lib/types';
import RealisticCardViewer from '@/components/immersive-viewer/RealisticCardViewer';
import ImmersiveViewerInterface from '@/components/immersive-viewer/ImmersiveViewerInterface';
import UnifiedSettingsPanel from '@/components/immersive-viewer/UnifiedSettingsPanel';
import { useCards } from '@/hooks/useCards';
import { basketballCards } from '@/data/basketballCards';

const ImmersiveCardViewerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { cards, getCard, loading } = useCards();
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState<'scenes' | 'customize'>('scenes');
  
  // Advanced customization state
  const [activeEffects, setActiveEffects] = useState<string[]>(['holographic']);
  const [effectIntensities, setEffectIntensities] = useState<Record<string, number>>({
    holographic: 0.7,
    refractor: 0.5,
    foil: 0.6,
    chrome: 0.4,
    prismatic: 0.8,
    vintage: 0.3,
    neon: 0.5,
    galaxy: 0.6
  });
  const [environmentType, setEnvironmentType] = useState('studio');
  const [materialSettings, setMaterialSettings] = useState({
    roughness: 0.2,
    metalness: 0.8,
    reflectivity: 0.5,
    clearcoat: 0.7,
    envMapIntensity: 1.0
  });
  const [lightingSettings, setLightingSettings] = useState({
    primaryLight: {
      x: 10,
      y: 10,
      z: 10,
      intensity: 1.2,
      color: '#ffffff'
    },
    ambientLight: {
      intensity: 0.6,
      color: '#f0f0ff'
    },
    environmentType: 'studio' as const,
    envMapIntensity: 1.0,
    useDynamicLighting: true
  });

  console.log('ImmersiveCardViewerPage: Looking for card with ID:', id);

  // Try to find the card using multiple sources
  let card: Card | undefined;
  
  if (id) {
    if (getCard) {
      card = getCard(id);
    }
    
    if (!card) {
      card = basketballCards.find(c => c.id === id);
    }
    
    if (!card && cards && cards.length > 0) {
      card = cards.find(c => c.id === id);
    }
  }

  // Show loading state while cards are being fetched
  if (loading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-16 h-16 border-4 border-t-transparent border-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg">Loading card...</p>
        </div>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Card Not Found</h1>
          <p className="text-gray-400 mb-6">The card you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/gallery')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Gallery
          </button>
        </div>
      </div>
    );
  }

  const handleBack = () => {
    navigate('/gallery');
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: card.title || 'Check out this card!',
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = card.imageUrl || '';
    link.download = `${card.title || 'card'}.jpg`;
    link.click();
    toast.success('Download started!');
  };

  const handleLike = () => {
    toast.success('Card liked!');
  };

  const handleBookmark = () => {
    toast.success('Card saved!');
  };

  const handleRemix = () => {
    setIsSettingsPanelOpen(true);
    setActiveSettingsTab('customize');
    toast.success('Remix mode activated! Customize your card.');
  };

  const handleOpenScenesPanel = () => {
    setActiveSettingsTab('scenes');
    setIsSettingsPanelOpen(true);
  };

  const handleOpenCustomizePanel = () => {
    setActiveSettingsTab('customize');
    setIsSettingsPanelOpen(true);
  };

  const handleEnvironmentChange = (environment: string) => {
    setEnvironmentType(environment);
    setLightingSettings(prev => ({ ...prev, environmentType: environment }));
  };

  // New handler functions for effects
  const handleEffectsChange = (effects: string[]) => {
    console.log('Effects changed to:', effects);
    setActiveEffects(effects);
  };

  const handleEffectIntensityChange = (effect: string, intensity: number) => {
    console.log('Effect intensity changed:', effect, intensity);
    setEffectIntensities(prev => ({ ...prev, [effect]: intensity }));
  };

  const handleMaterialChange = (changes: Partial<typeof materialSettings>) => {
    console.log('Material settings changed:', changes);
    setMaterialSettings(prev => ({ ...prev, ...changes }));
  };

  const handleLightingChange = (changes: Partial<typeof lightingSettings>) => {
    console.log('Lighting settings changed:', changes);
    setLightingSettings(prev => ({ ...prev, ...changes }));
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
      {/* Main viewer container - adjust width when panel is open */}
      <div 
        className={`transition-all duration-300 ${
          isSettingsPanelOpen ? 'mr-[420px]' : 'mr-0'
        }`}
        style={{ height: '100vh' }}
      >
        {/* 3D Card Viewer */}
        <RealisticCardViewer
          card={card}
          isCustomizationOpen={isSettingsPanelOpen}
          onToggleCustomization={() => setIsSettingsPanelOpen(!isSettingsPanelOpen)}
          activeEffects={activeEffects}
          effectIntensities={effectIntensities}
          environmentType={environmentType}
          materialSettings={materialSettings}
          lightingSettings={lightingSettings}
        />
        
        {/* Interface Overlay */}
        <ImmersiveViewerInterface
          card={card}
          isFlipped={isFlipped}
          onFlip={handleFlip}
          onBack={handleBack}
          onShare={handleShare}
          onDownload={handleDownload}
          onLike={handleLike}
          onBookmark={handleBookmark}
          onRemix={handleRemix}
          isCustomizationOpen={isSettingsPanelOpen}
          onToggleCustomization={() => setIsSettingsPanelOpen(!isSettingsPanelOpen)}
          environmentType={environmentType}
          onEnvironmentChange={handleEnvironmentChange}
          onOpenScenesPanel={handleOpenScenesPanel}
          onOpenCustomizePanel={handleOpenCustomizePanel}
        />
      </div>
      
      {/* Unified Settings Panel */}
      <UnifiedSettingsPanel
        card={card}
        isOpen={isSettingsPanelOpen}
        onClose={() => setIsSettingsPanelOpen(false)}
        activeTab={activeSettingsTab}
        onTabChange={setActiveSettingsTab}
        environmentType={environmentType}
        onEnvironmentChange={handleEnvironmentChange}
        lightingSettings={lightingSettings}
        onUpdateLighting={handleLightingChange}
        materialSettings={materialSettings}
        onUpdateMaterial={handleMaterialChange}
        onShareCard={handleShare}
        onDownloadCard={handleDownload}
        activeEffects={activeEffects}
        effectIntensities={effectIntensities}
        onEffectsChange={handleEffectsChange}
        onEffectIntensityChange={handleEffectIntensityChange}
      />
    </div>
  );
};

export default ImmersiveCardViewerPage;

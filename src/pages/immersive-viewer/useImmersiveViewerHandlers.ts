
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Card } from '@/lib/types';
import { LightingPreset } from '@/hooks/useCardLighting';

interface UseImmersiveViewerHandlersProps {
  card: Card;
  setIsFlipped: (flipped: boolean) => void;
  isFlipped: boolean;
  setIsSettingsPanelOpen: (open: boolean) => void;
  setActiveSettingsTab: (tab: 'scenes' | 'customize') => void;
  setEnvironmentType: (type: LightingPreset) => void;
  setLightingSettings: (settings: any) => void;
  setActiveEffects: (effects: string[]) => void;
  setEffectIntensities: (intensities: Record<string, number> | ((prev: Record<string, number>) => Record<string, number>)) => void;
  setMaterialSettings: (settings: any) => void;
}

export const useImmersiveViewerHandlers = ({
  card,
  setIsFlipped,
  isFlipped,
  setIsSettingsPanelOpen,
  setActiveSettingsTab,
  setEnvironmentType,
  setLightingSettings,
  setActiveEffects,
  setEffectIntensities,
  setMaterialSettings
}: UseImmersiveViewerHandlersProps) => {
  const navigate = useNavigate();

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
    const envType = environment as LightingPreset;
    setEnvironmentType(envType);
    setLightingSettings((prev: any) => ({ ...prev, environmentType: envType }));
  };

  const handleEffectsChange = (effects: string[]) => {
    console.log('Effects changed to:', effects);
    setActiveEffects(effects);
  };

  const handleEffectIntensityChange = (effect: string, intensity: number) => {
    console.log('Effect intensity changed:', effect, intensity);
    setEffectIntensities(prev => ({ ...prev, [effect]: intensity }));
  };

  const handleMaterialChange = (changes: any) => {
    console.log('Material settings changed:', changes);
    setMaterialSettings((prev: any) => ({ ...prev, ...changes }));
  };

  const handleLightingChange = (changes: any) => {
    console.log('Lighting settings changed:', changes);
    setLightingSettings((prev: any) => ({ ...prev, ...changes }));
  };

  return {
    handleBack,
    handleFlip,
    handleShare,
    handleDownload,
    handleLike,
    handleBookmark,
    handleRemix,
    handleOpenScenesPanel,
    handleOpenCustomizePanel,
    handleEnvironmentChange,
    handleEffectsChange,
    handleEffectIntensityChange,
    handleMaterialChange,
    handleLightingChange
  };
};

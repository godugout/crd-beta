
import React, { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Scissors, 
  Wand2, 
  Crop, 
  Palette, 
  Eye, 
  Undo,
  Redo,
  RefreshCw,
  Sparkles,
  Loader2,
  X
} from 'lucide-react';
import { useImageProcessingWorker } from '@/hooks/useImageProcessingWorker';
import { useImageHistory } from '@/hooks/useImageHistory';
import { toast } from 'sonner';

interface UnifiedImageProcessingPanelProps {
  imageUrl: string;
  onImageUpdate: (newImageUrl: string) => void;
  onClose: () => void;
  className?: string;
}

interface EnhancementOptions {
  autoEnhance: boolean;
  brightness: number;
  contrast: number;
  saturation: number;
  sharpness: number;
  denoise: boolean;
  upscale: boolean;
}

const UnifiedImageProcessingPanel: React.FC<UnifiedImageProcessingPanelProps> = ({
  imageUrl,
  onImageUpdate,
  onClose,
  className = ''
}) => {
  const { removeBackground, enhanceImage, isProcessing } = useImageProcessingWorker();
  const { addToHistory, undo, redo, canUndo, canRedo, currentUrl } = useImageHistory(imageUrl);
  
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingStatus, setProcessingStatus] = useState('');
  const [showBeforeAfter, setShowBeforeAfter] = useState(false);
  const [activeTab, setActiveTab] = useState('background');
  
  const [enhancements, setEnhancements] = useState<EnhancementOptions>({
    autoEnhance: false,
    brightness: 0,
    contrast: 0,
    saturation: 0,
    sharpness: 0,
    denoise: false,
    upscale: false
  });

  const imageRef = useRef<HTMLImageElement>(null);

  const loadImageElement = useCallback((url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  }, []);

  const handleRemoveBackground = useCallback(async () => {
    if (!currentUrl) return;
    
    setProcessingStatus('Removing background...');
    
    try {
      const img = await loadImageElement(currentUrl);
      const result = await removeBackground(img, setProcessingProgress);
      
      addToHistory(result.url, 'Background Removed');
      onImageUpdate(result.url);
      toast.success('Background removed successfully!');
    } catch (error) {
      console.error('Background removal failed:', error);
      toast.error('Failed to remove background. Please try again.');
    } finally {
      setProcessingProgress(0);
      setProcessingStatus('');
    }
  }, [currentUrl, removeBackground, addToHistory, onImageUpdate, loadImageElement]);

  const handleEnhancement = useCallback(async () => {
    if (!currentUrl) return;
    
    setProcessingStatus('Applying enhancements...');
    
    try {
      const img = await loadImageElement(currentUrl);
      const result = await enhanceImage(img, enhancements, setProcessingProgress);
      
      addToHistory(result.url, 'Enhanced');
      onImageUpdate(result.url);
      toast.success('Enhancements applied successfully!');
    } catch (error) {
      console.error('Enhancement failed:', error);
      toast.error('Failed to apply enhancements');
    } finally {
      setProcessingProgress(0);
      setProcessingStatus('');
    }
  }, [currentUrl, enhancements, enhanceImage, addToHistory, onImageUpdate, loadImageElement]);

  const handleUndo = useCallback(() => {
    const previousUrl = undo();
    if (previousUrl) {
      onImageUpdate(previousUrl);
    }
  }, [undo, onImageUpdate]);

  const handleRedo = useCallback(() => {
    const nextUrl = redo();
    if (nextUrl) {
      onImageUpdate(nextUrl);
    }
  }, [redo, onImageUpdate]);

  const updateEnhancement = useCallback((key: keyof EnhancementOptions, value: any) => {
    setEnhancements(prev => ({ ...prev, [key]: value }));
  }, []);

  return (
    <div className={`fixed right-0 top-0 bottom-0 w-[420px] bg-gray-900/95 backdrop-blur-sm border-l border-gray-700 z-50 overflow-y-auto ${className}`}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Image Processing</h2>
            <p className="text-gray-300 text-sm">AI-powered tools to perfect your image</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4 text-gray-400" />
          </Button>
        </div>

        {/* History Controls */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleUndo}
              disabled={!canUndo || isProcessing}
              className="bg-white/10 border-white/20 text-white"
            >
              <Undo className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleRedo}
              disabled={!canRedo || isProcessing}
              className="bg-white/10 border-white/20 text-white"
            >
              <Redo className="w-4 h-4" />
            </Button>
          </div>
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowBeforeAfter(!showBeforeAfter)}
            className="bg-white/10 border-white/20 text-white"
          >
            <Eye className="w-4 h-4 mr-1" />
            Compare
          </Button>
        </div>

        {/* Processing Status */}
        {isProcessing && (
          <Card className="p-4 bg-blue-500/20 border-blue-500/50">
            <div className="flex items-center gap-3 mb-2">
              <Loader2 className="w-5 h-5 animate-spin text-blue-300" />
              <span className="text-blue-200 font-medium">{processingStatus}</span>
            </div>
            {processingProgress > 0 && (
              <Progress value={processingProgress} className="w-full" />
            )}
          </Card>
        )}

        {/* Before/After Comparison */}
        {showBeforeAfter && (
          <Card className="p-4 bg-white/5 border-white/10">
            <h4 className="text-white font-medium mb-3">Before / After</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm mb-2">Before</p>
                <img src={imageUrl} alt="Before" className="w-full rounded-lg" />
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-2">After</p>
                <img src={currentUrl} alt="After" className="w-full rounded-lg" />
              </div>
            </div>
          </Card>
        )}

        {/* Main Tools */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/10">
            <TabsTrigger value="background" className="text-white text-xs">Background</TabsTrigger>
            <TabsTrigger value="enhance" className="text-white text-xs">Enhance</TabsTrigger>
            <TabsTrigger value="crop" className="text-white text-xs">Crop</TabsTrigger>
            <TabsTrigger value="effects" className="text-white text-xs">Effects</TabsTrigger>
          </TabsList>

          <TabsContent value="background" className="space-y-4">
            <Card className="p-4 bg-white/5 border-white/10">
              <h4 className="text-white font-medium mb-3">Background Tools</h4>
              
              <div className="space-y-3">
                <Button
                  onClick={handleRemoveBackground}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
                >
                  <Scissors className="w-4 h-4 mr-2" />
                  AI Background Removal
                </Button>

                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-xs bg-white/5 border-white/20 text-white"
                    disabled={isProcessing}
                  >
                    Replace Color
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-xs bg-white/5 border-white/20 text-white"
                    disabled={isProcessing}
                  >
                    Blur Background
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="enhance" className="space-y-4">
            <Card className="p-4 bg-white/5 border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-white font-medium">Auto Enhance</h4>
                <Switch
                  checked={enhancements.autoEnhance}
                  onCheckedChange={(checked) => updateEnhancement('autoEnhance', checked)}
                />
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-white text-sm">Brightness</label>
                    <Badge variant="outline">{enhancements.brightness}</Badge>
                  </div>
                  <Slider
                    value={[enhancements.brightness]}
                    min={-100}
                    max={100}
                    step={1}
                    onValueChange={([value]) => updateEnhancement('brightness', value)}
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-white text-sm">Contrast</label>
                    <Badge variant="outline">{enhancements.contrast}</Badge>
                  </div>
                  <Slider
                    value={[enhancements.contrast]}
                    min={-100}
                    max={100}
                    step={1}
                    onValueChange={([value]) => updateEnhancement('contrast', value)}
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-white text-sm">Saturation</label>
                    <Badge variant="outline">{enhancements.saturation}</Badge>
                  </div>
                  <Slider
                    value={[enhancements.saturation]}
                    min={-100}
                    max={100}
                    step={1}
                    onValueChange={([value]) => updateEnhancement('saturation', value)}
                  />
                </div>

                <Button
                  onClick={handleEnhancement}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Apply Enhancements
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="crop" className="space-y-4">
            <Card className="p-4 bg-white/5 border-white/10">
              <h4 className="text-white font-medium mb-3">Smart Cropping</h4>
              <p className="text-gray-400 text-sm">Crop tools coming soon...</p>
            </Card>
          </TabsContent>

          <TabsContent value="effects" className="space-y-4">
            <Card className="p-4 bg-white/5 border-white/10">
              <h4 className="text-white font-medium mb-3">Filters & Effects</h4>
              <p className="text-gray-400 text-sm">Effect tools coming soon...</p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UnifiedImageProcessingPanel;


import React, { useState, useCallback } from 'react';
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
  Download,
  Undo,
  Redo,
  RefreshCw,
  Sparkles,
  Loader2
} from 'lucide-react';
import { removeBackground, replaceBackground } from '@/services/imageProcessing/backgroundRemoval';
import { applyImageEnhancements, detectMainSubject, EnhancementOptions } from '@/services/imageProcessing/imageEnhancement';
import { toast } from 'sonner';

interface ImageProcessingPanelProps {
  imageUrl: string;
  onImageUpdate: (newImageUrl: string) => void;
  className?: string;
}

const ImageProcessingPanel: React.FC<ImageProcessingPanelProps> = ({
  imageUrl,
  onImageUpdate,
  className = ''
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingStatus, setProcessingStatus] = useState('');
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);
  
  const [enhancements, setEnhancements] = useState<EnhancementOptions>({
    autoEnhance: false,
    brightness: 0,
    contrast: 0,
    saturation: 0,
    sharpness: 0,
    denoise: false,
    upscale: false
  });

  const [backgroundOptions, setBackgroundOptions] = useState({
    type: 'transparent' as 'transparent' | 'color' | 'blur',
    color: '#ffffff',
    blurAmount: 5
  });

  const addToUndoStack = useCallback((currentUrl: string) => {
    setUndoStack(prev => [...prev.slice(-9), currentUrl]);
    setRedoStack([]);
  }, []);

  const handleUndo = useCallback(() => {
    if (undoStack.length === 0) return;
    
    const previousUrl = undoStack[undoStack.length - 1];
    setRedoStack(prev => [imageUrl, ...prev]);
    setUndoStack(prev => prev.slice(0, -1));
    onImageUpdate(previousUrl);
  }, [undoStack, imageUrl, onImageUpdate]);

  const handleRedo = useCallback(() => {
    if (redoStack.length === 0) return;
    
    const nextUrl = redoStack[0];
    setUndoStack(prev => [...prev, imageUrl]);
    setRedoStack(prev => prev.slice(1));
    onImageUpdate(nextUrl);
  }, [redoStack, imageUrl, onImageUpdate]);

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
    if (!imageUrl) return;
    
    setIsProcessing(true);
    setProcessingStatus('Removing background...');
    
    try {
      addToUndoStack(imageUrl);
      
      const img = await loadImageElement(imageUrl);
      const result = await removeBackground(img, {
        onProgress: setProcessingProgress,
        quality: 'high'
      });
      
      onImageUpdate(result.dataUrl);
      toast.success('Background removed successfully!');
    } catch (error) {
      console.error('Background removal failed:', error);
      toast.error('Failed to remove background. Please try again.');
    } finally {
      setIsProcessing(false);
      setProcessingProgress(0);
      setProcessingStatus('');
    }
  }, [imageUrl, addToUndoStack, loadImageElement, onImageUpdate]);

  const handleSmartCrop = useCallback(async () => {
    if (!imageUrl) return;
    
    setIsProcessing(true);
    setProcessingStatus('Detecting main subject...');
    
    try {
      const img = await loadImageElement(imageUrl);
      const subject = await detectMainSubject(img);
      
      // Create cropped canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');
      
      // Standard card ratio (2.5:3.5)
      const cardRatio = 2.5 / 3.5;
      let cropWidth = subject.width;
      let cropHeight = subject.height;
      
      // Adjust to card ratio
      if (cropWidth / cropHeight > cardRatio) {
        cropWidth = cropHeight * cardRatio;
      } else {
        cropHeight = cropWidth / cardRatio;
      }
      
      // Center the crop on the subject
      const cropX = subject.x + (subject.width - cropWidth) / 2;
      const cropY = subject.y + (subject.height - cropHeight) / 2;
      
      canvas.width = cropWidth;
      canvas.height = cropHeight;
      
      ctx.drawImage(
        img,
        Math.max(0, cropX), Math.max(0, cropY), cropWidth, cropHeight,
        0, 0, cropWidth, cropHeight
      );
      
      addToUndoStack(imageUrl);
      
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      onImageUpdate(dataUrl);
      
      toast.success(`Smart crop applied (${Math.round(subject.confidence * 100)}% confidence)`);
    } catch (error) {
      console.error('Smart crop failed:', error);
      toast.error('Failed to apply smart crop');
    } finally {
      setIsProcessing(false);
      setProcessingStatus('');
    }
  }, [imageUrl, addToUndoStack, loadImageElement, onImageUpdate]);

  const handleApplyEnhancements = useCallback(async () => {
    if (!imageUrl) return;
    
    setIsProcessing(true);
    setProcessingStatus('Applying enhancements...');
    
    try {
      const img = await loadImageElement(imageUrl);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');
      
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);
      
      addToUndoStack(imageUrl);
      
      applyImageEnhancements(canvas, enhancements);
      
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      onImageUpdate(dataUrl);
      
      toast.success('Enhancements applied successfully!');
    } catch (error) {
      console.error('Enhancement failed:', error);
      toast.error('Failed to apply enhancements');
    } finally {
      setIsProcessing(false);
      setProcessingStatus('');
    }
  }, [imageUrl, enhancements, addToUndoStack, loadImageElement, onImageUpdate]);

  const updateEnhancement = useCallback((key: keyof EnhancementOptions, value: any) => {
    setEnhancements(prev => ({ ...prev, [key]: value }));
  }, []);

  return (
    <div className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Image Processing</h3>
          <p className="text-gray-300 text-sm">AI-powered tools to perfect your card image</p>
        </div>
        
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleUndo}
            disabled={undoStack.length === 0}
            className="bg-white/10 border-white/20 text-white"
          >
            <Undo className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleRedo}
            disabled={redoStack.length === 0}
            className="bg-white/10 border-white/20 text-white"
          >
            <Redo className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {isProcessing && (
        <Card className="p-4 mb-6 bg-blue-500/20 border-blue-500/50">
          <div className="flex items-center gap-3 mb-2">
            <Loader2 className="w-5 h-5 animate-spin text-blue-300" />
            <span className="text-blue-200 font-medium">{processingStatus}</span>
          </div>
          <Progress value={processingProgress} className="w-full" />
        </Card>
      )}

      <Tabs defaultValue="background" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-white/10">
          <TabsTrigger value="background" className="text-white">Background</TabsTrigger>
          <TabsTrigger value="enhance" className="text-white">Enhance</TabsTrigger>
          <TabsTrigger value="crop" className="text-white">Crop</TabsTrigger>
          <TabsTrigger value="filters" className="text-white">Filters</TabsTrigger>
        </TabsList>

        <TabsContent value="background" className="space-y-4">
          <Card className="p-4 bg-white/5 border-white/10">
            <h4 className="text-white font-medium mb-3">Background Removal</h4>
            <p className="text-gray-400 text-sm mb-4">
              AI-powered background removal with manual refinement tools
            </p>
            
            <div className="space-y-3">
              <Button
                onClick={handleRemoveBackground}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
              >
                <Scissors className="w-4 h-4 mr-2" />
                Remove Background
              </Button>

              <div className="grid grid-cols-3 gap-2">
                <Button
                  size="sm"
                  variant={backgroundOptions.type === 'transparent' ? 'default' : 'outline'}
                  onClick={() => setBackgroundOptions(prev => ({ ...prev, type: 'transparent' }))}
                  className="text-xs"
                >
                  Transparent
                </Button>
                <Button
                  size="sm"
                  variant={backgroundOptions.type === 'color' ? 'default' : 'outline'}
                  onClick={() => setBackgroundOptions(prev => ({ ...prev, type: 'color' }))}
                  className="text-xs"
                >
                  Color
                </Button>
                <Button
                  size="sm"
                  variant={backgroundOptions.type === 'blur' ? 'default' : 'outline'}
                  onClick={() => setBackgroundOptions(prev => ({ ...prev, type: 'blur' }))}
                  className="text-xs"
                >
                  Blur
                </Button>
              </div>

              {backgroundOptions.type === 'color' && (
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={backgroundOptions.color}
                    onChange={(e) => setBackgroundOptions(prev => ({ 
                      ...prev, 
                      color: e.target.value 
                    }))}
                    className="w-8 h-8 rounded border border-white/20"
                  />
                  <span className="text-white text-sm">Background Color</span>
                </div>
              )}
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

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-white text-sm">Sharpness</label>
                  <Badge variant="outline">{enhancements.sharpness}</Badge>
                </div>
                <Slider
                  value={[enhancements.sharpness]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={([value]) => updateEnhancement('sharpness', value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-white text-sm">Noise Reduction</span>
                <Switch
                  checked={enhancements.denoise}
                  onCheckedChange={(checked) => updateEnhancement('denoise', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-white text-sm">AI Upscale</span>
                <Switch
                  checked={enhancements.upscale}
                  onCheckedChange={(checked) => updateEnhancement('upscale', checked)}
                />
              </div>

              <Button
                onClick={handleApplyEnhancements}
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
            <p className="text-gray-400 text-sm mb-4">
              AI-powered subject detection and optimal cropping for card layouts
            </p>
            
            <div className="space-y-3">
              <Button
                onClick={handleSmartCrop}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500"
              >
                <Crop className="w-4 h-4 mr-2" />
                Smart Crop to Card Ratio
              </Button>

              <div className="grid grid-cols-2 gap-2">
                <Button size="sm" variant="outline" className="text-xs">
                  Standard (2.5:3.5)
                </Button>
                <Button size="sm" variant="outline" className="text-xs">
                  Square (1:1)
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="filters" className="space-y-4">
          <Card className="p-4 bg-white/5 border-white/10">
            <h4 className="text-white font-medium mb-3">Preset Filters</h4>
            
            <div className="grid grid-cols-2 gap-2">
              {[
                'Vintage', 'B&W', 'Sepia', 'HDR',
                'Team Colors', 'Dramatic', 'Soft', 'Vivid'
              ].map((filter) => (
                <Button
                  key={filter}
                  size="sm"
                  variant="outline"
                  className="text-xs bg-white/5 border-white/20 text-white hover:bg-white/10"
                >
                  <Palette className="w-3 h-3 mr-1" />
                  {filter}
                </Button>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ImageProcessingPanel;

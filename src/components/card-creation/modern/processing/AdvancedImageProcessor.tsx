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
  Target,
  Grid3X3,
  User
} from 'lucide-react';
import { removeBackground } from '@/services/imageProcessing/backgroundRemoval';
import { applyImageEnhancements, EnhancementOptions } from '@/services/imageProcessing/imageEnhancement';
import { detectMainSubject, generateCropSuggestions, CropSuggestion } from '@/services/imageProcessing/smartCropping';
import { applyFilter, FilterType, createBlurredBackground } from '@/services/imageProcessing/filterEffects';
import { toast } from 'sonner';

interface AdvancedImageProcessorProps {
  imageUrl: string;
  onImageUpdate: (newImageUrl: string) => void;
  className?: string;
}

const AdvancedImageProcessor: React.FC<AdvancedImageProcessorProps> = ({
  imageUrl,
  onImageUpdate,
  className = ''
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingStatus, setProcessingStatus] = useState('');
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);
  const [showBeforeAfter, setShowBeforeAfter] = useState(false);
  const [originalImage, setOriginalImage] = useState<string>(imageUrl);
  
  // Crop suggestions state
  const [cropSuggestions, setCropSuggestions] = useState<CropSuggestion[]>([]);
  const [selectedCropIndex, setSelectedCropIndex] = useState(-1);
  
  // Enhancement options
  const [enhancements, setEnhancements] = useState<EnhancementOptions>({
    autoEnhance: false,
    brightness: 0,
    contrast: 0,
    saturation: 0,
    sharpness: 0,
    denoise: false,
    upscale: false
  });

  // Filter options
  const [selectedFilter, setSelectedFilter] = useState<FilterType | null>(null);
  const [filterIntensity, setFilterIntensity] = useState(0.8);
  const [teamColor, setTeamColor] = useState('#ff0000');

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const addToUndoStack = useCallback((currentUrl: string) => {
    setUndoStack(prev => [...prev.slice(-9), currentUrl]);
    setRedoStack([]);
    if (!originalImage) {
      setOriginalImage(currentUrl);
    }
  }, [originalImage]);

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

  const handleSmartCrop = useCallback(async () => {
    if (!imageUrl) return;
    
    setIsProcessing(true);
    setProcessingStatus('Analyzing image for smart crop suggestions...');
    
    try {
      const img = await loadImageElement(imageUrl);
      const suggestions = await generateCropSuggestions(img);
      setCropSuggestions(suggestions);
      
      if (suggestions.length > 0) {
        setSelectedCropIndex(0);
        toast.success(`Found ${suggestions.length} crop suggestions`);
      } else {
        toast.info('No smart crop suggestions found');
      }
    } catch (error) {
      console.error('Smart crop failed:', error);
      toast.error('Failed to generate crop suggestions');
    } finally {
      setIsProcessing(false);
      setProcessingStatus('');
    }
  }, [imageUrl, loadImageElement]);

  const applyCropSuggestion = useCallback(async (suggestion: CropSuggestion) => {
    if (!imageUrl) return;
    
    setIsProcessing(true);
    setProcessingStatus('Applying crop...');
    
    try {
      const img = await loadImageElement(imageUrl);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');
      
      canvas.width = suggestion.width;
      canvas.height = suggestion.height;
      
      ctx.drawImage(
        img,
        suggestion.x, suggestion.y, suggestion.width, suggestion.height,
        0, 0, suggestion.width, suggestion.height
      );
      
      addToUndoStack(imageUrl);
      
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      onImageUpdate(dataUrl);
      setCropSuggestions([]);
      setSelectedCropIndex(-1);
      
      toast.success('Crop applied successfully');
    } catch (error) {
      console.error('Crop application failed:', error);
      toast.error('Failed to apply crop');
    } finally {
      setIsProcessing(false);
      setProcessingStatus('');
    }
  }, [imageUrl, addToUndoStack, loadImageElement, onImageUpdate]);

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

  const handleApplyFilter = useCallback(async (filterType: FilterType) => {
    if (!imageUrl) return;
    
    setIsProcessing(true);
    setProcessingStatus(`Applying ${filterType} filter...`);
    
    try {
      const img = await loadImageElement(imageUrl);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');
      
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);
      
      addToUndoStack(imageUrl);
      
      applyFilter(canvas, {
        type: filterType,
        intensity: filterIntensity,
        teamColor: filterType === 'teamColors' ? teamColor : undefined
      });
      
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      onImageUpdate(dataUrl);
      
      toast.success(`${filterType} filter applied successfully!`);
    } catch (error) {
      console.error('Filter application failed:', error);
      toast.error('Failed to apply filter');
    } finally {
      setIsProcessing(false);
      setProcessingStatus('');
    }
  }, [imageUrl, filterIntensity, teamColor, addToUndoStack, loadImageElement, onImageUpdate]);

  const handleEnhancement = useCallback(async () => {
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
          <h3 className="text-xl font-bold text-white mb-2">Advanced Image Processing</h3>
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
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowBeforeAfter(!showBeforeAfter)}
            className="bg-white/10 border-white/20 text-white"
          >
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {isProcessing && (
        <Card className="p-4 mb-6 bg-blue-500/20 border-blue-500/50">
          <div className="flex items-center gap-3 mb-2">
            <Loader2 className="w-5 h-5 animate-spin text-blue-300" />
            <span className="text-blue-200 font-medium">{processingStatus}</span>
          </div>
          {processingProgress > 0 && (
            <Progress value={processingProgress} className="w-full" />
          )}
        </Card>
      )}

      {showBeforeAfter && originalImage && (
        <Card className="p-4 mb-6 bg-white/5 border-white/10">
          <h4 className="text-white font-medium mb-3">Before / After Comparison</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400 text-sm mb-2">Before</p>
              <img src={originalImage} alt="Before" className="w-full rounded-lg" />
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-2">After</p>
              <img src={imageUrl} alt="After" className="w-full rounded-lg" />
            </div>
          </div>
        </Card>
      )}

      <Tabs defaultValue="background" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-white/10">
          <TabsTrigger value="background" className="text-white">Background</TabsTrigger>
          <TabsTrigger value="crop" className="text-white">Smart Crop</TabsTrigger>
          <TabsTrigger value="enhance" className="text-white">Enhance</TabsTrigger>
          <TabsTrigger value="filters" className="text-white">Filters</TabsTrigger>
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
                <Button size="sm" variant="outline" className="text-xs bg-white/5 border-white/20 text-white">
                  Replace with Color
                </Button>
                <Button size="sm" variant="outline" className="text-xs bg-white/5 border-white/20 text-white">
                  Blur Background
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="crop" className="space-y-4">
          <Card className="p-4 bg-white/5 border-white/10">
            <h4 className="text-white font-medium mb-3">Smart Cropping</h4>
            
            <div className="space-y-3">
              <Button
                onClick={handleSmartCrop}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500"
              >
                <Target className="w-4 h-4 mr-2" />
                Generate Crop Suggestions
              </Button>

              {cropSuggestions.length > 0 && (
                <div className="space-y-2">
                  <p className="text-gray-300 text-sm">Crop Suggestions:</p>
                  {cropSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedCropIndex === index
                          ? 'bg-blue-500/20 border-blue-500'
                          : 'bg-white/5 border-white/20 hover:bg-white/10'
                      }`}
                      onClick={() => setSelectedCropIndex(index)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {suggestion.rule === 'thirds' && <Grid3X3 className="w-4 h-4 text-blue-400" />}
                          {suggestion.rule === 'subject-focused' && <User className="w-4 h-4 text-green-400" />}
                          {suggestion.rule === 'center' && <Target className="w-4 h-4 text-purple-400" />}
                          <span className="text-white text-sm capitalize">
                            {suggestion.rule.replace('-', ' ')}
                          </span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {Math.round(suggestion.confidence * 100)}%
                        </Badge>
                      </div>
                      {selectedCropIndex === index && (
                        <Button
                          size="sm"
                          onClick={() => applyCropSuggestion(suggestion)}
                          className="w-full mt-2 bg-blue-500 hover:bg-blue-600"
                        >
                          Apply Crop
                        </Button>
                      )}
                    </div>
                  ))}
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

        <TabsContent value="filters" className="space-y-4">
          <Card className="p-4 bg-white/5 border-white/10">
            <h4 className="text-white font-medium mb-3">Filters & Effects</h4>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-white text-sm">Filter Intensity</label>
                  <Badge variant="outline">{Math.round(filterIntensity * 100)}%</Badge>
                </div>
                <Slider
                  value={[filterIntensity]}
                  min={0}
                  max={1}
                  step={0.01}
                  onValueChange={([value]) => setFilterIntensity(value)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                {[
                  { type: 'vintage' as FilterType, name: 'Vintage', color: 'from-amber-500 to-orange-500' },
                  { type: 'blackAndWhite' as FilterType, name: 'B&W', color: 'from-gray-500 to-gray-700' },
                  { type: 'sepia' as FilterType, name: 'Sepia', color: 'from-yellow-600 to-brown-600' },
                  { type: 'hdr' as FilterType, name: 'HDR', color: 'from-blue-500 to-purple-500' },
                  { type: 'dramatic' as FilterType, name: 'Dramatic', color: 'from-red-500 to-gray-700' },
                  { type: 'vivid' as FilterType, name: 'Vivid', color: 'from-green-500 to-blue-500' }
                ].map((filter) => (
                  <Button
                    key={filter.type}
                    size="sm"
                    onClick={() => handleApplyFilter(filter.type)}
                    className={`text-xs bg-gradient-to-r ${filter.color} hover:opacity-80`}
                    disabled={isProcessing}
                  >
                    <Palette className="w-3 h-3 mr-1" />
                    {filter.name}
                  </Button>
                ))}
              </div>

              <div className="border-t border-white/10 pt-4">
                <label className="text-white text-sm mb-2 block">Team Colors</label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="color"
                    value={teamColor}
                    onChange={(e) => setTeamColor(e.target.value)}
                    className="w-8 h-8 rounded border border-white/20"
                  />
                  <Button
                    size="sm"
                    onClick={() => handleApplyFilter('teamColors')}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600"
                    disabled={isProcessing}
                  >
                    Apply Team Colors
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedImageProcessor;

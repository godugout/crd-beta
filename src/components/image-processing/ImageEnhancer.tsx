
import React, { useState, useRef } from 'react';
import { useAdvancedImageEnhancement } from '@/hooks/useAdvancedImageEnhancement';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Loader2, Save, Eye, Image, Sparkles, Scale } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

interface ImageEnhancerProps {
  imageUrl: string;
  onEnhanced?: (result: {
    enhancedImageUrl: string;
    withoutBackgroundUrl?: string;
    upscaledUrl?: string;
    metadata: any;
  }) => void;
  className?: string;
}

const ImageEnhancer: React.FC<ImageEnhancerProps> = ({
  imageUrl,
  onEnhanced,
  className = ''
}) => {
  const [options, setOptions] = useState({
    denoise: true,
    sharpen: true,
    enhanceColors: true,
    removeBackground: false,
    upscale: false,
    upscaleFactor: 2,
    stadiumLightingFix: true,
    autoContrast: true
  });
  
  const [activeTab, setActiveTab] = useState<'original' | 'enhanced' | 'background' | 'upscaled'>('original');
  const imageRef = useRef<HTMLImageElement>(null);
  
  const {
    enhanceImage,
    isProcessing,
    progress,
    result
  } = useAdvancedImageEnhancement();
  
  const handleEnhance = async () => {
    try {
      if (!imageRef.current) return;
      
      const enhancedResult = await enhanceImage(imageRef.current, options);
      
      toast.success('Image enhanced successfully!');
      
      if (onEnhanced) {
        onEnhanced(enhancedResult);
      }
    } catch (error) {
      console.error('Error in image enhancement:', error);
      toast.error('Failed to enhance image');
    }
  };
  
  const displayedImage = () => {
    if (!result) return imageUrl;
    
    switch (activeTab) {
      case 'enhanced':
        return result.enhancedImageUrl;
      case 'background':
        return result.withoutBackgroundUrl || result.enhancedImageUrl;
      case 'upscaled':
        return result.upscaledUrl || result.enhancedImageUrl;
      default:
        return imageUrl;
    }
  };
  
  const saveCurrentImage = () => {
    let url = imageUrl;
    let filename = 'original-image.jpg';
    
    if (result) {
      switch (activeTab) {
        case 'enhanced':
          url = result.enhancedImageUrl;
          filename = 'enhanced-image.jpg';
          break;
        case 'background':
          url = result.withoutBackgroundUrl || result.enhancedImageUrl;
          filename = 'background-removed.png';
          break;
        case 'upscaled':
          url = result.upscaledUrl || result.enhancedImageUrl;
          filename = 'upscaled-image.jpg';
          break;
      }
    }
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className={`flex flex-col ${className}`}>
      {/* Preview area */}
      <div className="relative border rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 aspect-square mb-4">
        <img 
          ref={imageRef}
          src={displayedImage()} 
          alt="Enhancement preview"
          className="w-full h-full object-contain"
        />
        
        {/* Processing overlay */}
        {isProcessing && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 text-white animate-spin mb-3" />
            <div className="text-white text-sm">Enhancing image... {progress}%</div>
            <Progress value={progress} className="w-3/4 mt-2" />
          </div>
        )}
      </div>
      
      {/* Results tabs */}
      {result && (
        <div className="flex space-x-1 mb-4">
          <Button 
            variant={activeTab === 'original' ? 'default' : 'outline'}
            size="sm"
            className="flex-1"
            onClick={() => setActiveTab('original')}
          >
            Original
          </Button>
          <Button 
            variant={activeTab === 'enhanced' ? 'default' : 'outline'}
            size="sm" 
            className="flex-1"
            onClick={() => setActiveTab('enhanced')}
          >
            Enhanced
          </Button>
          {result.withoutBackgroundUrl && (
            <Button 
              variant={activeTab === 'background' ? 'default' : 'outline'}
              size="sm"
              className="flex-1"
              onClick={() => setActiveTab('background')}
            >
              No BG
            </Button>
          )}
          {result.upscaledUrl && (
            <Button 
              variant={activeTab === 'upscaled' ? 'default' : 'outline'}
              size="sm"
              className="flex-1"
              onClick={() => setActiveTab('upscaled')}
            >
              Upscaled
            </Button>
          )}
        </div>
      )}
      
      {/* Stats */}
      {result && (
        <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-md text-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Processing time:</span>
            <span>{(result.metadata.processingTime / 1000).toFixed(2)}s</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Size change:</span>
            <span>
              {((result.metadata.enhancedSize - result.metadata.originalSize) / result.metadata.originalSize * 100).toFixed(0)}%
              {result.metadata.enhancedSize < result.metadata.originalSize ? ' smaller' : ' larger'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Methods applied:</span>
            <span>{result.metadata.methods.length}</span>
          </div>
        </div>
      )}
      
      {/* Enhancement options */}
      <div className="space-y-4">
        <h3 className="font-medium text-lg">Enhancement Options</h3>
        
        {/* Basic options */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="cursor-pointer flex items-center gap-2" htmlFor="opt-stadiumLighting">
              <Sparkles className="h-4 w-4" />
              Fix Stadium Lighting
            </Label>
            <Switch 
              id="opt-stadiumLighting"
              checked={options.stadiumLightingFix}
              onCheckedChange={(checked) => setOptions(prev => ({ ...prev, stadiumLightingFix: checked }))}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label className="cursor-pointer flex items-center gap-2" htmlFor="opt-denoise">
              <Image className="h-4 w-4" />
              Reduce Noise
            </Label>
            <Switch 
              id="opt-denoise"
              checked={options.denoise}
              onCheckedChange={(checked) => setOptions(prev => ({ ...prev, denoise: checked }))}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label className="cursor-pointer flex items-center gap-2" htmlFor="opt-sharpen">
              <Sparkles className="h-4 w-4" />
              Sharpen Details
            </Label>
            <Switch 
              id="opt-sharpen"
              checked={options.sharpen}
              onCheckedChange={(checked) => setOptions(prev => ({ ...prev, sharpen: checked }))}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label className="cursor-pointer flex items-center gap-2" htmlFor="opt-enhanceColors">
              <Eye className="h-4 w-4" />
              Enhance Colors
            </Label>
            <Switch 
              id="opt-enhanceColors"
              checked={options.enhanceColors}
              onCheckedChange={(checked) => setOptions(prev => ({ ...prev, enhanceColors: checked }))}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label className="cursor-pointer flex items-center gap-2" htmlFor="opt-autoContrast">
              <Scale className="h-4 w-4" />
              Auto Contrast
            </Label>
            <Switch 
              id="opt-autoContrast"
              checked={options.autoContrast}
              onCheckedChange={(checked) => setOptions(prev => ({ ...prev, autoContrast: checked }))}
            />
          </div>
        </div>
        
        {/* Advanced options */}
        <div className="space-y-3 pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <Label className="cursor-pointer" htmlFor="opt-removeBackground">
              Remove Background
            </Label>
            <Switch 
              id="opt-removeBackground"
              checked={options.removeBackground}
              onCheckedChange={(checked) => setOptions(prev => ({ ...prev, removeBackground: checked }))}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label className="cursor-pointer" htmlFor="opt-upscale">
              Upscale Image
            </Label>
            <Switch 
              id="opt-upscale"
              checked={options.upscale}
              onCheckedChange={(checked) => setOptions(prev => ({ ...prev, upscale: checked }))}
            />
          </div>
          
          {options.upscale && (
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Upscale Factor</Label>
                <span className="text-sm">{options.upscaleFactor}x</span>
              </div>
              <Slider
                value={[options.upscaleFactor]}
                min={1.5}
                max={4}
                step={0.5}
                onValueChange={(val) => setOptions(prev => ({ ...prev, upscaleFactor: val[0] }))}
              />
            </div>
          )}
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="flex space-x-3 mt-6">
        <Button 
          onClick={handleEnhance} 
          disabled={isProcessing}
          className="flex-1"
        >
          {isProcessing ? 
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</> : 
            'Enhance Image'}
        </Button>
        
        {result && (
          <Button 
            variant="outline" 
            onClick={saveCurrentImage}
            className="flex items-center gap-1"
          >
            <Save className="h-4 w-4" /> Save
          </Button>
        )}
      </div>
    </div>
  );
};

export default ImageEnhancer;

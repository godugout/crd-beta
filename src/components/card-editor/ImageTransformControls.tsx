
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { 
  RotateCw, 
  FlipHorizontal, 
  FlipVertical, 
  Crop,
  Move,
  RotateCcw,
  Maximize,
  Minimize
} from 'lucide-react';
import { CardLayer } from '@/lib/types';

interface ImageTransformControlsProps {
  layer: CardLayer;
  onLayerUpdate: (layerId: string, updates: Partial<CardLayer>) => void;
  onRotateImage: (degrees: number) => void;
  onFlipImage: (direction: 'horizontal' | 'vertical') => void;
  onFitToCanvas: () => void;
  onResetTransform: () => void;
}

const ImageTransformControls: React.FC<ImageTransformControlsProps> = ({
  layer,
  onLayerUpdate,
  onRotateImage,
  onFlipImage,
  onFitToCanvas,
  onResetTransform
}) => {
  return (
    <div className="space-y-4 p-4 bg-gray-750 rounded-lg">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-white">Transform Image</h4>
        <Button
          variant="ghost"
          size="sm"
          onClick={onResetTransform}
          className="text-xs text-gray-400 hover:text-white"
        >
          Reset
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onRotateImage(-90)}
          className="p-2"
          title="Rotate Left 90°"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onRotateImage(90)}
          className="p-2"
          title="Rotate Right 90°"
        >
          <RotateCw className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onFlipImage('horizontal')}
          className="p-2"
          title="Flip Horizontal"
        >
          <FlipHorizontal className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onFlipImage('vertical')}
          className="p-2"
          title="Flip Vertical"
        >
          <FlipVertical className="w-4 h-4" />
        </Button>
      </div>

      {/* Size Controls */}
      <div className="space-y-3">
        <div>
          <Label className="text-xs text-gray-400 mb-2 block">Size</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <input
                type="number"
                value={typeof layer.size.width === 'number' ? Math.round(layer.size.width) : 200}
                onChange={(e) => onLayerUpdate(layer.id, {
                  size: { ...layer.size, width: Number(e.target.value) }
                })}
                className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs text-white"
                placeholder="Width"
              />
            </div>
            <div>
              <input
                type="number"
                value={typeof layer.size.height === 'number' ? Math.round(layer.size.height) : 200}
                onChange={(e) => onLayerUpdate(layer.id, {
                  size: { ...layer.size, height: Number(e.target.value) }
                })}
                className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs text-white"
                placeholder="Height"
              />
            </div>
          </div>
        </div>

        {/* Position Controls */}
        <div>
          <Label className="text-xs text-gray-400 mb-2 block">Position</Label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              value={Math.round(layer.position.x)}
              onChange={(e) => onLayerUpdate(layer.id, {
                position: { ...layer.position, x: Number(e.target.value) }
              })}
              className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs text-white"
              placeholder="X"
            />
            <input
              type="number"
              value={Math.round(layer.position.y)}
              onChange={(e) => onLayerUpdate(layer.id, {
                position: { ...layer.position, y: Number(e.target.value) }
              })}
              className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs text-white"
              placeholder="Y"
            />
          </div>
        </div>

        {/* Rotation Slider */}
        <div>
          <Label className="text-xs text-gray-400 mb-2 flex items-center justify-between">
            Rotation
            <span className="text-white">{Math.round(layer.rotation)}°</span>
          </Label>
          <Slider
            value={[layer.rotation]}
            onValueChange={([value]) => onLayerUpdate(layer.id, { rotation: value })}
            min={-180}
            max={180}
            step={1}
            className="w-full"
          />
        </div>

        {/* Opacity Slider */}
        <div>
          <Label className="text-xs text-gray-400 mb-2 flex items-center justify-between">
            Opacity
            <span className="text-white">{Math.round(layer.opacity * 100)}%</span>
          </Label>
          <Slider
            value={[layer.opacity * 100]}
            onValueChange={([value]) => onLayerUpdate(layer.id, { opacity: value / 100 })}
            min={0}
            max={100}
            step={1}
            className="w-full"
          />
        </div>
      </div>

      {/* Fit Actions */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onFitToCanvas}
          className="text-xs"
        >
          <Maximize className="w-3 h-3 mr-1" />
          Fit Canvas
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            // Reset to original size
            onLayerUpdate(layer.id, {
              size: { width: 200, height: 200 },
              position: { x: 100, y: 100, z: 0 },
              rotation: 0
            });
          }}
          className="text-xs"
        >
          <Minimize className="w-3 h-3 mr-1" />
          Reset Size
        </Button>
      </div>
    </div>
  );
};

export default ImageTransformControls;

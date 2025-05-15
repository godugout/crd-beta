
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ImageIcon, 
  Type, 
  Square, 
  Plus, 
  Palette, 
  Star,
  Settings,
  ArrowDown,
  ArrowUp,
  Copy,
  Layers as LayersIcon,
  Save,
  Share2,
  File,
  FileText,
  FileImage
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ToolsPanelProps {
  onAddLayer: (type: 'image' | 'text' | 'shape' | 'sticker' | 'effect') => void;
  onSaveTemplate?: () => void;
  onExport?: (format: 'png' | 'jpg' | 'pdf') => void;
  onUndoRedo?: (action: 'undo' | 'redo') => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

const ToolsPanel: React.FC<ToolsPanelProps> = ({ 
  onAddLayer,
  onSaveTemplate,
  onExport,
  onUndoRedo,
  canUndo = false,
  canRedo = false
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Tools</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4 p-2">
        <Tabs defaultValue="elements" className="w-full">
          <TabsList className="grid grid-cols-3 mb-2">
            <TabsTrigger value="elements">Elements</TabsTrigger>
            <TabsTrigger value="effects">Effects</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>
          
          <div data-value="elements" className="space-y-2">
            <TooltipProvider delayDuration={300}>
              <div className="grid grid-cols-2 gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      className="justify-start"
                      onClick={() => onAddLayer('image')}
                    >
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Image
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add image (Ctrl+I)</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      className="justify-start"
                      onClick={() => onAddLayer('text')}
                    >
                      <Type className="h-4 w-4 mr-2" />
                      Text
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add text (Ctrl+T)</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      className="justify-start"
                      onClick={() => onAddLayer('shape')}
                    >
                      <Square className="h-4 w-4 mr-2" />
                      Shape
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add shape (Ctrl+S)</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      className="justify-start"
                      onClick={() => onAddLayer('sticker')}
                    >
                      <Star className="h-4 w-4 mr-2" />
                      Sticker
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add sticker (Ctrl+K)</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </div>
          
          <div data-value="effects" className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => onAddLayer('effect')}
            >
              <Palette className="h-4 w-4 mr-2" />
              Add Effect
            </Button>
            
            <div className="grid grid-cols-2 gap-2">
              <Button variant="ghost" size="sm" className="h-8 text-xs">
                Holographic
              </Button>
              <Button variant="ghost" size="sm" className="h-8 text-xs">
                Refractor
              </Button>
              <Button variant="ghost" size="sm" className="h-8 text-xs">
                Gold Foil
              </Button>
              <Button variant="ghost" size="sm" className="h-8 text-xs">
                Prismatic
              </Button>
            </div>
          </div>
          
          <div data-value="actions" className="space-y-2">
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => onUndoRedo && onUndoRedo('undo')}
                disabled={!canUndo}
              >
                <ArrowDown className="h-4 w-4 mr-1" />
                Undo
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => onUndoRedo && onUndoRedo('redo')}
                disabled={!canRedo}
              >
                <ArrowUp className="h-4 w-4 mr-1" />
                Redo
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => onSaveTemplate && onSaveTemplate()}
              >
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
              <Button 
                variant="secondary" 
                size="sm"
              >
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
            </div>
            
            <div className="space-y-1">
              <p className="text-xs font-medium">Export as:</p>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 text-xs"
                  onClick={() => onExport && onExport('png')}
                >
                  <FileImage className="h-3 w-3 mr-1" />
                  PNG
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 text-xs"
                  onClick={() => onExport && onExport('jpg')}
                >
                  <FileImage className="h-3 w-3 mr-1" />
                  JPG
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 text-xs"
                  onClick={() => onExport && onExport('pdf')}
                >
                  <FileText className="h-3 w-3 mr-1" />
                  PDF
                </Button>
              </div>
            </div>
          </div>
        </Tabs>
        
        <div className="text-xs text-center text-muted-foreground pt-2 border-t">
          <div className="flex justify-center gap-4">
            <div className="flex items-center">
              <kbd className="px-2 py-0.5 bg-muted rounded text-[10px] mr-1">Ctrl+Z</kbd>
              <span className="text-[10px]">Undo</span>
            </div>
            <div className="flex items-center">
              <kbd className="px-2 py-0.5 bg-muted rounded text-[10px] mr-1">Ctrl+Y</kbd>
              <span className="text-[10px]">Redo</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ToolsPanel;

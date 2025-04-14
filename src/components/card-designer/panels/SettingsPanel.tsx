
import React from 'react';
import { CardTemplate } from '@/components/card-templates/TemplateLibrary';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

interface SettingsPanelProps {
  template?: CardTemplate;
  onUpdateSettings: (settings: any) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  template,
  onUpdateSettings
}) => {
  return (
    <div className="p-4 space-y-6">
      <h3 className="font-medium text-lg">Settings</h3>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="safe-zones">Safe Zones</Label>
          <div className="flex items-center gap-2 mt-1.5">
            <Switch id="safe-zones" defaultChecked={true} />
            <Label htmlFor="safe-zones" className="font-normal text-sm">
              Show print safe zones
            </Label>
          </div>
        </div>
        
        <div>
          <Label htmlFor="grid">Grid</Label>
          <div className="flex items-center gap-2 mt-1.5">
            <Switch id="grid" defaultChecked={false} />
            <Label htmlFor="grid" className="font-normal text-sm">
              Show alignment grid
            </Label>
          </div>
        </div>
        
        <Separator />
        
        <div>
          <Label htmlFor="export-quality">Export Quality</Label>
          <Select defaultValue="high">
            <SelectTrigger id="export-quality" className="mt-1">
              <SelectValue placeholder="Select quality" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low (72 DPI)</SelectItem>
              <SelectItem value="medium">Medium (150 DPI)</SelectItem>
              <SelectItem value="high">High (300 DPI)</SelectItem>
              <SelectItem value="ultra">Ultra (600 DPI)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">
            Higher quality results in larger file sizes
          </p>
        </div>
        
        <div>
          <Label htmlFor="export-format">Export Format</Label>
          <Select defaultValue="png">
            <SelectTrigger id="export-format" className="mt-1">
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="jpg">JPG</SelectItem>
              <SelectItem value="png">PNG</SelectItem>
              <SelectItem value="webp">WEBP</SelectItem>
              <SelectItem value="pdf">PDF</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Separator />
        
        <div>
          <Label htmlFor="auto-save">Auto-Save</Label>
          <div className="flex items-center gap-2 mt-1.5">
            <Switch id="auto-save" defaultChecked={true} />
            <Label htmlFor="auto-save" className="font-normal text-sm">
              Save changes automatically
            </Label>
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h4 className="text-sm font-medium mb-2">Template Information</h4>
          {template ? (
            <div className="text-sm space-y-1">
              <p><span className="font-medium">Name:</span> {template.name}</p>
              <p><span className="font-medium">Sport:</span> {template.sport || 'N/A'}</p>
              <p><span className="font-medium">Style:</span> {template.style || 'Standard'}</p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No template selected
            </p>
          )}
        </div>
        
        <div className="pt-4">
          <Button variant="outline" className="w-full" size="sm">
            Reset to Default Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;

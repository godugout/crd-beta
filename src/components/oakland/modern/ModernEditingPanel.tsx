
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { X, Type, Palette, Sparkles } from 'lucide-react';
import { OaklandCardTemplate } from '@/lib/data/oaklandCardTemplates';

interface CardData {
  title: string;
  subtitle: string;
  description: string;
  player?: string;
  team: string;
  year?: string;
  tags: string[];
}

interface ModernEditingPanelProps {
  type: 'text' | 'colors' | 'effects';
  cardData: CardData;
  template: OaklandCardTemplate | null;
  onDataChange: (data: CardData) => void;
  onClose: () => void;
}

const ModernEditingPanel: React.FC<ModernEditingPanelProps> = ({
  type,
  cardData,
  template,
  onDataChange,
  onClose
}) => {
  const handleChange = (field: keyof CardData, value: string) => {
    onDataChange({
      ...cardData,
      [field]: value
    });
  };

  const panelConfig = {
    text: {
      icon: Type,
      title: 'Edit Text',
      description: 'Customize the text content of your memory card'
    },
    colors: {
      icon: Palette,
      title: 'Colors & Style',
      description: 'Adjust colors and visual styling'
    },
    effects: {
      icon: Sparkles,
      title: 'Effects',
      description: 'Add special effects and finishes'
    }
  };

  const config = panelConfig[type];
  const Icon = config.icon;

  return (
    <div className="bg-white border-t border-gray-200 shadow-lg">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#003831]/10 rounded-lg">
              <Icon className="h-5 w-5 text-[#003831]" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{config.title}</h3>
              <p className="text-sm text-gray-500">{config.description}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {type === 'text' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="title">Card Title</Label>
                <Input
                  id="title"
                  value={cardData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Enter card title"
                  className="font-medium"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input
                  id="subtitle"
                  value={cardData.subtitle}
                  onChange={(e) => handleChange('subtitle', e.target.value)}
                  placeholder="Enter subtitle"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="player">Player Name</Label>
                <Input
                  id="player"
                  value={cardData.player || ''}
                  onChange={(e) => handleChange('player', e.target.value)}
                  placeholder="Enter player name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  value={cardData.year || ''}
                  onChange={(e) => handleChange('year', e.target.value)}
                  placeholder="Enter year"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={cardData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Enter card description"
                  rows={3}
                />
              </div>
            </>
          )}

          {type === 'colors' && (
            <div className="md:col-span-3">
              <div className="text-center text-gray-500 py-8">
                Color customization coming soon! 🎨
              </div>
            </div>
          )}

          {type === 'effects' && (
            <div className="md:col-span-3">
              <div className="text-center text-gray-500 py-8">
                Effect customization coming soon! ✨
              </div>
            </div>
          )}
        </div>

        {/* Template Info */}
        {template && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Template: {template.name}</h4>
            <p className="text-sm text-gray-600 mb-2">{template.description}</p>
            <div className="flex flex-wrap gap-1">
              {template.metadata.tags.map(tag => (
                <span key={tag} className="bg-[#EFB21E]/20 text-[#003831] text-xs px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernEditingPanel;

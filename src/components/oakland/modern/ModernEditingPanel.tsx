
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { X, Type, Palette, Sparkles, User, Calendar, MapPin } from 'lucide-react';
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
      description: 'Customize the text content of your memory card',
      gradient: 'from-blue-500 to-purple-600'
    },
    colors: {
      icon: Palette,
      title: 'Colors & Style',
      description: 'Adjust colors and visual styling',
      gradient: 'from-pink-500 to-orange-500'
    },
    effects: {
      icon: Sparkles,
      title: 'Effects',
      description: 'Add special effects and finishes',
      gradient: 'from-emerald-500 to-teal-600'
    }
  };

  const config = panelConfig[type];
  const Icon = config.icon;

  return (
    <div className="bg-white/95 backdrop-blur-md border-t border-gray-200/60 shadow-2xl">
      <div className="p-8">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className={`p-3 bg-gradient-to-br ${config.gradient} rounded-2xl shadow-lg`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{config.title}</h3>
              <p className="text-sm text-gray-500 font-medium">{config.description}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="hover:bg-gray-100 rounded-xl p-2"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Enhanced Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {type === 'text' && (
            <>
              <div className="space-y-3">
                <Label htmlFor="title" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Type className="h-4 w-4" />
                  Card Title
                </Label>
                <Input
                  id="title"
                  value={cardData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Enter card title"
                  className="font-semibold border-gray-300 focus:border-[#003831] focus:ring-[#003831]/20 rounded-xl bg-white shadow-sm"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="subtitle" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Type className="h-4 w-4" />
                  Subtitle
                </Label>
                <Input
                  id="subtitle"
                  value={cardData.subtitle}
                  onChange={(e) => handleChange('subtitle', e.target.value)}
                  placeholder="Enter subtitle"
                  className="border-gray-300 focus:border-[#003831] focus:ring-[#003831]/20 rounded-xl bg-white shadow-sm"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="player" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Player Name
                </Label>
                <Input
                  id="player"
                  value={cardData.player || ''}
                  onChange={(e) => handleChange('player', e.target.value)}
                  placeholder="Enter player name"
                  className="border-gray-300 focus:border-[#003831] focus:ring-[#003831]/20 rounded-xl bg-white shadow-sm"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="year" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Year
                </Label>
                <Input
                  id="year"
                  value={cardData.year || ''}
                  onChange={(e) => handleChange('year', e.target.value)}
                  placeholder="Enter year"
                  className="border-gray-300 focus:border-[#003831] focus:ring-[#003831]/20 rounded-xl bg-white shadow-sm"
                />
              </div>

              <div className="md:col-span-2 space-y-3">
                <Label htmlFor="description" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={cardData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Enter card description"
                  rows={4}
                  className="border-gray-300 focus:border-[#003831] focus:ring-[#003831]/20 rounded-xl bg-white shadow-sm"
                />
              </div>
            </>
          )}

          {type === 'colors' && (
            <div className="md:col-span-3">
              <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-dashed border-gray-300">
                <Palette className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Color Customization</h3>
                <p className="text-gray-500">Advanced color controls coming soon! 🎨</p>
              </div>
            </div>
          )}

          {type === 'effects' && (
            <div className="md:col-span-3">
              <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-dashed border-gray-300">
                <Sparkles className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Effect Customization</h3>
                <p className="text-gray-500">Stunning visual effects coming soon! ✨</p>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Template Info */}
        {template && (
          <div className="mt-8 p-6 bg-gradient-to-r from-gray-50/80 to-white rounded-2xl border border-gray-200/60 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gradient-to-br from-[#003831] to-[#2F5233] rounded-xl shadow-lg">
                <Icon className="h-5 w-5 text-[#EFB21E]" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 mb-2 text-lg">Template: {template.name}</h4>
                <p className="text-gray-600 mb-4 leading-relaxed">{template.description}</p>
                <div className="flex flex-wrap gap-2">
                  {template.metadata.tags.map(tag => (
                    <span 
                      key={tag} 
                      className="bg-gradient-to-r from-[#EFB21E]/20 to-[#003831]/20 text-[#003831] text-xs px-3 py-1.5 rounded-full font-medium border border-[#EFB21E]/30"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernEditingPanel;

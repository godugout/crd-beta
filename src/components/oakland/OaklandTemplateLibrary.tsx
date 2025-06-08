import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Home, Plus, LogIn, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/auth/AuthProvider';
import { OaklandTemplate } from '@/lib/types/oaklandTypes';

interface TemplatePreviewProps {
  template: OaklandTemplate;
  onSelect?: (template: OaklandTemplate) => void;
}

const TemplatePreview: React.FC<TemplatePreviewProps> = ({ template, onSelect }) => {
  const getEraIcon = (era?: string) => {
    const eraMap: Record<string, string> = {
      'dynasty_70s': '👑',
      'bash_brothers': '💪',
      'moneyball': '📊',
      'playoff_runs': '🎯',
      'farewell': '👋',
      'early_years': '🌱'
    };
    return eraMap[era || ''] || '⚾';
  };

  const getCategoryColor = (category: string) => {
    const colorMap: Record<string, string> = {
      'nostalgia': 'oakland-emotion-badge nostalgia',
      'protest': 'oakland-emotion-badge protest',
      'community': 'oakland-emotion-badge hope',
      'celebration': 'oakland-emotion-badge joy',
      'championship': 'oakland-era-badge'
    };
    return colorMap[category] || 'oakland-emotion-badge';
  };

  return (
    <Card className="oakland-memory-card cursor-pointer group" onClick={() => onSelect?.(template)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Badge className={getCategoryColor(template.category)}>
            {getEraIcon(template.era)} {template.category}
          </Badge>
          <Badge variant="outline" className="text-yellow-400 border-yellow-500">
            {template.usage_count || 0} uses
          </Badge>
        </div>
        <CardTitle className="text-white font-display text-lg group-hover:text-yellow-400 transition-colors">
          {template.name}
        </CardTitle>
        {template.description && (
          <CardDescription className="text-gray-300 text-sm">
            {template.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {/* Template Preview Area */}
        <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 mb-4 min-h-[200px] flex items-center justify-center overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-full bg-repeat" 
                 style={{
                   backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-11.046-8.954-20-20-20v20h20z'/%3E%3C/g%3E%3C/svg%3E")`
                 }}
            />
          </div>
          
          {/* Template Preview Content */}
          <div className="relative z-10 text-center">
            <div className="text-4xl mb-2">{getEraIcon(template.era)}</div>
            <h3 className="text-white font-display text-lg mb-1">{template.name}</h3>
            <p className="text-gray-400 text-sm">{template.category} template</p>
          </div>
        </div>

        {/* Template Tags */}
        {template.tags && template.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {template.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const OaklandTemplateLibrary: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Sample Oakland templates based on the database structure
  const oaklandTemplates: OaklandTemplate[] = [
    {
      id: 'dynasty-gold',
      name: 'Dynasty Gold',
      category: 'championship',
      era: 'dynasty_70s',
      description: 'Celebrate the championship years with golden glory',
      config: { 
        background: 'linear-gradient(135deg, #FFD700 0%, #B8860B 100%)',
        primaryColor: '#003831',
        accentColor: '#FFD700'
      },
      tags: ['championship', 'golden', 'vintage'],
      usage_count: 156,
      created_at: new Date().toISOString()
    },
    {
      id: 'bash-brothers',
      name: 'Bash Brothers',
      category: 'celebration',
      era: 'bash_brothers',
      description: 'Power-hitting era with bold, muscular design',
      config: {
        background: 'linear-gradient(135deg, #1E3A5F 0%, #0F1D2F 100%)',
        primaryColor: '#FFD700',
        accentColor: '#FFFFFF'
      },
      tags: ['power', 'brothers', '80s'],
      usage_count: 89,
      created_at: new Date().toISOString()
    },
    {
      id: 'moneyball-stats',
      name: 'Moneyball Analytics',
      category: 'community',
      era: 'moneyball',
      description: 'Statistical revolution with clean, analytical design',
      config: {
        background: 'linear-gradient(135deg, #2D5A3D 0%, #1A3A2A 100%)',
        primaryColor: '#C4A962',
        accentColor: '#E5E5E5'
      },
      tags: ['analytics', 'stats', 'modern'],
      usage_count: 234,
      created_at: new Date().toISOString()
    },
    {
      id: 'protest-voice',
      name: 'Fan Protest',
      category: 'protest',
      era: 'farewell',
      description: 'Bold activism template for fan voices',
      config: {
        background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
        primaryColor: '#FFFFFF',
        accentColor: '#FFD700'
      },
      tags: ['activism', 'protest', 'voice'],
      usage_count: 67,
      created_at: new Date().toISOString()
    },
    {
      id: 'coliseum-nostalgia',
      name: 'Coliseum Memories',
      category: 'nostalgia',
      era: 'early_years',
      description: 'Vintage ballpark atmosphere with warm tones',
      config: {
        background: 'linear-gradient(135deg, #92400E 0%, #654321 100%)',
        primaryColor: '#EFB21E',
        accentColor: '#FFFFFF'
      },
      tags: ['coliseum', 'vintage', 'ballpark'],
      usage_count: 178,
      created_at: new Date().toISOString()
    },
    {
      id: 'playoff-magic',
      name: 'Playoff Magic',
      category: 'celebration',
      era: 'playoff_runs',
      description: 'Capture the excitement of October baseball',
      config: {
        background: 'linear-gradient(135deg, #003831 0%, #2F5233 100%)',
        primaryColor: '#EFB21E',
        accentColor: '#87CEEB'
      },
      tags: ['playoffs', 'october', 'magic'],
      usage_count: 142,
      created_at: new Date().toISOString()
    }
  ];

  const categories = [
    { id: 'all', name: 'All Templates', count: oaklandTemplates.length },
    { id: 'nostalgia', name: 'Nostalgia', count: oaklandTemplates.filter(t => t.category === 'nostalgia').length },
    { id: 'protest', name: 'Protest', count: oaklandTemplates.filter(t => t.category === 'protest').length },
    { id: 'community', name: 'Community', count: oaklandTemplates.filter(t => t.category === 'community').length },
    { id: 'celebration', name: 'Celebration', count: oaklandTemplates.filter(t => t.category === 'celebration').length },
    { id: 'championship', name: 'Championship', count: oaklandTemplates.filter(t => t.category === 'championship').length }
  ];

  const filteredTemplates = selectedCategory === 'all' 
    ? oaklandTemplates 
    : oaklandTemplates.filter(template => template.category === selectedCategory);

  const handleTemplateSelect = (template: OaklandTemplate) => {
    console.log('Selected template:', template);
    // This would integrate with the memory creator
  };

  return (
    <div className="min-h-screen bg-oakland-primary">
      {/* Navigation Header */}
      <header className="border-b border-green-600/30 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-white hover:bg-gray-700 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to OAK.FAN
            </Button>
            <div className="hidden sm:block">
              <h1 className="text-xl font-display font-bold text-white">Template Library</h1>
              <p className="text-yellow-400 text-sm font-nostalgia">Choose your Oakland style</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
              size="sm"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
            {user ? (
              <>
                <Button 
                  onClick={() => navigate('/oakland/create')}
                  className="btn-oakland-primary"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Memory
                </Button>
                <Button 
                  variant="outline" 
                  onClick={logout}
                  size="sm"
                  className="border-gray-600 text-white hover:bg-gray-700"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button 
                onClick={() => navigate('/auth')}
                className="btn-oakland-primary"
                size="sm"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Join
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-oakland-hero font-protest text-white mb-4">
            Oakland Template Library
          </h1>
          <p className="text-xl text-yellow-400 font-display">
            Authentic designs for every Oakland memory
          </p>
        </div>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 bg-gray-800/50">
            {categories.map((category) => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black font-display"
              >
                {category.name}
                <Badge variant="secondary" className="ml-2 text-xs">
                  {category.count}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <TemplatePreview
              key={template.id}
              template={template}
              onSelect={handleTemplateSelect}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⚾</div>
            <h3 className="text-xl font-display text-white mb-2">
              No templates found
            </h3>
            <p className="text-gray-400">
              Try selecting a different category
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-gray-700">
          <p className="text-gray-400 text-sm">
            More templates are being added regularly. Submit your own designs to the community!
          </p>
        </div>
      </div>
    </div>
  );
};

export default OaklandTemplateLibrary;

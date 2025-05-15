
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Search, Star, Plus, Download, Share } from 'lucide-react';
import { toast } from '@/lib/utils/toast';
import { CardTemplate } from '@/lib/types/cardTypes';

// Define available categories
const CATEGORIES = [
  'All',
  'Sports',
  'Baseball',
  'Basketball',
  'Football',
  'Hockey',
  'Soccer',
  'Memorabilia',
  'Custom'
];

interface TemplateSystemProps {
  onSelectTemplate: (template: CardTemplate) => void;
  onSaveTemplate?: (template: CardTemplate) => Promise<void>;
  onShareTemplate?: (templateId: string) => void;
  userTemplates?: CardTemplate[];
  communityTemplates?: CardTemplate[];
}

export function TemplateSystem({
  onSelectTemplate,
  onSaveTemplate,
  onShareTemplate,
  userTemplates = [],
  communityTemplates = []
}: TemplateSystemProps) {
  const [activeTab, setActiveTab] = useState('official');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredTemplates, setFilteredTemplates] = useState<CardTemplate[]>([]);
  
  // Mock official templates
  const officialTemplates: CardTemplate[] = [
    {
      id: 'template-1',
      name: 'Baseball Classic',
      description: 'Classic baseball card design with stats',
      thumbnailUrl: '/images/templates/baseball-classic.png',
      category: 'Baseball',
      popularity: 125,
      isOfficial: true,
      cardStyle: {
        template: 'baseball-classic',
        effect: 'none',
        borderRadius: '8px',
        borderColor: '#000000',
        shadowColor: '#000000',
        frameWidth: 4,
        frameColor: '#D4AF37'
      },
      textStyle: {
        titleColor: '#000000',
        titleAlignment: 'center',
        titleWeight: 'bold',
        descriptionColor: '#333333'
      }
    },
    {
      id: 'template-2',
      name: 'Basketball Pro',
      description: 'Modern basketball card design',
      thumbnailUrl: '/images/templates/basketball-pro.png',
      category: 'Basketball',
      popularity: 89,
      isOfficial: true,
      cardStyle: {
        template: 'basketball-pro',
        effect: 'gradient',
        borderRadius: '12px',
        borderColor: '#FF4500',
        shadowColor: '#000000',
        frameWidth: 2,
        frameColor: '#FF4500'
      },
      textStyle: {
        titleColor: '#FFFFFF',
        titleAlignment: 'center',
        titleWeight: 'bold',
        descriptionColor: '#EEEEEE'
      }
    },
    {
      id: 'template-3',
      name: 'Soccer Star',
      description: 'International soccer player template',
      thumbnailUrl: '/images/templates/soccer-star.png',
      category: 'Soccer',
      popularity: 112,
      isOfficial: true,
      cardStyle: {
        template: 'soccer-star',
        effect: 'shine',
        borderRadius: '8px',
        borderColor: '#006600',
        shadowColor: '#000000',
        frameWidth: 3,
        frameColor: '#FFFFFF'
      },
      textStyle: {
        titleColor: '#000000',
        titleAlignment: 'center',
        titleWeight: 'bold',
        descriptionColor: '#333333'
      }
    }
  ];

  // Handler for template selection
  const handleTemplateSelect = (template: CardTemplate) => {
    onSelectTemplate(template);
    toast({
      title: "Template applied",
      description: `Applied ${template.name} template to your card`
    });
  };

  // Handler for template saving
  const handleSaveTemplate = async (template: Partial<CardTemplate>) => {
    if (!onSaveTemplate) return;

    try {
      await onSaveTemplate(template as CardTemplate);
      toast({
        title: "Template saved",
        description: "Your custom template has been saved"
      });
    } catch (error) {
      toast({
        title: "Error saving template",
        description: "There was an error saving your template",
        variant: "destructive"
      });
    }
  };

  // Handler for template sharing
  const handleShareTemplate = (templateId: string) => {
    if (!onShareTemplate) return;
    
    onShareTemplate(templateId);
    toast({
      title: "Template shared",
      description: "Template link copied to clipboard"
    });
  };

  // Filter templates based on search query and selected category
  useEffect(() => {
    let templates: CardTemplate[] = [];
    
    // Select templates based on active tab
    switch (activeTab) {
      case 'official':
        templates = officialTemplates;
        break;
      case 'my-templates':
        templates = userTemplates;
        break;
      case 'community':
        templates = communityTemplates;
        break;
      default:
        templates = [...officialTemplates, ...userTemplates];
    }
    
    // Apply category filter
    if (selectedCategory !== 'All') {
      templates = templates.filter(t => t.category === selectedCategory);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      templates = templates.filter(t => 
        t.name.toLowerCase().includes(query) || 
        t.description?.toLowerCase().includes(query)
      );
    }
    
    setFilteredTemplates(templates);
  }, [activeTab, selectedCategory, searchQuery, userTemplates, communityTemplates]);

  return (
    <div className="template-system w-full">
      <div className="search-and-filter flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          {CATEGORIES.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="official">Official</TabsTrigger>
          <TabsTrigger value="my-templates">My Templates</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
        </TabsList>
        
        <TabsContent value="official" className="space-y-4">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No templates match your search</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredTemplates.map(template => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onSelect={handleTemplateSelect}
                  onShare={onShareTemplate ? () => handleShareTemplate(template.id) : undefined}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="my-templates" className="space-y-4">
          <div className="flex justify-end mb-4">
            <Button onClick={() => toast({ title: "Feature coming soon", description: "Template creator will be available soon" })}>
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          </div>
          
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">You haven't created any templates yet</p>
              <Button variant="outline" className="mt-4" onClick={() => toast({ title: "Feature coming soon", description: "Template creator will be available soon" })}>
                Create Your First Template
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredTemplates.map(template => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onSelect={handleTemplateSelect}
                  onSave={onSaveTemplate ? () => handleSaveTemplate(template) : undefined}
                  onShare={onShareTemplate ? () => handleShareTemplate(template.id) : undefined}
                  editable
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="community" className="space-y-4">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No community templates found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredTemplates.map(template => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onSelect={handleTemplateSelect}
                  onSave={onSaveTemplate ? () => handleSaveTemplate(template) : undefined}
                  onShare={onShareTemplate ? () => handleShareTemplate(template.id) : undefined}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Template card component
interface TemplateCardProps {
  template: CardTemplate;
  onSelect: (template: CardTemplate) => void;
  onSave?: () => void;
  onShare?: () => void;
  editable?: boolean;
}

function TemplateCard({
  template,
  onSelect,
  onSave,
  onShare,
  editable
}: TemplateCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="relative aspect-[2.5/3.5] bg-gray-200 cursor-pointer" onClick={() => onSelect(template)}>
        {template.thumbnailUrl ? (
          <img
            src={template.thumbnailUrl}
            alt={template.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            No Preview
          </div>
        )}
        
        {template.isOfficial && (
          <Badge className="absolute top-2 right-2 bg-blue-500">
            Official
          </Badge>
        )}
        
        {template.popularity && template.popularity > 100 && (
          <Badge variant="outline" className="absolute bottom-2 left-2 bg-white/80">
            <Star className="h-3 w-3 mr-1 text-yellow-500 fill-yellow-500" />
            Popular
          </Badge>
        )}
      </div>
      
      <CardContent className="p-3">
        <h3 className="font-semibold truncate">{template.name}</h3>
        <p className="text-sm text-gray-500 truncate">{template.description}</p>
        
        <div className="flex mt-2 gap-2">
          <Button 
            variant="default" 
            size="sm" 
            className="flex-1"
            onClick={() => onSelect(template)}
          >
            Use
          </Button>
          
          <div className="flex gap-1">
            {onSave && (
              <Button variant="outline" size="sm" onClick={onSave}>
                <Download className="h-4 w-4" />
                <span className="sr-only">Save</span>
              </Button>
            )}
            
            {onShare && (
              <Button variant="outline" size="sm" onClick={onShare}>
                <Share className="h-4 w-4" />
                <span className="sr-only">Share</span>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

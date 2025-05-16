import React, { useState, useEffect, useCallback } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Search, Plus, Upload, Loader2 } from "lucide-react"
import { ElementCategory, CardElement, ElementUploadMetadata } from '@/lib/types/cardElements';
import { useToast } from "@/hooks/use-toast"
import AssetUploader from '@/components/ugc/AssetUploader';
import { storageOperations } from '@/lib/supabase/storage';

interface CategoryCardProps {
  title: string;
  description: string;
  count: number;
  onClick: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, description, count, onClick }) => {
  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Label className="text-muted-foreground">{count} elements</Label>
      </CardContent>
    </Card>
  );
};

interface ElementCardProps {
  element: CardElement;
  onSelect: (element: CardElement) => void;
}

const ElementCard: React.FC<ElementCardProps> = ({ element, onSelect }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onSelect(element)}>
            <CardHeader>
              <CardTitle>{element.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <Avatar>
                <AvatarImage src={element.thumbnailUrl || element.url} alt={element.name} />
                <AvatarFallback>{element.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
            </CardContent>
          </Card>
        </TooltipTrigger>
        <TooltipContent>
          <p>{element.description || 'No description'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

interface ElementLibraryBrowserProps {
  onElementSelect: (element: CardElement) => void;
}

const ElementLibraryBrowser: React.FC<ElementLibraryBrowserProps> = ({ onElementSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ElementCategory | null>(null);
  const [showUploader, setShowUploader] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  // Mock data for categories and elements
  const categories = Object.values(ElementCategory);
  const decorativeElements: CardElement[] = [
    {
      id: 'decorative-1',
      name: 'Sparkle',
      description: 'A shiny sparkle effect',
      type: 'decoration',
      category: ElementCategory.DECORATIVE,
      url: '/sparkle.png',
      tags: ['sparkle', 'shiny'],
      position: { x: 0, y: 0 },
      size: { width: 50, height: 50 }
    },
    {
      id: 'decorative-2',
      name: 'Glitter',
      description: 'A glitter overlay',
      type: 'decoration',
      category: ElementCategory.DECORATIVE,
      url: '/glitter.png',
      tags: ['glitter', 'shiny'],
      position: { x: 0, y: 0 },
      size: { width: 50, height: 50 }
    }
  ];
  const teamElements: CardElement[] = [
    {
      id: 'team-1',
      name: 'Team A Logo',
      description: 'The official logo of Team A',
      type: 'logo',
      category: ElementCategory.TEAMS,
      url: '/team-a-logo.png',
      tags: ['team a', 'logo'],
      position: { x: 0, y: 0 },
      size: { width: 50, height: 50 }
    },
    {
      id: 'team-2',
      name: 'Team B Logo',
      description: 'The official logo of Team B',
      type: 'logo',
      category: ElementCategory.TEAMS,
      url: '/team-b-logo.png',
      tags: ['team b', 'logo'],
      position: { x: 0, y: 0 },
      size: { width: 50, height: 50 }
    }
  ];

  const handleUploadComplete = useCallback((asset: ElementUploadMetadata) => {
    setIsUploading(false);
    toast({
      title: 'Upload Complete',
      description: `${asset.name} has been uploaded`,
    });
  }, [toast]);

  const filteredElements = () => {
    let elements: CardElement[] = [];
    if (selectedCategory === ElementCategory.DECORATIVE) {
      elements = decorativeElements;
    } else if (selectedCategory === ElementCategory.TEAMS) {
      elements = teamElements;
    }

    return elements.filter(element =>
      element.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      element.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };

  return (
    <Tabs defaultValue="browse" className="w-full space-y-4">
      <TabsList>
        <TabsTrigger value="browse">Browse</TabsTrigger>
        <TabsTrigger value="upload">Upload</TabsTrigger>
      </TabsList>
      <TabsContent value="browse" className="space-y-4">
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search elements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <CategoryCard
            key="decorative"
            title="Decorative"
            description="Add decorative elements to your cards"
            count={decorativeElements.length}
            onClick={() => setSelectedCategory(ElementCategory.DECORATIVE)}
          />
          <CategoryCard
            key="teams"
            title="Teams"
            description="Team logos and branding elements"
            count={teamElements.length}
            onClick={() => setSelectedCategory(ElementCategory.TEAMS)}
          />
        </div>
        <ScrollArea className="rounded-md border p-4 h-[400px]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {filteredElements().map(element => (
              <ElementCard key={element.id} element={element} onSelect={onElementSelect} />
            ))}
          </div>
        </ScrollArea>
      </TabsContent>
      <TabsContent value="upload" className="space-y-4">
        {showUploader ? (
          <>
            {isUploading && (
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="h-6 w-6 animate-spin" />
                <p>Uploading...</p>
              </div>
            )}
            <AssetUploader onUploadComplete={handleUploadComplete} />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4">
            <p className="text-sm text-gray-500">
              Click the button below to upload your own elements
            </p>
            <Button onClick={() => setShowUploader(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Element
            </Button>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default ElementLibraryBrowser;

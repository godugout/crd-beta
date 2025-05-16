
import React, { useState } from 'react';
import { usePersonalizationContext } from '@/context/PersonalizationContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckIcon, Trash2 } from 'lucide-react';
import { BrandProfile } from '@/lib/types/userPreferences';

const BrandProfileManager: React.FC = () => {
  const { preferences, createBrandProfile, setActiveBrand } = usePersonalizationContext();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    logoUrl: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    textColor: string;
    backgroundColor: string;
    fontFamily: string;
    headingFont: string;
    bodyFont: string;
  }>({
    name: '',
    description: '',
    logoUrl: '',
    primaryColor: '#3b82f6',
    secondaryColor: '#10b981',
    accentColor: '#f59e0b',
    textColor: '#111827',
    backgroundColor: '#ffffff',
    fontFamily: 'Inter, sans-serif',
    headingFont: 'Inter, sans-serif',
    bodyFont: 'Inter, sans-serif',
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const newBrandProfile: Omit<BrandProfile, 'id' | 'createdAt' | 'updatedAt'> = {
        name: formData.name,
        description: formData.description,
        logoUrl: formData.logoUrl || undefined,
        colors: {
          primary: formData.primaryColor,
          secondary: formData.secondaryColor,
          accent: formData.accentColor,
          text: formData.textColor,
          background: formData.backgroundColor,
        },
        typography: {
          fontFamily: formData.fontFamily,
          headingFont: formData.headingFont || undefined,
          bodyFont: formData.bodyFont || undefined,
        },
        assets: {
          logos: [],
          backgrounds: [],
          elements: []
        },
        templates: []
      };
      
      await createBrandProfile(newBrandProfile);
      
      toast({
        title: "Brand profile created",
        description: "Your new brand profile has been created successfully.",
      });
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        logoUrl: '',
        primaryColor: '#3b82f6',
        secondaryColor: '#10b981',
        accentColor: '#f59e0b',
        textColor: '#111827',
        backgroundColor: '#ffffff',
        fontFamily: 'Inter, sans-serif',
        headingFont: 'Inter, sans-serif',
        bodyFont: 'Inter, sans-serif',
      });
    } catch (error) {
      console.error('Failed to create brand profile:', error);
      toast({
        title: "Failed to create brand profile",
        description: "An error occurred while creating your brand profile.",
        variant: "destructive",
      });
    }
  };
  
  const handleSetActive = async (profileId: string) => {
    try {
      await setActiveBrand(profileId);
      toast({
        title: "Active brand updated",
        description: "Your active brand profile has been updated.",
      });
    } catch (error) {
      console.error('Failed to set active brand:', error);
      toast({
        title: "Failed to update",
        description: "An error occurred while updating your active brand profile.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Brand Profile Management</CardTitle>
        <CardDescription>Create and manage your brand profiles</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="manage" className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="manage">Manage Brands</TabsTrigger>
            <TabsTrigger value="create">Create New Brand</TabsTrigger>
          </TabsList>
          
          <TabsContent value="manage">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Your Brand Profiles</h3>
              
              {!preferences || preferences.brandProfiles.length === 0 ? (
                <div className="border rounded-lg p-6 text-center">
                  <p className="text-muted-foreground">You haven't created any brand profiles yet.</p>
                  <Button className="mt-4" variant="outline">Create Your First Brand</Button>
                </div>
              ) : (
                <ScrollArea className="h-[400px] rounded-md border">
                  <div className="p-4 space-y-4">
                    {preferences.brandProfiles.map((profile) => (
                      <div 
                        key={profile.id} 
                        className="border rounded-lg p-4 hover:border-primary transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-lg">{profile.name}</h4>
                            {profile.description && (
                              <p className="text-sm text-muted-foreground">{profile.description}</p>
                            )}
                          </div>
                          
                          {profile.id === preferences.activeBrandProfileId ? (
                            <div className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full flex items-center">
                              <CheckIcon className="w-3 h-3 mr-1" />
                              <span>Active</span>
                            </div>
                          ) : (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleSetActive(profile.id)}
                            >
                              Set Active
                            </Button>
                          )}
                        </div>
                        
                        <div className="mt-4">
                          <h5 className="text-sm font-medium mb-2">Brand Colors</h5>
                          <div className="flex gap-3 flex-wrap">
                            <ColorSwatch 
                              color={profile.colors.primary} 
                              name="Primary" 
                            />
                            <ColorSwatch 
                              color={profile.colors.secondary} 
                              name="Secondary" 
                            />
                            <ColorSwatch 
                              color={profile.colors.accent} 
                              name="Accent" 
                            />
                            <ColorSwatch 
                              color={profile.colors.text} 
                              name="Text" 
                            />
                            <ColorSwatch 
                              color={profile.colors.background} 
                              name="Background" 
                            />
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <h5 className="text-sm font-medium mb-1">Typography</h5>
                          <p className="text-sm text-muted-foreground">
                            {profile.typography.fontFamily}
                            {profile.typography.headingFont ? ` / ${profile.typography.headingFont}` : ''}
                          </p>
                        </div>
                        
                        <div className="mt-4 flex gap-2 justify-end">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          
                          <Button variant="destructive" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="create">
            <form onSubmit={handleCreateProfile} className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Brand Name *</Label>
                    <Input 
                      id="name" 
                      name="name"
                      placeholder="My Brand" 
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="logoUrl">Logo URL</Label>
                    <Input 
                      id="logoUrl" 
                      name="logoUrl"
                      placeholder="https://example.com/logo.png" 
                      value={formData.logoUrl}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Brand Description</Label>
                  <Input 
                    id="description" 
                    name="description"
                    placeholder="A brief description of your brand" 
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Brand Colors</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">Primary Color</Label>
                    <div className="flex">
                      <div 
                        className="w-10 h-10 border rounded-l-md"
                        style={{ backgroundColor: formData.primaryColor }}
                      ></div>
                      <Input 
                        id="primaryColor" 
                        name="primaryColor"
                        type="color"
                        value={formData.primaryColor}
                        onChange={handleChange}
                        className="h-10 rounded-l-none"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="secondaryColor">Secondary Color</Label>
                    <div className="flex">
                      <div 
                        className="w-10 h-10 border rounded-l-md"
                        style={{ backgroundColor: formData.secondaryColor }}
                      ></div>
                      <Input 
                        id="secondaryColor" 
                        name="secondaryColor"
                        type="color"
                        value={formData.secondaryColor}
                        onChange={handleChange}
                        className="h-10 rounded-l-none"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="accentColor">Accent Color</Label>
                    <div className="flex">
                      <div 
                        className="w-10 h-10 border rounded-l-md"
                        style={{ backgroundColor: formData.accentColor }}
                      ></div>
                      <Input 
                        id="accentColor" 
                        name="accentColor"
                        type="color"
                        value={formData.accentColor}
                        onChange={handleChange}
                        className="h-10 rounded-l-none"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="textColor">Text Color</Label>
                    <div className="flex">
                      <div 
                        className="w-10 h-10 border rounded-l-md"
                        style={{ backgroundColor: formData.textColor }}
                      ></div>
                      <Input 
                        id="textColor" 
                        name="textColor"
                        type="color"
                        value={formData.textColor}
                        onChange={handleChange}
                        className="h-10 rounded-l-none"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="backgroundColor">Background Color</Label>
                    <div className="flex">
                      <div 
                        className="w-10 h-10 border rounded-l-md"
                        style={{ backgroundColor: formData.backgroundColor }}
                      ></div>
                      <Input 
                        id="backgroundColor" 
                        name="backgroundColor"
                        type="color"
                        value={formData.backgroundColor}
                        onChange={handleChange}
                        className="h-10 rounded-l-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Typography</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fontFamily">Primary Font</Label>
                    <Input 
                      id="fontFamily" 
                      name="fontFamily"
                      placeholder="Inter, sans-serif"
                      value={formData.fontFamily}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="headingFont">Heading Font (optional)</Label>
                    <Input 
                      id="headingFont" 
                      name="headingFont"
                      placeholder="Same as primary font"
                      value={formData.headingFont}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bodyFont">Body Font (optional)</Label>
                    <Input 
                      id="bodyFont" 
                      name="bodyFont"
                      placeholder="Same as primary font"
                      value={formData.bodyFont}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t flex justify-end">
                <Button type="submit" disabled={!formData.name}>
                  Create Brand Profile
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

// Helper component for color swatches
const ColorSwatch: React.FC<{ color: string; name: string }> = ({ color, name }) => {
  return (
    <div className="flex flex-col items-center">
      <div 
        className="w-8 h-8 rounded-full border"
        style={{ backgroundColor: color }}
      />
      <span className="text-xs mt-1 text-muted-foreground">{name}</span>
    </div>
  );
};

export default BrandProfileManager;

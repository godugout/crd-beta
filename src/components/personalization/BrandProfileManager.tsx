
import React, { useState, useEffect } from 'react';
import { usePersonalizationContext } from '@/context/PersonalizationContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Plus, Check, Upload, Pencil } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import toastUtils from '@/lib/utils/toast-utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BrandProfile } from '@/lib/types/userPreferences';

const BrandProfileManager: React.FC = () => {
  const { preferences, activeBrandProfile, loading, createBrandProfile, setActiveBrand } = usePersonalizationContext();
  const [isCreating, setIsCreating] = useState(false);
  const [newProfile, setNewProfile] = useState<Partial<BrandProfile>>({
    name: '',
    description: '',
    colors: {
      primary: '#1a202c',
      secondary: '#4a5568',
      accent: '#3182ce',
      text: '#2d3748',
      background: '#ffffff'
    },
    typography: {
      fontFamily: 'Inter',
    },
    assets: {
      logos: [],
      backgrounds: [],
      elements: []
    },
    templates: []
  });
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  if (!preferences) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Brand Profiles</CardTitle>
          <CardDescription>Manage your brand identities</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Brand profile data not available</p>
        </CardContent>
      </Card>
    );
  }
  
  const handleCreateProfile = async () => {
    try {
      if (!newProfile.name) {
        toastUtils.warning('Missing information', 'Please provide a name for your brand profile');
        return;
      }
      
      setIsCreating(true);
      const createdProfile = await createBrandProfile(newProfile as Omit<BrandProfile, 'id' | 'createdAt' | 'updatedAt'>);
      
      toastUtils.success('Brand profile created', `"${createdProfile.name}" has been created successfully`);
      setIsCreating(false);
      setNewProfile({
        name: '',
        description: '',
        colors: {
          primary: '#1a202c',
          secondary: '#4a5568',
          accent: '#3182ce',
          text: '#2d3748',
          background: '#ffffff'
        },
        typography: {
          fontFamily: 'Inter',
        },
        assets: {
          logos: [],
          backgrounds: [],
          elements: []
        },
        templates: []
      });
    } catch (error) {
      console.error('Failed to create brand profile:', error);
      toastUtils.error('Failed to create profile', 'Please try again');
      setIsCreating(false);
    }
  };
  
  const handleSetActiveBrand = async (profileId: string) => {
    try {
      await setActiveBrand(profileId);
      toastUtils.success('Active profile updated', 'Your brand profile has been set as active');
    } catch (error) {
      console.error('Failed to set active brand:', error);
      toastUtils.error('Failed to update active profile', 'Please try again');
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Brand Profiles</CardTitle>
        <CardDescription>Create and manage brand identities for consistent designs</CardDescription>
      </CardHeader>
      <CardContent>
        {preferences.brandProfiles.length > 0 ? (
          <>
            <h3 className="font-medium text-base mb-3">Your Brand Profiles</h3>
            <ScrollArea className="h-60 w-full pr-4">
              <div className="space-y-3">
                {preferences.brandProfiles.map(profile => (
                  <div 
                    key={profile.id} 
                    className={`border rounded-lg p-4 ${
                      activeBrandProfile?.id === profile.id ? 'border-primary bg-primary/5' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium">{profile.name}</h4>
                        {profile.description && (
                          <p className="text-sm text-muted-foreground">{profile.description}</p>
                        )}
                      </div>
                      
                      {activeBrandProfile?.id === profile.id ? (
                        <span className="bg-primary/10 text-primary text-xs rounded-full px-2 py-1 flex items-center">
                          <Check className="h-3 w-3 mr-1" />
                          Active
                        </span>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleSetActiveBrand(profile.id)}
                        >
                          Set Active
                        </Button>
                      )}
                    </div>
                    
                    <div className="mt-3">
                      <div className="flex space-x-1 mb-2">
                        {Object.entries(profile.colors).map(([key, color]) => (
                          <div
                            key={key}
                            className="h-6 w-6 rounded-full"
                            style={{ backgroundColor: color }}
                            title={key}
                          />
                        ))}
                      </div>
                      
                      <div className="flex space-x-2 text-xs text-muted-foreground">
                        <span>Font: {profile.typography.fontFamily}</span>
                        <span>•</span>
                        <span>{profile.assets.logos.length} logos</span>
                        <span>•</span>
                        <span>{profile.templates.length} templates</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex space-x-2">
                      <Button size="sm" variant="outline" className="text-xs h-7 px-2">
                        <Pencil className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs h-7 px-2">
                        <Upload className="h-3 w-3 mr-1" />
                        Export
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </>
        ) : (
          <div className="text-center py-6 bg-muted/30 rounded-lg">
            <p className="text-muted-foreground mb-2">No brand profiles yet</p>
            <Button 
              onClick={() => setIsCreating(true)}
              size="sm"
            >
              <Plus className="h-4 w-4 mr-1" />
              Create Your First Brand Profile
            </Button>
          </div>
        )}
        
        {(isCreating || preferences.brandProfiles.length > 0) && !isCreating && (
          <div className="mt-6 flex justify-end">
            <Button 
              onClick={() => setIsCreating(true)}
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-1" />
              Create New Profile
            </Button>
          </div>
        )}
        
        {isCreating && (
          <div className="mt-6 border rounded-lg p-4">
            <h3 className="font-medium text-base mb-4">Create New Brand Profile</h3>
            
            <Tabs defaultValue="basic">
              <TabsList className="mb-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="colors">Colors</TabsTrigger>
                <TabsTrigger value="typography">Typography</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4">
                <div>
                  <Label htmlFor="profile-name">Brand Name</Label>
                  <Input
                    id="profile-name"
                    value={newProfile.name}
                    onChange={(e) => setNewProfile({...newProfile, name: e.target.value})}
                    placeholder="e.g., My Sports Brand"
                  />
                </div>
                
                <div>
                  <Label htmlFor="profile-description">Description (Optional)</Label>
                  <Input
                    id="profile-description"
                    value={newProfile.description || ''}
                    onChange={(e) => setNewProfile({...newProfile, description: e.target.value})}
                    placeholder="Brief description of this brand profile"
                  />
                </div>
                
                <div>
                  <Label htmlFor="profile-logo" className="block mb-2">Logo (Optional)</Label>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-1" />
                      Upload Logo
                    </Button>
                    <span className="text-sm text-muted-foreground">No logo uploaded</span>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="colors" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="primary-color">Primary Color</Label>
                    <div className="flex mt-1">
                      <div 
                        className="h-9 w-9 rounded-l-md border border-r-0"
                        style={{ backgroundColor: newProfile.colors?.primary }}
                      />
                      <Input
                        id="primary-color"
                        value={newProfile.colors?.primary || ''}
                        onChange={(e) => setNewProfile({
                          ...newProfile, 
                          colors: {...newProfile.colors!, primary: e.target.value}
                        })}
                        className="rounded-l-none"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="secondary-color">Secondary Color</Label>
                    <div className="flex mt-1">
                      <div 
                        className="h-9 w-9 rounded-l-md border border-r-0"
                        style={{ backgroundColor: newProfile.colors?.secondary }}
                      />
                      <Input
                        id="secondary-color"
                        value={newProfile.colors?.secondary || ''}
                        onChange={(e) => setNewProfile({
                          ...newProfile, 
                          colors: {...newProfile.colors!, secondary: e.target.value}
                        })}
                        className="rounded-l-none"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="accent-color">Accent Color</Label>
                    <div className="flex mt-1">
                      <div 
                        className="h-9 w-9 rounded-l-md border border-r-0"
                        style={{ backgroundColor: newProfile.colors?.accent }}
                      />
                      <Input
                        id="accent-color"
                        value={newProfile.colors?.accent || ''}
                        onChange={(e) => setNewProfile({
                          ...newProfile, 
                          colors: {...newProfile.colors!, accent: e.target.value}
                        })}
                        className="rounded-l-none"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="text-color">Text Color</Label>
                    <div className="flex mt-1">
                      <div 
                        className="h-9 w-9 rounded-l-md border border-r-0"
                        style={{ backgroundColor: newProfile.colors?.text }}
                      />
                      <Input
                        id="text-color"
                        value={newProfile.colors?.text || ''}
                        onChange={(e) => setNewProfile({
                          ...newProfile, 
                          colors: {...newProfile.colors!, text: e.target.value}
                        })}
                        className="rounded-l-none"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="typography" className="space-y-4">
                <div>
                  <Label htmlFor="font-family">Primary Font</Label>
                  <Input
                    id="font-family"
                    value={newProfile.typography?.fontFamily || ''}
                    onChange={(e) => setNewProfile({
                      ...newProfile, 
                      typography: {...newProfile.typography!, fontFamily: e.target.value}
                    })}
                    placeholder="e.g., Inter, Arial, sans-serif"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter a web-safe font or font stack
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="heading-font">Heading Font (Optional)</Label>
                  <Input
                    id="heading-font"
                    value={newProfile.typography?.headingFont || ''}
                    onChange={(e) => setNewProfile({
                      ...newProfile, 
                      typography: {...newProfile.typography!, headingFont: e.target.value}
                    })}
                    placeholder="e.g., Montserrat, sans-serif"
                  />
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="mt-6 flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setIsCreating(false)}
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreateProfile}
                disabled={!newProfile.name || isCreating}
              >
                {isCreating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                Create Brand Profile
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BrandProfileManager;

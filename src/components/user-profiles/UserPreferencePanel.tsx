
import React, { useState, useEffect } from 'react';
import { usePersonalizationContext } from '@/context/PersonalizationContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Loader2, Save, Trash2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import toastUtils from '@/lib/utils/toast-utils';
import { WorkflowConfig } from '@/lib/types/userPreferences';

const UserPreferencePanel: React.FC = () => {
  const { preferences, loading, updateWorkflow } = usePersonalizationContext();
  const [workflowConfig, setWorkflowConfig] = useState<WorkflowConfig | null>(null);
  const [saving, setSaving] = useState(false);
  
  useEffect(() => {
    if (preferences?.workflow) {
      setWorkflowConfig(preferences.workflow);
    }
  }, [preferences]);
  
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
          <CardTitle>Personalization</CardTitle>
          <CardDescription>Your preferences and settings</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Personalization data not available</p>
        </CardContent>
      </Card>
    );
  }
  
  const handleSaveWorkflow = async () => {
    if (!workflowConfig) return;
    
    try {
      setSaving(true);
      await updateWorkflow(workflowConfig);
      toastUtils.success('Preferences saved', 'Your workflow preferences have been updated');
    } catch (error) {
      console.error('Failed to update workflow:', error);
      toastUtils.error('Failed to save preferences', 'Please try again');
    } finally {
      setSaving(false);
    }
  };
  
  const handlePanelVisibilityChange = (panelId: string) => {
    if (!workflowConfig) return;
    
    const visiblePanels = [...workflowConfig.layoutPreferences.visiblePanels];
    const collapsedPanels = [...workflowConfig.layoutPreferences.collapsedPanels];
    
    if (visiblePanels.includes(panelId)) {
      // Panel is currently visible, toggle between collapsed and expanded
      if (collapsedPanels.includes(panelId)) {
        // Remove from collapsed to expand it
        setWorkflowConfig({
          ...workflowConfig,
          layoutPreferences: {
            ...workflowConfig.layoutPreferences,
            collapsedPanels: collapsedPanels.filter(id => id !== panelId)
          }
        });
      } else {
        // Add to collapsed to collapse it
        setWorkflowConfig({
          ...workflowConfig,
          layoutPreferences: {
            ...workflowConfig.layoutPreferences,
            collapsedPanels: [...collapsedPanels, panelId]
          }
        });
      }
    } else {
      // Panel is not visible, make it visible
      setWorkflowConfig({
        ...workflowConfig,
        layoutPreferences: {
          ...workflowConfig.layoutPreferences,
          visiblePanels: [...visiblePanels, panelId],
          // Remove from collapsed if it was there
          collapsedPanels: collapsedPanels.filter(id => id !== panelId)
        }
      });
    }
  };
  
  const isPanelVisible = (panelId: string): boolean => {
    return workflowConfig?.layoutPreferences.visiblePanels.includes(panelId) || false;
  };
  
  const isPanelCollapsed = (panelId: string): boolean => {
    return workflowConfig?.layoutPreferences.collapsedPanels.includes(panelId) || false;
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personalization</CardTitle>
        <CardDescription>Customize your workflow and preferences</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="workflow">
          <TabsList className="mb-4">
            <TabsTrigger value="workflow">Workflow</TabsTrigger>
            <TabsTrigger value="visuals">Visual Preferences</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="workflow" className="space-y-6">
            {workflowConfig && (
              <>
                <div>
                  <h3 className="font-medium text-base mb-3">Default View</h3>
                  <div className="flex space-x-3">
                    <Button
                      variant={workflowConfig.defaultView === 'simple' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setWorkflowConfig({
                        ...workflowConfig,
                        defaultView: 'simple'
                      })}
                    >
                      Simple
                    </Button>
                    <Button
                      variant={workflowConfig.defaultView === 'advanced' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setWorkflowConfig({
                        ...workflowConfig,
                        defaultView: 'advanced'
                      })}
                    >
                      Advanced
                    </Button>
                    <Button
                      variant={workflowConfig.defaultView === 'expert' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setWorkflowConfig({
                        ...workflowConfig,
                        defaultView: 'expert'
                      })}
                    >
                      Expert
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-base mb-3">Panel Visibility</h3>
                  <div className="space-y-2">
                    {['tools', 'properties', 'layers', 'effects', 'elements'].map(panelId => (
                      <div key={panelId} className="flex items-center justify-between">
                        <Label htmlFor={`panel-${panelId}`} className="capitalize">
                          {panelId} Panel
                        </Label>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id={`panel-${panelId}`}
                            checked={isPanelVisible(panelId)}
                            onCheckedChange={() => handlePanelVisibilityChange(panelId)}
                          />
                          <span className="text-xs text-muted-foreground">
                            {!isPanelVisible(panelId) ? 'Hidden' : 
                              isPanelCollapsed(panelId) ? 'Collapsed' : 'Expanded'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-base mb-3">Quick Access Tools</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Select tools to show in your quick access toolbar
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {['upload', 'effects', 'text', 'elements', 'crop', 'undo', 'layers', 'download', 'share'].map(tool => (
                      <div key={tool} className="flex items-center space-x-2">
                        <Switch
                          id={`tool-${tool}`}
                          checked={workflowConfig.quickAccessTools.includes(tool)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setWorkflowConfig({
                                ...workflowConfig,
                                quickAccessTools: [...workflowConfig.quickAccessTools, tool]
                              });
                            } else {
                              setWorkflowConfig({
                                ...workflowConfig,
                                quickAccessTools: workflowConfig.quickAccessTools.filter(t => t !== tool)
                              });
                            }
                          }}
                        />
                        <Label htmlFor={`tool-${tool}`} className="capitalize">
                          {tool}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-base mb-3">Layout</h3>
                  <div className="space-y-4">
                    <div>
                      <Label className="mb-2 block">Sidebar Position</Label>
                      <div className="flex space-x-3">
                        <Button
                          variant={workflowConfig.layoutPreferences.sidebarPosition === 'left' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setWorkflowConfig({
                            ...workflowConfig,
                            layoutPreferences: {
                              ...workflowConfig.layoutPreferences,
                              sidebarPosition: 'left'
                            }
                          })}
                        >
                          Left
                        </Button>
                        <Button
                          variant={workflowConfig.layoutPreferences.sidebarPosition === 'right' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setWorkflowConfig({
                            ...workflowConfig,
                            layoutPreferences: {
                              ...workflowConfig.layoutPreferences,
                              sidebarPosition: 'right'
                            }
                          })}
                        >
                          Right
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="mb-2 block">Main Panel Size</Label>
                      <Slider
                        value={[workflowConfig.layoutPreferences.panelSizes.main || 70]}
                        min={50}
                        max={90}
                        step={5}
                        onValueChange={([value]) => setWorkflowConfig({
                          ...workflowConfig,
                          layoutPreferences: {
                            ...workflowConfig.layoutPreferences,
                            panelSizes: {
                              ...workflowConfig.layoutPreferences.panelSizes,
                              main: value,
                              sidebar: 100 - value
                            }
                          }
                        })}
                      />
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-muted-foreground">Main: {workflowConfig.layoutPreferences.panelSizes.main || 70}%</span>
                        <span className="text-xs text-muted-foreground">Sidebar: {workflowConfig.layoutPreferences.panelSizes.sidebar || 30}%</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    onClick={handleSaveWorkflow}
                    disabled={saving}
                  >
                    {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                    Save Preferences
                  </Button>
                </div>
              </>
            )}
          </TabsContent>
          
          <TabsContent value="visuals" className="space-y-6">
            <div>
              <h3 className="font-medium text-base mb-3">Color Palettes</h3>
              <ScrollArea className="h-52 w-full">
                <div className="space-y-3">
                  {preferences.colorPalettes.map(palette => (
                    <div key={palette.id} className="border rounded-md p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{palette.name}</h4>
                        {!palette.isSystem && (
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <div className="flex space-x-1">
                        {palette.colors.map((color, i) => (
                          <div
                            key={i}
                            className="h-6 flex-1 rounded"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              <div className="mt-4">
                <Button variant="outline" size="sm">
                  Create New Palette
                </Button>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-base mb-3">Favorite Items</h3>
              <div className="space-y-3">
                <div>
                  <Label className="block mb-2">Favorite Templates</Label>
                  <div className="p-3 bg-muted/30 rounded-md text-center">
                    <p className="text-sm text-muted-foreground">
                      {preferences.favoriteTemplates.length === 0 
                        ? 'No favorite templates yet' 
                        : `${preferences.favoriteTemplates.length} favorite templates`}
                    </p>
                  </div>
                </div>
                
                <div>
                  <Label className="block mb-2">Favorite Effects</Label>
                  <div className="p-3 bg-muted/30 rounded-md text-center">
                    <p className="text-sm text-muted-foreground">
                      {preferences.favoriteEffects.length === 0 
                        ? 'No favorite effects yet' 
                        : `${preferences.favoriteEffects.length} favorite effects`}
                    </p>
                  </div>
                </div>
                
                <div>
                  <Label className="block mb-2">Favorite Elements</Label>
                  <div className="p-3 bg-muted/30 rounded-md text-center">
                    <p className="text-sm text-muted-foreground">
                      {preferences.favoriteElements.length === 0 
                        ? 'No favorite elements yet' 
                        : `${preferences.favoriteElements.length} favorite elements`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="recommendations" className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-base">Smart Recommendations</h3>
                <Switch
                  id="enable-recommendations"
                  checked={preferences.recommendationsEnabled}
                />
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="template-recommendations">Template Recommendations</Label>
                  <Switch
                    id="template-recommendations"
                    checked={preferences.recommendationPreferences.showTemplateRecommendations}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="effect-recommendations">Effect Recommendations</Label>
                  <Switch
                    id="effect-recommendations"
                    checked={preferences.recommendationPreferences.showEffectRecommendations}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="color-recommendations">Color Recommendations</Label>
                  <Switch
                    id="color-recommendations"
                    checked={preferences.recommendationPreferences.showColorRecommendations}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="element-recommendations">Element Recommendations</Label>
                  <Switch
                    id="element-recommendations"
                    checked={preferences.recommendationPreferences.showElementRecommendations}
                  />
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-base mb-3">Creation History</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Your recent card creations are used to improve recommendations
              </p>
              
              <ScrollArea className="h-40 w-full">
                <div className="space-y-2">
                  {preferences.creationHistory.length > 0 ? (
                    preferences.creationHistory.slice(0, 5).map(item => (
                      <div key={item.id} className="border-b pb-2">
                        <p className="text-sm font-medium">Card: {item.cardId.slice(0, 8)}...</p>
                        <div className="flex justify-between">
                          <p className="text-xs text-muted-foreground">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {Math.round(item.timeSpent / 60)} minutes
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-sm text-muted-foreground py-4">
                      No creation history yet
                    </p>
                  )}
                </div>
              </ScrollArea>
              
              {preferences.creationHistory.length > 0 && (
                <div className="mt-2 flex justify-end">
                  <Button variant="outline" size="sm">
                    Clear History
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default UserPreferencePanel;

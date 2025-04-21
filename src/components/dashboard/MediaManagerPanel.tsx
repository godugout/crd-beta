import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Plus, Upload, X, Edit, Trash2, Tag, CheckCircle, Image as ImageIcon } from 'lucide-react';
import BatchImageUploader from '@/components/dam/BatchImageUploader';
import { DigitalAsset } from '@/lib/types/assetTypes';

const mockAssets: DigitalAsset[] = [
  {
    id: 'asset-1',
    title: 'Baseball Card Background',
    original_filename: 'baseball-bg.jpg',
    mime_type: 'image/jpeg',
    storage_path: '/assets/baseball-bg.jpg',
    description: 'Background for baseball cards',
    tags: ['baseball', 'background', 'sports'],
    user_id: 'user-1',
    file_size: 1024000,
    width: 1200,
    height: 800,
    created_at: '2023-04-15T12:00:00Z',
    updated_at: '2023-04-15T12:00:00Z',
    thumbnail_path: '/assets/thumbnails/baseball-bg.jpg',
    metadata: {
      color_profile: 'sRGB',
      resolution: '300dpi'
    }
  },
  {
    id: 'asset-2',
    title: 'Player Portrait Template',
    original_filename: 'player-template.png',
    mime_type: 'image/png',
    storage_path: '/assets/player-template.png',
    description: 'Template for player portraits',
    tags: ['template', 'portrait', 'player'],
    user_id: 'user-1',
    file_size: 2048000,
    width: 1500,
    height: 2000,
    created_at: '2023-04-10T09:30:00Z',
    updated_at: '2023-04-10T09:30:00Z',
    thumbnail_path: '/assets/thumbnails/player-template.png',
    metadata: {
      color_profile: 'Adobe RGB',
      resolution: '350dpi'
    }
  },
  {
    id: 'asset-3',
    title: 'Oakland A\'s Logo',
    original_filename: 'oakland-as-logo.svg',
    mime_type: 'image/svg+xml',
    storage_path: '/assets/oakland-as-logo.svg',
    description: 'Vector logo of Oakland Athletics',
    tags: ['logo', 'vector', 'team'],
    user_id: 'user-1',
    file_size: 512000,
    width: 800,
    height: 800,
    created_at: '2023-03-25T15:45:00Z',
    updated_at: '2023-03-25T15:45:00Z',
    thumbnail_path: '/assets/thumbnails/oakland-as-logo.png',
    metadata: {
      vector: true,
      software: 'Adobe Illustrator'
    }
  }
];

const placeholderImages = [
  'https://images.unsplash.com/photo-1508344928928-7165b5c2cb0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1583922146273-63f2d71fb84f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
];

const MediaManagerPanel: React.FC = () => {
  const [assets, setAssets] = useState<DigitalAsset[]>(mockAssets);
  const [selectedAsset, setSelectedAsset] = useState<DigitalAsset | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    tags: '',
    metadata: ''
  });
  
  const [displayMode, setDisplayMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState('browse');

  const filteredAssets = assets.filter(asset => {
    const query = searchQuery.toLowerCase();
    return (
      asset.title.toLowerCase().includes(query) ||
      asset.description?.toLowerCase().includes(query) ||
      asset.tags.some(tag => tag.toLowerCase().includes(query)) ||
      asset.original_filename.toLowerCase().includes(query)
    );
  });

  const handleSelectAsset = (asset: DigitalAsset) => {
    setSelectedAsset(asset);
    setEditFormData({
      title: asset.title,
      description: asset.description || '',
      tags: asset.tags.join(', '),
      metadata: JSON.stringify(asset.metadata, null, 2)
    });
    setIsEditing(false);
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveEdits = () => {
    if (!selectedAsset) return;
    
    try {
      let parsedMetadata;
      try {
        parsedMetadata = JSON.parse(editFormData.metadata);
      } catch (e) {
        toast.error("Invalid metadata JSON", {
          description: "Please enter valid JSON for metadata"
        });
        return;
      }
      
      const updatedAsset: DigitalAsset = {
        ...selectedAsset,
        title: editFormData.title,
        description: editFormData.description,
        tags: editFormData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        metadata: parsedMetadata,
        updated_at: new Date().toISOString()
      };
      
      setAssets(prevAssets => 
        prevAssets.map(asset => 
          asset.id === updatedAsset.id ? updatedAsset : asset
        )
      );
      
      setSelectedAsset(updatedAsset);
      setIsEditing(false);
      
      toast.success("Asset updated", {
        description: "Asset metadata has been updated successfully"
      });
    } catch (err) {
      console.error('Error updating asset:', err);
      toast.error("Update failed", {
        description: "Failed to update asset metadata"
      });
    }
  };

  const handleDeleteAsset = (assetId: string) => {
    if (window.confirm('Are you sure you want to delete this asset? This action cannot be undone.')) {
      setAssets(prevAssets => prevAssets.filter(asset => asset.id !== assetId));
      
      if (selectedAsset?.id === assetId) {
        setSelectedAsset(null);
      }
      
      toast.success("Asset deleted", {
        description: "Asset has been deleted successfully"
      });
    }
  };

  const handleUploadComplete = (urls: string[], assetIds: string[]) => {
    const newAssets: DigitalAsset[] = urls.map((url, index) => {
      const filename = url.split('/').pop() || `file-${index}.jpg`;
      return {
        id: assetIds[index] || `asset-${Date.now()}-${index}`,
        title: filename.split('.')[0],
        original_filename: filename,
        mime_type: 'image/jpeg',
        storage_path: url,
        description: '',
        tags: [],
        user_id: 'user-1',
        file_size: 1024000,
        width: 800,
        height: 600,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        thumbnail_path: url,
        metadata: {}
      };
    });
    
    setAssets(prev => [...newAssets, ...prev]);
    setActiveTab('browse');
    
    toast.success("Upload complete", {
      description: `Successfully uploaded ${urls.length} assets`
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-2">Media Manager</h2>
          <p className="text-muted-foreground">Upload, organize and manage your digital assets</p>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="browse">Browse Assets</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="organize">Organize</TabsTrigger>
          </TabsList>
          
          {activeTab === 'browse' && (
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setDisplayMode('grid')}
                className={displayMode === 'grid' ? 'bg-slate-100' : ''}
              >
                <ImageIcon className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setDisplayMode('list')}
                className={displayMode === 'list' ? 'bg-slate-100' : ''}
              >
                <Tag className="h-5 w-5" />
              </Button>
              <Input 
                placeholder="Search assets..." 
                className="w-64" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}
        </div>
        
        <TabsContent value="browse">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className={`col-span-1 ${selectedAsset ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
              {displayMode === 'grid' ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredAssets.map((asset, index) => (
                    <div 
                      key={asset.id}
                      className={`border rounded-lg overflow-hidden cursor-pointer transition-all hover:shadow-md ${
                        selectedAsset?.id === asset.id ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => handleSelectAsset(asset)}
                    >
                      <div className="aspect-square bg-gray-100 relative">
                        <img 
                          src={placeholderImages[index % placeholderImages.length]} 
                          alt={asset.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-2">
                        <h3 className="text-sm font-medium truncate">{asset.title}</h3>
                        <p className="text-xs text-gray-500 truncate">{new Date(asset.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tags</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredAssets.map((asset, index) => (
                        <tr 
                          key={asset.id}
                          className={`cursor-pointer hover:bg-gray-50 ${
                            selectedAsset?.id === asset.id ? 'bg-blue-50' : ''
                          }`}
                          onClick={() => handleSelectAsset(asset)}
                        >
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded bg-gray-100 overflow-hidden">
                                <img 
                                  src={placeholderImages[index % placeholderImages.length]}
                                  alt=""
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{asset.title}</div>
                                <div className="text-sm text-gray-500">{asset.original_filename}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{asset.mime_type}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{(asset.file_size / 1024).toFixed(0)} KB</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{new Date(asset.created_at).toLocaleDateString()}</td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex flex-wrap gap-1">
                              {asset.tags.slice(0, 2).map(tag => (
                                <span key={tag} className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                  {tag}
                                </span>
                              ))}
                              {asset.tags.length > 2 && (
                                <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                                  +{asset.tags.length - 2}
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            
            {selectedAsset && (
              <div className="col-span-1">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle>Asset Details</CardTitle>
                      <div className="flex space-x-1">
                        {isEditing ? (
                          <>
                            <Button size="icon" variant="ghost" onClick={() => setIsEditing(false)}>
                              <X className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" onClick={handleSaveEdits}>
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button size="icon" variant="ghost" onClick={() => setIsEditing(true)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" onClick={() => handleDeleteAsset(selectedAsset.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="rounded-md bg-gray-100 overflow-hidden">
                        <img 
                          src={
                            placeholderImages[
                              mockAssets.findIndex(a => a.id === selectedAsset.id) % placeholderImages.length
                            ]
                          } 
                          alt={selectedAsset.title}
                          className="w-full aspect-video object-cover"
                        />
                      </div>
                      
                      {isEditing ? (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                              id="title"
                              name="title"
                              value={editFormData.title}
                              onChange={handleEditFormChange}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                              id="description"
                              name="description"
                              value={editFormData.description}
                              onChange={handleEditFormChange}
                              rows={3}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="tags">Tags (comma-separated)</Label>
                            <Input
                              id="tags"
                              name="tags"
                              value={editFormData.tags}
                              onChange={handleEditFormChange}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="metadata">Metadata (JSON)</Label>
                            <Textarea
                              id="metadata"
                              name="metadata"
                              value={editFormData.metadata}
                              onChange={handleEditFormChange}
                              rows={5}
                              className="font-mono text-xs"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Filename</h3>
                            <p className="text-sm">{selectedAsset.original_filename}</p>
                          </div>
                          
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Title</h3>
                            <p className="text-sm">{selectedAsset.title}</p>
                          </div>
                          
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Description</h3>
                            <p className="text-sm">{selectedAsset.description || 'No description'}</p>
                          </div>
                          
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Dimensions</h3>
                            <p className="text-sm">{selectedAsset.width} × {selectedAsset.height}</p>
                          </div>
                          
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Size</h3>
                            <p className="text-sm">{(selectedAsset.file_size / 1024).toFixed(0)} KB</p>
                          </div>
                          
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Created</h3>
                            <p className="text-sm">{new Date(selectedAsset.created_at).toLocaleString()}</p>
                          </div>
                          
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Tags</h3>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {selectedAsset.tags.map(tag => (
                                <span key={tag} className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                  {tag}
                                </span>
                              ))}
                              {selectedAsset.tags.length === 0 && (
                                <p className="text-sm text-gray-400">No tags</p>
                              )}
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Metadata</h3>
                            <pre className="text-xs bg-gray-50 p-2 rounded mt-1 overflow-x-auto">
                              {JSON.stringify(selectedAsset.metadata, null, 2) || '{}'}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="upload">
          <Card>
            <CardHeader>
              <CardTitle>Upload New Assets</CardTitle>
              <CardDescription>
                Upload images to your media library
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BatchImageUploader 
                onComplete={handleUploadComplete}
                maxFiles={10}
                maxSizeMB={5}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="organize">
          <Card>
            <CardHeader>
              <CardTitle>Organize Assets</CardTitle>
              <CardDescription>
                Manage tags and collections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <h3 className="text-lg font-medium mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {Array.from(new Set(assets.flatMap(asset => asset.tags))).map(tag => (
                      <div key={tag} className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                        <span>{tag}</span>
                        <Button size="icon" variant="ghost" className="h-5 w-5 ml-1">
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Input placeholder="New tag name" className="max-w-xs" />
                    <Button>
                      <Plus className="h-4 w-4 mr-1" />
                      Add Tag
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Collections</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Group your assets into collections for easier organization
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-gray-50 border-dashed flex flex-col items-center justify-center p-4 h-48">
                      <Plus className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-gray-600 font-medium">Create Collection</p>
                    </Card>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MediaManagerPanel;

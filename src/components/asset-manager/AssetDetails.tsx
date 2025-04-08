
import React, { useState } from 'react';
import { DigitalAsset } from '@/services/digitalAssetService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Save, Trash, X, Plus, Check } from 'lucide-react';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { format } from 'date-fns';

interface AssetDetailsProps {
  asset: DigitalAsset;
  onUpdate: (updates: Partial<DigitalAsset>) => Promise<boolean>;
  onDelete: () => Promise<void>;
  className?: string;
}

const AssetDetails: React.FC<AssetDetailsProps> = ({
  asset,
  onUpdate,
  onDelete,
  className = '',
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  
  const [title, setTitle] = useState<string>(asset.title || '');
  const [description, setDescription] = useState<string>(asset.description || '');
  const [tagInput, setTagInput] = useState<string>('');
  const [tags, setTags] = useState<string[]>(asset.tags || []);
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy h:mm a');
    } catch (e) {
      return dateString;
    }
  };
  
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };
  
  const getFileIcon = (mimeType: string) => {
    // Based on mime type, return a file type
    if (mimeType.startsWith('image/')) return 'Image';
    if (mimeType.startsWith('video/')) return 'Video';
    if (mimeType.startsWith('audio/')) return 'Audio';
    if (mimeType.startsWith('text/')) return 'Text';
    if (mimeType.startsWith('application/pdf')) return 'PDF';
    return 'File';
  };
  
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const success = await onUpdate({
        title,
        description,
        tags
      });
      
      if (success) {
        setIsEditing(false);
      }
    } catch (err) {
      console.error('Failed to update asset:', err);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    
    // Add tag if it doesn't already exist
    if (!tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
    }
    
    setTagInput('');
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete();
    } catch (err) {
      console.error('Failed to delete asset:', err);
      setIsDeleting(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };
  
  return (
    <div className={`max-w-2xl mx-auto ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Asset Preview */}
        <div className="md:col-span-1">
          <Card className="overflow-hidden">
            <div className="aspect-square bg-gray-50">
              {asset.mimeType.startsWith('image/') ? (
                <OptimizedImage
                  src={asset.url}
                  alt={asset.title || asset.originalFilename}
                  className="w-full h-full object-contain"
                  placeholderSrc={asset.thumbnailUrl}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="bg-gray-200 rounded-full p-4 mx-auto mb-2">
                      <span className="text-2xl">{getFileIcon(asset.mimeType)[0]}</span>
                    </div>
                    <p className="text-gray-600 font-medium">{getFileIcon(asset.mimeType)}</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
          
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Type:</span>
              <span>{asset.mimeType}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Size:</span>
              <span>{formatFileSize(asset.fileSize)}</span>
            </div>
            
            {(asset.width && asset.height) && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Dimensions:</span>
                <span>{asset.width} x {asset.height}px</span>
              </div>
            )}
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Uploaded:</span>
              <span>{formatDate(asset.createdAt)}</span>
            </div>
            
            <div className="pt-2">
              <Button 
                variant="secondary" 
                className="w-full"
                onClick={() => window.open(asset.url, '_blank')}
              >
                View Original
              </Button>
            </div>
          </div>
        </div>
        
        {/* Asset Details */}
        <div className="md:col-span-2">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Asset title"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Asset description"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="tags">Tags</Label>
                <div className="flex space-x-2">
                  <Input
                    id="tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Add tag and press Enter"
                  />
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={handleAddTag}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag) => (
                    <Badge 
                      key={tag}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {tag}
                      <button onClick={() => handleRemoveTag(tag)} className="ml-1">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  {tags.length === 0 && (
                    <p className="text-xs text-gray-500">No tags added</p>
                  )}
                </div>
              </div>
              
              <div className="pt-4 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setTitle(asset.title || '');
                    setDescription(asset.description || '');
                    setTags(asset.tags || []);
                    setIsEditing(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold">
                    {asset.title || asset.originalFilename}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {asset.originalFilename}
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Button>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
                <p className="text-sm">
                  {asset.description || 'No description provided'}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {(asset.tags || []).map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                  {!asset.tags || asset.tags.length === 0 ? (
                    <p className="text-sm text-gray-500">No tags</p>
                  ) : null}
                </div>
              </div>
              
              <div className="pt-4">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Actions</h3>
                {isDeleting ? (
                  <div className="border border-red-200 bg-red-50 p-4 rounded-lg">
                    <p className="text-sm text-red-600 mb-3">
                      Are you sure you want to delete this asset? This action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsDeleting(false)}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleDelete}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Confirm Delete
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="destructive"
                    onClick={() => setIsDeleting(true)}
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Delete Asset
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssetDetails;

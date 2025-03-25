
import React, { useState } from 'react';
import CardUpload from '@/components/card-upload';
import { X, Plus, Scissors } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import FabricSelector from '@/components/card-upload/FabricSelector';
import FabricSwatch from '@/components/home/card-effects/FabricSwatch';

interface CardBasicInfoProps {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  tags: string[];
  setTags: (tags: string[]) => void;
  newTag: string;
  setNewTag: (tag: string) => void;
  fabricSwatches: any[];
  setFabricSwatches: (swatches: any[]) => void;
  imageFile: File | null;
  imageUrl: string;
  onImageUpload: (file: File, url: string) => void;
}

const CardBasicInfo: React.FC<CardBasicInfoProps> = ({
  title,
  setTitle,
  description,
  setDescription,
  tags,
  setTags,
  newTag,
  setNewTag,
  fabricSwatches,
  setFabricSwatches,
  imageFile,
  imageUrl,
  onImageUpload
}) => {
  const [showFabricSelector, setShowFabricSelector] = useState(false);
  
  const handleAddTag = () => {
    if (newTag.trim() !== '' && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleAddFabricSwatch = (options: any) => {
    setFabricSwatches([...fabricSwatches, options]);
    setShowFabricSelector(false);
    toast.success('Fabric swatch added!', {
      description: 'Premium fabric swatch has been added to your card'
    });
  };

  const handleRemoveFabricSwatch = (index: number) => {
    const newSwatches = [...fabricSwatches];
    newSwatches.splice(index, 1);
    setFabricSwatches(newSwatches);
  };
  
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="flex justify-center">
        <div className="relative max-w-xs">
          <CardUpload 
            onImageUpload={onImageUpload} 
            className="w-full"
            initialImageUrl={imageUrl}
          />
          
          {/* Render fabric swatches on top of the image */}
          {imageUrl && fabricSwatches.map((swatch, index) => (
            <div key={index} className="relative">
              <FabricSwatch 
                fabricType={swatch.type}
                team={swatch.team}
                year={swatch.year}
                manufacturer={swatch.manufacturer}
                position={swatch.position as any}
                size={swatch.size as any}
              />
              <button
                type="button"
                onClick={() => handleRemoveFabricSwatch(index)}
                className="absolute -top-2 -right-2 bg-white rounded-full p-0.5 shadow-sm hover:bg-gray-100 z-20"
                title="Remove fabric swatch"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex flex-col">
        <div className="mb-6">
          <label htmlFor="title" className="block text-sm font-medium text-cardshow-dark mb-2">
            Card Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-cardshow-blue focus:ring-1 focus:ring-cardshow-blue transition-colors"
            placeholder="Enter card title"
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="description" className="block text-sm font-medium text-cardshow-dark mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-cardshow-blue focus:ring-1 focus:ring-cardshow-blue transition-colors"
            placeholder="Enter card description"
          />
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-cardshow-dark">
              Tags
            </label>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.map((tag, index) => (
              <div 
                key={index}
                className="flex items-center bg-cardshow-blue-light text-cardshow-blue text-sm px-3 py-1 rounded-full"
              >
                {tag}
                <button 
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-2"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
          <div className="flex">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              className="flex-1 px-4 py-2 rounded-l-lg border border-gray-200 focus:border-cardshow-blue focus:ring-1 focus:ring-cardshow-blue transition-colors"
              placeholder="Add a tag"
            />
            <button 
              type="button"
              onClick={handleAddTag}
              className="px-4 py-2 bg-cardshow-blue text-white rounded-r-lg hover:bg-opacity-90 transition-colors"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        {/* Premium fabric swatch section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-cardshow-dark">
              Premium Fabric Swatches
            </label>
            <button
              type="button"
              onClick={() => setShowFabricSelector(!showFabricSelector)}
              className="flex items-center text-xs font-medium text-cardshow-blue hover:underline"
            >
              <Scissors size={14} className="mr-1" />
              {showFabricSelector ? 'Hide Options' : 'Add Fabric'}
            </button>
          </div>
          
          {showFabricSelector && (
            <FabricSelector 
              onSelect={handleAddFabricSwatch}
              selectedTeam={title.includes('Bulls') ? 'chicago-bulls' : 
                           title.includes('Lakers') ? 'los-angeles-lakers' : 
                           title.includes('Nets') ? 'brooklyn-nets' : 
                           title.includes('Wolves') ? 'minnesota-wolves' : 
                           title.includes('Duke') ? 'duke' : 
                           title.includes('Grizzlies') ? 'memphis-grizzlies' : ''}
            />
          )}
          
          {fabricSwatches.length > 0 && !showFabricSelector && (
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-2">
                {fabricSwatches.length} fabric {fabricSwatches.length === 1 ? 'swatch' : 'swatches'} added
              </p>
              <div className="flex flex-wrap gap-2">
                {fabricSwatches.map((swatch, index) => (
                  <div key={index} className="text-xs px-2 py-1 bg-white border rounded-full">
                    {swatch.type} • {swatch.year}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {fabricSwatches.length === 0 && !showFabricSelector && (
            <p className="text-sm text-gray-500 italic">
              Add fabric swatches to enhance your card with authentic uniform material
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardBasicInfo;

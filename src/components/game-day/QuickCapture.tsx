import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from "@/hooks/use-toast"
import { useOfflineStorage } from '@/hooks/useOfflineStorage';

interface QuickCaptureProps {
  // Add your props here if needed
}

const QuickCapture: React.FC<QuickCaptureProps> = (props) => {
  const [title, setTitle] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState('default');
  const [location, setLocation] = useState('');
  const [section, setSection] = useState('');
  const { toast } = useToast();
  const { storeOffline } = useOfflineStorage();

  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    if (value && !selectedTags.includes(value)) {
      setSelectedTags([...selectedTags, value]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast({
        title: "Missing title",
        description: "Please add a title",
      });
      return;
    }

    try {
      // Fix by sending the correct parameter type (string instead of object)
      // Serialize the data object to a string if necessary
      const dataString = JSON.stringify({
        title: title,
        tags: selectedTags,
        createdAt: new Date().toISOString(),
        template: selectedTemplate,
        location: location,
        section: section
      });
      
      const result = await storeOffline('quickCapture', dataString);
      
      toast({
        title: "Saved!",
        description: "Your quick capture was saved offline.",
      });
      setTitle('');
      setSelectedTags([]);
      setLocation('');
      setSection('');
    } catch (error) {
      toast({
        title: "Uh oh! Something went wrong.",
        description: "There was a problem saving your quick capture.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Quick Capture</h1>

      <div className="mb-4">
        <Label htmlFor="title">Title</Label>
        <Input
          type="text"
          id="title"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <Label htmlFor="tags">Tags</Label>
        <Input
          type="text"
          id="tags"
          placeholder="Add tags"
          onBlur={handleTagChange}
        />
        <div className="flex mt-2">
          {selectedTags.map((tag) => (
            <div
              key={tag}
              className="bg-gray-200 rounded-full px-3 py-1 mr-2 text-sm cursor-pointer"
              onClick={() => removeTag(tag)}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <Label htmlFor="template">Template</Label>
        <Select onValueChange={setSelectedTemplate}>
          <SelectTrigger id="template">
            <SelectValue placeholder="Select a template" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="sports">Sports</SelectItem>
            <SelectItem value="art">Art</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mb-4">
        <Label htmlFor="location">Location</Label>
        <Input
          type="text"
          id="location"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <Label htmlFor="section">Section</Label>
        <Input
          type="text"
          id="section"
          placeholder="Section"
          value={section}
          onChange={(e) => setSection(e.target.value)}
        />
      </div>

      <Button onClick={handleSave}>Save</Button>
    </div>
  );
};

export default QuickCapture;

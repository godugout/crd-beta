
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OaklandMemoryData } from '@/lib/types';

interface OaklandMemoryFormProps {
  onSubmit: (data: OaklandMemoryData) => void;
  initialData?: OaklandMemoryData;
}

export const OaklandMemoryForm: React.FC<OaklandMemoryFormProps> = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState<OaklandMemoryData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    date: initialData?.date || '',
    memoryType: initialData?.memoryType || '',
    opponent: initialData?.opponent || '',
    score: initialData?.score || '',
    location: initialData?.location || 'Oakland Coliseum',
    section: initialData?.section || '',
    attendees: initialData?.attendees || [],
    tags: initialData?.tags || ['oakland', 'athletics'],
    historicalContext: initialData?.historicalContext || '',
    personalSignificance: initialData?.personalSignificance || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const memoryTypes = [
    'Game Day',
    'Tailgate Party',
    'Championship Celebration',
    'Family Tradition',
    'First Game',
    'Walk-off Win',
    'Perfect Game',
    'Player Meeting',
    'Stadium Tour',
    'Memorabilia Collection'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Memory Title *</label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="My first A's game"
            required
            className="border-gray-300 focus:border-[#006341]"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
          <Input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="border-gray-300 focus:border-[#006341]"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Memory Description *</label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe your Oakland A's memory..."
          required
          rows={3}
          className="border-gray-300 focus:border-[#006341]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Memory Type</label>
          <Select value={formData.memoryType} onValueChange={(value) => setFormData({ ...formData, memoryType: value })}>
            <SelectTrigger className="border-gray-300 focus:border-[#006341]">
              <SelectValue placeholder="Select memory type" />
            </SelectTrigger>
            <SelectContent>
              {memoryTypes.map((type) => (
                <SelectItem key={type} value={type.toLowerCase().replace(/\s+/g, '-')}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Opponent (if game)</label>
          <Input
            value={formData.opponent}
            onChange={(e) => setFormData({ ...formData, opponent: e.target.value })}
            placeholder="vs. Giants"
            className="border-gray-300 focus:border-[#006341]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Final Score (if game)</label>
          <Input
            value={formData.score}
            onChange={(e) => setFormData({ ...formData, score: e.target.value })}
            placeholder="A's 7, Giants 3"
            className="border-gray-300 focus:border-[#006341]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Section/Location</label>
          <Input
            value={formData.section}
            onChange={(e) => setFormData({ ...formData, section: e.target.value })}
            placeholder="Section 143, Bleachers, Parking Lot"
            className="border-gray-300 focus:border-[#006341]"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Why is this memory special to you?</label>
        <Textarea
          value={formData.personalSignificance}
          onChange={(e) => setFormData({ ...formData, personalSignificance: e.target.value })}
          placeholder="This was my first game with my dad, or this was the game that made me fall in love with baseball..."
          rows={3}
          className="border-gray-300 focus:border-[#006341]"
        />
      </div>

      <Button 
        type="submit" 
        className="w-full bg-[#006341] hover:bg-[#003831] text-white"
      >
        Continue to Preview
      </Button>
    </form>
  );
};

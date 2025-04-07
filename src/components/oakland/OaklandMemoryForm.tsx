
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, MapPin, Users } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface OaklandMemoryFormProps {
  onSubmit: (data: OaklandMemoryData) => void;
  initialData?: Partial<OaklandMemoryData>;
}

export interface OaklandMemoryData {
  title: string;
  description: string;
  date: Date | null;
  opponent: string;
  score?: string;
  location: string;
  section?: string;
  memoryType: 'game' | 'tailgate' | 'memorabilia' | 'other';
  attendees?: string[];
  tags: string[];
}

const opponents = [
  'Los Angeles Angels', 'Houston Astros', 'Seattle Mariners', 'Texas Rangers',
  'Chicago White Sox', 'Cleveland Guardians', 'Detroit Tigers', 'Kansas City Royals', 'Minnesota Twins',
  'Baltimore Orioles', 'Boston Red Sox', 'New York Yankees', 'Tampa Bay Rays', 'Toronto Blue Jays',
  'Arizona Diamondbacks', 'Colorado Rockies', 'Los Angeles Dodgers', 'San Diego Padres', 'San Francisco Giants'
];

const locations = [
  'Oakland Coliseum', 'Parking Lot', 'BART Station', 'Other'
];

const OaklandMemoryForm: React.FC<OaklandMemoryFormProps> = ({ onSubmit, initialData = {} }) => {
  const [memoryData, setMemoryData] = useState<OaklandMemoryData>({
    title: initialData.title || '',
    description: initialData.description || '',
    date: initialData.date || null,
    opponent: initialData.opponent || '',
    score: initialData.score || '',
    location: initialData.location || 'Oakland Coliseum',
    section: initialData.section || '',
    memoryType: initialData.memoryType || 'game',
    attendees: initialData.attendees || [],
    tags: initialData.tags || []
  });
  
  const [tag, setTag] = useState('');
  const [attendee, setAttendee] = useState('');

  const handleChange = (field: keyof OaklandMemoryData, value: any) => {
    setMemoryData(prev => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    if (tag.trim() && !memoryData.tags.includes(tag.trim())) {
      handleChange('tags', [...memoryData.tags, tag.trim()]);
      setTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    handleChange('tags', memoryData.tags.filter(t => t !== tagToRemove));
  };

  const addAttendee = () => {
    if (attendee.trim() && !memoryData.attendees?.includes(attendee.trim())) {
      handleChange('attendees', [...(memoryData.attendees || []), attendee.trim()]);
      setAttendee('');
    }
  };

  const removeAttendee = (personToRemove: string) => {
    handleChange('attendees', memoryData.attendees?.filter(a => a !== personToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(memoryData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-1">Memory Type</label>
        <RadioGroup 
          value={memoryData.memoryType} 
          onValueChange={(value) => handleChange('memoryType', value)}
          className="flex flex-wrap gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="game" id="game" />
            <Label htmlFor="game">Game</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="tailgate" id="tailgate" />
            <Label htmlFor="tailgate">Tailgate</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="memorabilia" id="memorabilia" />
            <Label htmlFor="memorabilia">Memorabilia</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="other" id="other" />
            <Label htmlFor="other">Other</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <Input
          value={memoryData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Give your memory a title"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <Textarea
          value={memoryData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Share your memory details..."
          rows={4}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {memoryData.date ? format(memoryData.date, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={memoryData.date || undefined}
                onSelect={(date) => handleChange('date', date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {(memoryData.memoryType === 'game' || memoryData.memoryType === 'tailgate') && (
          <div>
            <label className="block text-sm font-medium mb-1">Opponent</label>
            <Select
              value={memoryData.opponent}
              onValueChange={(value) => handleChange('opponent', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select opponent" />
              </SelectTrigger>
              <SelectContent>
                {opponents.map(team => (
                  <SelectItem key={team} value={team}>{team}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {memoryData.memoryType === 'game' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Score (Optional)</label>
            <Input
              value={memoryData.score || ''}
              onChange={(e) => handleChange('score', e.target.value)}
              placeholder="e.g. A's 5 - Angels 3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Section/Seat (Optional)</label>
            <Input
              value={memoryData.section || ''}
              onChange={(e) => handleChange('section', e.target.value)}
              placeholder="e.g. Section 114, Row 22"
            />
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Location</label>
        <Select
          value={memoryData.location}
          onValueChange={(value) => handleChange('location', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent>
            {locations.map(loc => (
              <SelectItem key={loc} value={loc}>{loc}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Attendees (Optional)</label>
        <div className="flex gap-2">
          <Input
            value={attendee}
            onChange={(e) => setAttendee(e.target.value)}
            placeholder="Add person name"
          />
          <Button type="button" onClick={addAttendee}>Add</Button>
        </div>
        {memoryData.attendees && memoryData.attendees.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {memoryData.attendees.map(person => (
              <div key={person} className="bg-[#003831] text-white px-3 py-1 rounded-full flex items-center">
                <Users className="h-3 w-3 mr-1" />
                {person}
                <button
                  type="button"
                  onClick={() => removeAttendee(person)}
                  className="ml-2 text-xs rounded-full hover:text-red-300"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Tags</label>
        <div className="flex gap-2">
          <Input
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            placeholder="Add tag"
          />
          <Button type="button" onClick={addTag}>Add</Button>
        </div>
        {memoryData.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {memoryData.tags.map(tag => (
              <div key={tag} className="bg-[#EFB21E] text-[#003831] px-3 py-1 rounded-full flex items-center">
                #{tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-2 text-xs rounded-full hover:text-red-700"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Button type="submit" className="w-full bg-[#006341] hover:bg-[#003831] text-white">
        Save Memory
      </Button>
    </form>
  );
};

export default OaklandMemoryForm;

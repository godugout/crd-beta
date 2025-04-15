
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { toast } from 'sonner';

interface PlayerDetailsStepProps {
  formData: any;
  updateFormData: (data: any) => void;
  completeStep: () => void;
}

// Sample positions for various sports
const POSITIONS = {
  baseball: [
    'Pitcher', 'Catcher', 'First Base', 'Second Base', 'Third Base', 
    'Shortstop', 'Left Field', 'Center Field', 'Right Field', 'Designated Hitter'
  ],
  basketball: [
    'Point Guard', 'Shooting Guard', 'Small Forward', 'Power Forward', 'Center'
  ],
  football: [
    'Quarterback', 'Running Back', 'Wide Receiver', 'Tight End', 'Offensive Line',
    'Defensive Line', 'Linebacker', 'Cornerback', 'Safety', 'Kicker', 'Punter'
  ],
  hockey: [
    'Goaltender', 'Defenseman', 'Left Wing', 'Center', 'Right Wing'
  ],
  soccer: [
    'Goalkeeper', 'Defender', 'Midfielder', 'Forward'
  ]
};

const PlayerDetailsStep: React.FC<PlayerDetailsStepProps> = ({
  formData,
  updateFormData,
  completeStep
}) => {
  const [playerName, setPlayerName] = useState(formData.playerName || '');
  const [team, setTeam] = useState(formData.team || '');
  const [position, setPosition] = useState(formData.position || '');
  const [year, setYear] = useState(formData.year || '');
  const [sport, setSport] = useState(formData.sport || 'baseball');
  const [stats, setStats] = useState<{[key: string]: string}>(formData.stats || {});
  const [tags, setTags] = useState<string[]>(formData.tags || []);
  const [newTag, setNewTag] = useState('');
  const [bio, setBio] = useState(formData.bio || '');
  
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  // Validate and update form data
  useEffect(() => {
    const newErrors: {[key: string]: string} = {};
    let isValid = true;
    
    if (playerName.trim() === '') {
      newErrors.playerName = 'Player name is required';
      isValid = false;
    }
    
    if (team.trim() === '') {
      newErrors.team = 'Team is required';
      isValid = false;
    }
    
    if (year.trim() !== '' && !/^\d{4}$/.test(year)) {
      newErrors.year = 'Year must be a 4-digit number';
      isValid = false;
    }
    
    setErrors(newErrors);
    
    if (isValid && playerName && team) {
      updateFormData({
        playerName,
        team,
        position,
        year,
        sport,
        stats,
        tags,
        bio,
      });
      
      completeStep();
    }
  }, [playerName, team, position, year, sport, stats, tags, bio, updateFormData, completeStep]);
  
  // Handle stat changes
  const handleStatChange = (key: string, value: string) => {
    setStats(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  // Get sport-specific stat fields
  const getSportStats = () => {
    switch (sport) {
      case 'baseball':
        return [
          { key: 'avg', label: 'Batting Average', placeholder: 'e.g. .302' },
          { key: 'hr', label: 'Home Runs', placeholder: 'e.g. 32' },
          { key: 'rbi', label: 'RBI', placeholder: 'e.g. 104' },
          { key: 'sb', label: 'Stolen Bases', placeholder: 'e.g. 15' },
          { key: 'era', label: 'ERA (Pitchers)', placeholder: 'e.g. 3.24' }
        ];
      case 'basketball':
        return [
          { key: 'ppg', label: 'Points Per Game', placeholder: 'e.g. 24.5' },
          { key: 'rpg', label: 'Rebounds Per Game', placeholder: 'e.g. 10.2' },
          { key: 'apg', label: 'Assists Per Game', placeholder: 'e.g. 7.8' },
          { key: 'fg', label: 'Field Goal %', placeholder: 'e.g. 45.6' },
          { key: '3pt', label: '3-Point %', placeholder: 'e.g. 38.2' }
        ];
      case 'football':
        return [
          { key: 'td', label: 'Touchdowns', placeholder: 'e.g. 12' },
          { key: 'yds', label: 'Total Yards', placeholder: 'e.g. 1,240' },
          { key: 'comp', label: 'Completions', placeholder: 'e.g. 325' },
          { key: 'int', label: 'Interceptions', placeholder: 'e.g. 8' },
          { key: 'sacks', label: 'Sacks', placeholder: 'e.g. 12.5' }
        ];
      case 'hockey':
        return [
          { key: 'goals', label: 'Goals', placeholder: 'e.g. 28' },
          { key: 'assists', label: 'Assists', placeholder: 'e.g. 45' },
          { key: 'points', label: 'Points', placeholder: 'e.g. 73' },
          { key: 'pm', label: 'Plus/Minus', placeholder: 'e.g. +15' },
          { key: 'pim', label: 'Penalty Minutes', placeholder: 'e.g. 42' }
        ];
      case 'soccer':
        return [
          { key: 'goals', label: 'Goals', placeholder: 'e.g. 18' },
          { key: 'assists', label: 'Assists', placeholder: 'e.g. 12' },
          { key: 'apps', label: 'Appearances', placeholder: 'e.g. 34' },
          { key: 'yellows', label: 'Yellow Cards', placeholder: 'e.g. 5' },
          { key: 'reds', label: 'Red Cards', placeholder: 'e.g. 1' }
        ];
      default:
        return [];
    }
  };
  
  // Add tag handler
  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    } else if (tags.includes(newTag.trim())) {
      toast.error("This tag already exists");
    }
  };
  
  // Remove tag handler
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Player Details</h2>
        <p className="text-gray-500 text-sm">
          Enter information about the player featured on this card.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {/* Basic Player Info */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="player-name" className={errors.playerName ? 'text-red-500' : ''}>
                Player Name*
              </Label>
              <Input 
                id="player-name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="e.g. Mike Trout"
                className={errors.playerName ? 'border-red-500' : ''}
              />
              {errors.playerName && (
                <span className="text-xs text-red-500">{errors.playerName}</span>
              )}
            </div>
            
            <div>
              <Label htmlFor="team" className={errors.team ? 'text-red-500' : ''}>
                Team*
              </Label>
              <Input 
                id="team"
                value={team}
                onChange={(e) => setTeam(e.target.value)}
                placeholder="e.g. Los Angeles Angels"
                className={errors.team ? 'border-red-500' : ''}
              />
              {errors.team && (
                <span className="text-xs text-red-500">{errors.team}</span>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sport">Sport</Label>
                <Select
                  value={sport}
                  onValueChange={setSport}
                >
                  <SelectTrigger id="sport">
                    <SelectValue placeholder="Select Sport" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baseball">Baseball</SelectItem>
                    <SelectItem value="basketball">Basketball</SelectItem>
                    <SelectItem value="football">Football</SelectItem>
                    <SelectItem value="hockey">Hockey</SelectItem>
                    <SelectItem value="soccer">Soccer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="year" className={errors.year ? 'text-red-500' : ''}>Year</Label>
                <Input 
                  id="year"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="e.g. 2023"
                  className={errors.year ? 'border-red-500' : ''}
                />
                {errors.year && (
                  <span className="text-xs text-red-500">{errors.year}</span>
                )}
              </div>
            </div>
            
            <div>
              <Label htmlFor="position">Position</Label>
              <Select
                value={position}
                onValueChange={setPosition}
              >
                <SelectTrigger id="position">
                  <SelectValue placeholder="Select Position" />
                </SelectTrigger>
                <SelectContent>
                  {POSITIONS[sport as keyof typeof POSITIONS]?.map(pos => (
                    <SelectItem key={pos} value={pos}>
                      {pos}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Player Bio */}
          <div>
            <Label htmlFor="bio">Player Bio</Label>
            <Textarea 
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Enter interesting facts about this player..."
              rows={4}
            />
          </div>
        </div>
        
        <div className="space-y-4">
          {/* Stats Section */}
          <div>
            <h3 className="text-lg font-medium mb-3">{sport.charAt(0).toUpperCase() + sport.slice(1)} Stats</h3>
            <div className="space-y-3">
              {getSportStats().map(statField => (
                <div key={statField.key} className="grid grid-cols-6 gap-2 items-center">
                  <Label htmlFor={`stat-${statField.key}`} className="col-span-2">
                    {statField.label}:
                  </Label>
                  <Input 
                    id={`stat-${statField.key}`}
                    value={stats[statField.key] || ''}
                    onChange={(e) => handleStatChange(statField.key, e.target.value)}
                    placeholder={statField.placeholder}
                    className="col-span-4"
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Tags Section */}
          <div>
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2 mb-2">
              <Input 
                id="tags"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="e.g. rookie, all-star"
                className="flex-grow"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <Button 
                type="button" 
                variant="secondary"
                onClick={addTag}
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map(tag => (
                <Badge key={tag} variant="secondary" className="px-2 py-1">
                  {tag}
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon"
                    className="h-4 w-4 ml-1 p-0"
                    onClick={() => removeTag(tag)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
              {tags.length === 0 && (
                <span className="text-xs text-gray-500">No tags added yet</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerDetailsStep;

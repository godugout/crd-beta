import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Shirt, TagIcon } from 'lucide-react';

export interface FabricSelectorProps {
  onSelect: (fabricOptions: {
    type: string;
    team: string;
    year: string;
    manufacturer: string;
    position: string;
    size: string;
  }) => void;
  selectedTeam?: string;
  selectedYear?: string;
}

const FabricSelector: React.FC<FabricSelectorProps> = ({
  onSelect,
  selectedTeam = '',
  selectedYear = '2023'
}) => {
  const [fabricType, setFabricType] = useState('Basketball');
  const [team, setTeam] = useState(selectedTeam || 'default');
  const [year, setYear] = useState(selectedYear || '2023');
  const [manufacturer, setManufacturer] = useState('standard');
  const [position, setPosition] = useState('bottom-right');
  const [size, setSize] = useState('medium');
  
  const fabricTypes = ['Basketball', 'Baseball', 'Football', 'Hockey', 'Soccer', 'Cotton', 'Wool'];
  
  const teams = [
    { value: 'default', label: 'Default' },
    { value: 'chicago-bulls', label: 'Chicago Bulls' },
    { value: 'los-angeles-lakers', label: 'Los Angeles Lakers' },
    { value: 'brooklyn-nets', label: 'Brooklyn Nets' },
    { value: 'minnesota-wolves', label: 'Minnesota Wolves' },
    { value: 'duke', label: 'Duke' },
    { value: 'memphis-grizzlies', label: 'Memphis Grizzlies' }
  ];
  
  const manufacturers = [
    { value: 'standard', label: 'Standard' },
    { value: 'nike', label: 'Nike' },
    { value: 'adidas', label: 'Adidas' },
    { value: 'champion', label: 'Champion' }
  ];
  
  const positions = [
    { value: 'top-left', label: 'Top Left' },
    { value: 'top-right', label: 'Top Right' },
    { value: 'bottom-left', label: 'Bottom Left' },
    { value: 'bottom-right', label: 'Bottom Right' },
    { value: 'center', label: 'Center' }
  ];
  
  const sizes = [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' }
  ];
  
  const years = Array.from({ length: new Date().getFullYear() - 1949 }, (_, i) => ({
    value: String(1950 + i),
    label: String(1950 + i)
  }));
  
  const handleAddFabric = () => {
    onSelect({
      type: fabricType,
      team,
      year,
      manufacturer,
      position,
      size
    });
  };
  
  return (
    <div className="fabric-selector border rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Add Fabric Swatch</h3>
        <Badge variant="outline" className="text-xs">Premium Feature</Badge>
      </div>
      
      <Tabs defaultValue="type" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="type">Type</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="position">Position</TabsTrigger>
        </TabsList>
        
        <TabsContent value="type" className="space-y-4">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {fabricTypes.map((type) => (
              <div
                key={type}
                onClick={() => setFabricType(type)}
                className={`cursor-pointer p-3 rounded-md border text-center hover:bg-gray-50 transition-colors ${
                  fabricType === type ? 'border-primary bg-primary/5' : 'border-gray-200'
                }`}
              >
                <Shirt size={24} className="mx-auto mb-2" />
                <span className="text-sm">{type}</span>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="team" className="space-y-4">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="team">Team</Label>
              <Select value={team} onValueChange={setTeam}>
                <SelectTrigger id="team">
                  <SelectValue placeholder="Select Team" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem key={team.value} value={team.value}>
                      {team.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="year">Year</Label>
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger id="year">
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year.value} value={year.value}>
                      {year.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-1">
                Affects fabric style and wear
              </p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="details" className="space-y-4">
          <div>
            <Label htmlFor="manufacturer">Manufacturer</Label>
            <Select value={manufacturer} onValueChange={setManufacturer}>
              <SelectTrigger id="manufacturer">
                <SelectValue placeholder="Select Manufacturer" />
              </SelectTrigger>
              <SelectContent>
                {manufacturers.map((mfr) => (
                  <SelectItem key={mfr.value} value={mfr.value}>
                    {mfr.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </TabsContent>
        
        <TabsContent value="position" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="position">Position</Label>
              <Select value={position} onValueChange={setPosition}>
                <SelectTrigger id="position">
                  <SelectValue placeholder="Select Position" />
                </SelectTrigger>
                <SelectContent>
                  {positions.map((pos) => (
                    <SelectItem key={pos.value} value={pos.value}>
                      {pos.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="size">Size</Label>
              <Select value={size} onValueChange={setSize}>
                <SelectTrigger id="size">
                  <SelectValue placeholder="Select Size" />
                </SelectTrigger>
                <SelectContent>
                  {sizes.map((sz) => (
                    <SelectItem key={sz.value} value={sz.value}>
                      {sz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button onClick={handleAddFabric} className="w-full mt-4">
            <TagIcon className="mr-2 h-4 w-4" />
            Add Fabric Swatch
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FabricSelector;

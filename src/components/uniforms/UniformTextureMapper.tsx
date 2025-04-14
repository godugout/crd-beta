import React, { useState } from 'react';

// Define the SportType type
export type SportType = 'basketball' | 'baseball' | 'football' | 'hockey' | 'soccer';

interface UniformTextureMapperProps {
  onTextureGenerated: (textureUrl: string) => void;
  initialSportType?: SportType | 'all';
  initialTeam?: string;
  initialPlayerNumber?: string;
  initialPlayerName?: string;
}

const UniformTextureMapper: React.FC<UniformTextureMapperProps> = ({
  onTextureGenerated,
  initialSportType = 'basketball',
  initialTeam = 'Chicago Bulls',
  initialPlayerNumber = '23',
  initialPlayerName = 'JORDAN'
}) => {
  const [sportType, setSportType] = useState<SportType>(initialSportType as SportType);
  const [team, setTeam] = useState(initialTeam);
  const [playerNumber, setPlayerNumber] = useState(initialPlayerNumber);
  const [playerName, setPlayerName] = useState(initialPlayerName);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Mock function to generate texture URL
  const generateTextureUrl = (sport: SportType, team: string, number: string, name: string): string => {
    // In a real app, this would call an API or use a canvas to generate the texture
    // For demo purposes, we'll return mock URLs
    const baseUrl = '/lovable-uploads/';
    
    if (sport === 'basketball') {
      if (team.includes('Bulls')) return `${baseUrl}667e6ad2-af96-40ac-bd16-a69778e14b21.png`;
      if (team.includes('Lakers')) return `${baseUrl}a38aa501-ea2d-4416-9699-1e69b1826233.png`;
      return `${baseUrl}79a099b9-c77a-491e-9755-ba25419791f5.png`; // Nets default
    }
    
    if (sport === 'baseball') {
      return `${baseUrl}93353027-d213-4314-8ab9-0d38bb552e8a.png`; // Yankees default
    }
    
    if (sport === 'football') {
      return `${baseUrl}7bb9f93e-4a42-4b96-9429-8b2966efd3a6.png`; // Packers default
    }
    
    if (sport === 'hockey') {
      return `${baseUrl}c381b388-5693-44a6-852b-93af5f0d5217.png`; // Maple Leafs default
    }
    
    if (sport === 'soccer') {
      return `${baseUrl}f07b9e90-98ec-4e0c-bca4-71acd9ae9924.png`; // Man United default
    }
    
    return `${baseUrl}667e6ad2-af96-40ac-bd16-a69778e14b21.png`; // Default to Bulls
  };
  
  const handleGenerateTexture = () => {
    setIsGenerating(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const textureUrl = generateTextureUrl(sportType, team, playerNumber, playerName);
      onTextureGenerated(textureUrl);
      setIsGenerating(false);
    }, 800);
  };
  
  // Team options based on sport type
  const getTeamOptions = (sport: SportType) => {
    switch (sport) {
      case 'basketball':
        return ['Chicago Bulls', 'Los Angeles Lakers', 'Brooklyn Nets', 'Boston Celtics', 'Miami Heat'];
      case 'baseball':
        return ['New York Yankees', 'Boston Red Sox', 'Chicago Cubs', 'Los Angeles Dodgers', 'San Francisco Giants'];
      case 'football':
        return ['Green Bay Packers', 'Dallas Cowboys', 'Kansas City Chiefs', 'San Francisco 49ers', 'Pittsburgh Steelers'];
      case 'hockey':
        return ['Toronto Maple Leafs', 'Montreal Canadiens', 'Boston Bruins', 'Chicago Blackhawks', 'New York Rangers'];
      case 'soccer':
        return ['Manchester United', 'Barcelona', 'Real Madrid', 'Bayern Munich', 'Liverpool'];
      default:
        return ['Team 1', 'Team 2', 'Team 3', 'Team 4', 'Team 5'];
    }
  };
  
  return (
    <div className="uniform-texture-mapper">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Sport Type</label>
            <select 
              value={sportType}
              onChange={(e) => setSportType(e.target.value as SportType)}
              className="w-full p-2 border rounded-md"
            >
              <option value="basketball">Basketball</option>
              <option value="baseball">Baseball</option>
              <option value="football">Football</option>
              <option value="hockey">Hockey</option>
              <option value="soccer">Soccer</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Team</label>
            <select 
              value={team}
              onChange={(e) => setTeam(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              {getTeamOptions(sportType).map((teamName) => (
                <option key={teamName} value={teamName}>{teamName}</option>
              ))}
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Player Number</label>
              <input 
                type="text" 
                value={playerNumber}
                onChange={(e) => setPlayerNumber(e.target.value)}
                maxLength={3}
                className="w-full p-2 border rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Player Name</label>
              <input 
                type="text" 
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value.toUpperCase())}
                maxLength={12}
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>
          
          <button
            onClick={handleGenerateTexture}
            disabled={isGenerating}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
          >
            {isGenerating ? 'Generating...' : 'Generate Uniform Texture'}
          </button>
        </div>
        
        <div className="uniform-preview bg-gray-100 rounded-lg p-4 flex items-center justify-center">
          <div className="aspect-square w-full max-w-[240px] relative">
            {/* This would be replaced with an actual uniform preview */}
            <div className="absolute inset-0 flex items-center justify-center text-gray-500">
              {isGenerating ? (
                <div className="animate-pulse">Generating texture...</div>
              ) : (
                <div className="text-center">
                  <div className="text-lg font-bold">{team}</div>
                  <div className="text-3xl font-bold">{playerNumber}</div>
                  <div className="text-md">{playerName}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-sm text-gray-500">
        <p>Note: In a production environment, this would generate actual uniform textures based on the selected parameters.</p>
      </div>
    </div>
  );
};

export default UniformTextureMapper;


import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, X } from 'lucide-react';

interface UniformTextureMapperProps {
  onTextureGenerated?: (textureUrl: string) => void;
  initialSportType?: SportType;
  initialTeam?: string;
  initialPlayerNumber?: string;
  initialPlayerName?: string;
}

export type SportType = 'basketball' | 'baseball' | 'football' | 'hockey' | 'soccer';
export type FabricType = 'mesh' | 'cotton' | 'synthetic' | 'wool';
export type WeatheringEffect = 'new' | 'game-worn' | 'vintage';

interface UniformConfig {
  sport: SportType;
  team: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  playerNumber: string;
  playerName: string;
  fabricType: FabricType;
  weathering: WeatheringEffect;
}

interface TeamPreset {
  name: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logo?: string;
}

const sportPresets: Record<SportType, TeamPreset[]> = {
  basketball: [
    { name: 'Chicago Bulls', primaryColor: '#CE1141', secondaryColor: '#000000', accentColor: '#FFFFFF' },
    { name: 'Los Angeles Lakers', primaryColor: '#FDB927', secondaryColor: '#552583', accentColor: '#FFFFFF' },
    { name: 'Brooklyn Nets', primaryColor: '#000000', secondaryColor: '#FFFFFF', accentColor: '#FFFFFF' },
    { name: 'Minnesota Wolves', primaryColor: '#0C2340', secondaryColor: '#236192', accentColor: '#78BE20' },
    { name: 'Duke', primaryColor: '#001A57', secondaryColor: '#FFFFFF', accentColor: '#001A57' }
  ],
  baseball: [
    { name: 'New York Yankees', primaryColor: '#0C2340', secondaryColor: '#FFFFFF', accentColor: '#C4CED4' },
    { name: 'Boston Red Sox', primaryColor: '#BD3039', secondaryColor: '#0C2340', accentColor: '#FFFFFF' },
    { name: 'Los Angeles Dodgers', primaryColor: '#005A9C', secondaryColor: '#FFFFFF', accentColor: '#A5ACAF' },
    { name: 'Chicago Cubs', primaryColor: '#0E3386', secondaryColor: '#CC3433', accentColor: '#FFFFFF' }
  ],
  football: [
    { name: 'Green Bay Packers', primaryColor: '#203731', secondaryColor: '#FFB612', accentColor: '#FFFFFF' },
    { name: 'Dallas Cowboys', primaryColor: '#003594', secondaryColor: '#FFFFFF', accentColor: '#B0B7BC' },
    { name: 'Pittsburgh Steelers', primaryColor: '#101820', secondaryColor: '#FFB612', accentColor: '#FFFFFF' },
    { name: 'San Francisco 49ers', primaryColor: '#AA0000', secondaryColor: '#B3995D', accentColor: '#FFFFFF' }
  ],
  hockey: [
    { name: 'Toronto Maple Leafs', primaryColor: '#00205B', secondaryColor: '#FFFFFF', accentColor: '#00205B' },
    { name: 'Montreal Canadiens', primaryColor: '#AF1E2D', secondaryColor: '#192168', accentColor: '#FFFFFF' },
    { name: 'Boston Bruins', primaryColor: '#000000', secondaryColor: '#FFB81C', accentColor: '#FFFFFF' },
    { name: 'Chicago Blackhawks', primaryColor: '#CF0A2C', secondaryColor: '#000000', accentColor: '#FFFFFF' }
  ],
  soccer: [
    { name: 'Manchester United', primaryColor: '#DA291C', secondaryColor: '#000000', accentColor: '#FFFFFF' },
    { name: 'FC Barcelona', primaryColor: '#A50044', secondaryColor: '#004D98', accentColor: '#EDBB00' },
    { name: 'Real Madrid', primaryColor: '#FFFFFF', secondaryColor: '#00529F', accentColor: '#FFFFFF' },
    { name: 'Bayern Munich', primaryColor: '#DC052D', secondaryColor: '#0066B2', accentColor: '#FFFFFF' }
  ]
};

const UniformTextureMapper: React.FC<UniformTextureMapperProps> = ({
  onTextureGenerated,
  initialSportType = 'basketball',
  initialTeam = '',
  initialPlayerNumber = '23',
  initialPlayerName = 'JORDAN'
}) => {
  const [config, setConfig] = useState<UniformConfig>({
    sport: initialSportType,
    team: initialTeam,
    primaryColor: '#CE1141', // Bulls red default
    secondaryColor: '#000000',
    accentColor: '#FFFFFF',
    playerNumber: initialPlayerNumber,
    playerName: initialPlayerName,
    fabricType: 'mesh',
    weathering: 'new'
  });
  
  const [activeTab, setActiveTab] = useState<string>('sport');
  const [previewCanvas, setPreviewCanvas] = useState<HTMLCanvasElement | null>(null);
  
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    setPreviewCanvas(canvas);
  }, []);
  
  useEffect(() => {
    if (previewCanvas) {
      generateTexturePreview(previewCanvas, config);
    }
  }, [config, previewCanvas]);
  
  // Select a team preset
  const handleTeamSelect = (teamName: string) => {
    const selectedTeam = sportPresets[config.sport].find(team => team.name === teamName);
    
    if (selectedTeam) {
      setConfig(prev => ({
        ...prev,
        team: selectedTeam.name,
        primaryColor: selectedTeam.primaryColor,
        secondaryColor: selectedTeam.secondaryColor,
        accentColor: selectedTeam.accentColor
      }));
    }
  };
  
  // Generate texture based on configuration
  const generateTexturePreview = (canvas: HTMLCanvasElement, config: UniformConfig) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw base uniform color
    ctx.fillStyle = config.primaryColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add fabric texture based on type
    applyFabricTexture(ctx, canvas.width, canvas.height, config.fabricType, config.sport);
    
    // Draw uniform design based on sport
    drawUniformDesign(ctx, canvas.width, canvas.height, config);
    
    // Add weathering effects
    applyWeatheringEffects(ctx, canvas.width, canvas.height, config.weathering);
    
    // Apply normal map for detail
    applyNormalMapDetails(ctx, canvas.width, canvas.height, config);
    
    // Convert canvas to data URL and notify parent if callback provided
    const textureUrl = canvas.toDataURL('image/png');
    if (onTextureGenerated) {
      onTextureGenerated(textureUrl);
    }
  };
  
  // Apply appropriate fabric texture
  const applyFabricTexture = (
    ctx: CanvasRenderingContext2D, 
    width: number, 
    height: number, 
    fabricType: FabricType,
    sport: SportType
  ) => {
    // Set composite operation
    ctx.globalCompositeOperation = 'multiply';
    
    switch (fabricType) {
      case 'mesh':
        // Mesh pattern common in basketball/football
        ctx.globalAlpha = 0.2;
        const meshSize = sport === 'basketball' ? 4 : 2;
        
        for (let y = 0; y < height; y += meshSize) {
          for (let x = 0; x < width; x += meshSize) {
            if ((x + y) % (meshSize * 2) === 0) {
              ctx.fillStyle = 'rgba(0,0,0,0.2)';
              ctx.fillRect(x, y, 1, 1);
            }
          }
        }
        break;
        
      case 'cotton':
        // Cotton pattern common in baseball
        ctx.globalAlpha = 0.15;
        for (let y = 0; y < height; y += 3) {
          for (let x = 0; x < width; x += 3) {
            const noise = Math.random() * 0.1;
            ctx.fillStyle = `rgba(0,0,0,${noise})`;
            ctx.fillRect(x, y, 2, 2);
          }
        }
        break;
        
      case 'synthetic':
        // Smooth synthetic fabric
        ctx.globalAlpha = 0.1;
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, 'rgba(255,255,255,0.1)');
        gradient.addColorStop(0.5, 'rgba(255,255,255,0)');
        gradient.addColorStop(1, 'rgba(255,255,255,0.1)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        break;
        
      case 'wool':
        // Wool texture for vintage uniforms
        ctx.globalAlpha = 0.15;
        for (let y = 0; y < height; y += 2) {
          for (let x = 0; x < width; x += 2) {
            if (Math.random() > 0.7) {
              ctx.fillStyle = 'rgba(0,0,0,0.1)';
              ctx.fillRect(x, y, 2, 2);
            }
          }
        }
        break;
    }
    
    // Reset composite operation and alpha
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1.0;
  };
  
  // Draw sport-specific uniform design
  const drawUniformDesign = (
    ctx: CanvasRenderingContext2D, 
    width: number, 
    height: number, 
    config: UniformConfig
  ) => {
    switch (config.sport) {
      case 'basketball':
        drawBasketballUniform(ctx, width, height, config);
        break;
      case 'baseball':
        drawBaseballUniform(ctx, width, height, config);
        break;
      case 'football':
        drawFootballUniform(ctx, width, height, config);
        break;
      case 'hockey':
        drawHockeyUniform(ctx, width, height, config);
        break;
      case 'soccer':
        drawSoccerUniform(ctx, width, height, config);
        break;
    }
  };
  
  // Apply weathering effects
  const applyWeatheringEffects = (
    ctx: CanvasRenderingContext2D, 
    width: number, 
    height: number, 
    weathering: WeatheringEffect
  ) => {
    switch (weathering) {
      case 'game-worn':
        // Add subtle dirt and wear
        ctx.globalCompositeOperation = 'multiply';
        ctx.globalAlpha = 0.1;
        
        // Random dirt patches
        for (let i = 0; i < 10; i++) {
          const x = Math.random() * width;
          const y = Math.random() * height;
          const radius = Math.random() * 20 + 5;
          
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
          gradient.addColorStop(0, 'rgba(0,0,0,0.3)');
          gradient.addColorStop(1, 'rgba(0,0,0,0)');
          
          ctx.fillStyle = gradient;
          ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
        }
        
        // Worn edges
        ctx.globalAlpha = 0.05;
        for (let i = 0; i < 20; i++) {
          const x = Math.random() * width;
          const y = Math.random() * height;
          const size = Math.random() * 10 + 5;
          
          ctx.fillStyle = 'rgba(0,0,0,0.2)';
          ctx.fillRect(x, y, size, size);
        }
        break;
        
      case 'vintage':
        // Faded colors and vintage look
        ctx.globalCompositeOperation = 'screen';
        ctx.globalAlpha = 0.1;
        ctx.fillStyle = '#f9e8c7'; // Vintage yellow tint
        ctx.fillRect(0, 0, width, height);
        
        // Crease marks
        ctx.globalCompositeOperation = 'multiply';
        ctx.globalAlpha = 0.2;
        for (let i = 0; i < 5; i++) {
          const y = Math.random() * height;
          ctx.strokeStyle = 'rgba(0,0,0,0.1)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
        
        // Age spots
        for (let i = 0; i < 30; i++) {
          const x = Math.random() * width;
          const y = Math.random() * height;
          const radius = Math.random() * 3 + 1;
          
          ctx.fillStyle = 'rgba(139,69,19,0.1)'; // Brown spots
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
        
      case 'new':
      default:
        // No weathering effects for new uniforms
        break;
    }
    
    // Reset composite operation and alpha
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1.0;
  };
  
  // Apply normal map for 3D details
  const applyNormalMapDetails = (
    ctx: CanvasRenderingContext2D, 
    width: number, 
    height: number, 
    config: UniformConfig
  ) => {
    // This would be more complex in a real implementation
    // Here we'll simulate the effect with a simple overlay
    
    // Add stitching details based on sport type
    ctx.globalAlpha = 0.5;
    ctx.strokeStyle = adjustColor(config.primaryColor, -20); // Darker shade of primary color
    ctx.lineWidth = 1;
    
    // Add seams and stitching
    switch (config.sport) {
      case 'basketball':
        // Neck seam
        ctx.beginPath();
        ctx.moveTo(width * 0.35, height * 0.1);
        ctx.quadraticCurveTo(width * 0.5, height * 0.15, width * 0.65, height * 0.1);
        ctx.stroke();
        
        // Arm holes
        ctx.beginPath();
        ctx.arc(width * 0.2, height * 0.25, height * 0.15, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(width * 0.8, height * 0.25, height * 0.15, 0, Math.PI * 2);
        ctx.stroke();
        break;
        
      case 'baseball':
        // Button line
        ctx.beginPath();
        ctx.moveTo(width * 0.5, height * 0.1);
        ctx.lineTo(width * 0.5, height * 0.6);
        ctx.stroke();
        
        // Buttons
        for (let i = 0; i < 5; i++) {
          ctx.beginPath();
          ctx.arc(width * 0.5, height * (0.2 + i * 0.08), 3, 0, Math.PI * 2);
          ctx.stroke();
        }
        break;
        
      // Similar patterns for other sports
      default:
        break;
    }
    
    // Reset alpha
    ctx.globalAlpha = 1.0;
  };
  
  // Sport-specific uniform designs
  const drawBasketballUniform = (
    ctx: CanvasRenderingContext2D, 
    width: number, 
    height: number, 
    config: UniformConfig
  ) => {
    // Jersey outline
    const jerseyWidth = width * 0.8;
    const jerseyHeight = height * 0.6;
    const jerseyX = (width - jerseyWidth) / 2;
    const jerseyY = height * 0.1;
    
    // Tank top shape
    ctx.fillStyle = config.primaryColor;
    ctx.fillRect(jerseyX, jerseyY, jerseyWidth, jerseyHeight);
    
    // Neck hole
    ctx.fillStyle = config.secondaryColor;
    ctx.beginPath();
    ctx.moveTo(width * 0.35, jerseyY);
    ctx.quadraticCurveTo(width * 0.5, jerseyY + 30, width * 0.65, jerseyY);
    ctx.lineTo(width * 0.65, jerseyY);
    ctx.lineTo(width * 0.35, jerseyY);
    ctx.fill();
    
    // Trim
    ctx.fillStyle = config.secondaryColor;
    ctx.fillRect(jerseyX, jerseyY + jerseyHeight - 15, jerseyWidth, 15);
    ctx.fillRect(jerseyX, jerseyY, 15, jerseyHeight);
    ctx.fillRect(jerseyX + jerseyWidth - 15, jerseyY, 15, jerseyHeight);
    
    // Player number
    ctx.fillStyle = config.accentColor;
    ctx.font = 'bold 120px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(config.playerNumber, width / 2, height / 2.5);
    
    // Player name (if enabled)
    if (config.playerName) {
      ctx.fillStyle = config.accentColor;
      ctx.font = 'bold 40px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(config.playerName, width / 2, height / 1.5);
    }
    
    // Team name (simplified)
    if (config.team) {
      ctx.fillStyle = config.accentColor;
      ctx.font = 'bold 30px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(config.team.split(' ')[0], width / 2, height / 4);
    }
  };
  
  const drawBaseballUniform = (
    ctx: CanvasRenderingContext2D, 
    width: number, 
    height: number, 
    config: UniformConfig
  ) => {
    // Main jersey
    const jerseyWidth = width * 0.8;
    const jerseyHeight = height * 0.7;
    const jerseyX = (width - jerseyWidth) / 2;
    const jerseyY = height * 0.15;
    
    // Jersey base
    ctx.fillStyle = config.primaryColor;
    ctx.fillRect(jerseyX, jerseyY, jerseyWidth, jerseyHeight);
    
    // Pinstripes for certain teams
    if (['New York Yankees', 'Chicago Cubs'].includes(config.team)) {
      ctx.strokeStyle = adjustColor(config.primaryColor, 10); // Lighter shade
      ctx.lineWidth = 1;
      
      for (let x = jerseyX; x < jerseyX + jerseyWidth; x += 10) {
        ctx.beginPath();
        ctx.moveTo(x, jerseyY);
        ctx.lineTo(x, jerseyY + jerseyHeight);
        ctx.stroke();
      }
    }
    
    // Button strip
    ctx.fillStyle = config.primaryColor;
    ctx.fillRect(width / 2 - 15, jerseyY, 30, jerseyHeight);
    
    // Buttons
    ctx.fillStyle = config.secondaryColor;
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.arc(width / 2, jerseyY + 30 + i * 40, 5, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Team name curved across chest
    ctx.fillStyle = config.accentColor;
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.save();
    ctx.translate(width / 2, jerseyY + 60);
    ctx.scale(1, 0.8);
    ctx.fillText(config.team.split(' ').pop() || '', 0, 0);
    ctx.restore();
    
    // Player number
    ctx.fillStyle = config.secondaryColor;
    ctx.font = 'bold 80px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(config.playerNumber, width / 2, jerseyY + jerseyHeight / 2 + 30);
  };
  
  const drawFootballUniform = (
    ctx: CanvasRenderingContext2D, 
    width: number, 
    height: number, 
    config: UniformConfig
  ) => {
    // Jersey shape
    const jerseyWidth = width * 0.9;
    const jerseyHeight = height * 0.65;
    const jerseyX = (width - jerseyWidth) / 2;
    const jerseyY = height * 0.15;
    
    ctx.fillStyle = config.primaryColor;
    ctx.fillRect(jerseyX, jerseyY, jerseyWidth, jerseyHeight);
    
    // Shoulder pattern
    ctx.fillStyle = config.secondaryColor;
    ctx.beginPath();
    ctx.moveTo(jerseyX, jerseyY);
    ctx.lineTo(jerseyX + jerseyWidth * 0.3, jerseyY);
    ctx.lineTo(jerseyX + jerseyWidth * 0.5, jerseyY + 60);
    ctx.lineTo(jerseyX, jerseyY + 60);
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(jerseyX + jerseyWidth, jerseyY);
    ctx.lineTo(jerseyX + jerseyWidth * 0.7, jerseyY);
    ctx.lineTo(jerseyX + jerseyWidth * 0.5, jerseyY + 60);
    ctx.lineTo(jerseyX + jerseyWidth, jerseyY + 60);
    ctx.fill();
    
    // Player number (front)
    ctx.fillStyle = config.accentColor;
    ctx.font = 'bold 150px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(config.playerNumber, width / 2, jerseyY + jerseyHeight / 2);
    
    // Team name
    if (config.team) {
      ctx.fillStyle = config.accentColor;
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(config.team, width / 2, jerseyY + 30);
    }
  };
  
  const drawHockeyUniform = (
    ctx: CanvasRenderingContext2D, 
    width: number, 
    height: number, 
    config: UniformConfig
  ) => {
    // Jersey shape
    const jerseyWidth = width * 0.9;
    const jerseyHeight = height * 0.7;
    const jerseyX = (width - jerseyWidth) / 2;
    const jerseyY = height * 0.15;
    
    ctx.fillStyle = config.primaryColor;
    ctx.fillRect(jerseyX, jerseyY, jerseyWidth, jerseyHeight);
    
    // Stripes at bottom
    ctx.fillStyle = config.secondaryColor;
    ctx.fillRect(jerseyX, jerseyY + jerseyHeight - 50, jerseyWidth, 30);
    
    ctx.fillStyle = config.accentColor;
    ctx.fillRect(jerseyX, jerseyY + jerseyHeight - 20, jerseyWidth, 20);
    
    // Sleeve stripes
    ctx.fillStyle = config.secondaryColor;
    ctx.fillRect(jerseyX, jerseyY + 70, 60, 20);
    ctx.fillRect(jerseyX + jerseyWidth - 60, jerseyY + 70, 60, 20);
    
    // Player number
    ctx.fillStyle = config.accentColor;
    ctx.font = 'bold 140px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(config.playerNumber, width / 2, jerseyY + jerseyHeight / 2);
    
    // Team logo placeholder
    ctx.fillStyle = config.secondaryColor;
    ctx.beginPath();
    ctx.arc(width / 2, jerseyY + 60, 40, 0, Math.PI * 2);
    ctx.fill();
  };
  
  const drawSoccerUniform = (
    ctx: CanvasRenderingContext2D, 
    width: number, 
    height: number, 
    config: UniformConfig
  ) => {
    // Jersey shape
    const jerseyWidth = width * 0.8;
    const jerseyHeight = height * 0.6;
    const jerseyX = (width - jerseyWidth) / 2;
    const jerseyY = height * 0.15;
    
    ctx.fillStyle = config.primaryColor;
    ctx.fillRect(jerseyX, jerseyY, jerseyWidth, jerseyHeight);
    
    // Collar
    ctx.fillStyle = config.secondaryColor;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 30, jerseyY);
    ctx.lineTo(width / 2 + 30, jerseyY);
    ctx.lineTo(width / 2 + 20, jerseyY + 20);
    ctx.lineTo(width / 2 - 20, jerseyY + 20);
    ctx.closePath();
    ctx.fill();
    
    // Player number
    ctx.fillStyle = config.accentColor;
    ctx.font = 'bold 120px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(config.playerNumber, width / 2, jerseyY + jerseyHeight / 2 + 20);
    
    // Team name/logo placeholder
    ctx.fillStyle = config.secondaryColor;
    ctx.beginPath();
    ctx.arc(jerseyX + 60, jerseyY + 60, 30, 0, Math.PI * 2);
    ctx.fill();
    
    // Sponsor (simplified)
    ctx.strokeStyle = config.secondaryColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(jerseyX + jerseyWidth / 2 - 80, jerseyY + 50, 160, 40);
  };
  
  // Helper function to adjust color brightness
  const adjustColor = (color: string, amount: number): string => {
    return color;  // Simplified - would need proper color adjustment in real code
  };
  
  // Generate and apply the final texture
  const generateFinalTexture = () => {
    if (previewCanvas) {
      generateTexturePreview(previewCanvas, config);
      const textureUrl = previewCanvas.toDataURL('image/png');
      
      if (onTextureGenerated) {
        onTextureGenerated(textureUrl);
      }
    }
  };
  
  return (
    <div className="uniform-texture-mapper p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Uniform Texture Mapper</h3>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="sport">Sport &amp; Team</TabsTrigger>
          <TabsTrigger value="player">Player Info</TabsTrigger>
          <TabsTrigger value="material">Material</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sport" className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="sport-select" className="text-sm font-medium mb-1 block">Sport Type</Label>
              <Select 
                value={config.sport}
                onValueChange={(value: SportType) => setConfig(prev => ({ ...prev, sport: value }))}
              >
                <SelectTrigger id="sport-select">
                  <SelectValue placeholder="Select sport" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basketball">Basketball</SelectItem>
                  <SelectItem value="baseball">Baseball</SelectItem>
                  <SelectItem value="football">Football</SelectItem>
                  <SelectItem value="hockey">Hockey</SelectItem>
                  <SelectItem value="soccer">Soccer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-sm font-medium mb-1 block">Team</Label>
              <div className="grid grid-cols-2 gap-2 max-h-[150px] overflow-y-auto mb-4">
                {sportPresets[config.sport].map((team) => (
                  <Button 
                    key={team.name}
                    variant={config.team === team.name ? "default" : "outline"} 
                    className="justify-start h-auto py-2"
                    onClick={() => handleTeamSelect(team.name)}
                  >
                    <div 
                      className="w-4 h-4 rounded-full mr-2"
                      style={{ backgroundColor: team.primaryColor }}
                    />
                    <span className="truncate">{team.name}</span>
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label htmlFor="primary-color" className="text-sm font-medium mb-1 block">Primary Color</Label>
                <div className="flex items-center">
                  <div 
                    className="w-8 h-8 rounded border"
                    style={{ backgroundColor: config.primaryColor }} 
                  />
                  <Input 
                    id="primary-color"
                    type="color" 
                    value={config.primaryColor}
                    className="w-12 h-8 p-0 ml-2"
                    onChange={e => setConfig(prev => ({ ...prev, primaryColor: e.target.value }))} 
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="secondary-color" className="text-sm font-medium mb-1 block">Secondary</Label>
                <div className="flex items-center">
                  <div 
                    className="w-8 h-8 rounded border"
                    style={{ backgroundColor: config.secondaryColor }} 
                  />
                  <Input 
                    id="secondary-color"
                    type="color" 
                    value={config.secondaryColor}
                    className="w-12 h-8 p-0 ml-2"
                    onChange={e => setConfig(prev => ({ ...prev, secondaryColor: e.target.value }))} 
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="accent-color" className="text-sm font-medium mb-1 block">Accent</Label>
                <div className="flex items-center">
                  <div 
                    className="w-8 h-8 rounded border"
                    style={{ backgroundColor: config.accentColor }} 
                  />
                  <Input 
                    id="accent-color"
                    type="color" 
                    value={config.accentColor}
                    className="w-12 h-8 p-0 ml-2"
                    onChange={e => setConfig(prev => ({ ...prev, accentColor: e.target.value }))} 
                  />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="player" className="space-y-4">
          <div>
            <Label htmlFor="player-number" className="text-sm font-medium mb-1 block">Player Number</Label>
            <Input
              id="player-number"
              type="text"
              maxLength={2}
              value={config.playerNumber}
              onChange={e => setConfig(prev => ({ ...prev, playerNumber: e.target.value }))}
              className="text-center text-xl font-bold"
            />
          </div>
          
          <div>
            <Label htmlFor="player-name" className="text-sm font-medium mb-1 block">Player Name</Label>
            <Input
              id="player-name"
              type="text"
              value={config.playerName}
              onChange={e => setConfig(prev => ({ ...prev, playerName: e.target.value.toUpperCase() }))}
              className="text-center uppercase"
            />
          </div>
          
          <div className="border rounded-md p-3 bg-slate-50">
            <h4 className="font-medium text-sm mb-2">Name & Number Preview</h4>
            <div className="bg-gray-100 py-3 text-center rounded-md border">
              <div className="text-5xl font-bold" style={{ color: config.accentColor, textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                {config.playerNumber}
              </div>
              <div className="text-lg tracking-wider mt-2" style={{ color: config.accentColor }}>
                {config.playerName}
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="material" className="space-y-4">
          <div>
            <Label className="text-sm font-medium mb-1 block">Fabric Type</Label>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {(['mesh', 'cotton', 'synthetic', 'wool'] as FabricType[]).map((fabric) => (
                <Button 
                  key={fabric}
                  variant={config.fabricType === fabric ? "default" : "outline"} 
                  onClick={() => setConfig(prev => ({ ...prev, fabricType: fabric }))}
                  className="justify-center"
                >
                  <span className="capitalize">{fabric}</span>
                  {config.fabricType === fabric && <CheckCircle className="w-4 h-4 ml-2" />}
                </Button>
              ))}
            </div>
          </div>
          
          <div>
            <Label className="text-sm font-medium mb-1 block">Weathering Effect</Label>
            <div className="grid grid-cols-3 gap-2">
              {(['new', 'game-worn', 'vintage'] as WeatheringEffect[]).map((effect) => (
                <Button 
                  key={effect}
                  variant={config.weathering === effect ? "default" : "outline"} 
                  onClick={() => setConfig(prev => ({ ...prev, weathering: effect }))}
                  className="justify-center"
                >
                  <span className="capitalize">{effect.replace('-', ' ')}</span>
                </Button>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 flex flex-col items-center">
        <div className="relative border rounded-md overflow-hidden mb-4" style={{ width: '250px', height: '250px' }}>
          {previewCanvas && (
            <img 
              src={previewCanvas.toDataURL('image/png')} 
              alt="Uniform texture preview" 
              className="w-full h-full object-cover"
            />
          )}
          
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-2">
            <p className="text-xs text-white font-medium">
              {config.team || "Custom"} {config.sport.charAt(0).toUpperCase() + config.sport.slice(1)} Jersey
            </p>
          </div>
        </div>
        
        <Button onClick={generateFinalTexture} className="w-full">
          Generate Texture
        </Button>
      </div>
    </div>
  );
};

export default UniformTextureMapper;

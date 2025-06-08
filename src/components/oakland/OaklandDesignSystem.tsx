
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ColorSwatch {
  name: string;
  value: string;
  description: string;
}

interface TypographyExample {
  name: string;
  className: string;
  text: string;
}

const OaklandDesignSystem: React.FC = () => {
  const colorPalette: ColorSwatch[] = [
    { name: 'Oakland Green Primary', value: '#003831', description: 'Main team color' },
    { name: 'Oakland Gold Primary', value: '#EFB21E', description: 'Secondary team color' },
    { name: 'Coliseum Concrete', value: '#8D9397', description: 'Stadium atmosphere' },
    { name: 'Oakland Protest', value: '#DC2626', description: 'Fan activism' },
    { name: 'Oakland Nostalgia', value: '#92400E', description: 'Vintage memories' },
    { name: 'Oakland Hope', value: '#10B981', description: 'Future optimism' },
  ];

  const typographyExamples: TypographyExample[] = [
    { name: 'Hero Text', className: 'text-oakland-hero font-protest', text: 'Oakland Forever' },
    { name: 'Display Text', className: 'text-oakland-display font-display', text: 'We Stayed in the Stands' },
    { name: 'Title Text', className: 'text-oakland-title font-display', text: 'Memory of the Coliseum' },
    { name: 'Nostalgia Text', className: 'font-nostalgia text-lg', text: 'Game recap from 1989...' },
    { name: 'Protest Text', className: 'font-protest text-xl', text: 'SELL THE TEAM' },
  ];

  const emotions = [
    { name: 'joy', label: '😊 Joy' },
    { name: 'heartbreak', label: '💔 Heartbreak' },
    { name: 'anger', label: '😡 Anger' },
    { name: 'nostalgia', label: '🥺 Nostalgia' },
    { name: 'hope', label: '🌟 Hope' },
    { name: 'protest', label: '✊ Protest' }
  ];

  return (
    <div className="min-h-screen bg-oakland-primary p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-oakland-hero font-protest text-white mb-4">
            Oakland Design System
          </h1>
          <p className="text-xl text-yellow-400 font-display">
            Authentic Oakland A's Fan Culture Visual Language
          </p>
        </div>

        {/* Color Palette */}
        <Card className="oakland-memory-card">
          <CardHeader>
            <CardTitle className="text-white font-display">Color Palette</CardTitle>
            <CardDescription className="text-gray-300">
              Colors inspired by Oakland baseball heritage and fan culture
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {colorPalette.map((color) => (
                <div key={color.name} className="text-center">
                  <div 
                    className="w-full h-16 rounded-lg mb-2 border border-gray-600"
                    style={{ backgroundColor: color.value }}
                  />
                  <p className="text-white font-medium text-sm">{color.name}</p>
                  <p className="text-gray-400 text-xs">{color.value}</p>
                  <p className="text-gray-300 text-xs mt-1">{color.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Typography */}
        <Card className="oakland-memory-card">
          <CardHeader>
            <CardTitle className="text-white font-display">Typography System</CardTitle>
            <CardDescription className="text-gray-300">
              Fonts that capture Oakland's gritty, authentic spirit
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {typographyExamples.map((example) => (
              <div key={example.name} className="border-b border-gray-700 pb-4">
                <p className="text-gray-400 text-sm mb-2">{example.name}</p>
                <p className={`${example.className} text-white`}>
                  {example.text}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Emotion Badges */}
        <Card className="oakland-memory-card">
          <CardHeader>
            <CardTitle className="text-white font-display">Emotion System</CardTitle>
            <CardDescription className="text-gray-300">
              Visual language for Oakland fan emotions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {emotions.map((emotion) => (
                <Badge 
                  key={emotion.name}
                  className={`oakland-emotion-badge ${emotion.name}`}
                >
                  {emotion.label}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Button Styles */}
        <Card className="oakland-memory-card">
          <CardHeader>
            <CardTitle className="text-white font-display">Button System</CardTitle>
            <CardDescription className="text-gray-300">
              Interactive elements with Oakland personality
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button className="btn-oakland-primary">
                Create Memory
              </Button>
              <Button className="btn-oakland-protest">
                Join Protest
              </Button>
              <Button variant="outline" className="border-yellow-500 text-yellow-400 hover:bg-yellow-900/20">
                Explore Archive
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Visual Effects */}
        <Card className="oakland-memory-card">
          <CardHeader>
            <CardTitle className="text-white font-display">Visual Effects</CardTitle>
            <CardDescription className="text-gray-300">
              Special effects for different memory types
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="effect-dusty-glow p-4 rounded-lg">
                <p className="text-white font-medium">Dusty Glow Effect</p>
                <p className="text-gray-300 text-sm">For nostalgic memories</p>
              </div>
              <div className="effect-protest-red p-4 rounded-lg">
                <p className="text-white font-medium">Protest Red Effect</p>
                <p className="text-gray-300 text-sm">For activism content</p>
              </div>
              <div className="effect-vintage-grain p-4 rounded-lg bg-gray-800">
                <p className="text-white font-medium">Vintage Grain Effect</p>
                <p className="text-gray-300 text-sm">For historical moments</p>
              </div>
              <div className="oakland-shine-effect p-4 rounded-lg bg-green-900">
                <p className="text-white font-medium">Oakland Shine Effect</p>
                <p className="text-gray-300 text-sm">For celebration memories</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Era Badges */}
        <Card className="oakland-memory-card">
          <CardHeader>
            <CardTitle className="text-white font-display">Era Classification</CardTitle>
            <CardDescription className="text-gray-300">
              Visual indicators for different Oakland baseball eras
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Badge className="oakland-era-badge">👑 Dynasty 70s</Badge>
              <Badge className="oakland-era-badge">💪 Bash Brothers</Badge>
              <Badge className="oakland-era-badge">📊 Moneyball</Badge>
              <Badge className="oakland-era-badge">🎯 Playoff Runs</Badge>
              <Badge className="oakland-era-badge">👋 Farewell</Badge>
              <Badge className="oakland-era-badge">🌱 Early Years</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OaklandDesignSystem;

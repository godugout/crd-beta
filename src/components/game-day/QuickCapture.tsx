
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Camera, Share, Image, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import QuickMomentCard from './QuickMomentCard';
import { useOfflineStorage } from '@/hooks/useOfflineStorage';

interface QuickCaptureProps {
  stadiumContext?: {
    name: string;
    location: string;
    team: string;
    section?: string;
  };
  isOnline: boolean;
}

// Quick capture moment definitions
const quickMoments = [
  {
    id: 'homerun',
    title: 'Home Run!',
    icon: '🏃',
    template: 'classic',
    tags: ['homerun', 'highlight']
  },
  {
    id: 'great-play',
    title: 'Great Play',
    icon: '🧤',
    template: 'classic',
    tags: ['defense', 'highlight']
  },
  {
    id: 'food',
    title: 'Ballpark Food',
    icon: '🌭',
    template: 'tailgate',
    tags: ['food', 'experience']
  },
  {
    id: 'friends',
    title: 'With Friends',
    icon: '👥',
    template: 'tailgate',
    tags: ['friends', 'experience']
  },
  {
    id: 'view',
    title: 'Stadium View',
    icon: '🏟️',
    template: 'coliseum',
    tags: ['stadium', 'view']
  },
  {
    id: 'mascot',
    title: 'Mascot Moment',
    icon: '🐘',
    template: 'classic',
    tags: ['mascot', 'entertainment']
  }
];

const QuickCapture: React.FC<QuickCaptureProps> = ({ stadiumContext, isOnline }) => {
  const navigate = useNavigate();
  const { saveData } = useOfflineStorage();
  const [captureMode, setCaptureMode] = useState<'quick' | 'custom'>('quick');

  const handleCreateMemory = (type: string = 'custom') => {
    navigate('/oakland/create');
  };

  const handleQuickCapture = (momentType: string) => {
    const moment = quickMoments.find(m => m.id === momentType);
    
    // In a real app, this would open the camera
    // For now, simulate capturing and storing
    toast.success(`Quick moment captured: ${moment?.title}`);
    
    // If offline, store locally
    if (!isOnline) {
      saveData({
        title: moment?.title || 'Quick Moment',
        tags: moment?.tags || [],
        createdAt: new Date().toISOString(),
        template: moment?.template || 'classic',
        location: stadiumContext?.name || '',
        section: stadiumContext?.section || '',
        // In a real implementation, we'd have the actual image data here
      }, {
        collectionName: 'quick-captures',
        persistOffline: true
      });
      
      toast('Saved offline. Will upload when connection is available.', {
        icon: <Upload className="h-4 w-4" />
      });
    } else {
      // If online, would normally upload directly
      setTimeout(() => {
        navigate('/oakland/create');
      }, 1500);
    }
  };

  return (
    <div>
      <Tabs defaultValue="quick" className="mb-4">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="quick" className="flex-1" onClick={() => setCaptureMode('quick')}>
            Quick Capture
          </TabsTrigger>
          <TabsTrigger value="custom" className="flex-1" onClick={() => setCaptureMode('custom')}>
            Custom Memory
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="quick">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {quickMoments.map(moment => (
              <QuickMomentCard
                key={moment.id}
                title={moment.title}
                icon={moment.icon}
                onClick={() => handleQuickCapture(moment.id)}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="custom">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Create Custom Memory</h3>
            <p className="text-sm text-gray-600 mb-6">
              Create a fully customized memory with all details and options.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="h-20 flex flex-col"
                onClick={() => handleCreateMemory()}
              >
                <Image className="h-6 w-6 mb-2" />
                <span>Upload Photo</span>
              </Button>
              
              <Button 
                variant="default" 
                className="h-20 flex flex-col bg-[#006341] hover:bg-[#003831]"
                onClick={() => navigate('/oakland/create')}
              >
                <Camera className="h-6 w-6 mb-2" />
                <span>Take Photo</span>
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Context aware tips */}
      {stadiumContext && (
        <Card className="p-4 mt-4 bg-amber-50 border-amber-200">
          <div className="flex">
            <div className="mr-4 text-2xl">💡</div>
            <div>
              <h4 className="font-medium">Stadium Tips</h4>
              <p className="text-sm text-amber-800 mt-1">
                {stadiumContext.name === 'Oakland Coliseum' 
                  ? 'Try capturing the field panorama from your section! You can use Stadium View template for best results.'
                  : 'Use location tags to remember where you captured this memory!'}
              </p>
              
              <div className="flex mt-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs h-8 border-amber-300 text-amber-800 hover:bg-amber-100"
                >
                  <Share className="h-3 w-3 mr-1" />
                  Share Location
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default QuickCapture;

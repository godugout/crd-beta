
import React, { useState } from 'react';
import { Card } from '@/lib/types/cardTypes';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Share2, ThumbsUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ShareDialog from '@/components/ShareDialog';
import { showToast } from '@/lib/adapters/toastAdapter';

interface CardViewerProps {
  card: Card;
  onBack?: () => void;
  showShareButton?: boolean;
  showDownloadButton?: boolean;
  showLikeButton?: boolean;
}

const CardViewer: React.FC<CardViewerProps> = ({
  card,
  onBack,
  showShareButton = true,
  showDownloadButton = true,
  showLikeButton = true,
}) => {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  const handleShare = () => {
    setIsShareDialogOpen(true);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (!isLiked) {
      showToast({
        title: "Card Liked!",
        description: "This card has been added to your favorites"
      });
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(card.imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${card.title.replace(/\s+/g, '-').toLowerCase()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showToast({
        title: "Download Started",
        description: "Your card image is being downloaded"
      });
    } catch (error) {
      console.error('Download error:', error);
      showToast({
        title: "Download Failed",
        description: "There was an error downloading the image",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-4 flex items-center">
        {onBack && (
          <Button variant="ghost" onClick={onBack} className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        )}
        <h1 className="text-2xl font-bold flex-1">{card.title}</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className={`aspect-[2.5/3.5] rounded-lg overflow-hidden shadow-lg ${card.effects?.join(' ') || ''}`}>
            <img 
              src={card.imageUrl} 
              alt={card.title} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex justify-center space-x-2 mt-4">
            {showDownloadButton && (
              <Button variant="outline" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            )}
            
            {showShareButton && (
              <Button variant="outline" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
            )}
            
            {showLikeButton && (
              <Button 
                variant={isLiked ? "default" : "outline"}
                onClick={handleLike}
              >
                <ThumbsUp className="h-4 w-4 mr-1" />
                {isLiked ? 'Liked' : 'Like'}
              </Button>
            )}
          </div>
        </div>
        
        <div className="md:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="attributes">Attributes</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details">
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-medium">Description</h2>
                  <p className="text-gray-700">{card.description || 'No description provided.'}</p>
                </div>
                
                {card.tags && card.tags.length > 0 && (
                  <div>
                    <h2 className="text-lg font-medium">Tags</h2>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {card.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  {card.player && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Player</h3>
                      <p>{card.player}</p>
                    </div>
                  )}
                  
                  {card.team && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Team</h3>
                      <p>{card.team}</p>
                    </div>
                  )}
                  
                  {card.year && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Year</h3>
                      <p>{card.year}</p>
                    </div>
                  )}
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Created</h3>
                    <p>{new Date(card.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="attributes">
              <div className="space-y-4">
                <h2 className="text-lg font-medium">Card Attributes</h2>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Effects</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {card.effects && card.effects.length > 0 ? (
                      card.effects.map((effect) => (
                        <Badge key={effect} variant="outline">{effect}</Badge>
                      ))
                    ) : (
                      <span className="text-gray-500">No effects applied</span>
                    )}
                  </div>
                </div>
                
                {card.designMetadata && (
                  <div className="space-y-2">
                    {card.designMetadata.cardStyle && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Card Style</h3>
                        <div className="grid grid-cols-2 gap-2 mt-1">
                          <div className="flex items-center">
                            <span className="text-xs text-gray-500 w-24">Template:</span>
                            <span>{card.designMetadata.cardStyle.template || 'Standard'}</span>
                          </div>
                          
                          <div className="flex items-center">
                            <span className="text-xs text-gray-500 w-24">Border Color:</span>
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: card.designMetadata.cardStyle.borderColor || '#000000' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="history">
              <div className="space-y-4">
                <h2 className="text-lg font-medium">History</h2>
                <p className="text-gray-700">Card created on {new Date(card.createdAt).toLocaleString()}</p>
                <p className="text-gray-700">Last updated on {new Date(card.updatedAt).toLocaleString()}</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <ShareDialog 
        isOpen={isShareDialogOpen}
        onClose={() => setIsShareDialogOpen(false)}
        title={card.title}
        url={window.location.href}
        imageUrl={card.imageUrl}
      />
    </div>
  );
};

export default CardViewer;

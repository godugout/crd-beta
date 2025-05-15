
import React from 'react';
import { Card, CardContent } from './card';
import { Avatar, AvatarImage, AvatarFallback } from './avatar';
import { Share2, Heart, MessageSquare } from 'lucide-react';
import { Button } from './button';

interface SocialMediaCardProps {
  username: string;
  userAvatar?: string;
  cardImage: string;
  cardTitle: string;
  cardDescription?: string;
  likes?: number;
  comments?: number;
  shares?: number;
  timestamp?: string;
  className?: string;
}

export const SocialMediaCard: React.FC<SocialMediaCardProps> = ({
  username,
  userAvatar,
  cardImage,
  cardTitle,
  cardDescription,
  likes = 0,
  comments = 0,
  shares = 0,
  timestamp = 'Just now',
  className = ''
}) => {
  const userInitial = username.charAt(0).toUpperCase();
  
  return (
    <Card className={`overflow-hidden ${className}`}>
      <div className="p-3 flex items-center space-x-2 border-b">
        <Avatar>
          {userAvatar ? (
            <AvatarImage src={userAvatar} alt={username} />
          ) : (
            <AvatarFallback>{userInitial}</AvatarFallback>
          )}
        </Avatar>
        <div>
          <p className="text-sm font-medium">{username}</p>
          <p className="text-xs text-gray-500">{timestamp}</p>
        </div>
      </div>
      
      <div className="aspect-square bg-gray-100 overflow-hidden">
        <img 
          src={cardImage} 
          alt={cardTitle} 
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder-card.png';
          }}
        />
      </div>
      
      <CardContent className="p-3">
        <h4 className="font-medium mb-1">{cardTitle}</h4>
        {cardDescription && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">{cardDescription}</p>
        )}
        
        <div className="flex justify-between items-center text-sm text-gray-500">
          <div className="flex space-x-3">
            <span className="flex items-center">
              <Heart className="h-4 w-4 mr-1" /> {likes}
            </span>
            <span className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-1" /> {comments}
            </span>
          </div>
          
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

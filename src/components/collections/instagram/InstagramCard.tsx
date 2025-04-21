
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { InstagramPost } from '@/lib/types';
import { format } from 'date-fns';
import { Instagram, MessageCircle, Heart } from 'lucide-react';
import { CardEffect } from '@/hooks/card-effects';

interface InstagramCardProps {
  post: InstagramPost;
  username: string;
  onClick?: () => void;
  effects?: CardEffect[];
}

const InstagramCard = ({ post, username, onClick, effects = [] }: InstagramCardProps) => {
  const formattedDate = format(new Date(post.timestamp), 'MMM d, yyyy');
  const isVideo = post.mediaType === 'VIDEO';
  
  // Build effect classes
  const effectClasses = effects.map(effect => effect.className).join(' ');

  return (
    <Card 
      className={`overflow-hidden cursor-pointer hover:shadow-md transition-shadow ${effectClasses}`}
      onClick={onClick}
    >
      <div className="relative">
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/50 to-transparent p-3 z-10">
          <div className="flex items-center">
            <Instagram className="h-4 w-4 text-white mr-2" />
            <span className="text-white text-sm font-medium">@{username}</span>
          </div>
        </div>
        
        <div className="aspect-square bg-gray-100">
          {isVideo ? (
            <div className="w-full h-full flex items-center justify-center relative">
              <img 
                src={post.thumbnailUrl || post.mediaUrl} 
                alt={post.caption || 'Instagram post'} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 0C4.5 0 0 4.5 0 10s4.5 10 10 10 10-4.5 10-10S15.5 0 10 0zm3.5 10.5l-5 3.5v-7l5 3.5z"/>
                </svg>
              </div>
            </div>
          ) : (
            <img 
              src={post.mediaUrl} 
              alt={post.caption || 'Instagram post'} 
              className="w-full h-full object-cover"
            />
          )}
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-white z-10">
          <div className="flex items-center justify-between">
            <span className="text-sm">{formattedDate}</span>
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <Heart className="h-4 w-4 mr-1" />
                <span className="text-xs">
                  {Math.floor(Math.random() * 1000) + 10}
                </span>
              </div>
              <div className="flex items-center">
                <MessageCircle className="h-4 w-4 mr-1" />
                <span className="text-xs">
                  {Math.floor(Math.random() * 100)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <CardContent className="p-3">
        {post.caption && (
          <p className="text-sm line-clamp-3">
            {post.caption}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default InstagramCard;

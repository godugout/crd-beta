
import React, { useState, useEffect } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuth } from '@/context/auth';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Bell, MessageCircle, Heart, Star, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

interface Notification {
  id: string;
  userId: string;
  type: 'reaction' | 'comment' | 'follow' | 'mention' | 'share';
  seen: boolean;
  createdAt: string;
  relatedItemId?: string;
  relatedItemType?: string;
  message: string;
  actorName?: string;
  actorAvatar?: string;
}

const Notifications: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  // This is just a mock implementation as we don't have a notifications table yet
  useEffect(() => {
    if (user) {
      // In a real implementation, we would fetch from the database
      // For now, let's simulate some notifications
      const mockNotifications: Notification[] = [
        {
          id: '1',
          userId: user.id,
          type: 'reaction',
          seen: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
          relatedItemId: 'card-1',
          relatedItemType: 'card',
          message: 'liked your card "Baseball Memories"',
          actorName: 'Jane Smith',
          actorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane'
        },
        {
          id: '2',
          userId: user.id,
          type: 'comment',
          seen: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
          relatedItemId: 'card-2',
          relatedItemType: 'card',
          message: 'commented on your card "Oakland Game Day"',
          actorName: 'John Doe',
          actorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
        },
        {
          id: '3',
          userId: user.id,
          type: 'follow',
          seen: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
          message: 'started following you',
          actorName: 'Mike Johnson',
          actorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike'
        },
        {
          id: '4',
          userId: user.id,
          type: 'share',
          seen: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
          relatedItemId: 'collection-1',
          relatedItemType: 'collection',
          message: 'shared your collection "Oakland Memories"',
          actorName: 'Sarah Williams',
          actorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
        }
      ];
      
      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.seen).length);
      
      // In a real app, we would set up a Supabase realtime subscription here
      // to get live notifications
    }
  }, [user]);
  
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({
      ...notification,
      seen: true
    })));
    setUnreadCount(0);
    toast.success('All notifications marked as read');
    
    // In a real app, we would make an API call to update the database
  };
  
  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === id 
        ? { ...notification, seen: true } 
        : notification
    ));
    
    setUnreadCount(prev => Math.max(0, prev - 1));
    
    // In a real app, we would make an API call to update the database
  };
  
  const getFilteredNotifications = () => {
    if (activeTab === 'all') {
      return notifications;
    }
    return notifications.filter(notification => notification.type === activeTab);
  };
  
  const NotificationIcon = ({ type }: { type: string }) => {
    switch (type) {
      case 'reaction':
        return <Heart className="h-4 w-4 text-pink-500" />;
      case 'comment':
        return <MessageCircle className="h-4 w-4 text-blue-500" />;
      case 'follow':
        return <User className="h-4 w-4 text-green-500" />;
      case 'mention':
        return <Star className="h-4 w-4 text-yellow-500" />;
      case 'share':
        return <Star className="h-4 w-4 text-purple-500" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  if (!user) {
    return null;
  }
  
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 md:w-96 p-0" align="end">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 text-xs"
              onClick={markAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-4 py-2 border-b">
            <TabsList className="w-full grid grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="reaction">Likes</TabsTrigger>
              <TabsTrigger value="comment">Comments</TabsTrigger>
              <TabsTrigger value="follow">Follows</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value={activeTab} className="max-h-[300px] overflow-y-auto focus-visible:outline-none">
            {getFilteredNotifications().length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                No {activeTab === 'all' ? '' : activeTab} notifications
              </div>
            ) : (
              <div>
                {getFilteredNotifications().map(notification => (
                  <div 
                    key={notification.id}
                    className={`p-4 border-b flex items-start gap-3 ${
                      notification.seen ? 'bg-background' : 'bg-muted/30'
                    } hover:bg-muted/50 cursor-pointer`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="mt-1">
                      {notification.actorAvatar ? (
                        <img 
                          src={notification.actorAvatar} 
                          alt={notification.actorName || 'User'} 
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                          <NotificationIcon type={notification.type} />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm">
                          <strong>{notification.actorName}</strong> {notification.message}
                        </p>
                        {!notification.seen && (
                          <Badge variant="default" className="bg-primary h-2 w-2 rounded-full p-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}
                
                <div className="p-4 text-center">
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/notifications">View All Notifications</Link>
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
};

export default Notifications;

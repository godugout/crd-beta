
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { UserProfile } from '@/pages/Dashboard';

interface UserCardProps {
  user: UserProfile;
}

export const UserCard: React.FC<UserCardProps> = ({ user }) => {
  const getAvatarFallback = (name: string) => {
    return name
      ? name
          .split(' ')
          .map(word => word[0])
          .join('')
          .toUpperCase()
      : 'U';
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-500 hover:bg-red-600';
      case 'moderator':
        return 'bg-orange-500 hover:bg-orange-600';
      case 'creator':
        return 'bg-violet-500 hover:bg-violet-600';
      default:
        return 'bg-blue-500 hover:bg-blue-600';
    }
  };

  return (
    <Card className="overflow-hidden h-full">
      <CardHeader className="pt-6">
        <div className="flex items-center space-x-3">
          <Avatar className="h-16 w-16 border-2 border-primary">
            <AvatarImage src={user.avatarUrl || ''} alt={user.name || 'User'} />
            <AvatarFallback>{getAvatarFallback(user.name || '')}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-lg">{user.name || user.username || 'Anonymous'}</h3>
            <Badge className={`${getRoleBadgeColor(user.role)} mt-1`}>
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        {user.bio && <p className="text-sm text-gray-600">{user.bio}</p>}
        <p className="text-sm text-gray-500 mt-2">
          User since {new Date(user.createdAt).toLocaleDateString()}
        </p>
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-between">
        <span className="text-xs text-gray-500">{user.email}</span>
      </CardFooter>
    </Card>
  );
};

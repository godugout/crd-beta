
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ensureDevUserLoggedIn } from '@/utils/devAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, LogIn, LogOut } from 'lucide-react';

const DevAuthStatus: React.FC = () => {
  const { user, signOut, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleAutoLogin = async () => {
    setIsLoading(true);
    await ensureDevUserLoggedIn();
    setIsLoading(false);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  // Only show in development
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg p-3 shadow-lg">
      <div className="flex items-center gap-2 text-sm">
        <User className="h-4 w-4" />
        <span className="font-medium">Dev Auth:</span>
        
        {isAuthenticated && user ? (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-green-600 border-green-600">
              Logged In
            </Badge>
            <span className="text-xs text-gray-600 max-w-[120px] truncate">
              {user.email}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="h-6 px-2"
            >
              <LogOut className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-red-600 border-red-600">
              Not Logged In
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAutoLogin}
              disabled={isLoading}
              className="h-6 px-2"
            >
              <LogIn className="h-3 w-3" />
              {isLoading ? 'Logging in...' : 'Auto Login'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DevAuthStatus;

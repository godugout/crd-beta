
import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-4">
      <div className="rounded-full bg-red-100 p-4 mb-6">
        <Shield className="h-12 w-12 text-red-500" />
      </div>
      
      <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
      
      <p className="text-center text-gray-600 max-w-md mb-6">
        You don't have permission to access this page. If you believe this is an error, 
        please contact support or try signing in with a different account.
      </p>
      
      <div className="flex gap-4">
        <Button asChild variant="outline">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return Home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default Unauthorized;

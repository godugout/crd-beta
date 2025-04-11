
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, ArrowLeft } from "lucide-react";
import { logger } from "@/lib/monitoring/logger";

const Unauthorized = () => {
  const navigate = useNavigate();
  
  React.useEffect(() => {
    logger.warn("User attempted to access unauthorized page");
  }, []);

  const goBack = () => {
    navigate(-1);
  };

  const goHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="text-center max-w-lg p-6">
        <div className="mx-auto w-20 h-20 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mb-6">
          <Shield className="h-10 w-10 text-yellow-600 dark:text-yellow-500" />
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          You don't have permission to access this page. Please contact an administrator if you believe this is an error.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" onClick={goBack} className="flex items-center justify-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
          
          <Button onClick={goHome}>
            Return Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;

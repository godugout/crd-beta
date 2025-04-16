
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import PageLayout from '@/components/navigation/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { User } from '@/lib/types';

type AuthMode = 'signin' | 'signup';

const Auth: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [mode, setMode] = useState<AuthMode>('signin');
  const [isLoading, setIsLoading] = useState(false);
  
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'signin') {
        await signIn(email, password);
        toast.success('Signed in successfully');
      } else {
        // Pass name as userData object for signup
        await signUp(email, password, { name } as Partial<User>);
        toast.success('Account created successfully');
      }
      navigate(from, { replace: true });
    } catch (error: any) {
      toast.error(error.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
  };

  return (
    <PageLayout
      title={mode === 'signin' ? 'Sign In' : 'Create Account'}
      description="Access your CardShow account"
      hideNavigation
    >
      <div className="flex justify-center items-center min-h-[80vh] px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>{mode === 'signin' ? 'Sign In' : 'Create Account'}</CardTitle>
            <CardDescription>
              {mode === 'signin' 
                ? 'Enter your credentials to access your account' 
                : 'Fill out the form to create a new account'}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {mode === 'signup' && (
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={mode === 'signup'}
                    placeholder="Your name"
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your.email@example.com"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                />
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading 
                  ? 'Processing...' 
                  : mode === 'signin' ? 'Sign In' : 'Create Account'}
              </Button>
              
              <div className="text-center text-sm">
                {mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
                <Button 
                  variant="link" 
                  className="p-0" 
                  type="button" 
                  onClick={toggleMode}
                >
                  {mode === 'signin' ? 'Sign Up' : 'Sign In'}
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Auth;

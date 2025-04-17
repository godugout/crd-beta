
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';

interface LocationState {
  from?: {
    pathname: string;
  };
}

const AuthPage: React.FC = () => {
  const [email, setEmail] = useState('dusty@godugout.com');
  const [password, setPassword] = useState('CRD');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('signin');
  
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as LocationState;
  
  // Redirect to the page the user was trying to access, or to dashboard
  const from = locationState?.from?.pathname || '/';
  
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const result = await auth.signIn(email, password);
      
      if (result.success) {
        toast.success('Welcome back!');
        navigate(from, { replace: true });
      } else {
        toast.error('Sign in failed', { 
          description: result.error || 'Please check your credentials and try again'
        });
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast.error('Sign in failed', { 
        description: 'An unexpected error occurred'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const result = await auth.signUp(email, password, { name });
      
      if (result.success) {
        toast.success('Account created successfully');
        navigate(from, { replace: true });
      } else {
        toast.error('Sign up failed', { 
          description: result.error || 'Please try again with different credentials'
        });
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast.error('Sign up failed', { 
        description: 'An unexpected error occurred'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleForgotPassword = async () => {
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await auth.resetPassword(email);
      
      if (result.success) {
        toast.success('Password reset email sent', {
          description: 'Please check your inbox for further instructions'
        });
      } else {
        toast.error('Failed to send reset email', {
          description: result.error || 'Please try again later'
        });
      }
    } catch (error) {
      toast.error('Failed to send reset email', {
        description: 'An unexpected error occurred'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-background to-muted/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            <span>CardShow</span>
            <span className="text-orange-500"> CRD</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your digital collection starts here
          </p>
        </div>
        
        <Card className="shadow-lg">
          <Tabs defaultValue="signin" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input 
                      id="signin-email" 
                      type="email" 
                      autoComplete="email"
                      placeholder="dusty@godugout.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="signin-password">Password</Label>
                      <button 
                        type="button" 
                        className="text-xs text-primary hover:underline" 
                        onClick={handleForgotPassword}
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Input 
                        id="signin-password" 
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button 
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    <p>Test credentials:</p>
                    <p>Email: dusty@godugout.com</p>
                    <p>Password: CRD</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Signing in..." : "Sign In"}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input 
                      id="signup-name" 
                      placeholder="Your Name" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input 
                      id="signup-email" 
                      type="email" 
                      placeholder="your@email.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Input 
                        id="signup-password" 
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button 
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creating Account..." : "Sign Up"}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
        
        <div className="text-center">
          <Link to="/" className="text-sm text-primary hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

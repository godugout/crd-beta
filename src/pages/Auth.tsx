import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Github, Mail } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading, signIn, signUp, signInWithProvider } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);
  
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setErrorMsg(null);
    
    try {
      await signIn(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to sign in");
    } finally {
      setAuthLoading(false);
    }
  };
  
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setErrorMsg(null);
    
    if (!name.trim()) {
      setErrorMsg("Name is required");
      setAuthLoading(false);
      return;
    }
    
    try {
      await signUp(email, password, name);
      navigate('/dashboard');
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to sign up");
    } finally {
      setAuthLoading(false);
    }
  };
  
  const handleSocialSignIn = async (provider: 'google' | 'github' | 'facebook') => {
    setAuthLoading(true);
    setErrorMsg(null);
    
    try {
      await signInWithProvider(provider);
      navigate('/dashboard');
    } catch (err: any) {
      setErrorMsg(err.message || `Failed to sign in with ${provider}`);
    } finally {
      setAuthLoading(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="h-16 flex items-center px-4 border-b">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-xl font-bold">CardShow</Link>
        </div>
      </header>
      
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Welcome to CardShow</h1>
            <p className="text-muted-foreground mt-2">
              Sign in or create an account to manage your digital cards
            </p>
          </div>
          
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4 mb-6">
                <Button 
                  variant="outline" 
                  className="w-full" 
                  disabled={authLoading}
                  onClick={() => handleSocialSignIn('google')}
                >
                  <img src="https://authjs.dev/img/providers/google.svg" alt="Google" className="mr-2 h-4 w-4" />
                  Continue with Google
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full" 
                  disabled={authLoading}
                  onClick={() => handleSocialSignIn('github')}
                >
                  <Github className="mr-2 h-4 w-4" />
                  Continue with GitHub
                </Button>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>
              </div>
              
              <Tabs defaultValue="signin">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="signin">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                
                {errorMsg && (
                  <div className="bg-destructive/10 text-destructive p-3 rounded-md mb-4 text-sm">
                    {errorMsg}
                  </div>
                )}
                
                <TabsContent value="signin">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email">Email address</Label>
                      <Input 
                        id="signin-email" 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email" 
                        required 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="signin-password">Password</Label>
                        <Link to="/auth/reset-password" className="text-xs text-primary hover:underline">
                          Forgot password?
                        </Link>
                      </div>
                      <Input 
                        id="signin-password" 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password" 
                        required 
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={authLoading}
                    >
                      {authLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        <>
                          <Mail className="mr-2 h-4 w-4" />
                          Sign In with Email
                        </>
                      )}
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="signup">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Name</Label>
                      <Input 
                        id="signup-name" 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name" 
                        required 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email address</Label>
                      <Input 
                        id="signup-email" 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email" 
                        required 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input 
                        id="signup-password" 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create a password (min. 6 characters)" 
                        required 
                        minLength={6}
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={authLoading}
                    >
                      {authLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        'Create Account'
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
            
            <CardFooter className="border-t px-6 py-4 flex justify-between">
              <p className="text-xs text-muted-foreground">
                By continuing, you agree to our Terms of Service and Privacy Policy.
              </p>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Auth;

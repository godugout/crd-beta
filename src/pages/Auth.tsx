
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Github, Mail } from "lucide-react";
import { captureException } from '@/lib/monitoring/sentry';
import { logger } from '@/lib/monitoring/logger';
import { performance } from '@/lib/monitoring/performance';

const Auth = () => {
  const navigate = useNavigate();
  const { signIn, signUp, signInWithProvider, isLoading, error, user } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/gallery');
    }
  }, [user, navigate]);
  
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      performance.startMeasurement('sign-in', { email });
      await signIn(email, password);
      logger.info('User signed in successfully', { context: { userEmail: email } });
    } catch (err: any) {
      captureException(err, { context: { action: 'signin' } });
      logger.error('Sign in failed', { context: { error: err.message } });
    } finally {
      performance.endMeasurement('sign-in');
    }
  };
  
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      performance.startMeasurement('sign-up', { email });
      await signUp(email, password, { name });
      logger.info('User signed up successfully', { context: { userEmail: email } });
    } catch (err: any) {
      captureException(err, { context: { action: 'signup' } });
      logger.error('Sign up failed', { context: { error: err.message } });
    } finally {
      performance.endMeasurement('sign-up');
    }
  };
  
  const handleGoogleSignIn = async () => {
    try {
      performance.startMeasurement('google-sign-in');
      await signInWithProvider('google');
      logger.info('Google sign in initiated');
    } catch (err: any) {
      captureException(err, { context: { action: 'google-signin' } });
      logger.error('Google sign in failed', { context: { error: err.message } });
    } finally {
      performance.endMeasurement('google-sign-in');
    }
  };
  
  const handleGithubSignIn = async () => {
    try {
      performance.startMeasurement('github-sign-in');
      await signInWithProvider('github');
      logger.info('GitHub sign in initiated');
    } catch (err: any) {
      captureException(err, { context: { action: 'github-signin' } });
      logger.error('GitHub sign in failed', { context: { error: err.message } });
    } finally {
      performance.endMeasurement('github-sign-in');
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="h-16 flex items-center px-4 border-b">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-xl font-bold">CardShow</Link>
        </div>
      </header>
      
      <main className="flex-1 pt-16 pb-24">
        <div className="container mx-auto max-w-md px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Welcome to CardShow</h1>
            <p className="text-muted-foreground mt-2">
              Sign in or create an account to manage your digital cards
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border">
            <div className="space-y-4 mb-6">
              <Button 
                variant="outline" 
                className="w-full" 
                disabled={isLoading}
                onClick={handleGoogleSignIn}
              >
                <img src="https://authjs.dev/img/providers/google.svg" alt="Google" className="mr-2 h-4 w-4" />
                Continue with Google
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full" 
                disabled={isLoading}
                onClick={handleGithubSignIn}
              >
                <Github className="mr-2 h-4 w-4" />
                Continue with GitHub
              </Button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-gray-800 px-2 text-muted-foreground">
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
              
              {error && (
                <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4 text-sm">
                  {error}
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
                    <Label htmlFor="signin-password">Password</Label>
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
                    disabled={isLoading}
                  >
                    {isLoading ? (
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
                    disabled={isLoading}
                  >
                    {isLoading ? (
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
          </div>
        </div>
      </main>
    </div>
  );
};

export default Auth;

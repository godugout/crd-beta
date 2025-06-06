
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CrdButton } from '@/components/ui/crd-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Container } from '@/components/ui/container';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle authentication logic here
    console.log('Auth form submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--bg-primary)] via-[var(--bg-secondary)] to-[var(--bg-tertiary)] flex items-center justify-center p-6">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-[var(--brand-primary)]/20 to-[var(--brand-secondary)]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-gradient-to-br from-[var(--brand-accent)]/15 to-[var(--brand-warning)]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Enhanced Auth Card */}
        <div className="bento-card bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-xl relative overflow-hidden">
          {/* Sharp accent corner */}
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-secondary)] clip-corner-tr"></div>
          
          <div className="relative z-10 p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <Link to="/" className="inline-block mb-6">
                <span className="text-3xl font-black text-white tracking-tight">
                  Card<span className="text-brand-gradient">Show</span>
                </span>
              </Link>
              
              <h1 className="text-3xl font-black text-white mb-2 tracking-tight">
                {isLogin ? 'Welcome Back' : 'Join CardShow'}
              </h1>
              <p className="text-[var(--text-secondary)] font-medium">
                {isLogin 
                  ? 'Sign in to access your digital card collection'
                  : 'Create an account to start collecting digital cards'
                }
              </p>
            </div>

            {/* Social Login Buttons */}
            <div className="space-y-3 mb-6">
              <Button 
                variant="glass" 
                className="w-full py-3 font-semibold border-2 border-white/10 hover:border-white/20"
              >
                <img src="/google-icon.svg" alt="Google" className="w-5 h-5 mr-3" />
                Continue with Google
              </Button>
              <Button 
                variant="glass" 
                className="w-full py-3 font-semibold border-2 border-white/10 hover:border-white/20"
              >
                <img src="/apple-icon.svg" alt="Apple" className="w-5 h-5 mr-3" />
                Continue with Apple
              </Button>
            </div>

            <div className="relative my-6">
              <Separator className="bg-white/10" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-[var(--bg-secondary)] px-4 text-white/60 text-sm font-medium">
                  Or continue with email
                </span>
              </div>
            </div>

            {/* Auth Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="displayName" className="text-white font-semibold">
                    Display Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                    <Input
                      id="displayName"
                      type="text"
                      placeholder="Your display name"
                      value={formData.displayName}
                      onChange={(e) => handleInputChange('displayName', e.target.value)}
                      className="pl-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/60 focus:border-[var(--brand-primary)] backdrop-blur-xl"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white font-semibold">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="pl-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/60 focus:border-[var(--brand-primary)] backdrop-blur-xl"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white font-semibold">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="pl-12 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/60 focus:border-[var(--brand-primary)] backdrop-blur-xl"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-white font-semibold">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className="pl-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/60 focus:border-[var(--brand-primary)] backdrop-blur-xl"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              {isLogin && (
                <div className="flex justify-end">
                  <Link 
                    to="/forgot-password" 
                    className="text-[var(--brand-primary)] hover:text-[var(--brand-secondary)] text-sm font-medium transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
              )}

              <div className="relative">
                <CrdButton 
                  type="submit"
                  variant="spectrum" 
                  className="w-full py-3 font-bold text-lg btn-sharp shadow-[var(--shadow-brand)]"
                >
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </CrdButton>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--brand-accent)] clip-corner-tr opacity-90"></div>
              </div>
            </form>

            {/* Switch Auth Mode */}
            <div className="text-center mt-6">
              <p className="text-white/60">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="ml-2 text-[var(--brand-primary)] hover:text-[var(--brand-secondary)] font-semibold transition-colors"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>

            {/* Enhanced Features Preview */}
            {!isLogin && (
              <div className="mt-8 pt-6 border-t border-white/10">
                <h3 className="text-lg font-bold text-white mb-4 text-center">
                  Join thousands of collectors
                </h3>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <Sparkles className="w-6 h-6 text-[var(--brand-primary)] mx-auto mb-2" />
                    <p className="text-sm text-white/80 font-medium">Create Cards</p>
                  </div>
                  <div>
                    <User className="w-6 h-6 text-[var(--brand-accent)] mx-auto mb-2" />
                    <p className="text-sm text-white/80 font-medium">Build Collections</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Links */}
        <div className="text-center mt-6">
          <div className="flex flex-wrap justify-center gap-4 text-sm text-white/60">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/help" className="hover:text-white transition-colors">Help Center</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;

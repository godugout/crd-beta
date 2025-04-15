import React, { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Grid, Upload, Eye, Settings, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ui/theme-toggle';

interface PageLayoutProps {
  title?: string | React.ReactNode;
  description?: string;
  children: ReactNode;
  fullWidth?: boolean;
  hideBreadcrumbs?: boolean;
  canonicalPath?: string;
}

const PageLayout = ({ title, description, children, fullWidth = false, hideBreadcrumbs = true, canonicalPath }: PageLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  
  const routes = [
    { path: '/', icon: <Home className="h-5 w-5" />, label: 'Home' },
    { path: '/cards', icon: <Grid className="h-5 w-5" />, label: 'Gallery' },
    { path: '/card/create', icon: <Upload className="h-5 w-5" />, label: 'Create' },
    { path: '/immersive-viewer', icon: <Eye className="h-5 w-5" />, label: '3D Viewer' },
    { path: '/settings', icon: <Settings className="h-5 w-5" />, label: 'Settings' },
  ];
  
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 
              className="text-xl font-bold cursor-pointer"
              onClick={() => navigate('/')}
            >
              CardShow<span className="text-primary">CRD</span>
            </h1>
            
            <nav className="hidden md:flex items-center space-x-4">
              {routes.map((route) => (
                <Button
                  key={route.path}
                  variant={isActive(route.path) ? "secondary" : "ghost"}
                  size="sm"
                  className="gap-2"
                  onClick={() => navigate(route.path)}
                >
                  {route.icon}
                  <span>{route.label}</span>
                </Button>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            
            <Button 
              variant="ghost" 
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </header>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden p-4 border-b bg-background">
          <nav className="flex flex-col space-y-2">
            {routes.map((route) => (
              <Button
                key={route.path}
                variant={isActive(route.path) ? "secondary" : "ghost"}
                className="justify-start gap-3"
                onClick={() => {
                  navigate(route.path);
                  setIsMobileMenuOpen(false);
                }}
              >
                {route.icon}
                <span>{route.label}</span>
              </Button>
            ))}
          </nav>
        </div>
      )}
      
      {/* Page title and description */}
      {(title || description) && (
        <div className="bg-background pt-6 pb-3 border-b">
          <div className="container mx-auto px-4">
            {title && (
              <h1 className="text-2xl font-bold">
                {title}
              </h1>
            )}
            {description && (
              <p className="text-muted-foreground mt-1">
                {description}
              </p>
            )}
          </div>
        </div>
      )}
      
      {/* Main content */}
      <main className={`flex-1 bg-muted/30 ${fullWidth ? '' : 'container mx-auto px-4 py-6'}`}>
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-background border-t py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-muted-foreground">
                © 2025 CardShow Digital. All rights reserved.
              </p>
            </div>
            
            <div className="flex space-x-4">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Terms of Use
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PageLayout;

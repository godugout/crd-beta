
import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from '@/components/ui/container';
import { 
  Home, 
  Image, 
  Layers, 
  Users, 
  MessageCircle, 
  Eye 
} from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { cn } from '@/lib/utils';
import Breadcrumb from './Breadcrumb';

export interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  showNavigation?: boolean;
  fullWidth?: boolean;
  hideBreadcrumbs?: boolean;
  canonicalPath?: string;
  className?: string;
  headerClassName?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  title,
  description,
  showNavigation = true,
  fullWidth = false,
  hideBreadcrumbs = false,
  canonicalPath,
  className,
  headerClassName,
}) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className={cn("py-4 border-b", headerClassName)}>
        <Container className={fullWidth ? "max-w-full px-4" : undefined}>
          <div className="flex items-center justify-between">
            <div>
              <h1 
                className="text-2xl font-bold"
                dangerouslySetInnerHTML={{ __html: title }}
              />
              {description && (
                <p className="text-muted-foreground mt-1">{description}</p>
              )}
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
            </div>
          </div>
          
          {!hideBreadcrumbs && (
            <div className="mt-4">
              <Breadcrumb />
            </div>
          )}
        </Container>
      </header>
      
      {/* Main content */}
      <main className={cn("flex-1", className)}>
        {children}
      </main>
      
      {/* Navigation */}
      {showNavigation && (
        <nav className="py-2 border-t bg-background">
          <Container>
            <div className="flex justify-between items-center">
              <div className="flex gap-6">
                <Link to="/" className="flex flex-col items-center text-xs text-muted-foreground hover:text-foreground transition">
                  <Home size={20} />
                  <span className="mt-1">Home</span>
                </Link>
                <Link to="/cards" className="flex flex-col items-center text-xs text-muted-foreground hover:text-foreground transition">
                  <Image size={20} />
                  <span className="mt-1">Cards</span>
                </Link>
                <Link to="/collections" className="flex flex-col items-center text-xs text-muted-foreground hover:text-foreground transition">
                  <Layers size={20} />
                  <span className="mt-1">Collections</span>
                </Link>
                <Link to="/teams" className="flex flex-col items-center text-xs text-muted-foreground hover:text-foreground transition">
                  <Users size={20} />
                  <span className="mt-1">Teams</span>
                </Link>
                <Link to="/community" className="flex flex-col items-center text-xs text-muted-foreground hover:text-foreground transition">
                  <MessageCircle size={20} />
                  <span className="mt-1">Community</span>
                </Link>
              </div>
              <Link to="/immersive-viewer" className="flex items-center gap-2 text-sm text-primary hover:text-primary/90 transition">
                <Eye size={18} />
                <span>3D Viewer</span>
              </Link>
            </div>
          </Container>
        </nav>
      )}
    </div>
  );
};

export default PageLayout;

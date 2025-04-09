
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Card,
  CardContent,
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { cn } from '@/lib/utils';

interface NavigationItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
  description?: string;
}

interface ContentTypeNavigationProps {
  title?: string;
  items: NavigationItem[];
  className?: string;
  variant?: 'tabs' | 'pills' | 'buttons';
  size?: 'sm' | 'md' | 'lg';
  showDescriptions?: boolean;
}

const ContentTypeNavigation: React.FC<ContentTypeNavigationProps> = ({
  title,
  items,
  className,
  variant = 'tabs',
  size = 'md',
  showDescriptions = false,
}) => {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState<string>(() => {
    // Initialize with the current path if it matches one of the items
    const currentPath = location.pathname;
    const matchingItem = items.find(item => currentPath === item.path);
    return matchingItem ? matchingItem.path : items[0]?.path || '';
  });

  // Size classes
  const sizeClasses = {
    sm: 'text-xs py-1 px-2',
    md: 'text-sm py-1.5 px-3',
    lg: 'text-base py-2 px-4',
  };

  if (variant === 'tabs') {
    return (
      <div className={cn("w-full", className)}>
        {title && <h3 className="text-lg font-medium mb-2">{title}</h3>}
        <Tabs 
          defaultValue={activeItem} 
          className="w-full" 
          onValueChange={(value) => setActiveItem(value)}
        >
          <TabsList className="w-full h-auto flex">
            {items.map((item) => (
              <TabsTrigger
                key={item.path}
                value={item.path}
                className="flex-1"
                asChild
              >
                <Link to={item.path}>
                  <div className="flex items-center gap-2">
                    {item.icon && <span>{item.icon}</span>}
                    <span>{item.label}</span>
                  </div>
                </Link>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    );
  }

  if (variant === 'pills') {
    return (
      <div className={cn("w-full", className)}>
        {title && <h3 className="text-lg font-medium mb-2">{title}</h3>}
        <div className="flex flex-wrap gap-2">
          {items.map((item) => {
            const isActive = item.path === activeItem;
            return (
              <Link 
                key={item.path}
                to={item.path}
                onClick={() => setActiveItem(item.path)}
                className={cn(
                  "rounded-full border transition-colors relative overflow-hidden",
                  sizeClasses[size],
                  isActive 
                    ? "bg-primary text-primary-foreground border-primary" 
                    : "bg-background hover:bg-muted/50 border-muted"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="pill-active-background"
                    className="absolute inset-0 bg-primary z-0"
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  {item.icon && <span>{item.icon}</span>}
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  // Default button variant
  return (
    <div className={cn("w-full", className)}>
      {title && <h3 className="text-lg font-medium mb-2">{title}</h3>}
      <Card>
        <CardContent className="p-3">
          <div className="grid gap-2">
            {items.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link 
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center p-2 rounded-md transition-colors",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent/50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    {item.icon && (
                      <div className={cn(
                        "flex items-center justify-center h-8 w-8 rounded-md",
                        isActive ? "text-accent-foreground" : "text-muted-foreground"
                      )}>
                        {item.icon}
                      </div>
                    )}
                    <div>
                      <div className={cn(
                        "font-medium",
                        isActive ? "text-accent-foreground" : "text-foreground"
                      )}>
                        {item.label}
                      </div>
                      {showDescriptions && item.description && (
                        <div className="text-xs text-muted-foreground">
                          {item.description}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentTypeNavigation;

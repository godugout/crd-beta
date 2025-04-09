
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  NavigationMenuItem,
  NavigationMenuTrigger, 
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavigationItemProps {
  title: string;
  path: string;
  icon?: React.ElementType;
  description?: string;
  highlight?: boolean;
}

interface NavigationSectionProps {
  title: string;
  items: NavigationItemProps[];
  isActive?: boolean;
  layout?: 'grid' | 'list';
  columns?: number;
  showFeatured?: boolean;
  featuredItem?: NavigationItemProps & { bgGradient?: boolean };
}

const NavigationSection: React.FC<NavigationSectionProps> = ({ 
  title, 
  items, 
  isActive = false, 
  layout = 'grid',
  columns = 2,
  showFeatured = true,
  featuredItem
}) => {
  const featuredContent = featuredItem && showFeatured ? (
    <li className={columns === 2 ? "col-span-2" : ""}>
      <NavigationMenuLink asChild>
        <Link
          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
          to={featuredItem.path}
        >
          {featuredItem.icon && <featuredItem.icon className="h-6 w-6 mb-2" />}
          <div className="mb-2 mt-4 text-lg font-medium">{featuredItem.title}</div>
          {featuredItem.description && (
            <p className="text-sm leading-tight text-muted-foreground">
              {featuredItem.description}
            </p>
          )}
        </Link>
      </NavigationMenuLink>
    </li>
  ) : null;

  const gridCols = columns === 2 ? "md:grid-cols-2" : "";
  const listWidth = columns === 2 ? "md:w-[500px] lg:w-[600px]" : "md:w-[400px] lg:w-[500px]";
  
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger className={isActive ? 'bg-accent' : ''}>
        {title}
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        {layout === 'grid' ? (
          <ul className={`grid w-[400px] gap-3 p-4 ${listWidth} ${gridCols}`}>
            {featuredContent}
            {items.map((item) => (
              <NavigationItem key={item.path} item={item} />
            ))}
          </ul>
        ) : (
          <ul className={`grid gap-3 p-4 ${listWidth}`}>
            {featuredContent}
            {items.map((item) => (
              <NavigationItem key={item.path} item={item} />
            ))}
          </ul>
        )}
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
};

const NavigationItem: React.FC<{ item: NavigationItemProps }> = ({ item }) => {
  return (
    <li className="row-span-1">
      <NavigationMenuLink asChild>
        <Link
          to={item.path}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors",
            "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            item.highlight && "bg-[#EFB21E]/10 text-[#006341] font-medium"
          )}
        >
          <div className="text-sm font-medium leading-none flex items-center gap-2">
            {item.icon && <item.icon className="h-4 w-4" />} {item.title}
          </div>
          {item.description && (
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {item.description}
            </p>
          )}
        </Link>
      </NavigationMenuLink>
    </li>
  );
};

export default NavigationSection;

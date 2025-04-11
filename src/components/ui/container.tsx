
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  size?: 'default' | 'small' | 'large';
}

export const Container: React.FC<ContainerProps> = ({ children, className, size = 'default', ...props }) => {
  return (
    <div 
      className={cn(
        "mx-auto px-4 md:px-6",
        {
          'max-w-7xl': size === 'default',
          'max-w-5xl': size === 'small',
          'max-w-screen-2xl': size === 'large'
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

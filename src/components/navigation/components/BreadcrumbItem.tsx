
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BreadcrumbItem as UIBreadcrumbItem, BreadcrumbLink, BreadcrumbPage } from '@/components/ui/breadcrumb';
import { BreadcrumbItem as BreadcrumbItemType } from '@/hooks/useBreadcrumbs';

interface BreadcrumbItemProps {
  crumb: BreadcrumbItemType;
  isLast: boolean;
}

export const BreadcrumbItemComponent: React.FC<BreadcrumbItemProps> = ({ crumb, isLast }) => {
  return (
    <UIBreadcrumbItem>
      {isLast ? (
        <BreadcrumbPage className="flex items-center gap-1.5">
          {crumb.icon ? crumb.icon : null}
          <span style={crumb.color ? { color: crumb.color } : {}}>
            {crumb.label}
          </span>
        </BreadcrumbPage>
      ) : (
        <BreadcrumbLink 
          asChild
          className="flex items-center gap-1.5 transition-all hover:text-primary"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Link to={crumb.path} style={crumb.color ? { color: crumb.color } : {}}>
              {crumb.icon ? crumb.icon : crumb.label}
            </Link>
          </motion.div>
        </BreadcrumbLink>
      )}
    </UIBreadcrumbItem>
  );
};

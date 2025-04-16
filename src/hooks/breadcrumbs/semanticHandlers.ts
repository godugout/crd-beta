
import { BreadcrumbHandlerProps, BreadcrumbItem } from './types';

// Helper for semantic segments handling
export const handleSemanticSegments = ({
  index,
  pathSegments,
  segment,
  currentPath
}: BreadcrumbHandlerProps): BreadcrumbItem | null => {
  if (segment === 'memories' && index > 1) {
    return {
      id: `memories-${currentPath}`,
      path: currentPath,
      label: 'Memories'
    };
  }
  
  if (segment === 'new' && pathSegments[index-1] === 'memories') {
    return {
      id: `new-memory-${currentPath}`,
      path: currentPath,
      label: 'Create Memory'
    };
  }
  
  return null;
};

// Helper for ID segments handling
export const handleIdSegment = ({
  index,
  pathSegments,
  segment,
  currentPath
}: BreadcrumbHandlerProps): BreadcrumbItem | null => {
  if (segment.match(/^[0-9a-fA-F-]+$/)) {
    const prevSegment = index > 0 ? pathSegments[index-1] : '';
    
    // Determine entity type from previous segment
    let label = 'Details';
    if (prevSegment === 'cards') label = 'Card Details';
    else if (prevSegment === 'collections') label = 'Collection';
    else if (prevSegment === 'memories') label = 'Memory Details';
    else if (prevSegment === 'packs') label = 'Memory Pack';
    
    return {
      id: `details-${currentPath}`,
      path: currentPath,
      label: label
    };
  }
  return null;
};

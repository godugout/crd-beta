
import { BreadcrumbHandlerProps, BreadcrumbItem } from './types';

export type BreadcrumbHandler = (props: BreadcrumbHandlerProps) => BreadcrumbItem | null;

/**
 * Creates a handler chain that attempts each handler in sequence
 * until one returns a breadcrumb item
 */
export const createHandlerChain = (handlers: BreadcrumbHandler[]) => {
  return (props: BreadcrumbHandlerProps): BreadcrumbItem | null => {
    for (const handler of handlers) {
      const result = handler(props);
      if (result) {
        return result;
      }
    }
    return null;
  };
};

/**
 * Creates a condition wrapper around a handler
 */
export const createConditionalHandler = (
  condition: (props: BreadcrumbHandlerProps) => boolean,
  handler: (props: BreadcrumbHandlerProps) => BreadcrumbItem | null
): BreadcrumbHandler => {
  return (props: BreadcrumbHandlerProps) => {
    if (condition(props)) {
      return handler(props);
    }
    return null;
  };
};

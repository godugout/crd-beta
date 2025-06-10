
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useKeyboardShortcuts = (customNavigate?: any) => {
  const navigate = useNavigate();
  const navigationFunction = customNavigate || navigate;

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Only trigger if not in an input field
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Only trigger if no modifier keys are pressed (except for search)
      if (event.ctrlKey || event.metaKey || event.altKey) {
        return;
      }

      switch (event.key.toLowerCase()) {
        case 'c':
          event.preventDefault();
          navigationFunction('/cards/create');
          break;
        case 'g':
          event.preventDefault();
          navigationFunction('/gallery');
          break;
        case 'h':
          event.preventDefault();
          navigationFunction('/');
          break;
        case '/':
          event.preventDefault();
          // Focus search input if available
          const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
          if (searchInput) {
            searchInput.focus();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [navigationFunction]);

  // Return an empty object to maintain consistency
  return {};
};

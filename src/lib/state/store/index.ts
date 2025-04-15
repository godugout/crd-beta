
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { Card } from '@/lib/types';

interface GlobalState {
  // User state
  isAuthenticated: boolean;
  userId: string | null;
  
  // App state
  isLoading: boolean;
  theme: 'light' | 'dark';
  
  // Actions
  setAuthenticated: (isAuthenticated: boolean) => void;
  setUserId: (userId: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useStore = create<GlobalState>()(
  devtools(
    persist(
      (set) => ({
        // Initial state
        isAuthenticated: false,
        userId: null,
        isLoading: false,
        theme: 'light',

        // Actions
        setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
        setUserId: (userId) => set({ userId }),
        setLoading: (isLoading) => set({ isLoading }),
        setTheme: (theme) => set({ theme }),
      }),
      {
        name: 'cardshow-store',
      }
    )
  )
);

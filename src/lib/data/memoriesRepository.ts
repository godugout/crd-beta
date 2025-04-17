
import { OaklandMemoryData } from '@/lib/types';

// Mock memories repository implementation
export const memoriesRepository = {
  getMemories: async () => {
    return { data: [], error: null };
  },
  
  getMemoryById: async (id: string) => {
    const mockMemory: OaklandMemoryData = {
      title: 'Sample Memory',
      description: 'This is a sample memory',
      date: new Date().toISOString(),
      location: 'Oakland Coliseum',
      tags: ['baseball', 'oakland']
    };
    return { data: mockMemory, error: null };
  },
  
  createMemory: async (memoryData: Partial<OaklandMemoryData>) => {
    console.log('Creating memory:', memoryData);
    return { data: { ...memoryData, title: memoryData.title || 'Untitled Memory' }, error: null };
  },
  
  updateMemory: async (id: string, memoryData: Partial<OaklandMemoryData>) => {
    console.log(`Updating memory ${id}:`, memoryData);
    return { data: memoryData, error: null };
  },
  
  deleteMemory: async (id: string) => {
    console.log(`Deleting memory ${id}`);
    return { success: true, error: null };
  }
};

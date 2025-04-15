
import { serializeMetadata } from '@/lib/types';
import { CardDesignState, CardLayer } from '@/components/card-creation/types/cardTypes';

describe('Supabase Serialization', () => {
  test('serializeMetadata should convert complex objects to JSON-safe format', () => {
    // Create a sample design metadata
    const designMetadata = {
      cardStyle: {
        borderRadius: '10px',
        borderWidth: 2,
        borderColor: '#000',
        backgroundColor: '#fff'
      },
      textStyle: {
        fontFamily: 'Arial',
        fontSize: '16px',
        color: '#000'
      },
      oaklandMemory: {
        title: 'Game Day',
        description: 'My first baseball game',
        attendees: ['John', 'Jane']
      },
      layers: [
        {
          id: '123',
          type: 'text' as const,
          content: 'Hello World',
          position: { x: 10, y: 20, z: 1 },
          size: { width: 100, height: 50 },
          rotation: 0,
          opacity: 1,
          zIndex: 1
        }
      ],
      effects: ['holographic', 'refractor']
    };
    
    // Serialize the metadata
    const serialized = serializeMetadata(designMetadata);
    
    // Check that the result is JSON-safe
    expect(() => JSON.stringify(serialized)).not.toThrow();
    
    // Check that complex nested objects are preserved
    expect(serialized.cardStyle).toBeDefined();
    expect(serialized.textStyle).toBeDefined();
    expect(serialized.oaklandMemory).toBeDefined();
    expect(serialized.layers).toBeInstanceOf(Array);
    
    // Check that layer position properties are preserved
    const layer = serialized.layers[0];
    expect(layer.position.x).toBe(10);
    expect(layer.position.y).toBe(20);
    expect(layer.position.z).toBe(1);
  });
  
  test('serializeMetadata should handle undefined input', () => {
    const serialized = serializeMetadata(undefined);
    expect(serialized).toEqual({});
  });
});

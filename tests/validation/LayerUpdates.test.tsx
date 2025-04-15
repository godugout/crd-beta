
import { renderHook, act } from '@testing-library/react-hooks';
import { useLayers } from '@/components/card-creation/hooks/useLayers';
import { CardLayer } from '@/components/card-creation/types/cardTypes';

describe('Layer Updates Module', () => {
  test('useLayers should initialize with empty layers', () => {
    const { result } = renderHook(() => useLayers());
    
    expect(result.current.layers).toEqual([]);
    expect(result.current.activeLayerId).toBeNull();
  });
  
  test('addLayer should create a new layer with correct properties', () => {
    const { result } = renderHook(() => useLayers());
    
    act(() => {
      result.current.addLayer('text');
    });
    
    expect(result.current.layers.length).toBe(1);
    
    const layer = result.current.layers[0];
    expect(layer.type).toBe('text');
    expect(layer.position).toHaveProperty('x');
    expect(layer.position).toHaveProperty('y');
    expect(layer.position).toHaveProperty('z');
    expect(typeof layer.position.z).toBe('number');
  });
  
  test('updateLayer should modify layer properties', () => {
    const { result } = renderHook(() => useLayers());
    
    // Add a layer
    let layerId: string;
    act(() => {
      layerId = result.current.addLayer('image');
    });
    
    // Update the layer
    act(() => {
      result.current.updateLayer(layerId, { 
        position: { x: 100, y: 200, z: 3 },
        opacity: 0.5
      });
    });
    
    // Get the updated layer
    const updatedLayer = result.current.layers.find(l => l.id === layerId);
    
    expect(updatedLayer).toBeDefined();
    expect(updatedLayer?.position.x).toBe(100);
    expect(updatedLayer?.position.y).toBe(200);
    expect(updatedLayer?.position.z).toBe(3);
    expect(updatedLayer?.opacity).toBe(0.5);
  });
  
  test('setActiveLayer should update the active layer ID', () => {
    const { result } = renderHook(() => useLayers());
    
    // Add two layers
    let layer1Id: string;
    let layer2Id: string;
    
    act(() => {
      layer1Id = result.current.addLayer('text');
      layer2Id = result.current.addLayer('image');
    });
    
    // Initial active layer should be the last added
    expect(result.current.activeLayerId).toBe(layer2Id);
    
    // Set the first layer as active
    act(() => {
      result.current.setActiveLayer(layer1Id);
    });
    
    expect(result.current.activeLayerId).toBe(layer1Id);
  });
});

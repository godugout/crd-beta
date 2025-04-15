
declare module 'three/examples/jsm/controls/OrbitControls' {
  import { Camera, EventDispatcher, Object3D } from 'three';
  
  export class OrbitControls extends EventDispatcher {
    constructor(camera: Camera, domElement?: HTMLElement);
    
    enabled: boolean;
    target: Object3D;
    
    update(): boolean;
    addEventListener(type: string, listener: (event: any) => void): void;
    removeEventListener(type: string, listener: (event: any) => void): void;
    dispatchEvent(event: { type: string; target: any }): void;
    
    enableDamping: boolean;
    dampingFactor: number;
    
    enableZoom: boolean;
    zoomSpeed: number;
    minDistance: number;
    maxDistance: number;
    
    enableRotate: boolean;
    rotateSpeed: number;
    minPolarAngle: number;
    maxPolarAngle: number;
    
    enablePan: boolean;
    panSpeed: number;
    
    autoRotate: boolean;
    autoRotateSpeed: number;
    
    dispose(): void;
  }
}

declare module 'three/examples/jsm/loaders/RGBELoader' {
  import { DataTexture, LoadingManager, TextureDataType } from 'three';
  
  export class RGBELoader {
    constructor(manager?: LoadingManager);
    
    type: TextureDataType;
    
    load(
      url: string,
      onLoad?: (texture: DataTexture) => void,
      onProgress?: (event: ProgressEvent) => void,
      onError?: (event: ErrorEvent) => void
    ): DataTexture;
    
    setDataType(type: TextureDataType): RGBELoader;
  }
}

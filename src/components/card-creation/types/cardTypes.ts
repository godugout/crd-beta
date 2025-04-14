
export interface CardDesignState {
  title: string;
  description: string;
  tags: string[];
  borderColor: string;
  backgroundColor: string;
  borderRadius: string;
  imageUrl: string | null;
  player?: string;
  team?: string;
  year?: string;
}

export interface CardLayer {
  id: string;
  type: 'image' | 'text' | 'shape';
  name?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  content?: string;    // For text layers
  imageUrl?: string;   // For image layers
  color?: string;      // For shape layers
  shapeType?: 'rect' | 'circle' | 'triangle'; // For shape layers
  fontSize?: number;   // For text layers
  fontFamily?: string; // For text layers
  fontWeight?: string; // For text layers
  textAlign?: 'left' | 'center' | 'right'; // For text layers
  visible: boolean;    // Whether layer is visible
  locked: boolean;     // Whether layer can be edited
  
  // Adding the missing properties that caused the errors
  position?: {
    x: number;
    y: number;
    z: number;
  };
  size?: {
    width: number | string;
    height: number | string;
  };
  effectIds?: string[];
}


import React from 'react';
import EditorCanvas from '../EditorCanvas';
import EditorToolbar from '../EditorToolbar';
import ImageRotateButton from './ImageRotateButton';
import { CropBoxProps } from '../CropBox';
import { ImageData } from '../hooks/useCropState';

interface EditorContentProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  editorImgRef: React.RefObject<HTMLImageElement>;
  cropBoxes: CropBoxProps[];
  setCropBoxes: React.Dispatch<React.SetStateAction<CropBoxProps[]>>;
  selectedCropIndex: number;
  setSelectedCropIndex: (index: number) => void;
  imageData: ImageData;
  onRotateImage: () => void;
  onMaximizeCrop: () => void;
  onAddCropBox: () => void;
  onRemoveCropBox: () => void;
  onRotateClockwise: () => void;
  onRotateCounterClockwise: () => void;
  editorImage?: string | null;
}

const EditorContent: React.FC<EditorContentProps> = ({
  canvasRef,
  editorImgRef,
  cropBoxes,
  setCropBoxes,
  selectedCropIndex,
  setSelectedCropIndex,
  imageData,
  onRotateImage,
  onMaximizeCrop,
  onAddCropBox,
  onRemoveCropBox,
  onRotateClockwise,
  onRotateCounterClockwise,
  editorImage
}) => {
  return (
    <div className="relative border rounded-lg overflow-hidden bg-gray-100 h-full">
      {/* Hidden image for reference */}
      <img 
        ref={editorImgRef}
        src={editorImage || ''} 
        alt="Editor reference" 
        className="hidden"
        onLoad={() => {
          // Force canvas redraw when image loads
          if (canvasRef.current && editorImgRef.current) {
            const canvas = canvasRef.current;
            canvas.width = 600;
            canvas.height = 600;
          }
        }}
      />
      
      <EditorCanvas
        canvasRef={canvasRef}
        cropBoxes={cropBoxes}
        setCropBoxes={setCropBoxes}
        selectedCropIndex={selectedCropIndex}
        setSelectedCropIndex={setSelectedCropIndex}
        imageData={imageData}
        editorImgRef={editorImgRef}
      />
      
      <ImageRotateButton onRotate={onRotateImage} />
      
      <EditorToolbar 
        onMaximizeCrop={onMaximizeCrop}
        onAddCropBox={onAddCropBox}
        onRemoveCropBox={onRemoveCropBox}
        onRotateClockwise={onRotateClockwise}
        onRotateCounterClockwise={onRotateCounterClockwise}
      />
    </div>
  );
};

export default EditorContent;

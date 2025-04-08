
import React from 'react';
import ImageEditorDialog from './editor/ImageEditorDialog';
import { MemorabiliaType } from './cardDetection';

interface ImageEditorProps {
  showEditor: boolean;
  setShowEditor: (show: boolean) => void;
  editorImage: string | null;
  currentFile: File | null;
  onCropComplete: (file: File, url: string, memorabiliaType?: MemorabiliaType) => void;
  batchProcessingMode?: boolean;
  onBatchProcessComplete?: (files: File[], urls: string[], types?: MemorabiliaType[]) => void;
  enabledMemorabiliaTypes?: MemorabiliaType[];
  autoEnhance?: boolean;
}

const ImageEditor: React.FC<ImageEditorProps> = (props) => {
  return <ImageEditorDialog {...props} />;
};

export default ImageEditor;

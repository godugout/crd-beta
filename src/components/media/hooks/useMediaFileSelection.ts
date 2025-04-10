
import { useState, useRef, useCallback } from 'react';

export function useMediaFileSelection(maxFiles = 10) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);
    const allowedFiles = newFiles.slice(0, maxFiles - selectedFiles.length);
    
    setSelectedFiles(prev => [...prev, ...allowedFiles]);
    
    allowedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => setPreviews(prev => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
  }, [selectedFiles.length, maxFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => { 
    e.preventDefault();
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!e.dataTransfer.files) return;
    
    const newFiles = Array.from(e.dataTransfer.files);
    const allowedFiles = newFiles.slice(0, maxFiles - selectedFiles.length);
    
    setSelectedFiles(prev => [...prev, ...allowedFiles]);
    
    allowedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => setPreviews(prev => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
  }, [selectedFiles.length, maxFiles]);

  const handleRemoveFile = useCallback((index: number) => {
    setSelectedFiles(prev => {
      const updatedFiles = [...prev]; 
      updatedFiles.splice(index, 1); 
      return updatedFiles;
    });
    
    setPreviews(prev => {
      const updatedPreviews = [...prev]; 
      updatedPreviews.splice(index, 1); 
      return updatedPreviews;
    });
  }, []);

  const clearFiles = useCallback(() => {
    setSelectedFiles([]);
    setPreviews([]);
    if (fileRef.current) {
      fileRef.current.value = '';
    }
  }, []);

  return {
    selectedFiles,
    previews,
    fileRef,
    handleFileChange,
    handleDragOver,
    handleDrop,
    handleRemoveFile,
    clearFiles
  };
}

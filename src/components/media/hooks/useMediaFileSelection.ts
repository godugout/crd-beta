
import { useState, useRef } from 'react';

export const useMediaFileSelection = (maxFiles = 10) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);
    const allowedFiles = newFiles.slice(0, maxFiles - selectedFiles.length);
    
    setSelectedFiles(prev => [...prev, ...allowedFiles]);
    
    allowedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => setPreviews(prev => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const handleDragOver = (e: React.DragEvent) => { 
    e.preventDefault();
  };
  
  const handleDrop = (e: React.DragEvent) => {
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
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => {
      const newFiles = [...prev];
      newFiles.splice(index, 1);
      return newFiles;
    });
    setPreviews(prev => {
      const newPreviews = [...prev];
      newPreviews.splice(index, 1);
      return newPreviews;
    });
  };

  const clearFiles = () => {
    setSelectedFiles([]);
    setPreviews([]);
    if (fileRef.current) {
      fileRef.current.value = '';
    }
  };

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
};

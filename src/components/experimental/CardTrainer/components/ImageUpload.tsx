
import React from 'react';
import { ImageUploadProps } from '../types';

const ImageUpload: React.FC<ImageUploadProps> = ({ onSelectImage }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          const img = new Image();
          img.onload = () => onSelectImage(img);
          img.src = event.target.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-4 border-2 border-dashed border-gray-300 rounded-md text-center">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        id="image-upload"
      />
      <label htmlFor="image-upload" className="cursor-pointer">
        <div className="flex flex-col items-center justify-center p-6">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            ></path>
          </svg>
          <p className="mt-2 text-sm text-gray-600">Click to upload an image</p>
          <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
        </div>
      </label>
    </div>
  );
};

export default ImageUpload;


import React from 'react';

interface CardImageProps {
  src: string;
  alt: string;
  onError: (e: React.SyntheticEvent<HTMLImageElement>) => void;
}

const CardImage: React.FC<CardImageProps> = ({ src, alt, onError }) => {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div className="relative w-full h-full max-h-[70vh] flex items-center justify-center">
        <img
          src={src}
          alt={alt}
          className="max-w-full max-h-full object-contain"
          onError={onError}
        />
      </div>
    </div>
  );
};

export default CardImage;


import React from 'react';

interface CardEditorHeaderProps {
  title: string;
  subtitle?: string;
}

const CardEditorHeader: React.FC<CardEditorHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="py-4">
      <h1 className="text-2xl md:text-3xl font-bold text-cardshow-dark">{title}</h1>
      {subtitle && (
        <p className="text-cardshow-slate mt-1">{subtitle}</p>
      )}
    </div>
  );
};

export default CardEditorHeader;

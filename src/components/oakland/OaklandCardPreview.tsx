
import React from 'react';
import { Card } from '@/components/ui/card';
import { OaklandCardTemplate } from '@/lib/data/oaklandCardTemplates';

interface OaklandCardPreviewProps {
  template: OaklandCardTemplate;
  title: string;
  subtitle: string;
  className?: string;
}

const OaklandCardPreview: React.FC<OaklandCardPreviewProps> = ({
  template,
  title,
  subtitle,
  className = ''
}) => {
  return (
    <Card className={`aspect-[2.5/3.5] relative overflow-hidden bg-gradient-to-br from-[#003831] to-[#2F5233] border-2 border-[#EFB21E] shadow-2xl ${className}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="w-full h-full bg-repeat"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23EFB21E' fill-opacity='0.3'%3E%3Cpath d='M20 20c0-11.046-8.954-20-20-20v20h20zM0 20v20h20c0-11.046-8.954-20-20-20z'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* Card Content */}
      <div className="relative h-full p-4 flex flex-col justify-between text-white">
        {/* Header */}
        <div className="text-center">
          <div className="text-xs font-bold text-[#EFB21E] mb-1 tracking-wider uppercase">
            Oakland Athletics
          </div>
          <div className="w-12 h-0.5 bg-[#EFB21E] mx-auto mb-2"></div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col justify-center text-center">
          <h2 className="text-lg font-bold text-[#EFB21E] mb-2 leading-tight">
            {title}
          </h2>
          <p className="text-sm text-white/90 leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Footer */}
        <div className="text-center">
          <div className="w-12 h-0.5 bg-[#EFB21E] mx-auto mb-2"></div>
          <div className="text-xs text-[#EFB21E] tracking-wider uppercase">
            Est. 1901
          </div>
        </div>

        {/* Template-specific overlay */}
        {template.category === 'protest' && (
          <div className="absolute top-0 right-0 w-16 h-16 bg-red-600 opacity-20 rounded-bl-full"></div>
        )}
        
        {template.category === 'celebration' && (
          <div className="absolute top-2 right-2 text-[#EFB21E] opacity-60">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
        )}
      </div>
    </Card>
  );
};

export default OaklandCardPreview;

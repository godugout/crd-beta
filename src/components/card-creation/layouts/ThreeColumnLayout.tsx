
import React from 'react';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Template, Layers, Image } from 'lucide-react';

interface ThreeColumnLayoutProps {
  leftPanel: React.ReactNode;
  mainContent: React.ReactNode;
  rightPanel: React.ReactNode;
}

const ThreeColumnLayout: React.FC<ThreeColumnLayoutProps> = ({
  leftPanel,
  mainContent,
  rightPanel
}) => {
  return (
    <div className="grid grid-cols-12 gap-4 h-[calc(100vh-4rem)] p-4">
      {/* Left Panel - Templates & Elements */}
      <div className="col-span-3 overflow-y-auto">
        <Card className="h-full p-4">
          <div className="flex items-center gap-2 mb-4">
            <Template className="h-5 w-5" />
            <h3 className="font-semibold">Templates & Elements</h3>
          </div>
          {leftPanel}
        </Card>
      </div>

      {/* Main Content - Preview & Card Info */}
      <div className="col-span-6">
        <Card className="h-full p-4">
          <div className="flex items-center gap-2 mb-4">
            <Image className="h-5 w-5" />
            <h3 className="font-semibold">Card Preview</h3>
          </div>
          {mainContent}
        </Card>
      </div>

      {/* Right Panel - Layers & Tools */}
      <div className="col-span-3 overflow-y-auto">
        <Card className="h-full p-4">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="h-5 w-5" />
            <h3 className="font-semibold">Layers & Tools</h3>
          </div>
          {rightPanel}
        </Card>
      </div>
    </div>
  );
};

export default ThreeColumnLayout;

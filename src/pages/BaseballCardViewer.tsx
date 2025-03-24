
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import BaseballCardRenderer from '@/components/baseball/BaseballCardRenderer';
import { Button } from '@/components/ui/button';
import { ChevronLeft, PanelLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger 
} from '@/components/ui/collapsible';
import { 
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle
} from '@/components/ui/resizable';
import BaseballCardSidebar from '@/components/baseball/BaseballCardSidebar';

const BaseballCardViewer = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Navbar />
      
      <div className="absolute top-16 left-4 z-50 mt-2">
        <Button asChild variant="ghost" className="text-white hover:bg-white/10">
          <Link to="/gallery" className="flex items-center">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Return to Gallery
          </Link>
        </Button>
      </div>
      
      <main className="flex-1 pt-16">
        <ResizablePanelGroup direction="horizontal" className="min-h-[calc(100vh-4rem)]">
          <Collapsible open={isOpen} onOpenChange={setIsOpen} className="h-full">
            <ResizablePanel 
              defaultSize={20} 
              minSize={0}
              maxSize={30}
              className="bg-gray-800 border-r border-gray-700 z-40"
            >
              <CollapsibleContent className="h-full z-30">
                <BaseballCardSidebar />
              </CollapsibleContent>
            </ResizablePanel>

            <ResizableHandle withHandle className="bg-gray-700 z-30" />
          
            <ResizablePanel defaultSize={80} className="relative">
              <div className="relative h-full">
                <CollapsibleTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-4 left-4 z-50 bg-gray-800/50 hover:bg-gray-700/50 text-white"
                  >
                    <PanelLeft className="h-4 w-4" />
                  </Button>
                </CollapsibleTrigger>
                
                <BaseballCardRenderer />
              </div>
            </ResizablePanel>
          </Collapsible>
        </ResizablePanelGroup>
      </main>
    </div>
  );
};

export default BaseballCardViewer;


import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, RefreshCw, Wand2 } from 'lucide-react';
import { toast } from 'sonner';
import { RandomDesignGenerator, type GeneratedDesign } from '@/lib/services/randomDesignGenerator';
import { OaklandTemplate } from '@/lib/types/oaklandTemplates';

interface LuckyDesignSectionProps {
  onApplyDesign: (design: GeneratedDesign) => void;
  isGenerating?: boolean;
}

const LuckyDesignSection: React.FC<LuckyDesignSectionProps> = ({
  onApplyDesign,
  isGenerating = false
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastDesign, setLastDesign] = useState<GeneratedDesign | null>(null);

  const generateRandomDesign = async () => {
    setIsLoading(true);
    
    try {
      // Add a small delay for dramatic effect
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const generator = new RandomDesignGenerator();
      const design = generator.generateRandomDesign();
      
      setLastDesign(design);
      onApplyDesign(design);
      
      toast.success(
        <div>
          <div className="font-semibold">✨ Lucky Design Applied!</div>
          <div className="text-sm text-gray-600">{design.metadata.inspiration}</div>
        </div>
      );
    } catch (error) {
      console.error('Error generating random design:', error);
      toast.error('Failed to generate random design. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const regenerateDesign = async () => {
    if (lastDesign) {
      setIsLoading(true);
      
      try {
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const generator = new RandomDesignGenerator();
        const newDesign = generator.generateRandomDesign();
        
        setLastDesign(newDesign);
        onApplyDesign(newDesign);
        
        toast.success('🎲 New random design generated!');
      } catch (error) {
        console.error('Error regenerating design:', error);
        toast.error('Failed to regenerate design. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="space-y-4 p-4 bg-gradient-to-br from-[#EFB21E]/10 to-[#EFB21E]/5 rounded-lg border border-[#EFB21E]/20">
      {/* Main Lucky Button */}
      <Button
        onClick={generateRandomDesign}
        disabled={isLoading || isGenerating}
        className="w-full bg-gradient-to-r from-[#EFB21E] to-yellow-400 hover:from-yellow-400 hover:to-[#EFB21E] text-[#0f4c3a] font-bold shadow-lg hover:shadow-xl transition-all duration-200 h-12"
      >
        {isLoading ? (
          <>
            <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
            Generating Magic...
          </>
        ) : (
          <>
            <Wand2 className="h-5 w-5 mr-2" />
            I'm Feeling Lucky!
          </>
        )}
      </Button>

      {/* Description */}
      <div className="text-center text-xs text-gray-400 leading-relaxed">
        Get a unique Oakland A's card design with random colors, effects, and decorative elements
      </div>

      {/* Regenerate Button (shows after first generation) */}
      {lastDesign && (
        <Button
          onClick={regenerateDesign}
          disabled={isLoading}
          variant="outline"
          size="sm"
          className="w-full border-[#EFB21E]/30 text-[#EFB21E] hover:bg-[#EFB21E]/10 transition-all duration-200"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Generate Another
        </Button>
      )}

      {/* Last Design Info */}
      {lastDesign && (
        <div className="text-xs text-gray-500 bg-gray-800/30 rounded p-2 border-l-2 border-[#EFB21E]/50">
          <div className="font-semibold text-[#EFB21E]">Latest Creation:</div>
          <div className="truncate">{lastDesign.template.name}</div>
          <div className="text-gray-400 mt-1">{lastDesign.metadata.inspiration}</div>
        </div>
      )}
    </div>
  );
};

export default LuckyDesignSection;

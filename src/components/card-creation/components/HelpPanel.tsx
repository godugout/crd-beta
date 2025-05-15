
import React from 'react';
import { X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface HelpPanelProps {
  stepKey: string;
  onClose: () => void;
}

const HelpPanel: React.FC<HelpPanelProps> = ({ stepKey, onClose }) => {
  const getHelpContent = () => {
    switch (stepKey) {
      case 'template':
        return {
          title: 'Template Selection',
          content: (
            <>
              <p className="mb-2">Choose a template that best fits your card style.</p>
              <ul className="list-disc pl-5 mb-2 space-y-1">
                <li>Browse templates by category</li>
                <li>Preview how your card will look</li>
                <li>Select official or community templates</li>
              </ul>
              <p className="text-sm text-muted-foreground">Templates provide a great starting point for your card design.</p>
            </>
          )
        };
      case 'upload':
        return {
          title: 'Image Upload',
          content: (
            <>
              <p className="mb-2">Upload the main image for your card.</p>
              <ul className="list-disc pl-5 mb-2 space-y-1">
                <li>Click the upload area or drag and drop</li>
                <li>Use high-resolution images for best results</li>
                <li>JPG, PNG, and WEBP formats are supported</li>
              </ul>
              <p className="text-sm text-muted-foreground">For best results, use images with clear subjects and good lighting.</p>
            </>
          )
        };
      case 'design':
        return {
          title: 'Design Customization',
          content: (
            <>
              <p className="mb-2">Customize the visual style of your card.</p>
              <ul className="list-disc pl-5 mb-2 space-y-1">
                <li>Change border styles and colors</li>
                <li>Adjust background colors</li>
                <li>Add frames and decorative elements</li>
                <li>Customize card dimensions and shape</li>
              </ul>
              <p className="text-sm text-muted-foreground">Try different combinations to create a unique look!</p>
            </>
          )
        };
      case 'effects':
        return {
          title: 'Card Effects',
          content: (
            <>
              <p className="mb-2">Add special effects to make your card stand out.</p>
              <ul className="list-disc pl-5 mb-2 space-y-1">
                <li>Apply holographic, prismatic, or foil effects</li>
                <li>Add gloss, matte, or refractor finishes</li>
                <li>Customize effect intensity</li>
                <li>Combine multiple effects for unique looks</li>
              </ul>
              <p className="text-sm text-muted-foreground">Effects can be applied to the whole card or specific areas.</p>
            </>
          )
        };
      case 'text':
        return {
          title: 'Text and Details',
          content: (
            <>
              <p className="mb-2">Add textual information to your card.</p>
              <ul className="list-disc pl-5 mb-2 space-y-1">
                <li>Add title, player name, team, and year</li>
                <li>Include stats and biographical information</li>
                <li>Add descriptive text and custom fields</li>
                <li>Choose fonts, sizes, and styling</li>
              </ul>
              <p className="text-sm text-muted-foreground">Make sure text is readable against your card's background.</p>
            </>
          )
        };
      case 'finalize':
        return {
          title: 'Finalize',
          content: (
            <>
              <p className="mb-2">Review and complete your card creation.</p>
              <ul className="list-disc pl-5 mb-2 space-y-1">
                <li>Preview your card before saving</li>
                <li>Add tags for better organization</li>
                <li>Set sharing and visibility options</li>
                <li>Export in different formats (PNG, JPG, PDF)</li>
              </ul>
              <p className="text-sm text-muted-foreground">Once finalized, your card will be added to your collection.</p>
            </>
          )
        };
      default:
        return {
          title: 'Help',
          content: <p>Select a step to see specific help information.</p>
        };
    }
  };

  const helpContent = getHelpContent();

  return (
    <Card className="mb-6 bg-muted/40 border-dashed">
      <CardHeader className="pb-2 pt-4 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium">{helpContent.title} Help</CardTitle>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="text-sm">
        {helpContent.content}
      </CardContent>
    </Card>
  );
};

export default HelpPanel;

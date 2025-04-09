
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Share2, Eye, EyeOff } from 'lucide-react';
import { CardStyle } from './CardDesignCustomization';
import { TextStyle } from './CardTextCustomization';
import { FabricSwatch } from './types';
import { toast } from 'sonner';

interface CardPreviewProps {
  imageUrl: string;
  title: string;
  description: string;
  fabricSwatches?: FabricSwatch[];
  cardStyle: CardStyle;
  textStyle: TextStyle;
}

const CardPreview: React.FC<CardPreviewProps> = ({
  imageUrl,
  title,
  description,
  fabricSwatches = [],
  cardStyle,
  textStyle
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleDownload = async () => {
    try {
      // Create a canvas to render the card
      const canvas = document.createElement('canvas');
      canvas.width = 600; // Standard card width
      canvas.height = 840; // Standard card height (aspect ratio of 2.5:3.5)
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Could not create canvas context');
      }
      
      // Draw background color
      ctx.fillStyle = cardStyle.backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Load and draw image
      if (imageUrl) {
        const img = new Image();
        img.crossOrigin = 'anonymous'; // To prevent CORS issues when saving
        
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = imageUrl;
        });
        
        // Apply image adjustments
        ctx.filter = `brightness(${cardStyle.brightness}%) contrast(${cardStyle.contrast}%) saturate(${cardStyle.saturation}%)`;
        
        // Draw image to fill the card with proper dimensions
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Reset filters
        ctx.filter = 'none';
      }
      
      // Draw border if specified
      if (cardStyle.borderWidth > 0) {
        ctx.strokeStyle = cardStyle.borderColor;
        ctx.lineWidth = cardStyle.borderWidth * 2; // Double for more visible effect
        
        // Create rounded corners if specified
        const radius = parseInt(cardStyle.borderRadius) || 0;
        
        if (radius > 0) {
          // Draw rounded rectangle border
          ctx.beginPath();
          ctx.moveTo(ctx.lineWidth / 2, radius + ctx.lineWidth / 2);
          ctx.lineTo(ctx.lineWidth / 2, canvas.height - radius - ctx.lineWidth / 2);
          ctx.arcTo(ctx.lineWidth / 2, canvas.height - ctx.lineWidth / 2, radius + ctx.lineWidth / 2, canvas.height - ctx.lineWidth / 2, radius);
          ctx.lineTo(canvas.width - radius - ctx.lineWidth / 2, canvas.height - ctx.lineWidth / 2);
          ctx.arcTo(canvas.width - ctx.lineWidth / 2, canvas.height - ctx.lineWidth / 2, canvas.width - ctx.lineWidth / 2, canvas.height - radius - ctx.lineWidth / 2, radius);
          ctx.lineTo(canvas.width - ctx.lineWidth / 2, radius + ctx.lineWidth / 2);
          ctx.arcTo(canvas.width - ctx.lineWidth / 2, ctx.lineWidth / 2, canvas.width - radius - ctx.lineWidth / 2, ctx.lineWidth / 2, radius);
          ctx.lineTo(radius + ctx.lineWidth / 2, ctx.lineWidth / 2);
          ctx.arcTo(ctx.lineWidth / 2, ctx.lineWidth / 2, ctx.lineWidth / 2, radius + ctx.lineWidth / 2, radius);
          ctx.stroke();
        } else {
          // Draw standard rectangle border
          ctx.strokeRect(
            ctx.lineWidth / 2, 
            ctx.lineWidth / 2, 
            canvas.width - ctx.lineWidth, 
            canvas.height - ctx.lineWidth
          );
        }
      }
      
      // Add overlay for text if enabled
      if (textStyle.showOverlay) {
        const overlayHeight = textStyle.overlayPosition === 'full' 
          ? canvas.height 
          : canvas.height / 3;
        
        const overlayY = textStyle.overlayPosition === 'top' 
          ? 0 
          : textStyle.overlayPosition === 'bottom' 
            ? canvas.height - overlayHeight 
            : canvas.height / 3; // Middle position
        
        // Draw semi-transparent overlay
        ctx.fillStyle = `${textStyle.overlayColor}${Math.round(textStyle.overlayOpacity / 100 * 255).toString(16).padStart(2, '0')}`;
        ctx.fillRect(0, overlayY, canvas.width, overlayHeight);
      }
      
      // Add title text
      if (title) {
        ctx.font = `${textStyle.titleWeight} ${textStyle.titleSize}px ${textStyle.titleFont}`;
        ctx.fillStyle = textStyle.titleColor;
        ctx.textAlign = textStyle.titleAlignment as CanvasTextAlign;
        
        const textX = textStyle.titleAlignment === 'left' 
          ? 20 
          : textStyle.titleAlignment === 'right' 
            ? canvas.width - 20 
            : canvas.width / 2;
            
        const textY = textStyle.overlayPosition === 'top' 
          ? 30 + textStyle.titleSize 
          : canvas.height - 80;
          
        ctx.fillText(title, textX, textY);
      }
      
      // Add description text if available
      if (description) {
        ctx.font = `normal ${textStyle.descriptionSize}px ${textStyle.descriptionFont}`;
        ctx.fillStyle = textStyle.descriptionColor;
        
        const descY = textStyle.overlayPosition === 'top' 
          ? 40 + textStyle.titleSize + textStyle.descriptionSize 
          : canvas.height - 40;
          
        // Simple word wrap for description (basic implementation)
        const words = description.split(' ');
        let line = '';
        let descLines = [];
        const maxWidth = canvas.width - 40;
        
        for (let i = 0; i < words.length; i++) {
          let testLine = line + words[i] + ' ';
          let metrics = ctx.measureText(testLine);
          
          if (metrics.width > maxWidth && i > 0) {
            descLines.push(line);
            line = words[i] + ' ';
          } else {
            line = testLine;
          }
        }
        
        descLines.push(line);
        
        // Draw description lines (limited to 2 lines for simplicity)
        for (let i = 0; i < Math.min(descLines.length, 2); i++) {
          ctx.fillText(
            descLines[i], 
            20, 
            descY + (i * (textStyle.descriptionSize + 5))
          );
        }
      }
      
      // Apply special effects based on card style
      if (cardStyle.effect !== 'classic') {
        // Apply filter effects based on the selected effect
        switch (cardStyle.effect) {
          case 'refractor':
            // Simple rainbow gradient overlay
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, 'rgba(255, 0, 0, 0.1)');
            gradient.addColorStop(0.33, 'rgba(0, 255, 0, 0.1)');
            gradient.addColorStop(0.66, 'rgba(0, 0, 255, 0.1)');
            gradient.addColorStop(1, 'rgba(255, 0, 0, 0.1)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            break;
            
          case 'prism':
            // Add diagonal light streaks
            ctx.globalCompositeOperation = 'lighter';
            for (let i = 0; i < 5; i++) {
              ctx.strokeStyle = `hsla(${i * 60}, 100%, 70%, 0.3)`;
              ctx.lineWidth = 15;
              ctx.beginPath();
              ctx.moveTo(0, i * canvas.height / 4);
              ctx.lineTo(canvas.width, i * canvas.height / 4 + canvas.height / 2);
              ctx.stroke();
            }
            ctx.globalCompositeOperation = 'source-over';
            break;
            
          case 'chrome':
            // Metallic effect
            ctx.globalCompositeOperation = 'overlay';
            const chromeGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            chromeGradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
            chromeGradient.addColorStop(0.5, 'rgba(120, 120, 120, 0.1)');
            chromeGradient.addColorStop(1, 'rgba(255, 255, 255, 0.3)');
            ctx.fillStyle = chromeGradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.globalCompositeOperation = 'source-over';
            break;
            
          case 'gold':
            // Gold foil effect
            ctx.globalCompositeOperation = 'overlay';
            const goldGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            goldGradient.addColorStop(0, 'rgba(255, 215, 0, 0.4)');
            goldGradient.addColorStop(0.5, 'rgba(255, 230, 128, 0.5)');
            goldGradient.addColorStop(1, 'rgba(255, 215, 0, 0.4)');
            ctx.fillStyle = goldGradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.globalCompositeOperation = 'source-over';
            break;
            
          case 'vintage':
            // Vintage/sepia effect
            ctx.globalCompositeOperation = 'multiply';
            ctx.fillStyle = 'rgba(255, 240, 200, 0.4)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Add noise
            for (let i = 0; i < 5000; i++) {
              const x = Math.random() * canvas.width;
              const y = Math.random() * canvas.height;
              const gray = Math.floor(Math.random() * 255);
              ctx.fillStyle = `rgba(${gray},${gray},${gray},0.01)`;
              ctx.fillRect(x, y, 1, 1);
            }
            ctx.globalCompositeOperation = 'source-over';
            break;
        }
      }
      
      // Create download link
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${title.replace(/\s+/g, '-').toLowerCase()}-card.png`;
      link.href = dataUrl;
      link.click();
      
      toast.success('Card downloaded successfully');
    } catch (error) {
      console.error('Error generating card for download:', error);
      toast.error('Failed to download card');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      // Use Web Share API if available
      const cardTitle = title || 'My Custom Card';
      navigator.share({
        title: cardTitle,
        text: description || `Check out my custom card: ${cardTitle}`,
        // In a real app, we would generate a shareable URL here
        url: window.location.href,
      }).catch(err => {
        console.error('Error sharing card:', err);
      });
    } else {
      // Fallback - copy URL to clipboard
      navigator.clipboard.writeText(window.location.href)
        .then(() => toast.success('Link copied to clipboard!'))
        .catch(() => toast.error('Failed to copy link'));
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold mb-4">Card Preview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="flex justify-between mb-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsFlipped(!isFlipped)}
            >
              {isFlipped ? (
                <>
                  <EyeOff className="h-4 w-4 mr-2" />
                  Show Front
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Show Back
                </>
              )}
            </Button>
            <span className="text-sm text-gray-500">
              {cardStyle.effect !== 'classic' && `Effect: ${cardStyle.effect}`}
            </span>
          </div>

          <div className="card-preview-container perspective-800">
            <div 
              className={`card-preview relative w-full aspect-[2.5/3.5] rounded-lg shadow-lg transition-transform duration-700 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}
            >
              {/* Front of card */}
              <div 
                className="absolute inset-0 backface-hidden"
                style={{
                  borderRadius: cardStyle.borderRadius,
                  borderWidth: `${cardStyle.borderWidth}px`,
                  borderColor: cardStyle.borderColor,
                  borderStyle: cardStyle.borderWidth > 0 ? 'solid' : 'none',
                  backgroundColor: cardStyle.backgroundColor,
                  overflow: 'hidden',
                }}
              >
                {imageUrl && (
                  <div className="relative w-full h-full overflow-hidden">
                    <img 
                      src={imageUrl} 
                      alt={title}
                      className="w-full h-full object-cover"
                      style={{
                        filter: `brightness(${cardStyle.brightness}%) contrast(${cardStyle.contrast}%) saturate(${cardStyle.saturation}%)`
                      }}
                    />
                    
                    {/* Overlay for text if enabled */}
                    {textStyle.showOverlay && (
                      <div 
                        className={`absolute ${
                          textStyle.overlayPosition === 'top' ? 'top-0' :
                          textStyle.overlayPosition === 'bottom' ? 'bottom-0' :
                          textStyle.overlayPosition === 'full' ? 'inset-0' :
                          'top-1/3' // Middle position
                        } left-0 right-0 ${
                          textStyle.overlayPosition === 'full' ? 'h-full' : 'h-1/3'
                        }`}
                        style={{
                          backgroundColor: textStyle.overlayColor,
                          opacity: textStyle.overlayOpacity / 100,
                        }}
                      />
                    )}
                    
                    {/* Card text */}
                    <div className={`absolute p-4 ${
                      textStyle.overlayPosition === 'top' ? 'top-0' :
                      textStyle.overlayPosition === 'bottom' ? 'bottom-0' :
                      textStyle.overlayPosition === 'full' ? 'inset-0' :
                      'top-1/3' // Middle position
                    } left-0 right-0`}>
                      {title && (
                        <h3 
                          className={`font-${textStyle.titleWeight} text-${textStyle.titleAlignment}`}
                          style={{
                            fontFamily: textStyle.titleFont,
                            fontSize: `${textStyle.titleSize}px`,
                            color: textStyle.titleColor,
                            fontStyle: textStyle.titleStyle,
                          }}
                        >
                          {title}
                        </h3>
                      )}
                      
                      {description && (
                        <p 
                          className="mt-2 line-clamp-2"
                          style={{
                            fontFamily: textStyle.descriptionFont,
                            fontSize: `${textStyle.descriptionSize}px`,
                            color: textStyle.descriptionColor,
                          }}
                        >
                          {description}
                        </p>
                      )}
                    </div>
                    
                    {/* Special effects overlay */}
                    {cardStyle.effect !== 'classic' && (
                      <div 
                        className={`absolute inset-0 pointer-events-none ${
                          cardStyle.effect === 'refractor' ? 'card-refractor-effect' :
                          cardStyle.effect === 'prism' ? 'card-prism-effect' :
                          cardStyle.effect === 'chrome' ? 'card-chrome-effect' :
                          cardStyle.effect === 'gold' ? 'card-gold-effect' :
                          cardStyle.effect === 'vintage' ? 'card-vintage-effect' : ''
                        }`}
                      />
                    )}
                  </div>
                )}
              </div>
              
              {/* Back of card */}
              <div 
                className="absolute inset-0 backface-hidden rotate-y-180"
                style={{
                  borderRadius: cardStyle.borderRadius,
                  borderWidth: `${cardStyle.borderWidth}px`,
                  borderColor: cardStyle.borderColor,
                  borderStyle: cardStyle.borderWidth > 0 ? 'solid' : 'none',
                  backgroundColor: cardStyle.backgroundColor,
                  backgroundImage: 'linear-gradient(45deg, #f0f0f0 25%, transparent 25%, transparent 75%, #f0f0f0 75%, #f0f0f0), linear-gradient(45deg, #f0f0f0 25%, transparent 25%, transparent 75%, #f0f0f0 75%, #f0f0f0)',
                  backgroundSize: '20px 20px',
                  backgroundPosition: '0 0, 10px 10px',
                }}
              >
                <div className="flex flex-col items-center justify-center h-full p-4">
                  {/* Card details on back */}
                  <div className="text-center">
                    <p className="font-bold mb-2">{title || 'Card Title'}</p>
                    
                    {description && (
                      <p className="text-sm mb-4">{description}</p>
                    )}
                    
                    {fabricSwatches && fabricSwatches.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-semibold mb-2">Fabric Swatches:</p>
                        <ul className="text-xs text-left">
                          {fabricSwatches.map((swatch, index) => (
                            <li key={index} className="mb-1">
                              {swatch.team} {swatch.year} {swatch.type}
                              {swatch.manufacturer && ` - ${swatch.manufacturer}`}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Card Actions</h3>
          
          <Card className="p-4">
            <div className="space-y-4">
              <div>
                <Button 
                  variant="default" 
                  className="w-full flex items-center justify-center"
                  onClick={handleDownload}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Card
                </Button>
              </div>
              
              <div>
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-center"
                  onClick={handleShare}
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Card
                </Button>
              </div>
            </div>
          </Card>
          
          <div className="mt-8">
            <h4 className="text-sm font-medium mb-2">Card Summary</h4>
            <div className="text-sm">
              <p><span className="font-semibold">Title:</span> {title || 'Untitled'}</p>
              {description && (
                <p className="mt-1"><span className="font-semibold">Description:</span> {description}</p>
              )}
              <p className="mt-1">
                <span className="font-semibold">Design:</span> {cardStyle.effect} effect
                {cardStyle.borderWidth > 0 && ` with ${cardStyle.borderWidth}px border`}
              </p>
              {cardStyle.effect !== 'classic' && (
                <p className="italic text-xs mt-4">
                  Note: Special effects may appear differently when downloaded or shared
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardPreview;

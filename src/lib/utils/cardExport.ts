
import html2canvas from 'html-canvas';
import { Card } from '@/lib/types/cardTypes';
import { toast } from './toast';

// Function to capture card as image
export const captureCardAsImage = async (
  cardElement: HTMLElement,
  options: {
    format?: 'png' | 'jpeg' | 'webp';
    quality?: number;
    scale?: number;
    backgroundColor?: string;
  } = {}
): Promise<string> => {
  const {
    format = 'png',
    quality = 0.95,
    scale = 2,
    backgroundColor = 'transparent'
  } = options;
  
  if (!cardElement) {
    throw new Error('Card element not found');
  }

  try {
    // Create a canvas from the card element
    const canvas = await html2canvas(cardElement, {
      scale,
      backgroundColor,
      useCORS: true,
      allowTaint: true,
      logging: false
    });

    // Convert canvas to data URL
    let dataUrl: string;
    switch (format) {
      case 'jpeg':
        dataUrl = canvas.toDataURL('image/jpeg', quality);
        break;
      case 'webp':
        dataUrl = canvas.toDataURL('image/webp', quality);
        break;
      case 'png':
      default:
        dataUrl = canvas.toDataURL('image/png');
        break;
    }

    return dataUrl;
  } catch (error) {
    console.error('Error capturing card:', error);
    throw error;
  }
};

// Function to download card as image
export const downloadCardAsImage = async (
  cardElement: HTMLElement,
  card: Card,
  options: {
    format?: 'png' | 'jpeg' | 'webp';
    quality?: number;
    scale?: number;
    backgroundColor?: string;
    fileName?: string;
  } = {}
): Promise<void> => {
  try {
    const fileName = options.fileName || `${card.title || 'card'}-${Date.now()}`;
    const format = options.format || 'png';
    
    // Capture the card image
    const dataUrl = await captureCardAsImage(cardElement, options);
    
    // Create a download link
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `${fileName}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: 'Download successful',
      description: `${fileName}.${format} has been downloaded`,
      variant: 'success'
    });
  } catch (error) {
    console.error('Error downloading card:', error);
    toast({
      title: 'Download failed',
      description: 'There was an error downloading your card',
      variant: 'destructive'
    });
    throw error;
  }
};

// Function to export card as JSON
export const exportCardAsJson = (card: Card): void => {
  try {
    // Convert card object to JSON string
    const jsonString = JSON.stringify(card, null, 2);
    
    // Create a blob from the JSON string
    const blob = new Blob([jsonString], { type: 'application/json' });
    
    // Create a URL for the blob
    const url = URL.createObjectURL(blob);
    
    // Create a download link
    const link = document.createElement('a');
    link.href = url;
    link.download = `${card.title || 'card'}-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Export successful',
      description: 'Card exported as JSON',
      variant: 'success'
    });
  } catch (error) {
    console.error('Error exporting card as JSON:', error);
    toast({
      title: 'Export failed',
      description: 'There was an error exporting your card as JSON',
      variant: 'destructive'
    });
  }
};

// Function to export card to social media
export const shareCardToSocial = async (
  cardElement: HTMLElement,
  card: Card,
  platform: 'twitter' | 'facebook' | 'instagram' | 'pinterest'
): Promise<void> => {
  try {
    // Capture the card image
    const dataUrl = await captureCardAsImage(cardElement, { format: 'png', scale: 2 });
    
    // Build share URL based on platform
    let shareUrl: string;
    const title = card.title || 'Check out my card';
    const text = card.description || 'Created with Cardshow';
    const url = window.location.href;
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`;
        break;
      case 'pinterest':
        shareUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&media=${encodeURIComponent(dataUrl)}&description=${encodeURIComponent(text)}`;
        break;
      case 'instagram':
        // Instagram requires a different approach, typically through their API
        toast({
          title: 'Instagram sharing',
          description: 'Please download the image and share it manually on Instagram',
          variant: 'info'
        });
        await downloadCardAsImage(cardElement, card, { format: 'jpeg', quality: 1 });
        return;
      default:
        throw new Error('Unsupported platform');
    }
    
    // Open the share URL in a new window
    window.open(shareUrl, '_blank');
    
    toast({
      title: 'Share initiated',
      description: `Share window opened for ${platform}`,
      variant: 'success'
    });
  } catch (error) {
    console.error('Error sharing card:', error);
    toast({
      title: 'Share failed',
      description: 'There was an error sharing your card',
      variant: 'destructive'
    });
  }
};

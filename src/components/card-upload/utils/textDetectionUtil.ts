
import { DetectedMetadata } from '../types/detectionTypes';

export async function detectText(
  source: HTMLCanvasElement | HTMLImageElement
): Promise<DetectedMetadata | null> {
  try {
    const isBaseballCard = Math.random() > 0.3;
    const isVintage = Math.random() > 0.5;
    
    let tags = ["card"];
    let sport = "baseball";
    let year = "1989";
    let team = "Oakland Athletics";
    let playerName = "John Smith";
    let position = "Pitcher";
    let setName = "Topps";
    let manufacturer = "Topps";
    let cardNumber = "152";
    
    if (isBaseballCard) {
      tags.push("baseball");
      
      if (isVintage) {
        tags.push("vintage");
        year = String(1950 + Math.floor(Math.random() * 40));
        manufacturer = ["Topps", "Bowman", "Fleer"][Math.floor(Math.random() * 3)];
      } else {
        tags.push("modern");
        year = String(1990 + Math.floor(Math.random() * 33));
        manufacturer = ["Topps", "Upper Deck", "Panini", "Fleer Ultra"][Math.floor(Math.random() * 4)];
      }
      
      team = ["New York Yankees", "Boston Red Sox", "Chicago Cubs", "Los Angeles Dodgers", 
              "San Francisco Giants", "Oakland Athletics", "Atlanta Braves"][Math.floor(Math.random() * 7)];
      
      position = ["Pitcher", "Catcher", "First Base", "Second Base", "Shortstop", 
                 "Third Base", "Left Field", "Center Field", "Right Field"][Math.floor(Math.random() * 9)];
    }
    
    const title = `${year} ${manufacturer} ${playerName} #${cardNumber}`;
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      text: `${playerName}, ${position}, ${team}, ${year} ${setName} Baseball Card #${cardNumber}`,
      title,
      player: playerName,
      team,
      year,
      position,
      sport,
      manufacturer,
      cardNumber,
      setName,
      condition: ["Mint", "Near Mint", "Excellent", "Very Good", "Good"][Math.floor(Math.random() * 5)],
      tags,
      confidence: 0.75 + (Math.random() * 0.2)
    };
  } catch (error) {
    console.error('Error detecting text:', error);
    return null;
  }
}

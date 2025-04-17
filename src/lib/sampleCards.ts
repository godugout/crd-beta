
import { v4 as uuidv4 } from 'uuid';
import { Card } from '@/lib/types';
import { adaptToCard } from './adapters/cardAdapter';

// Function to generate sample cards for testing
export const generateSampleCards = (count: number = 5): Card[] => {
  const sampleCards: Card[] = [];
  
  const sports = ['Baseball', 'Basketball', 'Football', 'Hockey', 'Soccer'];
  const teams = ['Red Sox', 'Lakers', 'Chiefs', 'Penguins', 'Galaxy'];
  const years = ['1980', '1990', '2000', '2010', '2020'];
  const rarities = ['common', 'uncommon', 'rare', 'ultra-rare', 'legendary'];
  const effects = ['Holographic', 'Refractor', 'Chrome', 'Gold', 'Silver', 'Prizm'];
  
  for (let i = 0; i < count; i++) {
    const sportIndex = i % sports.length;
    const sport = sports[sportIndex];
    const team = teams[sportIndex];
    const year = years[Math.floor(Math.random() * years.length)];
    const rarity = rarities[Math.floor(Math.random() * rarities.length)];
    
    // Randomly select 1-3 effects
    const cardEffects = [];
    const effectCount = Math.floor(Math.random() * 3) + 1;
    for (let j = 0; j < effectCount; j++) {
      const effect = effects[Math.floor(Math.random() * effects.length)];
      if (!cardEffects.includes(effect)) {
        cardEffects.push(effect);
      }
    }
    
    const card = adaptToCard({
      title: `${year} ${sport} - ${team}`,
      description: `Classic ${sport} card featuring ${team} from ${year}`,
      imageUrl: `https://picsum.photos/seed/${sport}${i}/300/400`,
      thumbnailUrl: `https://picsum.photos/seed/${sport}${i}/150/200`,
      tags: [sport.toLowerCase(), team.toLowerCase(), year, 'vintage'],
      userId: 'sample-user',
      effects: cardEffects,
      rarity: rarity,
      player: `Player ${i + 1}`,
      team: team,
      year: year
    });
    
    sampleCards.push(card);
  }
  
  return sampleCards;
};

export default generateSampleCards;

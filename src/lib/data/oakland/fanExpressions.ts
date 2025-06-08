
export interface OaklandFanExpression {
  id: string;
  category: 'cheer' | 'chant' | 'protest' | 'nostalgia' | 'inside_joke' | 'player_call';
  text_content: string;
  audio_url?: string;
  emotion_tags: string[];
  usage_count: number;
  source: 'fan_submitted' | 'historical' | 'broadcast';
  decade?: '70s' | '80s' | '90s' | '2000s' | '2010s' | '2020s';
  era?: 'early_years' | 'dynasty_70s' | 'bash_brothers' | 'moneyball' | 'playoff_runs' | 'farewell';
  context?: string;
}

export const OAKLAND_FAN_EXPRESSIONS: OaklandFanExpression[] = [
  // Classic Cheers
  {
    id: 'lets-go-oakland',
    category: 'cheer',
    text_content: "Let's Go Oakland! *clap clap clapclapclap*",
    emotion_tags: ['joy', 'energy'],
    usage_count: 1250,
    source: 'historical',
    decade: '70s',
    era: 'dynasty_70s',
    context: 'Universal A\'s cheer heard at every game'
  },
  {
    id: 'green-and-gold',
    category: 'cheer', 
    text_content: "Green and Gold never gets old!",
    emotion_tags: ['pride', 'tradition'],
    usage_count: 890,
    source: 'fan_submitted',
    decade: '2000s',
    era: 'playoff_runs'
  },

  // Player Calls
  {
    id: 'rickey-being-rickey',
    category: 'player_call',
    text_content: "Rickey being Rickey!",
    emotion_tags: ['joy', 'admiration'],
    usage_count: 567,
    source: 'broadcast',
    decade: '80s',
    era: 'bash_brothers',
    context: 'Rickey Henderson\'s unique style and personality'
  },
  {
    id: 'bash-brothers-chant',
    category: 'player_call',
    text_content: "Bash! Brothers! Bash! Brothers!",
    emotion_tags: ['excitement', 'power'],
    usage_count: 445,
    source: 'historical',
    decade: '80s',
    era: 'bash_brothers',
    context: 'Canseco and McGwire home run celebrations'
  },
  {
    id: 'captain-clutch',
    category: 'player_call',
    text_content: "Captain Clutch! Derek Jeter who?",
    emotion_tags: ['defiance', 'pride'],
    usage_count: 234,
    source: 'fan_submitted',
    decade: '2000s',
    era: 'moneyball',
    context: 'Jason Giambi in clutch situations'
  },

  // Protest Chants
  {
    id: 'sell-the-team',
    category: 'protest',
    text_content: "SELL THE TEAM! SELL THE TEAM!",
    emotion_tags: ['anger', 'frustration'],
    usage_count: 2100,
    source: 'fan_submitted',
    decade: '2020s',
    era: 'farewell',
    context: 'Directed at ownership during relocation discussions'
  },
  {
    id: 'vegas-aint-home',
    category: 'protest',
    text_content: "Vegas ain't home! Oakland forever!",
    emotion_tags: ['defiance', 'loyalty'],
    usage_count: 1567,
    source: 'fan_submitted',
    decade: '2020s',
    era: 'farewell'
  },
  {
    id: 'reverse-boycott',
    category: 'protest',
    text_content: "Reverse boycott! Fill the Coliseum!",
    emotion_tags: ['determination', 'unity'],
    usage_count: 890,
    source: 'fan_submitted',
    decade: '2020s',
    era: 'farewell',
    context: 'Fan movement to show support by attending games'
  },

  // Nostalgic Expressions
  {
    id: 'mount-davis',
    category: 'nostalgia',
    text_content: "Remember when we could see the hills?",
    emotion_tags: ['sadness', 'nostalgia'],
    usage_count: 445,
    source: 'fan_submitted',
    decade: '2000s',
    era: 'playoff_runs',
    context: 'Missing the view before Mount Davis was built'
  },
  {
    id: 'foul-territory',
    category: 'nostalgia',
    text_content: "Most foul territory in baseball, but it's OUR foul territory",
    emotion_tags: ['acceptance', 'love'],
    usage_count: 334,
    source: 'fan_submitted',
    decade: '2010s',
    era: 'playoff_runs'
  },
  {
    id: 'garlic-fries',
    category: 'nostalgia',
    text_content: "The Coliseum smelled like garlic fries and dreams",
    emotion_tags: ['nostalgia', 'comfort'],
    usage_count: 678,
    source: 'fan_submitted',
    decade: '90s',
    era: 'moneyball'
  },

  // Inside Jokes
  {
    id: 'rally-possum',
    category: 'inside_joke',
    text_content: "Rally Possum lives forever!",
    emotion_tags: ['joy', 'community'],
    usage_count: 1200,
    source: 'fan_submitted',
    decade: '2010s',
    era: 'playoff_runs',
    context: 'Viral possum that appeared during 2013 playoff run'
  },
  {
    id: 'tarped-sections',
    category: 'inside_joke',
    text_content: "We got tarped, but we stayed anyway",
    emotion_tags: ['resilience', 'humor'],
    usage_count: 567,
    source: 'fan_submitted',
    decade: '2000s',
    era: 'moneyball',
    context: 'Sections covered by tarps due to low attendance'
  },
  {
    id: 'sewage-backup',
    category: 'inside_joke',
    text_content: "Even the sewage knew this place was crap",
    emotion_tags: ['humor', 'frustration'],
    usage_count: 234,
    source: 'fan_submitted',
    decade: '2010s',
    era: 'playoff_runs',
    context: 'Frequent sewage problems at the Coliseum'
  },

  // Chants
  {
    id: 'drumline-rhythm',
    category: 'chant',
    text_content: "Let's go Oak-land! *drums* Let's go Oak-land! *drums*",
    emotion_tags: ['energy', 'rhythm'],
    usage_count: 890,
    source: 'historical',
    decade: '2000s',
    era: 'playoff_runs',
    context: 'Oakland A\'s famous drumline leading crowd chants'
  },
  {
    id: 'monte-moore',
    category: 'chant',
    text_content: "Holy Toledo! What a play!",
    emotion_tags: ['excitement', 'tradition'],
    usage_count: 445,
    source: 'broadcast',
    decade: '80s',
    era: 'bash_brothers',
    context: 'Monte Moore\'s signature call'
  },

  // Modern Era
  {
    id: 'rooted-in-oakland',
    category: 'cheer',
    text_content: "Rooted in Oakland! Always!",
    emotion_tags: ['pride', 'determination'],
    usage_count: 1100,
    source: 'fan_submitted',
    decade: '2020s',
    era: 'farewell',
    context: 'Fan movement slogan emphasizing Oakland roots'
  },
  {
    id: 'attendance-shame',
    category: 'protest',
    text_content: "We showed up when it mattered",
    emotion_tags: ['defiance', 'pride'],
    usage_count: 445,
    source: 'fan_submitted',
    decade: '2020s',
    era: 'farewell',
    context: 'Response to attendance criticism'
  }
];

// Search and filter functions
export const searchExpressions = (query: string): OaklandFanExpression[] => {
  const lowercaseQuery = query.toLowerCase();
  return OAKLAND_FAN_EXPRESSIONS.filter(expression =>
    expression.text_content.toLowerCase().includes(lowercaseQuery) ||
    expression.emotion_tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
    expression.context?.toLowerCase().includes(lowercaseQuery)
  );
};

export const getExpressionsByCategory = (category: OaklandFanExpression['category']): OaklandFanExpression[] => {
  return OAKLAND_FAN_EXPRESSIONS.filter(expression => expression.category === category);
};

export const getExpressionsByEmotion = (emotion: string): OaklandFanExpression[] => {
  return OAKLAND_FAN_EXPRESSIONS.filter(expression => 
    expression.emotion_tags.includes(emotion)
  );
};

export const getExpressionsByEra = (era: OaklandFanExpression['era']): OaklandFanExpression[] => {
  return OAKLAND_FAN_EXPRESSIONS.filter(expression => expression.era === era);
};

export const getPopularExpressions = (limit: number = 10): OaklandFanExpression[] => {
  return OAKLAND_FAN_EXPRESSIONS
    .sort((a, b) => b.usage_count - a.usage_count)
    .slice(0, limit);
};

export const productMusicMap: { [key: string]: number } = {
  // Jackets - Western/Country vibes
  'classic-western-jacket': 0,
  'vintage-biker-jacket': 1,
  'executive-leather-blazer': 2,
  'ranch-rider-jacket': 3,
  
  // Belts - Mid-tempo
  'hand-tooled-western-belt': 1,
  'classic-dress-belt': 2,
  'silver-buckle-statement': 0,
  'rodeo-champion-belt': 3,
  
  // Buckles - Upbeat
  'sterling-eagle-buckle': 2,
  'vintage-silver-buckle': 3,
  'gold-longhorn-buckle': 0,
  'championship-trophy-buckle': 1,
};

export const musicThemes: { [key: number]: { primary: string; accent: string; gradient: string } } = {
  0: {
    primary: '25 40% 28%', // Deep leather brown
    accent: '35 65% 55%', // Warm cognac
    gradient: 'linear-gradient(135deg, hsl(25 40% 28%) 0%, hsl(30 35% 42%) 100%)',
  },
  1: {
    primary: '30 35% 35%', // Rich brown
    accent: '28 55% 45%', // Cognac
    gradient: 'linear-gradient(135deg, hsl(30 35% 35%) 0%, hsl(28 55% 45%) 100%)',
  },
  2: {
    primary: '35 30% 40%', // Medium leather
    accent: '35 40% 70%', // Tan
    gradient: 'linear-gradient(135deg, hsl(35 30% 40%) 0%, hsl(35 40% 70%) 100%)',
  },
  3: {
    primary: '28 55% 45%', // Cognac
    accent: '0 0% 75%', // Silver
    gradient: 'linear-gradient(135deg, hsl(28 55% 45%) 0%, hsl(0 0% 75%) 100%)',
  },
};

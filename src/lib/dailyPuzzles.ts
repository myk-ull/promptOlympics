// Curated daily puzzle images
export const DAILY_PUZZLES = [
  {
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=800&fit=crop&q=80',
    description: 'Majestic snow-capped mountain peaks with dramatic clouds',
    difficulty: 2,
    theme: 'landscape'
  },
  {
    url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&h=800&fit=crop',
    description: 'Orange tabby cat with bright green eyes looking at camera',
    difficulty: 1,
    theme: 'animals'
  },
  {
    url: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=800&fit=crop',
    description: 'Golden Gate Bridge at sunset with orange sky',
    difficulty: 2,
    theme: 'architecture'
  },
  {
    url: 'https://images.unsplash.com/photo-1533450718592-29d45635f0a9?w=800&h=800&fit=crop',
    description: 'Majestic tiger face close-up with intense eyes',
    difficulty: 3,
    theme: 'animals'
  },
  {
    url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&h=800&fit=crop',
    description: 'Serene lake with mountains reflected in still water',
    difficulty: 2,
    theme: 'landscape'
  },
  {
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop',
    description: 'Professional man in suit smiling at camera',
    difficulty: 3,
    theme: 'people'
  },
  {
    url: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=800&h=800&fit=crop',
    description: 'Funny pug dog with tongue out wearing bowtie',
    difficulty: 1,
    theme: 'animals'
  },
  {
    url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=800&fit=crop',
    description: 'City street at night with neon lights and rain',
    difficulty: 3,
    theme: 'urban'
  },
  {
    url: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=800&h=800&fit=crop',
    description: 'Waterfall in tropical forest with lush greenery',
    difficulty: 2,
    theme: 'nature'
  },
  {
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=800&fit=crop',
    description: 'Tropical beach with palm trees and turquoise water',
    difficulty: 1,
    theme: 'landscape'
  },
  {
    url: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=800&h=800&fit=crop',
    description: 'Japanese temple with cherry blossoms in spring',
    difficulty: 3,
    theme: 'architecture'
  },
  {
    url: 'https://images.unsplash.com/photo-1495904786722-d238cc0334b2?w=800&h=800&fit=crop',
    description: 'Fresh sushi platter with variety of rolls',
    difficulty: 2,
    theme: 'food'
  },
  {
    url: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=800&h=800&fit=crop',
    description: 'Cute corgi dog smiling with tongue out',
    difficulty: 1,
    theme: 'animals'
  },
  {
    url: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&h=800&fit=crop',
    description: 'Hot air balloons floating over Cappadocia landscape',
    difficulty: 2,
    theme: 'landscape'
  },
  {
    url: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&h=800&fit=crop',
    description: 'Futuristic technology workspace with neon lights',
    difficulty: 3,
    theme: 'technology'
  }
];

// Get puzzle for a specific date (cycles through the list)
export function getPuzzleForDate(date: Date) {
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
  const index = dayOfYear % DAILY_PUZZLES.length;
  return DAILY_PUZZLES[index];
}
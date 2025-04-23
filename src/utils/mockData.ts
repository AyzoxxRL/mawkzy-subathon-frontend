import { Memory, GalleryItem, SubathonStats } from '../types';

// Mock memories
export const mockMemories: Memory[] = [
  {
    id: 'memory-example',
    author: 'TestUser',
    message: "Exemple de souvenir - Ce moment où Mawkzy a passé 2 heures à essayer de battre ce boss impossible, et la réaction quand il a finalement réussi. Je n'ai jamais ri autant!",
    timestamp: '2023-07-15T14:30:00Z',
    likes: 145,
    approved: true,
    clipUrl: 'https://clips.twitch.tv/ElegantSpineyOxPRChase-iTeRU3MJiWyEMjKR',
    clipId: 'ElegantSpineyOxPRChase-iTeRU3MJiWyEMjKR'
  }
];

// Mock gallery items
export const mockGalleryItems: GalleryItem[] = [
  {
    id: '1',
    title: 'Victory Royale Épique',
    description: 'Mawkzy remporte une victoire incroyable sur Fortnite après 3 heures de jeu intense !',
    imageUrl: '/images/gallery/victory-royale.jpg',
    timestampTwitch: '2025-04-15T14:45:30Z',
    tags: ['Fortnite', 'Victory Royale', 'Gaming'],
    submittedBy: 'ModeratorPro'
  },
  {
    id: '2',
    title: 'Collaboration Surprise',
    description: 'Moment où Squeezie rejoint le stream pour une partie de Rocket League',
    imageUrl: '/images/gallery/collab-surprise.jpg',
    timestampTwitch: '2025-04-16T19:20:15Z',
    tags: ['Collaboration', 'Squeezie', 'Rocket League'],
    submittedBy: 'ContentCreator'
  },
  {
    id: '3',
    title: 'Réaction au Don Massif',
    description: 'La réaction de Mawkzy quand un viewer fait un don de 1000€ !',
    imageUrl: '/images/gallery/big-donation.jpg',
    timestampTwitch: '2025-04-17T21:05:40Z',
    tags: ['Donation', 'Réaction', 'Subathon'],
    submittedBy: 'StreamHighlights'
  },
  {
    id: '4',
    title: 'Marathon Minecraft',
    description: 'Après 12 heures de jeu, Mawkzy bat enfin l\'Ender Dragon !',
    imageUrl: '/images/gallery/minecraft-win.jpg',
    timestampTwitch: '2025-04-18T04:30:10Z',
    tags: ['Minecraft', 'Ender Dragon', 'Achievement'],
    submittedBy: 'MinecraftLover'
  },
  {
    id: '5',
    title: 'Moment IRL',
    description: 'Mawkzy prépare un repas en direct pour ses viewers après 24h de stream !',
    imageUrl: '/images/gallery/irl-cooking.jpg',
    timestampTwitch: '2025-04-19T18:15:25Z',
    tags: ['IRL', 'Cooking', 'Subathon Challenge'],
    submittedBy: 'RealLifeStreamer'
  }
];

// Mock stats
export const mockSubathonStats: SubathonStats = {
  hoursStreamed: 360, // 15 jours
  totalDonations: 15420,
  totalSubscriptions: 5100,
  peakViewers: 3800,
  gamesPlayed: [
    { name: 'Fortnite', hoursPlayed: 28, category: 'Battle Royale' },
    { name: 'Minecraft', hoursPlayed: 24, category: 'Survival' },
    { name: 'Rocket League', hoursPlayed: 18, category: 'Sports' },
    { name: 'Valorant', hoursPlayed: 22, category: 'FPS' },
    { name: 'League of Legends', hoursPlayed: 20, category: 'MOBA' },
    { name: 'Just Chatting', hoursPlayed: 26, category: 'IRL' },
    { name: 'GTA V', hoursPlayed: 16, category: 'Open World' },
    { name: 'Trackmania', hoursPlayed: 14, category: 'Racing' }
  ],
  subGoals: [
    { target: 100, description: '10 heures ajoutées au timer', achieved: true, timestamp: '2025-04-15T12:30:00Z' },
    { target: 250, description: 'Marathon Fortnite de 6 heures', achieved: true, timestamp: '2025-04-16T18:00:00Z' },
    { target: 500, description: 'Défi du piment ghost pepper', achieved: true, timestamp: '2025-04-19T16:00:00Z' },
    { target: 750, description: 'Jouer avec des viewers pendant 4 heures', achieved: true, timestamp: '2025-04-20T14:00:00Z' },
    { target: 1000, description: 'Streaming IRL dans Paris', achieved: true, timestamp: '2025-04-21T12:00:00Z' },
    { target: 1500, description: 'Teindre les cheveux en violet', achieved: true, timestamp: '2025-04-22T08:00:00Z' },
    { target: 2000, description: 'Organiser un tournoi avec des prix pour Ayzoxx', achieved: false }
  ]
}; 
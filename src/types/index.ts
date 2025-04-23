// Memory submission type
export interface Memory {
  id: string;
  author: string;
  message: string;
  timestamp: string;
  likes: number;
  approved: boolean;
  clipUrl: string;  // URL du clip Twitch
  clipId: string;   // ID du clip extrait de l'URL
}

// Gallery item type
export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  timestampTwitch: string; // Twitch timestamp format
  tags: string[];
  submittedBy: string;
}

// Stats type
export interface SubathonStats {
  hoursStreamed: number;
  totalDonations: number;
  totalSubscriptions: number;
  peakViewers: number;
  gamesPlayed: GamePlayed[];
  subGoals: SubGoal[];
}

// Game played type
export interface GamePlayed {
  name: string;
  hoursPlayed: number;
  category: string;
}

// Sub goal type
export interface SubGoal {
  target: number;
  description: string;
  achieved: boolean;
  timestamp?: string;
}

/**
 * Interface for a user comment
 */
export interface Commentaire {
  id: string;
  auteur: string;
  message: string;
  date: string;
} 
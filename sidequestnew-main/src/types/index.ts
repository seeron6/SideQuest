export type NavigatorMode = 'adventure' | 'foodie' | 'nature' | 'culture' | 'social' | 'mystery';
export type TravelType = 'walking' | 'driving';
export type DetourLevel = 'light' | 'moderate' | 'bold';
export type Visibility = 'private' | 'public';

export interface User {
  id: string;
  name: string;
  authProvider: 'apple' | 'google' | 'guest';
  points: number;
  streak: number;
  routesCompleted: number;
  badgesUnlocked: string[];
  savedRoutes: string[];
  walletAddress?: string;
  avatarUrl?: string;
}

export interface Spot {
  id: string;
  name: string;
  category: string;
  lat: number;
  lng: number;
  shortDescription: string;
  modeTags: NavigatorMode[];
  travelTags: TravelType[];
  imageUrl?: string;
}

export interface Route {
  id: string;
  mode: NavigatorMode;
  travelType: TravelType;
  detourLevel: DetourLevel;
  stopCount: number;
  origin: string;
  destination?: string;
  stops: Spot[];
  estTime: number; // minutes
  estDetourTime: number; // minutes added
  estPoints: number;
}

export interface Memory {
  id: string;
  userId: string;
  spotId: string;
  mediaUrl: string;
  caption: string;
  visibility: Visibility;
  createdAt: string;
  likes: number;
  spotName?: string;
}

export interface Challenge {
  id: string;
  title: string;
  clueImages: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  rewardPoints: number;
  targetLat: number;
  targetLng: number;
  active: boolean;
  description: string;
  category: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  onChainTx?: string;
}

export interface RouteConfig {
  mode: NavigatorMode | null;
  travelType: TravelType;
  detourLevel: DetourLevel;
  stopCount: number;
  destination: string;
  exploreAroundMe: boolean;
}

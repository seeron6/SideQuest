import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Badge, Memory, Route, RouteConfig, NavigatorMode } from '@/types';
import { seedBadges, seedMemories } from '@/data/seedData';

interface AppState {
  user: User;
  badges: Badge[];
  memories: Memory[];
  currentRoute: Route | null;
  routeConfig: RouteConfig;
  isOnboarded: boolean;
  hasSeenHero: boolean;
}

interface AppContextType extends AppState {
  setUser: (u: User) => void;
  addPoints: (pts: number) => void;
  incrementStreak: () => void;
  addMemory: (m: Memory) => void;
  setCurrentRoute: (r: Route | null) => void;
  setRouteConfig: (c: Partial<RouteConfig>) => void;
  completeOnboarding: () => void;
  dismissHero: () => void;
  unlockBadge: (id: string) => void;
  updateBadgeProgress: (id: string, progress: number) => void;
}

const defaultUser: User = {
  id: 'guest',
  name: 'Explorer',
  authProvider: 'guest',
  points: 0,
  streak: 0,
  routesCompleted: 0,
  badgesUnlocked: [],
  savedRoutes: [],
};

const defaultRouteConfig: RouteConfig = {
  mode: null,
  travelType: 'walking',
  detourLevel: 'moderate',
  stopCount: 3,
  destination: '',
  exploreAroundMe: false,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(defaultUser);
  const [badges, setBadges] = useState<Badge[]>(seedBadges);
  const [memories, setMemories] = useState<Memory[]>(seedMemories);
  const [currentRoute, setCurrentRoute] = useState<Route | null>(null);
  const [routeConfig, setRouteConfigState] = useState<RouteConfig>(defaultRouteConfig);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [hasSeenHero, setHasSeenHero] = useState(false);

  const addPoints = (pts: number) => setUser(prev => ({ ...prev, points: prev.points + pts }));
  const incrementStreak = () => setUser(prev => ({ ...prev, streak: prev.streak + 1 }));
  const addMemory = (m: Memory) => setMemories(prev => [m, ...prev]);
  const setRouteConfig = (c: Partial<RouteConfig>) => setRouteConfigState(prev => ({ ...prev, ...c }));
  const completeOnboarding = () => setIsOnboarded(true);
  const dismissHero = () => setHasSeenHero(true);
  const unlockBadge = (id: string) => {
    setBadges(prev => prev.map(b => b.id === id ? { ...b, unlocked: true, progress: b.maxProgress } : b));
    setUser(prev => ({ ...prev, badgesUnlocked: [...prev.badgesUnlocked, id] }));
  };
  const updateBadgeProgress = (id: string, progress: number) => {
    setBadges(prev => prev.map(b => b.id === id ? { ...b, progress: Math.min(progress, b.maxProgress), unlocked: progress >= b.maxProgress } : b));
  };

  return (
    <AppContext.Provider value={{
      user, badges, memories, currentRoute, routeConfig, isOnboarded, hasSeenHero,
      setUser, addPoints, incrementStreak, addMemory, setCurrentRoute, setRouteConfig,
      completeOnboarding, dismissHero, unlockBadge, updateBadgeProgress,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

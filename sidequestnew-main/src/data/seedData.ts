import { Spot, Challenge, Badge, Memory } from '@/types';

export const seedSpots: Spot[] = [
  { id: 's1', name: 'Hidden Mural Alley', category: 'Art', lat: 37.7749, lng: -122.4194, shortDescription: 'A vibrant alley filled with local street art, constantly evolving.', modeTags: ['culture', 'adventure'], travelTags: ['walking'], imageUrl: '' },
  { id: 's2', name: 'Rooftop Garden Café', category: 'Café', lat: 37.7751, lng: -122.4180, shortDescription: 'Tiny rooftop café with the best pour-over and city views.', modeTags: ['foodie', 'social'], travelTags: ['walking', 'driving'], imageUrl: '' },
  { id: 's3', name: 'Whispering Pines Trail', category: 'Nature', lat: 37.7760, lng: -122.4210, shortDescription: 'A short forest trail that feels miles from the city.', modeTags: ['nature', 'adventure'], travelTags: ['walking'], imageUrl: '' },
  { id: 's4', name: 'The Vinyl Basement', category: 'Music', lat: 37.7745, lng: -122.4175, shortDescription: 'Underground record shop with rare finds and live sessions.', modeTags: ['culture', 'social'], travelTags: ['walking', 'driving'], imageUrl: '' },
  { id: 's5', name: 'Sunset Overlook', category: 'Viewpoint', lat: 37.7770, lng: -122.4230, shortDescription: 'The locals\' secret spot for golden hour views.', modeTags: ['nature', 'adventure', 'mystery'], travelTags: ['walking', 'driving'], imageUrl: '' },
  { id: 's6', name: 'Grandmother\'s Dumpling House', category: 'Restaurant', lat: 37.7740, lng: -122.4165, shortDescription: 'Family-run for 40 years. The soup dumplings are legendary.', modeTags: ['foodie', 'culture'], travelTags: ['walking', 'driving'], imageUrl: '' },
  { id: 's7', name: 'The Curiosity Shop', category: 'Retail', lat: 37.7755, lng: -122.4195, shortDescription: 'Antiques, oddities, and stories in every corner.', modeTags: ['mystery', 'culture'], travelTags: ['walking'], imageUrl: '' },
  { id: 's8', name: 'Community Book Exchange', category: 'Community', lat: 37.7748, lng: -122.4188, shortDescription: 'A little free library that became a neighborhood gathering spot.', modeTags: ['social', 'culture'], travelTags: ['walking'], imageUrl: '' },
  { id: 's9', name: 'Lavender Fields Park', category: 'Park', lat: 37.7780, lng: -122.4250, shortDescription: 'Urban pocket park with fragrant lavender rows and benches.', modeTags: ['nature'], travelTags: ['walking', 'driving'], imageUrl: '' },
  { id: 's10', name: 'The Secret Speakeasy', category: 'Bar', lat: 37.7738, lng: -122.4172, shortDescription: 'Ring the bell behind the bookshelf. You\'ll know when you find it.', modeTags: ['mystery', 'social', 'foodie'], travelTags: ['walking', 'driving'], imageUrl: '' },
];

export const seedChallenges: Challenge[] = [
  { id: 'c1', title: 'Find the Blue Door', clueImages: [], difficulty: 'easy', rewardPoints: 50, targetLat: 37.7749, targetLng: -122.4194, active: true, description: 'Somewhere on Valencia Street, there\'s a bright blue door with a tiny brass owl. Find it and check in.', category: 'Exploration' },
  { id: 'c2', title: 'The Singing Steps', clueImages: [], difficulty: 'medium', rewardPoints: 100, targetLat: 37.7560, targetLng: -122.4130, active: true, description: 'There\'s a hidden staircase where each step plays a different note. Can you find it?', category: 'Music' },
  { id: 'c3', title: 'Sunset Cipher', clueImages: [], difficulty: 'hard', rewardPoints: 200, targetLat: 37.7690, targetLng: -122.4380, active: true, description: 'At golden hour, a shadow reveals coordinates carved into a bench. Decode the message.', category: 'Mystery' },
  { id: 'c4', title: 'Mural Marathon', clueImages: [], difficulty: 'medium', rewardPoints: 150, targetLat: 37.7590, targetLng: -122.4210, active: false, description: 'Visit 5 murals in the Mission District and capture each one.', category: 'Art' },
];

export const seedBadges: Badge[] = [
  { id: 'b1', name: 'First Steps', description: 'Complete your first route', icon: '👟', progress: 0, maxProgress: 1, unlocked: false },
  { id: 'b2', name: 'Mural Hunter', description: 'Visit 5 murals', icon: '🎨', progress: 0, maxProgress: 5, unlocked: false },
  { id: 'b3', name: 'Park Wanderer', description: 'Visit 3 parks', icon: '🌿', progress: 0, maxProgress: 3, unlocked: false },
  { id: 'b4', name: 'Foodie Explorer', description: 'Visit 3 cafés or restaurants', icon: '☕', progress: 0, maxProgress: 3, unlocked: false },
  { id: 'b5', name: 'Week Warrior', description: 'Maintain a 7-day streak', icon: '🔥', progress: 0, maxProgress: 7, unlocked: false },
  { id: 'b6', name: 'Mystery Maven', description: 'Complete 3 mystery challenges', icon: '🔮', progress: 0, maxProgress: 3, unlocked: false },
  { id: 'b7', name: 'Memory Maker', description: 'Create 10 memories', icon: '📸', progress: 0, maxProgress: 10, unlocked: false },
  { id: 'b8', name: 'Social Butterfly', description: 'Share 5 public memories', icon: '🦋', progress: 0, maxProgress: 5, unlocked: false },
];

export const seedMemories: Memory[] = [
  { id: 'm1', userId: 'u1', spotId: 's1', mediaUrl: '', caption: 'Found this incredible mural of a phoenix rising!', visibility: 'public', createdAt: '2026-02-27T10:30:00Z', likes: 24, spotName: 'Hidden Mural Alley' },
  { id: 'm2', userId: 'u2', spotId: 's5', mediaUrl: '', caption: 'Golden hour hits different from up here', visibility: 'public', createdAt: '2026-02-26T18:15:00Z', likes: 42, spotName: 'Sunset Overlook' },
  { id: 'm3', userId: 'u3', spotId: 's6', mediaUrl: '', caption: 'Best dumplings I\'ve ever had. No debate.', visibility: 'public', createdAt: '2026-02-25T12:45:00Z', likes: 18, spotName: 'Grandmother\'s Dumpling House' },
];

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Filter } from 'lucide-react';
import { seedSpots } from '@/data/seedData';
import { NavigatorMode } from '@/types';
import BottomTabBar from '@/components/BottomTabBar';

const filters: { id: NavigatorMode | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'adventure', label: '🧭 Adventure' },
  { id: 'foodie', label: '🍜 Foodie' },
  { id: 'nature', label: '🌿 Nature' },
  { id: 'culture', label: '🎭 Culture' },
  { id: 'mystery', label: '🔮 Mystery' },
];

export default function ExplorePage() {
  const [activeFilter, setActiveFilter] = useState<NavigatorMode | 'all'>('all');
  const navigate = useNavigate();

  const spots = activeFilter === 'all' ? seedSpots : seedSpots.filter(s => s.modeTags.includes(activeFilter));

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Map placeholder */}
      <div className="h-64 bg-secondary/15 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 text-secondary">
            <MapPin size={32} />
            <span className="text-xs font-medium">Explore Map</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="px-5 pt-4 pb-2">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {filters.map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${activeFilter === f.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Spot list */}
      <div className="px-5 space-y-3">
        {spots.map(spot => (
          <button
            key={spot.id}
            onClick={() => navigate('/stop/' + spot.id)}
            className="w-full ios-card p-4 flex items-center gap-3 text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
              <MapPin className="text-primary" size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{spot.name}</p>
              <p className="text-[11px] text-muted-foreground">{spot.category}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{spot.shortDescription}</p>
            </div>
          </button>
        ))}
      </div>

      <BottomTabBar />
    </div>
  );
}

import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Clock, MapPin, Sparkles, Play, Settings, Bookmark } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { seedSpots } from '@/data/seedData';
import { Route } from '@/types';

export default function RoutePreviewPage() {
  const navigate = useNavigate();
  const { routeConfig, setCurrentRoute } = useApp();

  const route = useMemo<Route>(() => {
    const filtered = seedSpots.filter(s =>
      (routeConfig.mode ? s.modeTags.includes(routeConfig.mode) : true) &&
      s.travelTags.includes(routeConfig.travelType)
    );
    const stops = filtered.slice(0, routeConfig.stopCount);
    return {
      id: 'r_' + Date.now(),
      mode: routeConfig.mode || 'adventure',
      travelType: routeConfig.travelType,
      detourLevel: routeConfig.detourLevel,
      stopCount: stops.length,
      origin: 'Current Location',
      destination: routeConfig.destination || undefined,
      stops,
      estTime: 15 + stops.length * 8,
      estDetourTime: stops.length * 5,
      estPoints: stops.length * 25,
    };
  }, [routeConfig]);

  const handleStart = () => {
    setCurrentRoute(route);
    navigate('/active-nav');
  };

  return (
    <div className="min-h-screen bg-background pb-10">
      {/* Map placeholder */}
      <div className="relative h-56 bg-secondary/20">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 text-secondary">
            <MapPin size={32} />
            <span className="text-xs font-medium">Map Preview</span>
          </div>
        </div>
        <button onClick={() => navigate('/route-setup')} className="absolute top-12 left-4 w-9 h-9 rounded-full bg-card/90 backdrop-blur flex items-center justify-center shadow-ios">
          <ChevronLeft size={20} className="text-foreground" />
        </button>
      </div>

      {/* Route info */}
      <div className="px-5 -mt-6 relative z-10">
        <div className="ios-card p-5 shadow-ios-lg">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg capitalize font-display text-foreground">{route.mode} Route</span>
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-semibold uppercase">{route.detourLevel}</span>
          </div>

          <div className="flex gap-4 mb-4">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock size={14} /> {route.estTime} min
            </div>
            <div className="flex items-center gap-1.5 text-xs text-primary">
              <Sparkles size={14} /> +{route.estDetourTime} min detour
            </div>
            <div className="flex items-center gap-1.5 text-xs text-accent">
              <Sparkles size={14} /> ~{route.estPoints} pts
            </div>
          </div>

          {/* Stops */}
          <div className="space-y-3">
            {route.stops.map((stop, i) => (
              <motion.div
                key={stop.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => navigate('/stop/' + stop.id)}
                className="flex items-center gap-3 cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{stop.name}</p>
                  <p className="text-[11px] text-muted-foreground">{stop.category}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-5 mt-6 space-y-3">
        <button
          onClick={handleStart}
          className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-semibold text-base flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-ios-lg"
        >
          <Play size={18} /> Start Route
        </button>
        <div className="flex gap-3">
          <button onClick={() => navigate('/route-setup')} className="flex-1 py-3 rounded-2xl bg-muted text-foreground font-medium text-sm flex items-center justify-center gap-2">
            <Settings size={16} /> Customize
          </button>
          <button className="flex-1 py-3 rounded-2xl bg-muted text-foreground font-medium text-sm flex items-center justify-center gap-2">
            <Bookmark size={16} /> Save
          </button>
        </div>
      </div>
    </div>
  );
}

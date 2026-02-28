import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Search, MapPin, Footprints, Car } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { TravelType, DetourLevel } from '@/types';

export default function RouteSetupPage() {
  const navigate = useNavigate();
  const { routeConfig, setRouteConfig } = useApp();
  const [destination, setDestination] = useState(routeConfig.destination);
  const [exploreAroundMe, setExploreAroundMe] = useState(routeConfig.exploreAroundMe);
  const [travelType, setTravelType] = useState<TravelType>(routeConfig.travelType);
  const [detourLevel, setDetourLevel] = useState<DetourLevel>(routeConfig.detourLevel);
  const [stopCount, setStopCount] = useState(routeConfig.stopCount);

  const handlePreview = () => {
    setRouteConfig({ destination, exploreAroundMe, travelType, detourLevel, stopCount });
    navigate('/route-preview');
  };

  return (
    <div className="min-h-screen bg-background px-5 pt-14 pb-10 flex flex-col">
      <button onClick={() => navigate('/mode-select')} className="flex items-center gap-1 text-muted-foreground text-sm mb-6">
        <ChevronLeft size={18} /> Back
      </button>

      <h1 className="text-2xl font-display text-foreground mb-6">Set up your route</h1>

      {/* Destination */}
      <div className="mb-6">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Destination</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            value={destination}
            onChange={e => { setDestination(e.target.value); setExploreAroundMe(false); }}
            placeholder="Where to?"
            className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <button
          onClick={() => { setExploreAroundMe(!exploreAroundMe); setDestination(''); }}
          className={`mt-2 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-all ${exploreAroundMe ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}
        >
          <MapPin size={14} /> Explore around me
        </button>
      </div>

      {/* Travel type */}
      <div className="mb-6">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Travel Type</label>
        <div className="flex gap-3">
          {[{ type: 'walking' as TravelType, icon: Footprints, label: 'Walking' }, { type: 'driving' as TravelType, icon: Car, label: 'Driving' }].map(({ type, icon: Icon, label }) => (
            <button
              key={type}
              onClick={() => setTravelType(type)}
              className={`flex-1 ios-card p-3 flex items-center justify-center gap-2 transition-all ${travelType === type ? 'ring-2 ring-primary bg-primary/5' : ''}`}
            >
              <Icon size={18} className={travelType === type ? 'text-primary' : 'text-muted-foreground'} />
              <span className={`text-sm font-medium ${travelType === type ? 'text-primary' : 'text-foreground'}`}>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Detour level */}
      <div className="mb-6">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Detour Level</label>
        <div className="flex gap-2">
          {(['light', 'moderate', 'bold'] as DetourLevel[]).map(level => (
            <button
              key={level}
              onClick={() => setDetourLevel(level)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-medium capitalize transition-all ${detourLevel === level ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Stop count */}
      <div className="mb-8">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Stops: {stopCount}</label>
        <input
          type="range"
          min={1}
          max={5}
          value={stopCount}
          onChange={e => setStopCount(Number(e.target.value))}
          className="w-full accent-primary"
        />
        <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
          <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
        </div>
      </div>

      <button
        onClick={handlePreview}
        className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-semibold text-base active:scale-[0.98] transition-transform mt-auto"
      >
        Preview Route
      </button>
    </div>
  );
}

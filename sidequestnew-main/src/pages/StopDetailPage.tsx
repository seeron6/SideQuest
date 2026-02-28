import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, CheckCircle, Camera, MapPin } from 'lucide-react';
import { seedSpots } from '@/data/seedData';
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import MemoryCaptureSheet from '@/components/MemoryCaptureSheet';
import { useApp } from '@/context/AppContext';

export default function StopDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showMemory, setShowMemory] = useState(false);
  const { addPoints } = useApp();

  const spot = seedSpots.find(s => s.id === id);
  if (!spot) return <div className="p-10 text-center text-muted-foreground">Spot not found</div>;

  return (
    <div className="min-h-screen bg-background">
      {/* Image placeholder */}
      <div className="h-48 bg-secondary/15 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <MapPin className="text-secondary" size={32} />
        </div>
        <button onClick={() => navigate(-1)} className="absolute top-12 left-4 w-9 h-9 rounded-full bg-card/90 backdrop-blur flex items-center justify-center shadow-ios">
          <ChevronLeft size={20} className="text-foreground" />
        </button>
      </div>

      <div className="px-5 pt-5 pb-10">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">{spot.category}</span>
        <h1 className="text-2xl font-display text-foreground mt-1 mb-2">{spot.name}</h1>
        <p className="text-sm text-muted-foreground leading-relaxed mb-2">{spot.shortDescription}</p>

        <div className="flex flex-wrap gap-1.5 mb-6">
          {spot.modeTags.map(t => (
            <span key={t} className="px-2 py-0.5 rounded-full bg-muted text-[10px] font-medium text-muted-foreground capitalize">{t}</span>
          ))}
        </div>

        <div className="flex gap-3">
          <button onClick={() => { addPoints(25); }} className="flex-1 py-3 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
            <CheckCircle size={16} /> Check In
          </button>
          <button onClick={() => setShowMemory(true)} className="py-3 px-5 rounded-2xl bg-muted text-foreground font-medium text-sm flex items-center gap-2">
            <Camera size={16} /> Capture
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showMemory && (
          <MemoryCaptureSheet spotId={spot.id} spotName={spot.name} onClose={() => setShowMemory(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

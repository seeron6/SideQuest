import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { NavigatorMode } from '@/types';

const modes: { id: NavigatorMode; emoji: string; label: string; desc: string }[] = [
  { id: 'adventure', emoji: '🧭', label: 'Adventure', desc: 'Urban exploration, rooftops, hidden passages' },
  { id: 'foodie', emoji: '🍜', label: 'Foodie', desc: 'Cafés, street food, hole-in-the-wall gems' },
  { id: 'nature', emoji: '🌿', label: 'Nature', desc: 'Parks, trails, gardens, waterways' },
  { id: 'culture', emoji: '🎭', label: 'Culture', desc: 'Murals, galleries, historic landmarks' },
  { id: 'social', emoji: '🤝', label: 'Social', desc: 'Markets, community spaces, live music' },
  { id: 'mystery', emoji: '🔮', label: 'Mystery', desc: 'Random surprises, no spoilers' },
];

export default function ModeSelectPage() {
  const [selected, setSelected] = useState<NavigatorMode | null>(null);
  const navigate = useNavigate();
  const { setRouteConfig } = useApp();

  const handleContinue = () => {
    if (selected) {
      setRouteConfig({ mode: selected });
      navigate('/route-setup');
    }
  };

  return (
    <div className="min-h-screen bg-background px-5 pt-14 pb-10 flex flex-col">
      <button onClick={() => navigate('/home')} className="flex items-center gap-1 text-muted-foreground text-sm mb-6">
        <ChevronLeft size={18} /> Back
      </button>

      <h1 className="text-2xl font-display text-foreground mb-2">Choose your mode</h1>
      <p className="text-sm text-muted-foreground mb-8">How do you want to explore today?</p>

      <div className="grid grid-cols-2 gap-3 flex-1">
        {modes.map((mode, i) => (
          <motion.button
            key={mode.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => setSelected(mode.id)}
            className={`ios-card p-4 text-left relative transition-all ${selected === mode.id ? 'ring-2 ring-primary bg-primary/5' : ''}`}
          >
            {selected === mode.id && (
              <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                <Check className="text-primary-foreground" size={12} />
              </div>
            )}
            <span className="text-3xl">{mode.emoji}</span>
            <p className="font-semibold text-foreground text-sm mt-2">{mode.label}</p>
            <p className="text-[11px] text-muted-foreground mt-1 leading-snug">{mode.desc}</p>
          </motion.button>
        ))}
      </div>

      <button
        onClick={handleContinue}
        disabled={!selected}
        className={`w-full py-4 rounded-2xl font-semibold text-base flex items-center justify-center gap-2 mt-6 transition-all ${selected ? 'bg-primary text-primary-foreground active:scale-[0.98]' : 'bg-muted text-muted-foreground'}`}
      >
        Continue <ChevronRight size={18} />
      </button>
    </div>
  );
}

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MapPin, Lock, Globe } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import BottomTabBar from '@/components/BottomTabBar';

export default function VaultPage() {
  const [tab, setTab] = useState<'private' | 'public'>('private');
  const { memories } = useApp();

  const filtered = tab === 'private'
    ? memories.filter(m => m.visibility === 'private')
    : memories.filter(m => m.visibility === 'public');

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-5 pt-14 pb-4">
        <h1 className="text-2xl font-display text-foreground">Your Vault</h1>
      </div>

      {/* Toggle */}
      <div className="px-5 mb-4">
        <div className="flex bg-muted rounded-xl p-1">
          <button
            onClick={() => setTab('private')}
            className={`flex-1 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${tab === 'private' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'}`}
          >
            <Lock size={12} /> Private
          </button>
          <button
            onClick={() => setTab('public')}
            className={`flex-1 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${tab === 'public' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'}`}
          >
            <Globe size={12} /> Public
          </button>
        </div>
      </div>

      {/* Memories */}
      <div className="px-5 space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-sm">No memories yet</p>
            <p className="text-muted-foreground text-xs mt-1">Start a route to capture your first!</p>
          </div>
        )}
        {filtered.map((m, i) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="ios-card p-4"
          >
            <div className="w-full h-32 rounded-xl bg-muted mb-3 flex items-center justify-center">
              <MapPin className="text-muted-foreground" size={24} />
            </div>
            <p className="text-sm text-foreground">{m.caption}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-[11px] text-muted-foreground">📍 {m.spotName || 'Unknown'}</span>
              {tab === 'public' && (
                <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Heart size={10} /> {m.likes}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <BottomTabBar />
    </div>
  );
}

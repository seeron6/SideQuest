import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Camera, Globe, Lock } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Memory, Visibility } from '@/types';

interface Props {
  spotId: string;
  spotName: string;
  onClose: () => void;
}

export default function MemoryCaptureSheet({ spotId, spotName, onClose }: Props) {
  const [caption, setCaption] = useState('');
  const [visibility, setVisibility] = useState<Visibility>('private');
  const { addMemory, addPoints, user } = useApp();

  const handleSave = () => {
    const memory: Memory = {
      id: 'm_' + Date.now(),
      userId: user.id,
      spotId,
      mediaUrl: '',
      caption,
      visibility,
      createdAt: new Date().toISOString(),
      likes: 0,
      spotName,
    };
    addMemory(memory);
    if (visibility === 'public') addPoints(10);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-foreground/30 backdrop-blur-sm flex items-end"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={e => e.stopPropagation()}
        className="w-full ios-sheet p-6 safe-bottom"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg text-foreground">Capture Memory</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            <X size={16} className="text-muted-foreground" />
          </button>
        </div>

        <p className="text-xs text-muted-foreground mb-4">📍 {spotName}</p>

        {/* Photo upload placeholder */}
        <button className="w-full h-32 rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 mb-4">
          <Camera className="text-muted-foreground" size={24} />
          <span className="text-xs text-muted-foreground">Tap to add photo</span>
        </button>

        {/* Caption */}
        <textarea
          value={caption}
          onChange={e => setCaption(e.target.value)}
          placeholder="What did you discover?"
          className="w-full p-3 rounded-xl bg-muted border-none text-sm text-foreground placeholder:text-muted-foreground resize-none h-20 focus:outline-none focus:ring-2 focus:ring-primary/30"
        />

        {/* Visibility */}
        <div className="flex gap-3 mt-4 mb-6">
          <button
            onClick={() => setVisibility('private')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${visibility === 'private' ? 'bg-foreground/10 text-foreground' : 'bg-muted text-muted-foreground'}`}
          >
            <Lock size={12} /> Private Vault
          </button>
          <button
            onClick={() => setVisibility('public')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${visibility === 'public' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}
          >
            <Globe size={12} /> Public +10 pts
          </button>
        </div>

        <button
          onClick={handleSave}
          className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm active:scale-[0.98] transition-transform"
        >
          Save Memory
        </button>
      </motion.div>
    </motion.div>
  );
}

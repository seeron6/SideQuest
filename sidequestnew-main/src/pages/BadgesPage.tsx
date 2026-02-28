import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function BadgesPage() {
  const navigate = useNavigate();
  const { badges } = useApp();

  return (
    <div className="min-h-screen bg-background px-5 pt-14 pb-10">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-muted-foreground text-sm mb-6">
        <ChevronLeft size={18} /> Back
      </button>

      <h1 className="text-2xl font-display text-foreground mb-6">Badge Collection</h1>

      <div className="grid grid-cols-2 gap-3">
        {badges.map(badge => (
          <div key={badge.id} className={`ios-card p-4 text-center ${badge.unlocked ? '' : 'opacity-50'}`}>
            <span className="text-4xl block mb-2">{badge.icon}</span>
            <p className="text-sm font-semibold text-foreground">{badge.name}</p>
            <p className="text-[11px] text-muted-foreground mt-1">{badge.description}</p>
            <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${(badge.progress / badge.maxProgress) * 100}%` }}
              />
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">{badge.progress}/{badge.maxProgress}</p>
            {badge.onChainTx && (
              <span className="mt-2 inline-block px-2 py-0.5 rounded-full bg-accent/15 text-accent text-[9px] font-semibold">Verified on-chain</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

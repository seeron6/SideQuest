import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export default function LeaderboardsPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'weekly' | 'neighborhood' | 'alltime'>('weekly');

  const leaderboard = [
    { name: '@adventurer_sam', points: 320 },
    { name: '@urban_wanderer', points: 285 },
    { name: '@nature_nina', points: 240 },
    { name: '@culture_kai', points: 195 },
    { name: '@mystery_mo', points: 160 },
    { name: '@you', points: 0, isUser: true },
  ];

  return (
    <div className="min-h-screen bg-background px-5 pt-14 pb-10">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-muted-foreground text-sm mb-6">
        <ChevronLeft size={18} /> Back
      </button>

      <h1 className="text-2xl font-display text-foreground mb-4">Leaderboards</h1>

      <div className="flex bg-muted rounded-xl p-1 mb-6">
        {(['weekly', 'neighborhood', 'alltime'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-lg text-[11px] font-medium capitalize transition-all ${tab === t ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'}`}
          >
            {t === 'alltime' ? 'All-time' : t}
          </button>
        ))}
      </div>

      <div className="ios-card">
        {leaderboard.map((entry, i) => (
          <div key={entry.name} className={`flex items-center gap-3 p-4 ${i > 0 ? 'border-t border-border' : ''}`}>
            <span className={`text-sm font-bold w-6 text-center ${i < 3 ? 'text-accent' : 'text-muted-foreground'}`}>{i + 1}</span>
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-foreground">
              {entry.name[1].toUpperCase()}
            </div>
            <span className={`flex-1 text-sm ${entry.isUser ? 'text-primary font-semibold' : 'text-foreground'}`}>{entry.name}</span>
            <span className="text-xs text-muted-foreground">{entry.points} pts</span>
          </div>
        ))}
      </div>
    </div>
  );
}

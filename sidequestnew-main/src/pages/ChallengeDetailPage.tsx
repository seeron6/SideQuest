import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Play, Star } from 'lucide-react';
import { seedChallenges } from '@/data/seedData';

const difficultyColors: Record<string, string> = {
  easy: 'bg-secondary/15 text-secondary',
  medium: 'bg-accent/15 text-accent',
  hard: 'bg-primary/15 text-primary',
};

export default function ChallengeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const challenge = seedChallenges.find(c => c.id === id);

  if (!challenge) return <div className="p-10 text-center text-muted-foreground">Challenge not found</div>;

  return (
    <div className="min-h-screen bg-background px-5 pt-14 pb-10">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-muted-foreground text-sm mb-6">
        <ChevronLeft size={18} /> Back
      </button>

      <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold capitalize ${difficultyColors[challenge.difficulty]}`}>
        {challenge.difficulty}
      </span>

      <h1 className="text-2xl font-display text-foreground mt-3 mb-2">{challenge.title}</h1>
      <p className="text-sm text-muted-foreground leading-relaxed mb-6">{challenge.description}</p>

      <div className="ios-card p-4 mb-6">
        <div className="flex items-center gap-2">
          <Star className="text-accent" size={18} />
          <span className="text-sm font-semibold text-foreground">{challenge.rewardPoints} points</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Complete the challenge to earn rewards</p>
      </div>

      <button className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-semibold text-base flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
        <Play size={18} /> Start Challenge
      </button>
    </div>
  );
}

import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Target, Zap, Star } from 'lucide-react';
import { seedChallenges } from '@/data/seedData';
import BottomTabBar from '@/components/BottomTabBar';

const difficultyColors: Record<string, string> = {
  easy: 'bg-secondary/15 text-secondary',
  medium: 'bg-accent/15 text-accent',
  hard: 'bg-primary/15 text-primary',
};

export default function ChallengesPage() {
  const navigate = useNavigate();
  const active = seedChallenges.filter(c => c.active);
  const featured = active[0];

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-5 pt-14 pb-4">
        <h1 className="text-2xl font-display text-foreground">Challenges</h1>
        <p className="text-sm text-muted-foreground mt-1">Find hidden gems in your city</p>
      </div>

      {/* Featured */}
      {featured && (
        <div className="px-5 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => navigate('/challenge/' + featured.id)}
            className="ios-card p-5 shadow-ios-lg cursor-pointer relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="flex items-center gap-2 mb-2">
              <Zap className="text-accent" size={16} />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-accent">Featured</span>
            </div>
            <h3 className="text-lg font-display text-foreground mb-1">{featured.title}</h3>
            <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{featured.description}</p>
            <div className="flex items-center gap-3">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${difficultyColors[featured.difficulty]}`}>
                {featured.difficulty}
              </span>
              <span className="flex items-center gap-1 text-xs text-accent">
                <Star size={12} /> {featured.rewardPoints} pts
              </span>
            </div>
          </motion.div>
        </div>
      )}

      {/* Other challenges */}
      <div className="px-5">
        <h3 className="text-sm font-semibold text-foreground mb-3">Nearby</h3>
        <div className="space-y-3">
          {active.slice(1).map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => navigate('/challenge/' + c.id)}
              className="ios-card p-4 flex items-center gap-3 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Target className="text-primary" size={20} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{c.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold capitalize ${difficultyColors[c.difficulty]}`}>
                    {c.difficulty}
                  </span>
                  <span className="text-[11px] text-accent">{c.rewardPoints} pts</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <BottomTabBar />
    </div>
  );
}

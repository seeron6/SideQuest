import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass, Flame, Trophy, ChevronRight, MapPin, Target } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import BottomTabBar from '@/components/BottomTabBar';

export default function HomePage() {
  const { user } = useApp();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="px-5 pt-14 pb-4">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="text-muted-foreground text-sm">Good to see you,</p>
          <h1 className="text-2xl font-display text-foreground">{user.name}</h1>
        </motion.div>
      </div>

      {/* Stats row */}
      <div className="px-5 mb-6">
        <div className="flex gap-3">
          <div className="ios-card flex-1 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
              <Trophy className="text-accent" size={20} />
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">{user.points}</p>
              <p className="text-[11px] text-muted-foreground">Points</p>
            </div>
          </div>
          <div className="ios-card flex-1 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Flame className="text-primary" size={20} />
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">{user.streak}</p>
              <p className="text-[11px] text-muted-foreground">Day Streak</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main CTA */}
      <div className="px-5 mb-6">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/mode-select')}
          className="w-full ios-card p-5 flex items-center gap-4 shadow-ios-lg"
        >
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-ios">
            <Compass className="text-primary-foreground" size={28} />
          </div>
          <div className="flex-1 text-left">
            <p className="font-semibold text-foreground">Start a Route</p>
            <p className="text-xs text-muted-foreground mt-0.5">Choose a mode and explore</p>
          </div>
          <ChevronRight className="text-muted-foreground" size={20} />
        </motion.button>
      </div>

      {/* Quick actions */}
      <div className="px-5 mb-6">
        <div className="flex gap-3">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/challenges')}
            className="ios-card flex-1 p-4 flex flex-col items-center gap-2"
          >
            <Target className="text-secondary" size={24} />
            <span className="text-xs font-medium text-foreground">Find It</span>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/explore')}
            className="ios-card flex-1 p-4 flex flex-col items-center gap-2"
          >
            <MapPin className="text-primary" size={24} />
            <span className="text-xs font-medium text-foreground">Explore Nearby</span>
          </motion.button>
        </div>
      </div>

      {/* Trending section */}
      <div className="px-5 mb-6">
        <h3 className="text-sm font-semibold text-foreground mb-3">Trending near you</h3>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide">
          {['Hidden Mural Alley', 'Rooftop Garden Café', 'Sunset Overlook'].map((name, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="ios-card min-w-[160px] p-3 flex-shrink-0"
            >
              <div className="w-full h-20 rounded-xl bg-muted mb-2 flex items-center justify-center">
                <MapPin className="text-muted-foreground" size={20} />
              </div>
              <p className="text-xs font-medium text-foreground truncate">{name}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">📍 0.{i + 2} mi away</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Weekly leaderboard preview */}
      <div className="px-5">
        <h3 className="text-sm font-semibold text-foreground mb-3">Weekly Leaderboard</h3>
        <div className="ios-card p-4">
          {['@adventurer_sam', '@urban_wanderer', '@nature_nina'].map((name, i) => (
            <div key={name} className={`flex items-center gap-3 ${i > 0 ? 'mt-3 pt-3 border-t border-border' : ''}`}>
              <span className="text-sm font-semibold text-accent w-5">{i + 1}</span>
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs">
                {name[1].toUpperCase()}
              </div>
              <span className="flex-1 text-sm text-foreground">{name}</span>
              <span className="text-xs text-muted-foreground">{[320, 285, 240][i]} pts</span>
            </div>
          ))}
        </div>
      </div>

      <BottomTabBar />
    </div>
  );
}

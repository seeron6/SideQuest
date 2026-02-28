import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Flame, Map, Award, ChevronRight, Settings, BarChart3 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import BottomTabBar from '@/components/BottomTabBar';

export default function ProfilePage() {
  const { user, badges } = useApp();
  const navigate = useNavigate();
  const unlockedCount = badges.filter(b => b.unlocked).length;

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-5 pt-14 pb-6">
        {/* Avatar + Name */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-display text-primary">
            {user.name[0]}
          </div>
          <div>
            <h1 className="text-xl font-display text-foreground">{user.name}</h1>
            <p className="text-xs text-muted-foreground capitalize">{user.authProvider} account</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { icon: Trophy, value: user.points, label: 'Points', color: 'text-accent' },
            { icon: Flame, value: user.streak, label: 'Streak', color: 'text-primary' },
            { icon: Map, value: user.routesCompleted, label: 'Routes', color: 'text-secondary' },
          ].map(({ icon: Icon, value, label, color }) => (
            <div key={label} className="ios-card p-3 text-center">
              <Icon className={`mx-auto ${color}`} size={20} />
              <p className="text-lg font-semibold text-foreground mt-1">{value}</p>
              <p className="text-[10px] text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>

        {/* Badges preview */}
        <div className="ios-card p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-foreground">Badges</h3>
            <button onClick={() => navigate('/badges')} className="text-xs text-primary font-medium flex items-center gap-0.5">
              View all <ChevronRight size={14} />
            </button>
          </div>
          <div className="flex gap-3">
            {badges.slice(0, 4).map(b => (
              <div key={b.id} className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${b.unlocked ? 'bg-accent/15' : 'bg-muted opacity-40'}`}>
                {b.icon}
              </div>
            ))}
            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-xs text-muted-foreground font-semibold">
              +{Math.max(0, badges.length - 4)}
            </div>
          </div>
        </div>

        {/* Menu items */}
        <div className="space-y-2">
          {[
            { icon: BarChart3, label: 'Leaderboards', path: '/leaderboards' },
            { icon: Settings, label: 'Settings', path: '/settings' },
          ].map(({ icon: Icon, label, path }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="w-full ios-card p-4 flex items-center gap-3"
            >
              <Icon className="text-muted-foreground" size={18} />
              <span className="flex-1 text-sm text-foreground text-left">{label}</span>
              <ChevronRight className="text-muted-foreground" size={16} />
            </button>
          ))}
        </div>
      </div>

      <BottomTabBar />
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Map, Camera, Sparkles, ChevronRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { NavigatorMode } from '@/types';

const modeIcons: Record<string, string> = {
  adventure: '🧭', foodie: '🍜', nature: '🌿', culture: '🎭', social: '🤝', mystery: '🔮',
};

const pages = [
  {
    icon: <Map className="text-primary" size={40} />,
    title: 'Discovery routes, not fastest routes.',
    desc: 'SideQuest adds curated detours to your journey — hidden gems, scenic spots, and places you\'d never find on your own.',
  },
  {
    icon: <Compass className="text-primary" size={40} />,
    title: 'Pick a Navigator Mode.',
    desc: 'Choose how you want to explore. Each mode unlocks different types of stops and experiences.',
    hasModePicker: true,
  },
  {
    icon: <Camera className="text-primary" size={40} />,
    title: 'Save memories and earn points.',
    desc: 'Capture moments along the way. Keep them private in your Vault or share with the community to earn points and climb leaderboards.',
  },
  {
    icon: <Sparkles className="text-primary" size={40} />,
    title: 'Ready to explore?',
    desc: 'Sign in to save your progress across devices, or continue as a guest.',
    hasAuth: true,
  },
];

export default function OnboardingPage() {
  const [page, setPage] = useState(0);
  const [selectedMode, setSelectedMode] = useState<NavigatorMode | null>(null);
  const navigate = useNavigate();
  const { completeOnboarding, setRouteConfig, setUser } = useApp();

  const finish = (provider: 'apple' | 'google' | 'guest') => {
    if (selectedMode) setRouteConfig({ mode: selectedMode });
    setUser({ id: 'u_' + Math.random().toString(36).slice(2, 8), name: provider === 'guest' ? 'Explorer' : 'Traveler', authProvider: provider, points: 0, streak: 0, routesCompleted: 0, badgesUnlocked: [], savedRoutes: [] });
    completeOnboarding();
    navigate('/home');
  };

  const next = () => { if (page < pages.length - 1) setPage(page + 1); };

  const current = pages[page];

  return (
    <div className="min-h-screen flex flex-col bg-background px-6 pt-16 pb-10">
      {/* Progress dots */}
      <div className="flex gap-2 justify-center mb-12">
        {pages.map((_, i) => (
          <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === page ? 'w-8 bg-primary' : 'w-1.5 bg-border'}`} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3 }}
          className="flex-1 flex flex-col"
        >
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
            {current.icon}
          </div>

          <h2 className="text-2xl font-display mb-3 text-foreground">{current.title}</h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-8">{current.desc}</p>

          {current.hasModePicker && (
            <div className="grid grid-cols-3 gap-3 mb-8">
              {(Object.keys(modeIcons) as NavigatorMode[]).map(mode => (
                <button
                  key={mode}
                  onClick={() => setSelectedMode(mode)}
                  className={`ios-card p-3 flex flex-col items-center gap-1.5 transition-all ${selectedMode === mode ? 'ring-2 ring-primary bg-primary/5' : ''}`}
                >
                  <span className="text-2xl">{modeIcons[mode]}</span>
                  <span className="text-xs font-medium capitalize text-foreground">{mode}</span>
                </button>
              ))}
            </div>
          )}

          {current.hasAuth && (
            <div className="space-y-3 mb-8">
              <button onClick={() => finish('apple')} className="w-full py-3.5 rounded-2xl bg-foreground text-background font-semibold text-sm flex items-center justify-center gap-2">
                 Continue with Apple
              </button>
              <button onClick={() => finish('google')} className="w-full py-3.5 rounded-2xl bg-card border border-border font-semibold text-sm flex items-center justify-center gap-2 text-foreground">
                Continue with Google
              </button>
              <button onClick={() => finish('guest')} className="w-full py-3 text-muted-foreground text-sm font-medium">
                Continue as Guest
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {!current.hasAuth && (
        <button
          onClick={next}
          className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-semibold text-base flex items-center justify-center gap-2 active:scale-[0.98] transition-transform mt-auto"
        >
          Next <ChevronRight size={18} />
        </button>
      )}
    </div>
  );
}

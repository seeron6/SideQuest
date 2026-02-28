import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import sideQuestLogo from '@/assets/sidequest-logo.png';

export default function HeroPage() {
  const navigate = useNavigate();
  const { isOnboarded, dismissHero } = useApp();

  const handleStart = () => {
    dismissHero();
    navigate(isOnboarded ? '/home' : '/onboarding');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-background relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 right-8 w-24 h-24 rounded-full bg-primary/10 blur-2xl" />
      <div className="absolute bottom-32 left-6 w-32 h-32 rounded-full bg-secondary/15 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center text-center max-w-sm"
      >
        {/* Logo */}
        <motion.img
          src={sideQuestLogo}
          alt="SideQuest logo"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="w-32 h-32 rounded-2xl mb-6 shadow-ios-lg object-contain"
        />

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-3xl font-display mb-2 text-foreground"
        >
          SideQuest
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-2xl font-display italic text-primary leading-snug mt-4 mb-8"
        >
          "The most interesting way there."
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-muted-foreground text-sm mb-10 leading-relaxed"
        >
          Discovery-focused routes that turn every trip into an adventure worth remembering.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          onClick={handleStart}
          className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-semibold text-base shadow-ios-lg active:scale-[0.98] transition-transform"
        >
          Start a SideQuest
        </motion.button>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          onClick={() => { dismissHero(); navigate('/explore'); }}
          className="mt-4 flex items-center gap-1.5 text-secondary text-sm font-medium"
        >
          <MapPin size={14} />
          Explore nearby
        </motion.button>
      </motion.div>
    </div>
  );
}

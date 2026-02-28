import { motion } from 'framer-motion';
import { Trophy, Flame, Star } from 'lucide-react';

interface Props {
  pointsEarned: number;
  stopsVisited: number;
  totalStops: number;
  onDone: () => void;
}

export default function RouteCompletionSheet({ pointsEarned, stopsVisited, totalStops, onDone }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-foreground/30 backdrop-blur-sm flex items-end"
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="w-full ios-sheet p-6 safe-bottom text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4"
        >
          <Star className="text-accent" size={32} />
        </motion.div>

        <h3 className="font-display text-2xl text-foreground mb-2">Quest Complete!</h3>
        <p className="text-sm text-muted-foreground mb-6">You visited {stopsVisited} of {totalStops} stops</p>

        <div className="flex gap-4 justify-center mb-6">
          <div className="flex items-center gap-2">
            <Trophy className="text-accent" size={18} />
            <span className="text-sm font-semibold text-foreground">{pointsEarned} pts</span>
          </div>
          <div className="flex items-center gap-2">
            <Flame className="text-primary" size={18} />
            <span className="text-sm font-semibold text-foreground">+1 streak</span>
          </div>
        </div>

        <button
          onClick={onDone}
          className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm active:scale-[0.98] transition-transform"
        >
          Back to Home
        </button>
      </motion.div>
    </motion.div>
  );
}

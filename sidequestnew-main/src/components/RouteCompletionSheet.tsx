import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface Props {
  pointsEarned: number;
  stopsVisited: number;
  totalStops: number;
  onDone: () => void;
}

export default function RouteCompletionSheet({ pointsEarned, stopsVisited, totalStops, onDone }: Props) {
  const { user } = useApp();
  const [minting, setMinting] = useState(false);
  const [minted, setMinted] = useState(false);
  const [error, setError] = useState('');

  const handleClaim = async () => {
    setMinting(true);
    setError('');

    try {
      // Mocking wallet address for demo purposes if not connected
      const addressToMint = user.walletAddress || "F7H5w7Zq1QcXxX9uGv8JbX1D5E9zFwq7x";

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/rewards/mint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: addressToMint,
          points: pointsEarned,
          metadataUri: 'https://arweave.net/12345_mock_uri_representing_route_completion'
        })
      });

      if (!res.ok) throw new Error('Failed to mint reward');

      const data = await res.json();
      console.log("Mint success:", data);

      setMinted(true);
      setTimeout(onDone, 2000); // Auto close after showing success
    } catch (err) {
      console.error(err);
      setError('Minting failed. Points added locally.');
      setTimeout(onDone, 2000);
    } finally {
      setMinting(false);
    }
  };

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
        className="w-full ios-sheet p-8 safe-bottom flex flex-col items-center text-center"
      >
        <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-6">
          <Trophy size={32} className="text-accent" />
        </div>

        <h2 className="text-2xl font-display text-foreground mb-2">Route Complete!</h2>
        <p className="text-sm text-muted-foreground mb-8">
          You visited {stopsVisited} of {totalStops} stops and unlocked a new achievement.
        </p>

        <div className="ios-card w-full p-4 mb-8 bg-secondary/5 border border-secondary/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
              <Star size={20} className="text-secondary" />
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Earned</p>
              <p className="text-lg font-display text-foreground">+{pointsEarned} XP</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Streak</p>
            <p className="text-lg font-display text-accent">{user.streak + 1} 🔥</p>
          </div>
        </div>

        {error && <p className="text-red-500 text-xs mb-4">{error}</p>}

        <button
          onClick={minted ? onDone : handleClaim}
          disabled={minting || minted}
          className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-semibold text-base flex flex-col items-center justify-center gap-1 active:scale-[0.98] transition-transform shadow-ios-lg relative overflow-hidden"
        >
          {minting ? (
            <div className="flex items-center gap-2">
              <Loader2 size={18} className="animate-spin" /> Minting on Solana...
            </div>
          ) : minted ? (
            <div className="flex items-center gap-2">
              <CheckCircle size={18} /> Verified on Chain!
            </div>
          ) : (
            <div className="flex items-center gap-2">
              Claim On-Chain Reward <ArrowRight size={18} />
            </div>
          )}
        </button>
      </motion.div>
    </motion.div>
  );
}

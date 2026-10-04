import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart } from 'lucide-react';
import { playYesCelebrationSound } from '../utils/sound';

interface CelebrationOverlayProps {
  show: boolean;
  title?: string;
  subtitle?: string;
  note?: string;
  onFinish?: () => void;
  durationMs?: number;
}

export const CelebrationOverlay: React.FC<CelebrationOverlayProps> = ({
  show,
  title = "YAAAAAY! 💗🌷",
  subtitle = "I knew you'd say yes, Tasneem 😌",
  note = "Okay... now we have a date to plan ✨",
  onFinish,
  durationMs = 2600,
}) => {
  useEffect(() => {
    if (!show) return;

    playYesCelebrationSound();

    // Fire romantic confetti burst (Rose pinks, peachy gold, cream white)
    const count = 200;
    const defaults = {
      origin: { y: 0.65 },
      colors: ['#fb7185', '#f43f5e', '#fda4af', '#f472b6', '#fbcfe8', '#fed7aa', '#ffffff'],
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });
    fire(0.2, {
      spread: 60,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.9,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });

    const timer = setTimeout(() => {
      if (onFinish) onFinish();
    }, durationMs);

    return () => clearTimeout(timer);
  }, [show, durationMs, onFinish]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-rose-950/30 backdrop-blur-md px-4"
        >
          <motion.div
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 18, stiffness: 220 }}
            className="w-full max-w-md bg-white/90 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl border border-white/80 text-center relative overflow-hidden"
          >
            {/* Sparkle decorative background elements */}
            <div className="absolute top-4 left-6 text-rose-300">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div className="absolute top-6 right-6 text-pink-400">
              <Heart className="w-6 h-6 fill-pink-400 animate-bounce" />
            </div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring' }}
              className="w-20 h-20 mx-auto mb-4 bg-gradient-to-tr from-rose-400 to-pink-500 rounded-full flex items-center justify-center text-4xl shadow-lg shadow-rose-300/60"
            >
              💖
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-extrabold text-rose-900 mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {title}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="text-lg text-rose-700 font-semibold mb-2"
            >
              {subtitle}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-sm text-rose-500 font-medium tracking-wide flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              {note}
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

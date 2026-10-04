import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Heart, Sparkles, Frown } from 'lucide-react';
import { playComedicNoSound, playDodgeSound } from '../utils/sound';
import { NO_BUTTON_PHRASES, HER_NAME } from '../config';

interface ScreenInvitationProps {
  onAccept: () => void;
}

export const ScreenInvitation: React.FC<ScreenInvitationProps> = ({ onAccept }) => {
  const [revealed, setRevealed] = useState(false);
  const [noButtonText, setNoButtonText] = useState("No 😒");
  const [dodgeCount, setDodgeCount] = useState(0);
  const [noPosition, setNoPosition] = useState<{ x: number; y: number } | null>(null);
  const [showEasterEggNotice, setShowEasterEggNotice] = useState(false);
  const [surrendered, setSurrendered] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const yesButtonRef = useRef<HTMLButtonElement | null>(null);
  const noButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), 600);
    return () => clearTimeout(timer);
  }, []);

  const moveNoButton = useCallback(() => {
    if (surrendered) return;

    playComedicNoSound();
    playDodgeSound();

    const newCount = dodgeCount + 1;
    setDodgeCount(newCount);

    if (newCount >= 7) {
      setShowEasterEggNotice(true);
    }
    if (newCount >= 10) {
      setSurrendered(true);
    }

    // Pick a funny new phrase
    const nextPhrase = NO_BUTTON_PHRASES[(newCount - 1) % NO_BUTTON_PHRASES.length];
    setNoButtonText(nextPhrase);

    // Compute safe coordinates inside window / container boundaries without overlapping YES button
    const winWidth = window.innerWidth;
    const winHeight = window.innerHeight;

    // Dimensions of the no button (estimated 150x55)
    const btnW = 150;
    const btnH = 55;
    const padding = 24;

    // Get YES button position if available
    let yesRect = { left: winWidth / 2 - 120, top: winHeight / 2 - 30, right: winWidth / 2 + 120, bottom: winHeight / 2 + 30 };
    if (yesButtonRef.current) {
      yesRect = yesButtonRef.current.getBoundingClientRect();
    }

    let attempts = 0;
    let newX = 0;
    let newY = 0;
    let isColliding = true;

    while (isColliding && attempts < 25) {
      attempts++;
      // Random coordinates within visible screen
      newX = padding + Math.random() * (winWidth - btnW - padding * 2);
      // Keep within reachable vertical zone (top 15% to bottom 85%)
      newY = padding + 70 + Math.random() * (winHeight - btnH - padding * 2 - 120);

      // Check collision with YES button (with 40px safe buffer)
      const safeBuffer = 50;
      const overlapsX = newX < yesRect.right + safeBuffer && newX + btnW > yesRect.left - safeBuffer;
      const overlapsY = newY < yesRect.bottom + safeBuffer && newY + btnH > yesRect.top - safeBuffer;

      if (!overlapsX || !overlapsY) {
        isColliding = false;
      }
    }

    setNoPosition({ x: newX, y: newY });
  }, [dodgeCount, surrendered]);

  return (
    <div
      ref={containerRef}
      className="relative z-10 w-full max-w-lg mx-auto px-4 py-6 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] text-center"
    >
      {/* Main Glassmorphism Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full bg-white/70 backdrop-blur-2xl rounded-3xl p-6 sm:p-10 shadow-[0_20px_60px_rgba(244,114,182,0.22)] border border-white/80 relative overflow-hidden"
      >
        {/* Soft decorative glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-rose-300/30 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-pink-300/30 rounded-full blur-2xl pointer-events-none" />

        {/* Intro Greeting */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100/70 text-rose-800 text-sm font-semibold mb-6 shadow-xs border border-rose-200/50"
        >
          <span>🌷</span>
          <span>{HER_NAME}... عندي سؤال مهم جدًا</span>
        </motion.div>

        {/* Main Invitation Question */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={revealed ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-8"
        >
          <h1
            className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-rose-950 leading-tight mb-3"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Will you go on a romantic date with me? 💗
          </h1>
          <p className="text-base sm:text-lg text-rose-800 font-medium tracking-wide">
            تحبي نخرج سوا في Date؟ 🌸
          </p>
        </motion.div>

        {/* Easter Egg / Attempt Notice */}
        {showEasterEggNotice && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 text-xs font-semibold text-rose-600 bg-rose-50/80 border border-rose-200 py-1.5 px-3 rounded-full inline-block"
          >
            You're really trying hard to say no 😂 ({dodgeCount} attempts)
          </motion.div>
        )}

        {/* Surrender Mode Notice if she tried 10+ times */}
        {surrendered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-5 p-3 rounded-2xl bg-rose-100/80 border border-rose-300 text-xs text-rose-900"
          >
            <p className="font-bold mb-1">خلاص صعبتي عليا! بس مفيش No بجد 🥺</p>
            <p>الزرار استسلم، بس الموعد مستنيكي 💗</p>
          </motion.div>
        )}

        {/* Buttons Container */}
        <div className="relative flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pt-2 pb-4">
          {/* YES Button: Fixed, Glowing, Beautiful */}
          <motion.button
            ref={yesButtonRef}
            onClick={onAccept}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="w-full sm:w-auto min-w-[210px] min-h-[52px] px-8 py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-base sm:text-lg shadow-lg shadow-rose-400/40 hover:shadow-rose-400/60 transition-all flex items-center justify-center gap-2.5 cursor-pointer relative overflow-hidden group"
            aria-label="Accept date invitation: Yes, I would love to"
          >
            <Heart className="w-5 h-5 fill-white group-hover:scale-125 transition-transform" />
            <span>Yes, I'd love to 💗</span>
            <Sparkles className="w-4 h-4 text-amber-200 animate-spin" style={{ animationDuration: '6s' }} />
          </motion.button>

          {/* NO Button: Evasive & Playful */}
          {!noPosition ? (
            <motion.button
              ref={noButtonRef}
              onMouseEnter={moveNoButton}
              onTouchStart={moveNoButton}
              onClick={moveNoButton}
              className="w-full sm:w-auto min-w-[150px] min-h-[52px] px-6 py-3.5 rounded-2xl bg-white/70 hover:bg-white text-slate-700 hover:text-slate-900 font-semibold text-base border border-slate-200/80 shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
              aria-label="No option"
            >
              <Frown className="w-4 h-4 text-slate-400" />
              <span>{noButtonText}</span>
            </motion.button>
          ) : (
            <div className="w-full sm:w-auto sm:min-w-[150px] h-[52px]" aria-hidden="true" />
          )}
        </div>
      </motion.div>

      {/* Floating Evasive NO Button when displaced */}
      {noPosition && (
        <motion.button
          ref={noButtonRef}
          onMouseEnter={moveNoButton}
          onTouchStart={moveNoButton}
          onClick={moveNoButton}
          initial={false}
          animate={{
            x: noPosition.x,
            y: noPosition.y,
            transition: { type: 'spring', damping: 14, stiffness: 260 },
          }}
          style={{ position: 'fixed', left: 0, top: 0, zIndex: 40 }}
          className="px-6 py-3 rounded-2xl bg-white/95 text-rose-950 font-bold text-sm shadow-xl shadow-rose-400/30 border-2 border-rose-300 flex items-center gap-2 cursor-pointer active:scale-90"
          aria-label={`Evasive No button with text: ${noButtonText}`}
        >
          <Frown className="w-4 h-4 text-rose-400" />
          <span>{noButtonText}</span>
        </motion.button>
      )}

      {/* Sweet romantic subtext */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-6 text-xs text-rose-700/80 font-medium tracking-wide flex items-center gap-1.5"
      >
        <span>✨</span>
        <span>A special invitation created just for Tasneem</span>
        <span>✨</span>
      </motion.p>
    </div>
  );
};

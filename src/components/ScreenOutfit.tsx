import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, Check, HelpCircle } from 'lucide-react';
import { playComedicNoSound, playDodgeSound } from '../utils/sound';
import { CASUAL_BUTTON_PHRASES } from '../config';

interface ScreenOutfitProps {
  onSelectOutfit: (outfit: 'Modest' | 'Casual') => void;
}

export const ScreenOutfit: React.FC<ScreenOutfitProps> = ({ onSelectOutfit }) => {
  const [casualAttempts, setCasualAttempts] = useState(0);
  const [casualNotice, setCasualNotice] = useState<string | null>(null);
  const [casualOffset, setCasualOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [casualUnlocked, setCasualUnlocked] = useState(false);

  const casualCardRef = useRef<HTMLDivElement | null>(null);

  const handleCasualDodge = useCallback(
    (e?: React.SyntheticEvent) => {
      if (casualUnlocked) {
        // Unlocked! Allow normal selection
        return;
      }

      if (e) {
        e.preventDefault();
      }

      playComedicNoSound();
      playDodgeSound();

      const newCount = casualAttempts + 1;
      setCasualAttempts(newCount);

      const phrase = CASUAL_BUTTON_PHRASES[(newCount - 1) % CASUAL_BUTTON_PHRASES.length];
      setCasualNotice(phrase);

      if (newCount >= 6) {
        setCasualUnlocked(true);
        setCasualNotice("Okay okay! You really want Casual! Unlocked 👟😂");
        setCasualOffset({ x: 0, y: 0 });
        return;
      }

      // Calculate a playful safe offset within container range
      const randomX = (Math.random() - 0.5) * (window.innerWidth < 640 ? 120 : 200);
      const randomY = (Math.random() - 0.5) * 90;
      setCasualOffset({ x: randomX, y: randomY });
    },
    [casualAttempts, casualUnlocked]
  );

  return (
    <div className="relative z-10 w-full max-w-2xl mx-auto px-4 py-6 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] text-center">
      {/* Title & Question */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-100/80 text-rose-800 text-xs font-semibold uppercase tracking-wider mb-3 border border-rose-200/60 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          First important decision 👗
        </span>
        <h1
          className="text-3xl sm:text-4xl font-extrabold text-rose-950 mb-2"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          What are we wearing?
        </h1>
        <p className="text-rose-700/90 text-sm sm:text-base font-medium">
          اختر الستايل الأنسب لخروجتنا سوا 🌸
        </p>
      </motion.div>

      {/* Cards Grid */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 relative items-start">
        {/* CARD 1: 🌷 Modest (The Star Choice) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          whileHover={{ y: -6, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectOutfit('Modest')}
          role="button"
          tabIndex={0}
          aria-label="Select Modest outfit: Elegant, classy and beautiful"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onSelectOutfit('Modest');
            }
          }}
          className="group relative bg-white/80 backdrop-blur-xl rounded-3xl p-6 sm:p-7 border-2 border-rose-300 hover:border-rose-400 shadow-xl shadow-rose-200/40 hover:shadow-2xl hover:shadow-rose-300/60 transition-all cursor-pointer text-left overflow-hidden flex flex-col justify-between min-h-[260px]"
        >
          {/* Subtle Ambient Gradient Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-rose-100/40 via-transparent to-pink-100/40 opacity-70 group-hover:opacity-100 transition-opacity" />

          {/* Top Badge */}
          <div className="relative z-10 flex items-center justify-between mb-4">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-500 text-white text-[11px] font-bold shadow-xs">
              <Heart className="w-3 h-3 fill-white" />
              Perfect Choice
            </span>
            <span className="text-3xl filter drop-shadow-sm group-hover:scale-125 transition-transform duration-300">
              🌷
            </span>
          </div>

          {/* Card Content */}
          <div className="relative z-10 my-auto">
            <h2
              className="text-2xl font-bold text-rose-950 mb-1.5 flex items-center gap-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Modest
            </h2>
            <p className="text-rose-700 font-medium text-sm leading-relaxed mb-3">
              "Elegant, classy & beautiful"
            </p>
            <p className="text-xs text-rose-800/80">
              ستايل راقي، شيك، ومميز يليق بجمالك يا تسنيم 👑
            </p>
          </div>

          {/* Action Footer */}
          <div className="relative z-10 mt-4 pt-3 border-t border-rose-100 flex items-center justify-between text-xs font-semibold text-rose-600 group-hover:text-rose-700">
            <span>Select this look</span>
            <div className="w-7 h-7 rounded-full bg-rose-500 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
              <Check className="w-4 h-4" />
            </div>
          </div>
        </motion.div>

        {/* CARD 2: 👟 Casual (Playfully Evasive) */}
        <motion.div
          ref={casualCardRef}
          initial={{ opacity: 0, x: 20 }}
          animate={{
            opacity: 1,
            x: casualOffset.x,
            y: casualOffset.y,
            transition: { type: 'spring', damping: 14, stiffness: 220 },
          }}
          onMouseEnter={!casualUnlocked ? handleCasualDodge : undefined}
          onTouchStart={!casualUnlocked ? handleCasualDodge : undefined}
          onClick={
            casualUnlocked
              ? () => onSelectOutfit('Casual')
              : handleCasualDodge
          }
          role="button"
          tabIndex={0}
          aria-label={
            casualUnlocked
              ? 'Select Casual outfit: Simple, comfy and chill'
              : 'Casual outfit option: Simple, comfy and chill'
          }
          className={`relative bg-white/70 backdrop-blur-xl rounded-3xl p-6 sm:p-7 border border-white/80 shadow-md hover:shadow-lg transition-all text-left flex flex-col justify-between min-h-[260px] cursor-pointer ${
            casualUnlocked
              ? 'border-amber-300 bg-amber-50/50 hover:border-amber-400'
              : 'hover:bg-white/85'
          }`}
        >
          {/* Top Badge */}
          <div className="relative z-10 flex items-center justify-between mb-4">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-medium">
              {casualUnlocked ? '🔓 Unlocked' : 'Casual Mood'}
            </span>
            <span className="text-3xl filter drop-shadow-sm">👟</span>
          </div>

          {/* Card Content */}
          <div className="relative z-10 my-auto">
            <h2
              className="text-2xl font-bold text-slate-800 mb-1.5"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Casual
            </h2>
            <p className="text-slate-600 font-medium text-sm leading-relaxed mb-3">
              "Simple, comfy & chill"
            </p>
            <p className="text-xs text-slate-500">
              {casualUnlocked
                ? 'أهو شفتي إصرارك كسب! بس برضو الموديست في القلب 😉'
                : 'كاجوال وسريع.. بس جربي كدة تضغطي عليه 👀'}
            </p>
          </div>

          {/* Action Footer */}
          <div className="relative z-10 mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>{casualUnlocked ? 'Select Casual' : 'Try to catch me'}</span>
            <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center shadow-xs">
              <HelpCircle className="w-4 h-4" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Playful Notice when dodging Casual */}
      <AnimatePresence>
        {casualNotice && (
          <motion.div
            key={casualNotice}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.25 }}
            className="mt-6 px-4 py-2.5 rounded-full bg-white/90 backdrop-blur-md border border-rose-300 text-rose-900 font-semibold text-xs sm:text-sm shadow-md flex items-center gap-2"
          >
            <span>✨</span>
            <span>{casualNotice}</span>
            {casualAttempts > 0 && !casualUnlocked && (
              <span className="text-rose-400 text-xs font-mono">({casualAttempts}/6)</span>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <p className="mt-8 text-xs text-rose-700/70 font-medium">
        Tip: 🌷 Modest is always the sweetest choice
      </p>
    </div>
  );
};

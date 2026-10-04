import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Heart, Sparkles } from 'lucide-react';
import { getMuted, setMuted, playSparkleSound } from '../utils/sound';

interface HeaderBarProps {
  currentStep: number; // 1: Invitation, 2: Outfit, 3: Date, 4: Done
  onHeartClick?: (e: React.MouseEvent) => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({ currentStep, onHeartClick }) => {
  const [muted, setMutedState] = useState<boolean>(false);
  const [easterEggHearts, setEasterEggHearts] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    setMutedState(getMuted());
  }, []);

  const toggleSound = () => {
    const next = !muted;
    setMutedState(next);
    setMuted(next);
  };

  const handleHeaderHeartClick = (e: React.MouseEvent) => {
    playSparkleSound();
    const rect = e.currentTarget.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;

    const newHearts = Array.from({ length: 8 }).map((_, i) => ({
      id: Date.now() + i,
      x: startX + (Math.random() - 0.5) * 60,
      y: startY + (Math.random() - 0.5) * 40,
    }));

    setEasterEggHearts((prev) => [...prev, ...newHearts]);

    setTimeout(() => {
      setEasterEggHearts((prev) => prev.filter((h) => !newHearts.some((nh) => nh.id === h.id)));
    }, 1200);

    if (onHeartClick) onHeartClick(e);
  };

  const steps = [
    { num: 1, label: 'Invitation', ar: 'الدعوة' },
    { num: 2, label: 'Outfit', ar: 'الستايل' },
    { num: 3, label: 'Date', ar: 'الموعد' },
    { num: 4, label: 'Done', ar: 'تم 💗' },
  ];

  return (
    <>
      <header className="relative z-30 w-full max-w-xl mx-auto px-4 pt-3 pb-2 flex items-center justify-between">
        {/* Brand with Easter Egg Click */}
        <button
          onClick={handleHeaderHeartClick}
          className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/50 backdrop-blur-md border border-white/60 hover:bg-white/80 active:scale-95 transition-all text-rose-900 shadow-sm"
          title="Click me for a surprise! 💗"
          aria-label="A Date with Tasneem brand icon"
        >
          <span className="relative flex items-center justify-center">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500 group-hover:scale-125 transition-transform" />
            <Sparkles className="w-2.5 h-2.5 text-amber-400 absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity" />
          </span>
          <span className="text-xs font-semibold tracking-wide text-rose-800" style={{ fontFamily: "'Playfair Display', serif" }}>
            Tasneem's Date
          </span>
        </button>

        {/* Minimal Progress Indicator */}
        <nav aria-label="Progress" className="flex items-center gap-1.5 bg-white/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/50 shadow-sm">
          {steps.map((step, idx) => {
            const isActive = currentStep === step.num;
            const isCompleted = currentStep > step.num;

            return (
              <React.Fragment key={step.num}>
                <div
                  className={`flex items-center gap-1 text-[11px] font-medium transition-all ${
                    isActive
                      ? 'text-rose-700 font-bold scale-105'
                      : isCompleted
                      ? 'text-rose-400'
                      : 'text-slate-400 opacity-60'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] transition-colors ${
                      isActive
                        ? 'bg-rose-500 text-white shadow-xs'
                        : isCompleted
                        ? 'bg-rose-200 text-rose-700'
                        : 'bg-white/60 text-slate-400'
                    }`}
                  >
                    {isCompleted ? '✓' : step.num}
                  </span>
                  <span className="hidden sm:inline">{step.label}</span>
                </div>
                {idx < steps.length - 1 && (
                  <span className="text-rose-200 text-xs">→</span>
                )}
              </React.Fragment>
            );
          })}
        </nav>

        {/* Sound Toggle */}
        <button
          onClick={toggleSound}
          className="w-8 h-8 rounded-full bg-white/50 backdrop-blur-md border border-white/60 hover:bg-white/80 active:scale-90 transition-all flex items-center justify-center text-rose-800 shadow-sm"
          title={muted ? 'Unmute sounds 🔊' : 'Mute sounds 🔇'}
          aria-label={muted ? 'Unmute sounds' : 'Mute sounds'}
        >
          {muted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-rose-600" />}
        </button>
      </header>

      {/* Floating Easter Egg Burst Hearts */}
      {easterEggHearts.map((h) => (
        <div
          key={h.id}
          className="fixed pointer-events-none z-50 animate-ping text-rose-500 text-lg"
          style={{ left: h.x, top: h.y }}
        >
          💗
        </div>
      ))}
    </>
  );
};

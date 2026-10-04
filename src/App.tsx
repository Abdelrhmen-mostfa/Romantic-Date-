import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { PetalBackground } from './components/PetalBackground';
import { HeaderBar } from './components/HeaderBar';
import { ScreenInvitation } from './components/ScreenInvitation';
import { ScreenOutfit } from './components/ScreenOutfit';
import { ScreenPlanDate } from './components/ScreenPlanDate';
import { ScreenCelebration } from './components/ScreenCelebration';
import { CelebrationOverlay } from './components/CelebrationOverlay';

export default function App() {
  const [currentStep, setCurrentStep] = useState<number>(() => {
    try {
      const savedStep = localStorage.getItem('tasneem_date_step');
      if (savedStep) {
        const parsed = parseInt(savedStep, 10);
        if (parsed >= 1 && parsed <= 4) return parsed;
      }
    } catch {}
    return 1;
  });

  const [outfit, setOutfit] = useState<'Modest' | 'Casual'>(() => {
    try {
      const saved = localStorage.getItem('tasneem_date_outfit');
      if (saved === 'Modest' || saved === 'Casual') return saved;
    } catch {}
    return 'Modest';
  });

  const [date, setDate] = useState<string>(() => {
    try {
      return localStorage.getItem('tasneem_date_date') || '';
    } catch {
      return '';
    }
  });

  const [time, setTime] = useState<string>(() => {
    try {
      return localStorage.getItem('tasneem_date_time') || '';
    } catch {
      return '';
    }
  });

  const [message, setMessage] = useState<string>(() => {
    try {
      return localStorage.getItem('tasneem_date_message') || '';
    } catch {
      return '';
    }
  });

  const [showCelebrationModal, setShowCelebrationModal] = useState(false);
  const [celebrationDetails, setCelebrationDetails] = useState({
    title: "YAAAAAY! 💗🌷",
    subtitle: "I knew you'd say yes, Tasneem 😌",
    note: "Okay... now we have a date to plan ✨",
    nextStep: 2,
  });

  // Save current step
  const updateStep = (step: number) => {
    setCurrentStep(step);
    try {
      localStorage.setItem('tasneem_date_step', step.toString());
    } catch {}
  };

  // Screen 1: Accept
  const handleAcceptInvitation = () => {
    setCelebrationDetails({
      title: "YAAAAAY! 💗🌷",
      subtitle: "I knew you'd say yes, Tasneem 😌",
      note: "Okay... now we have a date to plan ✨",
      nextStep: 2,
    });
    setShowCelebrationModal(true);
  };

  // Screen 2: Choose outfit
  const handleSelectOutfit = (selected: 'Modest' | 'Casual') => {
    setOutfit(selected);
    try {
      localStorage.setItem('tasneem_date_outfit', selected);
    } catch {}
    updateStep(3);
  };

  // Screen 3: Date, time, message submit
  const handleDatePlanSubmit = (newDate: string, newTime: string, newMessage: string) => {
    setDate(newDate);
    setTime(newTime);
    setMessage(newMessage);
    try {
      localStorage.setItem('tasneem_date_date', newDate);
      localStorage.setItem('tasneem_date_time', newTime);
      localStorage.setItem('tasneem_date_message', newMessage);
    } catch {}

    setCelebrationDetails({
      title: "It's officially a date! 💗",
      subtitle: "See you soon, Tasneem 🌷",
      note: "Generating our romantic date ticket ✨",
      nextStep: 4,
    });
    setShowCelebrationModal(true);
  };

  const handleCelebrationFinished = () => {
    setShowCelebrationModal(false);
    updateStep(celebrationDetails.nextStep);
  };

  // Reset / Replay
  const handleReset = () => {
    try {
      localStorage.removeItem('tasneem_date_step');
    } catch {}
    setCurrentStep(1);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col font-sans select-none overflow-x-hidden">
      {/* Falling Rose Petals & Sunset Canvas Background */}
      <PetalBackground />

      {/* Top Header & Progress */}
      <HeaderBar currentStep={currentStep} />

      {/* Main Viewport Content with Smooth Page Transitions */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center w-full px-2 sm:px-4">
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              <ScreenInvitation onAccept={handleAcceptInvitation} />
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              <ScreenOutfit onSelectOutfit={handleSelectOutfit} />
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              <ScreenPlanDate
                selectedOutfit={outfit}
                initialDate={date}
                initialTime={time}
                initialMessage={message}
                onSubmit={handleDatePlanSubmit}
                onBack={() => updateStep(2)}
              />
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              <ScreenCelebration
                date={date || new Date().toISOString().split('T')[0]}
                time={time || '19:00'}
                outfit={outfit}
                message={message || 'مستنياك 💗'}
                onEdit={() => updateStep(3)}
                onReset={handleReset}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Celebration Modal / Confetti Animation */}
      <CelebrationOverlay
        show={showCelebrationModal}
        title={celebrationDetails.title}
        subtitle={celebrationDetails.subtitle}
        note={celebrationDetails.note}
        onFinish={handleCelebrationFinished}
        durationMs={2300}
      />
    </div>
  );
}

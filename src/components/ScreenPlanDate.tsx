import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, Heart, Sparkles, Mail } from 'lucide-react';
import { HER_NAME } from '../config';

interface ScreenPlanDateProps {
  selectedOutfit: 'Modest' | 'Casual';
  initialDate?: string;
  initialTime?: string;
  initialMessage?: string;
  onSubmit: (date: string, time: string, message: string) => void;
  onBack: () => void;
}

export const ScreenPlanDate: React.FC<ScreenPlanDateProps> = ({
  selectedOutfit,
  initialDate = '',
  initialTime = '',
  initialMessage = '',
  onSubmit,
  onBack,
}) => {
  // Format today as YYYY-MM-DD for min date
  const todayStr = new Date().toISOString().split('T')[0];

  const [date, setDate] = useState<string>(initialDate || todayStr);
  const [time, setTime] = useState<string>(initialTime || '19:00');
  const [message, setMessage] = useState<string>(initialMessage || '');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Load from localStorage if present
  useEffect(() => {
    try {
      const savedDate = localStorage.getItem('tasneem_date_date');
      const savedTime = localStorage.getItem('tasneem_date_time');
      const savedMessage = localStorage.getItem('tasneem_date_message');
      if (savedDate) setDate(savedDate);
      if (savedTime) setTime(savedTime);
      if (savedMessage) setMessage(savedMessage);
    } catch {}
  }, []);

  // Save changes to localStorage
  const handleDateChange = (val: string) => {
    setDate(val);
    try {
      localStorage.setItem('tasneem_date_date', val);
    } catch {}
  };

  const handleTimeChange = (val: string) => {
    setTime(val);
    try {
      localStorage.setItem('tasneem_date_time', val);
    } catch {}
  };

  const handleMessageChange = (val: string) => {
    if (val.length <= 300) {
      setMessage(val);
      if (errorMsg) setErrorMsg(null);
      try {
        localStorage.setItem('tasneem_date_message', val);
      } catch {}
    }
  };

  // Helper date shortcuts
  const setQuickDate = (daysAhead: number) => {
    const target = new Date();
    target.setDate(target.getDate() + daysAhead);
    handleDateChange(target.toISOString().split('T')[0]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!date) {
      setErrorMsg('Please pick a date for our special outing! 📅');
      return;
    }

    if (!time) {
      setErrorMsg('Please pick a time! 🕐');
      return;
    }

    if (!message.trim()) {
      setErrorMsg('ممنوع تسيبيها فاضية... أنا مستني رسالة حلوة 😌💗');
      return;
    }

    onSubmit(date, time, message.trim());
  };

  return (
    <div className="relative z-10 w-full max-w-xl mx-auto px-4 py-6 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] text-center">
      {/* Title Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-rose-100/80 text-rose-800 text-xs font-semibold mb-2 border border-rose-200/60 shadow-xs">
          <span>🌷</span>
          <span>Perfect choice, {HER_NAME}</span>
          <span className="text-rose-500 font-bold">({selectedOutfit})</span>
        </span>
        <h1
          className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-rose-950 mb-1"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Now let's plan our date 💗
        </h1>
        <p className="text-rose-700/80 text-sm font-medium">
          حددي اليوم والوقت واكتبيلي كلمة من قلبك ✨
        </p>
      </motion.div>

      {/* Romantic Form Glass Card */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="w-full bg-white/75 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(244,114,182,0.18)] border border-white/80 text-left space-y-6"
      >
        {/* Field 1: Date Picker */}
        <div>
          <label className="block text-sm font-bold text-rose-900 mb-2 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-rose-500" />
              📅 Pick our date
            </span>
            <span className="text-xs font-normal text-rose-600">اختر اليوم</span>
          </label>
          <div className="relative">
            <input
              type="date"
              min={todayStr}
              value={date}
              onChange={(e) => handleDateChange(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-white/90 border border-rose-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-200 text-rose-950 font-medium text-sm sm:text-base outline-none shadow-xs transition-all"
              required
              aria-label="Pick date"
            />
          </div>

          {/* Quick Date Presets */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            <button
              type="button"
              onClick={() => setQuickDate(0)}
              className="px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/60 transition-colors"
            >
              اليوم (Today)
            </button>
            <button
              type="button"
              onClick={() => setQuickDate(1)}
              className="px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/60 transition-colors"
            >
              بكرة (Tomorrow)
            </button>
            <button
              type="button"
              onClick={() => setQuickDate(3)}
              className="px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/60 transition-colors"
            >
              الويك إند (Weekend)
            </button>
          </div>
        </div>

        {/* Field 2: Time Picker */}
        <div>
          <label className="block text-sm font-bold text-rose-900 mb-2 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-rose-500" />
              🕐 Pick the time
            </span>
            <span className="text-xs font-normal text-rose-600">اختر الوقت</span>
          </label>
          <input
            type="time"
            value={time}
            onChange={(e) => handleTimeChange(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-white/90 border border-rose-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-200 text-rose-950 font-medium text-sm sm:text-base outline-none shadow-xs transition-all"
            required
            aria-label="Pick time"
          />

          {/* Quick Time Presets */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            <button
              type="button"
              onClick={() => handleTimeChange('17:30')}
              className="px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/60 transition-colors"
            >
              🌅 غروب الشمس (5:30 PM)
            </button>
            <button
              type="button"
              onClick={() => handleTimeChange('19:30')}
              className="px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/60 transition-colors"
            >
              🕯️ عشاء رومانسي (7:30 PM)
            </button>
            <button
              type="button"
              onClick={() => handleTimeChange('20:30')}
              className="px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/60 transition-colors"
            >
              🌙 سهرة هادية (8:30 PM)
            </button>
          </div>
        </div>

        {/* Field 3: Sweet Message Textarea */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-bold text-rose-900 flex items-center gap-2">
              <Mail className="w-4 h-4 text-rose-500" />
              💌 Write me something sweet
            </label>
            <span
              className={`text-xs font-mono font-medium ${
                message.length >= 280 ? 'text-amber-600' : 'text-rose-400'
              }`}
            >
              {message.length} / 300
            </span>
          </div>

          <textarea
            rows={3}
            value={message}
            onChange={(e) => handleMessageChange(e.target.value)}
            placeholder="ممنوع تسيبيها فاضية... أنا مستني رسالة حلوة 😌💗"
            className="w-full px-4 py-3 rounded-2xl bg-white/90 border border-rose-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-200 text-rose-950 font-medium text-sm outline-none shadow-xs transition-all resize-none placeholder:text-rose-300 placeholder:italic"
            maxLength={300}
            required
            aria-label="Write a sweet message"
            dir="auto"
          />

          {errorMsg && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1.5 text-xs font-semibold text-rose-600 flex items-center gap-1"
            >
              <span>⚠️</span>
              <span>{errorMsg}</span>
            </motion.p>
          )}
        </div>

        {/* Buttons: Back & Final "It's a Date!" */}
        <div className="pt-2 flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition-colors cursor-pointer"
          >
            Back
          </button>

          <button
            type="submit"
            className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500 hover:from-rose-600 hover:to-pink-600 active:scale-[0.99] text-white font-bold text-base shadow-lg shadow-rose-400/40 hover:shadow-rose-400/60 transition-all flex items-center justify-center gap-2 cursor-pointer"
            aria-label="Confirm date: It's a Date!"
          >
            <Heart className="w-5 h-5 fill-white" />
            <span>It's a Date! 💗</span>
            <Sparkles className="w-4 h-4 text-amber-200" />
          </button>
        </div>
      </motion.form>
    </div>
  );
};

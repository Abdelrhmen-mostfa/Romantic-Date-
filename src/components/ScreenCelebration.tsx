import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Sparkles, Send, Copy, Check, Calendar, Clock, Shirt, MessageSquare, RotateCcw } from 'lucide-react';
import { WHATSAPP_NUMBER, HER_NAME } from '../config';

interface ScreenCelebrationProps {
  date: string;
  time: string;
  outfit: 'Modest' | 'Casual';
  message: string;
  onEdit: () => void;
  onReset: () => void;
}

export const ScreenCelebration: React.FC<ScreenCelebrationProps> = ({
  date,
  time,
  outfit,
  message,
  onEdit,
  onReset,
}) => {
  const [copied, setCopied] = useState(false);
  const [customPhone, setCustomPhone] = useState(() => {
    try {
      return localStorage.getItem('tasneem_date_phone') || '';
    } catch {
      return '';
    }
  });
  const [showPhonePrompt, setShowPhonePrompt] = useState(false);

  // Format date nicely
  const formatDateDisplay = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('ar-EG', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  // Format time nicely
  const formatTimeDisplay = (timeStr: string) => {
    try {
      const [h, m] = timeStr.split(':');
      const hour = parseInt(h, 10);
      const isPM = hour >= 12;
      const formattedHour = hour % 12 || 12;
      return `${formattedHour}:${m} ${isPM ? 'مساءً (PM)' : 'صباحاً (AM)'}`;
    } catch {
      return timeStr;
    }
  };

  // Construct exact WhatsApp message requested
  const buildWhatsAppMessage = () => {
    return `💗 It's a Date!

تسنيم وافقت على الـ Date 🌷

📅 التاريخ: ${date} (${formatDateDisplay(date)})
🕐 الوقت: ${time} (${formatTimeDisplay(time)})
👗 Dress Code: ${outfit} ${outfit === 'Modest' ? '🌷' : '👟'}

💌 رسالتها:
"${message}"

See you soon 💗`;
  };

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(buildWhatsAppMessage());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleWhatsAppSend = () => {
    const rawNumber = customPhone.trim() || WHATSAPP_NUMBER;
    const cleanNumber = rawNumber.replace(/[^0-9]/g, '');

    // Check if phone number is still placeholder
    if (!cleanNumber || rawNumber === 'PUT_PHONE_NUMBER_HERE') {
      setShowPhonePrompt(true);
      return;
    }

    const text = encodeURIComponent(buildWhatsAppMessage());
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${text}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const saveCustomPhoneAndSend = (phone: string) => {
    const cleaned = phone.replace(/[^0-9]/g, '');
    setCustomPhone(phone);
    try {
      localStorage.setItem('tasneem_date_phone', phone);
    } catch {}
    setShowPhonePrompt(false);

    const text = encodeURIComponent(buildWhatsAppMessage());
    const whatsappUrl = `https://wa.me/${cleaned}?text=${text}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="relative z-10 w-full max-w-lg mx-auto px-4 py-6 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] text-center">
      {/* Celebration Header */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-6"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-rose-400 to-pink-500 text-white shadow-xl shadow-rose-300/60 mb-3 text-3xl">
          💖
        </div>
        <h1
          className="text-3xl sm:text-4xl font-extrabold text-rose-950 mb-1"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          It's officially a date! 💗
        </h1>
        <p className="text-lg text-rose-700 font-semibold flex items-center justify-center gap-1.5">
          <span>See you soon, {HER_NAME} 🌷</span>
        </p>
      </motion.div>

      {/* Date Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full bg-white/80 backdrop-blur-2xl rounded-3xl p-6 sm:p-7 shadow-[0_20px_50px_rgba(244,114,182,0.2)] border border-white/90 text-left space-y-4 relative overflow-hidden"
      >
        {/* Subtle decorative border ticket look */}
        <div className="flex items-center justify-between pb-3 border-b border-rose-100">
          <span className="text-xs font-bold text-rose-900 tracking-wider uppercase flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Date Reservation Ticket
          </span>
          <span className="text-xs font-mono text-rose-400 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
            CONFIRMED ✨
          </span>
        </div>

        {/* Details Grid */}
        <div className="space-y-3 text-sm">
          {/* Date */}
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-rose-50/70 border border-rose-100/70">
            <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-rose-600 shadow-xs shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-rose-500">Date / التاريخ</p>
              <p className="text-sm font-bold text-rose-950">{date}</p>
              <p className="text-xs text-rose-700">{formatDateDisplay(date)}</p>
            </div>
          </div>

          {/* Time */}
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-rose-50/70 border border-rose-100/70">
            <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-rose-600 shadow-xs shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-rose-500">Time / الوقت</p>
              <p className="text-sm font-bold text-rose-950">{formatTimeDisplay(time)}</p>
            </div>
          </div>

          {/* Outfit */}
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-rose-50/70 border border-rose-100/70">
            <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-rose-600 shadow-xs shrink-0">
              <Shirt className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-rose-500">Dress Code</p>
              <p className="text-sm font-bold text-rose-950">
                {outfit} {outfit === 'Modest' ? '🌷' : '👟'}
              </p>
            </div>
          </div>

          {/* Sweet Message */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-rose-100/60 to-pink-100/60 border border-rose-200/60">
            <p className="text-xs font-semibold text-rose-600 mb-1 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" />
              Her sweet message / رسالتها 💌
            </p>
            <p className="text-sm italic text-rose-950 font-medium whitespace-pre-wrap" dir="auto">
              "{message}"
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 space-y-2.5">
          {/* Primary WhatsApp Button */}
          <button
            onClick={handleWhatsAppSend}
            className="w-full py-3.5 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-white font-bold text-base shadow-lg shadow-emerald-400/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            aria-label="Send our date details on WhatsApp"
          >
            <Send className="w-4 h-4 fill-white" />
            <span>Send our date on WhatsApp 💚</span>
          </button>

          {/* Secondary Buttons: Copy message & Edit */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyMessage}
              className="flex-1 py-2.5 px-3 rounded-xl bg-rose-100/80 hover:bg-rose-200/80 text-rose-900 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              aria-label="Copy invitation message to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to clipboard! ✓' : 'Copy Message'}</span>
            </button>

            <button
              onClick={onEdit}
              className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              Edit Details
            </button>
          </div>
        </div>
      </motion.div>

      {/* Start Over / Replay Option */}
      <button
        onClick={onReset}
        className="mt-6 inline-flex items-center gap-1.5 text-xs text-rose-700/80 hover:text-rose-900 font-medium transition-colors cursor-pointer"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Replay invitation from start</span>
      </button>

      {/* Modal for setting custom phone number if default is placeholder */}
      {showPhonePrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-sm bg-white p-6 rounded-3xl shadow-2xl border border-rose-100 text-left"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">📱</span>
              <h2 className="text-lg font-bold text-slate-900">Enter WhatsApp Number</h2>
            </div>
            <p className="text-xs text-slate-600 mb-4">
              أدخل رقم الواتساب الخاص بك مع كود الدولة (مثلاً 201012345678 أو 966501234567) لتلقي تفاصيل الموعد مباشرة.
            </p>
            <input
              type="tel"
              placeholder="+20 10..."
              defaultValue={customPhone}
              id="phoneInput"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 mb-4 text-sm font-mono outline-none focus:ring-2 focus:ring-rose-300"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowPhonePrompt(false)}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const input = document.getElementById('phoneInput') as HTMLInputElement;
                  if (input) saveCustomPhoneAndSend(input.value);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
              >
                Send to WhatsApp
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

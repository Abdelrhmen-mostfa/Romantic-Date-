/**
 * Web Audio API Sound Synthesizer
 * Generates custom comedic and romantic audio effects with zero external assets,
 * ensuring 100% offline reliability without broken links or CORS issues.
 */

let isMuted = false;
let audioCtx: AudioContext | null = null;

export const initAudioContext = () => {
  if (!audioCtx && typeof window !== 'undefined') {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

export const setMuted = (muted: boolean) => {
  isMuted = muted;
  try {
    localStorage.setItem('tasneem_date_muted', muted ? 'true' : 'false');
  } catch {}
};

export const getMuted = (): boolean => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('tasneem_date_muted');
      if (stored !== null) return stored === 'true';
    } catch {}
  }
  return isMuted;
};

/**
 * Comedic "NOOOO!" followed by cute baby crying effect ("wah-wah-wah")
 */
export const playComedicNoSound = () => {
  if (isMuted) return;
  const ctx = initAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // 1. Spoken "Noooo!" if SpeechSynthesis is available and not muted
  if ('speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance('Noooo!');
      utterance.pitch = 1.3;
      utterance.rate = 1.1;
      utterance.volume = 0.85;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Ignore if speech synthesis is blocked
    }
  }

  // 2. Cartoon downward "booo-womp" pitch bend
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.type = 'sawtooth';
  osc1.frequency.setValueAtTime(320, now);
  osc1.frequency.exponentialRampToValueAtTime(110, now + 0.35);

  gain1.gain.setValueAtTime(0.2, now);
  gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.38);

  // Filter to soften the buzz
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(900, now);

  osc1.connect(filter);
  filter.connect(gain1);
  gain1.connect(ctx.destination);

  osc1.start(now);
  osc1.stop(now + 0.4);

  // 3. Comedic Baby "Wah... Wah... Waaah" crying sounds starting right after
  const cryStartTime = now + 0.38;
  const cryPulses = [
    { start: 0.0, dur: 0.22, freq1: 440, freq2: 360 },
    { start: 0.25, dur: 0.22, freq1: 460, freq2: 370 },
    { start: 0.50, dur: 0.35, freq1: 480, freq2: 320 },
  ];

  cryPulses.forEach((pulse) => {
    const cryOsc = ctx.createOscillator();
    const cryGain = ctx.createGain();
    const cryFilter = ctx.createBiquadFilter();

    // Formant-like filter mimicking vocal cries
    cryFilter.type = 'bandpass';
    cryFilter.frequency.setValueAtTime(1100, cryStartTime + pulse.start);
    cryFilter.Q.setValueAtTime(3, cryStartTime + pulse.start);

    cryOsc.type = 'triangle';
    cryOsc.frequency.setValueAtTime(pulse.freq1, cryStartTime + pulse.start);
    cryOsc.frequency.exponentialRampToValueAtTime(pulse.freq2, cryStartTime + pulse.start + pulse.dur);

    cryGain.gain.setValueAtTime(0.001, cryStartTime + pulse.start);
    cryGain.gain.linearRampToValueAtTime(0.25, cryStartTime + pulse.start + 0.04);
    cryGain.gain.exponentialRampToValueAtTime(0.01, cryStartTime + pulse.start + pulse.dur);

    cryOsc.connect(cryFilter);
    cryFilter.connect(cryGain);
    cryGain.connect(ctx.destination);

    cryOsc.start(cryStartTime + pulse.start);
    cryOsc.stop(cryStartTime + pulse.start + pulse.dur + 0.05);
  });
};

/**
 * Uplifting romantic harp chime arpeggio for YES and celebration
 */
export const playYesCelebrationSound = () => {
  if (isMuted) return;
  const ctx = initAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  // C major 9 arpeggio: C5, E5, G5, B5, D6, E6
  const notes = [523.25, 659.25, 783.99, 987.77, 1174.66, 1318.51];

  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + i * 0.09);

    gain.gain.setValueAtTime(0.001, now + i * 0.09);
    gain.gain.linearRampToValueAtTime(0.2, now + i * 0.09 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.09 + 0.9);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + i * 0.09);
    osc.stop(now + i * 0.09 + 0.95);
  });
};

/**
 * Playful spring / pop sound when button or card dodges
 */
export const playDodgeSound = () => {
  if (isMuted) return;
  const ctx = initAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(450, now);
  osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);

  gain.gain.setValueAtTime(0.18, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.16);
};

/**
 * Magical sparkle chime for heart easter egg
 */
export const playSparkleSound = () => {
  if (isMuted) return;
  const ctx = initAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const freqs = [1046.5, 1318.5, 1567.98, 2093.0];
  freqs.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + idx * 0.05);

    gain.gain.setValueAtTime(0.12, now + idx * 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + idx * 0.05);
    osc.stop(now + idx * 0.05 + 0.42);
  });
};

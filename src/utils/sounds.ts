/**
 * Sound utility using Web Audio API (no external CDN needed).
 * Sounds are generated lazially — only after the first user interaction,
 * satisfying the browser's autoplay policy.
 */

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    try {
      ctx = new AudioContext();
    } catch {
      return null;
    }
  }
  // Resume if suspended (happens on some browsers)
  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }
  return ctx;
}

/** Generic tone generator */
function beep(
  frequency: number,
  type: OscillatorType,
  duration: number,
  volume = 0.4,
  attack = 0.01,
  decay = duration * 0.7
) {
  const ac = getCtx();
  if (!ac) return;

  const osc = ac.createOscillator();
  const gain = ac.createGain();

  osc.connect(gain);
  gain.connect(ac.destination);

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, ac.currentTime);

  gain.gain.setValueAtTime(0, ac.currentTime);
  gain.gain.linearRampToValueAtTime(volume, ac.currentTime + attack);
  gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + attack + decay);

  osc.start(ac.currentTime);
  osc.stop(ac.currentTime + duration);
}

/** Play a rising "success" chime (C → E → G) */
function playSuccess() {
  [523.25, 659.25, 783.99].forEach((freq, i) => {
    setTimeout(() => beep(freq, 'sine', 0.3, 0.45), i * 100);
  });
}

/** Short click tick */
function playClick() {
  beep(1200, 'square', 0.06, 0.15, 0.005, 0.055);
}

/** Festive level-up fanfare (C → E → G → C5) */
function playLevelUp() {
  [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
    setTimeout(() => beep(freq, 'triangle', 0.35, 0.55), i * 120);
  });
}

/** Soft "pop" */
function playPop() {
  beep(900, 'sine', 0.12, 0.3, 0.005, 0.11);
}

/** Wrong answer buzz */
function playError() {
  beep(220, 'sawtooth', 0.25, 0.35, 0.01, 0.24);
}

type SoundName = 'success' | 'click' | 'levelUp' | 'pop' | 'error';

const soundMap: Record<SoundName, () => void> = {
  success: playSuccess,
  click:   playClick,
  levelUp: playLevelUp,
  pop:     playPop,
  error:   playError,
};

/**
 * Play a named sound.
 * Safe to call at any time — silently no-ops if audio context is unavailable
 * or the browser hasn't received a user gesture yet.
 */
export const playSound = (name: SoundName): void => {
  try {
    soundMap[name]?.();
  } catch {
    // Silently ignore — audio failures must never break the UI
  }
};

// Legacy compatibility: previous code imported `sounds` object
export const sounds = soundMap;

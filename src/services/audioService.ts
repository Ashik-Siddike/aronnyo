/**
 * AudioService — Google Translate TTS via backend proxy
 *
 * Priority chain:
 *  1. Our /api/tts  →  Google Translate TTS (free, good Bengali quality)
 *  2. Browser SpeechSynthesis  →  fallback (robotic but works offline)
 */

const API_BASE = import.meta.env.VITE_API_URL ?? '/api';

// Client-side cache: cacheKey → Blob URL
const audioCache = new Map<string, string>();

let currentAudio: HTMLAudioElement | null = null;

function detectLang(text: string): 'bn' | 'en' {
  const bengaliChars = (text.match(/[\u0980-\u09FF]/g) || []).length;
  return bengaliChars / text.length > 0.25 ? 'bn' : 'en';
}

export function stopNarration(): void {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.src = '';
    currentAudio = null;
  }
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export async function playNarration(text: string): Promise<void> {
  if (!text?.trim()) return;
  stopNarration();

  const lang = detectLang(text);
  const cacheKey = `${lang}:${text.trim()}`;

  // ── 1. Try backend Google Translate TTS proxy ──────────────────────────
  try {
    let blobURL: string;

    if (audioCache.has(cacheKey)) {
      blobURL = audioCache.get(cacheKey)!;
    } else {
      const res = await fetch(`${API_BASE}/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.trim(), lang }),
        signal: AbortSignal.timeout(10_000),
      });

      if (!res.ok) throw new Error(`TTS API ${res.status}`);

      // Backend now returns raw MP3 binary (audio/mpeg)
      const arrayBuf = await res.arrayBuffer();
      const blob = new Blob([arrayBuf], { type: 'audio/mpeg' });
      blobURL = URL.createObjectURL(blob);

      // Cache with max-100 limit
      if (audioCache.size >= 100) {
        const oldKey = audioCache.keys().next().value;
        URL.revokeObjectURL(audioCache.get(oldKey)!);
        audioCache.delete(oldKey);
      }
      audioCache.set(cacheKey, blobURL);
    }

    return new Promise((resolve) => {
      const audio = new Audio(blobURL);
      currentAudio = audio;
      audio.volume = 0.95;
      audio.onended = () => { currentAudio = null; resolve(); };
      audio.onerror = () => { currentAudio = null; resolve(); };
      audio.play().catch(() => resolve());
    });

  } catch (err) {
    console.warn('[TTS] Backend unavailable, falling back to browser SpeechSynthesis:', err);
  }

  // ── 2. Browser SpeechSynthesis fallback ────────────────────────────────
  if (!('speechSynthesis' in window)) return;

  return new Promise((resolve) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate   = lang === 'bn' ? 0.80 : 0.90;
    utterance.pitch  = 1.05;
    utterance.volume = 0.95;

    const applyVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      if (lang === 'bn') {
        const bnVoice = voices.find(v => v.lang.startsWith('bn'));
        if (bnVoice) utterance.voice = bnVoice;
      } else {
        const preferred = ['Google US English', 'Microsoft Aria', 'Samantha', 'Karen'];
        const enVoice =
          voices.find(v => v.lang.startsWith('en') && preferred.some(p => v.name.includes(p))) ??
          voices.find(v => v.lang.startsWith('en'));
        if (enVoice) utterance.voice = enVoice;
      }
      utterance.onend   = () => resolve();
      utterance.onerror = () => resolve();
      window.speechSynthesis.speak(utterance);
    };

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) applyVoice();
    else window.speechSynthesis.onvoiceschanged = applyVoice;
  });
}

// ─── Legacy compatibility ───────────────────────────────────────────────────
export class AudioService {
  private static instance: AudioService;
  static getInstance() {
    if (!AudioService.instance) AudioService.instance = new AudioService();
    return AudioService.instance;
  }
  async playText(text: string) { return playNarration(text); }
  stop()            { stopNarration(); }
  getIsPlaying()    { return currentAudio !== null && !currentAudio.paused; }
}

// ─── UI Sound effects (Web Audio API — no network) ─────────────────────────
export const playSound = (type: 'correct' | 'wrong' | 'click') => {
  const AC = (window as any).AudioContext || (window as any).webkitAudioContext;
  if (!AC) return;
  const ac  = new AC();
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.connect(gain);
  gain.connect(ac.destination);
  const now = ac.currentTime;
  if (type === 'correct') {
    osc.frequency.setValueAtTime(523.25, now);
    osc.frequency.setValueAtTime(659.25, now + 0.1);
    osc.frequency.setValueAtTime(783.99, now + 0.2);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
    osc.start(now); osc.stop(now + 0.4);
  } else if (type === 'wrong') {
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.setValueAtTime(200, now + 0.2);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    osc.start(now); osc.stop(now + 0.3);
  } else {
    osc.frequency.setValueAtTime(800, now);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    osc.start(now); osc.stop(now + 0.1);
  }
};

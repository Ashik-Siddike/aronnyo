/**
 * AudioService — Google Cloud TTS (WaveNet) with smart fallback chain
 *
 * Priority:
 *  1. Google Cloud TTS via our backend  → WaveNet quality, Bengali + English
 *  2. Browser SpeechSynthesis            → fallback if API key not set
 */

const API_BASE = import.meta.env.VITE_API_URL ?? '/api';

// ─── Simple client-side cache (avoids refetching same text) ──────────────────
const audioCache = new Map<string, string>(); // cacheKey → objectURL

// ─── Currently playing audio ─────────────────────────────────────────────────
let currentAudio: HTMLAudioElement | null = null;

function detectLang(text: string): 'bn' | 'en' {
  // If >30% characters are in the Bengali Unicode block, treat as Bengali
  const bengaliChars = (text.match(/[\u0980-\u09FF]/g) || []).length;
  return bengaliChars / text.length > 0.3 ? 'bn' : 'en';
}

/** Stop whatever is currently playing */
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

/** Main function — call this from any component */
export async function playNarration(text: string): Promise<void> {
  if (!text?.trim()) return;

  stopNarration();

  const lang = detectLang(text);
  const cacheKey = `${lang}:${text.trim()}`;

  // ── 1. Try Google Cloud TTS via backend ──────────────────────────────────
  try {
    let objectURL: string;

    if (audioCache.has(cacheKey)) {
      objectURL = audioCache.get(cacheKey)!;
    } else {
      const res = await fetch(`${API_BASE}/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.trim(), lang }),
        signal: AbortSignal.timeout(8000), // 8s timeout
      });

      if (!res.ok) throw new Error(`TTS API ${res.status}`);

      const { audioContent } = await res.json();
      // audioContent is base64 MP3 → convert to Blob URL
      const binary = atob(audioContent);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      const blob = new Blob([bytes], { type: 'audio/mp3' });
      objectURL = URL.createObjectURL(blob);

      // Cache (limit 100 entries)
      if (audioCache.size >= 100) {
        const oldKey = audioCache.keys().next().value;
        URL.revokeObjectURL(audioCache.get(oldKey)!);
        audioCache.delete(oldKey);
      }
      audioCache.set(cacheKey, objectURL);
    }

    return new Promise((resolve) => {
      const audio = new Audio(objectURL);
      currentAudio = audio;
      audio.volume = 0.95;
      audio.onended = () => { currentAudio = null; resolve(); };
      audio.onerror = () => { currentAudio = null; resolve(); };
      audio.play().catch(() => resolve());
    });

  } catch (err) {
    console.warn('[TTS] Google Cloud TTS unavailable, falling back to browser SpeechSynthesis:', err);
  }

  // ── 2. Browser SpeechSynthesis fallback ─────────────────────────────────
  if (!('speechSynthesis' in window)) return;

  return new Promise((resolve) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate   = lang === 'bn' ? 0.80 : 0.90;
    utterance.pitch  = 1.05;
    utterance.volume = 0.95;

    const applyVoice = () => {
      const voices = window.speechSynthesis.getVoices();

      // For Bengali — prefer any bn voice
      if (lang === 'bn') {
        const bnVoice = voices.find(v => v.lang.startsWith('bn'));
        if (bnVoice) utterance.voice = bnVoice;
      } else {
        // For English — prefer Google/Neural/Female voices
        const preferred = [
          'Google US English', 'Microsoft Aria', 'Samantha',
          'Karen', 'Moira', 'Tessa', 'Fiona',
        ];
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

// ─── Legacy compatibility ────────────────────────────────────────────────────
export class AudioService {
  private static instance: AudioService;

  static getInstance(): AudioService {
    if (!AudioService.instance) AudioService.instance = new AudioService();
    return AudioService.instance;
  }

  async playText(text: string): Promise<void> {
    return playNarration(text);
  }

  stop(): void {
    stopNarration();
  }

  getIsPlaying(): boolean {
    return currentAudio !== null && !currentAudio.paused;
  }
}

// ─── UI Sound effects (unchanged — Web Audio API) ───────────────────────────
export const playSound = (type: 'correct' | 'wrong' | 'click') => {
  const AC = (window as any).AudioContext || (window as any).webkitAudioContext;
  if (!AC) return;
  const ac = new AC();
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

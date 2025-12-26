
export class AudioService {
  private static instance: AudioService;
  private currentAudio: HTMLAudioElement | null = null;
  private isPlaying: boolean = false;

  static getInstance(): AudioService {
    if (!AudioService.instance) {
      AudioService.instance = new AudioService();
    }
    return AudioService.instance;
  }

  async playText(text: string): Promise<void> {
    this.stop();

    if ('speechSynthesis' in window) {
      return new Promise((resolve) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.85;
        utterance.pitch = 1.1;
        utterance.volume = 0.9;

        const loadVoices = () => {
          const voices = speechSynthesis.getVoices();

          const femaleVoiceNames = [
            'Google US English Female',
            'Microsoft Zira',
            'Samantha',
            'Karen',
            'Victoria',
            'Fiona',
            'Moira',
            'Tessa',
            'Veena',
            'Google UK English Female',
            'Microsoft Aria',
            'Female'
          ];

          let selectedVoice = voices.find(voice => {
            const isEnglish = voice.lang.startsWith('en');
            const isFemale = femaleVoiceNames.some(name =>
              voice.name.toLowerCase().includes(name.toLowerCase())
            );
            return isEnglish && isFemale;
          });

          if (!selectedVoice) {
            selectedVoice = voices.find(voice =>
              voice.lang.startsWith('en') && voice.name.toLowerCase().includes('female')
            );
          }

          if (!selectedVoice) {
            selectedVoice = voices.find(voice => voice.lang.startsWith('en'));
          }

          if (selectedVoice) {
            utterance.voice = selectedVoice;
          }

          this.isPlaying = true;

          utterance.onend = () => {
            this.isPlaying = false;
            resolve();
          };

          utterance.onerror = () => {
            this.isPlaying = false;
            resolve();
          };

          speechSynthesis.speak(utterance);
        };

        const voices = speechSynthesis.getVoices();
        if (voices.length > 0) {
          loadVoices();
        } else {
          speechSynthesis.onvoiceschanged = loadVoices;
        }
      });
    } else {
      // Fallback: Create a demo beep sound
      const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        const audioContext = new AudioContextClass();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 1);
        
        this.isPlaying = true;
        setTimeout(() => {
          this.isPlaying = false;
        }, 1000);
      } else {
        // Final fallback - just log
        console.log('Demo audio playing for:', text);
        this.isPlaying = true;
        setTimeout(() => {
          this.isPlaying = false;
        }, 2000);
      }
    }
  }

  stop(): void {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
    this.isPlaying = false;
  }

  getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const playSound = (type: 'correct' | 'wrong' | 'click') => {
  const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
  if (!AudioContextClass) return;

  const audioContext = new AudioContextClass();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  if (type === 'correct') {
    oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1);
    oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2);
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.4);
  } else if (type === 'wrong') {
    oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(200, audioContext.currentTime + 0.2);
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  } else if (type === 'click') {
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  }
};

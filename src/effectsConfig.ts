// Definition of the 10 installer effects
export interface InstallerEffectConfig {
  rippleEffect: boolean;             // 1. Ripple Effect (Vlnová animácia pri kliknutí z bodu dotyku)
  hoverGlowShimmer: boolean;         // 2. Hover Glow / Shimmer (Svetelný reflex prechádzajúci cez tlačidlo)
  pressedDepthOffset: boolean;       // 3. Pressed Depth Offset (Fyzické stlačenie a posun textu smerom dovnútra)
  neonPulseBorder: boolean;          // 4. Neon Pulse / Breathing Border (Jemné pulzovanie okrajov tlačidla)
  soundClickFeedback: boolean;       // 5. Sound Click Feedback (Prehratie mechanického/sci-fi zvuku pri kliknutí)
  successParticleBurst: boolean;     // 6. Success Particle Burst (Časticová animácia po dokončení inštalácie)
  scaleBounceOnHover: boolean;       // 7. Scale Bounce on Hover (Mierne zväčšenie tlačidla pri nájazde)
  shakeErrorAnimation: boolean;      // 8. Shake Error Animation (Zatresenie tlačidlom pri chybe)
  glassmorphismBlur: boolean;        // 9. Glassmorphism Blur Highlight (Sklenený rozostrený odlesk)
  smoothColorFade: boolean;          // 10. Smooth Color Fade Transition (Plynulý prechod farieb)
}

export const DEFAULT_EFFECTS_CONFIG: InstallerEffectConfig = {
  rippleEffect: true,
  hoverGlowShimmer: true,
  pressedDepthOffset: true,
  neonPulseBorder: true,
  soundClickFeedback: true,
  successParticleBurst: true,
  scaleBounceOnHover: true,
  shakeErrorAnimation: true,
  glassmorphismBlur: true,
  smoothColorFade: true,
};

export const STORAGE_KEY_EFFECTS = 'aegis_installer_effects_config';

export function loadStoredEffects(): InstallerEffectConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_EFFECTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_EFFECTS_CONFIG, ...parsed };
    }
  } catch (e) {
    console.error('Failed to parse stored installer effects config', e);
  }
  return { ...DEFAULT_EFFECTS_CONFIG };
}

export function saveStoredEffects(config: InstallerEffectConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY_EFFECTS, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save installer effects config', e);
  }
}

/**
 * Generate a clean, synthesized mechanical/sci-fi click audio WAV (16-bit PCM, 44.1kHz).
 * Returns ArrayBuffer representing the .wav file.
 */
export function generateSyntheticClickWav(): ArrayBuffer {
  const sampleRate = 44100;
  const duration = 0.08; // 80ms crisp tactile mechanical click
  const numSamples = Math.floor(sampleRate * duration);
  const bytesPerSample = 2; // 16-bit
  const dataByteLength = numSamples * bytesPerSample;
  const buffer = new ArrayBuffer(44 + dataByteLength);
  const view = new DataView(buffer);

  // Helper to write ASCII string to DataView
  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  // RIFF header
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataByteLength, true); // chunkSize
  writeString(8, 'WAVE');

  // fmt subchunk
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
  view.setUint16(20, 1, true); // AudioFormat (1 = PCM)
  view.setUint16(22, 1, true); // NumChannels (1 = Mono)
  view.setUint32(24, sampleRate, true); // SampleRate
  view.setUint32(28, sampleRate * bytesPerSample, true); // ByteRate
  view.setUint16(32, bytesPerSample, true); // BlockAlign
  view.setUint16(34, 16, true); // BitsPerSample

  // data subchunk
  writeString(36, 'data');
  view.setUint32(40, dataByteLength, true);

  // Generate waveform: crisp click transient followed by rapid pitch drop and exponential decay
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    // Fast decay envelope
    const env = Math.exp(-t * 90);
    // Dynamic frequency drop from 1800Hz down to 220Hz
    const freq = 220 + 1580 * Math.exp(-t * 120);
    const wave = Math.sin(2 * Math.PI * freq * t);
    // Subtle transient noise punch in the first 2ms
    const noise = (Math.random() * 2 - 1) * Math.exp(-t * 800) * 0.4;
    
    let sample = (wave * 0.7 + noise) * env;
    sample = Math.max(-1, Math.min(1, sample)); // Clamp
    const intSample = sample < 0 ? sample * 32768 : sample * 32767;
    view.setInt16(44 + i * 2, intSample, true);
  }

  return buffer;
}

// In-browser Web Audio API tactile audio trigger for live preview
let audioCtx: AudioContext | null = null;
export function playPreviewClickSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const t = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400, t);
    osc.frequency.exponentialRampToValueAtTime(160, t + 0.05);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(t);
    osc.stop(t + 0.065);
  } catch (err) {
    // Audio context may be blocked by browser policy until user gesture
  }
}

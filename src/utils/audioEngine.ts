/**
 * BirthdayAudioEngine
 * Single source of truth: plays the bundled anthem "Ten_Years_of_Awesome.mp3"
 * for Shrestha (Ira)'s 10th Birthday. This is the one and only song.
 */

export interface AudioState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playbackRate: number;
  isReady: boolean;
}

export type AudioStateListener = (state: AudioState) => void;

class BirthdayAudioEngine {
  private audioElement: HTMLAudioElement | null = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private masterGain: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private mediaSourceNode: MediaElementAudioSourceNode | null = null;

  // State
  private state: AudioState = {
    isPlaying: false,
    currentTime: 0,
    duration: 182,
    volume: 0.85,
    isMuted: false,
    playbackRate: 1.0,
    isReady: false,
  };

  private listeners: Set<AudioStateListener> = new Set();

  public subscribe(listener: AudioStateListener): () => void {
    this.listeners.add(listener);
    listener({ ...this.state });
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const copy = { ...this.state };
    this.listeners.forEach((fn) => fn(copy));
  }

  public initAudioContext(): AudioContext {
    if (!this.audioContext) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioContext = new AudioCtx();

      // Master Compressor for a polished, punchy sound
      this.compressor = this.audioContext.createDynamicsCompressor();
      this.compressor.threshold.setValueAtTime(-14, this.audioContext.currentTime);
      this.compressor.knee.setValueAtTime(10, this.audioContext.currentTime);
      this.compressor.ratio.setValueAtTime(4, this.audioContext.currentTime);
      this.compressor.attack.setValueAtTime(0.005, this.audioContext.currentTime);
      this.compressor.release.setValueAtTime(0.15, this.audioContext.currentTime);

      // Master Gain
      this.masterGain = this.audioContext.createGain();
      this.masterGain.gain.setValueAtTime(
        this.state.isMuted ? 0 : this.state.volume,
        this.audioContext.currentTime
      );

      // Visualizer Analyser Node — higher resolution for a smoother visualizer
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 512;
      this.analyser.smoothingTimeConstant = 0.78;

      // Routing: Compressor -> Master Gain -> Destination & Analyser
      this.compressor.connect(this.masterGain);
      this.masterGain.connect(this.audioContext.destination);
      this.masterGain.connect(this.analyser);

      this.setupAudioElement();
    }

    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    return this.audioContext;
  }

  private setupAudioElement() {
    if (this.audioElement || !this.audioContext) return;

    const audio = new Audio('/Ten_Years_of_Awesome.mp3');
    audio.preload = 'auto';
    audio.volume = this.state.isMuted ? 0 : this.state.volume;
    audio.playbackRate = this.state.playbackRate;

    audio.addEventListener('timeupdate', () => {
      this.state.currentTime = audio.currentTime;
      this.notify();
    });

    audio.addEventListener('loadedmetadata', () => {
      this.state.duration = audio.duration || this.state.duration;
      this.state.isReady = true;
      this.notify();
    });

    audio.addEventListener('ended', () => {
      this.state.isPlaying = false;
      this.notify();
    });

    try {
      this.mediaSourceNode = this.audioContext.createMediaElementSource(audio);
      if (this.compressor) {
        this.mediaSourceNode.connect(this.compressor);
      }
    } catch (e) {
      // Source node already created for this element; ignore.
    }

    this.audioElement = audio;
  }

  public getAnalyser(): AnalyserNode | null {
    if (!this.analyser && typeof window !== 'undefined') {
      this.initAudioContext();
    }
    return this.analyser;
  }

  public async play() {
    const ctx = this.initAudioContext();
    if (ctx.state === 'suspended') {
      try {
        await ctx.resume();
      } catch (err) {
        // ignored
      }
    }

    if (!this.audioElement) return;

    try {
      await this.audioElement.play();
      this.state.isPlaying = true;
      this.notify();
    } catch (err) {
      // Playback blocked (e.g. autoplay policy) — leave state paused.
      this.state.isPlaying = false;
      this.notify();
    }
  }

  public pause() {
    if (this.audioElement) {
      this.audioElement.pause();
    }
    this.state.isPlaying = false;
    this.notify();
  }

  public togglePlay() {
    if (this.state.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  public seek(seconds: number) {
    const clamped = Math.max(0, Math.min(seconds, this.state.duration));
    if (this.audioElement && this.audioElement.duration) {
      this.audioElement.currentTime = clamped;
    }
    this.state.currentTime = clamped;
    this.notify();
  }

  public setVolume(val: number) {
    const clamped = Math.max(0, Math.min(val, 1));
    this.state.volume = clamped;
    if (this.audioElement) {
      this.audioElement.volume = this.state.isMuted ? 0 : clamped;
    }
    if (this.masterGain && this.audioContext) {
      this.masterGain.gain.setValueAtTime(
        this.state.isMuted ? 0 : clamped,
        this.audioContext.currentTime
      );
    }
    this.notify();
  }

  public toggleMute() {
    this.state.isMuted = !this.state.isMuted;
    if (this.audioElement) {
      this.audioElement.volume = this.state.isMuted ? 0 : this.state.volume;
    }
    if (this.masterGain && this.audioContext) {
      this.masterGain.gain.setValueAtTime(
        this.state.isMuted ? 0 : this.state.volume,
        this.audioContext.currentTime
      );
    }
    this.notify();
  }

  public setPlaybackRate(rate: number) {
    this.state.playbackRate = rate;
    if (this.audioElement) {
      this.audioElement.playbackRate = rate;
    }
    this.notify();
  }

  public getVisualizerData(): Uint8Array {
    if (!this.analyser) {
      return new Uint8Array(new ArrayBuffer(32));
    }
    const buf = new ArrayBuffer(this.analyser.frequencyBinCount);
    const dataArray = new Uint8Array(buf);
    this.analyser.getByteFrequencyData(dataArray);
    return dataArray;
  }
}

export const audioEngine = new BirthdayAudioEngine();

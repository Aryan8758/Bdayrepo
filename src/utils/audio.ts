/**
 * Upgraded Romantic Audio Engine for Shreya's Birthday Surprise
 * Lush music-box & romantic acoustic melody with chords, gentle sparkle notes,
 * arrow whoosh, pierce sound, candle blow, balloon pops, and celebratory cheering.
 */

class BirthdayAudioEngine {
  private ctx: AudioContext | null = null;
  private musicGainNode: GainNode | null = null;
  private sfxGainNode: GainNode | null = null;
  private isMusicPlaying: boolean = false;
  private isMuted: boolean = false;
  private volume: number = 0.75;
  private currentSongTimer: number | null = null;
  private scheduledNotes: OscillatorNode[] = [];
  private onStateChangeCallbacks: Set<(isPlaying: boolean) => void> = new Set();

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();

      this.musicGainNode = this.ctx.createGain();
      this.sfxGainNode = this.ctx.createGain();

      this.musicGainNode.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.sfxGainNode.gain.setValueAtTime(0.85, this.ctx.currentTime);

      this.musicGainNode.connect(this.ctx.destination);
      this.sfxGainNode.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public subscribeState(cb: (isPlaying: boolean) => void) {
    this.onStateChangeCallbacks.add(cb);
    return () => {
      this.onStateChangeCallbacks.delete(cb);
    };
  }

  private notifyState() {
    this.onStateChangeCallbacks.forEach((cb) => cb(this.isMusicPlaying));
  }

  // --- Sound Effects ---

  public playBalloonPop() {
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGainNode || this.isMuted) return;

      const now = this.ctx.currentTime;
      const bufferSize = this.ctx.sampleRate * 0.08;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, now);
      filter.Q.setValueAtTime(3.5, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.75, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      whiteNoise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.sfxGainNode);
      whiteNoise.start(now);

      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.12);

      oscGain.gain.setValueAtTime(0.9, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(oscGain);
      oscGain.connect(this.sfxGainNode);
      osc.start(now);
      osc.stop(now + 0.12);
    } catch {}
  }

  public playBowPull() {
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGainNode || this.isMuted) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.25);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(this.sfxGainNode);
      osc.start(now);
      osc.stop(now + 0.28);
    } catch {}
  }

  public playArrowRelease() {
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGainNode || this.isMuted) return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(460, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.22);

      gain.gain.setValueAtTime(0.55, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(this.sfxGainNode);
      osc.start(now);
      osc.stop(now + 0.22);

      const bufferSize = this.ctx.sampleRate * 0.25;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(900, now);
      filter.frequency.exponentialRampToValueAtTime(2800, now + 0.18);

      const nGain = this.ctx.createGain();
      nGain.gain.setValueAtTime(0.35, now);
      nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      noise.connect(filter);
      filter.connect(nGain);
      nGain.connect(this.sfxGainNode);
      noise.start(now);
    } catch {}
  }

  // Realistic arrow hit & piercing thud into heart
  public playHeartPierce() {
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGainNode || this.isMuted) return;
      const now = this.ctx.currentTime;

      // Heavy organic thud
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.2);
      gain.gain.setValueAtTime(0.8, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(this.sfxGainNode);
      osc.start(now);
      osc.stop(now + 0.2);
    } catch {}
  }

  // Miss / Whiff sound effect
  public playArrowMiss() {
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGainNode || this.isMuted) return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(240, now);
      osc.frequency.linearRampToValueAtTime(140, now + 0.3);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(this.sfxGainNode);
      osc.start(now);
      osc.stop(now + 0.3);
    } catch {}
  }

  public playHeartExplosion() {
    this.playHeartPierce();
    this.playBalloonPop();
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGainNode || this.isMuted) return;

      const chords = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98, 2093.0];
      chords.forEach((freq, idx) => {
        const start = this.ctx!.currentTime + idx * 0.04;
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.22, start);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.9);

        osc.connect(gain);
        gain.connect(this.sfxGainNode!);
        osc.start(start);
        osc.stop(start + 0.9);
      });
    } catch {}
  }

  public playCandleBlow() {
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGainNode || this.isMuted) return;
      const now = this.ctx.currentTime;

      const bufferSize = this.ctx.sampleRate * 0.4;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, now);
      filter.frequency.linearRampToValueAtTime(220, now + 0.4);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGainNode);
      noise.start(now);
    } catch {}
  }

  public playSparkle() {
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGainNode || this.isMuted) return;
      const notes = [1046.5, 1318.51, 1567.98, 2093.0, 2637.0];
      notes.forEach((freq, i) => {
        const t = this.ctx!.currentTime + i * 0.05;
        const osc = this.ctx!.createOscillator();
        const g = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);
        g.gain.setValueAtTime(0.18, t);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);
        osc.connect(g);
        g.connect(this.sfxGainNode!);
        osc.start(t);
        osc.stop(t + 0.45);
      });
    } catch {}
  }

  public playCelebratoryCheer() {
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGainNode || this.isMuted) return;

      const now = this.ctx.currentTime;
      const fanfareNotes = [
        { f: 523.25, t: 0.0, d: 0.4 },
        { f: 659.25, t: 0.08, d: 0.4 },
        { f: 783.99, t: 0.16, d: 0.4 },
        { f: 1046.5, t: 0.24, d: 0.9 },
        { f: 1318.51, t: 0.32, d: 1.1 },
        { f: 1567.98, t: 0.4, d: 1.3 },
      ];

      fanfareNotes.forEach((n) => {
        const start = now + n.t;
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(n.f, start);

        gain.gain.setValueAtTime(0.2, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + n.d);

        osc.connect(gain);
        gain.connect(this.sfxGainNode!);
        osc.start(start);
        osc.stop(start + n.d);
      });
    } catch {}
  }

  // --- Lush Romantic Background Melody ---
  // Beautiful acoustic love melody blended with Happy Birthday motif and tender chords

  private playWarmNote(freq: number, start: number, duration: number, velocity: number = 0.24) {
    if (!this.ctx || !this.musicGainNode) return;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, start);

    // Warm undertone & harmonic sparkle
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 0.5, start);

    // Romantic envelope: gentle attack, long warm sustain, delicate decay
    noteGain.gain.setValueAtTime(0.0001, start);
    noteGain.gain.linearRampToValueAtTime(velocity, start + 0.03);
    noteGain.gain.exponentialRampToValueAtTime(velocity * 0.5, start + duration * 0.6);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

    osc1.connect(noteGain);
    osc2.connect(noteGain);
    noteGain.connect(this.musicGainNode);

    osc1.start(start);
    osc1.stop(start + duration);
    osc2.start(start);
    osc2.stop(start + duration);

    this.scheduledNotes.push(osc1, osc2);
  }

  public startHappyBirthdayMusic() {
    this.initContext();
    if (this.isMusicPlaying) return;
    this.isMusicPlaying = true;
    this.notifyState();

    this.scheduleRomanticLoop();
  }

  private scheduleRomanticLoop() {
    if (!this.isMusicPlaying || !this.ctx) return;

    const tempo = 98; // Tender romantic tempo
    const beat = 60 / tempo;
    const now = this.ctx.currentTime + 0.15;

    // Frequencies (Warm F Major / D Minor romantic key)
    const C4 = 261.63;
    const D4 = 293.66;
    const E4 = 329.63;
    const F4 = 349.23;
    const G4 = 392.0;
    const A4 = 440.0;
    const Bb4 = 466.16;
    const C5 = 523.25;
    const D5 = 587.33;
    const E5 = 659.25;
    const F5 = 698.46;
    const Bb3 = 233.08;
    const F3 = 174.61;
    const C3 = 130.81;
    const D3 = 146.83;
    const A3 = 220.0;

    // Tender birthday love melody
    const song: Array<{ note: number; beats: number; bass?: number }> = [
      // Introduction arpeggio
      { note: F4, beats: 1, bass: F3 },
      { note: A4, beats: 1 },
      { note: C5, beats: 1, bass: A3 },

      // "Happy Birthday to you..."
      { note: C4, beats: 0.75, bass: F3 },
      { note: C4, beats: 0.25 },
      { note: D4, beats: 1 },
      { note: C4, beats: 1 },
      { note: F4, beats: 1.5, bass: A3 },
      { note: E4, beats: 2, bass: C3 },

      // "Happy Birthday to you..."
      { note: C4, beats: 0.75, bass: C3 },
      { note: C4, beats: 0.25 },
      { note: D4, beats: 1 },
      { note: C4, beats: 1 },
      { note: G4, beats: 1.5, bass: Bb3 },
      { note: F4, beats: 2, bass: F3 },

      // "Happy Birthday dear Shreya..."
      { note: C4, beats: 0.75, bass: F3 },
      { note: C4, beats: 0.25 },
      { note: C5, beats: 1.25, bass: D3 },
      { note: A4, beats: 1 },
      { note: F4, beats: 1, bass: Bb3 },
      { note: E4, beats: 1 },
      { note: D4, beats: 2, bass: Bb3 },

      // "Happy Birthday to you! ❤️"
      { note: Bb4, beats: 0.75, bass: Bb3 },
      { note: Bb4, beats: 0.25 },
      { note: A4, beats: 1.25, bass: F3 },
      { note: F4, beats: 1 },
      { note: G4, beats: 1.25, bass: C3 },
      { note: F4, beats: 3, bass: F3 },

      // Romantic Outro Bell Chimes
      { note: A4, beats: 1, bass: D3 },
      { note: C5, beats: 1 },
      { note: F5, beats: 2.5, bass: F3 },
    ];

    let currentOffset = 0;
    song.forEach((item) => {
      const noteStart = now + currentOffset * beat;
      const duration = item.beats * beat * 0.96;

      this.playWarmNote(item.note, noteStart, duration, 0.26);
      if (item.bass) {
        this.playWarmNote(item.bass, noteStart, duration * 1.3, 0.18);
      }
      currentOffset += item.beats;
    });

    const totalDurationSeconds = currentOffset * beat;

    this.currentSongTimer = window.setTimeout(() => {
      if (this.isMusicPlaying) {
        this.scheduleRomanticLoop();
      }
    }, (totalDurationSeconds + 0.8) * 1000);
  }

  public pauseMusic() {
    this.isMusicPlaying = false;
    if (this.currentSongTimer) {
      clearTimeout(this.currentSongTimer);
      this.currentSongTimer = null;
    }
    this.scheduledNotes.forEach((osc) => {
      try {
        osc.stop();
      } catch {}
    });
    this.scheduledNotes = [];
    this.notifyState();
  }

  public toggleMusic() {
    if (this.isMusicPlaying) {
      this.pauseMusic();
    } else {
      this.startHappyBirthdayMusic();
    }
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.musicGainNode && this.ctx) {
      this.musicGainNode.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.musicGainNode && this.ctx) {
      this.musicGainNode.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  public getIsPlaying(): boolean {
    return this.isMusicPlaying;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getVolume(): number {
    return this.volume;
  }
}

export const soundEngine = new BirthdayAudioEngine();

/**
 * Romantic Studio Audio Engine for Shreya's Birthday Surprise
 * - Anti-clipping dynamics compressor & master warmth filter to prevent audio distortion ("fatna")
 * - Natural Voice Generator shouting "Happy Birthday Shreya!" via SpeechSynthesis with chime fallback
 * - Sweet, warm, crystalline music-box acoustic birthday melody
 * - SFX for bow pull, arrow whoosh, heart pierce, candle blow, balloon pop & sparkles
 */

class BirthdayAudioEngine {
  private ctx: AudioContext | null = null;
  private musicGainNode: GainNode | null = null;
  private sfxGainNode: GainNode | null = null;
  private masterGainNode: GainNode | null = null;
  private masterCompressor: DynamicsCompressorNode | null = null;
  private warmthFilter: BiquadFilterNode | null = null;

  private isMusicPlaying: boolean = false;
  private isMuted: boolean = false;
  private volume: number = 0.7;
  private currentSongTimer: number | null = null;
  private scheduledNotes: OscillatorNode[] = [];
  private onStateChangeCallbacks: Set<(isPlaying: boolean) => void> = new Set();

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();

      // Master Output Chain:
      // [musicGain / sfxGain] -> warmthFilter -> masterCompressor -> masterGain -> destination
      this.masterGainNode = this.ctx.createGain();
      this.masterGainNode.gain.setValueAtTime(0.7, this.ctx.currentTime);

      // Lowpass filter to eliminate harsh high-frequency distortion & create a warm, velvet music-box tone
      this.warmthFilter = this.ctx.createBiquadFilter();
      this.warmthFilter.type = 'lowpass';
      this.warmthFilter.frequency.setValueAtTime(3200, this.ctx.currentTime);
      this.warmthFilter.Q.setValueAtTime(0.7, this.ctx.currentTime);

      // Studio Dynamics Compressor: Prevents clipping/distortion when multiple notes/chords play together
      this.masterCompressor = this.ctx.createDynamicsCompressor();
      this.masterCompressor.threshold.setValueAtTime(-18, this.ctx.currentTime);
      this.masterCompressor.knee.setValueAtTime(12, this.ctx.currentTime);
      this.masterCompressor.ratio.setValueAtTime(5, this.ctx.currentTime);
      this.masterCompressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
      this.masterCompressor.release.setValueAtTime(0.2, this.ctx.currentTime);

      this.musicGainNode = this.ctx.createGain();
      this.sfxGainNode = this.ctx.createGain();

      this.musicGainNode.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.sfxGainNode.gain.setValueAtTime(0.75, this.ctx.currentTime);

      // Connect nodes
      this.musicGainNode.connect(this.warmthFilter);
      this.sfxGainNode.connect(this.warmthFilter);
      this.warmthFilter.connect(this.masterCompressor);
      this.masterCompressor.connect(this.masterGainNode);
      this.masterGainNode.connect(this.ctx.destination);
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

  // --- Voice Generator ---
  /**
   * Enthusiastic voice shouting "Yaaay! Happy Birthday, Shreya!" right after candle blowout,
   * followed immediately by the sweet melodious background song.
   */
  public playVoiceCheer(
    recipientName: string = 'Shreya',
    age: number = 22,
    onComplete?: () => void
  ) {
    try {
      this.initContext();
      this.playCelebratoryCheer();

      if ('speechSynthesis' in window) {
        // Cancel any pending speech
        window.speechSynthesis.cancel();

        const text = `Yaaay! Happy Birthday, ${recipientName}!!`;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.pitch = 1.35; // Joyful, excited, celebration pitch
        utterance.rate = 1.05; // Natural lively pace
        utterance.volume = 1.0; // Loud and clear!

        // Find best natural voice if available
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice =
          voices.find(
            (v) =>
              v.lang.startsWith('en') &&
              (v.name.includes('Google') ||
                v.name.includes('Natural') ||
                v.name.includes('Samantha') ||
                v.name.includes('Female') ||
                v.name.includes('Zira'))
          ) || voices.find((v) => v.lang.startsWith('en'));

        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }

        let finished = false;
        const onDone = () => {
          if (!finished) {
            finished = true;
            if (onComplete) onComplete();
          }
        };

        utterance.onend = onDone;
        utterance.onerror = onDone;

        window.speechSynthesis.speak(utterance);

        // Fallback safety timeout (1.8s) in case speech synthesis is blocked
        setTimeout(onDone, 1800);
      } else {
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 1200);
      }
    } catch {
      if (onComplete) onComplete();
    }
  }

  // --- Sound Effects (Calibrated without clipping) ---

  public playBalloonPop() {
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGainNode || this.isMuted) return;

      const now = this.ctx.currentTime;
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.07);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.7;
      }
      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, now);
      filter.Q.setValueAtTime(3.0, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.5, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      whiteNoise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.sfxGainNode);
      whiteNoise.start(now);

      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.1);

      oscGain.gain.setValueAtTime(0.6, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(oscGain);
      oscGain.connect(this.sfxGainNode);
      osc.start(now);
      osc.stop(now + 0.1);
    } catch {}
  }

  public playBowPull() {
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGainNode || this.isMuted) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(280, now + 0.22);

      gain.gain.setValueAtTime(0.02, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.18);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.sfxGainNode);
      osc.start(now);
      osc.stop(now + 0.25);
    } catch {}
  }

  public playArrowRelease() {
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGainNode || this.isMuted) return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.18);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(this.sfxGainNode);
      osc.start(now);
      osc.stop(now + 0.18);

      const bufferSize = Math.floor(this.ctx.sampleRate * 0.18);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.4;
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(900, now);
      filter.frequency.exponentialRampToValueAtTime(2400, now + 0.15);

      const nGain = this.ctx.createGain();
      nGain.gain.setValueAtTime(0.25, now);
      nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      noise.connect(filter);
      filter.connect(nGain);
      nGain.connect(this.sfxGainNode);
      noise.start(now);
    } catch {}
  }

  public playHeartPierce() {
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGainNode || this.isMuted) return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.18);
      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(this.sfxGainNode);
      osc.start(now);
      osc.stop(now + 0.18);
    } catch {}
  }

  public playArrowMiss() {
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGainNode || this.isMuted) return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(130, now + 0.25);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.sfxGainNode);
      osc.start(now);
      osc.stop(now + 0.25);
    } catch {}
  }

  public playHeartExplosion() {
    this.playHeartPierce();
    this.playBalloonPop();
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGainNode || this.isMuted) return;

      const chords = [523.25, 659.25, 783.99, 1046.5, 1318.51];
      chords.forEach((freq, idx) => {
        const start = this.ctx!.currentTime + idx * 0.04;
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.14, start);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.7);

        osc.connect(gain);
        gain.connect(this.sfxGainNode!);
        osc.start(start);
        osc.stop(start + 0.7);
      });
    } catch {}
  }

  public playCandleBlow() {
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGainNode || this.isMuted) return;
      const now = this.ctx.currentTime;

      const bufferSize = Math.floor(this.ctx.sampleRate * 0.45);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.5;

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, now);
      filter.frequency.linearRampToValueAtTime(180, now + 0.45);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

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
      const notes = [1046.5, 1318.51, 1567.98, 2093.0];
      notes.forEach((freq, i) => {
        const t = this.ctx!.currentTime + i * 0.05;
        const osc = this.ctx!.createOscillator();
        const g = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);
        g.gain.setValueAtTime(0.1, t);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);
        osc.connect(g);
        g.connect(this.sfxGainNode!);
        osc.start(t);
        osc.stop(t + 0.4);
      });
    } catch {}
  }

  public playCelebratoryCheer() {
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGainNode || this.isMuted) return;

      const now = this.ctx.currentTime;
      const fanfareNotes = [
        { f: 523.25, t: 0.0, d: 0.35 },
        { f: 659.25, t: 0.08, d: 0.35 },
        { f: 783.99, t: 0.16, d: 0.35 },
        { f: 1046.5, t: 0.24, d: 0.7 },
        { f: 1318.51, t: 0.32, d: 0.8 },
      ];

      fanfareNotes.forEach((n) => {
        const start = now + n.t;
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(n.f, start);

        gain.gain.setValueAtTime(0.12, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + n.d);

        osc.connect(gain);
        gain.connect(this.sfxGainNode!);
        osc.start(start);
        osc.stop(start + n.d);
      });
    } catch {}
  }

  // --- Crystalline Music-Box Birthday Melody (Sweet, Tender, Non-Distorting) ---

  private playMusicBoxNote(freq: number, start: number, duration: number, velocity: number = 0.12) {
    if (!this.ctx || !this.musicGainNode) return;

    // Primary fundamental tone: pure sine wave
    const osc1 = this.ctx.createOscillator();
    // Shimmer harmonic: delicate celesta overtone (octave higher, tiny volume)
    const osc2 = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, start);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, start);

    // Velvet Music Box envelope: instantaneous gentle attack (no click), bell-like decay
    noteGain.gain.setValueAtTime(0.0001, start);
    noteGain.gain.linearRampToValueAtTime(velocity, start + 0.012);
    noteGain.gain.exponentialRampToValueAtTime(velocity * 0.4, start + duration * 0.45);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

    // Mix overtone very subtly
    const overtoneGain = this.ctx.createGain();
    overtoneGain.gain.setValueAtTime(0.15, start);

    osc1.connect(noteGain);
    osc2.connect(overtoneGain);
    overtoneGain.connect(noteGain);
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

    const tempo = 92; // Gentle, sweet music-box tempo
    const beat = 60 / tempo;
    const now = this.ctx.currentTime + 0.1;

    // Sweet F Major Key Frequencies (Warm & soothing)
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
    const F3 = 174.61;
    const C3 = 130.81;
    const D3 = 146.83;
    const Bb3 = 233.08;
    const A3 = 220.0;

    // Tender, melodic Happy Birthday song for Shreya
    const song: Array<{ note: number; beats: number; bass?: number }> = [
      // Gentle Intro Bell
      { note: F4, beats: 0.75, bass: F3 },
      { note: A4, beats: 0.75 },
      { note: C5, beats: 1.5, bass: A3 },

      // "Happy Birthday to you..."
      { note: C4, beats: 0.75, bass: F3 },
      { note: C4, beats: 0.25 },
      { note: D4, beats: 1.0 },
      { note: C4, beats: 1.0 },
      { note: F4, beats: 1.5, bass: A3 },
      { note: E4, beats: 2.0, bass: C3 },

      // "Happy Birthday to you..."
      { note: C4, beats: 0.75, bass: C3 },
      { note: C4, beats: 0.25 },
      { note: D4, beats: 1.0 },
      { note: C4, beats: 1.0 },
      { note: G4, beats: 1.5, bass: Bb3 },
      { note: F4, beats: 2.0, bass: F3 },

      // "Happy Birthday dear Shreya..."
      { note: C4, beats: 0.75, bass: F3 },
      { note: C4, beats: 0.25 },
      { note: C5, beats: 1.25, bass: D3 },
      { note: A4, beats: 1.0 },
      { note: F4, beats: 1.0, bass: Bb3 },
      { note: E4, beats: 1.0 },
      { note: D4, beats: 2.0, bass: Bb3 },

      // "Happy Birthday to you! ❤️"
      { note: Bb4, beats: 0.75, bass: Bb3 },
      { note: Bb4, beats: 0.25 },
      { note: A4, beats: 1.25, bass: F3 },
      { note: F4, beats: 1.0 },
      { note: G4, beats: 1.25, bass: C3 },
      { note: F4, beats: 2.5, bass: F3 },

      // Sweet music-box lullaby transition
      { note: A4, beats: 0.75, bass: D3 },
      { note: C5, beats: 0.75 },
      { note: E5, beats: 1.0 },
      { note: F5, beats: 2.5, bass: F3 },
    ];

    let currentOffset = 0;
    song.forEach((item) => {
      const noteStart = now + currentOffset * beat;
      const duration = item.beats * beat * 0.95;

      this.playMusicBoxNote(item.note, noteStart, duration, 0.12);
      if (item.bass) {
        this.playMusicBoxNote(item.bass, noteStart, duration * 1.2, 0.08);
      }
      currentOffset += item.beats;
    });

    const totalDurationSeconds = currentOffset * beat;

    this.currentSongTimer = window.setTimeout(() => {
      if (this.isMusicPlaying) {
        this.scheduleRomanticLoop();
      }
    }, (totalDurationSeconds + 0.6) * 1000);
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

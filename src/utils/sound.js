// Web Audio API synthesizer with volume, mute, sound FX, and procedural ambient BGM
class SoundController {
  constructor() {
    this.ctx = null;
    this.muted = localStorage.getItem("country_quiz_muted") === "true";
    this.bgmEnabled = localStorage.getItem("country_quiz_bgm") === "true";
    const savedVol = localStorage.getItem("country_quiz_volume");
    this.volume = savedVol ? parseFloat(savedVol) : 0.8;
    this.bgmInterval = null;
  }

  init() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem("country_quiz_muted", this.muted ? "true" : "false");
    if (this.muted && this.bgmInterval) {
      this.stopBGM();
    } else if (!this.muted && this.bgmEnabled) {
      this.startBGM();
    }
    return this.muted;
  }

  isMuted() {
    return this.muted;
  }

  toggleBGM() {
    this.bgmEnabled = !this.bgmEnabled;
    localStorage.setItem("country_quiz_bgm", this.bgmEnabled ? "true" : "false");
    if (this.bgmEnabled && !this.muted) {
      this.startBGM();
    } else {
      this.stopBGM();
    }
    return this.bgmEnabled;
  }

  isBGMActive() {
    return this.bgmEnabled;
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    localStorage.setItem("country_quiz_volume", this.volume.toString());
  }

  getVolume() {
    return this.volume;
  }

  startBGM() {
    this.init();
    if (!this.ctx || this.bgmInterval || this.muted) return;

    // Ambient procedural chord progression: C, G, Am, F pentatonic frequencies
    const chordSequences = [
      [261.63, 329.63, 392.0, 523.25], // C Major
      [220.0, 261.63, 329.63, 440.0],  // A Minor
      [174.61, 220.0, 261.63, 349.23], // F Major
      [196.0, 246.94, 293.66, 392.0],  // G Major
    ];

    let chordIdx = 0;
    const playChordStep = () => {
      if (!this.ctx || !this.bgmEnabled || this.muted) return;
      const now = this.ctx.currentTime;
      const chord = chordSequences[chordIdx];
      chordIdx = (chordIdx + 1) % chordSequences.length;

      chord.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + i * 0.4);

        const chordGain = 0.015 * this.volume;
        gain.gain.setValueAtTime(0.001, now + i * 0.4);
        gain.gain.linearRampToValueAtTime(chordGain, now + i * 0.4 + 0.6);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.4 + 2.5);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + i * 0.4);
        osc.stop(now + i * 0.4 + 2.6);
      });
    };

    playChordStep();
    this.bgmInterval = setInterval(playChordStep, 3200);
  }

  stopBGM() {
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }

  playCorrect() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const gainBase = 0.12 * this.volume;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);

      gain.gain.setValueAtTime(gainBase, now + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.28);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.3);
    });
  }

  playIncorrect() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(105, now + 0.28);

    gain.gain.setValueAtTime(0.14 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
  }

  playLifeLost() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const gainBase = 0.12 * this.volume;
    [220, 196, 174].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(freq, now + idx * 0.1);

      gain.gain.setValueAtTime(gainBase, now + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.1);
      osc.stop(now + idx * 0.1 + 0.2);
    });
  }

  playTick() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(800, now);

    gain.gain.setValueAtTime(0.04 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  playLifeline() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(960, now + 0.2);

    gain.gain.setValueAtTime(0.1 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  playVictory() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const gainBase = 0.08 * this.volume;
    const chords = [
      { notes: [523.25, 659.25, 783.99], time: 0 },
      { notes: [587.33, 739.99, 880.0], time: 0.18 },
      { notes: [659.25, 830.61, 987.77], time: 0.36 },
      { notes: [783.99, 987.77, 1174.66, 1567.98], time: 0.58 },
    ];

    chords.forEach(({ notes, time }) => {
      notes.forEach((freq) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "triangle";
        const start = this.ctx.currentTime + time;
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(gainBase, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.45);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(start);
        osc.stop(start + 0.5);
      });
    });
  }
}

export const sound = new SoundController();

// AudioGenerator — synthesises all game sounds via Web Audio API
// No external audio files needed.

let ctx = null;

function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  return ctx;
}

function resumeCtx() {
  const c = getCtx();
  if (c.state === 'suspended') c.resume();
  return c;
}

// Play a tone with given frequency, duration, type, and optional envelope
function playTone(freq, duration, type = 'sine', gain = 0.3, startDelay = 0) {
  const c = resumeCtx();
  const osc = c.createOscillator();
  const gainNode = c.createGain();
  osc.connect(gainNode);
  gainNode.connect(c.destination);
  osc.type = type;
  osc.frequency.setValueAtTime(freq, c.currentTime + startDelay);
  gainNode.gain.setValueAtTime(0, c.currentTime + startDelay);
  gainNode.gain.linearRampToValueAtTime(gain, c.currentTime + startDelay + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.001, c.currentTime + startDelay + duration);
  osc.start(c.currentTime + startDelay);
  osc.stop(c.currentTime + startDelay + duration);
}

// Frequency sweep
function playSweep(freqStart, freqEnd, duration, type = 'sine', gain = 0.3) {
  const c = resumeCtx();
  const osc = c.createOscillator();
  const gainNode = c.createGain();
  osc.connect(gainNode);
  gainNode.connect(c.destination);
  osc.type = type;
  osc.frequency.setValueAtTime(freqStart, c.currentTime);
  osc.frequency.linearRampToValueAtTime(freqEnd, c.currentTime + duration);
  gainNode.gain.setValueAtTime(gain, c.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
  osc.start(c.currentTime);
  osc.stop(c.currentTime + duration);
}

// Noise burst (for underwater ambience)
function playNoise(duration, gain = 0.05, cutoff = 400) {
  const c = resumeCtx();
  const bufferSize = c.sampleRate * duration;
  const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  const source = c.createBufferSource();
  source.buffer = buffer;
  const filter = c.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = cutoff;
  const gainNode = c.createGain();
  gainNode.gain.value = gain;
  source.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(c.destination);
  source.start();
  source.stop(c.currentTime + duration);
}

// Looping ambient nodes (stored for stop/start)
let ambientNodes = [];
let ambientRunning = false;

function startAmbient() {
  if (ambientRunning) return;
  ambientRunning = true;
  scheduleAmbient();
}

function scheduleAmbient() {
  if (!ambientRunning) return;
  playNoise(2.0, 0.04, 300);
  // Occasional bubble blips
  const delay = 0.3 + Math.random() * 0.8;
  const f = 180 + Math.random() * 80;
  playTone(f, 0.12, 'sine', 0.06, delay);
  setTimeout(scheduleAmbient, 1800);
}

function stopAmbient() {
  ambientRunning = false;
}

// Looping music (gentle bossa-ish pattern)
let musicRunning = false;
let musicTimeout = null;

const MUSIC_NOTES = [261, 329, 392, 261, 349, 440, 392, 261, 294, 369, 440, 329];
let musicIdx = 0;

function startMusic() {
  if (musicRunning) return;
  musicRunning = true;
  scheduleMusic();
}

function scheduleMusic() {
  if (!musicRunning) return;
  const note = MUSIC_NOTES[musicIdx % MUSIC_NOTES.length];
  musicIdx++;
  playTone(note, 0.35, 'triangle', 0.08);
  // Occasional harmony
  if (musicIdx % 3 === 0) playTone(note * 1.5, 0.35, 'sine', 0.04);
  musicTimeout = setTimeout(scheduleMusic, 420);
}

function stopMusic() {
  musicRunning = false;
  if (musicTimeout) clearTimeout(musicTimeout);
  musicTimeout = null;
}

// Individual sound effects
function playCollect() {
  playSweep(220, 440, 0.08, 'square', 0.2);
}

function playPup() {
  // Ascending arpeggio: C4 E4 G4 C5
  playTone(261, 0.1, 'triangle', 0.25, 0.0);
  playTone(329, 0.1, 'triangle', 0.25, 0.1);
  playTone(392, 0.1, 'triangle', 0.25, 0.2);
  playTone(523, 0.2, 'triangle', 0.30, 0.3);
}

function playHit() {
  const c = resumeCtx();
  const osc = c.createOscillator();
  const gainNode = c.createGain();
  osc.connect(gainNode);
  gainNode.connect(c.destination);
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(80, c.currentTime);
  osc.frequency.exponentialRampToValueAtTime(30, c.currentTime + 0.2);
  gainNode.gain.setValueAtTime(0.4, c.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.2);
  osc.start(c.currentTime);
  osc.stop(c.currentTime + 0.2);
}

function playLoseLife() {
  playSweep(440, 220, 0.4, 'triangle', 0.3);
}

function playGameOver() {
  // Sad descending melody: 4 notes
  playTone(392, 0.5, 'triangle', 0.25, 0.0);
  playTone(349, 0.5, 'triangle', 0.25, 0.55);
  playTone(294, 0.5, 'triangle', 0.25, 1.1);
  playTone(220, 0.8, 'triangle', 0.30, 1.65);
}

function playJellyfish() {
  playSweep(330, 220, 0.12, 'sine', 0.15);
}

let muted = false;

function setMuted(val) {
  muted = val;
  localStorage.setItem('bimini_muted', val ? '1' : '0');
  if (val) {
    stopAmbient();
    stopMusic();
  }
}

function isMuted() {
  return muted;
}

function loadMuteState() {
  muted = localStorage.getItem('bimini_muted') === '1';
}

// Wrapped exports — respect mute state
export const Audio = {
  init() { loadMuteState(); },
  resumeCtx,
  startAmbient() { if (!muted) startAmbient(); },
  stopAmbient,
  startMusic() { if (!muted) startMusic(); },
  stopMusic,
  collect() { if (!muted) playCollect(); },
  pup() { if (!muted) playPup(); },
  hit() { if (!muted) playHit(); },
  loseLife() { if (!muted) playLoseLife(); },
  gameOver() { if (!muted) playGameOver(); },
  jellyfish() { if (!muted) playJellyfish(); },
  setMuted,
  isMuted,
};

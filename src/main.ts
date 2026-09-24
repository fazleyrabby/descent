import '@fontsource/dm-sans/latin-400.css';
import '@fontsource/dm-sans/latin-500.css';
import '@fontsource/dm-sans/latin-600.css';
import '@fontsource/dm-sans/latin-700.css';
import '@fontsource/space-grotesk/latin-400.css';
import '@fontsource/space-grotesk/latin-500.css';
import '@fontsource/space-grotesk/latin-600.css';
import '@fontsource/space-grotesk/latin-700.css';
import './styles.css';
import { OceanWorld, type WorldMetrics, type Quality } from './world';
import { vampireSquid, zoneAt } from './content';

const root = document.querySelector<HTMLDivElement>('#app');
if (!root) throw new Error('Missing app root');

root.innerHTML = `
  <canvas id="ocean" aria-label="Interactive deep ocean expedition"></canvas>
  <div class="grain" aria-hidden="true"></div>
  <div class="vignette" aria-hidden="true"></div>

  <div id="hud" class="hud is-hidden">
    <header class="masthead">
      <div class="brand"><span class="brand-mark" aria-hidden="true">◉</span><span>DESCENT</span><span class="brand-rule"></span><span class="brand-sub">EXPEDITION 01</span></div>
      <div class="top-actions">
        <span class="signal"><i></i> SYSTEMS ONLINE</span>
        <button id="controlsBtn" class="text-button" type="button" aria-label="Controls manual">MANUAL <span class="key-badge">?</span></button>
        <button id="muteBtn" class="text-button" type="button" aria-label="Toggle audio">AUDIO <span id="muteLabel">ON</span></button>
        <button id="journalBtn" class="text-button" type="button">FIELD JOURNAL <span id="journalCount">00</span></button>
        <button id="pauseBtn" class="icon-button" type="button" aria-label="Pause expedition">Ⅱ</button>
      </div>
    </header>

    <aside class="depth-module" aria-label="Depth instruments">
      <div class="instrument-label"><span class="small-cross">✳</span> CURRENT DEPTH</div>
      <div class="depth-readout"><span id="depth">000</span><span class="depth-unit">m</span></div>
      <div class="depth-rule"><span id="depthProgress"></span></div>
      <div class="zone"><div id="zoneName">OCEAN SURFACE</div><span id="zoneSubtitle">Open water</span></div>
      <div class="readings">
        <div><span>PRESSURE</span><strong id="pressure">~1.4 atm</strong></div>
        <div><span>AMBIENT LIGHT</span><strong id="light">100%</strong></div>
        <div><span>MAX DEPTH</span><strong id="maxDepthRecord">000 m</strong></div>
      </div>
    </aside>

    <div class="reticle" aria-hidden="true"><span></span><span></span><span></span><span></span><i></i></div>
    <div id="targetPrompt" class="target-prompt is-hidden"><span class="target-prompt-dot"></span><span>SPECIMEN NEARBY<br><em>PRESS E TO SCAN</em></span></div>
    <div id="scanMeter" class="scan-meter is-hidden"><span>ANALYZING SIGNATURE</span><div><i id="scanFill"></i></div></div>
    <div id="toast" class="toast is-hidden" role="status"></div>

    <aside class="sonar-panel">
      <div class="panel-head"><span>ACTIVE SONAR</span><span id="sonarState">STANDBY</span></div>
      <div class="sonar-screen">
        <div class="sonar-ring sonar-ring-one"></div>
        <div class="sonar-ring sonar-ring-two"></div>
        <div class="sonar-line"></div>
        <div class="sonar-center"></div>
        <div id="sonarContact" class="sonar-contact is-hidden"></div>
      </div>
      <div class="sonar-footer"><span>R <b>·</b> PING</span><span id="sonarRange">— M</span></div>
    </aside>

    <!-- Initial surface flight directive banner -->
    <div id="surfaceDirective" class="directive-card">
      <div class="directive-head"><span class="directive-dot"></span><span>EXPEDITION DIRECTIVE</span><button id="dismissDirective" class="directive-close" type="button" aria-label="Dismiss directive">×</button></div>
      <p>Dive from the sunlit surface down to the <strong>2,000 m</strong> abyssal floor. Locate the midwater twilight contact near 650 m with sonar (<kbd>R</kbd>), scan with (<kbd>E</kbd>), and record in your Field Journal (<kbd>J</kbd>).</p>
      <div class="directive-keys">
        <span><kbd>W</kbd><kbd>S</kbd> Dive / Rise</span>
        <span><kbd>A</kbd><kbd>D</kbd> Drift</span>
        <span><kbd>R</kbd> Sonar</span>
        <span><kbd>E</kbd> Scan</span>
        <span><kbd>F</kbd> Lights</span>
      </div>
    </div>

    <!-- 2,000m Milestone Celebration Card -->
    <div id="milestoneCard" class="milestone-card is-hidden" role="alert">
      <div class="milestone-tag">EXPEDITION MILESTONE · 2,000 M</div>
      <h3>Abyssal Benthic Floor Reached</h3>
      <p>Maximum rated depth achieved at the 2,000 m ocean floor boundary. Hydrostatic pressure: ~201 atm. You have traversed the complete water column from sunlit waves to hydrothermal vents. Open the field journal (<kbd>J</kbd>) to review your findings, or explore freely.</p>
      <button id="milestoneCloseBtn" class="primary-button" type="button"><span>ACKNOWLEDGE & EXPLORE</span><span class="button-arrow">↗</span></button>
    </div>

    <!-- On-screen responsive touch controls for mobile & tablets -->
    <div id="touchControls" class="touch-controls">
      <div class="touch-dpad">
        <button id="touchUp" class="touch-btn" type="button" aria-label="Rise">▲</button>
        <div class="touch-dpad-row">
          <button id="touchLeft" class="touch-btn" type="button" aria-label="Drift Left">◀</button>
          <div class="touch-center-dot"></div>
          <button id="touchRight" class="touch-btn" type="button" aria-label="Drift Right">▶</button>
        </div>
        <button id="touchDown" class="touch-btn" type="button" aria-label="Dive">▼</button>
      </div>
      <div class="touch-actions">
        <button id="touchSonar" class="touch-btn touch-action-btn" type="button">SONAR<small>[R]</small></button>
        <button id="touchScan" class="touch-btn touch-action-btn" type="button">SCAN<small>[E]</small></button>
        <button id="touchLight" class="touch-btn touch-action-btn" type="button">LIGHT<small>[F]</small></button>
        <button id="touchJournal" class="touch-btn touch-action-btn" type="button">LOG<small>[J]</small></button>
      </div>
    </div>

    <div class="bottom-bar">
      <div class="bottom-left"><span class="latitude">SIMULATED EXPEDITION</span><span class="bottom-rule"></span><span>0 → 2,000 M</span></div>
      <div class="control-strip">
        <span><kbd>A</kbd><kbd>D</kbd> DRIFT</span>
        <span><kbd>W</kbd><kbd>S</kbd> RISE / DIVE</span>
        <span><kbd>Scroll</kbd> ZOOM</span>
        <span><kbd>F</kbd> LIGHTS</span>
        <span><kbd>R</kbd> SONAR</span>
        <span><kbd>E</kbd> SCAN</span>
        <span><kbd>T</kbd> TAGS</span>
        <span><kbd>J</kbd> JOURNAL</span>
        <span><kbd>M</kbd> MUTE</span>
        <span><kbd>?</kbd> MANUAL</span>
      </div>
      <div class="bottom-right-cluster">
        <span class="zoom-badge" id="zoomDisplay" title="Click or press Z to reset zoom">100% ZOOM</span>
        <span class="bottom-right" id="fpsDisplay">— FPS</span>
      </div>
    </div>
  </div>

  <section id="intro" class="intro overlay" aria-labelledby="introTitle">
    <div class="intro-top"><span class="intro-wordmark">DESCENT<span class="intro-dot">.</span></span><span>AN INTERACTIVE DEEP OCEAN EXPEDITION</span></div>
    <div class="intro-main">
      <div class="intro-accent"></div>
      <p class="eyebrow">THE OCEAN BELOW THE OCEAN</p>
      <h1 id="introTitle">How deep<br>can we <em>go?</em></h1>
      <p class="intro-copy">Pilot a research submersible through a 2D side-view ocean. Follow the fading light, ping for life, and record what you find.</p>
      <button id="beginBtn" class="primary-button" type="button"><span>BEGIN EXPEDITION</span><span class="button-arrow">↗</span></button>
      <p class="intro-note">DESKTOP & TOUCH SUPPORTED · HEADPHONES RECOMMENDED</p>
    </div>
    <div class="intro-side" aria-hidden="true">
      <div class="scope-circle scope-one"></div>
      <div class="scope-circle scope-two"></div>
      <div class="scope-circle scope-three"></div>
      <div class="scope-axis"></div>
      <span class="scope-label scope-label-top">SURFACE / 000 M</span>
      <span class="scope-label scope-label-bottom">ABYSS / 2,000 M</span>
      <div class="scope-ping"></div>
    </div>
    <div class="intro-bottom"><span>01 / DESCENT PROTOTYPE</span><span>SIMULATED OCEAN · SOURCED DISCOVERIES</span></div>
  </section>

  <section id="pauseOverlay" class="modal-overlay is-hidden" aria-labelledby="pauseTitle">
    <div class="modal pause-modal">
      <p class="eyebrow">EXPEDITION PAUSED</p>
      <h2 id="pauseTitle">Take a breath.</h2>
      <p>Your position is held. The deep will be here when you return.</p>
      <div class="modal-actions">
        <button id="resumeBtn" class="primary-button" type="button">RESUME EXPEDITION <span>↗</span></button>
        <button id="settingsBtn" class="secondary-button" type="button">SETTINGS</button>
      </div>
      <div id="settings" class="settings is-hidden">
        <label>GRAPHICS QUALITY <select id="quality"><option value="high">High</option><option value="low">Low</option></select></label>
        <label>AMBIENT AUDIO <input id="volume" type="range" min="0" max="100" value="35" /></label>
        <label><input id="tagsSetting" type="checkbox" checked /> CREATURE TAXONOMY TAGS</label>
        <label><input id="muteSetting" type="checkbox" /> MUTE ALL SOUNDS</label>
        <label><input id="reducedMotion" type="checkbox" /> REDUCE INTERFACE MOTION</label>
        <button id="resetProgress" class="reset-button" type="button">CLEAR LOCAL DISCOVERIES</button>
      </div>
    </div>
  </section>

  <section id="controlsOverlay" class="modal-overlay is-hidden" aria-labelledby="controlsTitle">
    <div class="modal controls-modal">
      <div class="modal-header">
        <div><p class="eyebrow">SUBMERSIBLE SYSTEMS</p><h2 id="controlsTitle">Flight Manual<span>.</span></h2></div>
        <button id="closeControlsBtn" class="icon-button" type="button" aria-label="Close manual">×</button>
      </div>
      <div class="controls-grid">
        <div class="control-card">
          <h4>NAVIGATION</h4>
          <ul>
            <li>
              <div class="key-combo"><kbd>A</kbd><kbd>D</kbd><span>/</span><kbd>◀</kbd><kbd>▶</kbd></div>
              <span class="key-desc">Drift horizontally</span>
            </li>
            <li>
              <div class="key-combo"><kbd>W</kbd><kbd>S</kbd><span>/</span><kbd>▲</kbd><kbd>▼</kbd></div>
              <span class="key-desc">Rise and dive</span>
            </li>
            <li>
              <div class="key-combo"><kbd>Space</kbd><span>/</span><kbd>Shift</kbd></div>
              <span class="key-desc">Alternate rise / dive</span>
            </li>
            <li>
              <div class="key-combo"><kbd>Scroll</kbd><span>/</span><kbd>Pinch</kbd></div>
              <span class="key-desc">Camera zoom (55%–185%)</span>
            </li>
            <li>
              <div class="key-combo"><kbd>Z</kbd></div>
              <span class="key-desc">Reset camera zoom (100%)</span>
            </li>
          </ul>
        </div>
        <div class="control-card">
          <h4>EQUIPMENT & SENSORS</h4>
          <ul>
            <li>
              <div class="key-combo"><kbd>F</kbd></div>
              <span class="key-desc">Toggle floodlights</span>
            </li>
            <li>
              <div class="key-combo"><kbd>R</kbd></div>
              <span class="key-desc">Active sonar ping (echoes)</span>
            </li>
            <li>
              <div class="key-combo"><kbd>E</kbd></div>
              <span class="key-desc">Scan nearby organism</span>
            </li>
            <li>
              <div class="key-combo"><kbd>T</kbd></div>
              <span class="key-desc">Toggle creature tags</span>
            </li>
          </ul>
        </div>
        <div class="control-card">
          <h4>LOG & SYSTEM</h4>
          <ul>
            <li>
              <div class="key-combo"><kbd>J</kbd></div>
              <span class="key-desc">Open Field Journal</span>
            </li>
            <li>
              <div class="key-combo"><kbd>M</kbd></div>
              <span class="key-desc">Toggle audio mute</span>
            </li>
            <li>
              <div class="key-combo"><kbd>?</kbd><span>/</span><kbd>H</kbd></div>
              <span class="key-desc">Flight Manual</span>
            </li>
            <li>
              <div class="key-combo"><kbd>Esc</kbd></div>
              <span class="key-desc">Pause & settings</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <section id="journalOverlay" class="modal-overlay is-hidden" aria-labelledby="journalTitle">
    <div class="modal journal-modal">
      <div class="journal-top">
        <div><p class="eyebrow">EXPEDITION RECORD</p><h2 id="journalTitle">Field journal<span>.</span></h2></div>
        <button id="closeJournalBtn" class="icon-button" type="button" aria-label="Close journal">×</button>
      </div>
      <div class="journal-grid">
        <div class="journal-index">
          <span>DISCOVERIES</span>
          <button id="entryTab" class="entry-tab" type="button">
            01 <strong>Vampire squid</strong>
            <small id="entryState">UNDISCOVERED</small>
          </button>
          <div class="journal-expedition-stats">
            <span>EXPEDITION METRICS</span>
            <div><small>MISSION DEPTH</small><strong id="journalMaxDepth">000 m</strong></div>
            <div><small>CATALOGUED</small><strong id="journalDiscoveredCount">0 of 1 Species</strong></div>
            <div><small>STATUS</small><strong id="journalStatus">ACTIVE DESCENT</strong></div>
          </div>
        </div>
        <article id="journalEntry" class="journal-entry">
          <div class="empty-journal">
            <span>◇</span>
            <h3>No entries yet</h3>
            <p>Descend into the twilight zone (600–900 m). Follow a sonar contact and press <kbd>E</kbd> while looking at the organism.</p>
          </div>
        </article>
      </div>
    </div>
  </section>

  <aside id="debug" class="debug is-hidden">
    <div>DEBUG / SEED 183729</div>
    <div id="debugStats">—</div>
    <label>TELEPORT DEPTH <input id="debugDepth" type="range" min="0" max="2000" step="1" value="0" /></label>
    <button id="debugLight" type="button">TOGGLE LIGHTS</button>
  </aside>
  <div id="fatal" class="fatal is-hidden" role="alert">
    <h2>Unable to start the expedition</h2>
    <p>This browser could not start the ocean canvas. Try reloading the page or using a current browser.</p>
    <button type="button" onclick="location.reload()">RETRY</button>
  </div>
`;

const el = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const show = (node: HTMLElement, visible: boolean) => node.classList.toggle('is-hidden', !visible);
const canvas = el<HTMLCanvasElement>('ocean');

let world: OceanWorld;
let metrics: WorldMetrics = {
  depth: 0,
  horizontalM: 0,
  frameMs: 16,
  targetDistance: null,
  targetInSight: false,
  sonarDistance: null,
  isThrusting: false,
  reached1000: false,
  reached2000: false,
  zoom: 1.0,
};

let started = false;
let paused = false;
let journalOpen = false;
let controlsOpen = false;
let scanning = false;
let scanProgress = 0;
let lastTick = performance.now();
let lastUi = 0;
let maxDepthRecord = 0;
let milestoneTriggered = false;
let reached1000Notified = false;
let lastAudioZone = '';
let toastTimer: number | undefined;

// Audio System (Web Audio API)
let audioContext: AudioContext | null = null;
let masterGain: GainNode | null = null;
let ambientFilter: BiquadFilterNode | null = null;
let ambientOsc: OscillatorNode | null = null;
let subDroneOsc: OscillatorNode | null = null;
let subDroneGain: GainNode | null = null;
let hydroNoiseGain: GainNode | null = null;
let hydroNoiseFilter: BiquadFilterNode | null = null;
let engineOsc: OscillatorNode | null = null;
let engineGain: GainNode | null = null;
let scanOsc: OscillatorNode | null = null;
let scanGain: GainNode | null = null;

let volume = 0.35;
let muted = readMuted();
let discovered = readDiscovery();

function readDiscovery() {
  try { return localStorage.getItem('descent-v1-vampire-squid') === '1'; }
  catch { return false; }
}
function saveDiscovery() {
  try { localStorage.setItem('descent-v1-vampire-squid', '1'); }
  catch { /* Discovery works for session */ }
}

function readMuted() {
  try { return localStorage.getItem('descent-v1-muted') === '1'; }
  catch { return false; }
}
function saveMuted(state: boolean) {
  try { localStorage.setItem('descent-v1-muted', state ? '1' : '0'); }
  catch { /* Optional storage */ }
}

function setMute(state: boolean) {
  muted = state;
  saveMuted(muted);
  el<HTMLElement>('muteLabel').textContent = muted ? 'MUTED' : 'ON';
  el<HTMLInputElement>('muteSetting').checked = muted;
  if (masterGain && audioContext) {
    masterGain.gain.setTargetAtTime(muted ? 0 : volume, audioContext.currentTime, 0.05);
  }
  toast(muted ? 'AUDIO MUTED' : 'AUDIO ACTIVE');
}

function cancelScan() {
  scanning = false;
  scanProgress = 0;
  world.setScanAssist(false);
  stopScanAudio();
}

function createNoiseBuffer(ctx: AudioContext): AudioBuffer {
  const bufferSize = Math.round(ctx.sampleRate * 2.5);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let lastOut = 0.0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    lastOut = (lastOut * 0.94) + (white * 0.06);
    data[i] = lastOut * 3.2;
  }
  return buffer;
}

function playZoneTransitionAudio(zoneName: string) {
  if (!audioContext || muted || volume === 0) return;
  try {
    const t0 = audioContext.currentTime;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();

    if (zoneName === 'TWILIGHT ZONE') {
      // Descending glass twilight tone
      osc.type = 'sine';
      osc.frequency.setValueAtTime(540, t0);
      osc.frequency.exponentialRampToValueAtTime(340, t0 + 1.2);
      gain.gain.setValueAtTime(volume * 0.09, t0);
      gain.gain.exponentialRampToValueAtTime(0.001, t0 + 1.2);
    } else if (zoneName === 'MIDNIGHT ZONE') {
      // Deep resonant bronze bathypelagic chime
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, t0);
      osc.frequency.exponentialRampToValueAtTime(95, t0 + 1.8);
      gain.gain.setValueAtTime(volume * 0.12, t0);
      gain.gain.exponentialRampToValueAtTime(0.001, t0 + 1.8);
    } else {
      // Surface / Sunlight submerge tone
      osc.type = 'sine';
      osc.frequency.setValueAtTime(420, t0);
      osc.frequency.exponentialRampToValueAtTime(290, t0 + 0.8);
      gain.gain.setValueAtTime(volume * 0.08, t0);
      gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.8);
    }

    osc.connect(gain).connect(audioContext.destination);
    osc.start(t0);
    osc.stop(t0 + 2.0);
  } catch { /* Audio optional */ }
}

function audioStart() {
  try {
    audioContext ??= new AudioContext();
    if (!masterGain) {
      masterGain = audioContext.createGain();
      masterGain.gain.value = muted ? 0 : volume;
      masterGain.connect(audioContext.destination);

      // 1. Primary hydrostatic pressure drone
      ambientOsc = audioContext.createOscillator();
      ambientOsc.type = 'sine';
      ambientOsc.frequency.value = 54;

      ambientFilter = audioContext.createBiquadFilter();
      ambientFilter.type = 'lowpass';
      ambientFilter.frequency.value = 850;

      const ambientGain = audioContext.createGain();
      ambientGain.gain.value = 0.055;

      ambientOsc.connect(ambientFilter).connect(ambientGain).connect(masterGain);
      ambientOsc.start();

      // 2. Sub-bass deep water hydrostatic drone (active in twilight & abyss)
      subDroneOsc = audioContext.createOscillator();
      subDroneOsc.type = 'sine';
      subDroneOsc.frequency.value = 32;

      subDroneGain = audioContext.createGain();
      subDroneGain.gain.value = 0;
      subDroneOsc.connect(subDroneGain).connect(masterGain);
      subDroneOsc.start();

      // 3. Dynamic oceanic water wash & hydrothermal vent convective hiss
      const noiseBuffer = createNoiseBuffer(audioContext);
      const noiseSource = audioContext.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      hydroNoiseFilter = audioContext.createBiquadFilter();
      hydroNoiseFilter.type = 'bandpass';
      hydroNoiseFilter.frequency.value = 550;
      hydroNoiseFilter.Q.value = 1.2;

      hydroNoiseGain = audioContext.createGain();
      hydroNoiseGain.gain.value = 0.035;

      noiseSource.connect(hydroNoiseFilter).connect(hydroNoiseGain).connect(masterGain);
      noiseSource.start();

      // 4. Submersible propulsion thruster hum
      engineOsc = audioContext.createOscillator();
      engineOsc.type = 'triangle';
      engineOsc.frequency.value = 92;

      engineGain = audioContext.createGain();
      engineGain.gain.value = 0;

      engineOsc.connect(engineGain).connect(masterGain);
      engineOsc.start();
    }
    audioContext.resume();
  } catch { /* Audio is optional */ }
}

function updateAudio() {
  if (!audioContext || !masterGain || !ambientFilter || !engineGain || !engineOsc || !ambientOsc) return;
  const isPlaying = started && !paused && !journalOpen && !controlsOpen;
  masterGain.gain.setTargetAtTime(muted || !isPlaying ? 0 : volume, audioContext.currentTime, 0.1);

  const depth = metrics.depth;
  const zone = zoneAt(depth);

  // Trigger dynamic zone transition audio cues
  if (started && isPlaying && lastAudioZone && lastAudioZone !== zone.name) {
    playZoneTransitionAudio(zone.name);
  }
  lastAudioZone = zone.name;

  const now = audioContext.currentTime;

  // 1. Ambient lowpass cutoff falls as hydrostatic pressure increases
  // At surface: 1150 Hz -> Sunlight: 700 Hz -> Twilight: 380 Hz -> Midnight: 180 Hz -> Abyss: 110 Hz
  let cutoff = 1050;
  let droneFreq = 54;
  let subGain = 0;
  let noiseFreq = 650;
  let noiseLevel = 0.035;

  if (depth < 5) {
    // Ocean Surface: open air & bright wave crest wash
    cutoff = 1150;
    droneFreq = 58;
    subGain = 0;
    noiseFreq = 920;
    noiseLevel = 0.055;
  } else if (depth < 200) {
    // Sunlight Zone (Epipelagic)
    const ratio = depth / 200;
    cutoff = 950 - ratio * 300;
    droneFreq = 54 - ratio * 4;
    subGain = 0.01 * ratio;
    noiseFreq = 650 - ratio * 200;
    noiseLevel = 0.035;
  } else if (depth < 1000) {
    // Twilight Zone (Mesopelagic)
    const ratio = (depth - 200) / 800;
    cutoff = 650 - ratio * 370;
    droneFreq = 50 - ratio * 10;
    subGain = 0.01 + ratio * 0.035;
    noiseFreq = 450 - ratio * 230;
    noiseLevel = 0.025;
  } else if (depth < 1850) {
    // Midnight Zone (Bathypelagic)
    const ratio = (depth - 1000) / 850;
    cutoff = 280 - ratio * 140;
    droneFreq = 40 - ratio * 7;
    subGain = 0.045 + ratio * 0.03;
    noiseFreq = 220 - ratio * 90;
    noiseLevel = 0.02;
  } else {
    // Abyssal Rift Floor & Hydrothermal Vents (1,850m - 2,000m)
    const ventProximity = (depth - 1850) / 150;
    cutoff = 140 - ventProximity * 30;
    droneFreq = 33;
    subGain = 0.075;
    // Thermal vent jet hiss and convective rumble
    noiseFreq = 130 + ventProximity * 150;
    noiseLevel = 0.02 + ventProximity * 0.035;
  }

  ambientFilter.frequency.setTargetAtTime(cutoff, now, 0.25);
  ambientOsc.frequency.setTargetAtTime(droneFreq, now, 0.3);

  if (subDroneGain) {
    subDroneGain.gain.setTargetAtTime(isPlaying ? subGain : 0, now, 0.35);
  }

  if (hydroNoiseFilter && hydroNoiseGain) {
    hydroNoiseFilter.frequency.setTargetAtTime(noiseFreq, now, 0.3);
    hydroNoiseGain.gain.setTargetAtTime(isPlaying ? noiseLevel : 0, now, 0.25);
  }

  // Thruster cavitation & motor hum
  if (metrics.isThrusting && isPlaying) {
    engineGain.gain.setTargetAtTime(0.045, now, 0.08);
    engineOsc.frequency.setTargetAtTime(115, now, 0.1);
  } else {
    engineGain.gain.setTargetAtTime(0, now, 0.25);
    engineOsc.frequency.setTargetAtTime(92, now, 0.25);
  }
}

function pingAudio(contactDistance: number | null) {
  if (!audioContext || muted || volume === 0) return;
  try {
    const t0 = audioContext.currentTime;

    // Primary outbound acoustic sweep
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(860, t0);
    osc.frequency.exponentialRampToValueAtTime(360, t0 + 0.75);

    gain.gain.setValueAtTime(volume * 0.14, t0);
    gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.75);

    osc.connect(gain).connect(audioContext.destination);
    osc.start(t0);
    osc.stop(t0 + 0.76);

    // Sonar contact echo return chirp if an object is within detection range
    if (contactDistance !== null && contactDistance < 120 && !discovered) {
      const echoDelay = 0.25 + (contactDistance / 120) * 0.45;
      const echoTime = t0 + echoDelay;
      const echoOsc = audioContext.createOscillator();
      const echoGain = audioContext.createGain();

      echoOsc.type = 'sine';
      echoOsc.frequency.setValueAtTime(1180, echoTime);
      echoOsc.frequency.exponentialRampToValueAtTime(940, echoTime + 0.22);

      echoGain.gain.setValueAtTime(volume * 0.1, echoTime);
      echoGain.gain.exponentialRampToValueAtTime(0.001, echoTime + 0.22);

      echoOsc.connect(echoGain).connect(audioContext.destination);
      echoOsc.start(echoTime);
      echoOsc.stop(echoTime + 0.23);
    }
  } catch { /* sound ignore */ }
}

function updateScanAudio(progress: number) {
  if (!audioContext || muted || volume === 0) return;
  try {
    if (!scanOsc) {
      scanOsc = audioContext.createOscillator();
      scanOsc.type = 'sine';
      scanGain = audioContext.createGain();
      scanGain.gain.value = 0;
      scanOsc.connect(scanGain).connect(audioContext.destination);
      scanOsc.start();
    }
    const t = audioContext.currentTime;
    scanOsc.frequency.setTargetAtTime(640 + progress * 720, t, 0.05);
    scanGain?.gain.setTargetAtTime(volume * 0.07, t, 0.05);
  } catch { /* ignore */ }
}

function stopScanAudio() {
  if (!scanGain || !audioContext) return;
  scanGain.gain.setTargetAtTime(0, audioContext.currentTime, 0.08);
}

function discoveryAudio() {
  if (!audioContext || muted || volume === 0) return;
  try {
    const t0 = audioContext.currentTime;
    // Harmonic resonant chord (Eb4, G4, Bb4, Eb5)
    const chord = [311.13, 392.00, 466.16, 622.25];
    chord.forEach((freq, idx) => {
      const osc = audioContext!.createOscillator();
      const gain = audioContext!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t0 + idx * 0.07);

      gain.gain.setValueAtTime(volume * 0.09, t0 + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, t0 + 1.8);

      osc.connect(gain).connect(audioContext!.destination);
      osc.start(t0 + idx * 0.07);
      osc.stop(t0 + 1.85);
    });
  } catch { /* ignore */ }
}

function milestoneAudio() {
  if (!audioContext || muted || volume === 0) return;
  try {
    const t0 = audioContext.currentTime;
    const notes = [130.81, 196.00, 261.63, 329.63]; // C3, G3, C4, E4
    notes.forEach((freq, idx) => {
      const osc = audioContext!.createOscillator();
      const gain = audioContext!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t0 + idx * 0.12);

      gain.gain.setValueAtTime(volume * 0.12, t0 + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, t0 + 2.5);

      osc.connect(gain).connect(audioContext!.destination);
      osc.start(t0 + idx * 0.12);
      osc.stop(t0 + 2.55);
    });
  } catch { /* ignore */ }
}

function switchAudio() {
  if (!audioContext || muted || volume === 0) return;
  try {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(420, audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(180, audioContext.currentTime + 0.06);
    gain.gain.setValueAtTime(volume * 0.1, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.06);
    osc.connect(gain).connect(audioContext.destination);
    osc.start(); osc.stop(audioContext.currentTime + 0.065);
  } catch { /* ignore */ }
}

function toast(message: string) {
  const node = el<HTMLElement>('toast');
  node.textContent = message;
  show(node, true);
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => show(node, false), 3700);
}

function vampireSquidSvg() {
  return `
    <div class="specimen-plate">
      <div class="plate-badge">CLASSIFICATION // CEPHALOPODA · VAMPYROMORPHA</div>
      <svg class="specimen-diagram" viewBox="0 0 340 240" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="specimenAura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#49a8be" stop-opacity="0.25"/>
            <stop offset="100%" stop-color="#49a8be" stop-opacity="0"/>
          </radialGradient>
          <linearGradient id="specimenMantle" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#722b49"/>
            <stop offset="100%" stop-color="#3b1625"/>
          </linearGradient>
          <linearGradient id="specimenWeb" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#4e2034"/>
            <stop offset="100%" stop-color="#250d18"/>
          </linearGradient>
        </defs>
        <circle cx="170" cy="120" r="100" fill="url(#specimenAura)" />
        <!-- Retractile sensory filaments -->
        <path d="M 140 130 C 100 160 80 190 60 220" stroke="rgba(195,245,255,0.4)" stroke-width="1.2" fill="none" stroke-dasharray="3 3"/>
        <path d="M 200 130 C 240 160 260 190 280 220" stroke="rgba(195,245,255,0.4)" stroke-width="1.2" fill="none" stroke-dasharray="3 3"/>
        <!-- Interbrachial web cloak -->
        <path d="M 145 105 C 120 120 100 160 115 195 Q 140 180 152 205 Q 162 188 170 208 Q 178 188 188 205 Q 200 180 225 195 C 240 160 220 120 195 105 Z" fill="url(#specimenWeb)" stroke="rgba(215,115,160,0.6)" stroke-width="1.5"/>
        <!-- Arms and photophores -->
        <circle cx="115" cy="195" r="3" fill="#82f5ff" />
        <circle cx="152" cy="205" r="3" fill="#82f5ff" />
        <circle cx="170" cy="208" r="3" fill="#82f5ff" />
        <circle cx="188" cy="205" r="3" fill="#82f5ff" />
        <circle cx="225" cy="195" r="3" fill="#82f5ff" />
        <!-- Velvet mantle -->
        <path d="M 140 110 C 138 70 155 35 170 32 C 185 35 202 70 200 110 Q 170 130 140 110 Z" fill="url(#specimenMantle)" stroke="rgba(215,115,160,0.6)" stroke-width="1.5"/>
        <!-- Fins -->
        <ellipse cx="132" cy="65" rx="22" ry="9" transform="rotate(-25 132 65)" fill="#8d3b5d" stroke="rgba(228,135,178,0.6)" stroke-width="1.2"/>
        <ellipse cx="208" cy="65" rx="22" ry="9" transform="rotate(25 208 65)" fill="#8d3b5d" stroke="rgba(228,135,178,0.6)" stroke-width="1.2"/>
        <!-- Lucid sapphire eyes -->
        <circle cx="154" cy="105" r="7" fill="#1b4d58" stroke="#48b8c2" stroke-width="1.2"/>
        <circle cx="153" cy="104" r="3" fill="#061318"/>
        <circle cx="151.5" cy="102.5" r="1.5" fill="#ffffff"/>
        <circle cx="186" cy="105" r="7" fill="#1b4d58" stroke="#48b8c2" stroke-width="1.2"/>
        <circle cx="187" cy="104" r="3" fill="#061318"/>
        <circle cx="185.5" cy="102.5" r="1.5" fill="#ffffff"/>
      </svg>
      <div class="plate-annotations">
        <span><b>01.</b> Apical swimming fins</span>
        <span><b>02.</b> Lucid sapphire eye</span>
        <span><b>03.</b> Bioluminescent photophores</span>
        <span><b>04.</b> Sensory feeding filaments</span>
      </div>
    </div>
  `;
}

function journalContent() {
  el<HTMLElement>('journalCount').textContent = discovered ? '01' : '00';
  el<HTMLElement>('entryState').textContent = discovered ? 'CATALOGUED' : 'UNDISCOVERED';
  el<HTMLElement>('journalMaxDepth').textContent = `${Math.round(maxDepthRecord)} m`;
  el<HTMLElement>('journalDiscoveredCount').textContent = discovered ? '1 of 1 Species' : '0 of 1 Species';
  el<HTMLElement>('journalStatus').textContent = metrics.reached2000 ? '2,000 M FLOOR REACHED' : metrics.reached1000 ? '1,000 M BATHYPELAGIC' : 'EXPEDITION ACTIVE';

  const entry = el<HTMLElement>('journalEntry');
  if (!discovered) {
    entry.innerHTML = `
      <div class="empty-journal">
        <span>◇</span>
        <h3>No entries yet</h3>
        <p>Descend into the twilight zone (600–900 m). Follow a sonar contact with <kbd>R</kbd> and press <kbd>E</kbd> while looking at the organism to catalog it.</p>
      </div>
    `;
    return;
  }

  entry.innerHTML = `
    <div class="entry-kicker">SPECIES // DOCUMENTED ORGANISM</div>
    <h3>${vampireSquid.name}</h3>
    <p class="latin">${vampireSquid.scientificName}</p>
    ${vampireSquidSvg()}
    <div class="entry-facts">
      <div><span>REPORTED DEPTH</span><strong>${vampireSquid.depth}</strong></div>
      <div><span>HABITAT</span><strong>${vampireSquid.habitat}</strong></div>
      <div><span>DIET</span><strong>Marine snow (detritivore)</strong></div>
      <div><span>SIZE</span><strong>~28 cm (illustration enlarged)</strong></div>
    </div>
    <p>${vampireSquid.description}</p>
    <p>${vampireSquid.detail}</p>
    <div class="entry-source">
      <span>SCIENTIFIC SOURCE & INSTITUTION</span>
      <a href="${vampireSquid.source.url}" target="_blank" rel="noopener noreferrer">${vampireSquid.source.title} ↗</a>
      <small>${vampireSquid.source.publisher} · Accessed ${vampireSquid.source.accessedOn}</small>
    </div>
  `;
}

function setPause(next: boolean) {
  if (next) cancelScan();
  paused = next;
  show(el<HTMLElement>('pauseOverlay'), next);
  if (next) world.pause();
  else if (!journalOpen && !controlsOpen && started) world.start();
  updateAudio();
}

function setJournal(next: boolean) {
  if (next) { cancelScan(); setControls(false); }
  journalOpen = next;
  show(el<HTMLElement>('journalOverlay'), next);
  if (next) { journalContent(); world.pause(); }
  else if (!paused && !controlsOpen && started) world.start();
  updateAudio();
}

function setControls(next: boolean) {
  if (next) { cancelScan(); setJournal(false); }
  controlsOpen = next;
  show(el<HTMLElement>('controlsOverlay'), next);
  if (next) world.pause();
  else if (!paused && !journalOpen && started) world.start();
  updateAudio();
}

function finishScan() {
  cancelScan();
  world.markDiscovered();
  discovered = true;
  saveDiscovery();
  journalContent();
  discoveryAudio();
  show(el<HTMLElement>('scanMeter'), false);
  show(el<HTMLElement>('targetPrompt'), false);
  toast('SPECIES CATALOGUED · VAMPIRE SQUID [OPEN JOURNAL: J]');
}

function onTick(next: WorldMetrics) {
  metrics = next;
  if (metrics.depth > maxDepthRecord) {
    maxDepthRecord = metrics.depth;
    el<HTMLElement>('maxDepthRecord').textContent = `${Math.round(maxDepthRecord)} m`;
  }

  // 1,000 m Bathypelagic Gateway Check
  if (metrics.reached1000 && !reached1000Notified) {
    reached1000Notified = true;
    toast('1,000 M DEPTH · ENTERING THE MIDNIGHT ABYSS');
    milestoneAudio();
  }

  // 2,000 m Abyssal Benthic Floor Milestone Check
  if (metrics.reached2000 && !milestoneTriggered) {
    milestoneTriggered = true;
    show(el<HTMLElement>('milestoneCard'), true);
    milestoneAudio();
    toast('2,000 M REACHED · ABYSSAL BENTHIC FLOOR');
  }

  // Auto-dismiss surface directive if descended past 5m
  if (metrics.depth > 5 && !el<HTMLElement>('surfaceDirective').classList.contains('is-dismissed')) {
    el<HTMLElement>('surfaceDirective').classList.add('is-hidden');
  }

  const now = performance.now();
  const dt = Math.min((now - lastTick) / 1000, 0.05);
  lastTick = now;

  if (scanning && metrics.targetInSight) {
    scanProgress = Math.min(1, scanProgress + dt / 1.65);
    updateScanAudio(scanProgress);
  } else {
    scanProgress = Math.max(0, scanProgress - dt * 0.7);
    if (scanProgress === 0) stopScanAudio();
  }

  if (scanning && (metrics.targetDistance === null || metrics.targetDistance > 28)) {
    cancelScan();
  }
  if (scanProgress >= 1) finishScan();

  updateAudio();

  if (now - lastUi < 60) return;
  lastUi = now;

  const depth = metrics.depth;
  const zone = zoneAt(depth);
  el<HTMLElement>('depth').textContent = Math.round(depth).toString().padStart(3, '0');
  el<HTMLElement>('zoneName').textContent = zone.name;
  el<HTMLElement>('zoneSubtitle').textContent = zone.subtitle;
  el<HTMLElement>('pressure').textContent = `~${(1 + depth / 10).toFixed(1)} atm`;
  el<HTMLElement>('light').textContent = `${Math.round(Math.pow(1 - Math.min(depth / 1000, 1), 2.6) * 100)}%`;
  el<HTMLElement>('depthProgress').style.width = `${Math.min(depth / 2000, 1) * 100}%`;
  el<HTMLElement>('fpsDisplay').textContent = `${Math.round(1000 / Math.max(metrics.frameMs, 1))} FPS`;
  const zoomDisplay = el<HTMLElement>('zoomDisplay');
  if (zoomDisplay) {
    zoomDisplay.textContent = `${Math.round(metrics.zoom * 100)}% ZOOM`;
  }

  show(el<HTMLElement>('targetPrompt'), metrics.targetInSight && !discovered && !scanning);
  show(el<HTMLElement>('scanMeter'), scanProgress > 0 && !discovered);
  el<HTMLElement>('scanFill').style.width = `${scanProgress * 100}%`;

  const hasSonarContact = metrics.sonarDistance !== null && metrics.sonarDistance < 120 && !discovered;
  show(el<HTMLElement>('sonarContact'), hasSonarContact);
  el<HTMLElement>('sonarRange').textContent = hasSonarContact ? `${Math.round(metrics.sonarDistance!)} M` : '— M';

  if (el<HTMLElement>('sonarState').textContent === 'PINGING') {
    el<HTMLElement>('sonarContact').style.top = `${40 + Math.sin(now / 900) * 4}%`;
  }

  el<HTMLElement>('debugStats').innerHTML = `DEPTH ${depth.toFixed(1)} M<br>HORIZONTAL ${metrics.horizontalM.toFixed(1)} M<br>FRAME ${metrics.frameMs.toFixed(1)} MS<br>QUALITY ${world.getQuality().toUpperCase()}<br>ZONE ${zone.name}`;
}

try {
  world = new OceanWorld(canvas, onTick);
  if (discovered) world.markDiscovered();
  journalContent();
  world.start();
} catch (error) {
  console.error(error);
  show(el<HTMLElement>('fatal'), true);
  throw error;
}

// UI Event Handlers
el<HTMLButtonElement>('beginBtn').addEventListener('click', () => {
  started = true;
  show(el<HTMLElement>('intro'), false);
  show(el<HTMLElement>('hud'), true);
  audioStart();
  updateAudio();
  world.start();
  toast('EXPEDITION INITIALIZED · ALL SYSTEMS NORMAL');
});

el<HTMLButtonElement>('pauseBtn').addEventListener('click', () => setPause(true));
el<HTMLButtonElement>('resumeBtn').addEventListener('click', () => setPause(false));
el<HTMLButtonElement>('journalBtn').addEventListener('click', () => setJournal(true));
el<HTMLButtonElement>('closeJournalBtn').addEventListener('click', () => setJournal(false));
el<HTMLButtonElement>('controlsBtn').addEventListener('click', () => setControls(true));
el<HTMLButtonElement>('closeControlsBtn').addEventListener('click', () => setControls(false));
el<HTMLButtonElement>('muteBtn').addEventListener('click', () => setMute(!muted));
el<HTMLInputElement>('muteSetting').addEventListener('change', (e) => setMute((e.target as HTMLInputElement).checked));
el<HTMLInputElement>('tagsSetting').addEventListener('change', (e) => toggleTags((e.target as HTMLInputElement).checked));

el<HTMLButtonElement>('dismissDirective').addEventListener('click', () => {
  el<HTMLElement>('surfaceDirective').classList.add('is-hidden', 'is-dismissed');
});

el<HTMLButtonElement>('milestoneCloseBtn').addEventListener('click', () => {
  show(el<HTMLElement>('milestoneCard'), false);
});

el<HTMLButtonElement>('settingsBtn').addEventListener('click', () => {
  el<HTMLElement>('settings').classList.toggle('is-hidden');
});

el<HTMLSelectElement>('quality').addEventListener('change', (e) => {
  world.setQuality((e.target as HTMLSelectElement).value as Quality);
});

el<HTMLInputElement>('volume').addEventListener('input', (e) => {
  volume = Number((e.target as HTMLInputElement).value) / 100;
  updateAudio();
});

el<HTMLElement>('zoomDisplay')?.addEventListener('click', () => {
  world.resetZoom();
  toast('CAMERA ZOOM RESET · 100%');
});

el<HTMLInputElement>('reducedMotion').addEventListener('change', (e) => {
  document.body.classList.toggle('reduced-motion', (e.target as HTMLInputElement).checked);
});

el<HTMLButtonElement>('resetProgress').addEventListener('click', () => {
  try {
    localStorage.removeItem('descent-v1-vampire-squid');
    localStorage.removeItem('descent-v1-muted');
  } catch { /* Storage */ }
  location.reload();
});

el<HTMLInputElement>('debugDepth').addEventListener('input', (e) => {
  const depth = Number((e.target as HTMLInputElement).value);
  world.vehicle.position.y = depth === 0 ? 3 : -depth;
});

el<HTMLButtonElement>('debugLight').addEventListener('click', () => world.toggleLights());
el<HTMLButtonElement>('entryTab').addEventListener('click', () => journalContent());

// Light Dismiss for all modal overlays
for (const overlayId of ['pauseOverlay', 'journalOverlay', 'controlsOverlay']) {
  el<HTMLElement>(overlayId).addEventListener('click', (event) => {
    if (event.target === el<HTMLElement>(overlayId)) {
      if (overlayId === 'pauseOverlay') setPause(false);
      else if (overlayId === 'journalOverlay') setJournal(false);
      else if (overlayId === 'controlsOverlay') setControls(false);
    }
  });
}

// Touch Controls for Mobile / Tablets
const bindTouch = (id: string, code: string) => {
  const btn = el<HTMLButtonElement>(id);
  if (!btn) return;
  const start = (e: Event) => { e.preventDefault(); world.setKey(code, true); };
  const end = (e: Event) => { e.preventDefault(); world.setKey(code, false); };
  btn.addEventListener('touchstart', start, { passive: false });
  btn.addEventListener('touchend', end, { passive: false });
  btn.addEventListener('mousedown', start);
  btn.addEventListener('mouseup', end);
  btn.addEventListener('mouseleave', end);
};

bindTouch('touchUp', 'KeyW');
bindTouch('touchDown', 'KeyS');
bindTouch('touchLeft', 'KeyA');
bindTouch('touchRight', 'KeyD');

el<HTMLButtonElement>('touchSonar')?.addEventListener('click', () => triggerSonar());
el<HTMLButtonElement>('touchLight')?.addEventListener('click', () => toggleLights());
el<HTMLButtonElement>('touchScan')?.addEventListener('click', () => {
  if (metrics.targetInSight && !discovered) {
    scanning = true;
    world.setScanAssist(true);
    toast('SCAN INITIATED · STAY NEAR SPECIMEN');
  }
});
el<HTMLButtonElement>('touchJournal')?.addEventListener('click', () => setJournal(!journalOpen));

function triggerSonar() {
  const range = world.ping();
  pingAudio(range);
  el<HTMLElement>('sonarState').textContent = 'PINGING';
  window.setTimeout(() => { el<HTMLElement>('sonarState').textContent = 'STANDBY'; }, 1700);
  toast(range !== null && range < 120 && !discovered ? `CONTACT DETECTED · ${Math.round(range)} M` : 'NO CONTACT WITHIN RANGE');
}

function toggleLights() {
  const active = world.toggleLights();
  switchAudio();
  toast(active ? 'FLOODLIGHTS ACTIVE' : 'FLOODLIGHTS OFFLINE');
}

function toggleTags(enabled?: boolean) {
  const current = world.getTagsEnabled();
  const next = enabled !== undefined ? enabled : !current;
  world.setTagsEnabled(next);
  const tagCheckbox = el<HTMLInputElement>('tagsSetting');
  if (tagCheckbox) tagCheckbox.checked = next;
  toast(next ? 'CREATURE TAGS · ACTIVE' : 'CREATURE TAGS · MUTED');
}

window.addEventListener('resize', () => world.resize());

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    world.pause();
    updateAudio();
  } else if (!paused && !journalOpen && !controlsOpen && started) {
    world.start();
    updateAudio();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.code === 'F1') {
    event.preventDefault();
    el<HTMLElement>('debug').classList.toggle('is-hidden');
    return;
  }
  if (!started) return;

  if (event.code === 'Escape') {
    if (controlsOpen) { setControls(false); return; }
    if (journalOpen) { setJournal(false); return; }
    setPause(!paused);
    return;
  }

  if (event.code === 'KeyJ') { setJournal(!journalOpen); return; }
  if (event.code === 'Slash' || event.code === 'KeyH') { setControls(!controlsOpen); return; }
  if (event.code === 'KeyM') { setMute(!muted); return; }
  if (event.code === 'KeyT') { toggleTags(); return; }
  if (event.code === 'KeyZ') {
    world.resetZoom();
    toast('CAMERA ZOOM RESET · 100%');
    return;
  }

  if (paused || journalOpen || controlsOpen) return;

  if (['Space', 'ShiftLeft', 'ShiftRight', 'KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyE', 'KeyF', 'KeyR'].includes(event.code)) {
    event.preventDefault();
  }

  world.setKey(event.code, true);
  if (event.repeat) return;

  if (event.code === 'KeyF') toggleLights();
  if (event.code === 'KeyR') triggerSonar();
  if (event.code === 'KeyE' && metrics.targetInSight && !discovered) {
    scanning = true;
    world.setScanAssist(true);
    toast('SCAN INITIATED · STAY NEAR SPECIMEN');
  }
});

document.addEventListener('keyup', (event) => {
  world.setKey(event.code, false);
});

window.addEventListener('blur', () => {
  world.clearKeys();
  cancelScan();
});

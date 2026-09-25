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
import { documentedSpecimens, documentedSites, type Specimen, type Site, zoneAt } from './content';
import { initVisitorCounter } from './visitorCounter';

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
        <div id="visitor-counter-mount"></div>
        <button id="controlsBtn" class="text-button" type="button" aria-label="Controls manual">MANUAL <span class="key-badge">?</span></button>
        <button id="muteBtn" class="text-button" type="button" aria-label="Toggle audio">AUDIO <span id="muteLabel">ON</span></button>
        <button id="journalBtn" class="text-button" type="button">FIELD JOURNAL <span id="journalCount">00/08</span></button>
      </div>
      <button id="pauseBtn" class="icon-button" type="button" aria-label="Pause expedition">Ⅱ</button>
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
    <div id="targetPrompt" class="target-prompt is-hidden"><span class="target-prompt-dot"></span><span id="targetPromptText">SPECIMEN IN SIGHT<br><em>HOLD E TO SCAN</em></span></div>
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
      <p>Dive from the sunlit surface down through the 2,000 m hydrothermal rift, 4,000 m abyssal plain, and 6,000 m subduction fault all the way to <strong>11,000 m at Challenger Deep</strong>. Locate <strong>8 documented species</strong> with sonar (<kbd>R</kbd>), scan with (<kbd>E</kbd>), and compile your scientific Field Journal (<kbd>J</kbd>).</p>
      <div class="directive-keys">
        <span><kbd>W</kbd><kbd>S</kbd> Dive / Rise</span>
        <span><kbd>A</kbd><kbd>D</kbd> Drift</span>
        <span><kbd>Shift</kbd> Boost</span>
        <span><kbd>C</kbd> Speed</span>
        <span><kbd>R</kbd> Sonar</span>
        <span><kbd>E</kbd> Scan</span>
        <span><kbd>F</kbd> Lights</span>
      </div>
    </div>

    <!-- Contextual Pilot Guidance Prompt -->
    <div id="pilotTip" class="pilot-tip is-hidden" role="status">
      <span class="tip-dot"></span>
      <span id="tipText">PILOT CONTROL · PRESS <kbd>S</kbd> OR <kbd>▼</kbd> TO DIVE</span>
      <button id="dismissTipBtn" class="tip-close" type="button" aria-label="Dismiss tip">×</button>
    </div>

    <!-- 11,000m Milestone Celebration Card -->
    <div id="milestoneCard" class="milestone-card is-hidden" role="alert">
      <div class="milestone-tag">EXPEDITION MILESTONE · 11,000 M</div>
      <h3>Challenger Deep Seafloor Reached</h3>
      <p>You have reached Earth's absolute deepest ocean trench floor at 10,928–11,000 m depth. Hydrostatic pressure exceeds 1,080 atmospheres (>16,000 psi). Resting on the soft diatomaceous pelagic ooze alongside the historic monuments of Bathyscaphe <em>Trieste</em> (1960) and <em>Deepsea Challenger</em> (2012), the supergiant amphipod <em>Alicella gigantea</em> thrives. Open your field journal (<kbd>J</kbd>) to complete your survey.</p>
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
      <div class="bottom-left"><span class="latitude">SIMULATED EXPEDITION</span><span class="bottom-rule"></span><span>0 → 11,000 M</span></div>
      <div class="control-strip">
        <span><kbd>A</kbd><kbd>D</kbd> DRIFT</span>
        <span><kbd>W</kbd><kbd>S</kbd> RISE / DIVE</span>
        <span><kbd>Shift</kbd> BOOST</span>
        <span><kbd>C</kbd> SPEED</span>
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
        <span class="speed-badge" id="speedDisplay" title="Thrust speed tier — press C to cycle, 1–5 to set">1× SPEED</span>
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
      <span class="scope-label scope-label-bottom">CHALLENGER DEEP / 11,000 M</span>
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
              <div class="key-combo"><kbd>Space</kbd></div>
              <span class="key-desc">Alternate rise</span>
            </li>
            <li>
              <div class="key-combo"><kbd>Shift</kbd><span>+</span><kbd>W A S D</kbd></div>
              <span class="key-desc">Thruster boost (2.2× thrust)</span>
            </li>
            <li>
              <div class="key-combo"><kbd>C</kbd><span>/</span><kbd>1</kbd><span>–</span><kbd>5</kbd></div>
              <span class="key-desc">Thrust speed tier (1×–5× superspeed)</span>
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
          <div id="journalEntriesList" class="journal-entries-list"></div>
          <div class="journal-expedition-stats">
            <span>EXPEDITION METRICS</span>
            <div><small>MISSION DEPTH</small><strong id="journalMaxDepth">000 m</strong></div>
            <div><small>CATALOGUED</small><strong id="journalDiscoveredCount">0 of 4 Species</strong></div>
            <div><small>SURVEY STATUS</small><strong id="journalStatus">ACTIVE DESCENT</strong></div>
            <div id="surveyBadgeContainer"></div>
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

  <section id="photoOverlay" class="modal-overlay is-hidden" aria-labelledby="photoTitle">
    <div class="modal photo-modal">
      <div class="photo-frame">
        <img id="photoImage" class="photo-image" alt="Real-life reference photograph of the documented organism" />
        <button id="closePhotoBtn" class="icon-button photo-close" type="button" aria-label="Close reference photo">×</button>
      </div>
      <div class="photo-body">
        <p id="photoEyebrow" class="eyebrow">FIELD REFERENCE PHOTOGRAPH</p>
        <h2 id="photoTitle"></h2>
        <p id="photoCaption" class="photo-caption"></p>
        <div id="photoFacts" class="entry-facts photo-facts"></div>
        <div id="photoSource" class="entry-source">
          <span>PHOTOGRAPH CREDIT</span>
          <small id="photoCredit"></small>
          <a id="photoPageLink" href="#" target="_blank" rel="noopener noreferrer">View on Wikimedia Commons ↗</a>
        </div>
        <div id="photoActions" class="modal-actions">
          <button id="photoJournalBtn" class="secondary-button" type="button">OPEN IN FIELD JOURNAL</button>
        </div>
      </div>
    </div>
  </section>

  <aside id="debug" class="debug is-hidden">
    <div>DEBUG / SEED 183729</div>
    <div id="debugStats">—</div>
    <label>TELEPORT DEPTH <input id="debugDepth" type="range" min="0" max="11000" step="1" value="0" /></label>
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
  targetSpecimenId: null,
  targetSpecimenName: null,
  sonarDistance: null,
  sonarTargetName: null,
  isThrusting: false,
  isBoosting: false,
  speedMultiplier: 1,
  reached1000: false,
  reached2000: false,
  reached3000: false,
  reached3800: false,
  reached4000: false,
  reached5000: false,
  reached6000: false,
  reached7000: false,
  reached8000: false,
  reached9000: false,
  reached10000: false,
  reached11000: false,
  zoom: 1.0,
  waterTransition: null,
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
let reached2000Notified = false;
let reached3000Notified = false;
let reached4000Notified = false;
let reached5000Notified = false;
let reached6000Notified = false;
let reached7000Notified = false;
let reached8000Notified = false;
let reached9000Notified = false;
let reached10000Notified = false;
let reached11000Notified = false;
let reached3800Notified = false;
let boostToastShown = false;
let lastAudioZone = '';
let toastTimer: number | undefined;

let pilotGuideComplete = readPilotGuideComplete();
let pilotStep: 'dive' | 'systems' | 'tags' | 'done' = pilotGuideComplete ? 'done' : 'dive';

function readPilotGuideComplete() {
  try { return localStorage.getItem('descent-v1-guide-completed') === '1'; }
  catch { return false; }
}
function savePilotGuideComplete() {
  try { localStorage.setItem('descent-v1-guide-completed', '1'); }
  catch { /* storage */ }
}

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
let discoveredIds: string[] = readDiscoveries();
let discoveredSiteIds: string[] = readDiscoveredSites();
let selectedSpecimenId: string = documentedSpecimens[0].id;
let selectedSiteId: string | null = null;

function readDiscoveries(): string[] {
  try {
    const raw = localStorage.getItem('descent-v1-discovered-species');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
    if (localStorage.getItem('descent-v1-vampire-squid') === '1') {
      return ['vampire-squid'];
    }
    return [];
  } catch {
    return [];
  }
}

function saveDiscoveries() {
  try {
    localStorage.setItem('descent-v1-discovered-species', JSON.stringify(discoveredIds));
    if (discoveredIds.includes('vampire-squid')) {
      localStorage.setItem('descent-v1-vampire-squid', '1');
    }
  } catch { /* session storage */ }
}

function readDiscoveredSites(): string[] {
  try {
    const raw = localStorage.getItem('descent-v1-discovered-sites');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
    return [];
  } catch {
    return [];
  }
}

function saveDiscoveredSites() {
  try {
    localStorage.setItem('descent-v1-discovered-sites', JSON.stringify(discoveredSiteIds));
  } catch { /* session storage */ }
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
  const isPlaying = started && !paused && !journalOpen && !controlsOpen && !photoOpen;
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
    // Midnight Zone (Upper Bathypelagic)
    const ratio = (depth - 1000) / 850;
    cutoff = 280 - ratio * 140;
    droneFreq = 40 - ratio * 7;
    subGain = 0.045 + ratio * 0.03;
    noiseFreq = 220 - ratio * 90;
    noiseLevel = 0.02;
  } else if (depth < 2350) {
    // Mid-Ocean Hydrothermal Rift Ridge (1,850m - 2,350m)
    const ventProximity = 1 - Math.abs(depth - 2000) / 350;
    cutoff = 140 - ventProximity * 30;
    droneFreq = 33;
    subGain = 0.075;
    // Thermal vent convective rumble and particulate hiss
    noiseFreq = 130 + ventProximity * 150;
    noiseLevel = 0.02 + ventProximity * 0.035;
  } else if (depth < 3800) {
    // Lower Bathypelagic & Whale Fall Chemosynthetic Oasis (2,350m - 3,800m)
    const ratio = (depth - 2350) / 1450;
    cutoff = 120 - ratio * 40;
    droneFreq = 28 - ratio * 4;
    subGain = 0.08 + ratio * 0.02;
    noiseFreq = 95 - ratio * 25;
    noiseLevel = 0.015;
  } else if (depth < 5500) {
    // Abyssal Plain Floor & Sediment Basin (3,800m - 5,500m)
    const ratio = (depth - 3800) / 1700;
    cutoff = 75 - ratio * 20;
    droneFreq = 22 - ratio * 3;
    subGain = 0.095 + ratio * 0.015;
    noiseFreq = 65 - ratio * 15;
    noiseLevel = 0.012;
  } else if (depth < 6700) {
    // Hadal Subduction Fault Gateway (5,500m - 6,700m)
    const faultProximity = (depth - 5500) / 1200;
    cutoff = 55 + faultProximity * 20;
    droneFreq = 18 - faultProximity * 2; // Deep tectonic infrasound resonance
    subGain = 0.12;
    // Tectonic plate subduction shear rumble and friction hiss
    noiseFreq = 50 + faultProximity * 60;
    noiseLevel = 0.014 + faultProximity * 0.02;
  } else if (depth < 8500) {
    // Mariana Trench Chasm & Cold Seeps (6,700m - 8,500m)
    const trenchRatio = (depth - 6700) / 1800;
    cutoff = 48 - trenchRatio * 12;
    droneFreq = 15 - trenchRatio * 2; // Low-frequency hadal canyon reverberation
    subGain = 0.14 + trenchRatio * 0.02;
    noiseFreq = 42 + trenchRatio * 25;
    noiseLevel = 0.012 + trenchRatio * 0.015;
  } else {
    // Challenger Deep Terminal Seafloor (8,500m - 11,000m)
    const abyssRatio = Math.min((depth - 8500) / 2500, 1);
    cutoff = 36 - abyssRatio * 10;
    droneFreq = 13 - abyssRatio * 2; // Deepest 11 Hz sub-audible infrasound bedrock resonance
    subGain = 0.16 + abyssRatio * 0.04;
    // Crushing hydrostatic pressure stillness & gentle diatomaceous sediment displacement
    noiseFreq = 34 + abyssRatio * 18;
    noiseLevel = 0.008 + abyssRatio * 0.012;
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
    if (contactDistance !== null && contactDistance < 150) {
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

function splashAudio(type: 'breach' | 'plunge') {
  if (!audioContext || muted || volume === 0) return;
  try {
    const t0 = audioContext.currentTime;
    const bufferSize = Math.floor(audioContext.sampleRate * 0.42);
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (audioContext.sampleRate * 0.12));
    }
    const noise = audioContext.createBufferSource();
    noise.buffer = buffer;

    const filter = audioContext.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = 1.9;
    filter.frequency.setValueAtTime(type === 'plunge' ? 680 : 420, t0);
    filter.frequency.exponentialRampToValueAtTime(type === 'plunge' ? 160 : 780, t0 + 0.38);

    const gain = audioContext.createGain();
    gain.gain.setValueAtTime(volume * 0.22, t0);
    gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.4);

    noise.connect(filter).connect(gain).connect(audioContext.destination);
    noise.start(t0);

    const osc = audioContext.createOscillator();
    const oscGain = audioContext.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(type === 'plunge' ? 95 : 60, t0);
    osc.frequency.exponentialRampToValueAtTime(type === 'plunge' ? 36 : 105, t0 + 0.32);

    oscGain.gain.setValueAtTime(volume * 0.18, t0);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.35);

    osc.connect(oscGain).connect(audioContext.destination);
    osc.start(t0);
    osc.stop(t0 + 0.36);
  } catch { /* ignore */ }
}

function updatePilotTip() {
  if (pilotGuideComplete || pilotStep === 'done') {
    show(el<HTMLElement>('pilotTip'), false);
    return;
  }
  const tip = el<HTMLElement>('pilotTip');
  const text = el<HTMLElement>('tipText');
  if (!tip || !text) return;

  // Keep the tutorial tip from stacking on top of the directive card.
  if (!el<HTMLElement>('surfaceDirective').classList.contains('is-hidden')) {
    show(tip, false);
    return;
  }

  if (pilotStep === 'dive') {
    if (metrics.depth > 3) {
      pilotStep = 'systems';
    } else {
      text.innerHTML = `PILOT CONTROL · PRESS <kbd>W</kbd>/<kbd>S</kbd> OR <kbd>▲</kbd>/<kbd>▼</kbd> TO DIVE & RISE`;
      show(tip, true);
      return;
    }
  }

  if (pilotStep === 'systems') {
    if (metrics.depth > 35 || world.getLights() === false) {
      pilotStep = 'tags';
    } else {
      text.innerHTML = `SYSTEMS TELEMETRY · PRESS <kbd>F</kbd> FOR FLOODLIGHTS · <kbd>R</kbd> FOR ACTIVE SONAR`;
      show(tip, true);
      return;
    }
  }

  if (pilotStep === 'tags') {
    if (metrics.depth > 65 || discoveredIds.length > 0) {
      pilotStep = 'done';
      pilotGuideComplete = true;
      savePilotGuideComplete();
      show(tip, false);
      return;
    } else {
      text.innerHTML = `CREATURE TAXONOMY · HOVER MOUSE OR PRESS <kbd>T</kbd> TO TOGGLE SPECIES TAGS`;
      show(tip, true);
      return;
    }
  }
}

function toast(message: string) {
  const node = el<HTMLElement>('toast');
  node.textContent = message;
  show(node, true);
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => show(node, false), 3700);
}

function journalContent() {
  const count = discoveredIds.length;
  const total = documentedSpecimens.length;
  el<HTMLElement>('journalCount').textContent = `${count.toString().padStart(2, '0')}/${total.toString().padStart(2, '0')}`;
  el<HTMLElement>('journalMaxDepth').textContent = `${Math.round(maxDepthRecord)} m`;
  el<HTMLElement>('journalDiscoveredCount').textContent = `${count} of ${total} Species (${Math.round((count / total) * 100)}%)`;
  el<HTMLElement>('journalStatus').textContent = count === total
    ? 'ALL SPECIES CATALOGUED'
    : metrics.reached11000
    ? '11,000 M CHALLENGER DEEP'
    : metrics.reached10000
    ? '10,000 M HADAL TRENCH FLOOR'
    : metrics.reached9000
    ? '9,000 M LOWER HADAL ZONE'
    : metrics.reached8000
    ? '8,000 M MARIANA HADAL CHASM'
    : metrics.reached7000
    ? '7,000 M SERPENTINITE COLD SEEP'
    : metrics.reached6000
    ? '6,000 M HADAL SUBDUCTION'
    : metrics.reached5000
    ? '5,000 M ABYSSAL BASIN'
    : metrics.reached4000
    ? '4,000 M ABYSSAL PLAIN'
    : metrics.reached3000
    ? '3,000 M WHALE FALL OASIS'
    : metrics.reached2000
    ? '2,000 M HYDROTHERMAL RIFT'
    : metrics.reached1000
    ? '1,000 M BATHYPELAGIC'
    : 'EXPEDITION ACTIVE';

  const badgeContainer = el<HTMLElement>('surveyBadgeContainer');
  if (badgeContainer) {
    badgeContainer.innerHTML = count === total
      ? `<div class="survey-complete-badge">★ EXPEDITION SURVEY COMPLETE · 8/8 CATALOGUED</div>`
      : '';
  }

  // Populate specimen tabs
  const list = el<HTMLElement>('journalEntriesList');
  if (list) {
    list.innerHTML = documentedSpecimens.map((spec) => {
      const isCat = discoveredIds.includes(spec.id);
      const isSel = spec.id === selectedSpecimenId && !selectedSiteId;
      return `
        <button class="entry-tab ${isSel ? 'is-selected' : ''} ${isCat ? 'is-catalogued' : ''}" data-specimen="${spec.id}" type="button">
          ${spec.index} <strong>${spec.name}</strong>
          <small>
            <span>${spec.depth}</span>
            <span>${isCat ? 'CATALOGUED' : 'UNDISCOVERED'}</span>
          </small>
        </button>
      `;
    }).join('') + `
      <div class="journal-section-label"><span>HISTORIC SITES</span></div>
      ` + documentedSites.map((site) => {
      const isCat = discoveredSiteIds.includes(site.id);
      const isSel = site.id === selectedSiteId;
      return `
        <button class="entry-tab ${isSel ? 'is-selected' : ''} ${isCat ? 'is-catalogued' : ''}" data-site="${site.id}" type="button">
          ${site.index} <strong>${site.name}</strong>
          <small>
            <span>${site.depth}</span>
            <span>${isCat ? 'DOCUMENTED' : 'UNSURVEYED'}</span>
          </small>
        </button>
      `;
    }).join('');

    list.querySelectorAll<HTMLButtonElement>('.entry-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        const specId = tab.getAttribute('data-specimen');
        const siteId = tab.getAttribute('data-site');
        if (siteId) {
          selectedSiteId = siteId;
          journalContent();
        } else if (specId) {
          selectedSpecimenId = specId;
          selectedSiteId = null;
          journalContent();
        }
      });
    });
  }

  const selectedSite = selectedSiteId ? documentedSites.find((s) => s.id === selectedSiteId) : undefined;
  if (selectedSite) {
    renderSiteEntry(selectedSite);
    return;
  }

  const current = documentedSpecimens.find((s) => s.id === selectedSpecimenId) || documentedSpecimens[0];
  const entry = el<HTMLElement>('journalEntry');
  const isCurrentDiscovered = discoveredIds.includes(current.id);

  if (!isCurrentDiscovered) {
    entry.innerHTML = `
      <div class="entry-kicker">SPECIES RECORD // UNVERIFIED ACOUSTIC SIGNATURE · ${current.depthTier.toUpperCase()}</div>
      <h3>${current.name}</h3>
      <p class="latin">Biometric scan required · Species uncatalogued</p>
      <div class="recon-plate">
        <div class="recon-reticle"></div>
        <div class="plate-badge">ACOUSTIC TARGET // ${current.depth.toUpperCase()}</div>
        <p>Submersible sensors detect bio-acoustic echoes consistent with <em>${current.scientificName}</em> in the <strong>${current.habitat}</strong>.</p>
      </div>
      <div class="entry-facts">
        <div><span>EXPECTED DEPTH</span><strong>${current.depth}</strong></div>
        <div><span>HABITAT TIER</span><strong>${current.habitat}</strong></div>
        <div><span>EXPECTED SIZE</span><strong>${current.realSize}</strong></div>
        <div><span>FIELD STATUS</span><strong>AWAITING SCAN</strong></div>
      </div>
      <p>${current.description}</p>
      <div class="entry-source">
        <span>RECONNAISSANCE DIRECTIVE</span>
        <small>Descend to ${current.depth}. Ping sonar (<kbd>R</kbd>) to triangulate the specimen contact, maneuver within 20 meters, and hold <kbd>E</kbd> while targeting the organism to complete biometric scanning.</small>
      </div>
      <div class="modal-actions">
        <button class="secondary-button" data-photo="${current.id}" type="button">VIEW REFERENCE PHOTO</button>
      </div>
    `;
    wirePhotoButtons();
    return;
  }

  entry.innerHTML = `
    <div class="entry-kicker">SPECIES // DOCUMENTED ORGANISM · ${current.depthTier.toUpperCase()}</div>
    <h3>${current.name}</h3>
    <p class="latin">${current.scientificName}</p>
    ${current.svg}
    <div class="entry-facts">
      <div><span>REPORTED DEPTH</span><strong>${current.depth}</strong></div>
      <div><span>HABITAT</span><strong>${current.habitat}</strong></div>
      <div><span>VERIFIED SIZE</span><strong>${current.realSize}</strong></div>
      <div><span>CLASSIFICATION</span><strong>${current.classification}</strong></div>
    </div>
    <p>${current.description}</p>
    <p>${current.detail}</p>
    <div class="entry-source">
      <span>SCIENTIFIC SOURCE & INSTITUTION</span>
      <a href="${current.source.url}" target="_blank" rel="noopener noreferrer">${current.source.title} ↗</a>
      <small>${current.source.publisher} · Accessed ${current.source.accessedOn}</small>
    </div>
    <div class="modal-actions">
      <button class="secondary-button" data-photo="${current.id}" type="button">VIEW REFERENCE PHOTO</button>
    </div>
  `;
  wirePhotoButtons();
}

function wirePhotoButtons() {
  const entry = el<HTMLElement>('journalEntry');
  entry.querySelectorAll<HTMLButtonElement>('[data-photo]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-photo');
      if (id) setPhoto(true, id);
    });
  });
}

function renderSiteEntry(site: Site) {
  const entry = el<HTMLElement>('journalEntry');
  const isDocumented = discoveredSiteIds.includes(site.id);

  if (!isDocumented) {
    entry.innerHTML = `
      <div class="entry-kicker">HISTORIC SITE // UNSURVEYED STRUCTURE · ${site.depthTier.toUpperCase()}</div>
      <h3>${site.name}</h3>
      <p class="latin">Structural scan required · Site undocumented</p>
      <div class="recon-plate">
        <div class="recon-reticle"></div>
        <div class="plate-badge">STRUCTURAL TARGET // ${site.depth.toUpperCase()}</div>
        <p>Submersible sensors detect a large structural return consistent with a historic wreck in the <strong>${site.location}</strong>. Close to survey range and hold <kbd>E</kbd> while targeting the structure.</p>
      </div>
      <div class="entry-facts">
        <div><span>EXPECTED DEPTH</span><strong>${site.depth}</strong></div>
        <div><span>LOCATION</span><strong>${site.location}</strong></div>
        <div><span>SITE KIND</span><strong>${site.kind}</strong></div>
        <div><span>FIELD STATUS</span><strong>AWAITING SURVEY</strong></div>
      </div>
      <p>${site.description}</p>
      <div class="entry-source">
        <span>SURVEY DIRECTIVE</span>
        <small>Descend to ${site.depth}. Ping sonar (<kbd>R</kbd>) to triangulate the large structure contact, maneuver within 50 meters, and hold <kbd>E</kbd> while targeting the wreck to complete the structural survey.</small>
      </div>
    `;
    return;
  }

  entry.innerHTML = `
    <div class="entry-kicker">HISTORIC SITE // DOCUMENTED WRECK · ${site.depthTier.toUpperCase()}</div>
    <h3>${site.name}</h3>
    <p class="latin">${site.kind}</p>
    ${site.svg}
    <div class="entry-facts">
      ${site.facts.map((fact) => `<div><span>${fact.label}</span><strong>${fact.value}</strong></div>`).join('')}
    </div>
    <p>${site.description}</p>
    <p>${site.detail}</p>
    <div class="entry-source">
      <span>SCIENTIFIC SOURCE & INSTITUTION</span>
      <a href="${site.source.url}" target="_blank" rel="noopener noreferrer">${site.source.title} ↗</a>
      <small>${site.source.publisher} · Accessed ${site.source.accessedOn}</small>
    </div>
  `;
}

function setPause(next: boolean) {
  if (next) cancelScan();
  paused = next;
  show(el<HTMLElement>('pauseOverlay'), next);
  if (next) world.pause();
  else if (!journalOpen && !controlsOpen && !photoOpen && started) world.start();
  updateAudio();
}

function setJournal(next: boolean) {
  if (next) { cancelScan(); setControls(false); }
  journalOpen = next;
  show(el<HTMLElement>('journalOverlay'), next);
  if (next) { journalContent(); world.pause(); }
  else if (!paused && !controlsOpen && !photoOpen && started) world.start();
  updateAudio();
}

function setControls(next: boolean) {
  if (next) { cancelScan(); setJournal(false); }
  controlsOpen = next;
  show(el<HTMLElement>('controlsOverlay'), next);
  if (next) world.pause();
  else if (!paused && !journalOpen && !photoOpen && started) world.start();
  updateAudio();
}

let photoOpen = false;

type CreatureHit = { specimenId: string | null; name: string; category: string; isHero: boolean };

function setPhoto(next: boolean, target?: string | CreatureHit) {
  if (next && target) renderPhoto(target);
  if (next) cancelScan();
  photoOpen = next;
  show(el<HTMLElement>('photoOverlay'), next);
  if (next) world.pause();
  else if (!paused && !journalOpen && !controlsOpen && started) world.start();
  updateAudio();
}

function resetPhotoModal() {
  el<HTMLElement>('photoOverlay').classList.remove('is-simulated');
  show(el<HTMLElement>('photoSource'), true);
  show(el<HTMLElement>('photoActions'), true);
}

function renderPhoto(target: string | CreatureHit) {
  const specimenId = typeof target === 'string' ? target : target.specimenId;
  const spec = specimenId ? documentedSpecimens.find((s) => s.id === specimenId) : undefined;

  // Documented species show their real-life reference photograph.
  if (spec) {
    resetPhotoModal();
    el<HTMLElement>('photoEyebrow').textContent = 'FIELD REFERENCE PHOTOGRAPH';
    const img = el<HTMLImageElement>('photoImage');
    img.src = spec.photo.src;
    img.alt = `Real-life reference photograph: ${spec.name} (${spec.photo.caption})`;
    el<HTMLElement>('photoTitle').textContent = spec.name;
    el<HTMLElement>('photoCaption').textContent = `${spec.scientificName} · ${spec.photo.caption}`;
    el<HTMLElement>('photoFacts').innerHTML = `
      <div><span>REPORTED DEPTH</span><strong>${spec.depth}</strong></div>
      <div><span>HABITAT</span><strong>${spec.habitat}</strong></div>
      <div><span>VERIFIED SIZE</span><strong>${spec.realSize}</strong></div>
      <div><span>FIELD STATUS</span><strong>${discoveredIds.includes(spec.id) ? 'CATALOGUED' : 'UNSCANNED'}</strong></div>
    `;
    el<HTMLElement>('photoCredit').textContent = `${spec.photo.credit} · ${spec.photo.license}`;
    const link = el<HTMLAnchorElement>('photoPageLink');
    link.href = spec.photo.pageUrl;
    const journalBtn = el<HTMLButtonElement>('photoJournalBtn');
    journalBtn.onclick = () => {
      selectedSpecimenId = spec.id;
      selectedSiteId = null;
      setPhoto(false);
      setJournal(true);
    };
    return;
  }

  // Ambient creatures and scenery: a detail card labelled as simulated.
  const name = typeof target === 'string' ? target : target.name;
  const category = typeof target === 'string' ? 'Simulated scenery' : target.category;
  el<HTMLElement>('photoOverlay').classList.add('is-simulated');
  show(el<HTMLElement>('photoSource'), false);
  show(el<HTMLElement>('photoActions'), false);
  const img = el<HTMLImageElement>('photoImage');
  img.src = simulatedPlateDataUri(name);
  img.alt = `Simulated silhouette diagram for ${name}`;
  el<HTMLElement>('photoEyebrow').textContent = 'SIMULATED SILHOUETTE · FIELD NOTE';
  el<HTMLElement>('photoTitle').textContent = name;
  el<HTMLElement>('photoCaption').textContent = category;
  el<HTMLElement>('photoFacts').innerHTML = `
    <div><span>CATEGORY</span><strong>${category}</strong></div>
    <div><span>STATUS</span><strong>SIMULATED SCENERY</strong></div>
    <div><span>FIELD NOTE</span><strong>Ambient silhouette rendered in-scene; no sourced species record or reference photograph is catalogued for this contact.</strong></div>
  `;
}

function simulatedPlateDataUri(label: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="360" viewBox="0 0 720 360"><rect width="720" height="360" fill="#03121a"/><circle cx="360" cy="180" r="112" fill="none" stroke="rgba(120,200,210,0.16)" stroke-width="1.5"/><circle cx="360" cy="180" r="64" fill="none" stroke="rgba(120,200,210,0.12)" stroke-width="1"/><text x="360" y="176" text-anchor="middle" fill="#2f7f8a" font-family="monospace" font-size="17" letter-spacing="5">SIMULATED</text><text x="360" y="202" text-anchor="middle" fill="#2f7f8a" font-family="monospace" font-size="17" letter-spacing="5">SILHOUETTE</text><text x="360" y="252" text-anchor="middle" fill="#215c66" font-family="monospace" font-size="12" letter-spacing="2">${label.slice(0, 48).toUpperCase()}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function finishScan() {
  const targetId = metrics.targetSpecimenId || 'vampire-squid';
  // Historic sites scan into the journal separately from species.
  const site = documentedSites.find((s) => s.id === targetId);
  if (site) {
    finishSiteScan(site);
    return;
  }
  const specimenId = targetId;
  const specimen = documentedSpecimens.find((s) => s.id === specimenId) || documentedSpecimens[1];
  cancelScan();
  world.markDiscovered(specimenId);
  if (!discoveredIds.includes(specimenId)) {
    discoveredIds.push(specimenId);
    saveDiscoveries();
  }
  selectedSpecimenId = specimenId;
  selectedSiteId = null;
  journalContent();
  discoveryAudio();
  show(el<HTMLElement>('scanMeter'), false);
  show(el<HTMLElement>('targetPrompt'), false);
  toast(`SPECIES CATALOGUED · ${specimen.name.toUpperCase()} [OPEN JOURNAL: J]`);
}

function finishSiteScan(site: Site) {
  cancelScan();
  world.markDiscovered(site.id);
  if (!discoveredSiteIds.includes(site.id)) {
    discoveredSiteIds.push(site.id);
    saveDiscoveredSites();
  }
  selectedSiteId = site.id;
  journalContent();
  discoveryAudio();
  show(el<HTMLElement>('scanMeter'), false);
  show(el<HTMLElement>('targetPrompt'), false);
  toast(`HISTORIC SITE DOCUMENTED · ${site.name.toUpperCase()} [OPEN JOURNAL: J]`);
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

  // 2,000 m Hydrothermal Rift Ridge Milestone Check
  if (metrics.reached2000 && !reached2000Notified) {
    reached2000Notified = true;
    milestoneAudio();
    toast('2,000 M REACHED · MID-OCEAN HYDROTHERMAL RIFT');
  }

  // 3,000 m Whale Fall Oasis Check
  if (metrics.reached3000 && !reached3000Notified) {
    reached3000Notified = true;
    milestoneAudio();
    toast('3,000 M REACHED · ABYSSAL WHALE FALL ECOSYSTEM');
  }

  // 3,800 m RMS Titanic Wreck Site Check
  if (metrics.reached3800 && !reached3800Notified) {
    reached3800Notified = true;
    milestoneAudio();
    toast('3,800 M REACHED · RMS TITANIC WRECK SITE · PING SONAR');
  }

  // 4,000 m Abyssal Plain Boundary Milestone Check
  if (metrics.reached4000 && !reached4000Notified) {
    reached4000Notified = true;
    milestoneAudio();
    toast('4,000 M REACHED · ABYSSAL PLAIN & BENTHIC OBSERVATORY');
  }

  // 5,000 m Abyssal Basin Check
  if (metrics.reached5000 && !reached5000Notified) {
    reached5000Notified = true;
    milestoneAudio();
    toast('5,000 M REACHED · DEEP ABYSSAL SEDIMENT BASIN');
  }

  // 6,000 m Hadal Subduction Fault Milestone Check
  if (metrics.reached6000 && !reached6000Notified) {
    reached6000Notified = true;
    milestoneAudio();
    toast('6,000 M REACHED · HADAL SUBDUCTION FAULT GATEWAY');
  }

  // 7,000 m Serpentine Mud Volcanoes Milestone Check
  if (metrics.reached7000 && !reached7000Notified) {
    reached7000Notified = true;
    milestoneAudio();
    toast('7,000 M REACHED · SERPENTINITE COLD SEEP & MUD VOLCANO');
  }

  // 8,000 m Mariana Hadal Trench Milestone Check
  if (metrics.reached8000 && !reached8000Notified) {
    reached8000Notified = true;
    milestoneAudio();
    toast('8,000 M REACHED · MARIANA TRENCH CHASM & HABITAT BOUNDARY');
  }

  // 9,000 m Lower Hadal Zone Milestone Check
  if (metrics.reached9000 && !reached9000Notified) {
    reached9000Notified = true;
    milestoneAudio();
    toast('9,000 M REACHED · LOWER HADAL ZONE & ULTRA-DEEP FAULT');
  }

  // 10,000 m Extreme Trench Abyss Milestone Check
  if (metrics.reached10000 && !reached10000Notified) {
    reached10000Notified = true;
    milestoneAudio();
    toast('10,000 M REACHED · 10 KM ULTRA-DEEP TRENCH ENTRY');
  }

  // 11,000 m Challenger Deep Seafloor Celebration Card
  if (metrics.reached11000 && !milestoneTriggered) {
    milestoneTriggered = true;
    show(el<HTMLElement>('milestoneCard'), true);
    milestoneAudio();
    toast('10,928 M REACHED · CHALLENGER DEEP TERMINAL SEAFLOOR');
  }

  // Water breach and plunge surface transitions
  if (metrics.waterTransition) {
    splashAudio(metrics.waterTransition);
    toast(metrics.waterTransition === 'breach' ? 'SURFACE BREACHED · OPEN ATMOSPHERE' : 'SUBMERGED · SUNLIGHT ZONE');
  }

  // Pilot onboarding tips
  updatePilotTip();

  // One-time thruster boost hint on first engagement
  if (metrics.isBoosting && !boostToastShown) {
    boostToastShown = true;
    toast('THRUSTER BOOST ENGAGED · 2.2X THRUST');
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

  if (scanning && (metrics.targetDistance === null || metrics.targetDistance > 45)) {
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
  el<HTMLElement>('depthProgress').style.width = `${Math.min(depth / 11000, 1) * 100}%`;
  el<HTMLElement>('fpsDisplay').textContent = `${Math.round(1000 / Math.max(metrics.frameMs, 1))} FPS`;
  const zoomDisplay = el<HTMLElement>('zoomDisplay');
  if (zoomDisplay) {
    zoomDisplay.textContent = `${Math.round(metrics.zoom * 100)}% ZOOM`;
  }
  const speedDisplay = el<HTMLElement>('speedDisplay');
  if (speedDisplay) {
    speedDisplay.textContent = `${metrics.speedMultiplier}× SPEED`;
    speedDisplay.classList.toggle('is-boosted', metrics.speedMultiplier > 1);
    speedDisplay.classList.toggle('is-superspeed', metrics.speedMultiplier >= 4);
  }

  const promptEl = el<HTMLElement>('targetPrompt');
  show(promptEl, metrics.targetInSight && !scanning);
  if (metrics.targetInSight && metrics.targetSpecimenName) {
    const promptText = el<HTMLElement>('targetPromptText');
    if (promptText) {
      const isSite = documentedSites.some((s) => s.id === metrics.targetSpecimenId);
      promptText.innerHTML = `${isSite ? 'STRUCTURE' : 'SPECIMEN'} IN SIGHT: ${metrics.targetSpecimenName.toUpperCase()}<br><em>HOLD E TO SCAN</em>`;
    }
  }
  show(el<HTMLElement>('scanMeter'), scanProgress > 0);
  el<HTMLElement>('scanFill').style.width = `${scanProgress * 100}%`;

  const hasSonarContact = metrics.sonarDistance !== null && metrics.sonarDistance < 160;
  show(el<HTMLElement>('sonarContact'), hasSonarContact);
  el<HTMLElement>('sonarRange').textContent = hasSonarContact ? `${Math.round(metrics.sonarDistance!)} M` : '— M';

  if (el<HTMLElement>('sonarState').textContent === 'PINGING') {
    el<HTMLElement>('sonarContact').style.top = `${40 + Math.sin(now / 900) * 4}%`;
  }

  el<HTMLElement>('debugStats').innerHTML = `DEPTH ${depth.toFixed(1)} M<br>HORIZONTAL ${metrics.horizontalM.toFixed(1)} M<br>FRAME ${metrics.frameMs.toFixed(1)} MS<br>QUALITY ${world.getQuality().toUpperCase()}<br>ZONE ${zone.name}`;
}

try {
  world = new OceanWorld(canvas, onTick);
  world.setDiscovered([...discoveredIds, ...discoveredSiteIds]);
  journalContent();
  world.start();
  initVisitorCounter();
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
el<HTMLButtonElement>('closePhotoBtn').addEventListener('click', () => setPhoto(false));

// Tap / click a creature or feature to open its detail card
canvas.addEventListener('click', (e) => {
  if (!started || paused || journalOpen || controlsOpen || photoOpen) return;
  const rect = canvas.getBoundingClientRect();
  const hit = world.creatureAtScreen(e.clientX - rect.left, e.clientY - rect.top);
  if (hit) setPhoto(true, hit);
});
canvas.addEventListener('mousemove', (e) => {
  if (!started || paused || journalOpen || controlsOpen || photoOpen) {
    canvas.style.cursor = '';
    return;
  }
  const rect = canvas.getBoundingClientRect();
  canvas.style.cursor = world.creatureAtScreen(e.clientX - rect.left, e.clientY - rect.top) ? 'pointer' : '';
});
el<HTMLButtonElement>('muteBtn').addEventListener('click', () => setMute(!muted));
el<HTMLInputElement>('muteSetting').addEventListener('change', (e) => setMute((e.target as HTMLInputElement).checked));
el<HTMLInputElement>('tagsSetting').addEventListener('change', (e) => toggleTags((e.target as HTMLInputElement).checked));

el<HTMLButtonElement>('dismissDirective').addEventListener('click', () => {
  el<HTMLElement>('surfaceDirective').classList.add('is-hidden', 'is-dismissed');
});

el<HTMLButtonElement>('dismissTipBtn')?.addEventListener('click', () => {
  pilotStep = 'done';
  pilotGuideComplete = true;
  savePilotGuideComplete();
  show(el<HTMLElement>('pilotTip'), false);
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
    localStorage.removeItem('descent-v1-discovered-species');
    localStorage.removeItem('descent-v1-discovered-sites');
    localStorage.removeItem('descent-v1-vampire-squid');
    localStorage.removeItem('descent-v1-guide-completed');
    localStorage.removeItem('descent-v1-muted');
  } catch { /* Storage */ }
  location.reload();
});

el<HTMLInputElement>('debugDepth').addEventListener('input', (e) => {
  const depth = Number((e.target as HTMLInputElement).value);
  world.vehicle.position.y = depth === 0 ? 3 : -depth;
});

el<HTMLButtonElement>('debugLight').addEventListener('click', () => world.toggleLights());

// Light Dismiss for all modal overlays
for (const overlayId of ['pauseOverlay', 'journalOverlay', 'controlsOverlay', 'photoOverlay']) {
  el<HTMLElement>(overlayId).addEventListener('click', (event) => {
    if (event.target === el<HTMLElement>(overlayId)) {
      if (overlayId === 'pauseOverlay') setPause(false);
      else if (overlayId === 'journalOverlay') setJournal(false);
      else if (overlayId === 'controlsOverlay') setControls(false);
      else if (overlayId === 'photoOverlay') setPhoto(false);
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
  if (metrics.targetInSight) {
    scanning = true;
    world.setScanAssist(true);
    toast(`SCAN INITIATED · HOLD NEAR ${metrics.targetSpecimenName ? metrics.targetSpecimenName.toUpperCase() : 'SPECIMEN'}`);
  }
});
el<HTMLButtonElement>('touchJournal')?.addEventListener('click', () => setJournal(!journalOpen));

function triggerSonar() {
  const res = world.ping();
  pingAudio(res.distance);
  el<HTMLElement>('sonarState').textContent = 'PINGING';
  window.setTimeout(() => { el<HTMLElement>('sonarState').textContent = 'STANDBY'; }, 1700);
  if (res.distance !== null && res.distance < 160) {
    toast(`ACOUSTIC CONTACT DETECTED · ${Math.round(res.distance)} M ${res.name ? `[${res.name.toUpperCase()}]` : ''}`);
  } else {
    toast(discoveredIds.length === documentedSpecimens.length ? 'ALL 8 REGIONAL SPECIES CATALOGUED' : 'NO UNCATALOGUED CONTACT IN RANGE');
  }
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
    if (photoOpen) { setPhoto(false); return; }
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
  if (event.code === 'KeyC' && !event.repeat) {
    const tier = world.cycleSpeedMultiplier();
    toast(`THRUST SPEED · ${tier}×`);
    return;
  }
  if (/^Digit[1-5]$/.test(event.code)) {
    const tier = world.setSpeedMultiplier(Number(event.code.slice(5)));
    toast(`THRUST SPEED · ${tier}×`);
    return;
  }

  if (paused || journalOpen || controlsOpen || photoOpen) return;

  if (['Space', 'ShiftLeft', 'ShiftRight', 'KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyE', 'KeyF', 'KeyR'].includes(event.code)) {
    event.preventDefault();
  }

  world.setKey(event.code, true);
  if (event.repeat) return;

  if (event.code === 'KeyF') toggleLights();
  if (event.code === 'KeyR') triggerSonar();
  if (event.code === 'KeyE' && metrics.targetInSight) {
    scanning = true;
    world.setScanAssist(true);
    toast(`SCAN INITIATED · HOLD NEAR ${metrics.targetSpecimenName ? metrics.targetSpecimenName.toUpperCase() : 'SPECIMEN'}`);
  }
});

document.addEventListener('keyup', (event) => {
  world.setKey(event.code, false);
});

window.addEventListener('blur', () => {
  world.clearKeys();
  cancelScan();
});

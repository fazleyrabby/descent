export type Quality = 'high' | 'low';
export type WorldMetrics = {
  depth: number;
  horizontalM: number;
  frameMs: number;
  targetDistance: number | null;
  targetInSight: boolean;
  targetSpecimenId: string | null;
  targetSpecimenName: string | null;
  sonarDistance: number | null;
  sonarTargetName: string | null;
  isThrusting: boolean;
  reached1000: boolean;
  reached2000: boolean;
  reached3000: boolean;
  reached4000: boolean;
  reached5000: boolean;
  reached6000: boolean;
  zoom: number;
  waterTransition: 'breach' | 'plunge' | null;
};

type Particle = { x: number; depth: number; radius: number; phase: number };
type Bubble = { x: number; y: number; vx: number; vy: number; radius: number; life: number; maxLife: number };
type CreatureTag = {
  screenX: number;
  screenY: number;
  name: string;
  category: string;
  isHero?: boolean;
  radius: number;
  distM: number;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const color = (a: [number, number, number], b: [number, number, number], t: number) =>
  `rgb(${a.map((channel, index) => Math.round(channel + (b[index] - channel) * t)).join(',')})`;

export class OceanWorld {
  readonly canvas: HTMLCanvasElement;
  readonly vehicle = { position: { x: 0, y: 3, z: 0 } };
  readonly seed = 183729;

  private ctx: CanvasRenderingContext2D;
  private width = 1;
  private height = 1;
  private quality: Quality = 'high';
  private pressed = new Set<string>();
  private particles: Particle[] = [];
  private bubbles: Bubble[] = [];
  private mouse = { x: -1000, y: -1000, active: false };
  private activeCreatures: CreatureTag[] = [];
  private showTags = true;
  private zoom = 1.0;
  private targetZoom = 1.0;
  private horizontalSpeed = 0;
  private verticalSpeed = 0;
  private facing = 1;
  private lightsOn = true;
  private scanAssist = false;
  private discovered = false;
  private discoveredSet = new Set<string>();
  private encounterX: number | null = null;
  private sonarTime = -100;
  private elapsed = 0;
  private running = false;
  private frameId = 0;
  private lastTime = 0;
  private lastFrame = 16;
  private isThrusting = false;
  private bubbleTimer = 0;
  private lastDepth = 0;
  private waterTransition: 'breach' | 'plunge' | null = null;
  private onTick: (metrics: WorldMetrics) => void;

  constructor(canvas: HTMLCanvasElement, onTick: (metrics: WorldMetrics) => void) {
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) throw new Error('This browser could not start the 2D ocean canvas.');
    this.canvas = canvas;
    this.ctx = ctx;
    this.onTick = onTick;

    // Track mouse / pointer coordinates for creature tooltips
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
      this.mouse.active = true;
    });
    this.canvas.addEventListener('mouseleave', () => {
      this.mouse.active = false;
    });

    // Mouse scroll wheel zoom in / out with trackpad & mouse wheel normalization
    window.addEventListener('wheel', (e: WheelEvent) => {
      // Don't intercept zoom when scrolling inside an open modal or interactive list
      const target = e.target as HTMLElement | null;
      if (target?.closest?.('.modal, .settings, .journal-entry, .controls-grid')) {
        return;
      }
      e.preventDefault();
      const normalizedDelta = e.deltaMode === 1 ? e.deltaY * 36 : e.deltaMode === 2 ? e.deltaY * 400 : e.deltaY;
      const zoomDelta = clamp(-normalizedDelta * 0.0012, -0.15, 0.15);
      this.targetZoom = clamp(this.targetZoom + zoomDelta, 0.55, 1.85);
    }, { passive: false });

    // Touch support (tap for tooltips + two-finger pinch to zoom)
    let initialPinchDist = 0;
    let initialPinchZoom = 1;
    window.addEventListener('touchstart', (e: TouchEvent) => {
      if (e.touches.length === 2) {
        initialPinchDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        initialPinchZoom = this.targetZoom;
      } else if (e.touches.length === 1) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = e.touches[0].clientX - rect.left;
        this.mouse.y = e.touches[0].clientY - rect.top;
        this.mouse.active = true;
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e: TouchEvent) => {
      if (e.touches.length === 2 && initialPinchDist > 0) {
        const currentDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        this.targetZoom = clamp(initialPinchZoom * (currentDist / initialPinchDist), 0.55, 1.85);
      }
    }, { passive: true });

    let state = this.seed;
    const random = () => ((state = (state * 1664525 + 1013904223) >>> 0) / 4294967296);
    for (let i = 0; i < 7500; i++) {
      this.particles.push({
        x: (random() - 0.5) * 440,
        depth: random() * 6250,
        radius: 0.35 + random() * 1.5,
        phase: random() * Math.PI * 2,
      });
    }
    this.resize();
  }

  setKey(code: string, down: boolean) { down ? this.pressed.add(code) : this.pressed.delete(code); }
  clearKeys() { this.pressed.clear(); }
  setQuality(quality: Quality) { this.quality = quality; this.resize(); }
  getQuality() { return this.quality; }
  toggleLights() { this.lightsOn = !this.lightsOn; return this.lightsOn; }
  getLights() { return this.lightsOn; }
  setTagsEnabled(enabled: boolean) { this.showTags = enabled; }
  getTagsEnabled() { return this.showTags; }
  getZoom() { return this.zoom; }
  setZoom(z: number) { this.targetZoom = clamp(z, 0.55, 1.85); }
  resetZoom() { this.targetZoom = 1.0; }
  adjustZoom(delta: number) { this.targetZoom = clamp(this.targetZoom + delta, 0.55, 1.85); }
  isDiscovered(id = 'vampire-squid') { return this.discoveredSet.has(id); }
  markDiscovered(id = 'vampire-squid') {
    this.discoveredSet.add(id);
    if (id === 'vampire-squid') this.discovered = true;
  }
  setDiscovered(ids: string[]) {
    this.discoveredSet = new Set(ids);
    this.discovered = this.discoveredSet.has('vampire-squid');
  }
  getDiscovered(): string[] { return Array.from(this.discoveredSet); }
  setScanAssist(active: boolean) { this.scanAssist = active; }
  ping(): { distance: number | null; name: string | null } {
    this.sonarTime = this.elapsed;
    const closest = this.getClosestUndiscoveredTarget();
    return closest ? { distance: closest.distance, name: closest.target.name } : { distance: null, name: null };
  }

  resize() {
    this.width = this.canvas.clientWidth || innerWidth;
    this.height = this.canvas.clientHeight || innerHeight;
    const ratio = Math.min(devicePixelRatio || 1, this.quality === 'high' ? 1.8 : 1);
    this.canvas.width = Math.round(this.width * ratio);
    this.canvas.height = Math.round(this.height * ratio);
    this.ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    this.draw();
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this.frameId = requestAnimationFrame(this.tick);
  }

  pause() { this.running = false; cancelAnimationFrame(this.frameId); this.clearKeys(); }
  dispose() { this.pause(); }

  private tick = (now: number) => {
    if (!this.running) return;
    const dt = Math.min((now - this.lastTime) / 1000, 0.05);
    this.lastTime = now;
    this.lastFrame = dt * 1000;
    this.elapsed += dt;
    this.update(dt);
    this.draw();
    this.onTick(this.metrics());
    this.frameId = requestAnimationFrame(this.tick);
  };

  private update(dt: number) {
    const left = this.pressed.has('KeyA') || this.pressed.has('ArrowLeft');
    const right = this.pressed.has('KeyD') || this.pressed.has('ArrowRight');
    const up = this.pressed.has('KeyW') || this.pressed.has('ArrowUp') || this.pressed.has('Space');
    const down = this.pressed.has('KeyS') || this.pressed.has('ArrowDown') || this.pressed.has('ShiftLeft') || this.pressed.has('ShiftRight');
    const horizontal = Number(right) - Number(left);
    const vertical = this.scanAssist ? 0 : Number(down) - Number(up);

    this.isThrusting = horizontal !== 0 || vertical !== 0 || Math.abs(this.horizontalSpeed) > 0.8 || Math.abs(this.verticalSpeed) > 2;

    const prevDepth = this.depth;
    this.horizontalSpeed += (horizontal * 8 - this.horizontalSpeed) * (1 - Math.exp(-dt * 3.1));
    this.verticalSpeed += (vertical * 34 - this.verticalSpeed) * (1 - Math.exp(-dt * 2.5));
    this.vehicle.position.x += this.horizontalSpeed * dt;
    this.vehicle.position.y = clamp(this.vehicle.position.y - this.verticalSpeed * dt, -6000, 3);
    const currDepth = this.depth;

    if (prevDepth > 0.4 && currDepth <= 0.4) {
      this.waterTransition = 'breach';
    } else if (prevDepth <= 0.4 && currDepth > 0.4) {
      this.waterTransition = 'plunge';
    } else {
      this.waterTransition = null;
    }
    this.lastDepth = currDepth;

    if (Math.abs(this.horizontalSpeed) > 0.4) this.facing = Math.sign(this.horizontalSpeed);
    if (this.depth > 565 && this.encounterX === null) this.encounterX = this.vehicle.position.x + 8;

    // Spawn and update thruster cavitation bubbles
    if (this.quality === 'high' || Math.random() < 0.5) {
      this.bubbleTimer += dt;
      if (this.isThrusting && this.bubbleTimer > 0.04) {
        this.bubbleTimer = 0;
        const sternX = this.vehicle.position.x - this.facing * 5.2;
        const sternY = this.depth + (Math.random() - 0.5) * 0.7;
        this.bubbles.push({
          x: sternX,
          y: sternY,
          vx: -this.facing * (1.2 + Math.random() * 2.2) + (Math.random() - 0.5) * 0.8,
          vy: -0.6 - Math.random() * 0.9,
          radius: 0.8 + Math.random() * 1.5,
          life: 0,
          maxLife: 0.8 + Math.random() * 0.7,
        });
      }
    }

    for (let i = this.bubbles.length - 1; i >= 0; i--) {
      const b = this.bubbles[i];
      b.life += dt;
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      if (b.life >= b.maxLife) {
        this.bubbles.splice(i, 1);
      }
    }

    // Smooth camera zoom approach
    this.zoom += (this.targetZoom - this.zoom) * (1 - Math.exp(-dt * 10));
  }

  private get depth() { return Math.max(0, -this.vehicle.position.y); }
  private get pxPerMeter() { return (this.width < 760 ? 10 : 12) * this.zoom; }
  private get focusX() { return this.width * (this.width < 760 ? 0.55 : 0.51); }
  private get focusY() { return this.height * (this.width < 760 ? 0.69 : 0.57); }
  private screenX(worldX: number) { return this.focusX + (worldX - this.vehicle.position.x) * this.pxPerMeter; }
  private screenY(worldDepth: number) { return this.focusY + (worldDepth - this.depth) * this.pxPerMeter; }

  private whalePosition() {
    const whaleBaseX = 110;
    const whaleX = this.wrapCoord(whaleBaseX, 220);
    const whaleSpeed = 3.2;
    const whaleCurrX = whaleX + (this.elapsed * whaleSpeed) % 220 - 110;
    const whaleDepth = 135 + Math.sin(this.elapsed * 0.15) * 14;
    return { x: whaleCurrX, depth: whaleDepth };
  }

  private squidPosition() {
    return {
      x: (this.encounterX ?? 0) + Math.sin(this.elapsed * 0.42) * 0.8,
      depth: 650 + Math.sin(this.elapsed * 0.58) * 0.5,
    };
  }

  private barreleyePosition() {
    const barreleyeBaseX = 60;
    const barreleyeX = this.wrapCoord(barreleyeBaseX, 130);
    const barreleyeDepth = 1100 + Math.sin(this.elapsed * 0.35) * 12;
    return { x: barreleyeX, depth: barreleyeDepth };
  }

  private tripodPosition() {
    const tx = this.wrapCoord(18, 90);
    return { x: tx, depth: 1994 };
  }

  private gulperEelPosition() {
    const gulperBaseX = -35;
    const gulperX = this.wrapCoord(gulperBaseX, 160);
    const gulperSpeed = 2.4;
    const gulperCurrX = gulperX + (this.elapsed * gulperSpeed) % 160 - 80;
    const gulperDepth = 2750 + Math.sin(this.elapsed * 0.32) * 22;
    return { x: gulperCurrX, depth: gulperDepth };
  }

  private seaPigPosition() {
    const seaPigBaseX = 45;
    const seaPigX = this.wrapCoord(seaPigBaseX, 140);
    const seaPigSpeed = 0.8;
    const seaPigCurrX = seaPigX + (this.elapsed * seaPigSpeed) % 140 - 70;
    const seaPigDepth = 5200;
    return { x: seaPigCurrX, depth: seaPigDepth };
  }

  private documentedTargets() {
    return [
      { id: 'blue-whale', name: 'Blue whale', pos: this.whalePosition(), maxSightDist: 42 },
      { id: 'vampire-squid', name: 'Vampire squid', pos: this.squidPosition(), maxSightDist: 18 },
      { id: 'barreleye-fish', name: 'Barreleye fish', pos: this.barreleyePosition(), maxSightDist: 22 },
      { id: 'tripod-fish', name: 'Benthic tripod fish', pos: this.tripodPosition(), maxSightDist: 22 },
      { id: 'gulper-eel', name: 'Gulper eel', pos: this.gulperEelPosition(), maxSightDist: 28 },
      { id: 'sea-pig', name: 'Abyssal sea pig', pos: this.seaPigPosition(), maxSightDist: 22 },
    ];
  }

  private getClosestUndiscoveredTarget() {
    let closest: { target: { id: string; name: string; maxSightDist: number }; distance: number } | null = null;
    for (const t of this.documentedTargets()) {
      if (this.discoveredSet.has(t.id)) continue;
      const posX = t.id === 'vampire-squid' && this.encounterX === null ? this.vehicle.position.x + 8 : t.pos.x;
      const dist = Math.hypot(posX - this.vehicle.position.x, t.pos.depth - this.depth);
      if (!closest || dist < closest.distance) {
        closest = { target: t, distance: dist };
      }
    }
    return closest;
  }

  private metrics(): WorldMetrics {
    let targetInSight = false;
    let targetDistance: number | null = null;
    let targetSpecimenId: string | null = null;
    let targetSpecimenName: string | null = null;

    for (const t of this.documentedTargets()) {
      if (this.discoveredSet.has(t.id)) continue;
      const posX = t.id === 'vampire-squid' && this.encounterX === null ? this.vehicle.position.x + 8 : t.pos.x;
      const dist = Math.hypot(posX - this.vehicle.position.x, t.pos.depth - this.depth);
      const sy = this.screenY(t.pos.depth);
      const sx = this.screenX(posX);

      if (dist <= t.maxSightDist && sy > 70 && sy < this.height - 70 && sx > 40 && sx < this.width - 40) {
        targetInSight = true;
        targetDistance = dist;
        targetSpecimenId = t.id;
        targetSpecimenName = t.name;
        break;
      }
    }

    const closestUndiscovered = this.getClosestUndiscoveredTarget();
    const isSonarActive = this.elapsed - this.sonarTime < 5;
    const sonarDistance = isSonarActive && closestUndiscovered && closestUndiscovered.distance < 160 ? closestUndiscovered.distance : null;
    const sonarTargetName = isSonarActive && closestUndiscovered && closestUndiscovered.distance < 160 ? closestUndiscovered.target.name : null;

    return {
      depth: this.depth,
      horizontalM: this.vehicle.position.x,
      frameMs: this.lastFrame,
      targetDistance,
      targetInSight,
      targetSpecimenId,
      targetSpecimenName,
      sonarDistance,
      sonarTargetName,
      isThrusting: this.isThrusting,
      reached1000: this.depth >= 998,
      reached2000: this.depth >= 1998,
      reached3000: this.depth >= 2998,
      reached4000: this.depth >= 3998,
      reached5000: this.depth >= 4998,
      reached6000: this.depth >= 5998,
      zoom: this.zoom,
      waterTransition: this.waterTransition,
    };
  }

  private draw() {
    const ctx = this.ctx;
    const { width, height } = this;
    const depth = this.depth;
    const darkness = Math.pow(clamp(depth / 900, 0, 1), 0.9);
    const surfaceY = this.screenY(0);
    this.activeCreatures = [];

    // 1. Atmosphere / Sky
    const sky = ctx.createLinearGradient(0, 0, 0, Math.max(surfaceY, height));
    sky.addColorStop(0, '#285d7d');
    sky.addColorStop(1, '#a6c6cb');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, height);
    if (surfaceY > 0) this.drawSun(surfaceY);

    // 2. Water Column Gradient
    const waterTop = color([19, 99, 123], [3, 18, 35], darkness);
    const waterBottom = color([5, 38, 58], [1, 8, 20], darkness);
    const water = ctx.createLinearGradient(0, Math.max(0, surfaceY), 0, height);
    water.addColorStop(0, waterTop);
    water.addColorStop(1, waterBottom);
    ctx.beginPath();
    ctx.moveTo(0, surfaceY + this.wave(0));
    for (let x = 8; x <= width + 8; x += 8) ctx.lineTo(x, surfaceY + this.wave(x));
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fillStyle = water;
    ctx.fill();

    // 3. Surface waves, Sunrays & Sunlight Caustics
    if (surfaceY > -height && surfaceY < height) this.drawSurface(surfaceY, darkness);
    if (depth < 80 && surfaceY > -180) this.drawSunRays(surfaceY, darkness);
    if (depth < 85 && surfaceY < height) this.drawCaustics(surfaceY, darkness);

    // 4. Geological Terrains & Benthic Ecosystems
    if (depth > 1700 && depth < 2450) this.drawMidOceanRidge(darkness);
    if (depth > 2950 && depth < 3550) this.drawWhaleFall(darkness);
    if (depth > 3700 && depth < 5600) this.drawAbyssalPlain(darkness);
    if (depth > 5500) this.drawHadalFault(darkness);

    // 5. Marine Snow Particles (enhanced with headlight cone scatter)
    this.drawParticles(darkness);

    // 6. Ambient Wildlife Gradient (dense photic surface -> sparse abyssal isolation)
    this.drawAmbientWildlife(darkness);

    // 7. Hero Specimens
    if (this.encounterX !== null) this.drawSquid();
    if (depth > 2400 && depth < 3100) this.drawGulperEel();
    if (depth > 4900 && depth < 5500) this.drawSeaPig();

    // 8. Headlight Cones & Volumetric Glow
    this.drawLightBeam(darkness);

    // 9. Cavitation Bubbles
    this.drawBubbles();

    // 10. Research Submersible DSV-1
    this.drawSubmersible();

    // 11. Sonar Pulse Waves
    this.drawSonarPulse();

    // 12. Creature HUD Taxonomy Tooltips & Identification Tags
    this.drawCreatureTags();
  }

  private wave(x: number) {
    return Math.sin(x * 0.017 + this.elapsed * 0.76) * 3.1 + Math.sin(x * 0.041 - this.elapsed * 1.12) * 1.2;
  }

  private drawSun(surfaceY: number) {
    const ctx = this.ctx;
    const x = this.width * 0.73;
    const y = surfaceY - Math.min(205, this.height * 0.3);
    if (y < -100) return;
    const glow = ctx.createRadialGradient(x, y, 3, x, y, 150);
    glow.addColorStop(0, 'rgba(255,250,227,.75)');
    glow.addColorStop(0.16, 'rgba(241,248,230,.24)');
    glow.addColorStop(1, 'rgba(211,241,235,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(x - 150, y - 150, 300, 300);
    ctx.beginPath();
    ctx.arc(x, y, 29, 0, Math.PI * 2);
    ctx.fillStyle = '#fff9e8';
    ctx.fill();
  }

  private drawSurface(y: number, darkness: number) {
    const ctx = this.ctx;
    ctx.beginPath();
    for (let x = 0; x <= this.width + 8; x += 8) {
      const py = y + this.wave(x);
      if (x === 0) ctx.moveTo(x, py); else ctx.lineTo(x, py);
    }
    ctx.strokeStyle = `rgba(180,235,231,${0.4 * (1 - darkness)})`;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    if (y < 0) return;
    const sunX = this.width * 0.73;
    for (let i = 0; i < 55; i++) {
      const progress = (i * 37 % 173) / 173;
      const py = y + progress * 170;
      if (py > this.height) continue;
      const spread = 5 + progress * 48;
      const offset = Math.sin(i * 11.7 + this.elapsed * 1.6) * spread;
      ctx.beginPath();
      ctx.ellipse(sunX + offset, py, 1 + (i % 4) * 1.4, 0.65, 0, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(238,249,218,${(1 - progress) * 0.13 * (1 - darkness)})`;
      ctx.fill();
    }
  }

  private drawSunRays(surfaceY: number, darkness: number) {
    const ctx = this.ctx;
    const top = Math.max(0, surfaceY);
    const ray = ctx.createLinearGradient(0, top, 0, this.height);
    ray.addColorStop(0, `rgba(170,238,224,${0.045 * (1 - darkness)})`);
    ray.addColorStop(1, 'rgba(170,238,224,0)');
    for (let i = 0; i < 4; i++) {
      const x = this.width * (0.2 + i * 0.24) + Math.sin(this.elapsed * 0.16 + i) * 18;
      ctx.beginPath();
      ctx.moveTo(x, top);
      ctx.lineTo(x + 12, top);
      ctx.lineTo(x + 110, this.height);
      ctx.lineTo(x - 75, this.height);
      ctx.closePath();
      ctx.fillStyle = ray;
      ctx.fill();
    }
  }

  private drawCaustics(surfaceY: number, darkness: number) {
    if (this.depth > 85) return;
    const ctx = this.ctx;
    const depthRatio = clamp(this.depth / 80, 0, 1);
    const causticIntensity = (1 - depthRatio) * (1 - darkness) * 0.38;
    if (causticIntensity <= 0.01) return;

    ctx.save();
    ctx.globalCompositeOperation = 'screen';

    const top = Math.max(0, surfaceY);
    const bottom = Math.min(this.height, surfaceY + 600);
    const rows = 8;
    const rowStep = (bottom - top) / rows;

    for (let r = 0; r < rows; r++) {
      const baseY = top + r * rowStep;
      const rowProgress = r / rows;
      const rowAlpha = causticIntensity * (1 - rowProgress * 0.7);

      ctx.beginPath();
      const stepX = 20;
      for (let x = -20; x <= this.width + 30; x += stepX) {
        const worldX = this.vehicle.position.x + (x - this.focusX) / this.pxPerMeter;
        // Primary sweeping caustic ripple
        const wave1 = Math.sin(worldX * 0.18 + this.elapsed * 1.35 + r * 1.2) * 9;
        // Secondary harmonic counter-ripple
        const wave2 = Math.cos(worldX * 0.32 - this.elapsed * 0.95 + r * 2.1) * 5;
        // Vertical swell motion
        const y = baseY + wave1 + wave2;

        if (x === -20) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.strokeStyle = `rgba(180, 248, 235, ${rowAlpha})`;
      ctx.lineWidth = 1.2 + (1 - rowProgress) * 2.2;
      ctx.stroke();

      // Shimmering caustic nodal spots
      if (this.quality === 'high' && r % 2 === 0) {
        for (let s = 0; s < 4; s++) {
          const spotWorldX = Math.round((this.vehicle.position.x + s * 25) / 30) * 30 + r * 12;
          const spotSx = this.screenX(spotWorldX);
          if (spotSx > -20 && spotSx < this.width + 20) {
            const spotY = baseY + Math.sin(spotWorldX * 0.18 + this.elapsed * 1.35 + r * 1.2) * 9;
            ctx.beginPath();
            ctx.arc(spotSx, spotY, 2.5 + (1 - rowProgress) * 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(215, 255, 248, ${rowAlpha * 1.5})`;
            ctx.fill();
          }
        }
      }
    }

    ctx.restore();
  }

  private drawMidOceanRidge(darkness: number) {
    const ctx = this.ctx;
    const ridgeDepth = 2000;
    const floorY = this.screenY(ridgeDepth);
    if (floorY < -150 || floorY > this.height + 150) return;

    // Distant tectonic basalt wall silhouettes (flanking canyon rift)
    ctx.beginPath();
    ctx.moveTo(-20, this.height + 20);
    for (let x = -20; x <= this.width + 30; x += 25) {
      const worldX = this.vehicle.position.x + (x - this.focusX) / this.pxPerMeter;
      // Rift pass canyon drops between worldX -18 and +18
      const inChasm = Math.abs(worldX % 90 - 45) < 18;
      const chasmDrop = inChasm ? 120 : 0;
      const ridgeHeight = (Math.sin(worldX * 0.08) * 18 + Math.cos(worldX * 0.035) * 28 + 45) - chasmDrop;
      ctx.lineTo(x, floorY - ridgeHeight);
    }
    ctx.lineTo(this.width + 20, this.height + 20);
    ctx.closePath();
    ctx.fillStyle = '#020b12';
    ctx.fill();

    // Foreground rift terraces & basalt columns
    ctx.beginPath();
    ctx.moveTo(-20, this.height + 20);
    for (let x = -20; x <= this.width + 30; x += 15) {
      const worldX = this.vehicle.position.x + (x - this.focusX) / this.pxPerMeter;
      const inChasm = Math.abs(worldX % 90 - 45) < 15;
      const chasmDrop = inChasm ? 140 : 0;
      const rockyContour = (Math.sin(worldX * 0.14) * 8 + Math.sin(worldX * 0.05) * 15 + 14) - chasmDrop;
      ctx.lineTo(x, floorY - rockyContour);
    }
    ctx.lineTo(this.width + 20, this.height + 20);
    ctx.closePath();
    ctx.fillStyle = '#01060a';
    ctx.fill();

    ctx.strokeStyle = 'rgba(74,138,145,0.22)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Hydrothermal black smoker chimneys & thermal particulate
    const chimneyWorldX = this.wrapCoord(22, 90);
    const chimneyScreenX = this.screenX(chimneyWorldX);
    if (chimneyScreenX > -50 && chimneyScreenX < this.width + 50) {
      const baseFloor = floorY - 14;

      this.activeCreatures.push({
        screenX: chimneyScreenX,
        screenY: baseFloor - 36,
        name: 'HYDROTHERMAL BLACK SMOKER',
        category: 'Geological Feature · 2,000 m Rift',
        isHero: false,
        radius: 30,
        distM: Math.hypot(chimneyWorldX - this.vehicle.position.x, ridgeDepth - this.depth),
      });

      // Chimney column
      ctx.beginPath();
      ctx.moveTo(chimneyScreenX - 9, baseFloor);
      ctx.lineTo(chimneyScreenX - 5, baseFloor - 48);
      ctx.lineTo(chimneyScreenX + 5, baseFloor - 48);
      ctx.lineTo(chimneyScreenX + 8, baseFloor);
      ctx.closePath();
      ctx.fillStyle = '#081720';
      ctx.strokeStyle = 'rgba(120,200,210,0.3)';
      ctx.lineWidth = 1;
      ctx.fill();
      ctx.stroke();

      // Shimmering mineral thermal particulate rising from chimney
      for (let p = 0; p < 10; p++) {
        const pPhase = (this.elapsed * 1.5 + p * 0.25) % 1;
        const py = baseFloor - 48 - pPhase * 70;
        const px = chimneyScreenX + Math.sin(p * 2.1 + this.elapsed * 2.5) * (4 + pPhase * 14);
        ctx.beginPath();
        ctx.arc(px, py, 1.3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(145,245,230,${(1 - pPhase) * 0.5})`;
        ctx.fill();
      }
    }

    // Deep-sea stalked glass sponge silhouettes on rock outcrops
    for (let s = -2; s <= 2; s++) {
      const spongeWorldX = Math.round(this.vehicle.position.x / 40) * 40 + s * 35;
      const spongeScreenX = this.screenX(spongeWorldX);
      if (spongeScreenX > -30 && spongeScreenX < this.width + 30) {
        const sy = floorY - 18;
        ctx.beginPath();
        ctx.moveTo(spongeScreenX, sy);
        ctx.lineTo(spongeScreenX + Math.sin(this.elapsed * 0.4 + s) * 2, sy - 22);
        ctx.strokeStyle = 'rgba(110,180,190,0.35)';
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(spongeScreenX + Math.sin(this.elapsed * 0.4 + s) * 2, sy - 24, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(140,230,235,0.4)';
        ctx.fill();
      }
    }
  }

  private drawWhaleFall(darkness: number) {
    const ctx = this.ctx;
    const wfDepth = 3200;
    const floorY = this.screenY(wfDepth);
    if (floorY < -150 || floorY > this.height + 150) return;

    const wfWorldX = this.wrapCoord(25, 200);
    const wfScreenX = this.screenX(wfWorldX);
    if (wfScreenX < -200 || wfScreenX > this.width + 200) return;

    // Sediment terrace beneath skeleton
    ctx.beginPath();
    ctx.moveTo(wfScreenX - 160, floorY + 40);
    ctx.quadraticCurveTo(wfScreenX, floorY - 6, wfScreenX + 160, floorY + 40);
    ctx.lineTo(wfScreenX + 160, this.height + 20);
    ctx.lineTo(wfScreenX - 160, this.height + 20);
    ctx.closePath();
    ctx.fillStyle = '#010508';
    ctx.fill();
    ctx.strokeStyle = 'rgba(60, 115, 125, 0.25)';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    this.activeCreatures.push({
      screenX: wfScreenX,
      screenY: floorY - 26,
      name: 'ABYSSAL WHALE FALL ECOSYSTEM',
      category: 'Chemosynthetic Oasis · 3,200 m',
      isHero: false,
      radius: 46,
      distM: Math.hypot(wfWorldX - this.vehicle.position.x, wfDepth - this.depth),
    });

    ctx.save();
    ctx.translate(wfScreenX, floorY);

    // 1. Whale Skull (massive rostrum and hollow cranial cavity)
    ctx.beginPath();
    ctx.moveTo(70, -4);
    ctx.bezierCurveTo(90, -12, 105, -6, 115, -2);
    ctx.lineTo(112, 4);
    ctx.quadraticCurveTo(85, 8, 65, 3);
    ctx.closePath();
    ctx.fillStyle = '#c5d8dc';
    ctx.strokeStyle = 'rgba(75, 120, 130, 0.6)';
    ctx.lineWidth = 1.2;
    ctx.fill();
    ctx.stroke();

    // Eye socket
    ctx.beginPath();
    ctx.ellipse(88, -2, 5, 3.5, 0.1, 0, Math.PI * 2);
    ctx.fillStyle = '#020b12';
    ctx.fill();

    // 2. Articulated Spinal Column (vertebrae)
    ctx.beginPath();
    ctx.moveTo(65, 0);
    ctx.bezierCurveTo(15, -12, -45, -8, -105, 4);
    ctx.strokeStyle = '#b8ccd2';
    ctx.lineWidth = 5;
    ctx.stroke();

    // Vertebrae segments
    for (let v = -95; v <= 55; v += 12) {
      ctx.beginPath();
      ctx.moveTo(v, -8);
      ctx.lineTo(v, 4);
      ctx.strokeStyle = '#051218';
      ctx.lineWidth = 1.6;
      ctx.stroke();
    }

    // 3. Arched Ivory Ribs curving upward into water column
    const ribPositions = [45, 32, 18, 5, -10, -26, -42, -58, -74];
    for (let i = 0; i < ribPositions.length; i++) {
      const rx = ribPositions[i];
      const ribHeight = 28 - i * 1.8;
      ctx.beginPath();
      ctx.moveTo(rx, 0);
      ctx.quadraticCurveTo(rx - 8, -ribHeight, rx + 4, -ribHeight - 6);
      ctx.strokeStyle = '#d6e4e8';
      ctx.lineWidth = 2.2;
      ctx.stroke();

      // Chemosynthetic Osedax "zombie" worm colonies on ribs (red waving plumes)
      const plumeCount = 3;
      for (let p = 0; p < plumeCount; p++) {
        const py = -ribHeight * (0.35 + p * 0.28);
        const px = rx - 5;
        const wave = Math.sin(this.elapsed * 2.5 + i * 1.2 + p) * 3;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.quadraticCurveTo(px + wave, py - 4, px + wave * 1.5, py - 7);
        ctx.strokeStyle = 'rgba(235, 60, 95, 0.75)';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(px + wave * 1.5, py - 7, 1.3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 95, 125, 0.85)';
        ctx.fill();
      }
    }

    // 4. Scavenger Lithodid Crabs crawling on the skeleton
    for (const crabX of [-35, 15, 60]) {
      const crabY = 3;
      ctx.beginPath();
      ctx.ellipse(crabX, crabY, 3.5, 2.5, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#8f4a38';
      ctx.fill();
      // Spider crab legs
      for (let leg = -1; leg <= 1; leg++) {
        ctx.beginPath();
        ctx.moveTo(crabX + leg * 2, crabY);
        ctx.lineTo(crabX + leg * 5 + Math.sin(this.elapsed * 1.5 + crabX) * 1.5, crabY + 4);
        ctx.strokeStyle = '#b8624c';
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }

    // 5. Patrolling Pacific Sleeper Shark silhouette in background
    const sharkPhase = (this.elapsed * 0.08) % 1;
    const sharkX = -140 + sharkPhase * 280;
    const sharkY = -65 + Math.sin(this.elapsed * 0.4) * 8;
    ctx.save();
    ctx.translate(sharkX, sharkY);
    ctx.beginPath();
    ctx.ellipse(0, 0, 36, 9, 0, 0, Math.PI * 2);
    ctx.moveTo(-6, -8); ctx.lineTo(-2, -18); ctx.lineTo(6, -8);
    ctx.moveTo(14, -7); ctx.lineTo(17, -13); ctx.lineTo(22, -7);
    ctx.moveTo(34, 0); ctx.lineTo(48, -14); ctx.lineTo(44, 0); ctx.lineTo(47, 10); ctx.lineTo(34, 0);
    ctx.fillStyle = 'rgba(8, 22, 30, 0.55)';
    ctx.fill();
    ctx.restore();

    ctx.restore();
  }

  private drawAbyssalPlain(darkness: number) {
    const ctx = this.ctx;
    const floorY = this.screenY(4000);
    if (floorY > this.height + 150) return;

    // Distant abyssal basalt bedrock ridge
    ctx.beginPath();
    ctx.moveTo(-20, this.height + 20);
    for (let x = -20; x <= this.width + 30; x += 25) {
      const worldX = this.vehicle.position.x + (x - this.focusX) / this.pxPerMeter;
      const ridgeHeight = Math.sin(worldX * 0.06) * 15 + Math.cos(worldX * 0.025) * 22 + 40;
      ctx.lineTo(x, floorY - ridgeHeight);
    }
    ctx.lineTo(this.width + 20, this.height + 20);
    ctx.closePath();
    ctx.fillStyle = '#010508';
    ctx.fill();

    // Foreground abyssal sediment plain with soft silt ripples
    ctx.beginPath();
    ctx.moveTo(-20, this.height + 20);
    for (let x = -20; x <= this.width + 30; x += 15) {
      const worldX = this.vehicle.position.x + (x - this.focusX) / this.pxPerMeter;
      const rockyContour = Math.sin(worldX * 0.12) * 6 + Math.sin(worldX * 0.04) * 12 + 10;
      ctx.lineTo(x, floorY - rockyContour);
    }
    ctx.lineTo(this.width + 20, this.height + 20);
    ctx.closePath();
    ctx.fillStyle = '#000305';
    ctx.fill();

    ctx.strokeStyle = 'rgba(55, 110, 115, 0.2)';
    ctx.lineWidth = 1.4;
    ctx.stroke();

    // Manganese nodules strewn across the sediment
    for (let n = -6; n <= 6; n++) {
      const noduleWorldX = Math.round(this.vehicle.position.x / 18) * 18 + n * 16 + 5;
      const nx = this.screenX(noduleWorldX);
      if (nx > -20 && nx < this.width + 20) {
        const ny = floorY - 8 + Math.sin(noduleWorldX * 0.3) * 3;
        ctx.beginPath();
        ctx.ellipse(nx, ny, 3.2, 2.2, 0.2, 0, Math.PI * 2);
        ctx.fillStyle = '#06131c';
        ctx.strokeStyle = 'rgba(40, 85, 95, 0.4)';
        ctx.lineWidth = 0.8;
        ctx.fill();
        ctx.stroke();
      }
    }

    // Benthic Lander AL-IV scientific artifact at worldX = -20, depth = 3,988 m
    const landerWorldX = this.wrapCoord(-20, 160);
    const landerScreenX = this.screenX(landerWorldX);
    if (landerScreenX > -80 && landerScreenX < this.width + 80) {
      const ly = floorY - 12;

      this.activeCreatures.push({
        screenX: landerScreenX,
        screenY: ly - 36,
        name: 'BENTHIC LANDER AL-IV',
        category: 'Deep-Ocean Autonomous Observatory · 3,988 m',
        isHero: false,
        radius: 35,
        distM: Math.hypot(landerWorldX - this.vehicle.position.x, 3988 - this.depth),
      });

      ctx.save();
      ctx.translate(landerScreenX, ly);

      // Ballast drop weights / footpads
      ctx.fillStyle = '#1a2b32';
      ctx.fillRect(-18, -4, 9, 5);
      ctx.fillRect(9, -4, 9, 5);

      // Aluminum tripod structural truss
      ctx.beginPath();
      ctx.moveTo(-14, -3); ctx.lineTo(-5, -34);
      ctx.moveTo(14, -3); ctx.lineTo(5, -34);
      ctx.moveTo(0, -3); ctx.lineTo(0, -34);
      ctx.moveTo(-12, -18); ctx.lineTo(12, -18);
      ctx.strokeStyle = 'rgba(150, 205, 215, 0.65)';
      ctx.lineWidth = 1.4;
      ctx.stroke();

      // Titanium pressure sphere for instruments
      ctx.beginPath();
      ctx.arc(0, -34, 11, 0, Math.PI * 2);
      ctx.fillStyle = '#0b2633';
      ctx.strokeStyle = 'rgba(175, 235, 245, 0.8)';
      ctx.lineWidth = 1.6;
      ctx.fill();
      ctx.stroke();

      // Optical glass instrumentation port
      ctx.beginPath();
      ctx.arc(2, -34, 4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(90, 235, 220, 0.4)';
      ctx.fill();

      // Acoustic transponder antenna mast
      ctx.beginPath();
      ctx.moveTo(0, -45);
      ctx.lineTo(0, -62);
      ctx.strokeStyle = 'rgba(195, 240, 245, 0.85)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Strobe beacon flashing periodic xenon flash
      const strobeOn = (this.elapsed * 1.5) % 1 > 0.82;
      ctx.beginPath();
      ctx.arc(0, -63, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = strobeOn ? '#ffe875' : '#453a15';
      ctx.fill();

      if (strobeOn) {
        ctx.beginPath();
        ctx.arc(0, -63, 16, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 235, 120, 0.22)';
        ctx.fill();
      }

      ctx.restore();
    }
  }

  private drawHadalFault(darkness: number) {
    const ctx = this.ctx;
    const faultDepth = 6000;
    const floorY = this.screenY(faultDepth);
    if (floorY > this.height + 150) return;

    // Subducting Pacific Plate fault scarp (massive tectonic canyon wall on western side)
    ctx.beginPath();
    ctx.moveTo(-20, -50);
    ctx.lineTo(this.width * 0.35, floorY - 140);
    ctx.lineTo(this.width * 0.48, floorY - 70);
    ctx.lineTo(this.width * 0.62, floorY - 20);
    ctx.lineTo(this.width + 30, floorY + 10);
    ctx.lineTo(this.width + 30, this.height + 30);
    ctx.lineTo(-20, this.height + 30);
    ctx.closePath();
    ctx.fillStyle = '#000203';
    ctx.fill();

    // Serpentine fracture striations & piezoelectric luminescence
    ctx.beginPath();
    ctx.moveTo(-20, floorY - 220);
    ctx.lineTo(this.width * 0.3, floorY - 160);
    ctx.lineTo(this.width * 0.45, floorY - 90);
    ctx.strokeStyle = 'rgba(75, 210, 200, 0.28)';
    ctx.lineWidth = 1.4;
    ctx.stroke();

    // Tectonic fault friction glow
    for (let f = 0; f < 6; f++) {
      const fx = this.width * (0.15 + f * 0.12);
      const fy = floorY - 180 + f * 32;
      const glow = 0.4 + 0.4 * Math.sin(this.elapsed * 2.2 + f * 1.4);
      ctx.beginPath();
      ctx.arc(fx, fy, 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(90, 245, 230, ${glow * 0.6})`;
      ctx.fill();
    }

    // Moored Ocean Floor Hydrophone Station H-6000 at worldX = 25, depth = 5,950 m
    const hydroWorldX = this.wrapCoord(25, 180);
    const hydroScreenX = this.screenX(hydroWorldX);
    if (hydroScreenX > -80 && hydroScreenX < this.width + 80) {
      const hy = floorY - 30;

      this.activeCreatures.push({
        screenX: hydroScreenX,
        screenY: hy - 40,
        name: 'HADAL SUBDUCTION FAULT GATEWAY',
        category: 'Tectonic Plate Boundary · Hydrophone H-6000 · 6,000 m',
        isHero: false,
        radius: 40,
        distM: Math.hypot(hydroWorldX - this.vehicle.position.x, 5950 - this.depth),
      });

      ctx.save();
      ctx.translate(hydroScreenX, hy);

      // Heavy anchor clump weights on tectonic rock
      ctx.fillStyle = '#121e25';
      ctx.fillRect(-15, -6, 30, 8);

      // Heavy mooring riser cable
      ctx.beginPath();
      ctx.moveTo(0, -6);
      ctx.lineTo(0, -42);
      ctx.strokeStyle = 'rgba(175, 230, 240, 0.6)';
      ctx.lineWidth = 1.4;
      ctx.stroke();

      // Sub-surface buoyancy glass sphere housing
      ctx.beginPath();
      ctx.arc(0, -42, 12, 0, Math.PI * 2);
      ctx.fillStyle = '#071822';
      ctx.strokeStyle = 'rgba(160, 240, 245, 0.85)';
      ctx.lineWidth = 1.6;
      ctx.fill();
      ctx.stroke();

      // Hydrophone low-frequency geophone sensor arms
      ctx.beginPath();
      ctx.moveTo(-18, -42); ctx.lineTo(18, -42);
      ctx.moveTo(0, -30); ctx.lineTo(0, -54);
      ctx.strokeStyle = 'rgba(130, 215, 225, 0.7)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Pulsing red seismic telemetry beacon (monitoring subduction tremors)
      const beaconOn = (this.elapsed * 2.2) % 1 > 0.75;
      ctx.beginPath();
      ctx.arc(0, -56, 3, 0, Math.PI * 2);
      ctx.fillStyle = beaconOn ? '#ff3b65' : '#450d18';
      ctx.fill();

      if (beaconOn) {
        ctx.beginPath();
        ctx.arc(0, -56, 18, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 60, 100, 0.25)';
        ctx.fill();
      }

      ctx.restore();
    }
  }

  private drawParticles(darkness: number) {
    const ctx = this.ctx;
    const step = this.quality === 'low' ? 3 : 1;
    const baseColor = `rgba(189,235,226,${0.15 + darkness * 0.28})`;
    const beamStartX = this.focusX + this.facing * 50;
    const beamY = this.focusY + 4;
    const reach = 175 + darkness * 75;

    for (let i = 0; i < this.particles.length; i += step) {
      const particle = this.particles[i];
      const wrappedX = particle.x + Math.round((this.vehicle.position.x - particle.x) / 420) * 420;
      const x = this.screenX(wrappedX) + Math.sin(this.elapsed * 0.17 + particle.phase) * 3;
      const y = this.screenY(particle.depth) - (this.elapsed * (0.8 + particle.radius) % 24);
      if (x < 0 || x > this.width || y < 0 || y > this.height) continue;

      // Volumetric beam illumination on marine snow
      let isIlluminated = false;
      if (this.lightsOn && this.depth >= 2) {
        const deltaX = (x - beamStartX) * this.facing;
        if (deltaX > 0 && deltaX < reach) {
          const beamSpread = 16 + deltaX * 0.42;
          if (Math.abs(y - beamY) < beamSpread) {
            isIlluminated = true;
          }
        }
      }

      ctx.beginPath();
      ctx.arc(x, y, isIlluminated ? particle.radius * 1.3 : particle.radius, 0, Math.PI * 2);
      ctx.fillStyle = isIlluminated ? 'rgba(235,255,250,0.85)' : baseColor;
      ctx.fill();
    }
  }

  private wrapCoord(baseX: number, interval: number): number {
    return baseX + Math.round((this.vehicle.position.x - baseX) / interval) * interval;
  }

  private drawAmbientWildlife(darkness: number) {
    const depth = this.depth;
    // 1. Epipelagic / Sunlight Zone (0 – 200 m) - Abundant, dense schooling life
    if (depth < 220) {
      this.drawSunlightLife(darkness);
    }
    // 2. Mesopelagic / Twilight Zone (180 – 750 m) - Moderate, ethereal life
    if (depth >= 180 && depth <= 750) {
      this.drawTwilightLife(darkness);
    }
    // 3. Bathypelagic / Midnight Zone (750 – 1,000 m) - Sparse, quiet abyssal life
    if (depth >= 750) {
      this.drawAbyssalLife(darkness);
    }
  }

  private drawSunlightLife(darkness: number) {
    const ctx = this.ctx;
    const fishColor = `rgba(7, 36, 48, ${0.72 * (1 - darkness)})`;

    // A. Multiple Schools of Epipelagic Fish (schools wrap seamlessly every 85m)
    for (let s = 0; s < 4; s++) {
      const baseSchoolX = s * 22;
      const schoolX = this.wrapCoord(baseSchoolX, 85);
      const schoolDepth = 25 + s * 38;
      const schoolHeading = s % 2 === 0 ? 1 : -1;
      const schoolSx = this.screenX(schoolX);
      const schoolSy = this.screenY(schoolDepth);

      if (schoolSx > -60 && schoolSx < this.width + 60 && schoolSy > -40 && schoolSy < this.height + 40) {
        this.activeCreatures.push({
          screenX: schoolSx,
          screenY: schoolSy,
          name: 'EPIPELAGIC SCHOOLING FISH',
          category: 'Ambient scenery · Epipelagic',
          radius: 28,
          distM: Math.hypot(schoolX - this.vehicle.position.x, schoolDepth - this.depth),
        });
      }

      for (let i = 0; i < 14; i++) {
        const row = Math.floor(i / 5);
        const col = i % 5;
        const fx = schoolX + (col * 3.5 - 7 + Math.sin(this.elapsed * 0.9 + i) * 1.5) * schoolHeading;
        const fy = schoolDepth + (row * 3 - 3 + Math.sin(this.elapsed * 1.4 + col) * 1.2);
        const sx = this.screenX(fx) + Math.sin(this.elapsed * 0.35 + s) * 18;
        const sy = this.screenY(fy);

        if (sx < -25 || sx > this.width + 25 || sy < -25 || sy > this.height + 25) continue;

        const size = 5.5 + (i % 3) * 1.2;
        ctx.save();
        ctx.translate(sx, sy);
        ctx.scale(schoolHeading, 1);
        ctx.beginPath();
        ctx.moveTo(-size, 0);
        ctx.quadraticCurveTo(0, -size * 0.45, size, 0);
        ctx.quadraticCurveTo(0, size * 0.45, -size, 0);
        // Tail fin
        ctx.moveTo(-size, 0);
        const tailWag = Math.sin(this.elapsed * 12 + i) * 1.8;
        ctx.lineTo(-size * 1.6, -size * 0.55 + tailWag);
        ctx.lineTo(-size * 1.6, size * 0.55 + tailWag);
        ctx.closePath();
        ctx.fillStyle = fishColor;
        ctx.fill();
        ctx.restore();
      }
    }

    // B. Gliding Manta Ray Silhouette (cruises horizontally at 40-75m)
    const rayBaseX = 15;
    const rayX = this.wrapCoord(rayBaseX, 130);
    const rayDepth = 55 + Math.sin(this.elapsed * 0.2) * 8;
    const raySx = this.screenX(rayX + (this.elapsed * 4) % 130 - 65);
    const raySy = this.screenY(rayDepth);
    if (raySx > -60 && raySx < this.width + 60 && raySy > -40 && raySy < this.height + 40) {
      this.activeCreatures.push({
        screenX: raySx,
        screenY: raySy,
        name: 'PELAGIC RAY',
        category: 'Ambient scenery · Epipelagic',
        radius: 32,
        distM: Math.hypot(rayX - this.vehicle.position.x, rayDepth - this.depth),
      });

      ctx.save();
      ctx.translate(raySx, raySy);
      const wingFlap = Math.sin(this.elapsed * 1.8) * 4;
      ctx.beginPath();
      ctx.moveTo(22, 0); // Head / cephalic horns
      ctx.lineTo(26, -3);
      ctx.lineTo(23, -5);
      ctx.lineTo(15, -6);
      ctx.quadraticCurveTo(4, -18 + wingFlap, -8, -26 + wingFlap * 1.3); // Port wing tip
      ctx.quadraticCurveTo(-14, -8, -18, 0); // Trailing wing edge
      ctx.lineTo(-32, 0); // Tail
      ctx.lineTo(-18, 0);
      ctx.quadraticCurveTo(-14, 8, -8, 26 - wingFlap * 1.3); // Starboard wing tip
      ctx.quadraticCurveTo(4, 18 - wingFlap, 15, 6);
      ctx.lineTo(23, 5);
      ctx.lineTo(26, 3);
      ctx.closePath();
      ctx.fillStyle = `rgba(10, 42, 54, ${0.5 * (1 - darkness)})`;
      ctx.fill();
      ctx.restore();
    }

    // C. Translucent Surface Moon Jellies (15m – 90m)
    for (let j = 0; j < 5; j++) {
      const jx = this.wrapCoord(j * 26, 95);
      const jd = 30 + j * 16 + Math.sin(this.elapsed * 0.4 + j) * 6;
      const jsx = this.screenX(jx) + Math.sin(this.elapsed * 0.25 + j) * 8;
      const jsy = this.screenY(jd);
      if (jsx < -30 || jsx > this.width + 30 || jsy < -30 || jsy > this.height + 30) continue;

      this.activeCreatures.push({
        screenX: jsx,
        screenY: jsy,
        name: 'MOON JELLY',
        category: 'Ambient scenery · Epipelagic',
        radius: 16,
        distM: Math.hypot(jx - this.vehicle.position.x, jd - this.depth),
      });

      const jRad = 10 + (j % 3) * 3;
      const jPulse = 1 + Math.sin(this.elapsed * 1.6 + j) * 0.12;
      ctx.save();
      ctx.translate(jsx, jsy);
      ctx.scale(jPulse, 1 / jPulse);
      ctx.beginPath();
      ctx.arc(0, 0, jRad, Math.PI, 0);
      ctx.quadraticCurveTo(jRad * 0.5, 3, 0, 0);
      ctx.quadraticCurveTo(-jRad * 0.5, 3, -jRad, 0);
      ctx.fillStyle = `rgba(185, 235, 240, ${0.25 * (1 - darkness)})`;
      ctx.strokeStyle = `rgba(210, 245, 248, ${0.35 * (1 - darkness)})`;
      ctx.lineWidth = 1;
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    // D. Pod of Bottlenose Dolphins (12m – 45m)
    const dolphinBaseX = 65;
    const dolphinX = this.wrapCoord(dolphinBaseX, 150);
    const dolphinSpeed = 7;
    const dolphinCurrX = dolphinX + (this.elapsed * dolphinSpeed) % 150 - 75;
    const dolphinDepth = 22 + Math.sin(this.elapsed * 0.4) * 6;
    const dsx = this.screenX(dolphinCurrX);
    const dsy = this.screenY(dolphinDepth);

    if (dsx > -80 && dsx < this.width + 80 && dsy > -40 && dsy < this.height + 40) {
      this.activeCreatures.push({
        screenX: dsx,
        screenY: dsy,
        name: 'BOTTLENOSE DOLPHINS',
        category: 'Ambient scenery · Epipelagic',
        radius: 36,
        distM: Math.hypot(dolphinCurrX - this.vehicle.position.x, dolphinDepth - this.depth),
      });

      // Draw pod leader and calf/partner
      for (const offset of [{ dx: 0, dy: 0, s: 1.0 }, { dx: -24, dy: 9, s: 0.75 }]) {
        ctx.save();
        ctx.translate(dsx + offset.dx, dsy + offset.dy);
        ctx.scale(offset.s, offset.s);

        const swimWave = Math.sin(this.elapsed * 4 + offset.dx * 0.1);
        ctx.rotate(swimWave * 0.08);

        ctx.beginPath();
        // Rostrum / beak
        ctx.moveTo(26, 0);
        ctx.quadraticCurveTo(20, -5, 12, -7);
        ctx.lineTo(2, -8);
        // Curved dorsal fin
        ctx.quadraticCurveTo(-2, -16, -7, -17);
        ctx.quadraticCurveTo(-5, -9, -9, -7);
        // Peduncle
        ctx.quadraticCurveTo(-18, -4, -26, swimWave * 3);
        // Flukes (tail)
        ctx.lineTo(-32, -6 + swimWave * 4);
        ctx.lineTo(-29, swimWave * 3);
        ctx.lineTo(-32, 6 + swimWave * 4);
        ctx.lineTo(-26, swimWave * 3);
        // Belly and pectoral fin
        ctx.quadraticCurveTo(-16, 5, 2, 7);
        ctx.lineTo(6, 13);
        ctx.lineTo(8, 7);
        ctx.quadraticCurveTo(16, 5, 22, 2);
        ctx.closePath();
        ctx.fillStyle = `rgba(12, 45, 58, ${0.7 * (1 - darkness)})`;
        ctx.fill();
        ctx.restore();
      }
    }

    // E. Diving Harbor Seal (18m – 55m)
    const sealBaseX = -40;
    const sealX = this.wrapCoord(sealBaseX, 110);
    const sealDepth = 35 + Math.sin(this.elapsed * 0.5) * 10;
    const ssx = this.screenX(sealX + Math.sin(this.elapsed * 0.3) * 14);
    const ssy = this.screenY(sealDepth);

    if (ssx > -50 && ssx < this.width + 50 && ssy > -40 && ssy < this.height + 40) {
      this.activeCreatures.push({
        screenX: ssx,
        screenY: ssy,
        name: 'HARBOR SEAL',
        category: 'Ambient scenery · Epipelagic',
        radius: 24,
        distM: Math.hypot(sealX - this.vehicle.position.x, sealDepth - this.depth),
      });

      ctx.save();
      ctx.translate(ssx, ssy);
      const roll = Math.sin(this.elapsed * 0.8) * 0.2;
      const kick = Math.sin(this.elapsed * 3.5) * 3;
      ctx.rotate(roll + 0.15);

      ctx.beginPath();
      // Round inquisitive head
      ctx.arc(14, 0, 5.5, 0, Math.PI * 2);
      ctx.moveTo(10, -5);
      // Streamlined body
      ctx.quadraticCurveTo(0, -7, -10, -5);
      ctx.quadraticCurveTo(-18, -3, -22, kick);
      // Hind flippers
      ctx.lineTo(-28, -4 + kick);
      ctx.lineTo(-23, kick);
      ctx.lineTo(-28, 4 + kick);
      ctx.lineTo(-20, kick);
      ctx.quadraticCurveTo(-10, 5, 0, 7);
      // Fore flipper
      ctx.lineTo(4, 12);
      ctx.lineTo(7, 6);
      ctx.quadraticCurveTo(11, 4, 14, 0);
      ctx.closePath();
      ctx.fillStyle = `rgba(16, 50, 62, ${0.68 * (1 - darkness)})`;
      ctx.fill();
      ctx.restore();
    }

    // F. Pelagic Apex Shark (55m – 140m)
    const sharkBaseX = -85;
    const sharkX = this.wrapCoord(sharkBaseX, 160);
    const sharkSpeed = 5;
    const sharkCurrX = sharkX + (this.elapsed * sharkSpeed) % 160 - 80;
    const sharkDepth = 85 + Math.sin(this.elapsed * 0.22) * 12;
    const shsx = this.screenX(sharkCurrX);
    const shsy = this.screenY(sharkDepth);

    if (shsx > -80 && shsx < this.width + 80 && shsy > -50 && shsy < this.height + 50) {
      this.activeCreatures.push({
        screenX: shsx,
        screenY: shsy,
        name: 'PELAGIC SHARK',
        category: 'Ambient scenery · Epipelagic',
        radius: 38,
        distM: Math.hypot(sharkCurrX - this.vehicle.position.x, sharkDepth - this.depth),
      });

      ctx.save();
      ctx.translate(shsx, shsy);
      const wag = Math.sin(this.elapsed * 2.8) * 4.5;
      const bodyFlex = Math.sin(this.elapsed * 2.8) * 0.07;
      ctx.rotate(bodyFlex);

      ctx.beginPath();
      // Conical snout
      ctx.moveTo(34, 0);
      ctx.quadraticCurveTo(24, -7, 10, -9);
      // Iconic tall dorsal fin
      ctx.lineTo(2, -22);
      ctx.quadraticCurveTo(0, -21, -3, -9);
      // Second dorsal
      ctx.lineTo(-18, -6);
      ctx.lineTo(-21, -11);
      ctx.lineTo(-23, -5);
      // Caudal keel & heterocercal tail
      ctx.lineTo(-32, wag * 0.5);
      ctx.lineTo(-44, -16 + wag);
      ctx.quadraticCurveTo(-38, wag, -34, wag * 0.5);
      ctx.lineTo(-41, 10 + wag);
      ctx.lineTo(-31, wag * 0.5);
      // Pelvic and anal fins
      ctx.lineTo(-20, 5);
      ctx.lineTo(-16, 9);
      ctx.lineTo(-14, 5);
      // Pectoral fin
      ctx.lineTo(6, 7);
      ctx.lineTo(-2, 22);
      ctx.quadraticCurveTo(4, 18, 12, 6);
      // Lower jaw and snout
      ctx.quadraticCurveTo(24, 5, 34, 0);
      ctx.closePath();
      ctx.fillStyle = `rgba(8, 32, 44, ${0.78 * (1 - darkness)})`;
      ctx.fill();

      // Gill slits silhouette
      ctx.strokeStyle = `rgba(160, 220, 230, ${0.2 * (1 - darkness)})`;
      ctx.lineWidth = 1;
      for (let g = 0; g < 4; g++) {
        ctx.beginPath();
        ctx.moveTo(14 - g * 2.2, -3);
        ctx.lineTo(13 - g * 2.2, 3);
        ctx.stroke();
      }
      ctx.restore();
    }

    // G. Majestic Blue Whale (95m – 195m)
    const whaleBaseX = 110;
    const whaleX = this.wrapCoord(whaleBaseX, 220);
    const whaleSpeed = 3.2;
    const whaleCurrX = whaleX + (this.elapsed * whaleSpeed) % 220 - 110;
    const whaleDepth = 135 + Math.sin(this.elapsed * 0.15) * 14;
    const wsx = this.screenX(whaleCurrX);
    const wsy = this.screenY(whaleDepth);

    if (wsx > -140 && wsx < this.width + 140 && wsy > -70 && wsy < this.height + 70) {
      this.activeCreatures.push({
        screenX: wsx,
        screenY: wsy,
        name: 'BLUE WHALE',
        category: this.isDiscovered('blue-whale')
          ? 'Catalogued · NOAA Sourced Record'
          : 'Documented Species · Balaenoptera musculus',
        isHero: true,
        radius: 65,
        distM: Math.hypot(whaleCurrX - this.vehicle.position.x, whaleDepth - this.depth),
      });

      ctx.save();
      ctx.translate(wsx, wsy);
      const flukeWave = Math.sin(this.elapsed * 1.2) * 5;
      const flipperWave = Math.sin(this.elapsed * 1.5) * 3;

      ctx.beginPath();
      // Broad rostrum and head
      ctx.moveTo(70, -2);
      ctx.quadraticCurveTo(45, -16, 10, -17);
      // Massive back with small dorsal fin near tail
      ctx.quadraticCurveTo(-30, -15, -55, -8);
      ctx.lineTo(-58, -13);
      ctx.lineTo(-61, -7);
      // Peduncle
      ctx.quadraticCurveTo(-75, -4, -88, flukeWave);
      // Expansive flukes
      ctx.lineTo(-98, -16 + flukeWave * 1.2);
      ctx.quadraticCurveTo(-94, flukeWave, -90, flukeWave);
      ctx.lineTo(-98, 16 + flukeWave * 1.2);
      ctx.lineTo(-88, flukeWave);
      // Belly with ventral throat grooves
      ctx.quadraticCurveTo(-60, 10, -20, 16);
      ctx.quadraticCurveTo(20, 18, 55, 10);
      ctx.quadraticCurveTo(68, 5, 70, -2);
      ctx.closePath();
      ctx.fillStyle = `rgba(6, 26, 38, ${0.72 * (1 - darkness)})`;
      ctx.fill();

      // Long pectoral flipper
      ctx.beginPath();
      ctx.moveTo(25, 8);
      ctx.quadraticCurveTo(15, 28 + flipperWave, -5, 34 + flipperWave);
      ctx.quadraticCurveTo(8, 20, 28, 8);
      ctx.fillStyle = `rgba(4, 20, 30, ${0.8 * (1 - darkness)})`;
      ctx.fill();

      // Ventral throat pleats
      ctx.strokeStyle = `rgba(140, 200, 215, ${0.12 * (1 - darkness)})`;
      ctx.lineWidth = 0.9;
      for (let pl = 0; pl < 5; pl++) {
        ctx.beginPath();
        ctx.moveTo(58 - pl * 2, 7 + pl * 1.8);
        ctx.quadraticCurveTo(25, 14 + pl * 1.6, -10, 10 + pl * 1.2);
        ctx.stroke();
      }

      ctx.restore();
    }
  }

  private drawTwilightLife(darkness: number) {
    const ctx = this.ctx;

    // A. Crown Jellyfish (Periphylla periphylla) (220m – 450m)
    for (let k = 0; k < 4; k++) {
      const kx = this.wrapCoord(k * 30 + 12, 100);
      const kd = 240 + k * 55 + Math.sin(this.elapsed * 0.35 + k) * 9;
      const ksx = this.screenX(kx) + Math.sin(this.elapsed * 0.2 + k) * 7;
      const ksy = this.screenY(kd);
      if (ksx < -35 || ksx > this.width + 35 || ksy < -45 || ksy > this.height + 45) continue;

      this.activeCreatures.push({
        screenX: ksx,
        screenY: ksy,
        name: 'CROWN JELLYFISH',
        category: 'Ambient scenery · Mesopelagic',
        radius: 20,
        distM: Math.hypot(kx - this.vehicle.position.x, kd - this.depth),
      });

      const kPulse = 1 + Math.sin(this.elapsed * 1.2 + k) * 0.15;
      const rad = 13 + (k % 2) * 4;
      ctx.save();
      ctx.translate(ksx, ksy);
      ctx.scale(kPulse, 1 / kPulse);

      // Deep maroon coronal dome
      ctx.beginPath();
      ctx.arc(0, -6, rad, Math.PI, 0);
      ctx.lineTo(rad, 2);
      ctx.quadraticCurveTo(0, 7, -rad, 2);
      ctx.closePath();
      ctx.fillStyle = 'rgba(78, 28, 45, 0.42)';
      ctx.strokeStyle = 'rgba(182, 85, 120, 0.45)';
      ctx.lineWidth = 1.2;
      ctx.fill();
      ctx.stroke();

      // Trailing bioluminescent tentacles
      for (let t = -3; t <= 3; t++) {
        ctx.beginPath();
        ctx.moveTo(t * rad * 0.28, 4);
        ctx.quadraticCurveTo(t * 3 + Math.sin(this.elapsed * 1.5 + t) * 4, 18, t * 2, 34);
        ctx.strokeStyle = 'rgba(195, 105, 135, 0.38)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      ctx.restore();
    }

    // B. Comb Jellies / Ctenophores with iridescent rainbow cilia fringes (280m – 520m)
    for (let c = 0; c < 3; c++) {
      const cx = this.wrapCoord(c * 35 + 20, 90);
      const cd = 310 + c * 70 + Math.sin(this.elapsed * 0.4 + c) * 6;
      const csx = this.screenX(cx);
      const csy = this.screenY(cd);
      if (csx < -25 || csx > this.width + 25 || csy < -25 || csy > this.height + 25) continue;

      this.activeCreatures.push({
        screenX: csx,
        screenY: csy,
        name: 'COMB JELLY (CTENOPHORE)',
        category: 'Ambient scenery · Mesopelagic',
        radius: 16,
        distM: Math.hypot(cx - this.vehicle.position.x, cd - this.depth),
      });

      ctx.save();
      ctx.translate(csx, csy);
      ctx.beginPath();
      ctx.ellipse(0, 0, 8, 14, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(140, 225, 230, 0.22)';
      ctx.strokeStyle = 'rgba(175, 240, 245, 0.35)';
      ctx.lineWidth = 1;
      ctx.fill();
      ctx.stroke();

      // Shimmering comb rows
      for (let r = -1; r <= 1; r += 2) {
        const shimmerPhase = (this.elapsed * 4 + r) % 1;
        ctx.beginPath();
        ctx.arc(r * 4, (shimmerPhase - 0.5) * 16, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = r === 1 ? 'rgba(100, 255, 230, 0.7)' : 'rgba(255, 150, 220, 0.7)';
        ctx.fill();
      }
      ctx.restore();
    }

    // C. Midwater Siphonophore Chains (340m – 580m)
    for (let p = 0; p < 2; p++) {
      const px = this.wrapCoord(p * 50 + 15, 110);
      const pd = 360 + p * 120;
      const psx = this.screenX(px);
      const psy = this.screenY(pd);
      if (psx < -25 || psx > this.width + 25 || psy < -50 || psy > this.height + 50) continue;

      this.activeCreatures.push({
        screenX: psx,
        screenY: psy,
        name: 'SIPHONOPHORE COLONY',
        category: 'Ambient scenery · Mesopelagic',
        radius: 22,
        distM: Math.hypot(px - this.vehicle.position.x, pd - this.depth),
      });

      ctx.save();
      ctx.translate(psx, psy);
      ctx.beginPath();
      for (let b = 0; b < 10; b++) {
        const bx = Math.sin(this.elapsed * 0.7 + b * 0.45) * 5;
        const by = b * 6 - 30;
        if (b === 0) ctx.moveTo(bx, by); else ctx.lineTo(bx, by);
      }
      ctx.strokeStyle = 'rgba(135, 235, 220, 0.45)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Chain nectophores (bells)
      for (let b = 0; b < 10; b += 2) {
        const bx = Math.sin(this.elapsed * 0.7 + b * 0.45) * 5;
        const by = b * 6 - 30;
        ctx.beginPath();
        ctx.arc(bx, by, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(160, 250, 235, 0.65)';
        ctx.fill();
      }
      ctx.restore();
    }

    // D. Midwater Lanternfish Pods (520m – 740m)
    for (let l = 0; l < 3; l++) {
      const lx = this.wrapCoord(l * 38 + 5, 80);
      const ld = 540 + l * 75;
      const podSx = this.screenX(lx);
      const podSy = this.screenY(ld);

      if (podSx > -40 && podSx < this.width + 40 && podSy > -40 && podSy < this.height + 40) {
        this.activeCreatures.push({
          screenX: podSx,
          screenY: podSy,
          name: 'LANTERNFISH',
          category: 'Ambient scenery · Mesopelagic',
          radius: 18,
          distM: Math.hypot(lx - this.vehicle.position.x, ld - this.depth),
        });
      }

      for (let f = 0; f < 5; f++) {
        const fsx = this.screenX(lx + f * 4 + Math.sin(this.elapsed * 0.8 + f) * 3);
        const fsy = this.screenY(ld + (f % 3) * 3 + Math.sin(this.elapsed * 1.1 + f) * 1.5);
        if (fsx < -15 || fsx > this.width + 15 || fsy < -15 || fsy > this.height + 15) continue;

        ctx.save();
        ctx.translate(fsx, fsy);
        ctx.beginPath();
        ctx.ellipse(0, 0, 5, 2, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(18, 42, 54, 0.75)';
        ctx.fill();

        // Ventral photophores (glowing bioluminescent dots)
        for (let p = -2; p <= 2; p++) {
          ctx.beginPath();
          ctx.arc(p * 1.5, 1.8, 0.7, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(110, 240, 255, 0.75)';
          ctx.fill();
        }
        ctx.restore();
      }
    }

    // E. Giant Pacific Octopus (230m – 370m)
    const octoBaseX = 35;
    const octoX = this.wrapCoord(octoBaseX, 135);
    const octoDepth = 290 + Math.sin(this.elapsed * 0.3) * 16;
    const osx = this.screenX(octoX);
    const osy = this.screenY(octoDepth);

    if (osx > -70 && osx < this.width + 70 && osy > -70 && osy < this.height + 70) {
      this.activeCreatures.push({
        screenX: osx,
        screenY: osy,
        name: 'GIANT OCTOPUS',
        category: 'Ambient scenery · Mesopelagic',
        radius: 34,
        distM: Math.hypot(octoX - this.vehicle.position.x, octoDepth - this.depth),
      });

      ctx.save();
      ctx.translate(osx, osy);
      const mantlePulse = 1 + Math.sin(this.elapsed * 1.3) * 0.08;
      ctx.scale(mantlePulse, mantlePulse);

      // Bulbous Mantle Head
      ctx.beginPath();
      ctx.ellipse(0, -18, 14, 18, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(48, 18, 28, 0.65)';
      ctx.strokeStyle = 'rgba(145, 60, 85, 0.45)';
      ctx.lineWidth = 1.2;
      ctx.fill();
      ctx.stroke();

      // Lateral Eyes
      for (const eyeSide of [-1, 1]) {
        ctx.beginPath();
        ctx.arc(eyeSide * 9, -5, 2.4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(180, 220, 230, 0.6)';
        ctx.fill();
      }

      // 8 Gracefully Curling Tentacles
      for (let t = -3.5; t <= 3.5; t += 1) {
        const tWave = Math.sin(this.elapsed * 1.6 + t * 0.8);
        const tCurl = Math.cos(this.elapsed * 1.2 + t * 0.7);
        const startX = t * 3.2;
        const startY = -1;
        const cp1x = startX + t * 5 + tWave * 6;
        const cp1y = startY + 16;
        const cp2x = startX + t * 9 + tCurl * 12;
        const cp2y = startY + 34;
        const endX = startX + t * 6 + tWave * 16;
        const endY = startY + 48;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY);
        ctx.strokeStyle = 'rgba(92, 34, 52, 0.7)';
        ctx.lineWidth = 2.4 - Math.abs(t) * 0.2;
        ctx.stroke();

        // Tiny suckers highlight
        ctx.beginPath();
        ctx.arc(cp2x, cp2y, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(195, 120, 150, 0.45)';
        ctx.fill();
      }
      ctx.restore();
    }

    // F. Sperm Whale (Physeter macrocephalus) on Deep Foraging Dive (430m – 620m)
    const spermBaseX = -70;
    const spermX = this.wrapCoord(spermBaseX, 190);
    const spermSpeed = 4.2;
    const spermCurrX = spermX + (this.elapsed * spermSpeed) % 190 - 95;
    const spermDepth = 510 + Math.sin(this.elapsed * 0.18) * 22;
    const spsx = this.screenX(spermCurrX);
    const spsy = this.screenY(spermDepth);

    if (spsx > -120 && spsx < this.width + 120 && spsy > -60 && spsy < this.height + 60) {
      this.activeCreatures.push({
        screenX: spsx,
        screenY: spsy,
        name: 'SPERM WHALE (DEEP DIVER)',
        category: 'Ambient scenery · Mesopelagic',
        radius: 55,
        distM: Math.hypot(spermCurrX - this.vehicle.position.x, spermDepth - this.depth),
      });

      ctx.save();
      ctx.translate(spsx, spsy);
      const diveAngle = 0.14 + Math.sin(this.elapsed * 0.5) * 0.05;
      const tailBeat = Math.sin(this.elapsed * 1.5) * 6;
      ctx.rotate(diveAngle);

      ctx.beginPath();
      // Massive blunt, squared-off block head
      ctx.moveTo(55, -16);
      ctx.lineTo(55, 12);
      // Underslung lower jaw
      ctx.lineTo(25, 12);
      ctx.lineTo(25, 6);
      ctx.lineTo(10, 6);
      // Belly line
      ctx.quadraticCurveTo(-20, 10, -50, 6);
      // Dorsal hump and ridges
      ctx.lineTo(-72, tailBeat);
      // Deep-notched triangular flukes
      ctx.lineTo(-84, -14 + tailBeat * 1.2);
      ctx.quadraticCurveTo(-78, tailBeat, -75, tailBeat);
      ctx.lineTo(-84, 14 + tailBeat * 1.2);
      ctx.lineTo(-72, tailBeat);
      // Dorsal ridge
      ctx.quadraticCurveTo(-50, -4, -30, -7);
      ctx.lineTo(-24, -13);
      ctx.lineTo(-18, -8);
      // Top of massive barrel forehead
      ctx.quadraticCurveTo(15, -14, 55, -16);
      ctx.closePath();
      ctx.fillStyle = 'rgba(12, 28, 38, 0.76)';
      ctx.strokeStyle = 'rgba(50, 110, 130, 0.35)';
      ctx.lineWidth = 1.2;
      ctx.fill();
      ctx.stroke();

      // Paddle-shaped pectoral fin
      ctx.beginPath();
      ctx.ellipse(14, 8, 8, 4, 0.3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(8, 22, 30, 0.85)';
      ctx.fill();

      // Single blowhole siphonal slit at left snout tip
      ctx.beginPath();
      ctx.moveTo(52, -14);
      ctx.lineTo(46, -15);
      ctx.strokeStyle = 'rgba(120, 200, 220, 0.45)';
      ctx.stroke();

      ctx.restore();
    }

    // G. Dumbo Octopus (Grimpoteuthis) (590m – 730m)
    const dumboBaseX = -20;
    const dumboX = this.wrapCoord(dumboBaseX, 115);
    const dumboDepth = 660 + Math.sin(this.elapsed * 0.4) * 14;
    const dmSx = this.screenX(dumboX);
    const dmSy = this.screenY(dumboDepth);

    if (dmSx > -40 && dmSx < this.width + 40 && dmSy > -40 && dmSy < this.height + 40) {
      this.activeCreatures.push({
        screenX: dmSx,
        screenY: dmSy,
        name: 'DUMBO OCTOPUS',
        category: 'Ambient scenery · Mesopelagic',
        radius: 20,
        distM: Math.hypot(dumboX - this.vehicle.position.x, dumboDepth - this.depth),
      });

      ctx.save();
      ctx.translate(dmSx, dmSy);
      const earFlap = Math.sin(this.elapsed * 3.5) * 5;
      const bPulse = 1 + Math.sin(this.elapsed * 1.4) * 0.08;
      ctx.scale(bPulse, bPulse);

      // Flapping ear-like fins
      for (const earSide of [-1, 1]) {
        ctx.beginPath();
        ctx.moveTo(earSide * 7, -6);
        ctx.quadraticCurveTo(earSide * (18 + earFlap * 0.5), -14 + earSide * earFlap, earSide * 16, -2);
        ctx.quadraticCurveTo(earSide * 11, -3, earSide * 7, -4);
        ctx.fillStyle = 'rgba(235, 160, 185, 0.55)';
        ctx.strokeStyle = 'rgba(255, 190, 210, 0.7)';
        ctx.lineWidth = 1;
        ctx.fill();
        ctx.stroke();
      }

      // Rounded soft dome mantle
      ctx.beginPath();
      ctx.arc(0, -2, 10, Math.PI, 0);
      ctx.quadraticCurveTo(10, 8, 0, 7);
      ctx.quadraticCurveTo(-10, 8, -10, -2);
      ctx.fillStyle = 'rgba(180, 80, 115, 0.45)';
      ctx.strokeStyle = 'rgba(225, 130, 165, 0.55)';
      ctx.lineWidth = 1;
      ctx.fill();
      ctx.stroke();

      // Dark large deep-sea eyes
      for (const es of [-1, 1]) {
        ctx.beginPath();
        ctx.arc(es * 5.5, 0, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(25, 45, 55, 0.85)';
        ctx.fill();
      }

      // Webbed skirt tentacles
      ctx.beginPath();
      ctx.moveTo(-9, 7);
      for (let arm = -3; arm <= 3; arm++) {
        const ax = arm * 2.8;
        const ay = 14 + Math.sin(this.elapsed * 2.5 + arm) * 2;
        ctx.lineTo(ax, ay);
      }
      ctx.lineTo(9, 7);
      ctx.strokeStyle = 'rgba(215, 120, 155, 0.5)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      ctx.restore();
    }
  }

  private drawAbyssalLife(darkness: number) {
    const ctx = this.ctx;

    // A. Solitary Deep-Sea Phantom Jelly / Giant Medusa (810m – 930m)
    const jellyBaseX = 42;
    const jellyX = this.wrapCoord(jellyBaseX, 140);
    const jellyDepth = 860 + Math.sin(this.elapsed * 0.25) * 12;
    const jsx = this.screenX(jellyX);
    const jsy = this.screenY(jellyDepth);

    if (jsx > -60 && jsx < this.width + 60 && jsy > -60 && jsy < this.height + 80) {
      this.activeCreatures.push({
        screenX: jsx,
        screenY: jsy,
        name: 'PHANTOM JELLY MEDUSA',
        category: 'Ambient scenery · Bathypelagic',
        radius: 32,
        distM: Math.hypot(jellyX - this.vehicle.position.x, jellyDepth - this.depth),
      });

      const jPulse = 1 + Math.sin(this.elapsed * 0.9) * 0.12;
      ctx.save();
      ctx.translate(jsx, jsy);
      ctx.scale(jPulse, 1 / jPulse);

      // Huge dark velvety umbrella bell
      ctx.beginPath();
      ctx.arc(0, 0, 24, Math.PI, 0);
      ctx.quadraticCurveTo(12, 10, 0, 8);
      ctx.quadraticCurveTo(-12, 10, -24, 0);
      ctx.closePath();
      ctx.fillStyle = 'rgba(38, 12, 22, 0.55)';
      ctx.strokeStyle = 'rgba(135, 52, 78, 0.45)';
      ctx.lineWidth = 1.3;
      ctx.fill();
      ctx.stroke();

      // Long ribbon oral arms drifting in the abyss
      for (let a = -2; a <= 2; a++) {
        ctx.beginPath();
        ctx.moveTo(a * 7, 6);
        ctx.bezierCurveTo(a * 10 + Math.sin(this.elapsed * 0.7 + a) * 8, 30, a * 14 + Math.sin(this.elapsed * 0.5 - a) * 12, 55, a * 8, 85);
        ctx.strokeStyle = 'rgba(110, 40, 60, 0.42)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
      ctx.restore();
    }

    // B. Rare Deep-Sea Anglerfish Silhouette (870m – 965m)
    const anglerBaseX = 85;
    const anglerX = this.wrapCoord(anglerBaseX, 170);
    const anglerDepth = 910 + Math.sin(this.elapsed * 0.3) * 7;
    const asx = this.screenX(anglerX);
    const asy = this.screenY(anglerDepth);

    if (asx > -40 && asx < this.width + 40 && asy > -40 && asy < this.height + 40) {
      this.activeCreatures.push({
        screenX: asx,
        screenY: asy,
        name: 'ABYSSAL ANGLERFISH',
        category: 'Ambient scenery · Bathypelagic',
        radius: 22,
        distM: Math.hypot(anglerX - this.vehicle.position.x, anglerDepth - this.depth),
      });

      ctx.save();
      ctx.translate(asx, asy);
      // Stout body
      ctx.beginPath();
      ctx.moveTo(12, 0);
      ctx.bezierCurveTo(10, -10, -8, -10, -14, -2);
      ctx.lineTo(-20, -6);
      ctx.lineTo(-20, 6);
      ctx.lineTo(-14, 2);
      ctx.bezierCurveTo(-8, 12, 8, 12, 12, 0);
      ctx.closePath();
      ctx.fillStyle = 'rgba(8, 20, 26, 0.82)';
      ctx.strokeStyle = 'rgba(45, 95, 110, 0.35)';
      ctx.lineWidth = 1;
      ctx.fill();
      ctx.stroke();

      // Illicium (lure spine) & Glowing Esca Bulb
      ctx.beginPath();
      ctx.moveTo(6, -8);
      ctx.quadraticCurveTo(16, -18, 18, -12);
      ctx.strokeStyle = 'rgba(90, 180, 195, 0.6)';
      ctx.lineWidth = 1;
      ctx.stroke();

      const lureGlow = 0.6 + 0.4 * Math.sin(this.elapsed * 3);
      ctx.beginPath();
      ctx.arc(18, -12, 2.2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(130, 255, 235, ${lureGlow})`;
      ctx.fill();
      ctx.restore();
    }

    // C. Ancient Deep-Sea Bluntnose Sixgill Shark (790m – 1,180m)
    const deepSharkBaseX = -50;
    const deepSharkX = this.wrapCoord(deepSharkBaseX, 165);
    const deepSharkSpeed = 3.6;
    const deepSharkCurrX = deepSharkX + (this.elapsed * deepSharkSpeed) % 165 - 82;
    const deepSharkDepth = 865 + Math.sin(this.elapsed * 0.16) * 15;
    const dssx = this.screenX(deepSharkCurrX);
    const dssy = this.screenY(deepSharkDepth);

    if (dssx > -90 && dssx < this.width + 90 && dssy > -50 && dssy < this.height + 50) {
      this.activeCreatures.push({
        screenX: dssx,
        screenY: dssy,
        name: 'BLUNTNOSE SIXGILL SHARK',
        category: 'Ambient scenery · Bathypelagic',
        radius: 42,
        distM: Math.hypot(deepSharkCurrX - this.vehicle.position.x, deepSharkDepth - this.depth),
      });

      ctx.save();
      ctx.translate(dssx, dssy);
      const tailWag = Math.sin(this.elapsed * 2.0) * 4;
      const bodyRoll = Math.sin(this.elapsed * 2.0) * 0.05;
      ctx.rotate(bodyRoll);

      ctx.beginPath();
      // Heavy rounded snout
      ctx.moveTo(38, 0);
      ctx.quadraticCurveTo(32, -8, 12, -9);
      // Smooth back with single dorsal fin far back
      ctx.quadraticCurveTo(-15, -8, -26, -6);
      ctx.lineTo(-28, -13);
      ctx.lineTo(-33, -6);
      // Peduncle & long upper caudal lobe
      ctx.lineTo(-44, tailWag * 0.5);
      ctx.lineTo(-60, -18 + tailWag);
      ctx.quadraticCurveTo(-54, tailWag, -48, tailWag * 0.5);
      ctx.lineTo(-54, 8 + tailWag);
      ctx.lineTo(-42, tailWag * 0.5);
      // Anal fin & belly
      ctx.lineTo(-30, 5);
      ctx.lineTo(-26, 9);
      ctx.lineTo(-22, 5);
      // Broad pectoral fin
      ctx.quadraticCurveTo(-5, 6, 8, 7);
      ctx.lineTo(2, 21);
      ctx.quadraticCurveTo(8, 17, 16, 6);
      // Lower jaw and blunt snout
      ctx.quadraticCurveTo(28, 5, 38, 0);
      ctx.closePath();
      ctx.fillStyle = 'rgba(8, 22, 28, 0.88)';
      ctx.strokeStyle = 'rgba(40, 85, 95, 0.4)';
      ctx.lineWidth = 1.2;
      ctx.fill();
      ctx.stroke();

      // Fluorescent green deep-sea eye tapetum
      ctx.beginPath();
      ctx.arc(26, -3, 2.3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(100, 255, 170, 0.65)';
      ctx.fill();

      // Six distinct gill slits silhouette
      ctx.strokeStyle = 'rgba(60, 120, 135, 0.4)';
      ctx.lineWidth = 1;
      for (let g = 0; g < 6; g++) {
        ctx.beginPath();
        ctx.moveTo(14 - g * 2.2, -3);
        ctx.lineTo(13 - g * 2.2, 4);
        ctx.stroke();
      }
      ctx.restore();
    }

    // D. Midwater Bathypelagic Gateway Mooring / Sensor Node (1,000m)
    const gateDepth = 1000;
    const gateSx = this.screenX(this.wrapCoord(0, 160));
    const gateSy = this.screenY(gateDepth);
    if (gateSx > -50 && gateSx < this.width + 50 && gateSy > -50 && gateSy < this.height + 50) {
      this.activeCreatures.push({
        screenX: gateSx,
        screenY: gateSy,
        name: 'BATHYPELAGIC GATEWAY · SENSOR NODE',
        category: 'Oceanographic Mooring · 1,000m',
        radius: 20,
        distM: Math.hypot(0 - this.vehicle.position.x, gateDepth - this.depth),
      });

      ctx.save();
      ctx.translate(gateSx, gateSy);
      // Floating titanium sensor package
      ctx.beginPath();
      ctx.arc(0, 0, 9, 0, Math.PI * 2);
      ctx.fillStyle = '#061a24';
      ctx.strokeStyle = '#a2eddd';
      ctx.lineWidth = 1.2;
      ctx.fill();
      ctx.stroke();

      // Flashing telemetry beacon
      const beaconGlow = 0.5 + 0.5 * Math.sin(this.elapsed * 4);
      ctx.beginPath();
      ctx.arc(0, -9, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(162, 237, 221, ${beaconGlow})`;
      ctx.fill();

      // Mooring tether cable
      ctx.beginPath();
      ctx.moveTo(0, 9);
      ctx.lineTo(0, 35);
      ctx.strokeStyle = 'rgba(162, 237, 221, 0.4)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    }

    // E. Barreleye Fish (Macropinna microstoma) (950m – 1,280m)
    const barreleyeBaseX = 60;
    const barreleyeX = this.wrapCoord(barreleyeBaseX, 130);
    const barreleyeDepth = 1100 + Math.sin(this.elapsed * 0.35) * 12;
    const bsx = this.screenX(barreleyeX);
    const bsy = this.screenY(barreleyeDepth);

    if (bsx > -40 && bsx < this.width + 40 && bsy > -40 && bsy < this.height + 40) {
      this.activeCreatures.push({
        screenX: bsx,
        screenY: bsy,
        name: 'BARRELEYE FISH',
        category: this.isDiscovered('barreleye-fish')
          ? 'Catalogued · MBARI Sourced Record'
          : 'Documented Species · Macropinna microstoma',
        isHero: true,
        radius: 22,
        distM: Math.hypot(barreleyeX - this.vehicle.position.x, barreleyeDepth - this.depth),
      });

      ctx.save();
      ctx.translate(bsx, bsy);
      // Dark body
      ctx.beginPath();
      ctx.moveTo(10, 2);
      ctx.quadraticCurveTo(0, -6, -18, -4);
      ctx.lineTo(-24, -9);
      ctx.lineTo(-24, 9);
      ctx.lineTo(-18, 4);
      ctx.quadraticCurveTo(0, 8, 10, 6);
      ctx.closePath();
      ctx.fillStyle = 'rgba(10, 26, 34, 0.9)';
      ctx.strokeStyle = 'rgba(50, 110, 125, 0.4)';
      ctx.lineWidth = 1;
      ctx.fill();
      ctx.stroke();

      // Transparent fluid-filled cranial dome
      ctx.beginPath();
      ctx.arc(8, -2, 9, Math.PI, 0);
      ctx.closePath();
      ctx.fillStyle = 'rgba(140, 235, 220, 0.22)';
      ctx.strokeStyle = 'rgba(180, 255, 240, 0.45)';
      ctx.lineWidth = 1;
      ctx.fill();
      ctx.stroke();

      // Tubular emerald-green upward-pointing eyes
      for (const eyeOffset of [-2, 4]) {
        ctx.beginPath();
        ctx.ellipse(8 + eyeOffset, -4, 2.2, 3.5, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(40, 255, 140, 0.85)';
        ctx.fill();
      }
      ctx.restore();
    }

    // F. Black Swallower (Chiasmodon niger) (1,300m – 1,650m)
    const swallowerBaseX = -90;
    const swallowerX = this.wrapCoord(swallowerBaseX, 150);
    const swallowerSpeed = 1.8;
    const swallowerCurrX = swallowerX + (this.elapsed * swallowerSpeed) % 150 - 75;
    const swallowerDepth = 1420 + Math.sin(this.elapsed * 0.28) * 14;
    const swx = this.screenX(swallowerCurrX);
    const swy = this.screenY(swallowerDepth);

    if (swx > -80 && swx < this.width + 80 && swy > -50 && swy < this.height + 50) {
      this.activeCreatures.push({
        screenX: swx,
        screenY: swy,
        name: 'BLACK SWALLOWER',
        category: 'Ambient scenery · Bathypelagic',
        radius: 26,
        distM: Math.hypot(swallowerCurrX - this.vehicle.position.x, swallowerDepth - this.depth),
      });

      ctx.save();
      ctx.translate(swx, swy);
      // Elongated body
      ctx.beginPath();
      ctx.moveTo(14, 0);
      ctx.lineTo(4, -5);
      ctx.lineTo(-14, -4);
      ctx.lineTo(-24, 0);
      ctx.lineTo(-14, 3);
      ctx.lineTo(4, 4);
      ctx.closePath();
      ctx.fillStyle = 'rgba(10, 14, 20, 0.92)';
      ctx.strokeStyle = 'rgba(50, 75, 90, 0.4)';
      ctx.lineWidth = 1;
      ctx.fill();
      ctx.stroke();

      // Distended expandable belly pouch
      ctx.beginPath();
      ctx.moveTo(8, 3);
      ctx.quadraticCurveTo(-4, 18, -14, 3);
      ctx.closePath();
      ctx.fillStyle = 'rgba(16, 24, 34, 0.85)';
      ctx.strokeStyle = 'rgba(70, 110, 125, 0.45)';
      ctx.lineWidth = 1;
      ctx.fill();
      ctx.stroke();

      // Sharp dentition
      ctx.beginPath();
      ctx.moveTo(14, 0); ctx.lineTo(11, -3);
      ctx.moveTo(11, 0); ctx.lineTo(8, -3);
      ctx.strokeStyle = 'rgba(180, 235, 245, 0.7)';
      ctx.lineWidth = 0.8;
      ctx.stroke();

      ctx.restore();
    }

    // G. Solitary Giant Squid Silhouette (1,300m – 1,750m)
    const giantSquidBaseX = 120;
    const giantSquidX = this.wrapCoord(giantSquidBaseX, 200);
    const giantSquidSpeed = 3.4;
    const giantSquidCurrX = giantSquidX + (this.elapsed * giantSquidSpeed) % 200 - 100;
    const giantSquidDepth = 1520 + Math.sin(this.elapsed * 0.18) * 18;
    const gsqX = this.screenX(giantSquidCurrX);
    const gsqY = this.screenY(giantSquidDepth);

    if (gsqX > -120 && gsqX < this.width + 120 && gsqY > -60 && gsqY < this.height + 60) {
      this.activeCreatures.push({
        screenX: gsqX,
        screenY: gsqY,
        name: 'GIANT SQUID',
        category: 'Ambient scenery · Bathypelagic',
        radius: 50,
        distM: Math.hypot(giantSquidCurrX - this.vehicle.position.x, giantSquidDepth - this.depth),
      });

      ctx.save();
      ctx.translate(gsqX, gsqY);
      const jetWave = Math.sin(this.elapsed * 1.4) * 0.06;
      ctx.rotate(jetWave);

      // Massive muscular torpedo mantle
      ctx.beginPath();
      ctx.moveTo(-58, 0);
      ctx.lineTo(-44, -14);
      ctx.lineTo(-24, -8);
      ctx.quadraticCurveTo(0, -9, 14, -8);
      ctx.lineTo(14, 8);
      ctx.quadraticCurveTo(0, 9, -24, 8);
      ctx.lineTo(-44, 14);
      ctx.closePath();
      ctx.fillStyle = 'rgba(24, 14, 20, 0.88)';
      ctx.strokeStyle = 'rgba(110, 65, 80, 0.4)';
      ctx.lineWidth = 1.2;
      ctx.fill();
      ctx.stroke();

      // Huge dinner-plate eye
      ctx.beginPath();
      ctx.arc(8, -1, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(180, 240, 255, 0.7)';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(8, -1, 2.2, 0, Math.PI * 2);
      ctx.fillStyle = '#020b12';
      ctx.fill();

      // 8 Arms cluster
      for (let arm = -3; arm <= 3; arm++) {
        ctx.beginPath();
        ctx.moveTo(14, arm * 2);
        ctx.quadraticCurveTo(34, arm * 4 + Math.sin(this.elapsed * 2 + arm) * 4, 48, arm * 3);
        ctx.strokeStyle = 'rgba(45, 24, 34, 0.85)';
        ctx.lineWidth = 1.6;
        ctx.stroke();
      }

      // 2 Long feeding tentacles extending forward
      for (const tentSide of [-1, 1]) {
        ctx.beginPath();
        ctx.moveTo(14, tentSide * 1.5);
        const tWave = Math.sin(this.elapsed * 1.8 + tentSide) * 6;
        ctx.bezierCurveTo(45, tentSide * 4 + tWave, 70, tentSide * 6 - tWave, 92, tentSide * 4);
        ctx.strokeStyle = 'rgba(75, 38, 52, 0.75)';
        ctx.lineWidth = 1.2;
        ctx.stroke();
        // Tentacle club
        ctx.beginPath();
        ctx.ellipse(92, tentSide * 4, 6, 2.5, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(95, 45, 65, 0.85)';
        ctx.fill();
      }
      ctx.restore();
    }

    // H. Deep-Sea Dragonfish (Stomiidae) (1,500m – 1,880m)
    const dragonBaseX = -30;
    const dragonX = this.wrapCoord(dragonBaseX, 120);
    const dragonDepth = 1680 + Math.sin(this.elapsed * 0.4) * 14;
    const drgSx = this.screenX(dragonX);
    const drgSy = this.screenY(dragonDepth);

    if (drgSx > -40 && drgSx < this.width + 40 && drgSy > -40 && drgSy < this.height + 40) {
      this.activeCreatures.push({
        screenX: drgSx,
        screenY: drgSy,
        name: 'DEEP-SEA DRAGONFISH',
        category: 'Ambient scenery · Bathypelagic',
        radius: 24,
        distM: Math.hypot(dragonX - this.vehicle.position.x, dragonDepth - this.depth),
      });

      ctx.save();
      ctx.translate(drgSx, drgSy);
      const tailSway = Math.sin(this.elapsed * 3.2) * 3;

      // Slender black body
      ctx.beginPath();
      ctx.moveTo(16, 0);
      ctx.lineTo(8, -4);
      ctx.lineTo(-18, -2);
      ctx.lineTo(-28, tailSway);
      ctx.lineTo(-18, 2);
      ctx.lineTo(8, 4);
      ctx.closePath();
      ctx.fillStyle = 'rgba(6, 12, 16, 0.95)';
      ctx.strokeStyle = 'rgba(55, 80, 95, 0.4)';
      ctx.lineWidth = 1;
      ctx.fill();
      ctx.stroke();

      // Fang teeth protruding from jaw
      ctx.strokeStyle = 'rgba(210, 245, 255, 0.85)';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(14, -3); ctx.lineTo(13, 2);
      ctx.moveTo(11, -3); ctx.lineTo(10, 2);
      ctx.moveTo(8, -3); ctx.lineTo(7, 2);
      ctx.stroke();

      // Chin barbel with glowing photophore lure
      const barbelGlow = 0.6 + 0.4 * Math.sin(this.elapsed * 4.5);
      ctx.beginPath();
      ctx.moveTo(10, 3);
      ctx.quadraticCurveTo(14, 12, 18, 16);
      ctx.strokeStyle = 'rgba(80, 160, 180, 0.5)';
      ctx.lineWidth = 0.9;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(18, 16, 1.8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(120, 255, 230, ${barbelGlow})`;
      ctx.fill();

      // Ventral rows of glowing blue photophores
      for (let p = -8; p <= 6; p += 2.2) {
        ctx.beginPath();
        ctx.arc(p, 2.8, 0.6, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(100, 220, 255, 0.7)';
        ctx.fill();
      }
      ctx.restore();
    }

    // I. Benthic Tripod Fish (Bathypterois grallator) standing on seafloor (1,960m – 2,040m and 3,960m – 4,000m)
    if ((this.depth > 1940 && this.depth < 2050) || this.depth > 3940) {
      const targetBedDepth = this.depth < 2500 ? 2000 : 4000;
      for (let t = -1; t <= 1; t++) {
        const tx = this.wrapCoord(t * 45 + 18, 90);
        const tsx = this.screenX(tx);
        const floorY = this.screenY(targetBedDepth) - 14;
        if (tsx < -25 || tsx > this.width + 25 || floorY < -20 || floorY > this.height + 30) continue;

        this.activeCreatures.push({
          screenX: tsx,
          screenY: floorY - 14,
          name: 'BENTHIC TRIPOD FISH',
          category: this.isDiscovered('tripod-fish')
            ? 'Catalogued · Smithsonian Sourced Record'
            : 'Documented Species · Bathypterois grallator',
          isHero: true,
          radius: 18,
          distM: Math.hypot(tx - this.vehicle.position.x, targetBedDepth - 5 - this.depth),
        });

        ctx.save();
        ctx.translate(tsx, floorY);
        // Slender body perched above floor
        ctx.beginPath();
        ctx.ellipse(0, -14, 11, 3.5, 0.1, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(14, 38, 46, 0.85)';
        ctx.strokeStyle = 'rgba(80, 160, 175, 0.4)';
        ctx.lineWidth = 1;
        ctx.fill();
        ctx.stroke();

        // Stilt pelvic fins touching the seabed
        ctx.beginPath();
        ctx.moveTo(-4, -12); ctx.lineTo(-11, 0);
        ctx.moveTo(3, -12); ctx.lineTo(10, 0);
        ctx.moveTo(-10, -12); ctx.lineTo(-15, 0);
        ctx.strokeStyle = 'rgba(105, 195, 210, 0.5)';
        ctx.lineWidth = 1.1;
        ctx.stroke();
        ctx.restore();
      }
    }

    // J. Deep-Sea Glass Squid (Taonius borealis / Cranchiidae) (4,300m – 5,100m)
    if (this.depth > 4200 && this.depth < 5200) {
      const gsqBaseX = -70;
      const gsqX = this.wrapCoord(gsqBaseX, 160);
      const gsqSpeed = 2.0;
      const gsqCurrX = gsqX + (this.elapsed * gsqSpeed) % 160 - 80;
      const gsqDepth = 4750 + Math.sin(this.elapsed * 0.35) * 18;
      const gsx = this.screenX(gsqCurrX);
      const gsy = this.screenY(gsqDepth);

      if (gsx > -60 && gsx < this.width + 60 && gsy > -40 && gsy < this.height + 40) {
        this.activeCreatures.push({
          screenX: gsx,
          screenY: gsy,
          name: 'DEEP-SEA GLASS SQUID',
          category: 'Ambient scenery · Abyssopelagic',
          radius: 28,
          distM: Math.hypot(gsqCurrX - this.vehicle.position.x, gsqDepth - this.depth),
        });

        ctx.save();
        ctx.translate(gsx, gsy);
        // Transparent crystal mantle
        ctx.beginPath();
        ctx.moveTo(22, 0);
        ctx.quadraticCurveTo(0, -12, -26, -5);
        ctx.lineTo(-34, 0);
        ctx.lineTo(-26, 5);
        ctx.quadraticCurveTo(0, 12, 22, 0);
        ctx.closePath();
        ctx.fillStyle = 'rgba(195, 245, 255, 0.12)';
        ctx.strokeStyle = 'rgba(160, 235, 245, 0.45)';
        ctx.lineWidth = 1;
        ctx.fill();
        ctx.stroke();

        // Opaque cigar-shaped digestive gland (held vertically)
        ctx.beginPath();
        ctx.ellipse(2, 0, 3, 9, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(215, 140, 50, 0.85)';
        ctx.fill();

        // Iridescent eye photophores
        for (const ey of [-4, 4]) {
          ctx.beginPath();
          ctx.arc(16, ey, 2.8, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 240, 140, 0.85)';
          ctx.fill();
        }
        ctx.restore();
      }
    }

    // K. Giant Xenophyophore Protozoan Aggregates on sediment (4,600m – 5,800m)
    if (this.depth > 4500 && this.depth < 5850) {
      for (let s = -1; s <= 1; s++) {
        const xenoWorldX = this.wrapCoord(s * 50 + 12, 110);
        const xsx = this.screenX(xenoWorldX);
        const floorY = this.screenY(5200);
        if (xsx < -30 || xsx > this.width + 30 || floorY < -20 || floorY > this.height + 30) continue;

        ctx.save();
        ctx.translate(xsx, floorY);
        // Frilly agglutinated sediment sphere structure
        ctx.beginPath();
        ctx.arc(0, -8, 8, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(18, 32, 40, 0.9)';
        ctx.strokeStyle = 'rgba(110, 170, 185, 0.35)';
        ctx.lineWidth = 1;
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }
    }
  }

  /**
   * Hero Creature: Vampire Squid (Vampyroteuthis infernalis)
   * Authored with 5 independently moving 2D anatomical components per CREATURE_ASSETS.md:
   * 1. Body & mantle drift / tilt
   * 2. Rhythmic respiration web pulse
   * 3. Paired apical ear-like fin flaps
   * 4. Bioluminescent arm-tip photophore pulsing
   * 5. Gossamer trailing sensory filaments
   */
  private drawSquid() {
    const ctx = this.ctx;
    const target = this.squidPosition();
    const x = this.screenX(target.x);
    const y = this.screenY(target.depth);
    if (x < -100 || x > this.width + 100 || y < -120 || y > this.height + 120) return;

    this.activeCreatures.push({
      screenX: x,
      screenY: y,
      name: 'VAMPIRE SQUID',
      category: this.discovered ? 'Catalogued · MBARI Sourced Record' : 'Documented Species · Vampyroteuthis infernalis',
      isHero: true,
      radius: 40 * this.zoom,
      distM: Math.hypot(target.x - this.vehicle.position.x, target.depth - this.depth),
    });

    // Ambient bioluminescent twilight haze
    const aura = ctx.createRadialGradient(x, y, 6, x, y, 90 * this.zoom);
    aura.addColorStop(0, 'rgba(45,145,170,0.18)');
    aura.addColorStop(0.5, 'rgba(25,90,115,0.06)');
    aura.addColorStop(1, 'rgba(15,40,65,0)');
    ctx.fillStyle = aura;
    ctx.fillRect(x - 90 * this.zoom, y - 90 * this.zoom, 180 * this.zoom, 180 * this.zoom);

    ctx.save();
    ctx.translate(x, y);

    // Dynamic motion factors
    const tilt = Math.sin(this.elapsed * 0.45) * 0.08;
    const pulse = (1 + Math.sin(this.elapsed * 1.1) * 0.045) * this.zoom; // Respiration & camera zoom
    const finFlap = Math.sin(this.elapsed * 2.8); // Independent fin flap
    const glowIntensity = 0.5 + 0.5 * Math.sin(this.elapsed * 2.1); // Arm-tip photophore pulse

    ctx.rotate(tilt);
    ctx.scale(pulse, pulse);

    // 1. Gossamer retractile sensory filaments (unique to vampyromorphs)
    for (const side of [-1, 1]) {
      ctx.beginPath();
      const fx = side * 14;
      const fy = 10;
      ctx.moveTo(fx, fy);
      const cp1x = fx + side * 22 + Math.sin(this.elapsed * 0.6 + side) * 12;
      const cp1y = fy + 38;
      const cp2x = fx + side * 44 + Math.cos(this.elapsed * 0.5 - side) * 16;
      const cp2y = fy + 75;
      const endX = fx + side * 62 + Math.sin(this.elapsed * 0.7) * 20;
      const endY = fy + 115;
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY);
      ctx.strokeStyle = 'rgba(195,245,255,0.32)';
      ctx.lineWidth = 0.9;
      ctx.stroke();

      // Tiny sensory nodes on filaments
      ctx.beginPath();
      ctx.arc(endX, endY, 1.4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(175,245,255,0.65)';
      ctx.fill();
    }

    // 2. Interbrachial Web (the "Cloak" membrane between arms)
    ctx.beginPath();
    ctx.moveTo(-11, -12);
    ctx.bezierCurveTo(-26, -2, -38, 25, -31, 48);
    ctx.quadraticCurveTo(-22, 38, -16, 54);
    ctx.quadraticCurveTo(-9, 41, 0, 56);
    ctx.quadraticCurveTo(9, 41, 16, 54);
    ctx.quadraticCurveTo(22, 38, 31, 48);
    ctx.bezierCurveTo(38, 25, 26, -2, 11, -12);
    ctx.closePath();
    const cloakGrad = ctx.createLinearGradient(0, -12, 0, 56);
    cloakGrad.addColorStop(0, '#381627');
    cloakGrad.addColorStop(0.5, '#4e2034');
    cloakGrad.addColorStop(1, '#250d18');
    ctx.fillStyle = cloakGrad;
    ctx.strokeStyle = 'rgba(196,102,142,0.52)';
    ctx.lineWidth = 1.3;
    ctx.fill();
    ctx.stroke();

    // 3. 8 Webbed Arms with Cirri and Bioluminescent Arm-Tip Photophores
    const armPositions = [-3, -2, -1, -0.3, 0.3, 1, 2, 3];
    for (let a = 0; a < armPositions.length; a++) {
      const pos = armPositions[a];
      const armSway = Math.sin(this.elapsed * 1.5 + pos * 0.9) * 4;
      const startX = pos * 4.2;
      const startY = -4;
      const tipX = pos * 8.5 + armSway;
      const tipY = 50 + Math.abs(pos) * 2;

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.quadraticCurveTo(pos * 6.5, 26, tipX, tipY);
      ctx.strokeStyle = 'rgba(215,115,160,0.55)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Cirri (fine sensory fingerlets along arms)
      for (let c = 1; c <= 3; c++) {
        const cy = 10 + c * 10;
        const cx = startX + (tipX - startX) * (cy / tipY);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.sign(pos || 1) * 2.5, cy + 2);
        ctx.strokeStyle = 'rgba(180,95,130,0.4)';
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // Bioluminescent arm-tip photophore
      const photophoreGlow = ctx.createRadialGradient(tipX, tipY, 0.5, tipX, tipY, 6);
      photophoreGlow.addColorStop(0, `rgba(130,245,255,${0.85 * glowIntensity})`);
      photophoreGlow.addColorStop(0.4, `rgba(50,210,235,${0.5 * glowIntensity})`);
      photophoreGlow.addColorStop(1, 'rgba(30,170,200,0)');
      ctx.fillStyle = photophoreGlow;
      ctx.fillRect(tipX - 6, tipY - 6, 12, 12);

      ctx.beginPath();
      ctx.arc(tipX, tipY, 1.8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(180,250,255,${0.9 * glowIntensity})`;
      ctx.fill();
    }

    // 4. Velvet Mantle (Apical Body)
    ctx.beginPath();
    ctx.moveTo(-15, -8);
    ctx.bezierCurveTo(-16, -26, -9, -46, 0, -48);
    ctx.bezierCurveTo(9, -46, 16, -26, 15, -8);
    ctx.quadraticCurveTo(0, 8, -15, -8);
    ctx.closePath();
    const mantleGrad = ctx.createLinearGradient(0, -48, 0, 8);
    mantleGrad.addColorStop(0, '#5a2238');
    mantleGrad.addColorStop(0.5, '#722b49');
    mantleGrad.addColorStop(1, '#3b1625');
    ctx.fillStyle = mantleGrad;
    ctx.fill();
    ctx.strokeStyle = 'rgba(215,115,160,0.45)';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Mantle photophore organs near fin bases
    for (const side of [-1, 1]) {
      ctx.beginPath();
      ctx.arc(side * 8, -32, 2.2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(110,230,250,${0.65 * glowIntensity})`;
      ctx.fill();
    }

    // 5. Paired Apical Ear-Like Fins (Winged Swimming Paddles)
    for (const side of [-1, 1]) {
      ctx.save();
      ctx.translate(side * 14, -28);
      // Independent flapping rotation
      ctx.rotate(side * (0.35 + finFlap * 0.22));

      ctx.beginPath();
      ctx.ellipse(0, 0, 14, 6.5, side * 0.2, 0, Math.PI * 2);
      const finGrad = ctx.createLinearGradient(0, -7, 0, 7);
      finGrad.addColorStop(0, '#8d3b5d');
      finGrad.addColorStop(1, '#561f36');
      ctx.fillStyle = finGrad;
      ctx.strokeStyle = 'rgba(228,135,178,0.5)';
      ctx.lineWidth = 1;
      ctx.fill();
      ctx.stroke();

      // Delicate fin ray striations
      for (let r = -2; r <= 2; r++) {
        ctx.beginPath();
        ctx.moveTo(r * 2.5, -4);
        ctx.lineTo(r * 3.5, 4);
        ctx.strokeStyle = 'rgba(220,130,170,0.3)';
        ctx.lineWidth = 0.7;
        ctx.stroke();
      }
      ctx.restore();
    }

    // 6. Iconic Deep-Sea Lucid Reflective Eyes
    for (const side of [-1, 1]) {
      const eyeX = side * 8;
      const eyeY = -12;

      // Eye socket rim
      ctx.beginPath();
      ctx.arc(eyeX, eyeY, 4.8, 0, Math.PI * 2);
      ctx.fillStyle = '#2a101d';
      ctx.fill();

      // Clear reflective sapphire / opal lens
      const lens = ctx.createRadialGradient(eyeX - 1, eyeY - 1, 0.5, eyeX, eyeY, 4.2);
      lens.addColorStop(0, '#a5f0ec');
      lens.addColorStop(0.4, '#48b8c2');
      lens.addColorStop(0.85, '#1e5f6e');
      lens.addColorStop(1, '#0e2b34');
      ctx.beginPath();
      ctx.arc(eyeX, eyeY, 4, 0, Math.PI * 2);
      ctx.fillStyle = lens;
      ctx.fill();

      // Pupil
      ctx.beginPath();
      ctx.arc(eyeX + side * 0.5, eyeY, 1.7, 0, Math.PI * 2);
      ctx.fillStyle = '#061318';
      ctx.fill();

      // Specular highlight gloss
      ctx.beginPath();
      ctx.arc(eyeX - 1.2, eyeY - 1.2, 0.9, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    }

    ctx.restore();
  }

  /**
   * Hero Creature: Gulper Eel (Eurypharynx pelecanoides)
   * Authored with 4 dynamic components:
   * 1. Cavernous expandable pouch mouth & elastic throat lining
   * 2. Loosely hinged upper & lower mandibles
   * 3. Sinusoidal undulating slender whip tail
   * 4. Bioluminescent caudal lure photophore flashing in the midnight abyss
   */
  private drawGulperEel() {
    const ctx = this.ctx;
    const target = this.gulperEelPosition();
    const x = this.screenX(target.x);
    const y = this.screenY(target.depth);
    if (x < -140 || x > this.width + 140 || y < -120 || y > this.height + 120) return;

    this.activeCreatures.push({
      screenX: x,
      screenY: y,
      name: 'GULPER EEL',
      category: this.isDiscovered('gulper-eel')
        ? 'Catalogued · MBARI Sourced Record'
        : 'Documented Species · Eurypharynx pelecanoides',
      isHero: true,
      radius: 40 * this.zoom,
      distM: Math.hypot(target.x - this.vehicle.position.x, target.depth - this.depth),
    });

    // Bioluminescent ethereal aura
    const aura = ctx.createRadialGradient(x, y, 4, x, y, 85 * this.zoom);
    aura.addColorStop(0, 'rgba(255, 75, 135, 0.16)');
    aura.addColorStop(0.5, 'rgba(120, 40, 90, 0.05)');
    aura.addColorStop(1, 'rgba(10, 5, 20, 0)');
    ctx.fillStyle = aura;
    ctx.fillRect(x - 85 * this.zoom, y - 85 * this.zoom, 170 * this.zoom, 170 * this.zoom);

    ctx.save();
    ctx.translate(x, y);
    ctx.scale(this.zoom, this.zoom);

    const facing = Math.sin(this.elapsed * 0.12) >= 0 ? 1 : -1;
    ctx.scale(facing, 1);

    const jawExpansion = 1 + Math.sin(this.elapsed * 1.3) * 0.09;
    const wave = Math.sin(this.elapsed * 2.4);

    // 1. Expandable pouch throat membrane
    ctx.beginPath();
    ctx.moveTo(35, -4);
    ctx.bezierCurveTo(15, -12 * jawExpansion, -15, -8 * jawExpansion, -32, 4);
    ctx.bezierCurveTo(-15, 28 * jawExpansion, 15, 34 * jawExpansion, 35, 8);
    ctx.closePath();
    const pouchGrad = ctx.createLinearGradient(0, -10, 0, 32);
    pouchGrad.addColorStop(0, 'rgba(16, 26, 36, 0.88)');
    pouchGrad.addColorStop(0.6, 'rgba(25, 45, 60, 0.7)');
    pouchGrad.addColorStop(1, 'rgba(8, 16, 24, 0.95)');
    ctx.fillStyle = pouchGrad;
    ctx.strokeStyle = 'rgba(110, 220, 230, 0.55)';
    ctx.lineWidth = 1.3;
    ctx.fill();
    ctx.stroke();

    // 2. Upper and lower articulated jawbone struts
    ctx.beginPath();
    ctx.moveTo(35, -4);
    ctx.quadraticCurveTo(10, -14 * jawExpansion, -32, 4);
    ctx.strokeStyle = 'rgba(165, 245, 240, 0.85)';
    ctx.lineWidth = 1.6;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-32, 4);
    ctx.quadraticCurveTo(12, 36 * jawExpansion, 35, 8);
    ctx.strokeStyle = 'rgba(165, 245, 240, 0.85)';
    ctx.lineWidth = 1.6;
    ctx.stroke();

    // 3. Minute cephalic eye perched high on tip of snout
    ctx.beginPath();
    ctx.arc(33, -5, 1.8, 0, Math.PI * 2);
    ctx.fillStyle = '#65f0ff';
    ctx.fill();

    // 4. Undulating sinusoidal whip tail
    ctx.beginPath();
    ctx.moveTo(-32, 4);
    const cp1x = -55;
    const cp1y = 4 + wave * 9;
    const cp2x = -85;
    const cp2y = 4 - wave * 14;
    const tipX = -120;
    const tipY = 4 + wave * 18;
    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, tipX, tipY);
    ctx.strokeStyle = 'rgba(18, 38, 52, 0.95)';
    ctx.lineWidth = 3.6;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-32, 4);
    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, tipX, tipY);
    ctx.strokeStyle = 'rgba(120, 215, 225, 0.45)';
    ctx.lineWidth = 1.1;
    ctx.stroke();

    // 5. Bioluminescent caudal lure organ (flashing pink/magenta photophore)
    const lureGlow = 0.5 + 0.5 * Math.sin(this.elapsed * 4.5);
    const lureRad = ctx.createRadialGradient(tipX, tipY, 0.5, tipX, tipY, 10);
    lureRad.addColorStop(0, `rgba(255, 90, 160, ${0.95 * lureGlow})`);
    lureRad.addColorStop(0.4, `rgba(255, 60, 130, ${0.5 * lureGlow})`);
    lureRad.addColorStop(1, 'rgba(255, 40, 110, 0)');
    ctx.fillStyle = lureRad;
    ctx.fillRect(tipX - 10, tipY - 10, 20, 20);

    ctx.beginPath();
    ctx.arc(tipX, tipY, 2.4, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 140, 195, ${lureGlow})`;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(tipX, tipY, 1.0, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    ctx.restore();
  }

  /**
   * Hero Creature: Abyssal Sea Pig (Scotoplanes globosa)
   * Authored with 4 dynamic components:
   * 1. Plump, water-filled translucent pink body with visible internal digestive canal
   * 2. 4 pairs of hydraulic tube-feet marching across soft sediment
   * 3. Paired dorsal sensory papillae ("ears") swaying with benthic currents
   * 4. Anterior oral feeding tentacles probing abyssal detritus
   */
  private drawSeaPig() {
    const ctx = this.ctx;
    const target = this.seaPigPosition();
    const x = this.screenX(target.x);
    const y = this.screenY(target.depth);
    if (x < -110 || x > this.width + 110 || y < -110 || y > this.height + 110) return;

    this.activeCreatures.push({
      screenX: x,
      screenY: y,
      name: 'ABYSSAL SEA PIG',
      category: this.isDiscovered('sea-pig')
        ? 'Catalogued · MBARI Sourced Record'
        : 'Documented Species · Scotoplanes globosa',
      isHero: true,
      radius: 32 * this.zoom,
      distM: Math.hypot(target.x - this.vehicle.position.x, target.depth - this.depth),
    });

    // Ambient soft pink luminescence
    const aura = ctx.createRadialGradient(x, y, 2, x, y, 68 * this.zoom);
    aura.addColorStop(0, 'rgba(255, 170, 205, 0.16)');
    aura.addColorStop(0.5, 'rgba(200, 110, 150, 0.05)');
    aura.addColorStop(1, 'rgba(10, 5, 20, 0)');
    ctx.fillStyle = aura;
    ctx.fillRect(x - 68 * this.zoom, y - 68 * this.zoom, 136 * this.zoom, 136 * this.zoom);

    ctx.save();
    ctx.translate(x, y);
    ctx.scale(this.zoom, this.zoom);

    const facing = Math.sin(this.elapsed * 0.08) >= 0 ? 1 : -1;
    ctx.scale(facing, 1);

    const bodyBob = Math.sin(this.elapsed * 2.8) * 1.5;

    // 1. Dorsal sensory papillae antennae ("ears")
    for (const ear of [-1, 1]) {
      const earWave = Math.sin(this.elapsed * 1.6 + ear) * 3;
      ctx.beginPath();
      ctx.moveTo(ear * 10, -18 + bodyBob);
      ctx.quadraticCurveTo(ear * 16 + earWave, -34, ear * 20 + earWave * 1.5, -42);
      ctx.strokeStyle = 'rgba(255, 205, 225, 0.85)';
      ctx.lineWidth = 2.2;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(ear * 20 + earWave * 1.5, -42, 2.2, 0, Math.PI * 2);
      ctx.fillStyle = '#ffe0ec';
      ctx.fill();
    }

    // 2. Hydraulic tube-feet (4 pairs walking)
    const legPositions = [-24, -8, 8, 24];
    for (let i = 0; i < legPositions.length; i++) {
      const lx = legPositions[i];
      const stepPhase = this.elapsed * 3.2 + i * 1.2;
      const legLift = Math.max(0, Math.sin(stepPhase)) * 5;
      const legStride = Math.cos(stepPhase) * 6;

      ctx.beginPath();
      ctx.moveTo(lx, 10 + bodyBob);
      ctx.lineTo(lx + legStride, 22 - legLift);
      ctx.strokeStyle = 'rgba(240, 150, 185, 0.9)';
      ctx.lineWidth = 3.2;
      ctx.lineCap = 'round';
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(lx + legStride, 22 - legLift, 2.4, 0, Math.PI * 2);
      ctx.fillStyle = '#d6688f';
      ctx.fill();
    }

    // 3. Gelatinous translucent pink body
    ctx.beginPath();
    ctx.ellipse(0, bodyBob, 34, 18, 0, 0, Math.PI * 2);
    const bodyGrad = ctx.createLinearGradient(0, -18 + bodyBob, 0, 18 + bodyBob);
    bodyGrad.addColorStop(0, 'rgba(255, 215, 230, 0.88)');
    bodyGrad.addColorStop(0.5, 'rgba(245, 175, 200, 0.75)');
    bodyGrad.addColorStop(1, 'rgba(215, 130, 165, 0.85)');
    ctx.fillStyle = bodyGrad;
    ctx.strokeStyle = 'rgba(255, 230, 240, 0.95)';
    ctx.lineWidth = 1.4;
    ctx.fill();
    ctx.stroke();

    // Internal fluid digestive tract silhouette
    ctx.beginPath();
    ctx.moveTo(-22, bodyBob + 2);
    ctx.quadraticCurveTo(0, bodyBob + 8, 22, bodyBob);
    ctx.strokeStyle = 'rgba(165, 75, 110, 0.45)';
    ctx.lineWidth = 5;
    ctx.stroke();

    // 4. Anterior oral detritus feeding tentacles
    const mouthX = 32;
    const mouthY = 4 + bodyBob;
    for (let t = -2; t <= 2; t++) {
      const tentWave = Math.sin(this.elapsed * 4.0 + t) * 2;
      ctx.beginPath();
      ctx.moveTo(mouthX, mouthY);
      ctx.lineTo(mouthX + 8, mouthY + t * 3 + tentWave);
      ctx.strokeStyle = 'rgba(255, 215, 230, 0.9)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(mouthX + 8, mouthY + t * 3 + tentWave, 1.4, 0, Math.PI * 2);
      ctx.fillStyle = '#ffd6e7';
      ctx.fill();
    }

    ctx.restore();
  }

  private drawLightBeam(darkness: number) {
    if (!this.lightsOn || this.depth < 2) return;
    const ctx = this.ctx;
    const x = this.focusX + this.facing * 55 * this.zoom;
    const y = this.focusY + 4 * this.zoom;
    const reach = (180 + darkness * 75) * this.zoom;

    const beam = ctx.createLinearGradient(x, y, x + this.facing * reach, y);
    beam.addColorStop(0, `rgba(175,245,235,${0.14 + darkness * 0.22})`);
    beam.addColorStop(0.65, `rgba(145,230,220,${0.05 + darkness * 0.08})`);
    beam.addColorStop(1, 'rgba(145,230,220,0)');

    ctx.beginPath();
    ctx.moveTo(x, y - 8 * this.zoom);
    ctx.lineTo(x + this.facing * reach, y - 72 * this.zoom);
    ctx.lineTo(x + this.facing * reach, y + 82 * this.zoom);
    ctx.lineTo(x, y + 10 * this.zoom);
    ctx.closePath();
    ctx.fillStyle = beam;
    ctx.fill();

    // Secondary soft ambient flood halo at the submarine nose
    const halo = ctx.createRadialGradient(x, y, 2, x + this.facing * 20 * this.zoom, y, 65 * this.zoom);
    halo.addColorStop(0, `rgba(215,255,250,${0.25 + darkness * 0.2})`);
    halo.addColorStop(1, 'rgba(165,240,230,0)');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(x + this.facing * 20 * this.zoom, y, 65 * this.zoom, 0, Math.PI * 2);
    ctx.fill();
  }

  private drawBubbles() {
    if (this.bubbles.length === 0) return;
    const ctx = this.ctx;
    for (const b of this.bubbles) {
      const bx = this.screenX(b.x);
      const by = this.screenY(b.y);
      if (bx < -10 || bx > this.width + 10 || by < -10 || by > this.height + 10) continue;
      const alpha = (1 - b.life / b.maxLife) * 0.45;
      ctx.beginPath();
      ctx.arc(bx, by, b.radius * this.zoom, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(180,245,240,${alpha})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();
      ctx.fillStyle = `rgba(215,255,250,${alpha * 0.4})`;
      ctx.fill();
    }
  }

  /**
   * Research Submersible DSV-1
   * High-detail 2D side cross-section with titanium observation dome,
   * cockpit instrumentation glow, pilot silhouette, articulated manipulator,
   * thruster nacelles with cavitation, and depth rating stencils.
   */
  private drawSubmersible() {
    const ctx = this.ctx;
    const x = this.focusX;
    const bobbing = Math.sin(this.elapsed * 1.3) * 2.2;
    const y = this.focusY + bobbing;
    const scaleFactor = (this.width < 760 ? 0.85 : 1) * this.zoom;

    ctx.save();
    ctx.translate(x, y);
    ctx.scale(this.facing * scaleFactor, scaleFactor);

    // 1. Heavy-duty titanium landing skids & ballast sled
    ctx.fillStyle = '#21333a';
    ctx.fillRect(-34, 25, 68, 4);
    ctx.fillRect(-28, 29, 56, 3);
    // Skid vertical struts
    ctx.fillRect(-24, 18, 4, 8);
    ctx.fillRect(18, 18, 4, 8);

    // 2. Main Composite Pressure Hull
    const body = ctx.createLinearGradient(0, -26, 0, 26);
    body.addColorStop(0, '#bed4d0');
    body.addColorStop(0.3, '#78959c');
    body.addColorStop(0.75, '#3b555e');
    body.addColorStop(1, '#1b2c32');

    ctx.beginPath();
    ctx.moveTo(-54, -13);
    ctx.bezierCurveTo(-28, -32, 26, -30, 52, -10);
    ctx.quadraticCurveTo(64, 0, 51, 15);
    ctx.bezierCurveTo(25, 31, -29, 30, -54, 13);
    ctx.quadraticCurveTo(-63, 0, -54, -13);
    ctx.closePath();
    ctx.fillStyle = body;
    ctx.strokeStyle = '#c4e3dc';
    ctx.lineWidth = 1.6;
    ctx.fill();
    ctx.stroke();

    // Hull panel seam lines & rivets
    ctx.strokeStyle = 'rgba(210,240,235,0.25)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-28, -25); ctx.lineTo(-28, 24);
    ctx.moveTo(10, -26); ctx.lineTo(10, 24);
    ctx.stroke();

    // Research high-visibility safety stripe (amber/teal)
    ctx.fillStyle = '#d2963a';
    ctx.fillRect(-45, 12, 88, 2.5);

    // Stencil: DSV-1
    ctx.save();
    ctx.font = '600 7px "Space Grotesk", sans-serif';
    ctx.fillStyle = 'rgba(220,245,240,0.85)';
    ctx.fillText('DSV-1 RESEARCH', -32, 20);
    ctx.restore();

    // Surface sunlight caustic reflections dancing across the hull plates
    if (this.depth < 65) {
      const hullCausticAlpha = (1 - this.depth / 65) * 0.42;
      ctx.save();
      ctx.strokeStyle = `rgba(195, 255, 245, ${hullCausticAlpha})`;
      ctx.lineWidth = 1.3;
      for (let c = 0; c < 4; c++) {
        const cPhase = this.elapsed * 2.2 + c * 1.4;
        ctx.beginPath();
        const cxStart = -40 + c * 22;
        ctx.moveTo(cxStart, -18);
        ctx.quadraticCurveTo(
          cxStart + Math.sin(cPhase) * 9,
          0,
          cxStart + Math.cos(cPhase * 0.8) * 8,
          20
        );
        ctx.stroke();
      }
      ctx.restore();
    }

    // 3. Dorsal Sail / Hatch Tower & Antenna Mast
    ctx.beginPath();
    ctx.moveTo(-24, -25);
    ctx.lineTo(-14, -35);
    ctx.lineTo(14, -35);
    ctx.lineTo(24, -25);
    ctx.closePath();
    ctx.fillStyle = '#4c646b';
    ctx.strokeStyle = '#92b5b0';
    ctx.lineWidth = 1.2;
    ctx.fill();
    ctx.stroke();

    // Dorsal antenna with flashing beacon light
    ctx.beginPath();
    ctx.moveTo(0, -35);
    ctx.lineTo(0, -47);
    ctx.strokeStyle = '#a4c2be';
    ctx.lineWidth = 1.4;
    ctx.stroke();

    const beaconPulse = Math.sin(this.elapsed * 4.5) > 0.6;
    ctx.beginPath();
    ctx.arc(0, -48, 2.2, 0, Math.PI * 2);
    ctx.fillStyle = beaconPulse ? '#ffffff' : '#456a65';
    ctx.fill();
    if (beaconPulse) {
      ctx.beginPath();
      ctx.arc(0, -48, 5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.fill();
    }

    // 4. Observation Portholes with Interior Cockpit Glow
    for (let i = -1; i <= 1; i++) {
      const px = i * 20;
      // Reinforced steel flange rim
      ctx.beginPath();
      ctx.arc(px, -1, 12, 0, Math.PI * 2);
      ctx.fillStyle = '#31474e';
      ctx.strokeStyle = '#d7ece6';
      ctx.lineWidth = 1.8;
      ctx.fill();
      ctx.stroke();

      // Acrylic glass with warm interior instrument glow
      const glass = ctx.createRadialGradient(px - 2, -4, 2, px, -1, 11);
      glass.addColorStop(0, '#fff4d8');
      glass.addColorStop(0.3, '#74d5d0');
      glass.addColorStop(0.8, '#266f80');
      glass.addColorStop(1, '#113540');
      ctx.beginPath();
      ctx.arc(px, -1, 10, 0, Math.PI * 2);
      ctx.fillStyle = glass;
      ctx.fill();

      // Pilot silhouette in center viewport
      if (i === 0) {
        ctx.beginPath();
        ctx.arc(px - 1, -2, 3.2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(12,28,34,0.75)';
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(px - 1, 5, 5, 3.5, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // Viewport glass reflection arc
      ctx.beginPath();
      ctx.arc(px, -1, 8.5, -Math.PI * 0.7, -Math.PI * 0.2);
      ctx.strokeStyle = 'rgba(255,255,255,0.55)';
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }

    // 5. Aft Thruster Nacelles & Rotating Propeller
    ctx.beginPath();
    ctx.moveTo(-56, -10);
    ctx.lineTo(-72, -14);
    ctx.lineTo(-72, 14);
    ctx.lineTo(-56, 10);
    ctx.closePath();
    ctx.fillStyle = '#2c3e45';
    ctx.strokeStyle = '#7fa09d';
    ctx.lineWidth = 1.2;
    ctx.fill();
    ctx.stroke();

    // Propeller spinning effect
    const propPhase = Math.sin(this.elapsed * 24);
    ctx.beginPath();
    ctx.moveTo(-73, -11 * propPhase);
    ctx.lineTo(-73, 11 * propPhase);
    ctx.strokeStyle = '#b8d6d2';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // 6. Forward High-Power Floodlight Housing
    ctx.beginPath();
    ctx.arc(56, 3, 5.5, 0, Math.PI * 2);
    ctx.fillStyle = '#273c42';
    ctx.strokeStyle = '#c5e2dc';
    ctx.lineWidth = 1.4;
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(56, 3, 4, 0, Math.PI * 2);
    ctx.fillStyle = this.lightsOn ? '#e5fff6' : '#4a6564';
    ctx.fill();

    // 7. Articulated Hydraulic Manipulator Arm
    ctx.beginPath();
    ctx.moveTo(35, 18);
    ctx.lineTo(47, 24);
    ctx.lineTo(54, 21);
    ctx.strokeStyle = '#7fa09e';
    ctx.lineWidth = 2.2;
    ctx.stroke();

    // Sampling claw
    ctx.beginPath();
    ctx.moveTo(54, 18);
    ctx.lineTo(58, 21);
    ctx.lineTo(54, 24);
    ctx.strokeStyle = '#c7e5df';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.restore();
  }

  private drawSonarPulse() {
    const age = this.elapsed - this.sonarTime;
    if (age < 0 || age > 2.0) return;
    const ctx = this.ctx;

    // Primary expanding acoustic wave
    ctx.beginPath();
    ctx.arc(this.focusX, this.focusY, 14 + age * 135, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(151,246,225,${0.38 * (1 - age / 2.0)})`;
    ctx.lineWidth = 2.2;
    ctx.stroke();

    // Secondary trailing harmonic ring
    if (age > 0.12) {
      ctx.beginPath();
      ctx.arc(this.focusX, this.focusY, 8 + (age - 0.12) * 135, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(110,215,200,${0.2 * (1 - age / 2.0)})`;
      ctx.lineWidth = 1.4;
      ctx.stroke();
    }
  }

  private drawCreatureTags() {
    if (!this.showTags || this.activeCreatures.length === 0) return;
    const ctx = this.ctx;

    // Filter to visible creatures with hover or within proximity range
    const visibleTags = this.activeCreatures
      .map((c) => {
        const isHovered = this.mouse.active && Math.hypot(this.mouse.x - c.screenX, this.mouse.y - c.screenY) < c.radius + 18;
        const inProximity = c.distM < 22;
        const alpha = isHovered ? 1.0 : inProximity ? clamp(1 - (c.distM - 6) / 16, 0, 0.85) : 0;
        return { ...c, isHovered, alpha };
      })
      .filter((c) => c.alpha > 0.05)
      .sort((a, b) => (b.isHovered ? 1 : 0) - (a.isHovered ? 1 : 0) || a.distM - b.distM)
      .slice(0, 4);

    for (const c of visibleTags) {
      let tagX = c.screenX + c.radius + 12;
      let tagY = c.screenY - 14;
      const alpha = c.alpha;

      ctx.save();

      // Measure text for badge width
      ctx.font = '600 8.5px "Space Grotesk", sans-serif';
      const nameWidth = ctx.measureText(c.name).width;
      ctx.font = '500 7px "DM Sans", sans-serif';
      const catWidth = ctx.measureText(c.category).width;
      const boxWidth = Math.max(nameWidth, catWidth) + 14;
      const boxHeight = 24;

      // Screen boundary checks & left flip if near right border
      const flipLeft = tagX + boxWidth + 12 > this.width;
      const boxX = flipLeft ? Math.max(10, c.screenX - c.radius - 12 - boxWidth) : Math.min(tagX + 6, this.width - boxWidth - 10);
      tagY = clamp(tagY, 20, this.height - boxHeight - 20);

      const dotX = flipLeft ? c.screenX - c.radius * 0.6 : c.screenX + c.radius * 0.6;
      const dotY = c.screenY - c.radius * 0.2;

      // Connector leader line and targeting tick
      ctx.beginPath();
      ctx.moveTo(dotX, dotY);
      if (flipLeft) {
        ctx.lineTo(boxX + boxWidth + 6, tagY + 12);
        ctx.lineTo(boxX + boxWidth, tagY + 12);
      } else {
        ctx.lineTo(boxX - 6, tagY + 12);
        ctx.lineTo(boxX, tagY + 12);
      }
      ctx.strokeStyle = c.isHero
        ? `rgba(162, 237, 221, ${0.75 * alpha})`
        : `rgba(142, 218, 211, ${0.45 * alpha})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Small target reticle dot at creature connection point
      ctx.beginPath();
      ctx.arc(c.screenX + c.radius * 0.6, c.screenY - c.radius * 0.2, 1.8, 0, Math.PI * 2);
      ctx.fillStyle = c.isHero ? `rgba(162, 237, 221, ${alpha})` : `rgba(142, 218, 211, ${0.7 * alpha})`;
      ctx.fill();

      // Glassmorphic badge box
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(boxX, tagY, boxWidth, boxHeight, 3);
      } else {
        ctx.rect(boxX, tagY, boxWidth, boxHeight);
      }
      ctx.fillStyle = c.isHero
        ? `rgba(2, 24, 34, ${0.9 * alpha})`
        : `rgba(2, 18, 25, ${0.82 * alpha})`;
      ctx.strokeStyle = c.isHero
        ? `rgba(162, 237, 221, ${0.85 * alpha})`
        : `rgba(142, 218, 211, ${0.35 * alpha})`;
      ctx.lineWidth = 1;
      ctx.fill();
      ctx.stroke();

      // Name title
      ctx.font = '600 8.5px "Space Grotesk", sans-serif';
      ctx.fillStyle = c.isHero ? `rgba(162, 237, 221, ${alpha})` : `rgba(235, 252, 250, ${alpha})`;
      ctx.fillText(c.name, boxX + 7, tagY + 10);

      // Category subtitle
      ctx.font = '500 7px "DM Sans", sans-serif';
      ctx.fillStyle = c.isHero ? `rgba(180, 215, 210, ${0.9 * alpha})` : `rgba(135, 175, 180, ${0.85 * alpha})`;
      ctx.fillText(c.category, boxX + 7, tagY + 19);

      ctx.restore();
    }
  }
}

export type Specimen = {
  id: string;
  index: string;
  name: string;
  scientificName: string;
  depth: string;
  depthTier: 'epipelagic' | 'mesopelagic' | 'bathypelagic';
  targetDepth: number;
  habitat: string;
  realSize: string;
  description: string;
  detail: string;
  classification: string;
  source: {
    title: string;
    url: string;
    publisher: string;
    accessedOn: string;
  };
  annotations: { num: string; label: string }[];
  svg: string;
};

export const documentedSpecimens: Specimen[] = [
  {
    id: 'blue-whale',
    index: '01',
    name: 'Blue whale',
    scientificName: 'Balaenoptera musculus',
    depth: '0–200 m',
    depthTier: 'epipelagic',
    targetDepth: 135,
    habitat: 'Sunlight zone · Epipelagic',
    realSize: '24–30 m (80–100 ft); up to 190 metric tons',
    classification: 'MAMMALIA · CETACEA · BALAENOPTERIDAE',
    description:
      'The largest animal known to have ever lived on Earth. In the sunlit epipelagic zone, it lunges through massive swarms of euphausiids (krill), expanding its accordion-like throat grooves to engulf tonnes of seawater before straining it through hundreds of keratinous baleen plates.',
    detail:
      'Its low-frequency acoustic vocalizations (10–40 Hz) can resonate across thousands of kilometers through oceanic deep sound channels (SOFAR). The in-game side-view illustration is scaled for submersible viewport visibility.',
    source: {
      title: 'NOAA Fisheries · Blue Whale',
      url: 'https://www.fisheries.noaa.gov/species/blue-whale',
      publisher: 'NOAA Fisheries · Office of Protected Resources',
      accessedOn: '2026-09-25',
    },
    annotations: [
      { num: '01.', label: 'Rostrum & baleen filter plates' },
      { num: '02.', label: 'Accordion ventral throat grooves' },
      { num: '03.', label: 'Pectoral steering flipper' },
      { num: '04.', label: 'Falcate dorsal fin & caudal flukes' },
    ],
    svg: `
      <div class="specimen-plate">
        <div class="plate-badge">CLASSIFICATION // MAMMALIA · CETACEA</div>
        <svg class="specimen-diagram" viewBox="0 0 340 240" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="whaleAura" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#499bbe" stop-opacity="0.22"/>
              <stop offset="100%" stop-color="#499bbe" stop-opacity="0"/>
            </radialGradient>
            <linearGradient id="whaleSkin" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#184257"/>
              <stop offset="60%" stop-color="#0e2a38"/>
              <stop offset="100%" stop-color="#081a24"/>
            </linearGradient>
            <linearGradient id="whaleThroat" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#245873"/>
              <stop offset="100%" stop-color="#143647"/>
            </linearGradient>
          </defs>
          <circle cx="170" cy="120" r="110" fill="url(#whaleAura)" />
          <!-- Caudal flukes -->
          <path d="M 60 120 C 45 105 25 100 20 102 C 30 114 42 118 52 120 C 42 122 30 126 20 138 C 25 140 45 135 60 120 Z" fill="#184257" stroke="rgba(125,225,240,0.5)" stroke-width="1.2"/>
          <!-- Colossal streamlined body -->
          <path d="M 60 120 C 85 116 130 108 190 106 C 240 105 285 112 310 122 C 295 132 260 148 215 152 C 160 156 100 140 60 120 Z" fill="url(#whaleSkin)" stroke="rgba(130,225,240,0.6)" stroke-width="1.4"/>
          <!-- Rostrum & mouth line -->
          <path d="M 245 124 C 275 125 300 123 310 122 C 302 128 270 134 235 133" fill="none" stroke="rgba(160,235,250,0.7)" stroke-width="1.2"/>
          <!-- Ventral throat pleats -->
          <path d="M 230 133 C 200 148 160 152 130 144" fill="none" stroke="rgba(145,215,230,0.4)" stroke-width="1"/>
          <path d="M 235 136 C 205 151 165 154 135 146" fill="none" stroke="rgba(145,215,230,0.4)" stroke-width="1"/>
          <path d="M 240 139 C 210 154 170 156 142 148" fill="none" stroke="rgba(145,215,230,0.4)" stroke-width="1"/>
          <!-- Tiny dorsal fin near caudal peduncle -->
          <path d="M 98 111 L 92 103 L 88 113 Z" fill="#184257" stroke="rgba(130,225,240,0.5)" stroke-width="1"/>
          <!-- Long tapered pectoral flipper -->
          <path d="M 205 130 C 185 155 160 172 152 170 C 150 166 172 144 195 128 Z" fill="url(#whaleThroat)" stroke="rgba(130,225,240,0.6)" stroke-width="1.2"/>
          <!-- Blowhole and eye -->
          <circle cx="265" cy="110" r="2" fill="#081820" stroke="rgba(160,235,250,0.6)" stroke-width="0.8"/>
          <circle cx="282" cy="122" r="2.2" fill="#081820" stroke="rgba(160,235,250,0.8)" stroke-width="0.8"/>
          <circle cx="282.5" cy="121.5" r="0.7" fill="#ffffff"/>
        </svg>
        <div class="plate-annotations">
          <span><b>01.</b> Rostrum & baleen plates</span>
          <span><b>02.</b> Ventral throat grooves</span>
          <span><b>03.</b> Pectoral steering flipper</span>
          <span><b>04.</b> Dorsal fin & caudal flukes</span>
        </div>
      </div>
    `,
  },
  {
    id: 'vampire-squid',
    index: '02',
    name: 'Vampire squid',
    scientificName: 'Vampyroteuthis infernalis',
    depth: '600–900 m',
    depthTier: 'mesopelagic',
    targetDepth: 650,
    habitat: 'Midwater · Twilight zone',
    realSize: '28–30 cm total length',
    classification: 'CEPHALOPODA · VAMPYROMORPHA',
    description:
      'A deep-water cephalopod that gathers falling organic material called marine snow with two long retractile feeding filaments. Despite its predatory name, it is a gentle detritivore uniquely adapted to oxygen minimum zones.',
    detail:
      'Its arm tips can emit glowing blue bioluminescent clouds when startled to deter predators. The side-view illustration is enlarged for visibility and is not to scale.',
    source: {
      title: 'MBARI · Vampire squid',
      url: 'https://www.mbari.org/animal/vampire-squid/',
      publisher: 'Monterey Bay Aquarium Research Institute',
      accessedOn: '2026-09-25',
    },
    annotations: [
      { num: '01.', label: 'Apical swimming fins' },
      { num: '02.', label: 'Lucid sapphire eye' },
      { num: '03.', label: 'Bioluminescent photophores' },
      { num: '04.', label: 'Sensory feeding filaments' },
    ],
    svg: `
      <div class="specimen-plate">
        <div class="plate-badge">CLASSIFICATION // CEPHALOPODA · VAMPYROMORPHA</div>
        <svg class="specimen-diagram" viewBox="0 0 340 240" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="squidAura" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#49a8be" stop-opacity="0.25"/>
              <stop offset="100%" stop-color="#49a8be" stop-opacity="0"/>
            </radialGradient>
            <linearGradient id="squidMantle" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#722b49"/>
              <stop offset="100%" stop-color="#3b1625"/>
            </linearGradient>
            <linearGradient id="squidWeb" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#4e2034"/>
              <stop offset="100%" stop-color="#250d18"/>
            </linearGradient>
          </defs>
          <circle cx="170" cy="120" r="100" fill="url(#squidAura)" />
          <!-- Retractile sensory filaments -->
          <path d="M 140 130 C 100 160 80 190 60 220" stroke="rgba(195,245,255,0.4)" stroke-width="1.2" fill="none" stroke-dasharray="3 3"/>
          <path d="M 200 130 C 240 160 260 190 280 220" stroke="rgba(195,245,255,0.4)" stroke-width="1.2" fill="none" stroke-dasharray="3 3"/>
          <!-- Interbrachial web cloak -->
          <path d="M 145 105 C 120 120 100 160 115 195 Q 140 180 152 205 Q 162 188 170 208 Q 178 188 188 205 Q 200 180 225 195 C 240 160 220 120 195 105 Z" fill="url(#squidWeb)" stroke="rgba(215,115,160,0.6)" stroke-width="1.5"/>
          <!-- Arms and photophores -->
          <circle cx="115" cy="195" r="3" fill="#82f5ff" />
          <circle cx="152" cy="205" r="3" fill="#82f5ff" />
          <circle cx="170" cy="208" r="3" fill="#82f5ff" />
          <circle cx="188" cy="205" r="3" fill="#82f5ff" />
          <circle cx="225" cy="195" r="3" fill="#82f5ff" />
          <!-- Velvet mantle -->
          <path d="M 140 110 C 138 70 155 35 170 32 C 185 35 202 70 200 110 Q 170 130 140 110 Z" fill="url(#squidMantle)" stroke="rgba(215,115,160,0.6)" stroke-width="1.5"/>
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
    `,
  },
  {
    id: 'barreleye-fish',
    index: '03',
    name: 'Barreleye fish',
    scientificName: 'Macropinna microstoma',
    depth: '600–1,200 m',
    depthTier: 'bathypelagic',
    targetDepth: 1100,
    habitat: 'Midwater abyss · Bathypelagic',
    realSize: 'Approx. 15 cm length',
    classification: 'ACTINOPTERYGII · ARGENTINIFORMES · OPISTHOPROCTIDAE',
    description:
      'A remarkable deep-sea fish living at the twilight-to-midnight boundary, equipped with an extraordinary transparent fluid-filled head dome through which glowing tubular emerald-green eyes peer directly upward to track silhouettes of drifting prey against the faint downwelling surface light.',
    detail:
      'The two dark indentations on the front of its snout are olfactory organs (nares), not eyes. The green fluid lenses filter out residual sunlight, enabling the fish to pinpoint the bioluminescence of siphonophores and jellies overhead. The eyes can pivot forward when snatching food.',
    source: {
      title: 'MBARI · Barreleye fish',
      url: 'https://www.mbari.org/animal/barreleye/',
      publisher: 'Monterey Bay Aquarium Research Institute',
      accessedOn: '2026-09-25',
    },
    annotations: [
      { num: '01.', label: 'Transparent fluid-filled cranial dome' },
      { num: '02.', label: 'Upward-directed emerald tubular eyes' },
      { num: '03.', label: 'Olfactory nares (snout sensory pits)' },
      { num: '04.', label: 'Broad pectoral stabilization fins' },
    ],
    svg: `
      <div class="specimen-plate">
        <div class="plate-badge">CLASSIFICATION // ARGENTINIFORMES · OPISTHOPROCTIDAE</div>
        <svg class="specimen-diagram" viewBox="0 0 340 240" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="barreleyeAura" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#14ea98" stop-opacity="0.22"/>
              <stop offset="100%" stop-color="#14ea98" stop-opacity="0"/>
            </radialGradient>
            <linearGradient id="domeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="rgba(100,240,225,0.4)"/>
              <stop offset="60%" stop-color="rgba(40,160,180,0.18)"/>
              <stop offset="100%" stop-color="rgba(15,60,80,0.25)"/>
            </linearGradient>
            <linearGradient id="fishBody" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#0b1e26"/>
              <stop offset="100%" stop-color="#143644"/>
            </linearGradient>
          </defs>
          <circle cx="170" cy="120" r="105" fill="url(#barreleyeAura)" />
          <!-- Caudal fin -->
          <polygon points="65,120 35,90 45,120 35,150" fill="#143644" stroke="rgba(130,225,240,0.4)" stroke-width="1.2"/>
          <!-- Dark scaled body -->
          <path d="M 65 120 C 85 102 135 98 175 102 L 180 148 C 135 154 85 142 65 120 Z" fill="url(#fishBody)" stroke="rgba(130,225,240,0.5)" stroke-width="1.3"/>
          <!-- Dorsal and anal fins -->
          <polygon points="120,99 138,82 148,99" fill="#143644" stroke="rgba(130,225,240,0.4)" stroke-width="1"/>
          <polygon points="115,148 132,162 142,149" fill="#143644" stroke="rgba(130,225,240,0.4)" stroke-width="1"/>
          <!-- Broad fan-like pectoral fin -->
          <path d="M 165 132 C 145 152 130 156 122 152 C 124 142 145 130 165 132 Z" fill="#184b5e" stroke="rgba(130,225,240,0.5)" stroke-width="1"/>
          <!-- Transparent fluid-filled cranial dome -->
          <path d="M 175 102 C 185 70 240 70 262 100 C 275 116 268 138 250 144 C 220 152 180 148 180 148 Z" fill="url(#domeGrad)" stroke="rgba(140,245,235,0.7)" stroke-width="1.5"/>
          <!-- Glowing tubular emerald-green eyes peering upward inside the dome -->
          <ellipse cx="212" cy="108" rx="11" ry="14" fill="#063222" stroke="#18e690" stroke-width="1.5"/>
          <circle cx="212" cy="104" r="8" fill="#10ea8a"/>
          <circle cx="212" cy="101" r="3.5" fill="#042618"/>
          <circle cx="210" cy="99.5" r="1.2" fill="#ffffff"/>
          <ellipse cx="236" cy="109" rx="10" ry="13" fill="#063222" stroke="#18e690" stroke-width="1.5"/>
          <circle cx="236" cy="105" r="7.2" fill="#10ea8a"/>
          <circle cx="236" cy="102" r="3.2" fill="#042618"/>
          <circle cx="234.5" cy="100.5" r="1.1" fill="#ffffff"/>
          <!-- Snout & olfactory nares (sensory pits often mistaken for eyes) -->
          <circle cx="265" cy="120" r="3" fill="#05141c" stroke="rgba(140,245,235,0.5)" stroke-width="1"/>
          <path d="M 268 126 C 265 132 258 135 252 135" fill="none" stroke="rgba(140,245,235,0.6)" stroke-width="1.2"/>
        </svg>
        <div class="plate-annotations">
          <span><b>01.</b> Cranial fluid shield</span>
          <span><b>02.</b> Emerald tubular eyes</span>
          <span><b>03.</b> Olfactory nares</span>
          <span><b>04.</b> Stabilization fins</span>
        </div>
      </div>
    `,
  },
  {
    id: 'tripod-fish',
    index: '04',
    name: 'Benthic tripod fish',
    scientificName: 'Bathypterois grallator',
    depth: '1,900–2,000 m',
    depthTier: 'bathypelagic',
    targetDepth: 1992,
    habitat: 'Abyssal seafloor · Benthic floor',
    realSize: '35–40 cm body length; fin ray stilts >1 m',
    classification: 'ACTINOPTERYGII · AULOPIFORMES · IPNOPIDAE',
    description:
      'A deep-sea stilt walker that balances upon three elongated, specialized fin rays (two pelvic fins and one lower caudal lobe) to stand poised above the muddy abyssal sediment facing directly into bottom currents.',
    detail:
      'Almost completely blind in the lightless abyss, it holds long, delicate pectoral fin rays arched forward over its head like sensory antennae to detect subtle hydraulic vibrations and tactile signals from passing copepods and plankton.',
    source: {
      title: 'Smithsonian Ocean · Tripod fish',
      url: 'https://ocean.si.edu/ocean-life/fish/tripod-fish',
      publisher: 'Smithsonian National Museum of Natural History',
      accessedOn: '2026-09-25',
    },
    annotations: [
      { num: '01.', label: 'Tactile pectoral antennae' },
      { num: '02.', label: 'Stilt pelvic fin rays' },
      { num: '03.', label: 'Caudal tripod stilt foot' },
      { num: '04.', label: 'Current-facing ambush stance' },
    ],
    svg: `
      <div class="specimen-plate">
        <div class="plate-badge">CLASSIFICATION // AULOPIFORMES · IPNOPIDAE</div>
        <svg class="specimen-diagram" viewBox="0 0 340 240" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="tripodAura" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#4aaec2" stop-opacity="0.22"/>
              <stop offset="100%" stop-color="#4aaec2" stop-opacity="0"/>
            </radialGradient>
            <linearGradient id="tripodBody" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#0e2a36"/>
              <stop offset="100%" stop-color="#184a5e"/>
            </linearGradient>
          </defs>
          <circle cx="170" cy="120" r="105" fill="url(#tripodAura)" />
          <!-- Seafloor benthic substrate baseline -->
          <line x1="20" y1="215" x2="320" y2="215" stroke="rgba(70,140,150,0.3)" stroke-width="1.5" stroke-dasharray="4 4"/>
          <!-- Elongated caudal fin stilt ray (the 3rd tripod leg) -->
          <line x1="88" y1="125" x2="65" y2="215" stroke="rgba(130,225,240,0.7)" stroke-width="1.6"/>
          <!-- Two elongated pelvic fin stilt rays (front tripod legs) -->
          <line x1="165" y1="128" x2="135" y2="215" stroke="rgba(130,225,240,0.8)" stroke-width="1.8"/>
          <line x1="180" y1="128" x2="210" y2="215" stroke="rgba(130,225,240,0.8)" stroke-width="1.8"/>
          <!-- Slender poised body -->
          <path d="M 85 125 C 105 116 155 112 215 114 C 235 116 250 120 255 124 C 248 128 230 134 210 134 C 160 134 105 132 85 125 Z" fill="url(#tripodBody)" stroke="rgba(130,225,240,0.6)" stroke-width="1.3"/>
          <!-- Caudal fin upper lobe -->
          <polygon points="85,125 60,110 70,125" fill="#184a5e" stroke="rgba(130,225,240,0.5)" stroke-width="1"/>
          <!-- Arched forward tactile pectoral antennae rays -->
          <path d="M 210 118 C 225 90 260 65 295 58" fill="none" stroke="rgba(140,245,235,0.7)" stroke-width="1.4"/>
          <path d="M 215 120 C 235 95 270 75 305 70" fill="none" stroke="rgba(140,245,235,0.5)" stroke-width="1.2"/>
          <!-- Reduced blind eye & snout -->
          <circle cx="246" cy="121" r="1.5" fill="#2d6878" stroke="rgba(140,245,235,0.4)" stroke-width="0.7"/>
          <path d="M 248 125 L 255 124" stroke="rgba(140,245,235,0.6)" stroke-width="1"/>
        </svg>
        <div class="plate-annotations">
          <span><b>01.</b> Pectoral antennae</span>
          <span><b>02.</b> Pelvic stilt rays</span>
          <span><b>03.</b> Caudal tripod stilt</span>
          <span><b>04.</b> Benthic ambush posture</span>
        </div>
      </div>
    `,
  },
  {
    id: 'gulper-eel',
    index: '05',
    name: 'Gulper eel',
    scientificName: 'Eurypharynx pelecanoides',
    depth: '1,200–3,000 m',
    depthTier: 'bathypelagic',
    targetDepth: 2750,
    habitat: 'Lower Bathypelagic · Midnight Abyss',
    realSize: '75–100 cm (jaw forms ~25% of body length)',
    classification: 'ACTINOPTERYGII · SACCOPHARYNGIFORMES · EURYPHARYNGIDAE',
    description:
      'An astonishing deep-sea predator with a gargantuan distensible pouch jaw loosely hinged like a pelican beak, allowing it to engulf prey significantly larger than itself in the food-sparse bathypelagic depths.',
    detail:
      'Its whip-like slender body terminates in a complex bioluminescent organ that glows with pink and blue flashes to lure curious organisms directly into its yawning cavernous mouth. The stomach expands to accommodate massive meals.',
    source: {
      title: 'MBARI · Gulper eel',
      url: 'https://www.mbari.org/animal/gulper-eel/',
      publisher: 'Monterey Bay Aquarium Research Institute',
      accessedOn: '2026-09-25',
    },
    annotations: [
      { num: '01.', label: 'Distensible pouch jaw' },
      { num: '02.', label: 'Minute dorsal eye' },
      { num: '03.', label: 'Sinusoidal whip tail' },
      { num: '04.', label: 'Bioluminescent lure' },
    ],
    svg: `
      <div class="specimen-plate">
        <div class="plate-badge">CLASSIFICATION // SACCOPHARYNGIFORMES · EURYPHARYNGIDAE</div>
        <svg class="specimen-diagram" viewBox="0 0 340 240" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="eelAura" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#ff4a88" stop-opacity="0.2"/>
              <stop offset="100%" stop-color="#ff4a88" stop-opacity="0"/>
            </radialGradient>
            <linearGradient id="eelBody" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#081822"/>
              <stop offset="50%" stop-color="#142c38"/>
              <stop offset="100%" stop-color="#081822"/>
            </linearGradient>
            <linearGradient id="eelPouch" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="rgba(20,50,65,0.7)"/>
              <stop offset="100%" stop-color="rgba(6,18,25,0.9)"/>
            </linearGradient>
          </defs>
          <circle cx="170" cy="120" r="110" fill="url(#eelAura)" />
          <!-- Cavernous expandable pouch mouth -->
          <path d="M 270 102 C 220 102 180 110 165 125 C 175 160 215 178 265 142 C 275 132 278 112 270 102 Z" fill="url(#eelPouch)" stroke="rgba(140,245,235,0.6)" stroke-width="1.4"/>
          <!-- Elastic jaw hinge and upper mandible -->
          <path d="M 270 102 Q 220 98 165 125" fill="none" stroke="rgba(180,250,240,0.85)" stroke-width="1.8"/>
          <!-- Lower mandible arc -->
          <path d="M 165 125 Q 185 180 265 142" fill="none" stroke="rgba(180,250,240,0.85)" stroke-width="1.8"/>
          <!-- Long slender whip-like eel body with sinusoidal undulation -->
          <path d="M 165 125 C 135 122 105 130 85 115 C 65 100 45 125 30 110 C 22 102 15 115 12 112" fill="none" stroke="url(#eelBody)" stroke-width="4.5"/>
          <path d="M 165 125 C 135 122 105 130 85 115 C 65 100 45 125 30 110 C 22 102 15 115 12 112" fill="none" stroke="rgba(125,225,240,0.5)" stroke-width="1.2"/>
          <!-- Minute eye perched high near tip of snout -->
          <circle cx="264" cy="100" r="1.8" fill="#58d5e8" stroke="#ffffff" stroke-width="0.6"/>
          <!-- Bioluminescent caudal tip organ (photophore lure) -->
          <circle cx="12" cy="112" r="5" fill="rgba(255,100,160,0.35)"/>
          <circle cx="12" cy="112" r="2.5" fill="#ff72aa"/>
          <circle cx="12" cy="112" r="1" fill="#ffffff"/>
        </svg>
        <div class="plate-annotations">
          <span><b>01.</b> Distensible pouch jaw</span>
          <span><b>02.</b> Minute dorsal eye</span>
          <span><b>03.</b> Sinusoidal whip tail</span>
          <span><b>04.</b> Bioluminescent lure</span>
        </div>
      </div>
    `,
  },
];

export const vampireSquid = documentedSpecimens[1];

export function zoneAt(depth: number): { name: string; subtitle: string } {
  if (depth < 1) return { name: 'OCEAN SURFACE', subtitle: 'Open water' };
  if (depth < 200) return { name: 'SUNLIGHT ZONE', subtitle: 'Epipelagic' };
  if (depth < 1000) return { name: 'TWILIGHT ZONE', subtitle: 'Mesopelagic' };
  if (depth < 4000) return { name: 'MIDNIGHT ZONE', subtitle: 'Bathypelagic' };
  return { name: 'ABYSSAL ZONE', subtitle: 'Abyssopelagic' };
}

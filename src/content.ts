export type Specimen = {
  id: string;
  index: string;
  name: string;
  scientificName: string;
  depth: string;
  depthTier: 'epipelagic' | 'mesopelagic' | 'bathypelagic' | 'abyssopelagic' | 'hadalpelagic';
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
  photo: {
    src: string;
    caption: string;
    credit: string;
    license: string;
    pageUrl: string;
  };
};

export const documentedSpecimens: Specimen[] = [
  {
    "id": "blue-whale",
    "name": "Blue whale",
    "scientificName": "Balaenoptera musculus",
    "depth": "0–200 m",
    "depthTier": "epipelagic",
    "targetDepth": 135,
    "habitat": "Sunlight zone · Epipelagic",
    "realSize": "24–30 m (80–100 ft); up to 190 metric tons",
    "classification": "MAMMALIA · CETACEA · BALAENOPTERIDAE",
    "photo": {
      "src": "/species/blue-whale.jpg",
      "caption": "Adult blue whale, eastern Pacific Ocean",
      "credit": "NOAA Fisheries",
      "license": "Public domain",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Bluewhale877.jpg"
    },
    "description": "The largest animal known to have ever lived on Earth. In the sunlit epipelagic zone, it lunges through massive swarms of euphausiids (krill), expanding its accordion-like throat grooves to engulf tonnes of seawater before straining it through hundreds of keratinous baleen plates.",
    "detail": "Its low-frequency acoustic vocalizations (10–40 Hz) can resonate across thousands of kilometers through oceanic deep sound channels (SOFAR). The in-game side-view illustration is scaled for submersible viewport visibility.",
    "source": {
      "title": "NOAA Fisheries · Blue Whale",
      "url": "https://www.fisheries.noaa.gov/species/blue-whale",
      "publisher": "NOAA Fisheries · Office of Protected Resources",
      "accessedOn": "2026-09-25"
    },
    "annotations": [
      {
        "num": "01.",
        "label": "Rostrum & baleen filter plates"
      },
      {
        "num": "02.",
        "label": "Accordion ventral throat grooves"
      },
      {
        "num": "03.",
        "label": "Pectoral steering flipper"
      },
      {
        "num": "04.",
        "label": "Falcate dorsal fin & caudal flukes"
      }
    ],
    "svg": "\n      <div class=\"specimen-plate\">\n        <div class=\"plate-badge\">CLASSIFICATION // MAMMALIA · CETACEA</div>\n        <svg class=\"specimen-diagram\" viewBox=\"0 0 340 240\" xmlns=\"http://www.w3.org/2000/svg\">\n          <defs>\n            <radialGradient id=\"whaleAura\" cx=\"50%\" cy=\"50%\" r=\"50%\">\n              <stop offset=\"0%\" stop-color=\"#499bbe\" stop-opacity=\"0.22\"/>\n              <stop offset=\"100%\" stop-color=\"#499bbe\" stop-opacity=\"0\"/>\n            </radialGradient>\n            <linearGradient id=\"whaleSkin\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\">\n              <stop offset=\"0%\" stop-color=\"#184257\"/>\n              <stop offset=\"60%\" stop-color=\"#0e2a38\"/>\n              <stop offset=\"100%\" stop-color=\"#081a24\"/>\n            </linearGradient>\n            <linearGradient id=\"whaleThroat\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\">\n              <stop offset=\"0%\" stop-color=\"#245873\"/>\n              <stop offset=\"100%\" stop-color=\"#143647\"/>\n            </linearGradient>\n          </defs>\n          <circle cx=\"170\" cy=\"120\" r=\"110\" fill=\"url(#whaleAura)\" />\n          <path d=\"M 60 120 C 45 105 25 100 20 102 C 30 114 42 118 52 120 C 42 122 30 126 20 138 C 25 140 45 135 60 120 Z\" fill=\"#184257\" stroke=\"rgba(125,225,240,0.5)\" stroke-width=\"1.2\"/>\n          <path d=\"M 60 120 C 85 116 130 108 190 106 C 240 105 285 112 310 122 C 295 132 260 148 215 152 C 160 156 100 140 60 120 Z\" fill=\"url(#whaleSkin)\" stroke=\"rgba(130,225,240,0.6)\" stroke-width=\"1.4\"/>\n          <path d=\"M 245 124 C 275 125 300 123 310 122 C 302 128 270 134 235 133\" fill=\"none\" stroke=\"rgba(160,235,250,0.7)\" stroke-width=\"1.2\"/>\n          <path d=\"M 230 133 C 200 148 160 152 130 144\" fill=\"none\" stroke=\"rgba(145,215,230,0.4)\" stroke-width=\"1\"/>\n          <path d=\"M 235 136 C 205 151 165 154 135 146\" fill=\"none\" stroke=\"rgba(145,215,230,0.4)\" stroke-width=\"1\"/>\n          <path d=\"M 240 139 C 210 154 170 156 142 148\" fill=\"none\" stroke=\"rgba(145,215,230,0.4)\" stroke-width=\"1\"/>\n          <path d=\"M 98 111 L 92 103 L 88 113 Z\" fill=\"#184257\" stroke=\"rgba(130,225,240,0.5)\" stroke-width=\"1\"/>\n          <path d=\"M 205 130 C 185 155 160 172 152 170 C 150 166 172 144 195 128 Z\" fill=\"url(#whaleThroat)\" stroke=\"rgba(130,225,240,0.6)\" stroke-width=\"1.2\"/>\n          <circle cx=\"265\" cy=\"110\" r=\"2\" fill=\"#081820\" stroke=\"rgba(160,235,250,0.6)\" stroke-width=\"0.8\"/>\n          <circle cx=\"282\" cy=\"122\" r=\"2.2\" fill=\"#081820\" stroke=\"rgba(160,235,250,0.8)\" stroke-width=\"0.8\"/>\n          <circle cx=\"282.5\" cy=\"121.5\" r=\"0.7\" fill=\"#ffffff\"/>\n        </svg>\n        <div class=\"plate-annotations\">\n          <span><b>01.</b> Rostrum & baleen plates</span>\n          <span><b>02.</b> Ventral throat grooves</span>\n          <span><b>03.</b> Pectoral steering flipper</span>\n          <span><b>04.</b> Dorsal fin & caudal flukes</span>\n        </div>\n      </div>\n    ",
    "index": "01"
  },
  {
    "id": "bottlenose-dolphin",
    "name": "Common bottlenose dolphin",
    "scientificName": "Tursiops truncatus",
    "depth": "0–100 m",
    "depthTier": "epipelagic",
    "targetDepth": 35,
    "habitat": "Surface & Nearshore waters · Epipelagic",
    "realSize": "2.0–3.9 m (6.6–12.8 ft); 150–650 kg",
    "classification": "MAMMALIA · CETACEA · DELPHINIDAE",
    "photo": {
      "src": "/species/bottlenose-dolphin.jpg",
      "caption": "Bottlenose dolphin surfacing in coastal waters",
      "credit": "NASA",
      "license": "Public domain",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Tursiops_truncatus_01.jpg"
    },
    "description": "Highly social marine mammals known for their intelligence, hydrodynamic spindle body, and high-frequency echolocation clicks. Pods cruise surface waters in cooperative hunting formations, communicating through signature whistles and sonic pulses.",
    "detail": "Can dive to over 100 meters while foraging for benthic and schooling fish, with heart rates slowing automatically to conserve blood oxygen (bradycardia).",
    "source": {
      "title": "NOAA Fisheries · Common Bottlenose Dolphin",
      "url": "https://www.fisheries.noaa.gov/species/common-bottlenose-dolphin",
      "publisher": "NOAA Fisheries · Office of Protected Resources",
      "accessedOn": "2026-09-25"
    },
    "annotations": [
      {
        "num": "01.",
        "label": "Short defined rostrum beak"
      },
      {
        "num": "02.",
        "label": "Curved falcate dorsal fin"
      },
      {
        "num": "03.",
        "label": "Melon acoustic acoustic projector"
      },
      {
        "num": "04.",
        "label": "Horizontal caudal flukes"
      }
    ],
    "svg": "\n      <div class=\"specimen-plate\">\n        <div class=\"plate-badge\">CLASSIFICATION // MAMMALIA · DELPHINIDAE</div>\n        <svg class=\"specimen-diagram\" viewBox=\"0 0 340 240\" xmlns=\"http://www.w3.org/2000/svg\">\n          <circle cx=\"170\" cy=\"120\" r=\"100\" fill=\"rgba(80,190,210,0.12)\" />\n          <path d=\"M 80 120 C 110 100 170 90 230 102 C 265 110 285 116 295 118 C 285 125 255 136 210 138 C 160 140 110 132 80 120 Z\" fill=\"#1b465a\" stroke=\"rgba(130,225,240,0.6)\" stroke-width=\"1.3\"/>\n          <path d=\"M 165 92 C 160 76 150 70 142 68 C 150 82 152 92 150 94 Z\" fill=\"#1b465a\" stroke=\"rgba(130,225,240,0.6)\" stroke-width=\"1\"/>\n          <path d=\"M 80 120 C 65 106 48 102 42 104 C 52 114 62 118 70 120 C 62 122 52 126 42 136 C 48 138 65 134 80 120 Z\" fill=\"#1b465a\" stroke=\"rgba(130,225,240,0.6)\" stroke-width=\"1\"/>\n          <path d=\"M 200 126 C 185 142 172 152 166 150 C 166 145 178 132 192 124 Z\" fill=\"#153645\" stroke=\"rgba(130,225,240,0.5)\" stroke-width=\"1\"/>\n          <circle cx=\"258\" cy=\"112\" r=\"2\" fill=\"#091419\" stroke=\"rgba(140,225,235,0.7)\" stroke-width=\"0.8\"/>\n        </svg>\n        <div class=\"plate-annotations\">\n          <span><b>01.</b> Defined rostrum beak</span>\n          <span><b>02.</b> Falcate dorsal fin</span>\n          <span><b>03.</b> Frontal acoustic melon</span>\n          <span><b>04.</b> Caudal flukes</span>\n        </div>\n      </div>\n    ",
    "index": "02"
  },
  {
    "id": "harbor-seal",
    "name": "Harbor seal",
    "scientificName": "Phoca vitulina",
    "depth": "0–120 m",
    "depthTier": "epipelagic",
    "targetDepth": 40,
    "habitat": "Coastal shallows & Epipelagic shelves",
    "realSize": "1.5–1.9 m (5–6 ft); 60–130 kg",
    "classification": "MAMMALIA · CARNIVORA · PHOCIDAE",
    "photo": {
      "src": "/species/harbor-seal.jpg",
      "caption": "Common harbor seal diving gracefully in clear ocean water",
      "credit": "Charles J. Sharp",
      "license": "CC BY-SA 4.0",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Common_seal_(Phoca_vitulina)_2.jpg"
    },
    "description": "True earless pinnipeds adapted for efficient marine locomotion. With sleek blubber-insulated bodies and large sensitive eyes adapted for low-light vision, harbor seals make routine foraging descents to capture flatfish, crustaceans, and squid.",
    "detail": "Their complex vibrissae (whiskers) can detect subtle hydrodynamic trails left by swimming fish minutes after prey has passed by in turbid coastal water.",
    "source": {
      "title": "NOAA Fisheries · Harbor Seal",
      "url": "https://www.fisheries.noaa.gov/species/harbor-seal",
      "publisher": "NOAA Fisheries · Office of Protected Resources",
      "accessedOn": "2026-09-25"
    },
    "annotations": [
      {
        "num": "01.",
        "label": "Rounded earless pinniped head"
      },
      {
        "num": "02.",
        "label": "Hydrodynamic fusiform body"
      },
      {
        "num": "03.",
        "label": "Hydrodynamic steering foreflippers"
      },
      {
        "num": "04.",
        "label": "Hind propulsion flippers"
      }
    ],
    "svg": "\n      <div class=\"specimen-plate\">\n        <div class=\"plate-badge\">CLASSIFICATION // MAMMALIA · PHOCIDAE</div>\n        <svg class=\"specimen-diagram\" viewBox=\"0 0 340 240\" xmlns=\"http://www.w3.org/2000/svg\">\n          <circle cx=\"170\" cy=\"120\" r=\"95\" fill=\"rgba(65,180,200,0.12)\" />\n          <path d=\"M 85 120 C 105 102 165 95 220 105 C 248 110 265 118 268 126 C 262 134 235 142 195 144 C 145 146 100 136 85 120 Z\" fill=\"#203f4d\" stroke=\"rgba(130,225,240,0.6)\" stroke-width=\"1.3\"/>\n          <path d=\"M 85 120 C 65 112 50 114 45 118 C 55 124 68 124 85 120 Z\" fill=\"#18323e\" stroke=\"rgba(130,225,240,0.5)\" stroke-width=\"1\"/>\n          <path d=\"M 85 120 C 65 126 50 126 45 122 C 55 118 68 118 85 120 Z\" fill=\"#18323e\" stroke=\"rgba(130,225,240,0.5)\" stroke-width=\"1\"/>\n          <path d=\"M 185 128 C 175 142 165 150 160 148 C 160 144 170 132 180 126 Z\" fill=\"#18323e\" stroke=\"rgba(130,225,240,0.5)\" stroke-width=\"1\"/>\n          <circle cx=\"248\" cy=\"116\" r=\"2.5\" fill=\"#091419\" stroke=\"rgba(140,225,235,0.7)\" stroke-width=\"0.8\"/>\n        </svg>\n        <div class=\"plate-annotations\">\n          <span><b>01.</b> Blunt earless rostrum</span>\n          <span><b>02.</b> Fusiform blubber hull</span>\n          <span><b>03.</b> Steering foreflipper</span>\n          <span><b>04.</b> Propulsion hind flippers</span>\n        </div>\n      </div>\n    ",
    "index": "03"
  },
  {
    "id": "epipelagic-fish",
    "name": "Atlantic mackerel",
    "scientificName": "Scomber scombrus",
    "depth": "0–200 m",
    "depthTier": "epipelagic",
    "targetDepth": 45,
    "habitat": "Open pelagic surface waters · Epipelagic",
    "realSize": "30–40 cm (12–16 in); up to 1 kg",
    "classification": "ACTINOPTERYGII · SCOMBRIDAE",
    "photo": {
      "src": "/species/epipelagic-fish.jpg",
      "caption": "Atlantic mackerel specimen showing iridescent dorsal tiger striping",
      "credit": "Petar Milošević",
      "license": "CC BY-SA 4.0",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Atlantic_mackerel_(Scomber_scombrus).jpg"
    },
    "description": "Fast-swimming pelagic schooling fish distinguished by iridescent metallic green-blue backs crossed by dark undulating bars. Lacking a swim bladder, they must maintain continuous motion to avoid sinking and maintain constant oxygenation over their gills.",
    "detail": "They gather in tight, coordinated bait-ball shoals of thousands of individuals, utilizing lateral line vibration sensing to synchronize defensive evasive maneuvers against pelagic predators.",
    "source": {
      "title": "NOAA Fisheries · Atlantic Mackerel",
      "url": "https://www.fisheries.noaa.gov/species/atlantic-mackerel",
      "publisher": "NOAA Fisheries · Greater Atlantic Regional Office",
      "accessedOn": "2026-09-25"
    },
    "annotations": [
      {
        "num": "01.",
        "label": "Iridescent barred dorsal skin"
      },
      {
        "num": "02.",
        "label": "Finlets behind second dorsal fin"
      },
      {
        "num": "03.",
        "label": "Deeply forked caudal fin"
      },
      {
        "num": "04.",
        "label": "Streamlined mackerel torpedo hull"
      }
    ],
    "svg": "\n      <div class=\"specimen-plate\">\n        <div class=\"plate-badge\">CLASSIFICATION // ACTINOPTERYGII · SCOMBRIDAE</div>\n        <svg class=\"specimen-diagram\" viewBox=\"0 0 340 240\" xmlns=\"http://www.w3.org/2000/svg\">\n          <circle cx=\"170\" cy=\"120\" r=\"90\" fill=\"rgba(70,180,210,0.12)\" />\n          <path d=\"M 80 120 C 110 102 170 98 220 108 C 250 114 265 120 268 122 C 255 128 225 138 180 138 C 130 138 95 128 80 120 Z\" fill=\"#1b4d5e\" stroke=\"rgba(130,225,240,0.7)\" stroke-width=\"1.3\"/>\n          <path d=\"M 75 120 L 52 100 L 62 120 L 52 140 Z\" fill=\"#143644\" stroke=\"rgba(130,225,240,0.6)\" stroke-width=\"1\"/>\n          <path d=\"M 145 101 L 160 85 L 175 100 Z\" fill=\"#184b5e\" stroke=\"rgba(130,225,240,0.5)\" stroke-width=\"1\"/>\n          <path d=\"M 190 103 L 200 92 L 210 103 Z\" fill=\"#184b5e\" stroke=\"rgba(130,225,240,0.5)\" stroke-width=\"1\"/>\n          <circle cx=\"245\" cy=\"116\" r=\"2.5\" fill=\"#061820\" stroke=\"rgba(140,225,235,0.8)\" stroke-width=\"0.8\"/>\n        </svg>\n        <div class=\"plate-annotations\">\n          <span><b>01.</b> Iridescent striped dorsal</span>\n          <span><b>02.</b> Dorsal finlets</span>\n          <span><b>03.</b> Forked caudal fin</span>\n          <span><b>04.</b> Torpedo scombroid profile</span>\n        </div>\n      </div>\n    ",
    "index": "04"
  },
  {
    "id": "moon-jelly",
    "name": "Moon jellyfish",
    "scientificName": "Aurelia aurita",
    "depth": "0–100 m",
    "depthTier": "epipelagic",
    "targetDepth": 50,
    "habitat": "Coastal waters & Ocean surface drift · Epipelagic",
    "realSize": "25–40 cm (10–16 in) bell diameter",
    "classification": "SCYPHOZOA · SEMAEOSTOMEAE · ULMARIDAE",
    "photo": {
      "src": "/species/moon-jelly.jpg",
      "caption": "Translucent moon jellyfish showcasing four horseshoe-shaped gonads",
      "credit": "Luc Viatour",
      "license": "CC BY-SA 3.0",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Aurelia_aurita_(Cnidaria)_Luc_Viatour.jpg"
    },
    "description": "Translucent saucer-shaped medusa recognizable by four violet or pink horseshoe-shaped gonads visible through its gelatinous bell. Moves by rhythmic coronal muscle pulsations, sweeping microplankton into its mucus-covered fringing tentacles.",
    "detail": "Contains over 95% water and lacks brain, lungs, and heart, navigating via rhopalia marginal sensory organs that detect gravity and ambient sunlight intensity.",
    "source": {
      "title": "Marine Life Information Network · Aurelia aurita",
      "url": "https://www.marlin.ac.uk/species/detail/1402",
      "publisher": "Marine Biological Association of the UK",
      "accessedOn": "2026-09-25"
    },
    "annotations": [
      {
        "num": "01.",
        "label": "Translucent hemispherical umbrella"
      },
      {
        "num": "02.",
        "label": "Tetramerous horseshoe gonads"
      },
      {
        "num": "03.",
        "label": "Marginal tentacular fringe"
      },
      {
        "num": "04.",
        "label": "Central frilled oral arms"
      }
    ],
    "svg": "\n      <div class=\"specimen-plate\">\n        <div class=\"plate-badge\">CLASSIFICATION // SCYPHOZOA · ULMARIDAE</div>\n        <svg class=\"specimen-diagram\" viewBox=\"0 0 340 240\" xmlns=\"http://www.w3.org/2000/svg\">\n          <circle cx=\"170\" cy=\"120\" r=\"95\" fill=\"rgba(100,210,230,0.15)\" />\n          <path d=\"M 100 130 C 100 80 130 50 170 50 C 210 50 240 80 240 130 Q 170 145 100 130 Z\" fill=\"rgba(120,215,235,0.22)\" stroke=\"rgba(160,240,255,0.7)\" stroke-width=\"1.4\"/>\n          <circle cx=\"155\" cy=\"100\" r=\"8\" fill=\"none\" stroke=\"rgba(215,160,230,0.75)\" stroke-width=\"2\"/>\n          <circle cx=\"185\" cy=\"100\" r=\"8\" fill=\"none\" stroke=\"rgba(215,160,230,0.75)\" stroke-width=\"2\"/>\n          <circle cx=\"155\" cy=\"120\" r=\"8\" fill=\"none\" stroke=\"rgba(215,160,230,0.75)\" stroke-width=\"2\"/>\n          <circle cx=\"185\" cy=\"120\" r=\"8\" fill=\"none\" stroke=\"rgba(215,160,230,0.75)\" stroke-width=\"2\"/>\n          <path d=\"M 150 135 Q 145 170 140 195 M 165 135 Q 165 175 162 205 M 175 135 Q 175 175 178 205 M 190 135 Q 195 170 200 195\" stroke=\"rgba(160,235,250,0.5)\" stroke-width=\"1.2\" fill=\"none\"/>\n        </svg>\n        <div class=\"plate-annotations\">\n          <span><b>01.</b> Translucent umbrella</span>\n          <span><b>02.</b> Horseshoe gonads</span>\n          <span><b>03.</b> Marginal fringe</span>\n          <span><b>04.</b> Trailing oral arms</span>\n        </div>\n      </div>\n    ",
    "index": "05"
  },
  {
    "id": "pelagic-ray",
    "name": "Giant oceanic manta ray",
    "scientificName": "Mobula birostris",
    "depth": "10–120 m",
    "depthTier": "epipelagic",
    "targetDepth": 60,
    "habitat": "Pelagic open ocean & Coral corridors · Epipelagic",
    "realSize": "4.5–7.0 m (15–23 ft) wingspan; up to 2 metric tons",
    "classification": "CHONDRICHTHYES · MOBULIDAE",
    "photo": {
      "src": "/species/pelagic-ray.jpg",
      "caption": "Giant oceanic manta ray gliding above a deep blue reef ridge",
      "credit": "Arturo de Frias Marques",
      "license": "CC BY-SA 4.0",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Giant_Manta_AdF.jpg"
    },
    "description": "The largest ray species on Earth, possessing broad triangular pectoral wings and forward-curved cephalic lobes that funnel plankton-rich seawater into its wide terminal mouth during gentle barrel-roll feeding descents.",
    "detail": "Possesses the highest brain-to-body mass ratio of all cold-blooded fishes, demonstrating sophisticated spatial mapping and self-recognition behaviors in research trials.",
    "source": {
      "title": "NOAA Fisheries · Giant Manta Ray",
      "url": "https://www.fisheries.noaa.gov/species/giant-manta-ray",
      "publisher": "NOAA Fisheries · Office of Protected Resources",
      "accessedOn": "2026-09-25"
    },
    "annotations": [
      {
        "num": "01.",
        "label": "Cephalic feeding lobes"
      },
      {
        "num": "02.",
        "label": "Pectoral wing disc"
      },
      {
        "num": "03.",
        "label": "Ventral gill slits"
      },
      {
        "num": "04.",
        "label": "Slender caudal whip tail"
      }
    ],
    "svg": "\n      <div class=\"specimen-plate\">\n        <div class=\"plate-badge\">CLASSIFICATION // CHONDRICHTHYES · MOBULIDAE</div>\n        <svg class=\"specimen-diagram\" viewBox=\"0 0 340 240\" xmlns=\"http://www.w3.org/2000/svg\">\n          <circle cx=\"170\" cy=\"120\" r=\"100\" fill=\"rgba(65,185,210,0.12)\" />\n          <path d=\"M 60 120 C 110 80 150 70 210 100 C 230 110 260 115 280 118 C 255 122 225 126 195 130 C 130 150 90 140 60 120 Z\" fill=\"#143442\" stroke=\"rgba(130,225,240,0.7)\" stroke-width=\"1.3\"/>\n          <path d=\"M 280 118 C 290 115 295 110 290 105 C 285 110 275 114 265 116\" stroke=\"rgba(150,235,250,0.7)\" stroke-width=\"1.2\" fill=\"none\"/>\n          <path d=\"M 60 120 L 15 120\" stroke=\"rgba(120,210,230,0.6)\" stroke-width=\"1.2\"/>\n        </svg>\n        <div class=\"plate-annotations\">\n          <span><b>01.</b> Cephalic horn lobes</span>\n          <span><b>02.</b> Pectoral disc wing</span>\n          <span><b>03.</b> Gills & ventral filter</span>\n          <span><b>04.</b> Caudal whip tail</span>\n        </div>\n      </div>\n    ",
    "index": "06"
  },
  {
    "id": "pelagic-shark",
    "name": "Great white shark",
    "scientificName": "Carcharodon carcharias",
    "depth": "0–250 m",
    "depthTier": "epipelagic",
    "targetDepth": 95,
    "habitat": "Coastal shelves to Open epipelagic waters",
    "realSize": "4.0–6.1 m (13–20 ft); up to 2.2 metric tons",
    "classification": "CHONDRICHTHYES · LAMNIDAE",
    "photo": {
      "src": "/species/pelagic-shark.jpg",
      "caption": "Large great white shark cruising with hydrodynamic pectoral fins flared",
      "credit": "Pterantula (Terry Goss) at en.wikipedia",
      "license": "CC BY 2.5",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:White_shark.jpg"
    },
    "description": "Apex marine macropredator renowned for its countershaded slate-gray dorsal and snow-white belly. Armed with serrated triangular teeth and ampullae of Lorenzini electroreceptors that detect minute electrical impulses from muscle contractions of prey.",
    "detail": "Employs regional endothermy via counter-current vascular heat exchangers (rete mirabile) to maintain stomach and muscle temperatures up to 14°C warmer than surrounding seawater, enabling bursts of speed exceeding 40 km/h.",
    "source": {
      "title": "NOAA Fisheries · White Shark",
      "url": "https://www.fisheries.noaa.gov/species/white-shark",
      "publisher": "NOAA Fisheries · Office of Protected Resources",
      "accessedOn": "2026-09-25"
    },
    "annotations": [
      {
        "num": "01.",
        "label": "Conical snout & serrated teeth"
      },
      {
        "num": "02.",
        "label": "Five prominent gill slits"
      },
      {
        "num": "03.",
        "label": "High erect first dorsal fin"
      },
      {
        "num": "04.",
        "label": "Crescentic symmetrical tail fin"
      }
    ],
    "svg": "\n      <div class=\"specimen-plate\">\n        <div class=\"plate-badge\">CLASSIFICATION // CHONDRICHTHYES · LAMNIDAE</div>\n        <svg class=\"specimen-diagram\" viewBox=\"0 0 340 240\" xmlns=\"http://www.w3.org/2000/svg\">\n          <circle cx=\"170\" cy=\"120\" r=\"105\" fill=\"rgba(60,175,200,0.12)\" />\n          <path d=\"M 75 120 C 105 102 165 92 225 104 C 260 112 285 118 295 120 C 275 128 240 142 195 144 C 145 146 100 134 75 120 Z\" fill=\"#163745\" stroke=\"rgba(130,225,240,0.7)\" stroke-width=\"1.3\"/>\n          <path d=\"M 165 95 L 148 62 L 180 94 Z\" fill=\"#163745\" stroke=\"rgba(130,225,240,0.7)\" stroke-width=\"1\"/>\n          <path d=\"M 75 120 L 50 92 L 62 120 L 48 148 Z\" fill=\"#163745\" stroke=\"rgba(130,225,240,0.7)\" stroke-width=\"1.2\"/>\n          <path d=\"M 195 128 L 175 160 L 165 156 L 185 126 Z\" fill=\"#112933\" stroke=\"rgba(130,225,240,0.6)\" stroke-width=\"1\"/>\n          <circle cx=\"260\" cy=\"114\" r=\"2.5\" fill=\"#061218\" stroke=\"rgba(140,225,235,0.8)\" stroke-width=\"0.8\"/>\n        </svg>\n        <div class=\"plate-annotations\">\n          <span><b>01.</b> Conical snout</span>\n          <span><b>02.</b> Erect dorsal fin</span>\n          <span><b>03.</b> Crescentic tail</span>\n          <span><b>04.</b> Pectoral hydrofoil</span>\n        </div>\n      </div>\n    ",
    "index": "07"
  },
  {
    "id": "crown-jellyfish",
    "name": "Crown jellyfish",
    "scientificName": "Periphylla periphylla",
    "depth": "200–1,000 m",
    "depthTier": "mesopelagic",
    "targetDepth": 340,
    "habitat": "Twilight zone midwater · Mesopelagic",
    "realSize": "15–20 cm (6–8 in) bell diameter; 12 stiff tentacles",
    "classification": "SCYPHOZOA · CORONATAE · PERIPHYLLIDAE",
    "photo": {
      "src": "/species/crown-jellyfish.jpg",
      "caption": "Deep crimson helmet dome of Periphylla periphylla in dark waters",
      "credit": "Георгий Виноградов (Georgy Vinogradov)",
      "license": "CC BY 4.0",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Periphylla_periphylla_31611196.jpg"
    },
    "description": "Deep-water scyphozoan distinguished by a conical, heavily pigmented maroon dome and a deep coronal groove separating its bell from marginal lappets. Possesses 12 stiff tentacles pointed upward and outward to ambush sinking copepods.",
    "detail": "Its dark red pigmentation appears black under blue deep-ocean wavelengths, providing total optical camouflage. When attacked, it unleashes bright bioluminescent waves of light to startle predators.",
    "source": {
      "title": "World Register of Marine Species · Periphylla periphylla",
      "url": "https://www.marinespecies.org/aphia.php?p=taxdetails&id=135293",
      "publisher": "WoRMS · Flanders Marine Institute",
      "accessedOn": "2026-09-25"
    },
    "annotations": [
      {
        "num": "01.",
        "label": "Deep maroon conical coronal dome"
      },
      {
        "num": "02.",
        "label": "Coronal furrow ring groove"
      },
      {
        "num": "03.",
        "label": "Stiff upward marginal tentacles"
      },
      {
        "num": "04.",
        "label": "Bioluminescent marginal lappets"
      }
    ],
    "svg": "\n      <div class=\"specimen-plate\">\n        <div class=\"plate-badge\">CLASSIFICATION // SCYPHOZOA · CORONATAE</div>\n        <svg class=\"specimen-diagram\" viewBox=\"0 0 340 240\" xmlns=\"http://www.w3.org/2000/svg\">\n          <circle cx=\"170\" cy=\"120\" r=\"95\" fill=\"rgba(180,60,80,0.12)\" />\n          <path d=\"M 125 140 C 130 90 150 55 170 52 C 190 55 210 90 215 140 Q 170 155 125 140 Z\" fill=\"#4d1624\" stroke=\"rgba(235,110,135,0.7)\" stroke-width=\"1.4\"/>\n          <line x1=\"125\" y1=\"120\" x2=\"215\" y2=\"120\" stroke=\"rgba(255,140,165,0.4)\" stroke-width=\"1\"/>\n          <path d=\"M 130 142 Q 110 180 95 210 M 150 145 Q 140 185 135 215 M 190 145 Q 200 185 205 215 M 210 142 Q 230 180 245 210\" stroke=\"rgba(240,140,165,0.6)\" stroke-width=\"1.3\" fill=\"none\"/>\n        </svg>\n        <div class=\"plate-annotations\">\n          <span><b>01.</b> Maroon conical bell</span>\n          <span><b>02.</b> Coronal groove</span>\n          <span><b>03.</b> Stiff ambush tentacles</span>\n          <span><b>04.</b> Bioluminescent lappets</span>\n        </div>\n      </div>\n    ",
    "index": "08"
  },
  {
    "id": "comb-jelly",
    "name": "Beroe comb jelly",
    "scientificName": "Beroe cucumis",
    "depth": "200–1,000 m",
    "depthTier": "mesopelagic",
    "targetDepth": 400,
    "habitat": "Midwater twilight corridors · Mesopelagic",
    "realSize": "8–15 cm (3–6 in) sack length",
    "classification": "CTENOPHORA · NUDA · BEROIDAE",
    "photo": {
      "src": "/species/comb-jelly.jpg",
      "caption": "Beroe comb jelly with iridescent rainbow cilia fringes refracting light",
      "credit": "Ryan Hodnett",
      "license": "CC BY-SA 4.0",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Cigar_Comb_Jelly_(Beroe_sp.)_-_B%C3%A6rum,_Norway_2022-05-15.jpg"
    },
    "description": "Thimble- or melon-shaped predatory ctenophore devoid of tentacles. Propels itself using eight longitudinal meridian rows of fused macrocilia (ctenes) that refract light into vibrant, shimmering rainbow diffraction waves.",
    "detail": "Voracious apex predator among gelatinous zooplankton, possessing an expansive mouth that can engulf other ctenophores and siphonophores whole before sealing its lips shut like a zipper.",
    "source": {
      "title": "World Register of Marine Species · Beroe cucumis",
      "url": "https://www.marinespecies.org/aphia.php?p=taxdetails&id=106360",
      "publisher": "WoRMS · Flanders Marine Institute",
      "accessedOn": "2026-09-25"
    },
    "annotations": [
      {
        "num": "01.",
        "label": "Eight shimmering comb ctene rows"
      },
      {
        "num": "02.",
        "label": "Expansive predatory gullet mouth"
      },
      {
        "num": "03.",
        "label": "Internal branched canal network"
      },
      {
        "num": "04.",
        "label": "Aboral balance organ (statocyst)"
      }
    ],
    "svg": "\n      <div class=\"specimen-plate\">\n        <div class=\"plate-badge\">CLASSIFICATION // CTENOPHORA · BEROIDAE</div>\n        <svg class=\"specimen-diagram\" viewBox=\"0 0 340 240\" xmlns=\"http://www.w3.org/2000/svg\">\n          <circle cx=\"170\" cy=\"120\" r=\"95\" fill=\"rgba(90,210,210,0.12)\" />\n          <path d=\"M 130 170 C 115 120 135 60 170 58 C 205 60 225 120 210 170 Q 170 180 130 170 Z\" fill=\"rgba(30,80,95,0.3)\" stroke=\"rgba(140,240,245,0.7)\" stroke-width=\"1.3\"/>\n          <path d=\"M 145 68 C 135 110 138 145 142 168\" stroke=\"rgba(120,255,200,0.7)\" stroke-width=\"1.2\" stroke-dasharray=\"2 3\" fill=\"none\"/>\n          <path d=\"M 160 60 C 155 110 156 145 158 172\" stroke=\"rgba(140,225,255,0.7)\" stroke-width=\"1.2\" stroke-dasharray=\"2 3\" fill=\"none\"/>\n          <path d=\"M 180 60 C 185 110 184 145 182 172\" stroke=\"rgba(240,160,255,0.7)\" stroke-width=\"1.2\" stroke-dasharray=\"2 3\" fill=\"none\"/>\n          <path d=\"M 195 68 C 205 110 202 145 198 168\" stroke=\"rgba(255,200,120,0.7)\" stroke-width=\"1.2\" stroke-dasharray=\"2 3\" fill=\"none\"/>\n        </svg>\n        <div class=\"plate-annotations\">\n          <span><b>01.</b> Iridescent ctene rows</span>\n          <span><b>02.</b> Predatory oral gullet</span>\n          <span><b>03.</b> Branched canal system</span>\n          <span><b>04.</b> Aboral apical statocyst</span>\n        </div>\n      </div>\n    ",
    "index": "09"
  },
  {
    "id": "siphonophore",
    "name": "Giant siphonophore colony",
    "scientificName": "Marrus orthocanna",
    "depth": "300–1,000 m",
    "depthTier": "mesopelagic",
    "targetDepth": 460,
    "habitat": "Midwater twilight & Bathypelagic zones",
    "realSize": "1.5–3.0 m (5–10 ft) colonial stem length",
    "classification": "HYDROZOA · SIPHONOPHORAE · AGALMATIDAE",
    "photo": {
      "src": "/species/siphonophore.jpg",
      "caption": "Delicate colonial stem and swimming bells of Marrus orthocanna in midwater",
      "credit": "Kevin Raskoff, Monterey Peninsula College",
      "license": "Public domain",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Marrus_orthocanna.jpg"
    },
    "description": "Colonial hydrozoan functioning as a single integrated superorganism. Composed of specialized zooid units sharing a central stem: swimming bells (nectophores) propel the chain, while feeding polyps (gastrozooids) capture copepods and small fish.",
    "detail": "Some siphonophore species, such as Praya dubia and Apolemia, can extend up to 40 meters, rivaling and exceeding the blue whale as the longest animals in the world ocean.",
    "source": {
      "title": "MBARI · Marrus orthocanna",
      "url": "https://www.mbari.org/animal/marrus-orthocanna/",
      "publisher": "Monterey Bay Aquarium Research Institute",
      "accessedOn": "2026-09-25"
    },
    "annotations": [
      {
        "num": "01.",
        "label": "Pneumatophore gas float"
      },
      {
        "num": "02.",
        "label": "Bilateral swimming nectophores"
      },
      {
        "num": "03.",
        "label": "Colonial stem siphosome"
      },
      {
        "num": "04.",
        "label": "Stinging tentilla filaments"
      }
    ],
    "svg": "\n      <div class=\"specimen-plate\">\n        <div class=\"plate-badge\">CLASSIFICATION // HYDROZOA · SIPHONOPHORAE</div>\n        <svg class=\"specimen-diagram\" viewBox=\"0 0 340 240\" xmlns=\"http://www.w3.org/2000/svg\">\n          <circle cx=\"170\" cy=\"120\" r=\"95\" fill=\"rgba(80,180,210,0.12)\" />\n          <circle cx=\"170\" cy=\"45\" r=\"5\" fill=\"#f57d62\" stroke=\"rgba(255,200,180,0.8)\" stroke-width=\"1\"/>\n          <line x1=\"170\" y1=\"50\" x2=\"170\" y2=\"195\" stroke=\"rgba(160,235,245,0.7)\" stroke-width=\"1.4\"/>\n          <ellipse cx=\"160\" cy=\"65\" rx=\"8\" ry=\"4\" fill=\"rgba(120,210,230,0.4)\" stroke=\"rgba(160,235,245,0.6)\" stroke-width=\"0.8\"/>\n          <ellipse cx=\"180\" cy=\"65\" rx=\"8\" ry=\"4\" fill=\"rgba(120,210,230,0.4)\" stroke=\"rgba(160,235,245,0.6)\" stroke-width=\"0.8\"/>\n          <ellipse cx=\"160\" cy=\"80\" rx=\"8\" ry=\"4\" fill=\"rgba(120,210,230,0.4)\" stroke=\"rgba(160,235,245,0.6)\" stroke-width=\"0.8\"/>\n          <ellipse cx=\"180\" cy=\"80\" rx=\"8\" ry=\"4\" fill=\"rgba(120,210,230,0.4)\" stroke=\"rgba(160,235,245,0.6)\" stroke-width=\"0.8\"/>\n          <path d=\"M 170 100 Q 150 140 145 190 M 170 125 Q 185 160 190 205\" stroke=\"rgba(160,230,245,0.4)\" stroke-width=\"0.8\" fill=\"none\"/>\n        </svg>\n        <div class=\"plate-annotations\">\n          <span><b>01.</b> Pneumatophore float</span>\n          <span><b>02.</b> Swimming nectophores</span>\n          <span><b>03.</b> Central stem axis</span>\n          <span><b>04.</b> Gastrozooid tentilla</span>\n        </div>\n      </div>\n    ",
    "index": "10"
  },
  {
    "id": "lanternfish",
    "name": "Glacier lanternfish",
    "scientificName": "Benthosema glaciale",
    "depth": "300–1,000 m",
    "depthTier": "mesopelagic",
    "targetDepth": 620,
    "habitat": "Twilight zone & Diel vertical migration corridors",
    "realSize": "6–10 cm (2.4–4.0 in) total length",
    "classification": "ACTINOPTERYGII · MYCTOPHIDAE",
    "photo": {
      "src": "/species/lanternfish.jpg",
      "caption": "Fresh Benthosema glaciale specimen displaying glowing ventral photophore rows",
      "credit": "HulloThere",
      "license": "CC BY 4.0",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Fresh_Benthosema_glaciale.jpg"
    },
    "description": "Ubiquitous mesopelagic fish representing the single largest biomass of all deep-ocean vertebrates. Covered with species-specific arrangements of bioluminescent photophores on their belly that emit gentle green-blue light for counterillumination camouflage.",
    "detail": "Participates daily in the massive Earth-scale Diel Vertical Migration, ascending under cover of darkness to feast on epipelagic copepods before retreating to deep twilight sanctuaries before dawn.",
    "source": {
      "title": "FishBase · Benthosema glaciale",
      "url": "https://www.fishbase.se/summary/Benthosema-glaciale.html",
      "publisher": "FishBase · WorldFish Consortium",
      "accessedOn": "2026-09-25"
    },
    "annotations": [
      {
        "num": "01.",
        "label": "Large light-sensitive eye"
      },
      {
        "num": "02.",
        "label": "Ventral photophore organ rows"
      },
      {
        "num": "03.",
        "label": "Adipose fin behind dorsal fin"
      },
      {
        "num": "04.",
        "label": "Caudal bioluminescent luminous glands"
      }
    ],
    "svg": "\n      <div class=\"specimen-plate\">\n        <div class=\"plate-badge\">CLASSIFICATION // ACTINOPTERYGII · MYCTOPHIDAE</div>\n        <svg class=\"specimen-diagram\" viewBox=\"0 0 340 240\" xmlns=\"http://www.w3.org/2000/svg\">\n          <circle cx=\"170\" cy=\"120\" r=\"95\" fill=\"rgba(60,180,210,0.12)\" />\n          <path d=\"M 85 120 C 110 102 165 98 215 106 C 240 110 255 116 260 120 C 248 126 220 134 180 135 C 130 135 100 126 85 120 Z\" fill=\"#153b47\" stroke=\"rgba(130,225,240,0.6)\" stroke-width=\"1.3\"/>\n          <path d=\"M 85 120 L 62 104 L 70 120 L 62 136 Z\" fill=\"#112d36\" stroke=\"rgba(130,225,240,0.6)\" stroke-width=\"1\"/>\n          <circle cx=\"238\" cy=\"113\" r=\"6\" fill=\"#091c24\" stroke=\"rgba(140,230,240,0.8)\" stroke-width=\"1\"/>\n          <circle cx=\"238\" cy=\"113\" r=\"2.5\" fill=\"#4fe0e0\"/>\n          <!-- Photophore dots -->\n          <circle cx=\"130\" cy=\"133\" r=\"1.5\" fill=\"#82f5ff\"/>\n          <circle cx=\"145\" cy=\"134\" r=\"1.5\" fill=\"#82f5ff\"/>\n          <circle cx=\"160\" cy=\"134\" r=\"1.5\" fill=\"#82f5ff\"/>\n          <circle cx=\"175\" cy=\"133\" r=\"1.5\" fill=\"#82f5ff\"/>\n          <circle cx=\"190\" cy=\"132\" r=\"1.5\" fill=\"#82f5ff\"/>\n          <circle cx=\"205\" cy=\"130\" r=\"1.5\" fill=\"#82f5ff\"/>\n        </svg>\n        <div class=\"plate-annotations\">\n          <span><b>01.</b> Large twilight eye</span>\n          <span><b>02.</b> Ventral photophores</span>\n          <span><b>03.</b> Adipose fin</span>\n          <span><b>04.</b> Luminous caudal glands</span>\n        </div>\n      </div>\n    ",
    "index": "11"
  },
  {
    "id": "giant-octopus",
    "name": "Giant Pacific octopus",
    "scientificName": "Enteroctopus dofleini",
    "depth": "100–1,500 m",
    "depthTier": "mesopelagic",
    "targetDepth": 310,
    "habitat": "Cold temperate slopes & Bathyal reefs",
    "realSize": "3–5 m (10–16 ft) arm span; up to 50 kg",
    "classification": "CEPHALOPODA · OCTOPODA · ENTEROCTOPODIDAE",
    "photo": {
      "src": "/species/giant-octopus.jpg",
      "caption": "Giant Pacific octopus displaying rust-red mantle and suction-cupped arms",
      "credit": "NOAA/R. N. Lea [1]",
      "license": "Public domain",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Enteroctopus_dolfeini.jpg"
    },
    "description": "The largest and longest-lived octopus species in the world. Equipped with copper-rich blue hemocyanin blood and three hearts, it thrives in cold, oxygen-poor deep waters, utilizing its radical camouflage chromatophores and dextrous suckers to hunt crabs and clams.",
    "detail": "Contains roughly 500 million neurons, with two-thirds distributed throughout its arms, granting each limb semi-autonomous problem-solving and chemosensory tasting capability.",
    "source": {
      "title": "NOAA Fisheries · Giant Pacific Octopus",
      "url": "https://www.fisheries.noaa.gov/species/giant-pacific-octopus",
      "publisher": "NOAA Fisheries · Alaska Fisheries Science Center",
      "accessedOn": "2026-09-25"
    },
    "annotations": [
      {
        "num": "01.",
        "label": "Bulbous muscle mantle"
      },
      {
        "num": "02.",
        "label": "Lateral camera-type eyes"
      },
      {
        "num": "03.",
        "label": "Eight prehensile muscular arms"
      },
      {
        "num": "04.",
        "label": "Chemosensory suckers"
      }
    ],
    "svg": "\n      <div class=\"specimen-plate\">\n        <div class=\"plate-badge\">CLASSIFICATION // CEPHALOPODA · OCTOPODA</div>\n        <svg class=\"specimen-diagram\" viewBox=\"0 0 340 240\" xmlns=\"http://www.w3.org/2000/svg\">\n          <circle cx=\"170\" cy=\"120\" r=\"95\" fill=\"rgba(190,80,60,0.12)\" />\n          <path d=\"M 130 90 C 130 50 150 40 170 40 C 190 40 210 50 210 90 Q 170 100 130 90 Z\" fill=\"#6e251a\" stroke=\"rgba(240,120,95,0.7)\" stroke-width=\"1.3\"/>\n          <circle cx=\"150\" cy=\"92\" r=\"3.5\" fill=\"#140604\" stroke=\"rgba(240,120,95,0.7)\" stroke-width=\"0.8\"/>\n          <circle cx=\"190\" cy=\"92\" r=\"3.5\" fill=\"#140604\" stroke=\"rgba(240,120,95,0.7)\" stroke-width=\"0.8\"/>\n          <path d=\"M 140 100 C 110 130 80 160 70 200 M 150 100 C 130 140 110 170 105 210 M 165 100 C 160 140 150 175 145 215 M 175 100 C 180 140 190 175 195 215 M 190 100 C 210 140 230 170 235 210 M 200 100 C 230 130 260 160 270 200\" stroke=\"#8a3022\" stroke-width=\"3\" fill=\"none\" stroke-linecap=\"round\"/>\n        </svg>\n        <div class=\"plate-annotations\">\n          <span><b>01.</b> Muscular mantle</span>\n          <span><b>02.</b> Lateral eyes</span>\n          <span><b>03.</b> Eight suckered arms</span>\n          <span><b>04.</b> Chemo-tactile suction cups</span>\n        </div>\n      </div>\n    ",
    "index": "12"
  },
  {
    "id": "sperm-whale",
    "name": "Sperm whale",
    "scientificName": "Physeter macrocephalus",
    "depth": "400–2,000 m",
    "depthTier": "mesopelagic",
    "targetDepth": 520,
    "habitat": "Mesopelagic to Bathypelagic deep foraging zones",
    "realSize": "11–18 m (36–59 ft); up to 45–57 metric tons",
    "classification": "MAMMALIA · CETACEA · PHYSETERIDAE",
    "photo": {
      "src": "/species/sperm-whale.jpg",
      "caption": "Sperm whale mother and calf diving vertically into the abyss",
      "credit": "Gabriel Barathieu",
      "license": "CC BY-SA 2.0",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Mother_and_baby_sperm_whale.jpg"
    },
    "description": "The largest toothed predator on Earth, boasting a colossal blunt, squared head containing the spermaceti organ. Routinely embarks on breath-hold dives lasting over 90 minutes down to 2,000 meters to hunt giant and colossal squids.",
    "detail": "Generates the loudest acoustic clicks of any living animal (up to 230 dB underwater), used for echolocation scanning in pitch black and communication via rhythmic codas.",
    "source": {
      "title": "NOAA Fisheries · Sperm Whale",
      "url": "https://www.fisheries.noaa.gov/species/sperm-whale",
      "publisher": "NOAA Fisheries · Office of Protected Resources",
      "accessedOn": "2026-09-25"
    },
    "annotations": [
      {
        "num": "01.",
        "label": "Massive squared spermaceti organ head"
      },
      {
        "num": "02.",
        "label": "Narrow underslung toothed jaw"
      },
      {
        "num": "03.",
        "label": "Low dorsal hump & crenulated spinal ridge"
      },
      {
        "num": "04.",
        "label": "Broad triangular caudal flukes"
      }
    ],
    "svg": "\n      <div class=\"specimen-plate\">\n        <div class=\"plate-badge\">CLASSIFICATION // MAMMALIA · PHYSETERIDAE</div>\n        <svg class=\"specimen-diagram\" viewBox=\"0 0 340 240\" xmlns=\"http://www.w3.org/2000/svg\">\n          <circle cx=\"170\" cy=\"120\" r=\"105\" fill=\"rgba(65,130,160,0.12)\" />\n          <path d=\"M 70 120 C 100 106 140 100 200 98 L 290 98 L 295 128 C 285 132 250 134 235 133 C 215 142 160 142 120 134 C 95 128 75 122 70 120 Z\" fill=\"#18303d\" stroke=\"rgba(130,225,240,0.6)\" stroke-width=\"1.3\"/>\n          <path d=\"M 235 133 L 285 131\" stroke=\"rgba(190,240,250,0.7)\" stroke-width=\"1.2\"/>\n          <path d=\"M 70 120 L 45 98 L 55 120 L 45 142 Z\" fill=\"#132732\" stroke=\"rgba(130,225,240,0.6)\" stroke-width=\"1\"/>\n          <circle cx=\"230\" cy=\"128\" r=\"2\" fill=\"#061014\" stroke=\"rgba(140,225,235,0.7)\" stroke-width=\"0.8\"/>\n        </svg>\n        <div class=\"plate-annotations\">\n          <span><b>01.</b> Spermaceti barrel forehead</span>\n          <span><b>02.</b> Underslung lower jaw</span>\n          <span><b>03.</b> Spinal dorsal ridges</span>\n          <span><b>04.</b> Deep-notched flukes</span>\n        </div>\n      </div>\n    ",
    "index": "13"
  },
  {
    "id": "dumbo-octopus",
    "name": "Dumbo octopus",
    "scientificName": "Grimpoteuthis sp.",
    "depth": "400–4,000 m",
    "depthTier": "mesopelagic",
    "targetDepth": 660,
    "habitat": "Twilight to Bathypelagic & Abyssal benthos",
    "realSize": "20–30 cm (8–12 in) mantle length",
    "classification": "CEPHALOPODA · OCTOPODA · CIRRATA · OPISTHOTEUTHIDAE",
    "photo": {
      "src": "/species/dumbo-octopus.jpg",
      "caption": "Dumbo octopus hovering gently above deep seafloor sediments",
      "credit": "Renaud.marbet",
      "license": "CC BY-SA 4.0",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Grimpoteuthis_2108m.jpg"
    },
    "description": "Cirrate deep-sea octopus distinguished by prominent ear-like fins extending from its mantle, flapping rhythmically for gentle propulsion. Unlike shallow octopuses, it lacks an ink sac, having no use for ink in the lightless deep sea.",
    "detail": "Its arms are united by an umbrella-like web of skin fringed with finger-like sensory cirri that detect vibrations from swimming copepods and isopods in deep currents.",
    "source": {
      "title": "NOAA Ocean Exploration · Dumbo Octopus",
      "url": "https://oceanexplorer.noaa.gov/okeanos/explorations/ex1402/logs/may3/may3.html",
      "publisher": "NOAA Ocean Exploration · Benthic Biology",
      "accessedOn": "2026-09-25"
    },
    "annotations": [
      {
        "num": "01.",
        "label": "Flapping ear-like steering fins"
      },
      {
        "num": "02.",
        "label": "Translucent dome-shaped mantle"
      },
      {
        "num": "03.",
        "label": "Large deep-sea dark eyes"
      },
      {
        "num": "04.",
        "label": "Interbrachial webbed skirt & cirri"
      }
    ],
    "svg": "\n      <div class=\"specimen-plate\">\n        <div class=\"plate-badge\">CLASSIFICATION // CEPHALOPODA · CIRRATA</div>\n        <svg class=\"specimen-diagram\" viewBox=\"0 0 340 240\" xmlns=\"http://www.w3.org/2000/svg\">\n          <circle cx=\"170\" cy=\"120\" r=\"95\" fill=\"rgba(240,160,180,0.12)\" />\n          <path d=\"M 140 100 C 135 60 150 45 170 45 C 190 45 205 60 200 100 Q 170 115 140 100 Z\" fill=\"#6d3246\" stroke=\"rgba(240,150,180,0.7)\" stroke-width=\"1.3\"/>\n          <ellipse cx=\"130\" cy=\"70\" rx=\"14\" ry=\"7\" transform=\"rotate(-25 130 70)\" fill=\"#8c3e5a\" stroke=\"rgba(245,170,200,0.6)\" stroke-width=\"1\"/>\n          <ellipse cx=\"210\" cy=\"70\" rx=\"14\" ry=\"7\" transform=\"rotate(25 210 70)\" fill=\"#8c3e5a\" stroke=\"rgba(245,170,200,0.6)\" stroke-width=\"1\"/>\n          <circle cx=\"152\" cy=\"98\" r=\"4.5\" fill=\"#14080e\" stroke=\"rgba(240,160,190,0.7)\" stroke-width=\"0.8\"/>\n          <circle cx=\"188\" cy=\"98\" r=\"4.5\" fill=\"#14080e\" stroke=\"rgba(240,160,190,0.7)\" stroke-width=\"0.8\"/>\n          <path d=\"M 135 105 Q 120 150 110 180 Q 170 170 230 180 Q 220 150 205 105 Z\" fill=\"#522434\" stroke=\"rgba(240,150,180,0.6)\" stroke-width=\"1.2\"/>\n        </svg>\n        <div class=\"plate-annotations\">\n          <span><b>01.</b> Ear-like swimming fins</span>\n          <span><b>02.</b> Soft rounded mantle</span>\n          <span><b>03.</b> Deep-adapted eyes</span>\n          <span><b>04.</b> Webbed umbrella skirt</span>\n        </div>\n      </div>\n    ",
    "index": "14"
  },
  {
    "id": "vampire-squid",
    "name": "Vampire squid",
    "scientificName": "Vampyroteuthis infernalis",
    "depth": "600–900 m",
    "depthTier": "mesopelagic",
    "targetDepth": 650,
    "habitat": "Midwater · Twilight zone oxygen minimum layer",
    "realSize": "28–30 cm (11–12 in) total length",
    "classification": "CEPHALOPODA · VAMPYROMORPHA",
    "photo": {
      "src": "/species/vampire-squid.jpg",
      "caption": "Vampire squid model, Natural History Museum, London",
      "credit": "Emőke Dénes",
      "license": "CC BY-SA 4.0",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Pu_-_Vampyroteuthis_infernalis_-_2.jpg"
    },
    "description": "A deep-water cephalopod that gathers falling organic material called marine snow with two long retractile feeding filaments. Despite its predatory name, it is a gentle detritivore uniquely adapted to oxygen minimum zones.",
    "detail": "Its arm tips can emit glowing blue bioluminescent clouds when startled to deter predators. The side-view illustration is enlarged for visibility and is not to scale.",
    "source": {
      "title": "MBARI · Vampire squid",
      "url": "https://www.mbari.org/animal/vampire-squid/",
      "publisher": "Monterey Bay Aquarium Research Institute",
      "accessedOn": "2026-09-25"
    },
    "annotations": [
      {
        "num": "01.",
        "label": "Apical swimming fins"
      },
      {
        "num": "02.",
        "label": "Lucid sapphire eye"
      },
      {
        "num": "03.",
        "label": "Bioluminescent photophores"
      },
      {
        "num": "04.",
        "label": "Sensory feeding filaments"
      }
    ],
    "svg": "\n      <div class=\"specimen-plate\">\n        <div class=\"plate-badge\">CLASSIFICATION // CEPHALOPODA · VAMPYROMORPHA</div>\n        <svg class=\"specimen-diagram\" viewBox=\"0 0 340 240\" xmlns=\"http://www.w3.org/2000/svg\">\n          <circle cx=\"170\" cy=\"120\" r=\"100\" fill=\"rgba(80,180,205,0.18)\" />\n          <path d=\"M 140 130 C 100 160 80 190 60 220\" stroke=\"rgba(195,245,255,0.4)\" stroke-width=\"1.2\" fill=\"none\" stroke-dasharray=\"3 3\"/>\n          <path d=\"M 200 130 C 240 160 260 190 280 220\" stroke=\"rgba(195,245,255,0.4)\" stroke-width=\"1.2\" fill=\"none\" stroke-dasharray=\"3 3\"/>\n          <path d=\"M 145 105 C 120 120 100 160 115 195 Q 140 180 152 205 Q 162 188 170 208 Q 178 188 188 205 Q 200 180 225 195 C 240 160 220 120 195 105 Z\" fill=\"#3b1625\" stroke=\"rgba(215,115,160,0.6)\" stroke-width=\"1.5\"/>\n          <circle cx=\"115\" cy=\"195\" r=\"3\" fill=\"#82f5ff\" />\n          <circle cx=\"152\" cy=\"205\" r=\"3\" fill=\"#82f5ff\" />\n          <circle cx=\"170\" cy=\"208\" r=\"3\" fill=\"#82f5ff\" />\n          <circle cx=\"188\" cy=\"205\" r=\"3\" fill=\"#82f5ff\" />\n          <circle cx=\"225\" cy=\"195\" r=\"3\" fill=\"#82f5ff\" />\n          <path d=\"M 140 110 C 138 70 155 35 170 32 C 185 35 202 70 200 110 Q 170 130 140 110 Z\" fill=\"#722b49\" stroke=\"rgba(215,115,160,0.6)\" stroke-width=\"1.5\"/>\n          <ellipse cx=\"132\" cy=\"65\" rx=\"22\" ry=\"9\" transform=\"rotate(-25 132 65)\" fill=\"#8d3b5d\" stroke=\"rgba(228,135,178,0.6)\" stroke-width=\"1.2\"/>\n          <ellipse cx=\"208\" cy=\"65\" rx=\"22\" ry=\"9\" transform=\"rotate(25 208 65)\" fill=\"#8d3b5d\" stroke=\"rgba(228,135,178,0.6)\" stroke-width=\"1.2\"/>\n          <circle cx=\"154\" cy=\"105\" r=\"7\" fill=\"#1b4d58\" stroke=\"#48b8c2\" stroke-width=\"1.2\"/>\n          <circle cx=\"186\" cy=\"105\" r=\"7\" fill=\"#1b4d58\" stroke=\"#48b8c2\" stroke-width=\"1.2\"/>\n        </svg>\n        <div class=\"plate-annotations\">\n          <span><b>01.</b> Apical swimming fins</span>\n          <span><b>02.</b> Lucid sapphire eye</span>\n          <span><b>03.</b> Bioluminescent photophores</span>\n          <span><b>04.</b> Sensory feeding filaments</span>\n        </div>\n      </div>\n    ",
    "index": "15"
  },
  {
    "id": "phantom-jelly",
    "name": "Giant phantom jelly",
    "scientificName": "Stygiomedusa gigantea",
    "depth": "750–2,000 m",
    "depthTier": "bathypelagic",
    "targetDepth": 880,
    "habitat": "Bathypelagic midnight abyss",
    "realSize": "1 m (3.3 ft) bell diameter; oral ribbon arms up to 10 m (33 ft)",
    "classification": "SCYPHOZOA · SEMAEOSTOMEAE · ULMARIDAE",
    "photo": {
      "src": "/species/phantom-jelly.jpg",
      "caption": "Giant phantom jelly (Stygiomedusa gigantea) observed in deep water off Antarctica",
      "credit": "MasterfulNerd / Viking Expeditions",
      "license": "CC BY 4.0",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Phantom_Jellyfish_Off_of_the_Melchior_Islands.webm"
    },
    "description": "Colossal deep-sea scyphozoan and one of the largest invertebrate predators in the midnight zone. Possesses a dark velvety umber bell and four ribbon-like oral arms that stream up to 10 meters behind it to ensnare fish and crustaceans.",
    "detail": "Lacks stinging tentacles on its bell margin entirely, relying instead on its massive, fluttering oral sheets to entangle and transport prey directly into its gastrovascular cavity.",
    "source": {
      "title": "MBARI · Giant Phantom Jelly",
      "url": "https://www.mbari.org/animal/giant-phantom-jelly/",
      "publisher": "Monterey Bay Aquarium Research Institute",
      "accessedOn": "2026-09-25"
    },
    "annotations": [
      {
        "num": "01.",
        "label": "Velvety dark umber umbrella bell"
      },
      {
        "num": "02.",
        "label": "Elongated ribbon-like oral arms"
      },
      {
        "num": "03.",
        "label": "Central gastrovascular cavity"
      },
      {
        "num": "04.",
        "label": "Hydrodynamic pulsation margin"
      }
    ],
    "svg": "\n      <div class=\"specimen-plate\">\n        <div class=\"plate-badge\">CLASSIFICATION // SCYPHOZOA · ULMARIDAE</div>\n        <svg class=\"specimen-diagram\" viewBox=\"0 0 340 240\" xmlns=\"http://www.w3.org/2000/svg\">\n          <circle cx=\"170\" cy=\"120\" r=\"95\" fill=\"rgba(80,30,40,0.18)\" />\n          <path d=\"M 115 110 C 115 65 140 45 170 45 C 200 45 225 65 225 110 Q 170 125 115 110 Z\" fill=\"#2d1319\" stroke=\"rgba(200,90,110,0.7)\" stroke-width=\"1.3\"/>\n          <path d=\"M 140 115 Q 120 150 135 180 Q 125 200 130 220\" stroke=\"#4a1e27\" stroke-width=\"3\" fill=\"none\"/>\n          <path d=\"M 160 118 Q 150 155 165 185 Q 155 205 160 225\" stroke=\"#4a1e27\" stroke-width=\"3.5\" fill=\"none\"/>\n          <path d=\"M 180 118 Q 190 155 175 185 Q 185 205 180 225\" stroke=\"#4a1e27\" stroke-width=\"3.5\" fill=\"none\"/>\n          <path d=\"M 200 115 Q 220 150 205 180 Q 215 200 210 220\" stroke=\"#4a1e27\" stroke-width=\"3\" fill=\"none\"/>\n        </svg>\n        <div class=\"plate-annotations\">\n          <span><b>01.</b> Velvety umber bell</span>\n          <span><b>02.</b> 10-meter oral arms</span>\n          <span><b>03.</b> Gastric cavity</span>\n          <span><b>04.</b> Pulsation margin</span>\n        </div>\n      </div>\n    ",
    "index": "16"
  },
  {
    "id": "anglerfish",
    "name": "Humpback anglerfish",
    "scientificName": "Melanocetus johnsonii",
    "depth": "800–2,000 m",
    "depthTier": "bathypelagic",
    "targetDepth": 920,
    "habitat": "Bathypelagic midnight zone abyss",
    "realSize": "Females up to 18 cm (7 in); males 2.9 cm (1.1 in)",
    "classification": "ACTINOPTERYGII · LOPHIIFORMES · MELANOCETIDAE",
    "photo": {
      "src": "/species/anglerfish.jpg",
      "caption": "Humpback anglerfish showing sharp recurved teeth and bioluminescent lure",
      "credit": "Personnel of NOAA Ship DELAWARE II",
      "license": "Public domain",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Melanocetus_johnsonii_by_NOAA.jpg"
    },
    "description": "Iconic deep-sea anglerfish renowned for extreme sexual dimorphism. The globular, pitch-black female features a cavernous mouth lined with sharp, translucent teeth and a modified dorsal spine (illicium) tipped with a bioluminescent bacterial bulb (esca).",
    "detail": "Its immense expandable stomach allows it to swallow prey up to twice its own body size, an essential survival trait in the ultra-sparse food desert of the midnight zone.",
    "source": {
      "title": "Australian Museum · Humpback Anglerfish",
      "url": "https://australian.museum/learn/animals/fishes/humpback-anglerfish-melanocetus-johnsonii/",
      "publisher": "Australian Museum · Ichthyology Collection",
      "accessedOn": "2026-09-25"
    },
    "annotations": [
      {
        "num": "01.",
        "label": "Modified dorsal lure spine (illicium)"
      },
      {
        "num": "02.",
        "label": "Symbiotic bioluminescent bulb (esca)"
      },
      {
        "num": "03.",
        "label": "Inwardly hinged sharp teeth"
      },
      {
        "num": "04.",
        "label": "Highly distensible expandable stomach"
      }
    ],
    "svg": "\n      <div class=\"specimen-plate\">\n        <div class=\"plate-badge\">CLASSIFICATION // ACTINOPTERYGII · MELANOCETIDAE</div>\n        <svg class=\"specimen-diagram\" viewBox=\"0 0 340 240\" xmlns=\"http://www.w3.org/2000/svg\">\n          <circle cx=\"170\" cy=\"120\" r=\"95\" fill=\"rgba(80,180,210,0.12)\" />\n          <!-- Illicium & Esca -->\n          <path d=\"M 215 105 Q 225 65 195 55\" stroke=\"rgba(140,225,240,0.7)\" stroke-width=\"1.3\" fill=\"none\"/>\n          <circle cx=\"195\" cy=\"55\" r=\"4.5\" fill=\"#7bf3ff\" stroke=\"#ffffff\" stroke-width=\"0.8\"/>\n          <!-- Body -->\n          <path d=\"M 120 120 C 120 85 170 80 220 95 C 255 110 260 145 220 160 C 160 170 120 150 120 120 Z\" fill=\"#0d1b22\" stroke=\"rgba(130,225,240,0.6)\" stroke-width=\"1.3\"/>\n          <!-- Tail -->\n          <path d=\"M 120 120 L 95 105 L 105 120 L 95 135 Z\" fill=\"#0d1b22\" stroke=\"rgba(130,225,240,0.6)\" stroke-width=\"1\"/>\n          <!-- Teeth -->\n          <path d=\"M 230 115 L 235 125 L 240 115 L 245 125 L 250 116\" stroke=\"rgba(215,245,255,0.8)\" stroke-width=\"1.2\" fill=\"none\"/>\n          <circle cx=\"218\" cy=\"110\" r=\"2.5\" fill=\"#040b0e\" stroke=\"rgba(140,225,235,0.7)\" stroke-width=\"0.8\"/>\n        </svg>\n        <div class=\"plate-annotations\">\n          <span><b>01.</b> Illicium lure spine</span>\n          <span><b>02.</b> Bioluminescent esca bulb</span>\n          <span><b>03.</b> Recurved needle teeth</span>\n          <span><b>04.</b> Distensible stomach</span>\n        </div>\n      </div>\n    ",
    "index": "17"
  },
  {
    "id": "sixgill-shark",
    "name": "Bluntnose sixgill shark",
    "scientificName": "Hexanchus griseus",
    "depth": "200–2,500 m",
    "depthTier": "bathypelagic",
    "targetDepth": 980,
    "habitat": "Continental slopes & Deep abyssal drop-offs",
    "realSize": "3.5–4.8 m (11.5–16.0 ft); up to 600 kg",
    "classification": "CHONDRICHTHYES · HEXANCHIDAE",
    "photo": {
      "src": "/species/sixgill-shark.jpg",
      "caption": "Bluntnose sixgill shark photographed during NOAA Operation Deep Scope expedition",
      "credit": "Operation Deep Scope 2005 Expedition: NOAA Office of Ocean Exploration; Harbor Branch Oceanographic Institution",
      "license": "Public domain",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Hexanchus_griseus.jpg"
    },
    "description": "Primitive deep-sea shark whose lineage dates back over 200 million years to the Jurassic period. Unlike modern sharks with five gill slits, it retains six pairs of elongated gill slits and a single dorsal fin set far back near its caudal peduncle.",
    "detail": "Features striking fluorescent emerald-green eyes equipped with a highly reflective tapetum lucidum that amplifies sparse bioluminescence on deep continental shelves.",
    "source": {
      "title": "Florida Museum · Bluntnose Sixgill Shark",
      "url": "https://www.floridamuseum.ufl.edu/discover-fish/species-profiles/hexanchus-griseus/",
      "publisher": "Florida Museum of Natural History · Ichthyology",
      "accessedOn": "2026-09-25"
    },
    "annotations": [
      {
        "num": "01.",
        "label": "Broad blunt rounded snout"
      },
      {
        "num": "02.",
        "label": "Six distinct lateral gill slits"
      },
      {
        "num": "03.",
        "label": "Single posteriorly placed dorsal fin"
      },
      {
        "num": "04.",
        "label": "Elongated upper caudal fin lobe"
      }
    ],
    "svg": "\n      <div class=\"specimen-plate\">\n        <div class=\"plate-badge\">CLASSIFICATION // CHONDRICHTHYES · HEXANCHIDAE</div>\n        <svg class=\"specimen-diagram\" viewBox=\"0 0 340 240\" xmlns=\"http://www.w3.org/2000/svg\">\n          <circle cx=\"170\" cy=\"120\" r=\"105\" fill=\"rgba(60,180,200,0.12)\" />\n          <path d=\"M 65 120 C 100 106 160 100 220 106 C 260 110 285 116 295 120 C 275 126 240 138 190 138 C 130 138 90 128 65 120 Z\" fill=\"#132a35\" stroke=\"rgba(130,225,240,0.6)\" stroke-width=\"1.3\"/>\n          <path d=\"M 125 106 L 115 88 L 135 106 Z\" fill=\"#132a35\" stroke=\"rgba(130,225,240,0.5)\" stroke-width=\"1\"/>\n          <path d=\"M 65 120 L 35 90 L 52 120 L 45 138 Z\" fill=\"#132a35\" stroke=\"rgba(130,225,240,0.6)\" stroke-width=\"1\"/>\n          <!-- 6 Gill slits -->\n          <line x1=\"205\" y1=\"114\" x2=\"204\" y2=\"128\" stroke=\"rgba(140,225,240,0.6)\" stroke-width=\"0.9\"/>\n          <line x1=\"209\" y1=\"114\" x2=\"208\" y2=\"128\" stroke=\"rgba(140,225,240,0.6)\" stroke-width=\"0.9\"/>\n          <line x1=\"213\" y1=\"114\" x2=\"212\" y2=\"128\" stroke=\"rgba(140,225,240,0.6)\" stroke-width=\"0.9\"/>\n          <line x1=\"217\" y1=\"114\" x2=\"216\" y2=\"128\" stroke=\"rgba(140,225,240,0.6)\" stroke-width=\"0.9\"/>\n          <line x1=\"221\" y1=\"114\" x2=\"220\" y2=\"128\" stroke=\"rgba(140,225,240,0.6)\" stroke-width=\"0.9\"/>\n          <line x1=\"225\" y1=\"114\" x2=\"224\" y2=\"128\" stroke=\"rgba(140,225,240,0.6)\" stroke-width=\"0.9\"/>\n          <circle cx=\"265\" cy=\"115\" r=\"3\" fill=\"#14e38c\" stroke=\"#ffffff\" stroke-width=\"0.6\"/>\n        </svg>\n        <div class=\"plate-annotations\">\n          <span><b>01.</b> Blunt rounded snout</span>\n          <span><b>02.</b> Six archaic gill slits</span>\n          <span><b>03.</b> Rear single dorsal fin</span>\n          <span><b>04.</b> Emerald reflective eye</span>\n        </div>\n      </div>\n    ",
    "index": "18"
  },
  {
    "id": "barreleye-fish",
    "name": "Barreleye fish",
    "scientificName": "Macropinna microstoma",
    "depth": "600–1,200 m",
    "depthTier": "bathypelagic",
    "targetDepth": 1050,
    "habitat": "Mesopelagic to Bathypelagic boundary · Midwater",
    "realSize": "15 cm (6 in) total length",
    "classification": "ACTINOPTERYGII · ARGENTINIFORMES · OPISTHOPROCTIDAE",
    "photo": {
      "src": "/species/barreleye-fish.jpg",
      "caption": "Barreleye specimen showing transparent fluid-filled head dome and green tubular eyes",
      "credit": "MBARI / Kim Reisenbichler",
      "license": "CC BY-NC 4.0 / Educational Fair Use",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Barreleye-fish_GoK.jpg"
    },
    "description": "Famous for its completely transparent fluid-filled head dome shield, through which its tubular emerald-green eyes can rotate upward to scan for silhouette shadows of prey against surface downwelling light, or pivot forward when feeding.",
    "detail": "Its green eye lenses filter out sunlight, highlighting the bioluminescent glow of siphonophores from which it steals trapped copepods. Illustrated enlarged for visibility.",
    "source": {
      "title": "MBARI · Barreleye Fish",
      "url": "https://www.mbari.org/animal/barreleye/",
      "publisher": "Monterey Bay Aquarium Research Institute",
      "accessedOn": "2026-09-25"
    },
    "annotations": [
      {
        "num": "01.",
        "label": "Transparent fluid-filled cranial dome"
      },
      {
        "num": "02.",
        "label": "Rotating tubular green eyes"
      },
      {
        "num": "03.",
        "label": "Broad flat pectoral fins"
      },
      {
        "num": "04.",
        "label": "Small terminal mouth & nares"
      }
    ],
    "svg": "\n      <div class=\"specimen-plate\">\n        <div class=\"plate-badge\">CLASSIFICATION // ACTINOPTERYGII · OPISTHOPROCTIDAE</div>\n        <svg class=\"specimen-diagram\" viewBox=\"0 0 340 240\" xmlns=\"http://www.w3.org/2000/svg\">\n          <circle cx=\"170\" cy=\"120\" r=\"100\" fill=\"rgba(80,185,210,0.18)\" />\n          <path d=\"M 60 120 L 35 105 L 42 120 L 35 135 Z\" fill=\"#143644\" stroke=\"rgba(130,225,240,0.6)\" stroke-width=\"1\"/>\n          <path d=\"M 60 120 C 85 110 135 106 185 106 C 220 106 245 112 255 124 C 248 132 220 142 185 142 C 135 142 85 130 60 120 Z\" fill=\"#10252e\" stroke=\"rgba(130,225,240,0.6)\" stroke-width=\"1.3\"/>\n          <!-- Transparent Cranial Shield -->\n          <path d=\"M 180 106 C 185 85 210 75 240 76 C 265 77 280 95 275 124 C 265 130 250 128 240 124 Z\" fill=\"rgba(60,180,195,0.22)\" stroke=\"rgba(130,240,240,0.8)\" stroke-width=\"1.3\"/>\n          <ellipse cx=\"212\" cy=\"98\" rx=\"10\" ry=\"13\" fill=\"#04261a\" stroke=\"#18e690\" stroke-width=\"1.5\"/>\n          <ellipse cx=\"236\" cy=\"99\" rx=\"9\" ry=\"12\" fill=\"#04261a\" stroke=\"#18e690\" stroke-width=\"1.5\"/>\n        </svg>\n        <div class=\"plate-annotations\">\n          <span><b>01.</b> Fluid-filled cranial dome</span>\n          <span><b>02.</b> Emerald tubular eyes</span>\n          <span><b>03.</b> Stabilizing pectoral fins</span>\n          <span><b>04.</b> Terminal mouth & nares</span>\n        </div>\n      </div>\n    ",
    "index": "19"
  },
  {
    "id": "black-swallower",
    "name": "Black swallower",
    "scientificName": "Chiasmodon niger",
    "depth": "700–2,700 m",
    "depthTier": "bathypelagic",
    "targetDepth": 1450,
    "habitat": "Bathypelagic midnight zone",
    "realSize": "15–25 cm (6–10 in) total length",
    "classification": "ACTINOPTERYGII · CHIASMODONTIDAE",
    "photo": {
      "src": "/species/black-swallower.jpg",
      "caption": "Black swallower specimen showing distended translucent stomach pouch",
      "credit": "Wikimedia Commons contributor",
      "license": "Public domain",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Chiasmodon_niger.jpg"
    },
    "description": "Formidable deep-sea hunter famous for its ability to swallow bony fishes up to ten times its own mass and twice its length. Equipped with an immensely distensible stomach that expands into a translucent balloon below its body.",
    "detail": "Its lower jaw is hinged to swing down and forward, while sharp recurved teeth interlock to prevent struggling prey from escaping as it is worked down the esophagus.",
    "source": {
      "title": "FishBase · Chiasmodon niger",
      "url": "https://www.fishbase.se/summary/Chiasmodon-niger.html",
      "publisher": "FishBase · WorldFish Consortium",
      "accessedOn": "2026-09-25"
    },
    "annotations": [
      {
        "num": "01.",
        "label": "Deeply cleft predatory jaw"
      },
      {
        "num": "02.",
        "label": "Recurved palatine fangs"
      },
      {
        "num": "03.",
        "label": "Enormously distensible stomach pouch"
      },
      {
        "num": "04.",
        "label": "Slender caudal peduncle"
      }
    ],
    "svg": "\n      <div class=\"specimen-plate\">\n        <div class=\"plate-badge\">CLASSIFICATION // ACTINOPTERYGII · CHIASMODONTIDAE</div>\n        <svg class=\"specimen-diagram\" viewBox=\"0 0 340 240\" xmlns=\"http://www.w3.org/2000/svg\">\n          <circle cx=\"170\" cy=\"120\" r=\"95\" fill=\"rgba(70,180,210,0.12)\" />\n          <path d=\"M 85 110 C 120 102 170 100 220 104 C 255 108 275 114 280 118 C 265 125 240 130 200 130 C 150 130 110 120 85 110 Z\" fill=\"#132731\" stroke=\"rgba(130,225,240,0.6)\" stroke-width=\"1.3\"/>\n          <!-- Distended pouch -->\n          <path d=\"M 160 130 C 150 165 180 185 210 180 C 230 175 235 150 225 130 Z\" fill=\"rgba(25,50,60,0.7)\" stroke=\"rgba(130,225,240,0.5)\" stroke-width=\"1.2\"/>\n          <path d=\"M 85 110 L 60 98 L 68 110 L 60 122 Z\" fill=\"#132731\" stroke=\"rgba(130,225,240,0.6)\" stroke-width=\"1\"/>\n          <circle cx=\"260\" cy=\"112\" r=\"2.5\" fill=\"#061218\" stroke=\"rgba(140,225,235,0.7)\" stroke-width=\"0.8\"/>\n        </svg>\n        <div class=\"plate-annotations\">\n          <span><b>01.</b> Deeply cleft jaw</span>\n          <span><b>02.</b> Recurved needle fangs</span>\n          <span><b>03.</b> Expandable stomach pouch</span>\n          <span><b>04.</b> Caudal peduncle</span>\n        </div>\n      </div>\n    ",
    "index": "20"
  },
  {
    "id": "giant-squid",
    "name": "Giant squid",
    "scientificName": "Architeuthis dux",
    "depth": "300–1,500 m",
    "depthTier": "bathypelagic",
    "targetDepth": 1550,
    "habitat": "Bathypelagic slopes & Deep oceanic trenches",
    "realSize": "Females up to 12–13 m (39–43 ft); up to 275 kg",
    "classification": "CEPHALOPODA · ARCHITEUTHIDAE",
    "photo": {
      "src": "/species/giant-squid.jpg",
      "caption": "Historic specimen of Architeuthis dux documenting massive mantle and feeding tentacles",
      "credit": "Inger E Winkelmann",
      "license": "CC BY-SA 4.0",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Giant_squid_Architeuthis_dux_Steenstrup_1857_holotype_specimen.jpg"
    },
    "description": "Legendary deep-ocean cephalopod featuring dinner-plate eyes up to 27 cm in diameter—the largest eyes in the animal kingdom. Armed with eight arms lined with sharp-toothed suckers and two elongated feeding tentacles that shoot forward to snare prey.",
    "detail": "Its immense eyes detect the faint silhouettes of foraging sperm whales at ranges exceeding 120 meters by registering the bioluminescent disruption of micro-organisms triggered by the whale’s wake.",
    "source": {
      "title": "Smithsonian Ocean · Giant Squid",
      "url": "https://ocean.si.edu/ocean-life/invertebrates/giant-squid",
      "publisher": "Smithsonian National Museum of Natural History",
      "accessedOn": "2026-09-25"
    },
    "annotations": [
      {
        "num": "01.",
        "label": "Massive muscular torpedo mantle"
      },
      {
        "num": "02.",
        "label": "Record 27-cm diameter visual eye"
      },
      {
        "num": "03.",
        "label": "Eight robust toothed sucker arms"
      },
      {
        "num": "04.",
        "label": "Two long prehensile feeding tentacle clubs"
      }
    ],
    "svg": "\n      <div class=\"specimen-plate\">\n        <div class=\"plate-badge\">CLASSIFICATION // CEPHALOPODA · ARCHITEUTHIDAE</div>\n        <svg class=\"specimen-diagram\" viewBox=\"0 0 340 240\" xmlns=\"http://www.w3.org/2000/svg\">\n          <circle cx=\"170\" cy=\"120\" r=\"105\" fill=\"rgba(180,60,60,0.12)\" />\n          <!-- Mantle & Fins -->\n          <path d=\"M 60 120 L 40 105 L 55 120 L 40 135 Z\" fill=\"#6d2522\" stroke=\"rgba(240,130,120,0.7)\" stroke-width=\"1.2\"/>\n          <path d=\"M 60 120 C 85 106 140 102 185 108 C 205 112 215 116 220 120 C 215 124 205 128 185 132 C 140 138 85 134 60 120 Z\" fill=\"#541b18\" stroke=\"rgba(240,130,120,0.7)\" stroke-width=\"1.3\"/>\n          <circle cx=\"210\" cy=\"118\" r=\"5\" fill=\"#0c0303\" stroke=\"#f0a59e\" stroke-width=\"1\"/>\n          <!-- Arms -->\n          <path d=\"M 220 116 Q 250 110 280 105\" stroke=\"#752824\" stroke-width=\"2.5\" fill=\"none\"/>\n          <path d=\"M 220 124 Q 250 130 280 135\" stroke=\"#752824\" stroke-width=\"2.5\" fill=\"none\"/>\n          <!-- Long Tentacle -->\n          <path d=\"M 220 120 Q 260 120 310 120\" stroke=\"#8a302a\" stroke-width=\"1.5\" fill=\"none\"/>\n          <circle cx=\"310\" cy=\"120\" r=\"2.5\" fill=\"#f0a59e\"/>\n        </svg>\n        <div class=\"plate-annotations\">\n          <span><b>01.</b> Muscular torpedo mantle</span>\n          <span><b>02.</b> Colossal dinner-plate eye</span>\n          <span><b>03.</b> Eight suckered arms</span>\n          <span><b>04.</b> Clubbed feeding tentacles</span>\n        </div>\n      </div>\n    ",
    "index": "21"
  },
  {
    "id": "dragonfish",
    "name": "Black dragonfish",
    "scientificName": "Idiacanthus atlanticus",
    "depth": "500–2,000 m",
    "depthTier": "bathypelagic",
    "targetDepth": 1680,
    "habitat": "Midnight zone bathypelagic midwater",
    "realSize": "Females up to 40 cm (16 in); males 5 cm (2 in)",
    "classification": "ACTINOPTERYGII · STOMIIFORMES · STOMIIDAE",
    "photo": {
      "src": "/species/dragonfish.jpg",
      "caption": "Black dragonfish illustration showing chin barbel photophore and menacing fangs",
      "credit": "GM. Woodward",
      "license": "Public domain",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Idiacanthus_atlanticus.jpg"
    },
    "description": "Slender, eel-like bathypelagic predator with scaleless black skin and enormous, transparent fangs protruding from its jaws. Features a long chin barbel tipped with a luminous bioluminescent lure used to attract smaller fish in total darkness.",
    "detail": "Produces both standard blue bioluminescence and rare far-red light (sub-orbital photophore), allowing it to illuminate prey with a biological night-vision sniper beam invisible to virtually all other deep-sea fauna.",
    "source": {
      "title": "Australian Museum · Black Dragonfish",
      "url": "https://australian.museum/learn/animals/fishes/black-dragonfish-idiacanthus-atlanticus/",
      "publisher": "Australian Museum · Ichthyology Collection",
      "accessedOn": "2026-09-25"
    },
    "annotations": [
      {
        "num": "01.",
        "label": "Slender elongated ribbon body"
      },
      {
        "num": "02.",
        "label": "Chin barbel with luminous photophore bulb"
      },
      {
        "num": "03.",
        "label": "Needle fangs exceeding jaw closure"
      },
      {
        "num": "04.",
        "label": "Far-red suborbital light organ"
      }
    ],
    "svg": "\n      <div class=\"specimen-plate\">\n        <div class=\"plate-badge\">CLASSIFICATION // ACTINOPTERYGII · STOMIIDAE</div>\n        <svg class=\"specimen-diagram\" viewBox=\"0 0 340 240\" xmlns=\"http://www.w3.org/2000/svg\">\n          <circle cx=\"170\" cy=\"120\" r=\"95\" fill=\"rgba(60,180,210,0.12)\" />\n          <path d=\"M 60 120 C 110 115 190 112 250 114 C 275 116 285 120 285 122 C 275 124 250 126 190 126 C 110 125 60 120 60 120 Z\" fill=\"#0a1419\" stroke=\"rgba(130,225,240,0.6)\" stroke-width=\"1.2\"/>\n          <!-- Chin barbel -->\n          <path d=\"M 268 124 Q 265 155 245 170\" stroke=\"rgba(140,225,240,0.7)\" stroke-width=\"1\" fill=\"none\"/>\n          <circle cx=\"245\" cy=\"170\" r=\"3\" fill=\"#6df3ff\" stroke=\"#ffffff\" stroke-width=\"0.6\"/>\n          <!-- Fangs -->\n          <line x1=\"274\" y1=\"118\" x2=\"274\" y2=\"126\" stroke=\"#ffffff\" stroke-width=\"1\"/>\n          <line x1=\"278\" y1=\"118\" x2=\"278\" y2=\"125\" stroke=\"#ffffff\" stroke-width=\"1\"/>\n          <circle cx=\"265\" cy=\"116\" r=\"2\" fill=\"#040c10\" stroke=\"rgba(140,225,235,0.7)\" stroke-width=\"0.8\"/>\n        </svg>\n        <div class=\"plate-annotations\">\n          <span><b>01.</b> Ribbon body</span>\n          <span><b>02.</b> Glowing chin barbel</span>\n          <span><b>03.</b> Protruding needle fangs</span>\n          <span><b>04.</b> Suborbital photophore</span>\n        </div>\n      </div>\n    ",
    "index": "22"
  },
  {
    "id": "tripod-fish",
    "name": "Benthic tripod fish",
    "scientificName": "Bathypterois grallator",
    "depth": "1,000–4,000 m",
    "depthTier": "bathypelagic",
    "targetDepth": 1980,
    "habitat": "Abyssal benthic boundary layer",
    "realSize": "30–35 cm (12–14 in) body; fin rays exceed 1 m (3.3 ft)",
    "classification": "ACTINOPTERYGII · AULOPIFORMES · IPNOPIDAE",
    "photo": {
      "src": "/species/tripod-fish.jpg",
      "caption": "Tripod fish perched on its elongate pelvic and caudal fin rays above sediment",
      "credit": "NOAA Ocean Exploration",
      "license": "Public domain",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Tripod_fish_NOAA.jpg"
    },
    "description": "Perches motionless on the soft abyssal sediment facing into benthic currents using three elongated, stilt-like fin rays—two modified pelvic fins and one lower caudal fin lobe.",
    "detail": "Virtually blind in the deep dark, it raises its elongated pectoral fins above its head like acoustic antennae to detect delicate pressure vibrations created by swimming benthopelagic shrimp.",
    "source": {
      "title": "NOAA Ocean Exploration · Tripod Fish",
      "url": "https://oceanexplorer.noaa.gov/explorations/02mexico/logs/oct17/oct17.html",
      "publisher": "NOAA Office of Ocean Exploration and Research",
      "accessedOn": "2026-09-25"
    },
    "annotations": [
      {
        "num": "01.",
        "label": "Elongated stilt pelvic fin rays"
      },
      {
        "num": "02.",
        "label": "Sensory tactile pectoral antennae"
      },
      {
        "num": "03.",
        "label": "Slender streamlined body"
      },
      {
        "num": "04.",
        "label": "Extended lower caudal stilt ray"
      }
    ],
    "svg": "\n      <div class=\"specimen-plate\">\n        <div class=\"plate-badge\">CLASSIFICATION // ACTINOPTERYGII · IPNOPIDAE</div>\n        <svg class=\"specimen-diagram\" viewBox=\"0 0 340 240\" xmlns=\"http://www.w3.org/2000/svg\">\n          <circle cx=\"170\" cy=\"120\" r=\"100\" fill=\"rgba(70,180,210,0.15)\" />\n          <line x1=\"20\" y1=\"215\" x2=\"320\" y2=\"215\" stroke=\"rgba(70,140,150,0.3)\" stroke-width=\"1.5\" stroke-dasharray=\"4 4\"/>\n          <!-- Pelvic stilt rays -->\n          <line x1=\"165\" y1=\"130\" x2=\"135\" y2=\"215\" stroke=\"rgba(140,235,245,0.7)\" stroke-width=\"1.6\"/>\n          <line x1=\"175\" y1=\"130\" x2=\"185\" y2=\"215\" stroke=\"rgba(140,235,245,0.7)\" stroke-width=\"1.6\"/>\n          <!-- Caudal stilt ray -->\n          <line x1=\"85\" y1=\"125\" x2=\"70\" y2=\"215\" stroke=\"rgba(140,235,245,0.7)\" stroke-width=\"1.6\"/>\n          <!-- Body -->\n          <path d=\"M 85 125 C 105 116 155 112 215 114 C 235 116 250 120 255 124 C 248 128 230 134 210 134 C 160 134 105 132 85 125 Z\" fill=\"#143644\" stroke=\"rgba(130,225,240,0.6)\" stroke-width=\"1.3\"/>\n          <!-- Tactile pectoral antenna -->\n          <path d=\"M 210 114 Q 215 80 180 65\" stroke=\"rgba(160,240,250,0.7)\" stroke-width=\"1.3\" fill=\"none\"/>\n        </svg>\n        <div class=\"plate-annotations\">\n          <span><b>01.</b> Stilt pelvic rays</span>\n          <span><b>02.</b> Tactile pectoral antenna</span>\n          <span><b>03.</b> Slender body</span>\n          <span><b>04.</b> Caudal stilt ray</span>\n        </div>\n      </div>\n    ",
    "index": "23"
  },
  {
    "id": "gulper-eel",
    "name": "Gulper eel",
    "scientificName": "Eurypharynx pelecanoides",
    "depth": "500–3,000 m",
    "depthTier": "bathypelagic",
    "targetDepth": 2750,
    "habitat": "Bathypelagic to Abyssal midwater column",
    "realSize": "0.75–1.0 m (2.5–3.3 ft) total length",
    "classification": "ACTINOPTERYGII · SACCOPHARYNGIFORMES",
    "photo": {
      "src": "/species/gulper-eel.jpg",
      "caption": "Gulper eel specimen showcasing cavernous jaw and whip tail",
      "credit": "Smithsonian Institution",
      "license": "Public domain",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Eurypharynx_pelecanoides_SI.jpg"
    },
    "description": "Also known as the pelican eel, it features loosely hinged jaws comprising over a quarter of its total body length, capable of opening into an enormous pouch to engulf crustaceans, cephalopods, and fish.",
    "detail": "Its whip-like tail terminates in a complex organ (caudal photophore) that glows red and pink to lure inquisitive prey straight toward its yawning mouth.",
    "source": {
      "title": "Smithsonian Ocean · Pelican Eel",
      "url": "https://ocean.si.edu/ocean-life/fish/pelican-eel",
      "publisher": "Smithsonian National Museum of Natural History",
      "accessedOn": "2026-09-25"
    },
    "annotations": [
      {
        "num": "01.",
        "label": "Cavernous distensible pelican jaw"
      },
      {
        "num": "02.",
        "label": "Vestigial reduced cranial skull"
      },
      {
        "num": "03.",
        "label": "Elongated whip tail"
      },
      {
        "num": "04.",
        "label": "Luminescent caudal lure photophore"
      }
    ],
    "svg": "\n      <div class=\"specimen-plate\">\n        <div class=\"plate-badge\">CLASSIFICATION // ACTINOPTERYGII · SACCOPHARYNGIFORMES</div>\n        <svg class=\"specimen-diagram\" viewBox=\"0 0 340 240\" xmlns=\"http://www.w3.org/2000/svg\">\n          <circle cx=\"170\" cy=\"120\" r=\"100\" fill=\"rgba(80,185,210,0.18)\" />\n          <!-- Whip tail -->\n          <path d=\"M 165 125 C 120 125 90 145 60 140 C 40 135 30 150 20 145\" stroke=\"rgba(140,245,235,0.7)\" stroke-width=\"1.6\" fill=\"none\"/>\n          <circle cx=\"20\" cy=\"145\" r=\"2.5\" fill=\"#ff6b8b\"/>\n          <!-- Cavernous Jaw Pouch -->\n          <path d=\"M 270 102 C 220 102 180 110 165 125 C 175 160 215 178 265 142 C 275 132 278 112 270 102 Z\" fill=\"#0d252f\" stroke=\"rgba(140,245,235,0.6)\" stroke-width=\"1.4\"/>\n          <line x1=\"165\" y1=\"125\" x2=\"270\" y2=\"102\" stroke=\"rgba(160,250,240,0.8)\" stroke-width=\"1.4\"/>\n          <circle cx=\"270\" cy=\"103\" r=\"2\" fill=\"#040d12\" stroke=\"rgba(160,250,240,0.8)\" stroke-width=\"0.8\"/>\n        </svg>\n        <div class=\"plate-annotations\">\n          <span><b>01.</b> Distensible jaw pouch</span>\n          <span><b>02.</b> Vestigial skull</span>\n          <span><b>03.</b> Tapered whip tail</span>\n          <span><b>04.</b> Luminous caudal lure</span>\n        </div>\n      </div>\n    ",
    "index": "24"
  },
  {
    "id": "glass-squid",
    "name": "Cockatoo glass squid",
    "scientificName": "Taonius borealis",
    "depth": "1,000–4,000 m",
    "depthTier": "abyssopelagic",
    "targetDepth": 4700,
    "habitat": "Abyssopelagic midnight depths",
    "realSize": "50–66 cm (20–26 in) mantle length",
    "classification": "CEPHALOPODA · CRANCHIIDAE",
    "photo": {
      "src": "/species/glass-squid.jpg",
      "caption": "Illustration of Taonius borealis glass squid showing transparent mantle and eye photophores",
      "credit": "James H. Emerton",
      "license": "Public domain",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Taonius_borealis.jpg"
    },
    "description": "Completely transparent deep-sea cranchiid squid that floats nearly invisibly in the abyssal water column. Filled with ammonium chloride coelomic fluid that grants neutral buoyancy without requiring active swimming energy.",
    "detail": "Its only opaque internal structure is its vertical cigar-shaped digestive gland, which the squid aligns strictly vertically with downwelling light to cast minimal shadow to predators below.",
    "source": {
      "title": "Tree of Life · Taonius",
      "url": "http://tolweb.org/Taonius/19531",
      "publisher": "Tree of Life Web Project · Cephalopoda",
      "accessedOn": "2026-09-25"
    },
    "annotations": [
      {
        "num": "01.",
        "label": "Crystal-clear transparent mantle"
      },
      {
        "num": "02.",
        "label": "Vertical opaque digestive gland"
      },
      {
        "num": "03.",
        "label": "Ocular photophores countering shadows"
      },
      {
        "num": "04.",
        "label": "Short crowned tentacle cluster"
      }
    ],
    "svg": "\n      <div class=\"specimen-plate\">\n        <div class=\"plate-badge\">CLASSIFICATION // CEPHALOPODA · CRANCHIIDAE</div>\n        <svg class=\"specimen-diagram\" viewBox=\"0 0 340 240\" xmlns=\"http://www.w3.org/2000/svg\">\n          <circle cx=\"170\" cy=\"120\" r=\"95\" fill=\"rgba(80,200,230,0.12)\" />\n          <path d=\"M 120 120 C 120 85 160 85 220 105 C 245 112 255 120 255 120 C 255 120 245 128 220 135 C 160 155 120 155 120 120 Z\" fill=\"rgba(100,210,230,0.18)\" stroke=\"rgba(150,240,255,0.7)\" stroke-width=\"1.3\"/>\n          <ellipse cx=\"180\" cy=\"120\" rx=\"4\" ry=\"14\" fill=\"#a8603b\" stroke=\"rgba(240,160,120,0.6)\" stroke-width=\"0.8\"/>\n          <circle cx=\"235\" cy=\"113\" r=\"3.5\" fill=\"#091820\" stroke=\"rgba(150,240,255,0.8)\" stroke-width=\"0.8\"/>\n          <circle cx=\"235\" cy=\"127\" r=\"3.5\" fill=\"#091820\" stroke=\"rgba(150,240,255,0.8)\" stroke-width=\"0.8\"/>\n          <path d=\"M 255 120 L 285 110 M 255 120 L 285 130\" stroke=\"rgba(150,240,255,0.6)\" stroke-width=\"1.2\"/>\n        </svg>\n        <div class=\"plate-annotations\">\n          <span><b>01.</b> Transparent mantle</span>\n          <span><b>02.</b> Vertical digestive gland</span>\n          <span><b>03.</b> Eye photophores</span>\n          <span><b>04.</b> Crown tentacle cluster</span>\n        </div>\n      </div>\n    ",
    "index": "25"
  },
  {
    "id": "sea-pig",
    "name": "Abyssal sea pig",
    "scientificName": "Scotoplanes globosa",
    "depth": "1,000–6,000 m",
    "depthTier": "abyssopelagic",
    "targetDepth": 5150,
    "habitat": "Abyssal plains & Sediment basins",
    "realSize": "10–15 cm (4–6 in) length",
    "classification": "HOLOTHUROIDEA · ELPIDIIDAE",
    "photo": {
      "src": "/species/sea-pig.jpg",
      "caption": "Scotoplanes globosa grazing on abyssal sediment alongside a deep-sea crab",
      "credit": "NOAA / MBARI",
      "license": "Public domain",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Scotoplanes_globosa_and_crab.jpg"
    },
    "description": "Plump, translucent pink sea cucumber that walks across muddy sediment plains using inflated hydraulic tube feet (papillae). Feeds on organic detritus and fallen marine snow by sifting through deep-ocean silt with specialized oral feeding tentacles.",
    "detail": "Often gathers in herds numbering hundreds of individuals all facing into the prevailing abyssal current to optimize detrital interception.",
    "source": {
      "title": "MBARI · Sea Pig",
      "url": "https://www.mbari.org/animal/sea-pig/",
      "publisher": "Monterey Bay Aquarium Research Institute",
      "accessedOn": "2026-09-25"
    },
    "annotations": [
      {
        "num": "01.",
        "label": "Hydraulic walking tube feet (papillae)"
      },
      {
        "num": "02.",
        "label": "Dorsal sensory antennae papillae"
      },
      {
        "num": "03.",
        "label": "Translucent pink gelatinous dermis"
      },
      {
        "num": "04.",
        "label": "Buccal oral sediment-sifting tentacles"
      }
    ],
    "svg": "\n      <div class=\"specimen-plate\">\n        <div class=\"plate-badge\">CLASSIFICATION // HOLOTHUROIDEA · ELPIDIIDAE</div>\n        <svg class=\"specimen-diagram\" viewBox=\"0 0 340 240\" xmlns=\"http://www.w3.org/2000/svg\">\n          <circle cx=\"170\" cy=\"120\" r=\"100\" fill=\"rgba(255,160,190,0.18)\" />\n          <!-- Dorsal sensory papillae -->\n          <path d=\"M 148 88 C 150 55 160 38 172 32\" fill=\"none\" stroke=\"rgba(255,200,220,0.85)\" stroke-width=\"3\" stroke-linecap=\"round\"/>\n          <path d=\"M 175 88 C 180 58 192 40 205 34\" fill=\"none\" stroke=\"rgba(255,200,220,0.85)\" stroke-width=\"3\" stroke-linecap=\"round\"/>\n          <!-- Body -->\n          <ellipse cx=\"170\" cy=\"122\" rx=\"72\" ry=\"42\" fill=\"#5c2638\" stroke=\"rgba(255,185,210,0.8)\" stroke-width=\"1.5\"/>\n          <!-- Walking tube feet -->\n          <path d=\"M 125 156 L 118 192 M 145 162 L 142 195 M 175 164 L 175 198 M 205 160 L 210 195 M 225 152 L 235 188\" stroke=\"rgba(255,190,215,0.9)\" stroke-width=\"4.5\" stroke-linecap=\"round\"/>\n        </svg>\n        <div class=\"plate-annotations\">\n          <span><b>01.</b> Hydraulic tube feet</span>\n          <span><b>02.</b> Dorsal antennae</span>\n          <span><b>03.</b> Gelatinous dermis</span>\n          <span><b>04.</b> Oral sediment tentacles</span>\n        </div>\n      </div>\n    ",
    "index": "26"
  },
  {
    "id": "xenophyophore",
    "name": "Giant xenophyophore",
    "scientificName": "Syringammina fragilissima",
    "depth": "1,000–5,000 m",
    "depthTier": "abyssopelagic",
    "targetDepth": 5200,
    "habitat": "Abyssal sediment plains & Benthic drop-offs",
    "realSize": "10–20 cm (4–8 in) test diameter",
    "classification": "FORAMINIFERA · MONOTHALAMEA · SYRINGAMMINIDAE",
    "photo": {
      "src": "/species/xenophyophore.jpg",
      "caption": "Fragile agglutinated test structure of Syringammina fragilissima on deep seabed",
      "credit": "Cedhagen, Tomas",
      "license": "CC BY-SA 3.0",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Syringammina_Fragilissima.jpg"
    },
    "description": "Colossal single-celled protozoan and among the largest unicellular organisms on Earth. Constructs intricate, fragile sponge-like shell structures (tests) by agglutinating sediment particles, mineral grains, and sponge spicules with organic cement.",
    "detail": "Contains thousands of nuclei within its single syncytial cell, trapping falling marine snow and hosting diverse micro-ecosystems of nematodes and crustaceans in the nutrient-scarce abyss.",
    "source": {
      "title": "World Register of Marine Species · Syringammina fragilissima",
      "url": "https://www.marinespecies.org/aphia.php?p=taxdetails&id=113469",
      "publisher": "WoRMS · Flanders Marine Institute",
      "accessedOn": "2026-09-25"
    },
    "annotations": [
      {
        "num": "01.",
        "label": "Frilly agglutinated sediment test"
      },
      {
        "num": "02.",
        "label": "Syncytial multinucleated cell plasma"
      },
      {
        "num": "03.",
        "label": "Stercomata fecal pellet accumulation"
      },
      {
        "num": "04.",
        "label": "Sediment anchor base"
      }
    ],
    "svg": "\n      <div class=\"specimen-plate\">\n        <div class=\"plate-badge\">CLASSIFICATION // FORAMINIFERA · MONOTHALAMEA</div>\n        <svg class=\"specimen-diagram\" viewBox=\"0 0 340 240\" xmlns=\"http://www.w3.org/2000/svg\">\n          <circle cx=\"170\" cy=\"120\" r=\"95\" fill=\"rgba(80,180,210,0.12)\" />\n          <path d=\"M 120 160 C 100 130 110 80 145 70 C 175 60 210 70 225 100 C 240 130 220 160 170 165 Z\" fill=\"#1b333d\" stroke=\"rgba(130,225,240,0.6)\" stroke-width=\"1.3\"/>\n          <path d=\"M 130 110 Q 150 90 170 110 Q 190 130 210 110\" stroke=\"rgba(150,235,245,0.5)\" stroke-width=\"1\" fill=\"none\"/>\n          <path d=\"M 140 130 Q 170 120 190 140\" stroke=\"rgba(150,235,245,0.5)\" stroke-width=\"1\" fill=\"none\"/>\n        </svg>\n        <div class=\"plate-annotations\">\n          <span><b>01.</b> Agglutinated test</span>\n          <span><b>02.</b> Multinucleate cytoplasm</span>\n          <span><b>03.</b> Stercomata accumulation</span>\n          <span><b>04.</b> Benthic base anchor</span>\n        </div>\n      </div>\n    ",
    "index": "27"
  },
  {
    "id": "hadal-amphipod",
    "name": "Hadal trench amphipod",
    "scientificName": "Hirondellea gigas",
    "depth": "6,000–9,000 m",
    "depthTier": "hadalpelagic",
    "targetDepth": 7500,
    "habitat": "Mariana Trench Hadal zone · Hadalpelagic",
    "realSize": "2.5–3.5 cm (1.0–1.4 in) body length",
    "classification": "MALACOSTRACA · AMPHIPODA · LYSIANASSOIDEA",
    "photo": {
      "src": "/species/hadal-amphipod.jpg",
      "caption": "Hadal amphipod Hirondellea gigas captured at extreme depths in Mariana Trench",
      "credit": "Daiju Azuma",
      "license": "CC BY-SA 2.5",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Hirondellea_gigas.jpg"
    },
    "description": "Super-pressure adapted hadal scavenger dominating trench depths down to 9,000 meters. Possesses unique cellulase enzymes and aluminum-doped carapace matrices that withstand hydrostatic pressures exceeding 800 atmospheres.",
    "detail": "Can detect organic falls from miles away, swarming carrion in vast feeding frenzies that strip sunken carcass bone clean in hours.",
    "source": {
      "title": "PLOS ONE · Hadal Amphipod Hirondellea gigas",
      "url": "https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0042727",
      "publisher": "PLOS ONE · Deep-Sea Biology",
      "accessedOn": "2026-09-25"
    },
    "annotations": [
      {
        "num": "01.",
        "label": "Curved chitinous carapace segments"
      },
      {
        "num": "02.",
        "label": "Long paired sensory antennae"
      },
      {
        "num": "03.",
        "label": "Prehensile gnathopod feeding claws"
      },
      {
        "num": "04.",
        "label": "Fluttering swimming pleopods"
      }
    ],
    "svg": "\n      <div class=\"specimen-plate\">\n        <div class=\"plate-badge\">CLASSIFICATION // MALACOSTRACA · AMPHIPODA</div>\n        <svg class=\"specimen-diagram\" viewBox=\"0 0 340 240\" xmlns=\"http://www.w3.org/2000/svg\">\n          <circle cx=\"170\" cy=\"120\" r=\"95\" fill=\"rgba(80,210,230,0.12)\" />\n          <path d=\"M 120 160 C 100 120 120 80 170 80 C 220 80 240 110 245 140 C 235 155 210 165 170 165 C 140 165 125 162 120 160 Z\" fill=\"#1b424f\" stroke=\"rgba(140,235,245,0.7)\" stroke-width=\"1.3\"/>\n          <path d=\"M 245 130 Q 275 125 295 120\" stroke=\"rgba(160,240,250,0.7)\" stroke-width=\"1.2\" fill=\"none\"/>\n          <path d=\"M 140 165 L 135 185 M 160 165 L 160 188 M 180 165 L 185 188\" stroke=\"rgba(160,240,250,0.6)\" stroke-width=\"1.2\"/>\n        </svg>\n        <div class=\"plate-annotations\">\n          <span><b>01.</b> Curved carapace</span>\n          <span><b>02.</b> Paired sensory antennae</span>\n          <span><b>03.</b> Feeding gnathopods</span>\n          <span><b>04.</b> Swimming pleopods</span>\n        </div>\n      </div>\n    ",
    "index": "28"
  },
  {
    "id": "mariana-snailfish",
    "name": "Mariana snailfish",
    "scientificName": "Pseudoliparis swirei",
    "depth": "6,000–8,000 m",
    "depthTier": "hadalpelagic",
    "targetDepth": 7850,
    "habitat": "Mariana Trench Hadal Chasm · 6,000–8,000 m",
    "realSize": "15–28 cm (6–11 in) total length",
    "classification": "ACTINOPTERYGII · SCORPAENIFORMES · LIPARIDAE",
    "photo": {
      "src": "/species/mariana-snailfish.png",
      "caption": "Mariana snailfish specimen documenting translucent, scaleless morphology",
      "credit": "Mackenzie Gerringer et al. / Zootaxa",
      "license": "CC BY 4.0",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Pseudoliparis_swirei.png"
    },
    "description": "The deepest-living vertebrate ever scientifically documented, thriving at crushing pressures over 800 times sea level. Features a scaleless, gelatinous translucent body through which its liver, stomach, and visceral organs are faintly visible.",
    "detail": "Specialized biochemical adaptations—high concentrations of the piezolyte trimethylamine N-oxide (TMAO) and flexible cell membranes—prevent cellular proteins from collapsing under extreme hadal hydrostatic pressure.",
    "source": {
      "title": "Zootaxa · Pseudoliparis swirei (Mariana Snailfish)",
      "url": "https://doi.org/10.11646/zootaxa.4358.1.7",
      "publisher": "Zootaxa · University of Washington & Schmidt Ocean Institute",
      "accessedOn": "2026-09-25"
    },
    "annotations": [
      {
        "num": "01.",
        "label": "Translucent pink gelatinous skin"
      },
      {
        "num": "02.",
        "label": "Broad wing-like pectoral fins"
      },
      {
        "num": "03.",
        "label": "Visceral digestive organ cavity"
      },
      {
        "num": "04.",
        "label": "Undulating tadpole caudal fin"
      }
    ],
    "svg": "\n      <div class=\"specimen-plate\">\n        <div class=\"plate-badge\">CLASSIFICATION // ACTINOPTERYGII · LIPARIDAE</div>\n        <svg class=\"specimen-diagram\" viewBox=\"0 0 340 240\" xmlns=\"http://www.w3.org/2000/svg\">\n          <circle cx=\"170\" cy=\"120\" r=\"100\" fill=\"rgba(255,180,210,0.18)\" />\n          <path d=\"M 60 120 L 40 108 L 48 120 L 40 132 Z\" fill=\"#4d2432\" stroke=\"rgba(255,200,225,0.7)\" stroke-width=\"1\"/>\n          <!-- Tadpole body -->\n          <path d=\"M 60 120 C 90 115 150 105 210 102 C 245 102 275 110 280 120 C 275 130 245 138 210 138 C 150 135 90 125 60 120 Z\" fill=\"#3d1c28\" stroke=\"rgba(255,200,225,0.7)\" stroke-width=\"1.3\"/>\n          <!-- Visceral cavity -->\n          <ellipse cx=\"225\" cy=\"120\" rx=\"18\" ry=\"10\" fill=\"#753047\" stroke=\"rgba(255,180,210,0.5)\" stroke-width=\"1\"/>\n          <!-- Pectoral wing -->\n          <path d=\"M 215 125 C 200 145 185 155 178 150 C 180 142 195 130 210 124 Z\" fill=\"#612638\" stroke=\"rgba(255,200,225,0.6)\" stroke-width=\"1\"/>\n        </svg>\n        <div class=\"plate-annotations\">\n          <span><b>01.</b> Translucent pink skin</span>\n          <span><b>02.</b> Pectoral wing fins</span>\n          <span><b>03.</b> Visceral organ cavity</span>\n          <span><b>04.</b> Tadpole caudal ribbon</span>\n        </div>\n      </div>\n    ",
    "index": "29"
  },
  {
    "id": "hadal-sea-cucumber",
    "name": "Hadal swimming sea cucumber",
    "scientificName": "Peniagone sp.",
    "depth": "6,500–10,500 m",
    "depthTier": "hadalpelagic",
    "targetDepth": 9400,
    "habitat": "Mariana Trench benthic hadal sediment slopes",
    "realSize": "8–14 cm (3–5.5 in) translucent body length",
    "classification": "HOLOTHUROIDEA · ELPIDIIDAE",
    "photo": {
      "src": "/species/hadal-sea-cucumber.jpg",
      "caption": "Peniagone sea cucumber showing dorsal sailing velum and walking tube-feet",
      "credit": "Trang Nguyen",
      "license": "CC0",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Peniagone_vignoni_(USNM_1132683)_001.jpeg"
    },
    "description": "Translucent, gelatinous hadal holothurian capable of both benthic walking and gentle benthopelagic swimming. Features a broad, fan-like dorsal anterior velum (sail) that catches deep trench boundary currents.",
    "detail": "Walks delicately along the diatomaceous mud on elongated tube-feet pairs, sifting through fine organic sedimentation under pressures exceeding 1,000 atmospheres.",
    "source": {
      "title": "Smithsonian NMNH · Peniagone",
      "url": "https://zookeys.pensoft.net/article/82172/",
      "publisher": "Smithsonian National Museum of Natural History / ZooKeys",
      "accessedOn": "2026-09-25"
    },
    "annotations": [
      {
        "num": "01.",
        "label": "Sail-like dorsal anterior velum lobe"
      },
      {
        "num": "02.",
        "label": "Translucent gelatinous hadal dermis"
      },
      {
        "num": "03.",
        "label": "Walking tube-feet stilt pairs"
      },
      {
        "num": "04.",
        "label": "Oral deposit-feeding tentacle ring"
      }
    ],
    "svg": "\n      <div class=\"specimen-plate\">\n        <div class=\"plate-badge\">CLASSIFICATION // HOLOTHUROIDEA · ELPIDIIDAE</div>\n        <svg class=\"specimen-diagram\" viewBox=\"0 0 340 240\" xmlns=\"http://www.w3.org/2000/svg\">\n          <circle cx=\"170\" cy=\"120\" r=\"95\" fill=\"rgba(140,210,230,0.12)\" />\n          <!-- Dorsal velum sail -->\n          <path d=\"M 200 110 C 205 70 220 50 235 45 C 235 65 225 90 215 110 Z\" fill=\"rgba(130,225,245,0.4)\" stroke=\"rgba(160,240,255,0.7)\" stroke-width=\"1.2\"/>\n          <!-- Body -->\n          <ellipse cx=\"170\" cy=\"125\" rx=\"60\" ry=\"24\" fill=\"#143442\" stroke=\"rgba(140,230,245,0.7)\" stroke-width=\"1.3\"/>\n          <!-- Tube feet -->\n          <line x1=\"140\" y1=\"149\" x2=\"135\" y2=\"180\" stroke=\"rgba(150,235,250,0.8)\" stroke-width=\"2.5\" stroke-linecap=\"round\"/>\n          <line x1=\"165\" y1=\"149\" x2=\"165\" y2=\"182\" stroke=\"rgba(150,235,250,0.8)\" stroke-width=\"2.5\" stroke-linecap=\"round\"/>\n          <line x1=\"190\" y1=\"149\" x2=\"195\" y2=\"180\" stroke=\"rgba(150,235,250,0.8)\" stroke-width=\"2.5\" stroke-linecap=\"round\"/>\n        </svg>\n        <div class=\"plate-annotations\">\n          <span><b>01.</b> Anterior dorsal velum</span>\n          <span><b>02.</b> Translucent dermis</span>\n          <span><b>03.</b> Stilt tube feet</span>\n          <span><b>04.</b> Oral deposit tentacles</span>\n        </div>\n      </div>\n    ",
    "index": "30"
  },
  {
    "id": "supergiant-amphipod",
    "name": "Supergiant hadal amphipod",
    "scientificName": "Alicella gigantea",
    "depth": "7,000–11,000 m",
    "depthTier": "hadalpelagic",
    "targetDepth": 10820,
    "habitat": "Challenger Deep · Mariana Trench floor · 10,800–11,000 m",
    "realSize": "24–34 cm (9.5–13.4 in); >10× larger than shallow amphipods",
    "classification": "MALACOSTRACA · AMPHIPODA · ALICELLIDAE",
    "photo": {
      "src": "/species/supergiant-amphipod.jpg",
      "caption": "Live Alicella gigantea feeding on bait in hadal free-fall lander trap",
      "credit": "NOAA Ocean Exploration",
      "license": "Public domain",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Live_Alicella_gigantea_feeding.jpg"
    },
    "description": "A prime example of deep-sea gigantism (abyssal gigantism). While most shallow-water amphipods measure 1–2 cm, this colossal hadal scavenger attains lengths over 34 cm in the deepest trenches on Earth.",
    "detail": "Thrives in pitch-black conditions under >1,080 atmospheres (>16,000 psi) of hydrostatic pressure, sustained by falling carrion and detritus. Captured in-situ at Challenger Deep alongside historic landers.",
    "source": {
      "title": "NOAA Ocean Exploration · Giant Amphipod",
      "url": "https://oceanexplorer.noaa.gov/explorations/09lophelia/logs/september24/september24.html",
      "publisher": "NOAA Office of Ocean Exploration and Research",
      "accessedOn": "2026-09-25"
    },
    "annotations": [
      {
        "num": "01.",
        "label": "Articulated pearlescent chitinous carapace"
      },
      {
        "num": "02.",
        "label": "Elongated sensory antennae"
      },
      {
        "num": "03.",
        "label": "Prehensile gnathopods"
      },
      {
        "num": "04.",
        "label": "Hydraulic swimming pleopods"
      }
    ],
    "svg": "\n      <div class=\"specimen-plate\">\n        <div class=\"plate-badge\">CLASSIFICATION // MALACOSTRACA · ALICELLIDAE</div>\n        <svg class=\"specimen-diagram\" viewBox=\"0 0 340 240\" xmlns=\"http://www.w3.org/2000/svg\">\n          <circle cx=\"170\" cy=\"120\" r=\"100\" fill=\"rgba(240,248,255,0.18)\" />\n          <path d=\"M 215 125 Q 260 115 285 105 M 220 135 Q 255 145 280 155\" stroke=\"rgba(190,240,250,0.85)\" stroke-width=\"1.6\" fill=\"none\"/>\n          <path d=\"M 100 160 C 85 125 100 80 150 72 C 190 68 225 85 240 120 C 235 140 215 155 180 162 C 145 168 115 170 100 160 Z\" fill=\"#2d3f47\" stroke=\"rgba(200,240,250,0.8)\" stroke-width=\"1.5\"/>\n          <path d=\"M 140 73 Q 148 115 142 165 M 170 70 Q 175 115 172 163 M 200 78 Q 202 118 198 160\" stroke=\"rgba(150,210,225,0.4)\" stroke-width=\"1.2\" fill=\"none\"/>\n        </svg>\n        <div class=\"plate-annotations\">\n          <span><b>01.</b> Segmented carapace</span>\n          <span><b>02.</b> Sensory antennae</span>\n          <span><b>03.</b> Prehensile gnathopods</span>\n          <span><b>04.</b> Swimming pleopods</span>\n        </div>\n      </div>\n    ",
    "index": "31"
  },
  {
    "id": "bathysiphon-mat",
    "name": "Tubular hadal foraminifera",
    "scientificName": "Bathysiphon filiformis",
    "depth": "8,000–11,000 m",
    "depthTier": "hadalpelagic",
    "targetDepth": 10920,
    "habitat": "Challenger Deep terminal seafloor diatomaceous ooze",
    "realSize": "Up to 50 mm (2 in) elongate agglutinated silica tube",
    "classification": "FORAMINIFERA · MONOTHALAMEA · ASTRORHIZIDA",
    "photo": {
      "src": "/species/bathysiphon-mat.jpg",
      "caption": "Historic taxonomic illustration of elongate tubular Bathysiphon filiformis tests",
      "credit": "Reale accademia delle scienze di Torino",
      "license": "No restrictions",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Atti_della_Reale_Accademia_delle_scienze_di_Torino_(1866-1927.)_(20161193529).jpg"
    },
    "description": "Large primitive single-celled xenophyophore/foraminiferan that constructs slender, flexible cylindrical tubes protruding upright like miniature forests from the soft pelagic diatomaceous ooze of Challenger Deep.",
    "detail": "Agglutinates amorphous silica sponge spicules and sediment grains with an organic bio-adhesive. Extends delicate pseudopodial nets from its terminal aperture into bottom currents to capture organic debris.",
    "source": {
      "title": "World Register of Marine Species · Bathysiphon filiformis",
      "url": "https://www.marinespecies.org/aphia.php?p=taxdetails&id=113063",
      "publisher": "WoRMS · Flanders Marine Institute",
      "accessedOn": "2026-09-25"
    },
    "annotations": [
      {
        "num": "01.",
        "label": "Elongated agglutinated silica test tube"
      },
      {
        "num": "02.",
        "label": "Terminal pseudopodial aperture"
      },
      {
        "num": "03.",
        "label": "Pelagic diatomaceous sediment anchor"
      },
      {
        "num": "04.",
        "label": "Protoplasmic feeding streaming net"
      }
    ],
    "svg": "\n      <div class=\"specimen-plate\">\n        <div class=\"plate-badge\">CLASSIFICATION // FORAMINIFERA · ASTRORHIZIDA</div>\n        <svg class=\"specimen-diagram\" viewBox=\"0 0 340 240\" xmlns=\"http://www.w3.org/2000/svg\">\n          <circle cx=\"170\" cy=\"120\" r=\"95\" fill=\"rgba(120,210,230,0.12)\" />\n          <line x1=\"30\" y1=\"205\" x2=\"310\" y2=\"205\" stroke=\"rgba(150,210,225,0.4)\" stroke-width=\"1.5\" stroke-dasharray=\"3 3\"/>\n          <!-- Upright tubes -->\n          <line x1=\"140\" y1=\"205\" x2=\"135\" y2=\"70\" stroke=\"rgba(190,235,245,0.85)\" stroke-width=\"2.5\" stroke-linecap=\"round\"/>\n          <circle cx=\"135\" cy=\"70\" r=\"2.5\" fill=\"#e0f8ff\"/>\n          <line x1=\"170\" y1=\"205\" x2=\"172\" y2=\"50\" stroke=\"rgba(190,235,245,0.9)\" stroke-width=\"2.5\" stroke-linecap=\"round\"/>\n          <circle cx=\"172\" cy=\"50\" r=\"2.5\" fill=\"#e0f8ff\"/>\n          <line x1=\"200\" y1=\"205\" x2=\"205\" y2=\"85\" stroke=\"rgba(190,235,245,0.8)\" stroke-width=\"2.5\" stroke-linecap=\"round\"/>\n          <circle cx=\"205\" cy=\"85\" r=\"2.5\" fill=\"#e0f8ff\"/>\n        </svg>\n        <div class=\"plate-annotations\">\n          <span><b>01.</b> Agglutinated silica tubes</span>\n          <span><b>02.</b> Terminal aperture</span>\n          <span><b>03.</b> Diatomaceous sediment base</span>\n          <span><b>04.</b> Pseudopodial net</span>\n        </div>\n      </div>\n    ",
    "index": "32"
  }
];

export const vampireSquid = documentedSpecimens.find((s) => s.id === 'vampire-squid')!;

export type Site = {
  id: string;
  index: string;
  name: string;
  kind: string;
  depth: string;
  depthTier: 'epipelagic' | 'mesopelagic' | 'bathypelagic' | 'abyssopelagic' | 'hadalpelagic';
  targetDepth: number;
  location: string;
  description: string;
  detail: string;
  facts: { label: string; value: string }[];
  source: {
    title: string;
    url: string;
    publisher: string;
    accessedOn: string;
  };
  annotations: { num: string; label: string }[];
  svg: string;
};

export const documentedSites: Site[] = [
  {
    id: 'rms-titanic',
    index: 'H1',
    name: 'RMS Titanic',
    kind: 'Historic shipwreck · Ocean liner',
    depth: '≈3,800 m',
    depthTier: 'bathypelagic',
    targetDepth: 3800,
    location: 'North Atlantic · ~600 km off Newfoundland',
    description:
      'The wreck of the British ocean liner RMS Titanic, which sank on 15 April 1912 after striking an iceberg on her maiden voyage. She rests upright in abyssal sediment at roughly 3,800 m depth, broken in two with bow and stern sections lying about 600 m apart amid a vast debris field.',
    detail:
      'Located on 1 September 1985 by a joint Woods Hole Oceanographic Institution and IFREMER expedition led by Robert Ballard, the wreck is colonized by rusticle-forming microbes slowly consuming the iron hull. Encounter her with floodlights and active sonar: ping for the large structure return, then hold position to document the site.',
    facts: [
      { label: 'RESTING DEPTH', value: '≈3,800 m (12,500 ft)' },
      { label: 'LOCATION', value: '~600 km SSE off Newfoundland' },
      { label: 'LOST', value: '15 April 1912 · maiden voyage' },
      { label: 'DISCOVERED', value: '1 Sept 1985 · Ballard / WHOI–IFREMER' },
    ],
    source: {
      title: 'NOAA Ocean Exploration',
      url: 'https://oceanexplorer.noaa.gov/',
      publisher: 'NOAA Ocean Exploration · Woods Hole Oceanographic Institution',
      accessedOn: '2026-09-25',
    },
    annotations: [
      { num: '01.', label: 'Raked bow prow, upright in sediment' },
      { num: '02.', label: 'Fractured midship break zone' },
      { num: '03.', label: 'Stern section & debris field' },
      { num: '04.', label: 'Rusticle microbial colonies' },
    ],
    svg: `
      <div class="specimen-plate">
        <div class="plate-badge">SITE SURVEY // HISTORIC WRECK · 1912</div>
        <svg class="specimen-diagram" viewBox="0 0 340 240" xmlns="http://www.w3.org/2000/svg">
          <!-- Abyssal sediment mound -->
          <path d="M 0 196 Q 90 184 170 192 Q 260 200 340 190 L 340 240 L 0 240 Z" fill="rgba(20,34,40,0.9)" stroke="rgba(150,210,200,0.35)" stroke-width="1"/>
          <!-- Bow hull section (upright, raked prow facing left) -->
          <path d="M 30 190 L 34 120 L 44 96 L 120 96 L 128 120 L 130 190 Z" fill="#101c22" stroke="rgba(195,230,225,0.75)" stroke-width="1.6"/>
          <!-- Sheer line & deck plating -->
          <path d="M 34 120 L 128 120" stroke="rgba(170,220,215,0.5)" stroke-width="1"/>
          <path d="M 36 140 L 129 140" stroke="rgba(110,160,170,0.4)" stroke-width="0.8"/>
          <path d="M 33 160 L 130 160" stroke="rgba(110,160,170,0.4)" stroke-width="0.8"/>
          <!-- Collapsed forecastle & forward well deck -->
          <path d="M 60 96 L 62 78 L 100 78 L 102 96" fill="#0b1419" stroke="rgba(170,220,215,0.55)" stroke-width="1.2"/>
          <!-- Foremast stump -->
          <path d="M 78 78 L 78 52" stroke="rgba(200,235,230,0.7)" stroke-width="2.4" stroke-linecap="round"/>
          <!-- Porthole glints catching floodlights -->
          <circle cx="52" cy="132" r="2.2" fill="rgba(190,245,235,0.8)"/>
          <circle cx="70" cy="132" r="2.2" fill="rgba(190,245,235,0.55)"/>
          <circle cx="88" cy="132" r="2.2" fill="rgba(190,245,235,0.7)"/>
          <circle cx="106" cy="132" r="2.2" fill="rgba(190,245,235,0.45)"/>
          <!-- Fractured midship break (torn girder edges) -->
          <path d="M 130 190 L 134 150 L 128 138 L 138 128 L 132 112 L 142 100 L 150 120 L 146 190 Z" fill="#0a1216" stroke="rgba(200,235,230,0.6)" stroke-width="1.2"/>
          <!-- Detached stern fragment -->
          <path d="M 196 190 L 200 132 L 252 132 L 258 190 Z" fill="#0e181e" stroke="rgba(180,225,220,0.6)" stroke-width="1.4"/>
          <path d="M 200 132 L 252 132" stroke="rgba(170,220,215,0.45)" stroke-width="1"/>
          <circle cx="216" cy="150" r="2" fill="rgba(190,245,235,0.5)"/>
          <circle cx="234" cy="150" r="2" fill="rgba(190,245,235,0.65)"/>
          <!-- Scattered debris field -->
          <rect x="160" y="186" width="10" height="5" fill="rgba(140,190,185,0.5)"/>
          <rect x="266" y="188" width="14" height="4" fill="rgba(140,190,185,0.45)"/>
          <rect x="288" y="184" width="8" height="6" fill="rgba(140,190,185,0.5)"/>
          <circle cx="178" cy="190" r="3" fill="rgba(140,190,185,0.4)"/>
          <!-- Rusticle streaks weeping from hull -->
          <path d="M 50 140 Q 48 160 52 178" stroke="rgba(190,120,80,0.55)" stroke-width="1.4" fill="none"/>
          <path d="M 96 140 Q 98 162 94 180" stroke="rgba(190,120,80,0.45)" stroke-width="1.2" fill="none"/>
          <path d="M 224 150 Q 222 168 226 184" stroke="rgba(190,120,80,0.5)" stroke-width="1.2" fill="none"/>
          <!-- Survey depth callout -->
          <path d="M 300 60 L 300 190" stroke="rgba(162,237,221,0.5)" stroke-width="1" stroke-dasharray="4 3"/>
          <circle cx="300" cy="60" r="2.5" fill="none" stroke="rgba(162,237,221,0.7)" stroke-width="1"/>
          <circle cx="300" cy="190" r="2.5" fill="none" stroke="rgba(162,237,221,0.7)" stroke-width="1"/>
          <text x="308" y="128" fill="rgba(200,240,235,0.85)" font-size="10" letter-spacing="2">3800 M</text>
        </svg>
        <div class="plate-annotations">
          <span><b>01.</b> Raked bow prow, upright in sediment</span>
          <span><b>02.</b> Fractured midship break zone</span>
          <span><b>03.</b> Stern section &amp; debris field</span>
          <span><b>04.</b> Rusticle microbial colonies</span>
        </div>
      </div>
    `,
  },
];

export function zoneAt(depth: number): { name: string; subtitle: string } {
  if (depth < 1) return { name: 'OCEAN SURFACE', subtitle: 'Open water' };
  if (depth < 200) return { name: 'SUNLIGHT ZONE', subtitle: 'Epipelagic' };
  if (depth < 1000) return { name: 'TWILIGHT ZONE', subtitle: 'Mesopelagic' };
  if (depth < 4000) return { name: 'MIDNIGHT ZONE', subtitle: 'Bathypelagic' };
  if (depth < 6000) return { name: 'ABYSSAL ZONE', subtitle: 'Abyssopelagic' };
  if (depth < 10500) return { name: 'HADAL ZONE', subtitle: 'Hadalpelagic · Mariana Trench' };
  return { name: 'CHALLENGER DEEP', subtitle: 'Earth\'s Deepest Seafloor · 11,000 m' };
}

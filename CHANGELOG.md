# Changelog

User-visible changes to DESCENT are recorded here. Add new work under **Unreleased** when it is completed. Keep entries short and grouped as Added, Changed, Fixed, or Removed. Move those entries to a dated version section when the project version is bumped.

## Unreleased

### Added

- Dynamic mouse scroll wheel and two-finger touch pinch camera zoom (55%–185%) with smooth exponential approach, interactive HUD zoom percentage badge, and quick `Z` key reset.
- Interactive creature taxonomy tooltips and HUD identification tags displaying species names and classification categories on proximity or mouse hover, toggleable with <kbd>T</kbd> and in pause settings.
- Major marine megafauna and deep-sea organisms across depth tiers: pods of Bottlenose Dolphins, diving Harbor Seals, Pelagic Apex Sharks, and massive Blue Whales in the sunlight zone (0–200 m); Giant Pacific Octopuses, deep-diving Sperm Whales, and Dumbo Octopuses in the twilight zone (200–1,000 m); and ancient Bluntnose Sixgill Sharks, Barreleye Fish, Gulper Eels, Giant Squids, and Deep-Sea Dragonfish in the midnight abyss.
- Expanded continuous vertical ocean expedition depth from 1,000 m down to 2,000 m, featuring a midwater 1,000 m bathypelagic gateway sensor node, deep-sea bathypelagic fauna, and an abyssal seabed at 2,000 m with active hydrothermal black smoker chimneys and glass sponges.
- Multi-layered procedural Web Audio soundscape with dynamic zone-specific acoustic synthesis: bright open-air wave crest wash at surface, gentle epipelagic flow, mesopelagic hydrostatic damping, crushing 32 Hz sub-bass pressure resonance in the midnight abyss, convective hydrothermal vent hiss near 2,000 m, and procedural acoustic transition chimes when crossing zone boundaries.
- Depth-tiered ambient marine biomass gradient that transitions from dense surface schooling fish, gliding manta rays, and moon jellies in the sunlight zone (0–200 m), to crown jellies, ctenophores, siphonophores, and lanternfish in the twilight zone (200–750 m), down to sparse phantom jellies, anglerfish silhouettes, and benthic tripod fish in the midnight abyss.
- Seamless horizontal wrapping for all ambient wildlife so creatures continuously populate the ocean regardless of lateral submersible travel.
- Multi-part animated vampire squid hero illustration with undulating apical fins, breathing web cloak, cyan photophores, and sensory feeding filaments.
- Detailed DSV-1 research submersible with interior cockpit illumination, pilot silhouette, manipulator arm, and cavitation thruster bubbles.
- 2,000 m abyssal ocean floor horizon with basalt ridges, hydrothermal vent plumes, and glass sponge silhouettes.
- 1,000 m bathypelagic gateway chime and 2,000 m benthic floor milestone notification celebrating completion of the descent.
- Dynamic Web Audio API soundscape with depth-dependent hydrostatic lowpass filtering, thruster motor hum, active scan telemetry, discovery chime, and dedicated mute toggle (`M`).
- Sonar contact acoustic echo return chirping when a target is detected within sonar range.
- Interactive Flight Manual controls modal (`?` or `H`) and surface flight objective briefing card.
- Field Journal scientific specimen plate SVG diagram with anatomical callouts and expedition depth statistics.
- Responsive on-screen touch controls (virtual D-pad and action triggers) for mobile and tablet devices.
- Playable 2D side-view ocean with a drawn submersible, surface and sun, depth-based color, particles, ambient wildlife, and a vampire squid illustration.
- Keyboard rise, dive, and horizontal drift controls without mouse capture.

### Changed

- Enhanced sonar with audible echo return and proximity radar contact feedback.
- Polished specimen scanning feedback with real-time telemetry audio sweep and discovery chime.
- Reduced the first-release plan to a focused surface-to-1,000 m expedition.
- Adapted the sonar, scan, journal, settings, and debug controls to the side view.
- Clarified that decorative wildlife is simulated and that the vampire squid illustration is enlarged for visibility.

### Fixed

- Flight Manual layout and key binding column alignment across all system cards.
- Modal light-dismiss on background backdrop click for pause, journal, and manual dialogs.

### Removed

- Three.js, the 3D ocean shader, glTF tooling, and the temporary animated shark model from the shipped project.

## 0.1.0 — 2026-09-25

### Added

- Initial browser prototype with a 3D surface-to-1,000 m descent, sonar, a vampire squid scan, and a sourced journal entry.
- An explorable sunlit surface and animated water.

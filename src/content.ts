export const vampireSquid = {
  id: 'vampire-squid',
  name: 'Vampire squid',
  scientificName: 'Vampyroteuthis infernalis',
  depth: '600–900 m',
  habitat: 'Midwater · twilight zone',
  description: 'A deep-water cephalopod that gathers falling organic material called marine snow with two long feeding filaments.',
  detail: 'Its arm tips can emit blue light when threatened. The side-view illustration is enlarged for visibility and is not to scale.',
  source: {
    title: 'MBARI · Vampire squid',
    url: 'https://www.mbari.org/animal/vampire-squid/',
    publisher: 'Monterey Bay Aquarium Research Institute',
    accessedOn: '2026-09-25',
  },
} as const;

export function zoneAt(depth: number): { name: string; subtitle: string } {
  if (depth < 1) return { name: 'OCEAN SURFACE', subtitle: 'Open water' };
  if (depth < 200) return { name: 'SUNLIGHT ZONE', subtitle: 'Epipelagic' };
  if (depth < 1000) return { name: 'TWILIGHT ZONE', subtitle: 'Mesopelagic' };
  return { name: 'MIDNIGHT ZONE', subtitle: 'Bathypelagic' };
}

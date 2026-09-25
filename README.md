# DESCENT

A small, playable 2D side-view ocean expedition. [spec.md](spec.md) contains the reduced release plan, [CHANGELOG.md](CHANGELOG.md) tracks project changes, [film/README.md](film/README.md) documents the narrated short film, and [spec-original.md](spec-original.md) archives the earlier large 3D concept.

## Run

```sh
npm install
npm run dev
```

Open the URL printed by Vite. `npm run build` produces a static site in `dist/`.

## Play

- A / D or left / right arrows: drift sideways.
- W / S or up / down arrows: rise and dive. Space / Shift also work.
- R: sonar. E: scan a nearby specimen. J: journal. F: light. Esc: pause.
- F1: development depth control.

Travel from the surface to 1,000 m. A vampire squid encounter appears near 650 m and unlocks a sourced journal entry when scanned. The [MBARI vampire squid profile](https://www.mbari.org/animal/vampire-squid/) supports that entry. The animal illustration is enlarged for visibility. Decorative fish and jellies are simulated scenery.

The app uses TypeScript, Canvas 2D, and local browser storage. It has no 3D model downloads, account, backend, or analytics. Pressure and ambient-light readings are illustrative approximations.

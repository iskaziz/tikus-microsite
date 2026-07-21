# TIKUS Beat — Rhythm Game Update

## Confirmed integration

This package is based on the current `main` branch structure of `iskaziz/tikus-microsite`.

Existing files retained without replacement:

- `css/styles.css`
- `css/animations.css`
- `css/game.css`
- `js/content-data.js`
- `js/modal-controller.js`
- `js/scene-controller.js`
- `js/app.js`
- `js/tikus-logic-game.js`
- all existing image assets

New files:

- `css/rhythm-game.css`
- `js/tikus-rhythm-game.js`

Replacement file:

- `index.html` — adds only the rhythm-game stylesheet and script references.

## Gameplay

- Five vertical lanes.
- Five matching controls.
- 60-second rounds.
- Tempo and note travel speed increase throughout the round.
- Timing judgements: Perfect, Great, Good and Okay.
- Combo scoring and maximum-combo result.
- Wrong inputs and passed notes count as misses.
- Local best score saved in `localStorage` when available.
- Touch, pointer and keyboard controls.
- Keyboard mappings: `1–5` and `A–G`.
- Escape closes the game.
- Reduced-motion mode removes decorative movement and impact animations while retaining the essential note movement needed to play.

## Hotspot

The new hotspot is added at runtime to the Sitting Room without replacing TIKUS Rush.

Current percentage position:

```js
x: 55,
y: 78
```

This places it around the central coffee-table area of the approved Sitting Room illustration. Adjust only these percentage values in `js/tikus-rhythm-game.js` if the final clickable prop changes.

The Sitting Room will now display four hotspots because the new instruction adds a second game without replacing the existing three interactions.

## Replacing the five shapes later

Edit only the `SYMBOLS` array near the top of `js/tikus-rhythm-game.js`:

```js
const SYMBOLS = Object.freeze([
  Object.freeze({
    id: 'object-one',
    label: 'Accessible object name',
    text: '',
    image: 'assets/images/ui/object-one.webp'
  }),
  // four more entries
]);
```

Use one transparent WebP or PNG image per object. Keep each image visually centred inside a square canvas. The same configured artwork automatically appears on falling notes, control buttons and the instruction legend.

Do not add plot-revealing object names to `label` until those objects are approved for spoiler-safe marketing.

## Upload

Upload the package contents into the repository root while preserving folders:

```text
/index.html
/css/rhythm-game.css
/js/tikus-rhythm-game.js
```

No build step or backend is required. The game works through the existing static-site architecture and does not replace TIKUS Rush.

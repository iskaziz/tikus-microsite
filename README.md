# TIKUS — Official Film Microsite

A fast-loading static microsite for the Malaysian feature film **TIKUS**, produced by Feisk Productions.

The deployed package contains spoiler-safe promotional material only. No screenplay, production PDF or confidential working file is included.

## Run locally

Open `index.html` directly in a current browser. No server, build command, package manager or framework is required.

The official trailer is loaded from YouTube only after the visitor deliberately opens it. The house explorer, cast cards and both arcade games work locally.

The same folder can be uploaded unchanged to GitHub Pages or ordinary static hosting.

## Project structure

```text
/
  index.html
  README.md
  ASSET-MANIFEST.md
  MERGE-NOTES.md
  VALIDATION.md
  /assets/images
    /title
    /characters
    /scenes
  /css
    styles.css
    animations.css
    arcade.css
    tikus-rush.css
    tikus-beat.css
  /js
    content-data.js
    app.js
    scene-controller.js
    modal-controller.js
    tikus-rush-game.js
    tikus-beat-game.js
    arcade-controller.js
```

## Main experience

- CSS-generated concentric crimson rings and approved TIKUS title artwork.
- Retro television presentation for the official trailer, without autoplay.
- Eight keyboard-operable cast and character flip cards, grouped as Hosts, Guests and The Inspector.
- Character cards open on the illustrated character side.
- Compact horizontally scrolling cards and reduced section spacing on narrow screens.
- Responsive 16:9 House → Sitting Room explorer using `object-fit: contain`.
- Exactly three percentage-positioned hotspot buttons in the Sitting Room.
- Scene-specific light, rain, dust and print-texture treatments.
- URL hash state for `#house` and `#sitting-room`.
- Accessible information and arcade dialogs with focus trapping, Escape handling and focus restoration.

## TIKUS Arcade

The Sitting Room contains one shared **TIKUS Arcade** hotspot. It replaces the former `main-sofa` hotspot at runtime, preserving exactly three visible hotspots.

The shared controller routes directly from `scene-controller.js`; it does not override or wrap the core information-modal controller.

### Tikus Rush

- 30-second mouse-catching challenge.
- Grey mice score 2 points; gold mice score 10 points.
- Progressive spawn speed and occasional double waves.
- Score, best score and streak display.
- Concentric-ring drift, moving light beams, dust, score bursts, gold flashes and final-ten-second intensity.
- Pointer, touch and keyboard-accessible mouse buttons.
- Best score stored under `tikus-rush-best-v2`.

### Tikus Beat

- 60-second five-lane visual rhythm challenge.
- Placeholder shapes can later be replaced with approved film objects.
- Tap lanes or use `1–5` / `A–G` keyboard controls.
- Perfect, good and miss judgements, combo scoring and progressive tempo tiers.
- Falling-note glow, lane flashes, judgement bursts, tempo callouts, stage lights and final frenzy treatment.
- Best score stored under `tikus-beat-best-v2`.

Both games are explicitly non-canonical and spoiler-safe.

## Editing content

Scene labels, image paths and percentage hotspot coordinates are stored in `js/content-data.js`.

```js
{
  id: 'example-hotspot',
  x: 42,
  y: 58,
  label: 'Explore the example object',
  subject: 'Example object',
  eyebrow: 'SECTION LABEL',
  title: 'Panel title',
  body: 'Panel text.'
}
```

Do not place confidential or spoiler-sensitive material in deployed JavaScript, HTML comments, alt text, metadata or filenames.

## Accessibility and motion

- House controls, hotspots, cast cards, game cards, game lanes and mice are native buttons.
- Main controls have visible `:focus-visible` states and mobile-sized targets.
- Dialogs trap focus, close with Escape and restore focus to their trigger.
- Background sections become inert while a dialog is open.
- `prefers-reduced-motion: reduce` disables or simplifies continuous and feedback animation.
- Game status changes use live regions and visible text, not colour alone.

## Image delivery

Only the title and house artwork are preloaded. The Sitting Room is prefetched when a visitor approaches or focuses the house-entry control.

Scene artwork includes 960-pixel and 1600-pixel AVIF, WebP and JPEG derivatives. Character portraits include 480-pixel and 720-pixel AVIF, WebP and JPEG derivatives.

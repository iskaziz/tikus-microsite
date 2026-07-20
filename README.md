# TIKUS — Official Film Microsite

A static, single-page cinematic microsite for the Malaysian feature film **TIKUS**, produced by Feisk Productions.

The public package contains spoiler-safe promotional material only. The screenplay, production PDFs and source working archives are deliberately excluded.

## Run locally

Open `index.html` directly in a current browser. No server, build command, package manager or internet connection is required for the site and house explorer.

The official trailer is hosted by YouTube and is loaded only after the visitor selects the television. All other primary interactions work locally.

The same folder can be uploaded unchanged to GitHub Pages or ordinary static hosting.

## Project structure

```text
/
  index.html
  README.md
  ASSET-MANIFEST.md
  MERGE-NOTES.md
  VALIDATION.md
  /assets
    /images
      /title
      /characters
      /scenes
      /thumbnails
      /ui
    /audio
  /css
    styles.css
    animations.css
    game.css
  /js
    content-data.js
    app.js
    scene-controller.js
    modal-controller.js
    tikus-logic-game.js
```

## Main experience

- CSS-generated concentric crimson rings and approved TIKUS title artwork.
- Retro television presentation for the official trailer, without autoplay.
- Nine keyboard-operable cast and character flip cards, with seven approved character portraits on the reverse sides.
- Responsive 16:9 house explorer using `object-fit: contain`.
- Sitting Room, Kitchen and Orchid Room selection through three thumbnails.
- Exactly three percentage-positioned hotspot buttons in every room.
- Scene-specific light, rain, dust and print-texture treatments.
- URL hash state for `#house`, `#sitting-room`, `#kitchen` and `#orchid-room`.
- Accessible information dialogs with focus trapping, Escape handling and focus restoration.

## Gelap di Samasihat

`Gelap di Samasihat` is an explicitly spoiler-safe, non-canonical deduction mini-game.

`js/tikus-logic-game.js` replaces the Sitting Room `main-sofa` hotspot at runtime with the game hotspot. This keeps the room at exactly three hotspots without changing the scene controller’s underlying architecture.

The game includes:

- Three unlockable levels.
- Character × Room and Character × Object grids for every level.
- Blank, possible, ruled-out and confirmed cell states.
- Automatic row and column elimination after confirming a match.
- Keyboard-operable cells and trapped dialog focus.
- A How to Play introduction, hints, resets and saved progress.
- Wrong-answer feedback, solved-state ring flash and evidence summaries.
- Mobile-contained horizontal grid scrolling.
- `localStorage` progress under `tikus-logic-game-progress-v5`.

Keep the script order at the end of `index.html`: core application scripts first, followed by `js/tikus-logic-game.js`.

## Editing content

Room copy, image paths and percentage hotspot coordinates are stored in `js/content-data.js`.

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

## Accessibility

- Native buttons are used for thumbnails, hotspots, cast cards, grid cells and dialog controls.
- Main controls have visible `:focus-visible` states and mobile-sized hit targets.
- Dialogs trap focus, close with Escape and restore focus to their trigger.
- Background sections become inert while a dialog is open.
- Main scenes and thumbnails include useful alt text.
- `prefers-reduced-motion: reduce` disables or simplifies continuous and transition animation.
- Game state symbols are accompanied by text labels and accessible names.

## Image delivery

Only title and house artwork are preloaded. Room artwork and thumbnails load lazily or on interaction.

Main scenes include 960-pixel and 1600-pixel AVIF, WebP and JPEG derivatives. Character portraits include 480-pixel and 720-pixel AVIF, WebP and JPEG derivatives. The stage declares a 16:9 ratio before loading to avoid layout shift. See `ASSET-MANIFEST.md` for the complete inventory.

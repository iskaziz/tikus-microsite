# TIKUS — Official Film Microsite

A fast, static, single-page house explorer for the Malaysian feature film **TIKUS**, produced by Feisk Productions.

The public site uses only the approved spoiler-safe material. The screenplay and source PDFs are deliberately excluded from this package.

## Run locally

Open `index.html` directly in a modern browser. No server, build command, package manager or internet connection is required.

The same folder can be published unchanged to GitHub Pages or any ordinary static web host.

## Project structure

```text
/
  index.html
  README.md
  /assets
    /images
      /title
      /scenes
      /thumbnails
      /ui
    /audio
  /css
    styles.css
    animations.css
  /js
    content-data.js
    app.js
    scene-controller.js
    modal-controller.js
```

## Interaction model

- The opening title sits over CSS-generated concentric crimson rings.
- Scrolling reveals the Samasihat house exterior.
- Three thumbnails select the Sitting Room, Kitchen and Orchid Room.
- Room changes use a short radial iris transition.
- Each room contains exactly three percentage-positioned hotspot buttons.
- Hotspots open an accessible modal on desktop and a bottom sheet on mobile.
- The current scene is preserved in the URL hash:
  - `#house`
  - `#sitting-room`
  - `#kitchen`
  - `#orchid-room`
- Browser Back and Forward restore previous scene states.

## Accessibility

- Native buttons are used for every thumbnail, hotspot and control.
- All tap targets are at least 44 × 44 CSS pixels.
- Focus moves into the information panel when it opens.
- Focus is trapped while the panel is open and restored to the originating hotspot when it closes.
- Escape closes the panel.
- Background content is inert while the panel is open.
- Visible `:focus-visible` styling is included.
- `prefers-reduced-motion` disables the iris, grain motion, ring breathing and hotspot pulses.
- All main scenes include descriptive alternative text.

## Image delivery

Only the title and house exterior are preloaded.

Main scenes include responsive 960 px and 1600 px derivatives in:

- AVIF
- WebP
- Progressive JPEG fallback

Room thumbnails load lazily. Main room scenes are only swapped into the stage when selected, with a lightweight prefetch on thumbnail hover, focus or touch.

The scene stage declares its aspect ratio before images load to prevent layout shift. The image uses `object-fit: contain`, and JavaScript calculates the displayed image rectangle so percentage hotspots remain aligned if letterboxing occurs.

## Editing room copy and hotspots

All scene copy, image paths and hotspot coordinates are in:

```text
js/content-data.js
```

Coordinates use percentages:

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

Do not add spoiler material to the deployed data file, HTML comments, alternative text or metadata.

## Placeholder material

The closing information section intentionally identifies the following as unavailable rather than inventing details:

- Trailer URL
- Release date
- Social media URL
- Cast portrait
- Press-kit download

Replace those labels only after approved production material is supplied.

## Browser support

The project targets current versions of Chrome, Edge, Firefox and Safari. The native `<dialog>` element is used for the information panel. No third-party scripts, web fonts, analytics or autoplaying media are included.

## Gelap di Samasihat logic game

The Sitting Room sofa hotspot is replaced at runtime by `js/tikus-logic-game.js`, which opens a three-level, spoiler-safe and non-canonical deduction game. Its dedicated styles are in `css/game.css`.

The game now includes:

- Character × Room and Character × Object grids
- saved progress through `localStorage`
- a How to Play intro overlay
- illustrated room and object header icons
- silent red feedback for unsuccessful checks
- a solved ring-flash and level-complete summary card

Keep `js/tikus-logic-game.js` after the main application scripts in `index.html` because it patches the existing modal and Sitting Room hotspot at runtime.

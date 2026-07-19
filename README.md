# TIKUS — Official Film Microsite

A fast, static, single-page cinematic microsite for the Malaysian feature film **TIKUS**, produced by Feisk Productions.

The public site uses only approved spoiler-safe material. The screenplay and source PDFs are deliberately excluded from this package.

## Run locally

Open `index.html` directly in a modern browser. No server, build command or package manager is required.

The title and house explorer work from local files. An internet connection is required only when the visitor chooses to play the YouTube-hosted trailer.

The folder can be published unchanged to GitHub Pages or any ordinary static web host.

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

- The opening title sits over clearly perceptible, slowly drifting CSS-generated concentric crimson rings.
- The next section presents the official trailer within a CSS-illustrated retro television.
- The YouTube iframe is not created or loaded until the television is selected.
- Closing the trailer removes the iframe source and immediately stops playback.
- A themed tabletop presents nine accessible playing cards for the cast and their film characters.
- Selecting a card flips it in place; selecting it again returns to the cast profile.
- Portraits and descriptions are explicit placeholders until approved material is supplied.
- The Samasihat exterior follows in a responsive 16:9 stage.
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

## Scene atmosphere

Atmosphere is created with lightweight but clearly visible CSS overlays and image-filter shifts rather than canvas or video:

- Exterior: diagonal rain and an occasional restrained sky glow.
- Sitting Room: warm lamp flicker and slowly drifting dust.
- Kitchen: subtle overhead-light irregularity, rain near the rear doorway and dust.
- Orchid Room: a slow bedside-lamp glow and more visible dust.

The layers use opacity, transforms and gradients. They do not alter hotspot positioning or crop the artwork.

## Accessibility

- Native buttons are used for every cast card, thumbnail, hotspot, trailer control and close control.
- All tap targets are at least 44 × 44 CSS pixels.
- Focus moves into each open dialog.
- Focus is trapped while a dialog is open and restored to the originating control when it closes.
- Escape closes both the trailer and information panel.
- Background content is inert while a dialog is open.
- Visible `:focus-visible` styling is included.
- `prefers-reduced-motion` disables the iris, card rotation, grain movement, ring motion, television interference, room flicker, rain movement, dust drift and hotspot pulses. Cast cards use an immediate face swap instead.
- All main scenes include descriptive alternative text.
- The trailer includes a direct YouTube link as a fallback.

## Image and media delivery

Only the title and house exterior are preloaded.

Main scenes include responsive 960 px and 1600 px derivatives in:

- AVIF
- WebP
- Progressive JPEG fallback

Room thumbnails load lazily. Main room scenes are only swapped into the stage when selected, with a lightweight prefetch on thumbnail hover, focus or touch.

The scene stage declares its aspect ratio before images load to prevent layout shift. The image uses `object-fit: contain`, and JavaScript calculates the displayed image rectangle so percentage hotspots remain aligned if letterboxing occurs.

The trailer uses YouTube's `youtube-nocookie.com` embed and loads only after an explicit visitor action. Playback still requires the visitor to use the YouTube player; no sound or video autoplays.

## Editing room copy and hotspots

All cast entries, scene copy, image paths, hotspot coordinates and trailer configuration are in:

```text
js/content-data.js
```

Trailer configuration:

```js
trailer: {
  youtubeId: '9sgXasrieAE',
  watchUrl: 'https://youtu.be/9sgXasrieAE',
  embedUrl: 'https://www.youtube-nocookie.com/embed/9sgXasrieAE?rel=0&modestbranding=1'
}
```

Cast entries use this structure:

```js
{
  id: 'qiu-qatina',
  actorName: 'Qiu Qatina',
  characterName: 'Mimi',
  actorPortrait: null,
  characterPortrait: null,
  actorDescription: 'Cast portrait and profile coming soon.',
  characterDescription: 'Character portrait and profile coming soon.'
}
```

Replace `null` with a relative image path after approved illustrated portraits are added. The cards are generated automatically; no HTML changes are required.

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

## Material still unavailable

The closing information section continues to identify the following as unavailable rather than inventing details:

- Release date
- Social media URL
- Press-kit download

## Browser support

The project targets current versions of Chrome, Edge, Firefox and Safari. Native `<dialog>` elements are used for the trailer and information panel; the cast cards use native buttons with `aria-pressed` state. No third-party scripts, web fonts, analytics or autoplaying media are included.

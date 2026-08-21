# TIKUS — Official Film Microsite

A fast-loading static microsite for the Malaysian feature film **TIKUS**, produced by Feisk Productions.

The deployed package contains spoiler-safe promotional material only. No screenplay, production PDF or confidential working file is included.

## Run locally

Open `index.html` directly in a current browser. No server, build command, package manager or framework is required.

The official trailer is loaded from YouTube only after the visitor deliberately opens it. The house explorer, cast cards and all three games work locally.

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
      /gallery
      /poster
      /scenes
      /games/tikus-beat
      /games/tikus-slider
    /audio
      tikus-beat-loop.opus
      tikus-beat-loop.mp3
  /css
    styles.css
    animations.css
    arcade.css
    tikus-rush.css
    tikus-beat.css
    tikus-slider.css
  /js
    content-data.js
    language-controller.js
    analytics.js
    gallery-controller.js
    cinema-data.js
    cinema-controller.js
    app.js
    scene-controller.js
    modal-controller.js
    tikus-rush-game.js
    tikus-beat-game.js
    tikus-slider-game.js
    arcade-controller.js
```



## Analytics

The live TIKUS microsite uses Google Analytics 4 measurement ID `G-7VN040G6K0`. Analytics is deliberately enabled only when the hostname is `feisk.com.my` or `www.feisk.com.my`; local `file://` testing and GitHub-hosted previews do not send analytics data.

Tracked campaign interactions include trailer opens, First Look engagement, cast profile opens, scene changes, EN/BM changes, cinema-state selections, cinema direction clicks, outbound links, and game opens/starts/completions. Game-completion events include score/result metadata appropriate to each game.

## English / Bahasa Malaysia

A compact EN/BM switch is fixed to the top-right corner. English is the default language and the visitor's choice is saved under `tikus-language-v1`. The switch updates the current page immediately without reloading or navigating to a duplicate page.

The shared `js/language-controller.js` translates:

- Main headings, synopsis, trailer controls, First Look gallery, Film Overview, cinema finder and final-information content.
- Cast groups, card instructions, descriptions and accessible flip-card announcements.
- House and Sitting Room names, image alternatives, hotspot labels and scene status messages.
- Tikus Rush, Tikus Beat and Tikus Slider instructions, controls, live feedback and results.
- Dialog labels, close controls, document title and metadata.

`<html lang>` and the language-switch `aria-checked` state update with the active language. Proper names, game names and approved title artwork remain unchanged. The venue name **Samasihat Wellness Retreat** is a fixed proper name and remains exactly the same in both English and Bahasa Malaysia.

## Main experience

- CSS-generated concentric crimson rings and approved TIKUS title artwork.
- Retro television presentation for the official trailer, without autoplay.
- Seven-image **First Look** gallery with responsive WebP/JPEG derivatives, keyboard navigation, swipe support and an accessible fullscreen viewer.
- **Film Overview** section before Meet the Cast, using the approved poster, supplied synopsis, production credits, cast list and IMDb link.
- Bottom information panel now carries the confirmed theatrical release date (3 September 2026), Instagram, Threads and campaign hashtags in the previously allocated release/social slots.
- Eight keyboard-operable cast profile cards in one responsive grid with no horizontal card-strip scrolling.
- Card fronts show the cast name and approved portrait artwork; selecting a card flips it to the cast biography.
- Supplied biographies are included for QIU QATINA, Y Mun, Fattah, Diana Ooi, Marsha, Iski Senna and Haiccal; only Harris remains marked as profile coming soon.
- **Where to Watch** state finder with 22 cinema locations across 13 Malaysian states/territories and deliberate external Google Maps links.
- Compact vertical spacing across the trailer, cast, explorer and final-information sections.
- Responsive 16:9 House → Sitting Room explorer using `object-fit: contain`.
- Exactly three percentage-positioned hotspot buttons in the Sitting Room.
- Scene-specific light, rain, dust and print-texture treatments.
- URL hash state for `#house` and `#sitting-room`.
- Accessible information and arcade dialogs with focus trapping, Escape handling and focus restoration.

## Sitting Room games

The Sitting Room contains exactly three direct game hotspots. The family console opens Tikus Beat, the inherited painting opens Tikus Slider, and the main sofa opens Tikus Rush.

The shared game-dialog controller routes each hotspot directly from `scene-controller.js`. It does not override the core information-modal controller and does not render an intermediate game-selection screen.

### Tikus Rush

- 30-second mouse-catching challenge.
- Grey mice score 2 points; gold mice score 10 points.
- Smooth Catmull–Rom movement with mice entering and leaving from all four edges.
- Continuous curved routes create diagonal runs, reversals and unpredictable vertical movement without waypoint snapping.
- Enlarged invisible tap areas and immediate `pointerdown` response for mouse and touch input.
- Escaped mice only soften the streak instead of resetting it completely.
- Score, best score and streak display.
- Approved ceramic kitchen-floor backdrop with restrained grain/dust, score bursts, gold flashes and final-ten-second intensity.
- Native mouse buttons remain keyboard accessible.
- Best score stored under `tikus-rush-best-v2`.


### Tikus Slider

- 3 × 3 sliding painting puzzle.
- Guaranteed-solvable shuffle generated through legal moves.
- Pointer, touch and keyboard-arrow controls.
- Hold-to-preview control, timer, move count and locally saved best result.
- Responsive 4:3 artwork without cropping.
- Best result stored under `tikus-slider-best-v1`.

### Tikus Beat

- 60-second five-lane visual rhythm challenge.
- Five approved illustrated weapon-object icons replace the former geometric placeholders.
- Tap lanes or use `1–5` / `A/S/D/F/G` keyboard controls.
- Slower note travel and wider perfect/good judgement windows.
- Pointer input is handled on `pointerdown`, with a short early-input buffer.
- Empty taps are not penalised, and a missed note trims rather than erases the combo.
- Judgement timing follows the note’s rendered animation rather than an independent spawn clock.
- Approved rainy glass-window / moonlit-night backdrop with translucent black lanes, restrained print grain, beat-reactive pulses, lane flashes and tempo callouts.
- Every new 20-hit combo milestone triggers a visual blast that clears all visible weapon icons without counting them as misses.
- Procedural Web Audio effects play for every successful hit, five-hit combo milestone, 20-hit blast and final result.
- A subtle 24-second mono music loop is lazy-loaded only after the player presses Start. Opus is preferred, with an MP3 fallback.
- A persistent Audio on/off control is available in the Beat header; the setting applies to both music and sound effects and is stored locally.
- Audio pauses when the tab is hidden, resumes with the active round and never starts on page load.
- Best score stored under `tikus-beat-best-v2`.

All three games are explicitly non-canonical and spoiler-safe.

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

Scene artwork includes 960-pixel and 1600-pixel AVIF, WebP and JPEG derivatives. Character portraits include 480-pixel and 720-pixel AVIF, WebP and JPEG derivatives. First Look stills include 960-pixel and 1600-pixel WebP/JPEG versions plus lightweight thumbnail derivatives. The official poster uses 480-pixel and 670-pixel WebP/JPEG derivatives. The two game backdrops use 960/1672 WebP derivatives with JPEG fallbacks and remain game-lazy. Gallery stills and poster imagery remain lazy-loaded.

## Mobile puzzle interaction

The Tikus Slider board captures touch gestures inside the framed puzzle area. Browser panning, text selection, overscroll chaining and touch callouts are disabled only on the board and its tiles, so the surrounding game controls and page remain normally scrollable. A non-passive `touchmove` fallback is included for older mobile Safari behavior.


### Tikus Slider artist note
The painting puzzle includes an optional bilingual artist-information disclosure for M. Zain beneath the gameplay instructions. It is collapsed by default to keep the mobile game interface compact.

## v17 trailer and mobile First Look

The official trailer is configured as YouTube video `zP-A0q7aVko`. It remains privacy-enhanced and lazy: YouTube is not requested until the visitor opens the trailer. On mobile, First Look stills use the full available width and the enlarged viewer preserves each uncropped 16:9 frame without stretching its image box to the full portrait viewport height.

## v18 game backdrops

- **Tikus Beat:** uses the approved rainy glass-window / moonlit-night illustration as the gameplay backdrop. The five weapon objects are larger and higher contrast, and the former per-lane `HIT LINE` labels are replaced by one continuous, prominent hit line with a single centred label.
- **Tikus Rush:** uses the approved ceramic kitchen-floor illustration as the arena surface. The earlier vortex/ring layers are disabled so the floor remains readable beneath the mice.
- Both game backdrops are local responsive WebP assets with JPEG fallbacks and are requested only when their game DOM is mounted.


## Full Cast & Crew

The site includes a spoiler-safe full credits programme after Cinema Locations. The existing Meet the Cast portrait cards remain unchanged. Principal cast members are credited with their public character names, while potentially spoiler-sensitive supporting roles are grouped under Additional Cast without role labels. Crew credits are grouped by department and the section is linked from the hamburger navigation.

## v23 editorial + compact credits update
- Added a bilingual **Director's Intention** section between Film Overview and Meet the Cast.
- The Director's Statement is collapsed by default using accessible native `<details>/<summary>` controls.
- Added **Director's Intention** to the hamburger navigation.
- Full Cast & Crew remains two columns on desktop/tablet, with Cast and Crew side by side.
- Every cast/crew group is collapsed by default; opening one group closes the previously open group in the same column.
- Additional Cast remains spoiler-safe by listing performer names without potentially revealing supporting character labels.


### v24 visual credits update

- Qiu Qatina's Meet the Cast card now uses the approved supplied portrait photograph.
- The Full Cast & Crew masthead includes a responsive two-photo behind-the-scenes contact-sheet collage.
- Crew stills are lazy-loaded and remain separate responsive assets so the collage can adapt without cropping the page layout into a fixed composite.

### Filmmaker perspectives

The Film Overview is followed by a combined **From the Filmmakers** editorial section. It pairs a responsive behind-the-scenes photo collage with the Director's Intention, an expandable Director's Statement, and a shorter Producer's Statement. The section is bilingual and preserves the existing `#director-intention` anchor for compatibility.


## v26 filmmaker layout
The two filmmaker photographs now form a full-width masthead above the Director's Intention and Producer's Statement. Desktop keeps the statements in two columns beneath the imagery; mobile uses a compact stitched photo band followed by stacked copy.

### v28 Diana Ooi portrait

Diana Ooi's Meet the Cast card now uses the approved supplied photographic portrait, delivered as responsive 480/720 AVIF, WebP and JPEG derivatives.

### v30 Harris portrait

Harris's Meet the Cast card now uses the approved supplied photographic portrait, delivered as responsive 480/720 AVIF, WebP and JPEG derivatives.

### v31 principal cast update

Roshafiq Roslee is listed under Principal Cast. His public character/role label has not been supplied, so the credit intentionally displays his name without inventing a role. Additional Cast now contains seven names.
- v34: Replaced the Harris cast-profile placeholder with the approved Harris Andria biography in English and a Bahasa Malaysia translation.

### v35 filmmaker statement order

The **From the Filmmakers** section now follows a single editorial reading order beneath the full-width photo masthead: Director's Intention, expandable Director's Statement, Producer's Statement, then Executive Producer's Statement. The Executive Producer entry identifies Azizuddin Abdul Hamid and includes the approved bilingual statement.

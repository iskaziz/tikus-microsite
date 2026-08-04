# Validation report

Validation was performed against the complete packaged project without adding spoiler-sensitive story material.

## Static checks

- All 10 JavaScript files pass `node --check`.
- All 6 stylesheets parse without CSS syntax errors.
- `index.html` contains unique IDs and no missing local stylesheet, script, image or source references.
- All 126 packaged assets resolve through relative paths.
- No base64 asset, framework, build dependency, autoplay media or external animation library is present.
- The obsolete `js/tikus-logic-game.js` file remains absent.
- Saved results continue to use `tikus-rush-best-v2`, `tikus-beat-best-v2` and `tikus-slider-best-v1`.

## Direct game-dialog checks

- The Sitting Room renders exactly three runtime hotspots.
- Each hotspot opens one unique game directly: Beat, Slider or Rush.
- Rush, Slider and Beat remain independent modules behind the shared dialog controller.
- No intermediate game-selection hub is rendered.
- The core information modal is not wrapped or replaced.
- Closing a game removes the inert page state and restores focus to its originating hotspot.

## Tikus Rush motion and tuning checks

- Mice may enter and leave through the left, right, top or bottom edge.
- Five randomized route controls are sampled through a Catmull–Rom spline into approximately 54 animation keyframes.
- Keyframe offsets are proportional to cumulative spline distance, preventing visible speed spikes across curves and long diagonals.
- Continuous curved motion replaces the previous waypoint-to-waypoint direction changes.
- Movement is capped to a controlled range and no more than five mice remain active simultaneously.
- Mouse buttons use enlarged hit areas and `pointerdown` input.
- Score updates synchronously after pointer input.
- Escaped mice reduce the streak by one rather than resetting it.

Chromium samples showed smooth two-axis movement without waypoint snapping on both desktop and mobile while remaining below the former cross-screen sprint speed.

- The Rush background contains rotating radial/conic vortex layers.
- All continuous vortex animation resolves to `none` under reduced motion.

## Tikus Beat motion, blast and tuning checks

- Initial rendered note speed measured approximately 150–161 pixels per second across the tested viewports.
- Travel time now decreases gently from approximately 3.85 seconds to 2.95 seconds rather than the former 2.6-to-1.25-second curve.
- Spawn intervals remain between approximately 1.12 and 0.73 seconds, with rare double notes only late in the round.
- Perfect and good windows are widened to 185 ms and 470 ms.
- A 220 ms early-input buffer successfully converted a deliberately early pointer tap into a Good judgement.
- Empty lane taps are not penalised.
- A missed note reduces the combo by three rather than clearing it.
- Judgement timing uses each note animation’s actual rendered `currentTime`.
- Receptors respond on `pointerdown` for touch and mouse, while Enter/Space activation remains available through native button clicks.
- Pulse-ring, orbit-light and drifting background layers animate independently during ordinary play.
- Reaching a new 20-hit combo milestone removes every active weapon note without registering misses.
- A controlled browser test reached combo 20 with two active notes; both were cleared and the shockwave/particle treatment rendered.
- Beat background animations resolve to `none` under reduced motion while the note-clearing mechanic remains functional.

## Chromium layout and interaction checks

An in-memory Chromium route was used because direct local navigation is blocked by the execution environment administrator policy.

Tested at:

- 1440 × 900 desktop
- 390 × 844 mobile
- 390 × 844 with `prefers-reduced-motion: reduce`

Confirmed:

- Core microsite and House → Sitting Room navigation initialise.
- Exactly three Sitting Room hotspots render.
- Rush opens, moves unpredictably in both axes and scores immediately after a pointer catch.
- Beat opens, moves at the slower target speed and accepts a buffered early tap.
- Mobile page-level horizontal overflow is zero.
- Mobile card width is approximately 162 pixels at 390 pixels viewport width.
- Cast group card counts are `[2, 6]`, with Haiccal placed after the five Guests in the second row.
- Desktop card widths remain approximately 221–228 pixels.
- Desktop major-section top padding is approximately 58 pixels; mobile section padding is approximately 26–30 pixels.
- The explorer no longer reserves a full viewport height.
- Reduced-motion game alternatives initialise without JavaScript errors.

## Flicker and stutter regression — 2026-07-22

- Direct hotspot-to-game transitions retain a populated content node; no empty black transition frame.
- Chromium transition captures at 0 ms, 16 ms, 50 ms and 120 ms showed stable rendered game backgrounds for both Rush and Beat.
- Removed forced-layout animation restarts from Beat input, lane feedback, judgement, combo and tempo effects.
- Removed mobile-GPU-sensitive backdrop blur, mix-blend, full-stage filter flashes and masked rotating layers from the arcade games.
- Rush now uses one continuous spinning background layer plus mouse motion.
- Beat now uses two lightweight transform/opacity background layers plus falling notes.
- Sitting Room runtime hotspot count remains exactly three.
- Rush pointer input scored successfully in Chromium.
- Beat rendered-position judgement scored successfully in Chromium.
- Reduced-motion mode disables decorative background animation while retaining gameplay motion and inputs.
- No runtime errors were recorded during the interaction pass.

## Tikus Beat weapon-icon checks

- Five approved icons render in the numbered lane order.
- Responsive WebP sources load with transparent PNG fallbacks.
- Receptor, falling-note, instruction-guide and 20-hit blast instances use the same icon mapping.
- All source and derivative images contain true alpha transparency.
- Icon assets are referenced by local relative paths; no base64 data is present.
- Accessible lane labels retain the corresponding object name and keyboard controls.

## Tikus Beat themed-stage and sound checks

- JavaScript syntax passes `node --check`.
- The replacement Beat stylesheet parses without CSS syntax errors and has balanced braces.
- No `filter`, `backdrop-filter`, mask, blend-mode or base64 declarations were introduced in the Beat stylesheet.
- Five weapon lanes, rendered-position judgement, forgiving timing and the 20-hit clear remain in the game script.
- Audio uses a lazily created Web Audio context plus a detached `HTMLAudioElement`; both are unlocked directly from the Start or Audio-button gesture.
- Before Start, no music request is made. Pressing Start requested `assets/audio/tikus-beat-loop.opus` in Chromium; the MP3 remains a fallback.
- Chromium interaction tests recorded one music `play()` call on Start, one `pause()` call when Audio was disabled and a second `play()` call when it was re-enabled.
- A shortened-round browser regression generated procedural hit and final-score oscillators, loaded the loop, displayed the result screen and produced no page errors.
- Opus and MP3 files were verified with `ffprobe` as mono, approximately 24 seconds long and 133 KB / 189 KB respectively.
- Audio preference persists under `tikus-beat-sound-v1`; unsupported browsers receive a disabled, labelled control.
- Reduced-motion rules stop the decorative ring animation while preserving note travel, input and audio controls.


## Tikus Slider and direct hotspot validation

- Sitting Room contains exactly three hotspots and each routes to one unique game.
- Tikus Beat, Tikus Slider and Tikus Rush mount directly without an intermediate game-selection screen.
- Slider shuffle uses legal moves and is always solvable.
- Pointer, keyboard-arrow, preview, reset, completion, visibility pause and focus-return behaviour were checked.
- Puzzle artwork retains its 4:3 aspect ratio and is not cropped.

## Mobile puzzle scroll-lock validation

- Confirmed `.slider-game__stage-wrap`, `.slider-game__board` and `.slider-game__tile` use `touch-action: none`.
- Confirmed the board uses `overscroll-behavior: none` and blocks text selection/touch callouts.
- Confirmed the JavaScript fallback listener is non-passive and removed during game teardown.
- JavaScript syntax passed for every project script.
- CSS parsing passed for every stylesheet.
- Local static asset references passed.
- A live Chromium mobile navigation test was attempted but loopback navigation is blocked by the execution environment administrator; no browser-runtime claim is made from that blocked test.

## Bilingual EN/BM validation

- English loads as the default when no preference is stored.
- The saved `tikus-language-v1` preference is applied before the first paint where available.
- The EN/BM switch updates `<html lang>`, `aria-checked`, page metadata and visible copy without reloading.
- Card faces retain their current flipped state when the language changes.
- House/Sitting Room state and exactly three hotspot buttons are preserved while labels update immediately.
- Tikus Rush, Tikus Beat and Tikus Slider launch with translated instructions, controls, live feedback and result text.
- Escape closes each game dialog and restores focus to the originating hotspot in both languages.
- Tested at 1440×900, 390×844 and 320×700, including reduced-motion mode and page-level horizontal-overflow checks.


## First Look gallery validation

- Added seven approved stills using uncropped 16:9 derivatives at 960 × 540 and 1600 × 900, plus 360 × 203 thumbnails.
- Gallery media adds approximately 2.05 MiB to the deployable package, while large images after Still 01 remain interaction-loaded rather than initial page requests.
- `js/gallery-controller.js` passes `node --check` and keeps the gallery separate from the existing trailer, information and game-dialog controllers.
- Thumbnail buttons, previous/next controls and the featured-image control are native keyboard-operable buttons.
- Featured-gallery left/right keys and horizontal swipe gestures change stills; the native fullscreen dialog adds Escape close and focus restoration to the opening control.
- The EN/BM dictionaries contain the same 209 translation keys, including gallery labels, live-status copy and seven image alternatives.
- All six stylesheets parse without CSS syntax errors; all ten JavaScript files pass syntax checks.
- `index.html` contains unique IDs and all referenced local scripts, stylesheets and gallery assets resolve.
- No base64 images, autoplay media or external gallery library was added.
- A Chromium screenshot pass was attempted in the execution environment, but the headless browser process did not complete; no visual-runtime claim is made from that blocked pass.

## Film-summary validation

- Official poster source confirmed at 670 × 992 with no alpha transparency.
- Generated 420-pixel and 670-pixel WebP/JPEG responsive derivatives; poster framing remains uncropped.
- Added bilingual summary labels, synopsis, release date, credits and accessibility text.
- Summary cast list contains the nine names supplied for the film-information section, including Roshafiq Roslee; existing interactive cast-card data was not modified.
- Removed the obsolete TBA film-information block from `index.html`.
- Static syntax, translation-key parity, unique-ID and local-reference checks are included in the final package validation.

- Final static validation passed with 226 matching EN/BM translation keys, 22 unique HTML IDs, three direct Sitting Room game hotspots, balanced CSS braces and no missing local references/base64 media.
- A final headless Chromium screenshot attempt was made for the new section, but the browser process did not complete within the execution timeout; no visual-runtime claim is made from that attempt.

## v14 cinema-map validation

- Confirmed 22 cinema records in `js/cinema-data.js`: 13 GSC, 6 TGV and 3 independent venues.
- Confirmed the state grouping matches the supplied release-list table; states/territories with no listed venue remain visually inactive on the schematic map.
- Verified all new local JS/CSS references exist and all JavaScript files pass `node --check`.
- Parsed all stylesheets with `tinycss2` with no CSS parse errors.
- Confirmed unique HTML IDs and no missing `data-i18n` keys referenced by the page.
- The map uses numbered markers plus state buttons, so venue availability is not communicated through colour alone.
- Mobile state controls are horizontally scrollable, cinema directions links retain touch-sized targets, and the results panel becomes non-sticky below 68rem.
- `prefers-reduced-motion` removes map-selection transitions.
- A headless Chromium visual pass was attempted in the execution environment but the process did not complete; no visual-runtime claim is made from that blocked pass.



## v15 cinema finder checks

- `Where to Watch / Lokasi Tayangan` appears after the House / Games explorer and before the footer.
- No cinema-map SVG, marker layer or state-chip interface remains in `index.html`.
- Native state selector contains all 13 screening areas and updates the venue panel without page navigation.
- All 22 venue records and 13 / 6 / 3 chain totals remain unchanged.
- EN/BM cinema finder labels and dynamic state names remain supported.

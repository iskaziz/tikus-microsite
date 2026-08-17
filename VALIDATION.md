# Validation report

Validation was performed against the complete packaged project without adding spoiler-sensitive story material.

## Static checks

- All 8 JavaScript files pass `node --check`.
- All 6 stylesheets parse without CSS syntax errors.
- `index.html` contains unique IDs and no missing local stylesheet, script, image or source references.
- All 84 packaged assets resolve through relative paths.
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

## Cast profile grid validation

- All eight cast IDs remain present and keyboard-operable.
- Front state is the default and contains cast name plus portrait/placeholder only.
- Reverse state contains the cast biography and a return-to-portrait prompt.
- English and Bahasa Malaysia dictionaries contain matching translation-key sets, including all supplied biographies.
- The cast container no longer uses horizontal overflow or scroll-snap rules.
- Responsive grid rules resolve to four, three and two columns at desktop, intermediate and mobile breakpoints respectively.
- JavaScript syntax passes `node --check` for every project script.
- `styles.css` parses without CSS syntax errors.
- All referenced local assets exist.
- Chromium layout navigation was attempted, but local and loopback navigation are blocked by the execution-environment administrator; no new live-browser claim is made for this amendment.

## First Look + Cinema restoration validation — 2026-08-06

- `node --check` passes for every JavaScript file.
- All CSS files parse successfully with `tinycss2`.
- All local HTML/CSS asset references resolve; no base64 media was introduced.
- English and Bahasa Malaysia dictionaries contain the same 205 translation keys.
- The current page contains one First Look section, one fullscreen gallery dialog and one cinema section.
- The First Look controller generates seven thumbnails, advances with next/previous controls, opens the native dialog and closes with Escape.
- The cinema state selector renders 13 states/territories plus its placeholder and the dataset contains exactly 22 venue records.
- Kuala Lumpur renders four venue cards in the restored state finder; Selangor renders four.
- The latest cast grid still renders eight cards and retains QIU QATINA/Fattah profile content.
- House → Sitting Room still resolves to exactly three direct game hotspots: Tikus Beat, Tikus Slider and Tikus Rush.
- An inline-resource Chromium regression pass was used because direct `file://` and loopback navigation are blocked by the execution-environment administrator. It passed at 1440×1000, 390×844, 320×740 and 390×844 with reduced motion, with no page errors and no page-level horizontal overflow.



## Film Overview validation — v14

- New `#film-overview` section is positioned after `#first-look` and before `#cast`.
- Supplied poster source confirmed as 670 × 992 and opaque; deployed poster files are 480/670 WebP and JPEG derivatives.
- Poster remains lazy-loaded and is not added to the preload list.
- English and Bahasa Malaysia dictionaries contain matching translation-key sets for all new Film Overview copy and accessibility labels.
- IMDb remains in Film Overview; Instagram and Threads are present only in the existing bottom Social media slot. All external links use HTTPS, open deliberately in a new tab and include `rel="noopener noreferrer"`.
- Bottom Release date displays `3 September 2026` in both EN and BM modes.
- Campaign hashtags appear with the bottom social links and no longer appear in Film Overview.
- Supplied campaign hashtags are visible and exposed to assistive technology.
- Production names and credits are reproduced from the user's supplied copy; no production facts were inferred from the screenplay.
- Responsive rules stack poster/content on narrow screens and retain `object-fit: contain` with no poster cropping.

## v16 validation
- Tikus Slider artist disclosure is rendered from `js/tikus-slider-game.js`.
- EN/BM artist copy is provided by `js/language-controller.js`.
- The disclosure is collapsed by default and introduces no new media requests.
- Mobile puzzle touch-action / scroll-lock rules remain unchanged.

## v17 validation
- Trailer content configuration uses YouTube ID `zP-A0q7aVko`; no reference to the previous trailer ID remains in deployed HTML/JS/docs.
- The direct fallback URL matches the user-supplied YouTube link.
- Trailer controller behavior remains lazy: `iframe.src` is assigned only inside the deliberate open action and removed again on close.
- Mobile First Look featured image uses intrinsic image height and remains uncropped.
- Mobile enlarged viewer uses intrinsic image height rather than a full-viewport-height image box; navigation arrows overlay the still.
- All seven restored First Look assets remain present at 16:9.
- `node --check` passes for every JavaScript file.
- `tinycss2` parses all CSS stylesheets without parse errors.
- All local HTML/CSS asset references resolve.

## v18 validation — game backdrops and Tikus Beat hit line

- Tikus Beat and Tikus Rush reference only the new local backdrop derivatives; both supplied source PNGs remain excluded from the package.
- Beat contains one `.beat__hit-line-label` element and no CSS-generated per-lane `HIT LINE` labels.
- Beat's continuous hit-line rule spans the full five-lane container at the same 20% target boundary used by the hit zones.
- Beat weapon notes/receptors/key guide retain the same approved five-icon mapping and input controls with larger display sizing only.
- Rush ring and beam layers resolve to `display: none`; mouse timing, paths and scoring logic are unchanged.
- JavaScript syntax, CSS parsing, translation-key parity and local asset references pass static validation.
- A headless Chromium interaction pass was attempted using the installed browser, but navigation is blocked by the execution environment administrator; no new live-browser claim is made for this amendment.

## v19 backdrop framing checks
- Confirmed Tikus Beat artwork paths resolve for 1672px WebP/JPEG and 960px WebP.
- Foreground backdrop uses `background-size: contain` with no image distortion.
- Dark cover underlay prevents empty letterbox areas on portrait/mobile stages.
- No JavaScript or game-state logic changed in this revision.


## v22 — Cast & Crew validation

- Full credits section order: Cinema Locations → Cast & Crew → Release & Socials.
- Principal cast: 8 character/actor pairings.
- Additional cast: 8 performer names with spoiler-sensitive role labels omitted.
- Crew: all supplied credits present and grouped by department.
- Hamburger navigation includes `#credits`.
- EN/BM credit UI keys are present in both dictionaries.
- No screenplay-derived role or story detail added.

## v23 — Compact credits validation
- Credits use native keyboard-operable `details/summary` controls; no new JavaScript dependency.
- Principal Cast and Production are the only groups marked `open` by default.
- Desktop credits remain a two-column Cast/Crew layout; <=52rem stacks to one column.
- All supplied cast/crew names are preserved from v22.
- Accordion toggle handling keeps at most one group open per Cast/Crew column.
- At <=52rem, the Crew column starts fully collapsed; Principal Cast remains the only initially expanded group.

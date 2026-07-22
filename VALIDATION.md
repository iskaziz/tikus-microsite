# Validation report

Validation was performed against the complete packaged project without adding spoiler-sensitive story material.

## Static checks

- All 7 JavaScript files pass `node --check`.
- All 5 stylesheets parse without CSS syntax errors.
- `index.html` contains unique IDs and no missing local stylesheet, script, image or source references.
- All 58 packaged assets resolve through relative paths.
- No base64 asset, framework, build dependency, autoplay media or external animation library is present.
- The obsolete `js/tikus-logic-game.js` file remains absent.
- Existing best scores continue to use `tikus-rush-best-v2` and `tikus-beat-best-v2`.

## Shared arcade checks

- The Sitting Room renders exactly three runtime hotspots.
- One shared TIKUS Arcade hotspot opens exactly two game choices.
- Rush and Beat remain independent modules behind the shared arcade controller.
- The core information modal is not wrapped or replaced.
- Closing the arcade removes the inert page state and restores focus to its originating hotspot.

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
- Reaching a new 20-hit combo milestone removes every active note without registering misses.
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

- Arcade hub-to-game transition retains a populated content node; no empty black transition frame.
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

## Repository audit and cleanup — 2026-07-22

A full repository audit (file/dependency map, dead-code and stale-documentation
check, static analysis) was performed against the current `main` branch.
Confirmed findings were fixed on the `audit-cleanup-performance` branch; this
section records what was checked and how.

### Dead code and stale documentation

- Confirmed via `grep` across `index.html`, every `js/*.js`, and every
  `css/*.css` that `js/tikus-logic-game.js`, `js/tikus-rhythm-game.js`,
  `css/game.css` and `css/rhythm-game.css` had zero references anywhere in
  the live site before deletion. **Passed.**
- Confirmed `preview.html` only referenced the dead files above and a fake
  modal stub, never the real `arcade-controller.js`. **Passed.**
- Cross-referenced every filename under `assets/images/` against literal and
  template-constructed (`imageSet()`/`characterPortraitSet()`) paths in
  `js/content-data.js`, plus every `.html`/`.css` file. `samasihat-kitchen-*`,
  `samasihat-orchid-room-*`, and all of `assets/images/thumbnails/` had zero
  matches. **Passed.**
- `node --check` passes on all 7 live JavaScript files after every commit in
  this pass. **Passed.**
- Brace-count parity confirmed for `arcade.css`, `tikus-rush.css` and
  `tikus-beat.css` after the CSS cleanup (open/close counts equal).
  **Passed.**

### Tab-visibility fix (`document.visibilitychange`)

- Confirmed by code reading that the fix correctly pauses each active
  mouse/note's Web Animation, clears the relevant per-object safety timer,
  and stops the spawn/clock timers on hide; and resumes animations, reschedules
  timers for their remaining duration, and re-bases `startTime` by the
  hidden duration on show. **Passed (static/code review).**
- Real-browser confirmation — switching tabs mid-round and confirming the
  clock/mice/notes resume at the expected position rather than jumping or
  freezing — was **not tested**. No headless browser tool was available in
  this environment for this pass. Recommend a manual check before merging:
  open either game, background the tab for several seconds mid-round,
  return, and confirm the round continues rather than having silently timed
  out or visibly jumped.

### Not yet covered by this pass

Responsive/viewport layout, accessibility (focus order, contrast, touch
target sizing), and a full performance pass on `styles.css`/`animations.css`
were out of scope for this cleanup pass and remain open per the audit's
Phase 2 repair order.

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

## Tikus Rush tuning checks

- Mice may enter and leave through the left, right, top or bottom edge.
- Routes include four random interior waypoints, producing diagonal movement, vertical turns and reversals.
- Keyframe offsets are proportional to cumulative route distance, preventing long path segments from creating sudden speed spikes.
- Movement is capped to a controlled range and no more than five mice remain active simultaneously.
- Mouse buttons use enlarged hit areas and `pointerdown` input.
- Score updates synchronously after pointer input.
- Escaped mice reduce the streak by one rather than resetting it.

Chromium samples showed clear two-axis movement during the first second on both desktop and mobile while remaining below the former cross-screen sprint speed.

## Tikus Beat tuning checks

- Initial rendered note speed measured approximately 150–161 pixels per second across the tested viewports.
- Travel time now decreases gently from approximately 3.85 seconds to 2.95 seconds rather than the former 2.6-to-1.25-second curve.
- Spawn intervals remain between approximately 1.12 and 0.73 seconds, with rare double notes only late in the round.
- Perfect and good windows are widened to 185 ms and 470 ms.
- A 220 ms early-input buffer successfully converted a deliberately early pointer tap into a Good judgement.
- Empty lane taps are not penalised.
- A missed note reduces the combo by three rather than clearing it.
- Judgement timing uses each note animation’s actual rendered `currentTime`.
- Receptors respond on `pointerdown` for touch and mouse, while Enter/Space activation remains available through native button clicks.

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
- Reduced-motion game alternatives initialise without JavaScript errors.

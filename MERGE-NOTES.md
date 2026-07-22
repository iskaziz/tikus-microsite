# Merge notes

## Source decision

The current public `main` branch of `iskaziz/tikus-microsite` was reviewed as the source of truth for the two newly added arcade games.

The latest feature-rich microsite state was retained: approved title treatment, trailer television, grouped character-first cards, compact mobile spacing, House → Sitting Room explorer, atmospheric overlays and three percentage-positioned Sitting Room hotspots.

The two repository games were then consolidated rather than allowing each script to modify the scene and modal systems independently.

## Shared arcade architecture

- One `tikus-arcade` hotspot replaces the former `main-sofa`/legacy game hotspot.
- Any extra legacy Rush, Beat or logic-game hotspot is removed at registration time.
- The Sitting Room remains exactly three hotspots: `family-console`, `art-display`, `tikus-arcade`.
- `js/scene-controller.js` now routes only `type: "arcade-hub"` to the shared arcade controller.
- Ordinary information hotspots continue to use the existing modal controller unchanged.
- No game wraps or replaces `modal.open()`.

## Files

Added:

- `js/arcade-controller.js`
- `js/tikus-rush-game.js`
- `js/tikus-beat-game.js`
- `css/arcade.css`
- `css/tikus-rush.css`
- `css/tikus-beat.css`

Removed:

- `js/tikus-logic-game.js`
- `css/game.css`

The misleading logic-game filename is therefore no longer used for Tikus Rush.

## Shared arcade visual treatment

### Tikus Rush

- Progressive mouse speed and spawn frequency.
- Occasional double waves later in the round.
- Continuously rotating radial/conic vortex and moving light beams.
- Film grain and floating dust.
- Hit particles and floating point values.
- Gold-mouse flash treatment.
- Streak callouts and final-ten-second intensity.

### Tikus Beat

- Five animated vertical lanes and glowing receptors.
- Progressive tempo tiers across the 60-second round.
- Pulse rings, orbital lighting, drifting stage layers, scrolling lane rails and scanlines.
- Perfect, good and miss judgement feedback.
- Lane flashes, combo flashes and tempo callouts.
- Every new 20-hit combo milestone clears all visible shapes through a shockwave and particle blast without registering misses.
- Final-frenzy intensity during the last ten seconds.

All major or continuous effects have reduced-motion alternatives.

## Preserved microsite amendments

- Hero eyebrow: “Welcome to Samasihat Wellness Retreat”.
- Approved spoiler-safe synopsis.
- Hosts: Que, Y Mun.
- Guests & The Inspector share one card row in this order: Fattah, Diana, Harris, Marsha, Iski, Haiccal.
- Character-facing cards visible first with Host, Guest or Inspector labels.
- No category label above cast names.
- Smaller mobile cards and further-reduced section spacing on both mobile and desktop.
- Only House and Sitting Room remain in the explorer.

## Forgiving gameplay tuning

### Tikus Rush

- Replaced predictable edge-to-edge passes with routes that may enter or leave from any edge.
- Five route control points are sampled through a Catmull–Rom spline, producing natural curves, reversals and vertical turns instead of jerky waypoint changes.
- Sample offsets are calculated from cumulative spline distance so speed remains consistent across curves and long diagonals.
- Overall mouse speed was reduced and capped; the active-mouse count prevents slower mice from overcrowding the arena.
- Mouse buttons now use a larger hit area and react on `pointerdown` for faster touch and mouse response.
- One escaped mouse reduces the streak by one rather than resetting it.

### Tikus Beat

- Increased note travel time and reduced spawn acceleration and double-note frequency.
- Expanded the perfect and good windows and added late grace after the note reaches the line.
- Added a short early-input buffer and removed penalties for empty lane taps.
- Misses reduce the combo rather than clearing it.
- Touch and mouse input now registers on `pointerdown`.
- Judgement reads the CSS animation’s actual `currentTime`, keeping scoring aligned with the rendered note even if a browser delays animation frames.

Existing best scores remain stored under the original v2 localStorage keys.


## Natural motion, combo blast and compact layout

- Rush now generates approximately 54 distance-normalised spline keyframes per mouse for smooth continuous motion.
- Rush uses a layered radial/conic vortex that rotates behind the arena while retaining readable mouse contrast.
- Beat adds independent pulse-ring, orbit-light and drifting backdrop layers.
- At every new 20-hit combo milestone, Beat removes all active notes as a celebratory explosion; cleared notes do not reduce score or combo.
- Mobile card width is approximately 162 pixels at a 390-pixel viewport, revealing more of the adjacent card as a scroll cue.
- The Inspector card sits in the same horizontally scrolling row as the five Guests.
- Desktop and mobile section padding, heading gaps and explorer spacing were reduced further.

## Flicker and stutter stability pass
- Removed the blank content clear between arcade hub and game mount.
- Removed backdrop blur and mix-blend layers that can flash black on mobile GPUs.
- Replaced forced-layout animation resets with Web Animations/transient overlays.
- Removed full-stage filter animations and masked rotating layers.
- Reduced Rush path keyframe density while retaining smooth curved motion.
- Batched and reduced Tikus Beat 20-hit explosion particles.

## Audit and cleanup pass — 2026-07-22

A repository audit found that several files this document and `VALIDATION.md`
already described as removed had, in fact, never been deleted from the repo,
plus a set of scene/thumbnail images that were never referenced by any live
code. This pass makes the repository match its own documentation.

### Removed (confirmed unreferenced by `index.html`, any live script, or any
current stylesheet)

- `js/tikus-logic-game.js`, `css/game.css` — the pre-consolidation Tikus Rush
  implementation. `VALIDATION.md` already asserted this file was absent; it
  wasn't, until now.
- `js/tikus-rhythm-game.js`, `css/rhythm-game.css` — the pre-consolidation
  Tikus Beat implementation described in the now-archived
  `RHYTHM-GAME-MANIFEST.md`. Undocumented in this file previously; this is
  the first record of its removal.
- `preview.html` — pointed at the two files above through a fake
  `window.TikusMicrosite.modal` stub and did not exercise the real
  `arcade-controller.js`. Not required for GitHub Pages deployment.
- `assets/images/scenes/samasihat-kitchen-*`, `samasihat-orchid-room-*`, and
  all of `assets/images/thumbnails/` — unreferenced anywhere in code or in
  `ASSET-MANIFEST.md`/`ASSET-CONTENT-MANIFEST.md`. The explorer has only ever
  used House and Sitting Room.

### Archived

- `UPLOAD-INSTRUCTIONS.md`, `RHYTHM-GAME-MANIFEST.md`,
  `VALIDATION-RHYTHM-GAME.md` moved to `docs/history/`. Each describes an
  earlier, incompatible integration stage (respectively: the original
  logic-game replacement, and the pre-shared-arcade four-hotspot rhythm
  integration). Kept for project history rather than deleted, but no longer
  in the repository root where they could be mistaken for current guidance.

### Fixed

- Neither live game listened for `document.visibilitychange`. Backgrounding
  the tab mid-round let the clock, spawn timers, and mouse/note animations
  keep running on wall-clock time. `tikus-rush-game.js` and
  `tikus-beat-game.js` now pause on hide and resume on show, re-basing
  `startTime` and any pending per-object timers by the hidden duration.
- `arcade.css`, `tikus-rush.css` and `tikus-beat.css` each carried a
  `backdrop-filter`/`mix-blend-mode` declaration that a later rule for the
  same selector already neutralised (`none`/`normal`), so the effective
  computed style was already correct, but the contradiction was fragile.
  Folded the final values into the base rules and removed the redundant
  overrides. No visual change.

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
- Every new 20-hit combo milestone clears all visible weapon icons through a shockwave and particle blast without registering misses.
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

## Approved Tikus Beat weapon icons

- Replaced the five CSS-drawn geometric placeholders with the supplied transparent illustrated object icons.
- Preserved the numbered lane order from the approved source archive.
- Added responsive 256px and 512px WebP assets with transparent PNG fallbacks.
- Kept the assets lazy to the arcade dialog; none are preloaded with the main page.
- Updated receptor labels, the introductory guide and the 20-hit blast to use the icon system.
- Retained tab-visibility pause/resume handling from the cleaned repository game scripts.

## Tikus Beat themed-stage and sound pass

- Replaced the neon/orbital stage treatment with the microsite’s crimson, black and warm-paper concentric-ring language.
- Reduced the backdrop to two low-overhead transform/opacity layers plus static print texture.
- Added a lightweight beat-reactive radial pulse behind the lanes.
- Added procedural Web Audio cues for Good and Perfect hits, five-hit combo milestones, 20-hit blasts and end-game results.
- Replaced the fragile sound-only implementation with one unified audio engine for procedural effects and background music.
- Added an original 24-second mono loop in Opus with an MP3 fallback; total fallback assets are approximately 322 KB.
- The loop uses `preload="none"` and is requested only when Start is pressed.
- Added a persistent accessible Audio on/off control stored under `tikus-beat-sound-v1`.
- Start, Audio toggle, tab pause/resume, round finish and dialog destruction all manage the music and Web Audio context together.
- Good/Perfect hits, five-hit combos, 20-hit blasts and end-game results have distinct procedural cues.


## Direct three-game hotspot integration

- Replaced the shared TIKUS Arcade hotspot with three direct Sitting Room game hotspots.
- Family console opens Tikus Beat.
- Inherited painting opens Tikus Slider.
- Main sofa opens Tikus Rush.
- Added `css/tikus-slider.css`, `js/tikus-slider-game.js` and responsive puzzle artwork under `assets/images/games/tikus-slider/`.
- Reworked `js/arcade-controller.js` into a direct game dialog controller; no game-selection hub is rendered.
- Preserved exactly three percentage-positioned hotspot buttons and focus restoration to the selected room hotspot.

## Slider mobile scroll-lock amendment

- Changed the puzzle frame, board and tiles from permissive touch handling to `touch-action: none`.
- Added `overscroll-behavior: none`, disabled selection and suppressed the iOS touch callout inside the board.
- Added a scoped non-passive `touchmove` fallback that calls `preventDefault()` only for gestures originating within the puzzle board.
- Normal page scrolling remains available outside the puzzle frame.


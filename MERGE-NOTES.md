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

## English / Bahasa Malaysia language setting

- Added `js/language-controller.js` with English and Bahasa Malaysia dictionaries.
- Added a fixed top-right EN/BM switch using a native button with `role="switch"`.
- English remains the default; the selected language is stored under `tikus-language-v1`.
- Static page copy, scene labels, cast-card content, dialog controls and all three game interfaces update immediately without a reload.
- Dynamic ARIA labels, live-region announcements, image alternatives, metadata and the document title are translated.
- Scene/hash state, card flip state, saved game progress and audio preferences are preserved when the language changes.
- No duplicate HTML pages, external translation service or additional media assets were introduced.

## Cast profile grid amendment

- Replaced the Hosts / Guests & Inspector horizontal card groups with one responsive cast grid.
- Removed character names, role/category labels and character-profile copy from the card UI.
- Card fronts now show only cast name, portrait artwork and a small profile prompt.
- Card backs now show the supplied actor biography and retain EN/BM switching.
- Added supplied copy for Y Mun, Diana Ooi, Marsha, Iski Senna and Haiccal without inventing biographies for Que, Fattah or Harris.
- Diana Ooi and Iski Senna now use the full display names supplied with their profiles.
- Layout uses four columns on desktop, three at intermediate widths and two on mobile, with no horizontal panning.

## 2026-08-06 — First Look and Cinema restoration

- Restored the seven-image First Look gallery that was introduced in repository history at commit `36234b9`.
- Restored the compact 22-location cinema state finder refined at commit `75b3b4b`.
- Inserted First Look between Trailer and Cast, and Cinema Locations after the House/Games explorer.
- Preserved the latest direct three-game hotspot routing, hybrid Tikus Beat audio, bilingual EN/BM controller, mobile slider scroll lock and cast-profile grid.
- Preserved the latest QIU QATINA and Fattah profile copy; Harris remains the only profile placeholder.
- Added EN/BM copy and accessible labels for both restored sections without adding a second page or framework.



## Film Overview + official poster — v14

- Added a new bilingual Film Overview / Maklumat Filem section between First Look and Meet the Cast.
- Uses the supplied TIKUS poster as the focal artwork with responsive WebP/JPEG derivatives and `loading="lazy"`.
- Added the supplied Bahasa Malaysia synopsis and a faithful English translation.
- Added supplied production credits for director, screenplay, producers, executive producers, production company and full cast list.
- Added the deliberate external IMDb link in Film Overview.
- Moved Instagram, Threads and the supplied campaign hashtags to the existing bottom Social media slot.
- Replaced the bottom release-date placeholder with the confirmed theatrical date: 3 September 2026.
- Updated the First Look continuation link to flow into Film Overview, then onward to Meet the Cast.
- No existing gallery, cast, cinema, house, game, language or audio feature was removed.

## v16 — Tikus Slider artist context
- Added a compact `About the artist` / `Tentang artis` disclosure inside Tikus Slider, beneath the game instructions.
- Added the supplied M. Zain biography as two paragraphs in English.
- Added a Bahasa Malaysia translation through the existing language controller.
- Kept the disclosure collapsed by default so the mobile puzzle controls remain compact and the puzzle board scroll-lock behaviour is unchanged.

## v17 — official trailer + mobile First Look refinement
- Updated the official trailer configuration to YouTube video `zP-A0q7aVko` and retained privacy-enhanced `youtube-nocookie.com` embedding.
- Preserved lazy loading: the iframe receives its `src` only after the visitor deliberately opens the trailer dialog.
- Updated the direct YouTube fallback link to the supplied URL.
- Reduced apparent black/empty space in the First Look experience on mobile by allowing the inline still to run edge-to-edge within the section.
- Removed the forced full-height image box in the enlarged mobile viewer; stills now render at their intrinsic 16:9 height without cropping.
- Moved enlarged-view previous/next controls over the image on mobile so they no longer consume image width.
- Tightened mobile filmstrip and gallery spacing while preserving keyboard, swipe, dialog and reduced-motion behavior.

## v18 — approved game backdrops and Beat target clarity

- Replaced Tikus Beat's generated concentric-ring stage with the approved rainy glass-window / moonlit-night backdrop supplied by the user.
- Replaced Tikus Rush's vortex stage with the approved ceramic kitchen-floor backdrop supplied by the user.
- Added 1672px WebP/JPEG derivatives plus 960px WebP mobile derivatives under `assets/images/games/backdrops/`.
- Removed Rush's visible vortex/ring and beam layers so the floor illustration is the dominant arena surface.
- Increased Tikus Beat falling weapon icons, receptor icons and introductory guide icons for faster visual recognition.
- Strengthened Beat's target line into one continuous warm-paper/crimson line across all five lanes.
- Removed the repeated per-lane `HIT LINE` labels and replaced them with one centred translated label (`Hit Line` / `Garis Pukulan`).
- Gameplay timing, scoring, Beat audio, reduced-motion handling and direct Sitting Room routing are unchanged.

## v19 — Tikus Beat backdrop framing
- Changed the approved rainy-window artwork from a single `cover` crop to a layered cinematic treatment.
- A darkened `cover` copy fills the stage while a foreground `contain` copy preserves the complete 16:9 composition.
- Mobile uses the 960px WebP derivative for both layers where supported.
- No Beat timing, scoring, audio, lanes, hit line, weapon graphics, or input logic changed.


## v21 navigation and game ambience
- Added an accessible fixed hamburger navigation with EN/BM labels, Escape/outside-click closing and focus cycling.
- Tikus Beat background overlays were reduced so the rainy-window illustration reads clearly; rain, lightning and hit reflections are now visibly event-driven.
- Tikus Rush gained stronger moving kitchen light, ceramic sheen, mouse shadows, crumbs and catch-impact feedback.


## v22 — Full Cast & Crew

- Added a dedicated `#credits` section after Cinema Locations and before release/social information.
- Kept the eight existing Meet the Cast profile cards unchanged.
- Added principal cast character/actor pairings supplied by the producer.
- Added eight additional cast names without late-story role labels for spoiler control.
- Added complete supplied crew credits grouped by department.
- Added EN/BM section and department labels while preserving supplied individual credit terminology.
- Added Credits to the hamburger navigation and a closing transition into Release & Socials.
- No new image or media assets.

## v23 — Director's Intention + compact credits
- Added Director's Intention after Film Overview and before Meet the Cast.
- Preserved the supplied Bahasa Malaysia Director's Intention/Statement content and added an English translation for the site language switch.
- The long Director's Statement is collapsed by default to control page length.
- Added a Director's Intention entry to the hamburger navigation and changed the Film Overview continuation link accordingly.
- Reworked Full Cast & Crew into compact two-column Cast/Crew accordions.
- All ten credit groups start collapsed. Within each column, opening a group closes its sibling group that was previously open.
- Retained all previously supplied cast/crew credits and the spoiler-safe Additional Cast presentation.


## v24 — Qiu portrait and crew-photo collage

- Replaced Qiu Qatina's illustrated Mimi image on her Meet the Cast card with the newly supplied photographic portrait.
- Added responsive 480/720 AVIF, WebP and JPEG derivatives for Qiu.
- Added two supplied behind-the-scenes production photographs to the Full Cast & Crew masthead.
- The crew photographs are arranged as overlapping contact prints on desktop and a shallow stitched collage on mobile, so the visual addition does not significantly increase the initial height of the compact credits accordions.
- Crew photographs are lazy-loaded and delivered as 640/960 WebP/JPEG derivatives.
- Added bilingual behind-the-scenes caption and image alt text.

## v25 — Combined filmmaker statements

- Combined Director's Intention and Producer's Statement into a single `#director-intention` editorial section to preserve existing anchors.
- Renamed the section-facing navigation treatment to **From the Filmmakers / Filmmakers**.
- Added a responsive two-image editorial collage using the newly supplied production-monitor and personal creative-team photographs.
- Kept the long Director's Statement collapsed by default through the existing native `<details>` control.
- Added the Producer's Statement as a visible pull-quote card without inventing a named speaker attribution.
- Added EN/BM translations and bilingual alt/caption text.
- Added optimized 640/960 WebP and JPEG derivatives; source uploads are excluded from the deployed package.


## v26 filmmaker layout
The two filmmaker photographs now form a full-width masthead above the Director's Intention and Producer's Statement. Desktop keeps the statements in two columns beneath the imagery; mobile uses a compact stitched photo band followed by stacked copy.

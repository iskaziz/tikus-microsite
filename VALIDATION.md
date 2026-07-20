# Validation report

Validation was performed against the packaged project, without modifying the confidential screenplay or adding production facts.

## Passed checks

- All JavaScript files pass `node --check` syntax validation.
- HTML parses successfully with unique IDs and no missing local references.
- CSS parses without syntax errors.
- All `<img>` elements include alt attributes.
- All authored buttons declare `type="button"` where appropriate.
- No base64 or `data:image` assets are present.
- Game stylesheet and script are loaded by `index.html`.
- Game script loads after the core application scripts.
- Three room selector buttons are present.
- Each room contains exactly three data-defined hotspots.
- Sitting Room runtime hotspots are `family-console`, `art-display` and `logic-game`.
- Trailer, eight grouped cast cards and scene-atmosphere layers remain present.
- Seven supplied character portraits render on the reverse sides of the correct cards.
- Character portraits provide AVIF, WebP and JPEG sources at 480 and 720 pixels and remain lazy-loaded.
- Actor-side cards and the two characters without supplied artwork retain accessible placeholders.
- Game dialog is injected without replacing the core modal controller.
- Keyboard activation works for cast cards, room controls, hotspots and game grid cells.
- Escape closes both the information dialog and game dialog.
- Focus returns to the originating hotspot after either dialog closes.
- Game cell state cycles blank → possible → ruled out → confirmed.
- Confirming a match rules out the remaining cells in its row and column.
- Two deduction grids render per level.
- Progress writes to `tikus-logic-game-progress-v5`.
- Hint reveal, level reset and incomplete-board feedback operate correctly.
- Solving each board unlocks the next level and updates the progress meter immediately.
- All three solved summaries render four evidence matches and the final Continue action closes the completed game.
- Normal-motion and reduced-motion DOM integration tests pass.

## Chromium layout checks

An in-memory routed Chromium test was run at:

- 1440 × 1000 desktop.
- 360 × 800 mobile.
- 390 × 844 mobile with reduced motion.

Results:

- No page-level horizontal overflow at any tested viewport.
- Both grids use contained `overflow-x: auto` wrappers.
- Grid content remains horizontally scrollable on narrow screens.
- The Sitting Room retains exactly three hotspots.
- URL hash changes to `#sitting-room` and returns to the house state.
- No JavaScript page errors, console errors or missing local asset requests were detected.

## Deployment note

The official trailer requires a network connection because it is hosted by YouTube. It is not requested until the visitor deliberately opens the trailer dialog.


## Character portrait layout checks

The cast section was rendered in Chromium using the complete production DOM and locally routed assets at:

- 1440 × 1100 desktop.
- 360 × 800 mobile.
- 390 × 844 mobile with reduced motion.

Results:

- All seven supplied portraits loaded from the AVIF source set without failed local requests.
- Portrait frames remained visible and contained inside every flipped card.
- Faces, hats and upper-body composition remained legible at desktop and mobile sizes.
- The mobile cast strip remained horizontally scrollable without page-level overflow.
- Native Enter-key card flipping, `aria-pressed` state and live-region announcements remained functional.
- The Sitting Room still rendered exactly `family-console`, `art-display` and `logic-game` after the portrait integration.

## Synopsis and cast grouping amendment

- Confirmed the approved synopsis appears once in the explorer heading.
- Confirmed the opening title no longer contains “The road is gone” or “A wellness retreat”.
- Confirmed eight cards render across three labelled groups.
- Confirmed guest order is Fattah, Diana, Harris, Marsha, Iski.
- Confirmed Roshafiq is absent from HTML and JavaScript data.

# TIKUS Rush — arcade game replacement

This package replaces the existing logic puzzle with a simpler 30-second mouse-catching arcade game.

## Replace these complete files

Upload the following files to the same paths in the TIKUS microsite repository:

- `css/game.css`
- `js/tikus-logic-game.js`

The current `index.html` may continue loading `js/tikus-logic-game.js`. The replacement script also updates the existing game stylesheet link to `css/game.css?v=arcade-v1` at runtime to reduce stale-cache problems.

## What remains unchanged

- The existing Sitting Room game hotspot is reused.
- The total number of Sitting Room hotspots is preserved.
- The title, trailer, synopsis, cast cards, house explorer and room navigation are not changed.
- The game remains static-hosting compatible and opens locally through `index.html`.

## Rules

- Round length: 30 seconds.
- Grey mouse: 2 points.
- Gold mouse with star marking: 10 points.
- The highest score is stored locally in the visitor's browser.

## Testing

1. Replace both files.
2. Open the Sitting Room and select the game hotspot.
3. Start the game and confirm the timer reaches zero after 30 seconds.
4. Confirm grey and gold mice award the correct score.
5. Confirm Play Again and Return to Sitting Room work.
6. Test mobile portrait and landscape.
7. Test Escape, keyboard focus, and `prefers-reduced-motion`.

`preview.html` is included only as a standalone local test page. It is not required for the microsite upload.

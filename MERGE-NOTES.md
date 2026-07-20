# Merge notes

## Sources compared

1. The public `main` branch of `iskaziz/tikus-microsite`.
2. The feature-rich repository state identified in project history at commit `53244b5e3dc69561227a3b818cbb3692d35047fb`.
3. The attached `TIKUS-grid-logic-game-update-v5` package.

The public `main` branch contained an older, compact one-level game implementation and an `index.html` without the trailer, cast-card and scene-atmosphere markup described as required for the live microsite. The merge therefore retained the feature-rich structure and applied the v5 game as a targeted integration rather than replacing the whole site.

## File decisions

### `index.html`

Retained or restored:

- Concentric-ring hero and approved title artwork.
- Retro television trailer section and trailer dialog.
- Eight cast and character flip cards, grouped as Hosts, Guests and The Inspector.
- House explorer, room thumbnails and scene-atmosphere overlays.
- Existing information dialog and semantic page structure.

Added or confirmed:

- `css/game.css` after the core stylesheets.
- `js/tikus-logic-game.js` after all core application scripts.
- No autoplay parameters or base64 assets.

### `css/game.css`

The v5 game stylesheet was adopted as the game source of truth. It contains the investigation-table presentation, evidence sheets, clue cards, icon drawings, mobile grid containment, feedback effects and reduced-motion overrides.

### `js/tikus-logic-game.js`

The v5 game script was adopted as the game source of truth. It patches only the Sitting Room `main-sofa` hotspot, injects its own dedicated dialog and delegates all other scene and information hotspots to the existing modal controller.

### Core files

The core scene, modal, cast, trailer and atmospheric behavior remains separate from the game:

- `js/content-data.js`
- `js/app.js`
- `js/scene-controller.js`
- `js/modal-controller.js`
- `css/styles.css`
- `css/animations.css`

## Integration invariants

- Sitting Room renders `family-console`, `art-display` and `logic-game`: exactly three hotspots.
- Kitchen and Orchid Room each remain at exactly three hotspots.
- Game progress uses `tikus-logic-game-progress-v5`.
- The game is labelled spoiler-safe and non-canonical in both its hotspot panel and dialog.
- All local paths are relative to the project root.
- Source PDFs and confidential screenplay material are not included.

## Small integration fixes

Two contained v5 behaviors were hardened during validation:

- The level tabs and progress meter now refresh immediately when a level is solved, before the evidence summary appears.
- Wrong-answer feedback now applies its visual state synchronously after a forced style reset, making the shake/pulse reliable across browsers while reduced-motion CSS still suppresses movement.


## Character portrait integration

The supplied `tikus-character-portraits` archive was added as a targeted cast-card update:

- Mimi, Jay, Saladin, Madam Boey, Major Mansor, Alayna and Guy appear on the character-facing side of their existing cards.
- Actor-facing sides remain unchanged because actor portraits were not supplied.
- Inspektor Mislan and Man retain their existing character placeholders because no matching portrait was included.
- Original 1024-pixel PNG files were converted to responsive 480-pixel and 720-pixel AVIF, WebP and progressive JPEG derivatives.
- Portraits remain lazy-loaded and preserve the existing card keyboard, screen-reader and flip-state behavior.

## Synopsis and cast grouping amendment

- Replaced the explorer synopsis with the approved “EVERYONE IN THE HOUSE IS A SUSPECT” copy.
- Removed “The road is gone” and “A wellness retreat” from the opening title copy.
- Reorganised the cast cards into Hosts, Guests and The Inspector.
- Applied the requested order: Que, Y Mun; Fattah, Diana, Harris, Marsha, Iski; Haiccal.
- Removed Roshafiq and the ninth cast card.

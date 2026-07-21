# Validation report

Validation was performed against the packaged project without adding spoiler-sensitive story material.

## Static checks

- Every JavaScript file passes `node --check`.
- HTML parses with unique IDs and no missing local stylesheet, script, image or source references.
- CSS parses successfully.
- No framework, build dependency, base64 asset, autoplay media or external animation library is present.
- Core scripts load before both game modules and the shared arcade controller.
- `js/tikus-logic-game.js` and the old monolithic game stylesheet are absent.

## Arcade integration checks

- The Sitting Room contains exactly three runtime hotspots:
  - `family-console`
  - `art-display`
  - `tikus-arcade`
- The shared arcade hotspot opens one native dialog containing exactly two game choices.
- Tikus Rush and Tikus Beat register as independent modules.
- The scene controller routes only `type: "arcade-hub"` to the arcade controller.
- The existing information modal remains unchanged and is not patched or wrapped by either game.
- Background page regions become inert while the arcade is open.
- Closing restores focus to the originating Sitting Room hotspot.
- Escape/cancel handling and the dialog focus loop are implemented centrally.

## Game checks

### Tikus Rush

- Starts a 30-second round.
- Spawns grey and gold mouse buttons.
- Catching a grey mouse adds 2 points; catching a gold mouse adds 10 points.
- Spawn frequency and travel speed increase over time.
- Hit particles, floating scores, streak callouts, gold feedback and final-ten-second treatment are present.
- Best score persists under `tikus-rush-best-v2`.

### Tikus Beat

- Starts a 60-second round.
- Renders five lanes and five touch/keyboard receptors.
- Accepts `1–5` and `A/S/D/F/G` controls.
- Notes progress to the hit line with perfect, good and miss windows.
- Combo, tempo tiers, lane feedback, judgement callouts and final-frenzy treatment are present.
- Best score persists under `tikus-beat-best-v2`.

## Chromium integration checks

An in-memory Chromium route was used because direct local navigation is blocked by the execution environment administrator policy.

Tested at 1440 × 900 and 390 × 844:

- Core microsite initialises.
- House-to-Sitting-Room navigation initialises.
- Exactly three Sitting Room hotspots render.
- The arcade opens with Rush and Beat cards.
- Rush starts, spawns mice and increments score after a catch.
- Beat starts, renders five lanes and spawns falling notes.
- Arcade close removes inert state and restores hotspot focus.
- Mobile page-level horizontal overflow is zero.
- The mobile dialog stays inside the viewport.
- Reduced-motion media queries are present for the hub and both games.

The official trailer still requires a network connection and is requested only after deliberate activation.

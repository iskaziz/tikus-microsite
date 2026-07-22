# Validation notes

## Completed checks

- JavaScript syntax validated with `node --check`.
- Replacement HTML parsed successfully with Python's HTML parser.
- Existing relative asset and module paths preserved.
- New CSS and JavaScript use relative paths and require no external libraries.
- Existing TIKUS Rush module remains referenced and loads before TIKUS Beat.
- The new modal patch wraps the existing TIKUS Rush modal patch instead of overwriting it.
- Duplicate rhythm hotspots are prevented.
- Initial `#sitting-room` loads are refreshed after the hotspot is registered.
- All five player controls are real buttons.
- Focus is restored to the hotspot after closing.
- Escape and native dialog cancel close the game.
- Mobile dynamic viewport height uses `100dvh`.
- Main game area uses responsive sizing with no fixed desktop-only dimensions.
- No audio or video autoplays.
- No base64 assets are used.

## Recommended browser check after upload

1. Open the house, then the Sitting Room.
2. Confirm the original TIKUS Rush hotspot still opens TIKUS Rush.
3. Confirm the new central coffee-table hotspot opens TIKUS Beat.
4. Play one round using touch controls.
5. Play briefly using `1–5` and `A–G`.
6. Close with Escape and confirm focus returns to the hotspot.
7. Test portrait mobile, landscape mobile and desktop widths.
8. Confirm the best score remains after a reload.

# Asset manifest

The packaged site uses responsive derivatives only. Original source documents, screenplay files and working archives are not included.

## Confirmed image properties

| File | Format | Dimensions | Aspect ratio | True transparency | Intended role |
|---|---:|---:|---:|---:|---|
| `assets/images/scenes/samasihat-house-exterior-1600.avif` | `AVIF` | `1600 × 900` | `1.778:1` | `No` | `House exterior stage artwork` |
| `assets/images/scenes/samasihat-house-exterior-1600.jpg` | `JPG` | `1600 × 900` | `1.778:1` | `No` | `House exterior stage artwork` |
| `assets/images/scenes/samasihat-house-exterior-1600.webp` | `WEBP` | `1600 × 900` | `1.778:1` | `No` | `House exterior stage artwork` |
| `assets/images/scenes/samasihat-house-exterior-960.avif` | `AVIF` | `960 × 540` | `1.778:1` | `No` | `House exterior stage artwork` |
| `assets/images/scenes/samasihat-house-exterior-960.jpg` | `JPG` | `960 × 540` | `1.778:1` | `No` | `House exterior stage artwork` |
| `assets/images/scenes/samasihat-house-exterior-960.webp` | `WEBP` | `960 × 540` | `1.778:1` | `No` | `House exterior stage artwork` |
| `assets/images/scenes/samasihat-sitting-room-1600.avif` | `AVIF` | `1600 × 900` | `1.778:1` | `No` | `Sitting Room stage artwork` |
| `assets/images/scenes/samasihat-sitting-room-1600.jpg` | `JPG` | `1600 × 900` | `1.778:1` | `No` | `Sitting Room stage artwork` |
| `assets/images/scenes/samasihat-sitting-room-1600.webp` | `WEBP` | `1600 × 900` | `1.778:1` | `No` | `Sitting Room stage artwork` |
| `assets/images/scenes/samasihat-sitting-room-960.avif` | `AVIF` | `960 × 540` | `1.778:1` | `No` | `Sitting Room stage artwork` |
| `assets/images/scenes/samasihat-sitting-room-960.jpg` | `JPG` | `960 × 540` | `1.778:1` | `No` | `Sitting Room stage artwork` |
| `assets/images/scenes/samasihat-sitting-room-960.webp` | `WEBP` | `960 × 540` | `1.778:1` | `No` | `Sitting Room stage artwork` |
| `assets/images/title/tikus-title-1200.png` | `PNG` | `1200 × 392` | `3.061:1` | `Yes` | `Responsive title artwork` |
| `assets/images/title/tikus-title-1200.webp` | `WEBP` | `1200 × 392` | `3.061:1` | `Yes` | `Responsive title artwork` |
| `assets/images/title/tikus-title-720.png` | `PNG` | `720 × 235` | `3.064:1` | `Yes` | `Responsive title artwork` |
| `assets/images/title/tikus-title-720.webp` | `WEBP` | `720 × 235` | `3.064:1` | `Yes` | `Responsive title artwork` |


## Character portraits

Seven approved, opaque square portraits are included for the reverse sides of the Mimi, Jay, Saladin, Madam Boey, Major Mansor, Alayna and Guy cards.

| Character | Base filename | Formats | Responsive dimensions | True transparency |
|---|---|---|---:|---:|
| Mimi | `mimi` | AVIF, WebP, JPEG | `480 × 480`, `720 × 720` | No |
| Jay | `jay` | AVIF, WebP, JPEG | `480 × 480`, `720 × 720` | No |
| Saladin | `saladin` | AVIF, WebP, JPEG | `480 × 480`, `720 × 720` | No |
| Madam Boey | `madam-boey` | AVIF, WebP, JPEG | `480 × 480`, `720 × 720` | No |
| Major Mansor | `mejar-mansor` | AVIF, WebP, JPEG | `480 × 480`, `720 × 720` | No |
| Alayna | `alayna` | AVIF, WebP, JPEG | `480 × 480`, `720 × 720` | No |
| Guy | `guy` | AVIF, WebP, JPEG | `480 × 480`, `720 × 720` | No |

The remaining Inspektor Mislan character card retains its existing illustrated placeholder until approved artwork is supplied. Actor-side portraits also remain placeholders. Portraits are lazy-loaded and use AVIF first, WebP second and progressive JPEG as the fallback.

## Tikus Beat weapon icons

Five approved transparent illustrations are delivered under `assets/images/games/tikus-beat/`. Public filenames are lane-based to keep the deployed package spoiler-conscious.

| Lane | Formats | Responsive maximum dimensions | True transparency |
|---:|---|---:|---:|
| 1 | WebP, PNG | `256 × 184`, `512 × 368` | Yes |
| 2 | WebP, PNG | `191 × 256`, `381 × 512` | Yes |
| 3 | WebP, PNG | `172 × 256`, `344 × 512` | Yes |
| 4 | WebP, PNG | `256 × 116`, `512 × 232` | Yes |
| 5 | WebP, PNG | `256 × 222`, `512 × 443` | Yes |

The icon artwork is loaded only when Tikus Beat is mounted. WebP is preferred through `<picture>`, with transparent PNG as the fallback.

## Tikus Beat audio

The game uses one original, lightweight 24-second mono music loop. It is not preloaded with the microsite and is requested only after the player deliberately starts Tikus Beat. Gameplay cues are generated procedurally with Web Audio and add no separate sound-effect files.

| File | Codec | Duration | Channels | Approximate size | Delivery |
|---|---|---:|---:|---:|---|
| `assets/audio/tikus-beat-loop.opus` | Opus in Ogg | `24.01 sec` | Mono | `133 KB` | Preferred source |
| `assets/audio/tikus-beat-loop.mp3` | MP3 | `24.03 sec` | Mono | `189 KB` | Broad fallback |

The audio control persists under `tikus-beat-sound-v1`. Neither file is embedded as base64 or referenced from the opening page markup.

## Delivery recommendations

- **Title:** WebP is preferred where supported; transparent PNG remains the fallback. Both title PNG files contain real alpha transparency.
- **Main scenes:** House and Sitting Room artwork use AVIF first, WebP second and progressive JPEG as the fallback. Both are opaque and use a 16:9 ratio.
- **Character portraits:** AVIF is preferred, WebP is secondary and progressive JPEG is the fallback.
- **Preloading:** Only the title and house exterior are preloaded. The Sitting Room is prefetched on pointer, focus or touch interaction with the house entry control.
- **Cropping:** Main stage images use `object-fit: contain` so essential composition is not cropped on mobile.

## Source transparency findings

- Approved title derivatives in `assets/images/title/` retain true transparency.
- House, Sitting Room and character portrait source illustrations are RGB/opaque and do not require transparency.
- No image is embedded as base64 data.

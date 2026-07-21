# Asset and content manifest

## Confirmed project sources available during this update

### Documents

- `TIKUS info.pdf` — approved film information source.
- `TIKUS - Final script (1).pdf` — confidential final screenplay; not used for gameplay content.

### Visual files

| Filename | Dimensions | Transparency |
|---|---:|---|
| `1000457806.jpg` | 1536 × 709 | No alpha channel |
| `1000457825.png` | 1536 × 863 | No alpha channel |
| `Bold cartoon-style 3D logo.png` | 1672 × 941 | No alpha channel |
| `image-gen-1(1).png` | 1672 × 941 | No alpha channel |
| `image-gen-2(1).png` | 1672 × 941 | No alpha channel |
| `image-gen-3(1).png` | 1672 × 941 | No alpha channel |
| `image-gen-4(1).png` | 1672 × 941 | No alpha channel |

None of the available PNG files contains true transparency.

## Confirmed game content

- Game duration: 30 seconds.
- Grey mice: 2 points.
- Gold mice: 10 points.
- Background: animated concentric crimson and black rings matching the title treatment.
- Input: tap, click, Enter or Space on a mouse button.

## Implementation recommendation used

The mouse artwork is generated as compact inline SVG inside real HTML buttons. This avoids adding image downloads, keeps the mice crisp at every size, supports gold-star identification beyond colour, and allows the game to remain self-contained and fast.

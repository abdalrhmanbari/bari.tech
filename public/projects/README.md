# Project preview images

Drop one screenshot per project here. The file name must match the `image`
path set in `src/data/projects.ts` (English) and `src/data/i18n/ar.ts` (Arabic):

| Project         | File             | Country              |
| --------------- | ---------------- | -------------------- |
| Bombo Car Wash  | `bombo.png`      | Iraq                 |
| Nextzett        | `nextzett.png`   | Iraq                 |
| DigitStone      | `digitstone.png` | Germany              |
| Aurodia         | `aurodia.png`    | Germany              |
| Marasil         | `marasil.png`    | Saudi Arabia         |
| MAHAM           | `maham.png`      | Italy                |
| Terra Group UAE | `terra.png`      | United Arab Emirates |

Guidelines:

- Landscape crop, roughly **16:10** (e.g. 1200×750). The card shows it as a
  cover-cropped fill, so keep the important content away from the edges.
- `.png` / `.jpg` / `.webp` all work — if you use a different extension, update
  the matching `image:` value in the data files.
- Any project without a matching file falls back to the faded index number.

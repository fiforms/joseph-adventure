# CLAUDE.md — Joseph in Egypt: A Bible Text Adventure

## Project Overview

A browser-based text adventure game for elementary school students learning
to type and think logically. The game is set in the Biblical story of Joseph
(Genesis 37–50) and runs entirely in a single HTML file with no server,
no login, and no external dependencies.

---

## Educational Context

- **Audience:** Elementary school students (roughly grades 3–5)
- **Subject:** Technology class — typing skills, logical thinking, reading comprehension
- **Platform:** Chromebook, standard school browser (Chrome)
- **Deployment:** Single HTML file, opened directly in the browser
- **No accounts or sign-in required**

---

## Design Decisions (Do Not Change Without Discussion)

### Syntax is strict by design
Students must type exact commands (`take coat`, not `pick up coat`). This is
intentional — it teaches precise communication with computers. Do not add
fuzzy matching or synonym handling unless explicitly requested.

### No links or clickable UI
Everything is typed. This is a command processor, not a point-and-click game.
No buttons, no hyperlinks in the game interface.

### No graphics in v1
The aesthetic is a dark terminal — green text on black, monospace font.
Background images per room are planned for a later version. Do not add
inline images without being asked.

### Single-file architecture
All HTML, CSS, and JavaScript must remain in one `.html` file. No build
tools, no npm, no bundlers. Teachers need to be able to share this as an
email attachment or Google Drive link.

### Save system
Game state is saved to `localStorage` with key `joseph_adventure_v1`.
This may be unreliable on managed Chromebooks (district MDM policies
sometimes restrict localStorage). A printable save-code system (short
alphanumeric string the student writes down) is planned as a fallback.

---

## Current Tech Stack

- Vanilla HTML/CSS/JavaScript — no frameworks
- Google Fonts: `Share Tech Mono` (body), `Cinzel` (headings)
- No external JS libraries
- CSS custom properties for theming

---

## Game Architecture

### State Object
```js
{
  room: "room_id",         // current room
  inventory: ["item_id"],  // items the player is carrying
  flags: { ... },          // boolean story flags (events triggered, etc.)
  moves: 0                 // move counter
}
```

### Room Object
```js
{
  id: "room_id",
  name: "Display Name",
  description: `Multi-line text shown on first visit or LOOK`,
  exits: { north: "other_room_id", ... },
  items: ["item_id"],       // items currently in this room
  visited: false,
  events: {
    onEnter: (state) => { return ["line1", "line2"]; }
  }
}
```

### Item Object
```js
{
  id: "item_id",
  name: "display name",    // what the player types to reference it
  description: `Text shown on INSPECT`,
  takeable: true,
  fixed: false
}
```

### Special Commands
Room-specific commands are registered in `GAME.specialCommands[room_id]`:
```js
{
  "inspect pit": (state) => { return { lines: [...], moveToRoom: "room_id" }; }
}
```

### Commands Implemented
| Command              | Description                              |
|----------------------|------------------------------------------|
| `look`               | Describe current room                    |
| `walk [direction]`   | Move north/south/east/west               |
| `take [item]`        | Pick up an item                          |
| `drop [item]`        | Drop a carried item                      |
| `inspect [item]`     | Examine an item or feature               |
| `inventory` / `inv`  | List carried items                       |
| `pray`               | Context-sensitive; works in the pit      |
| `wait`               | Context-sensitive; triggers pit escape   |
| `save`               | Save state to localStorage               |
| `load`               | Load state from localStorage             |
| `help`               | Show command list                        |

---

## Story Structure (Chapter 1 — Complete)

Rooms in order:

1. `canaan_home` — Jacob's tent; collect the coat
2. `canaan_fields` — Open fields; transition
3. `dothan_road` — Road north; meet a stranger
4. `dothan_fields` — Brothers' location; puzzle leads to pit
5. `the_pit` — No exits; students must use `pray` and `wait`
6. `merchants_camp` — Sold to Ishmaelite merchants
7. `egypt_market` — Arrival in Egypt; Potiphar appears — **chapter end**

### Key Puzzle
In `the_pit` there are no exits. The intended solution:
1. `inspect clay lamp` → atmospheric/faith moment
2. `pray` → narrative response
3. `wait` → triggers the escape event and moves to `merchants_camp`

This mirrors the Biblical theme: Joseph could not escape by his own strength.

---

## Planned Features (Not Yet Built)

- [ ] Chapter 2: Potiphar's house
- [ ] Chapter 3: Prison — interpret the butler and baker's dreams
- [ ] Chapter 4: Pharaoh's dream — Joseph rises to power
- [ ] Chapter 5: Brothers return to Egypt; Joseph reveals himself
- [ ] `say [phrase]` command for dialogue puzzles
- [ ] Per-room background images (full-screen, dark, thematic)
- [ ] Printable save-code system (base64 or short alphanumeric)
- [ ] `score` command showing progress
- [ ] Teacher mode: a hidden command to jump to any room (for demos)

---

## Style & Tone Guidelines

- Language should be accessible to a 3rd–5th grader
- Descriptions are evocative but not scary or violent
- The pit scene conveys loneliness and prayer, not trauma
- Scripture references are woven in naturally (not preachy)
- Correct Biblical names: Jacob, Joseph, Reuben, Simeon, Levi, Judah,
  Potiphar, Pharaoh, Ishmaelites
- Time period: approximately 1700 BC, ancient Near East

---

## File Structure

```
index.html               ← game home 
CLAUDE.md                ← this file
joseph.css
joseph.js
```

---

## How to Continue Development

Open `joseph-adventure.html` in a browser to play. All game content
(rooms, items, events, commands) is in the `GAME` object near the top
of the `<script>` block. The engine (parser, output, state) is below it.

To add a new room:
1. Add an entry to `GAME.rooms`
2. Wire exits in adjacent rooms
3. Add `onEnter` event if needed
4. Add any new items to `GAME.items`

To add a new command:
1. Add a `case` to the `switch` in `handleCommand()`
2. Write a `cmd[Name]()` function

Keep everything in one file. Keep language simple. Test on Chrome.

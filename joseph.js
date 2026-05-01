// ─── GAME DATA ────────────────────────────────────────────────────────────────

const GAME = {
  title: "Joseph in Egypt",
  version: "1.0",

  // ── ROOMS ──────────────────────────────────────────────────────────────────
  rooms: {
    canaan_home: {
      id: "canaan_home",
      name: "Jacob's House in Canaan",
      restable: true,
      restMessage: "You lie down on your sleeping mat. The familiar smells of home wrap around you like a blanket.",
      itemQty: { food_bag: 20, water_jug: 4 },
      description: `You are inside your father Jacob's tent. Sunlight filters through the 
woven walls. Your father sits nearby, his eyes full of love for you. 
On a wooden chest rests your coat — a gift from your father, woven 
with every color of the rainbow. Your brothers have left for the fields.`,
      exits: { north: "canaan_fields" },
      items: ["coat", "food_bag", "water_jug"],
      visited: false,
      events: {
        onEnter: (state) => {
          if (!state.flags.coat_given) {
            return ["Jacob speaks gently: \"My son Joseph, take your coat.\"",
                    "\"Go check on your brothers in the fields.\""];
          }
          return [];
        }
      }
    },

    canaan_fields: {
      id: "canaan_fields",
      name: "The Fields of Canaan",
      description: `Broad green fields stretch before you under a bright sky. 
Sheep graze in the distance. A dusty road leads north toward Dothan. 
The path home lies to the south.`,
      exits: { south: "canaan_home", north: "dothan_road" },
      items: [],
      visited: false,
      events: {}
    },

    dothan_road: {
      id: "dothan_road",
      name: "A Dusty Crossroads",
      description: `Several paths meet here under a wide open sky. The air is dry
and still. A few scraggly trees offer little shade. Roads lead north,
east, and back south toward home.`,
      exits: { south: "canaan_fields", east: "ridge_road_west", north: "valley_path" },
      items: ["water_jug"],
      visited: false,
      events: {
        onEnter: (state) => {
          if (!state.flags.met_stranger) {
            state.flags.met_stranger = true;
            return [
              "A stranger resting under a tree stands up to greet you.",
              "Stranger: \"Are you looking for your brothers? I saw them today.\"",
              "Stranger: \"They went east along the ridge road, then north toward Dothan.\"",
              "He points east and sits back down."
            ];
          }
          return [];
        }
      }
    },

    valley_path: {
      id: "valley_path",
      name: "Edge of the Ravine",
      description: `The path ends at the lip of a deep ravine. You peer down into
the shadows below — there is no way across and no way down safely.
You scan the hills in every direction. No flocks. No smoke. No brothers.
This is not the right way.`,
      exits: { south: "dothan_road" },
      items: [],
      visited: false,
      events: {}
    },

    ridge_road_west: {
      id: "ridge_road_west",
      name: "The Ridge Road",
      description: `A hard-packed road runs east through dry yellow grass. Rocky
hills rise sharply to the north. The crossroads lies back to the west.`,
      exits: { west: "dothan_road", east: "ridge_road_east", north: "rocky_slopes" },
      items: [],
      visited: false,
      events: {}
    },

    rocky_slopes: {
      id: "rocky_slopes",
      name: "Rocky Slopes",
      description: `Enormous boulders tumble down from a steep mountainside. The
path disappears into the rocks — there is no way through and no way up.
You can see far in every direction from here. Dry hills, empty sky.
Your brothers are nowhere in sight.`,
      exits: { south: "ridge_road_west" },
      items: [],
      visited: false,
      events: {}
    },

    ridge_road_east: {
      id: "ridge_road_east",
      name: "The Eastern Ridge",
      description: `The ridge road opens onto a wide plain. To the north the hills
of Dothan are finally visible — and thin smoke rising from a campfire.
A cluster of palm trees stands just ahead. To the east the land stretches
flat and featureless.`,
      exits: { west: "ridge_road_west", north: "palm_grove", east: "open_desert" },
      items: [],
      visited: false,
      events: {}
    },

    palm_grove: {
      id: "palm_grove",
      name: "Shade of the Palm Trees",
      restable: true,
      restMessage: "You lean against a palm trunk and close your eyes. A cool breeze moves through the fronds. You feel steadier.",
      description: `A small cluster of tall palms offers welcome shade. The ground
here is softer than the road. Dothan is just to the north — you can
almost hear the flocks. The ridge road lies back to the south.`,
      exits: { south: "ridge_road_east", north: "dothan_fields" },
      items: [],
      visited: false,
      events: {}
    },

    open_desert: {
      id: "open_desert",
      name: "The Open Desert",
      description: `The plain gives way to empty desert. No trees, no water, no
people. Heat shimmers off the cracked ground. You shade your eyes and
look as far as you can — nothing. Your brothers are certainly not here.`,
      exits: { west: "ridge_road_east" },
      items: [],
      visited: false,
      events: {}
    },

    dothan_fields: {
      id: "dothan_fields",
      name: "The Fields of Dothan",
      description: `You arrive at the fields of Dothan. Your brothers are here
with the flocks, gathered near a fire. A dry pit — an empty cistern —
yawns open in the earth nearby. Your brother Reuben stands a little apart,
looking troubled.`,
      exits: { south: "ridge_road_east" },
      items: ["stone"],
      visited: false,
      events: {
        onEnter: (state) => {
          if (!state.flags.brothers_seen) {
            state.flags.brothers_seen = true;
            if (state.inventory.includes("coat")) {
              return [
                "Your brothers see you coming from far off.",
                "Simeon: \"Here comes the dreamer!\"",
                "Levi: \"Let us see what becomes of his dreams.\"",
                "Reuben steps forward quietly. He looks worried.",
                "Reuben: \"Do not harm him. Throw him into the pit — nothing more.\""
              ];
            } else {
              state.flags.brothers_no_coat = true;
              state.needs.sad = Math.min(100, state.needs.sad + 25);
              return [
                "Your brothers do not recognize you without your coat.",
                "You watch from a distance, your heart heavy.",
                "These are your brothers — you love them — but they do not know you.",
                "Simeon laughs loudly at something. Levi throws a stone into the pit.",
                "Reuben sits apart, staring at the ground.",
                "You could reveal yourself to them, or simply walk away."
              ];
            }
          }
          return [];
        }
      }
    },

    the_pit: {
      id: "the_pit",
      name: "Inside the Pit",
      description: `The world has gone dark. You are at the bottom of a dry pit. 
The walls are stone and earth. Far above you can see a circle of sky. 
Your coat is gone. You can hear your brothers eating and talking above. 
In the dim light you notice a small clay lamp on a ledge.`,
      exits: {},   // no exits — escape is event-driven
      items: ["clay_lamp"],
      visited: false,
      events: {
        onEnter: (state) => {
          if (!state.flags.in_pit_narrated) {
            state.flags.in_pit_narrated = true;
            const hadCoat = state.inventory.includes("coat");
            state.inventory = state.inventory.filter(i => i !== "coat");
            state.needs.sad = Math.min(100, state.needs.sad + 30);
            state.needs.thirsty = Math.min(100, state.needs.thirsty + 15);
            const lines = hadCoat
              ? ["Your brothers seize you and strip off your coat!", "(Your coat has been taken.)"]
              : ["Your brothers seize you!"];
            return [
              ...lines,
              "They lower you into the empty pit.",
              "It is dark. It is lonely. You pray.",
              "Tip: inspect the lamp, then wait for something to change..."
            ];
          }
          return [];
        }
      }
    },

    merchants_camp: {
      id: "merchants_camp",
      name: "Ishmaelite Merchants' Camp",
      restable: true,
      restMessage: "You sit against a palm tree and close your eyes. The camels breathe slowly nearby.",
      description: `You have been pulled from the pit and sold to a group of 
Ishmaelite merchants traveling to Egypt. Their camels are loaded with 
spices and balm. The merchants are kind but firm. A cart sits ready. 
Egypt lies to the west on a long road.`,
      exits: { west: "egypt_road", east: "flee_east" },
      items: ["bread_loaf"],
      visited: false,
      events: {
        onEnter: (state) => {
          if (!state.flags.sold_narrated) {
            state.flags.sold_narrated = true;
            state.needs.sad = Math.min(100, state.needs.sad + 20);
            return [
              "Judah: \"What profit is it if we kill our brother?\"",
              "\"Let us sell him to these Ishmaelites.\"",
              "The merchants pay twenty pieces of silver.",
              "You are free from the pit, but far from home.",
              "Judah takes your coat to show your father."
            ];
          }
          return [];
        }
      }
    },

    flee_east: {
      id: "flee_east",
      name: "East of the Camp",
      description: `Rocky scrubland stretches east. A large man leans against a
boulder, arms folded, watching you with flat, unreadable eyes.
The camel train is back to the west.`,
      exits: { west: "merchants_camp" },
      items: [],
      visited: false,
      events: {
        onEnter: (state) => {
          if (!state.flags.flee_caught) {
            state.flags.flee_caught = true;
            state.needs.tired = Math.min(100, state.needs.tired + 20);
            state.needs.sad   = Math.min(100, state.needs.sad   + 15);
            return [
              "You break away from the camel train and run east, heart pounding.",
              "But a rough, bearded man — bigger than any of the merchants —",
              "steps out from behind a boulder.",
              "He grabs your arm like iron.",
              "Stranger: \"Going somewhere, boy?\"",
              "He marches you back to the camel train without another word.",
              "The merchants barely look up.",
              "(You are back at the camp. The road to Egypt is west.)"
            ];
          }
          return [];
        }
      }
    },

    egypt_road: {
      id: "egypt_road",
      name: "The Road to Egypt",
      description: `The desert stretches in every direction. The Nile Delta 
shimmers ahead to the west. Behind you to the east is the merchants' camp. 
The sun is fierce but you walk with hope in your heart.`,
      exits: { east: "merchants_camp", west: "egypt_market" },
      items: [],
      visited: false,
      events: {}
    },

    egypt_market: {
      id: "egypt_market",
      name: "The Market of Egypt",
      description: `The great city of Egypt rises around you — enormous stone buildings, 
busy markets, people in white linen. You are standing in a marketplace. 
A man named Potiphar, captain of Pharaoh's guard, is inspecting servants. 
He notices you. A scroll lies rolled up on a merchant's table.`,
      exits: { east: "egypt_road" },
      items: ["scroll"],
      visited: false,
      events: {
        onEnter: (state) => {
          if (!state.flags.potiphar_seen) {
            state.flags.potiphar_seen = true;
            return [
              "Potiphar watches you carefully.",
              "Potiphar: \"This young man has something about him.\"",
              "Potiphar: \"God is with him. I will buy him for my household.\"",
              "",
              "★  You have reached Egypt — Chapter One complete!  ★",
              "The Lord was with Joseph, and he prospered.",
              "  — Genesis 39:2"
            ];
          }
          return [];
        }
      }
    }
  },

  // ── ITEMS ──────────────────────────────────────────────────────────────────
  items: {
    coat: {
      id: "coat",
      name: "coat of many colors",
      description: `A beautiful robe woven in stripes of red, blue, gold, and 
green. Your father Jacob made it for you as a sign of his great love. 
It is the most precious thing you own.`,
      takeable: true,
      fixed: false
    },
    water_jug: {
      id: "water_jug",
      name: "water jug",
      plural: "jugs of water",
      description: `A clay jug, still cool to the touch. It holds fresh water —
a welcome thing on a long desert road.`,
      takeable: true,
      fixed: false,
      consumable: "drink",
      hydration: 55,
      stackable: true
    },
    stone: {
      id: "stone",
      name: "stone",
      description: `A smooth, flat stone from the field. Ordinary enough, 
but it reminds you that God made even this dusty ground.`,
      takeable: true,
      fixed: false
    },
    clay_lamp: {
      id: "clay_lamp",
      name: "clay lamp",
      description: `A small oil lamp made of clay. It flickers with a tiny flame, 
giving just enough light to see the walls of the pit. 
Even in the darkest place, a small light matters.`,
      takeable: true,
      fixed: false
    },
    bread_loaf: {
      id: "bread_loaf",
      name: "bread loaf",
      description: `A round loaf of flatbread. The merchants have given you food
for the journey. Even in hardship, God provides.`,
      takeable: true,
      fixed: false,
      consumable: "food",
      nourishment: 45
    },
    food_bag: {
      id: "food_bag",
      name: "bag of food",
      plural: "bags of food",
      description: `A cloth bag filled with dried figs, grain, and flatbread —
enough for one good meal. Your mother packed these before you left home.
Carry too many and your feet will grow heavy.`,
      takeable: true,
      fixed: false,
      consumable: "food",
      nourishment: 40,
      stackable: true
    },
    scroll: {
      id: "scroll",
      name: "scroll",
      description: `A papyrus scroll. On it are Egyptian symbols — hieroglyphs. 
You do not yet know this language, but you sense that one day 
you will understand things others cannot.`,
      takeable: true,
      fixed: false
    }
  },

  // ── SPECIAL COMMANDS (room-specific) ──────────────────────────────────────
  specialCommands: {
    dothan_fields: {
      "inspect pit": (state) => {
        if (!state.flags.brothers_seen) {
          return { lines: ["You notice an empty cistern in the ground. It looks deep."] };
        }
        if (state.flags.brothers_no_coat) {
          return { lines: ["A deep, empty cistern. Your brothers have not noticed you looking at it."] };
        }
        if (!state.flags.pushed_in_pit) {
          state.flags.pushed_in_pit = true;
          state.room = "the_pit";
          const msgs = [
            "You lean over to look into the pit.",
            "Suddenly your brothers grab you from behind!",
            "You tumble down into the darkness..."
          ];
          const enterMsgs = GAME.rooms["the_pit"].events.onEnter(state);
          return { lines: [...msgs, ...enterMsgs], roomChanged: true };
        }
        return { lines: ["The pit is empty — you are in it."] };
      },
      "reveal": (state) => {
        if (!state.flags.brothers_no_coat) {
          return { lines: ["Your brothers already know who you are."] };
        }
        state.flags.brothers_no_coat = false;
        state.flags.pushed_in_pit = true;
        state.room = "the_pit";
        state.needs.sad = Math.min(100, state.needs.sad + 15);
        const msgs = [
          "You step forward into the open.",
          "\"Brothers — it is me. It is Joseph.\"",
          "A moment of silence. Then recognition darkens into anger.",
          "Simeon: \"The dreamer himself! He followed us here!\"",
          "They rush toward you before you can move.",
          "You tumble down into the darkness..."
        ];
        const enterMsgs = GAME.rooms["the_pit"].events.onEnter(state);
        return { lines: [...msgs, ...enterMsgs], roomChanged: true };
      }
    },
    the_pit: {
      "pray": (state) => {
        state.needs.sad   = Math.max(0, state.needs.sad   - 20);
        state.needs.tired = Math.max(0, state.needs.tired - 5);
        return { lines: [
          "You cry out to God from the darkness.",
          "Silence... but somehow you feel less alone.",
          "You remember the dreams God gave you. They must mean something."
        ]};
      },
      "wait": (state) => {
        if (!state.flags.pit_waited) {
          state.flags.pit_waited = true;
          return { lines: [
            "Time passes. Then you hear voices above — strangers.",
            "Ishmaelite merchants! Your brother Judah is talking to them.",
            "A rope drops into the pit.",
            "You climb up. Your brothers sell you for twenty pieces of silver.",
            "You are taken to the merchants' camp."
          ], moveToRoom: "merchants_camp" };
        }
        return { lines: ["You wait. God has not forgotten you."] };
      }
    }
  }
};

// ─── GAME STATE ───────────────────────────────────────────────────────────────

const SAVE_KEY = "joseph_adventure_v1";

// Snapshot initial room state so restart can fully restore it
const ROOM_INIT = {};
for (const [id, room] of Object.entries(GAME.rooms)) {
  ROOM_INIT[id] = {
    items: [...room.items],
    itemQty: room.itemQty ? { ...room.itemQty } : undefined
  };
}

function resetRooms() {
  for (const [id, room] of Object.entries(GAME.rooms)) {
    const init = ROOM_INIT[id];
    room.visited = false;
    room.items = [...init.items];
    if (init.itemQty) room.itemQty = { ...init.itemQty };
    else delete room.itemQty;
  }
}

function newState() {
  return {
    room: "canaan_home",
    inventory: [],
    flags: {
      coat_given: false,
      met_stranger: false,
      brothers_seen: false,
      pushed_in_pit: false,
      in_pit_narrated: false,
      brothers_no_coat: false,
      flee_caught: false,
      pit_waited: false,
      sold_narrated: false,
      potiphar_seen: false
    },
    moves: 0,
    needs: { thirsty: 20, hungry: 15, tired: 10, sad: 15 },
    needsWarned: {}
  };
}

let state = newState();

// ─── OUTPUT ───────────────────────────────────────────────────────────────────

const output = document.getElementById("output");
const cmdInput = document.getElementById("cmd-input");
const statusLocation = document.getElementById("status-location");
const statusInv = document.getElementById("status-inv");

function print(text, cls = "response") {
  const div = document.createElement("div");
  div.className = "line " + cls;
  div.textContent = text;
  output.appendChild(div);
  output.scrollTop = output.scrollHeight;
}

function printBlank() {
  const div = document.createElement("div");
  div.className = "line spacer";
  div.innerHTML = "&nbsp;";
  output.appendChild(div);
}

function printLines(lines, cls = "response") {
  lines.forEach(l => {
    if (l === "") printBlank();
    else print(l, cls);
  });
}

const needsBar = document.getElementById("needs-bar");

function updateStatus() {
  const room = GAME.rooms[state.room];
  statusLocation.textContent = room ? room.name : "—";
  statusInv.textContent = state.inventory.length ? inventoryNames().join(", ") : "nothing";

  needsBar.innerHTML = "";
  const labels = { thirsty: "Thirst", hungry: "Hunger", tired: "Tiredness", sad: "Mood" };
  for (const [key, label] of Object.entries(labels)) {
    let v = Math.round(state.needs[key]);
    // For mood, bar represents sadness; invert display so full bar = very sad
    const pct = Math.min(100, Math.max(0, v));
    const color = pct >= 76 ? "var(--error)" : pct >= 51 ? "var(--amber)" : "var(--green-dim)";

    const ind = document.createElement("div");
    ind.className = "need-indicator";
    ind.innerHTML =
      `<div class="need-label">${label}</div>` +
      `<div class="need-track"><div class="need-fill" style="width:${pct}%;background-color:${color}"></div></div>`;
    needsBar.appendChild(ind);
  }
}

function tickNeeds() {
  const n = state.needs;
  n.thirsty = Math.min(100, n.thirsty + 2);
  n.hungry  = Math.min(100, n.hungry  + 1);
  n.tired   = Math.min(100, n.tired   + 0.5 + state.inventory.length * 1);
  n.sad     = Math.min(100, n.sad     + 0.5);
}

function checkNeedsWarnings() {
  const n = state.needs;
  const thresholds = [
    { key: "thirsty", lvl: 50, msg: "Your mouth is dry. You need water." },
    { key: "thirsty", lvl: 80, msg: "You are very thirsty. Find water soon." },
    { key: "hungry",  lvl: 50, msg: "Your stomach growls. You need food." },
    { key: "hungry",  lvl: 80, msg: "You are very hungry. You need to eat." },
    { key: "tired",   lvl: 50, msg: "Your feet are heavy. You need rest." },
    { key: "tired",   lvl: 80, msg: "You can barely keep your eyes open. You must rest." },
    { key: "sad",     lvl: 50, msg: "Your heart is heavy with sorrow." },
    { key: "sad",     lvl: 80, msg: "A deep sadness weighs on your heart." },
  ];
  for (const t of thresholds) {
    const warnKey = t.key + "_" + t.lvl;
    if (n[t.key] >= t.lvl && !state.needsWarned[warnKey]) {
      state.needsWarned[warnKey] = true;
      print(t.msg, "system");
    }
    // reset warning if need drops back below threshold (e.g. after eating)
    if (n[t.key] < t.lvl - 10) {
      delete state.needsWarned[warnKey];
    }
  }
}

// ─── ITEM HELPERS ─────────────────────────────────────────────────────────────

function removeOneFromInventory(itemId) {
  const idx = state.inventory.indexOf(itemId);
  if (idx !== -1) state.inventory.splice(idx, 1);
}

function roomItemNames(room) {
  return room.items.map(id => {
    const item = GAME.items[id];
    if (!item) return id;
    const qty = room.itemQty?.[id];
    if (qty !== undefined && qty > 1) return `${qty} ${item.plural || item.name + "s"}`;
    return item.name;
  });
}

function inventoryNames() {
  const counts = {};
  for (const id of state.inventory) counts[id] = (counts[id] || 0) + 1;
  return Object.entries(counts).map(([id, n]) => {
    const item = GAME.items[id];
    if (!item) return id;
    return n > 1 ? `${n} ${item.plural || item.name + "s"}` : item.name;
  });
}

// ─── COMMAND PARSER ───────────────────────────────────────────────────────────

function handleCommand(raw) {
  const input = raw.trim().toLowerCase();
  if (!input) return;

  print("> " + raw, "prompt");
  state.moves++;
  tickNeeds();

  const [verb, ...rest] = input.split(/\s+/);
  const arg = rest.join(" ");

  switch (verb) {
    case "look":       cmdLook(); break;
    case "walk":       cmdWalk(arg); break;
    case "take":       cmdTake(arg); break;
    case "drop":       cmdDrop(arg); break;
    case "inspect":    cmdInspect(arg); break;
    case "inventory":
    case "inv":        cmdInventory(); break;
    case "eat":        cmdEat(arg); break;
    case "drink":      cmdDrink(arg); break;
    case "rest":       cmdRest(); break;
    case "status":     cmdStatus(); break;
    case "restart":    cmdRestart(); break;
    case "help":       cmdHelp(); break;
    case "pray":       cmdPray(); break;
    case "wait":       cmdSpecial("wait"); break;
    case "climb":      cmdClimb(arg); break;
    default:
      // try full phrase as special command
      if (!trySpecialCommand(input)) {
        print(`Unknown command: "${verb}". Type HELP for a list of commands.`, "error");
      }
  }

  checkNeedsWarnings();
  updateStatus();
  autoSave();
}

function cmdLook() {
  const room = GAME.rooms[state.room];
  printBlank();
  print(room.name.toUpperCase(), "heading");
  printBlank();
  printLines(room.description.trim().split("\n").map(l => l.trim()), "narration");

  if (room.items.length > 0) {
    printBlank();
    const names = roomItemNames(room);
    print("You can see: " + names.join(", ") + ".", "response");
  }

  const exits = Object.keys(room.exits);
  if (exits.length > 0) {
    print("Exits: " + exits.join(", ") + ".", "response");
  } else {
    print("There are no obvious exits.", "response");
  }
  printBlank();
}

function cmdWalk(dir) {
  if (!dir) { print("Walk where? Try: walk north, walk south, walk east, walk west.", "error"); return; }

  const n = state.needs;
  if (n.hungry >= 100) { print("You are too hungry to walk. You must eat something first.", "error"); return; }
  if (n.thirsty >= 100) { print("You are too thirsty to walk. You must drink something first.", "error"); return; }
  if (n.tired >= 100)  { print("You are too tired to walk. You must rest first.", "error"); return; }

  const room = GAME.rooms[state.room];
  const dest = room.exits[dir];
  if (!dest) {
    print(`You cannot walk ${dir} from here.`, "error");
    return;
  }
  moveToRoom(dest);
}

function cmdPray() {
  if (!trySpecialCommand("pray")) {
    state.needs.sad   = Math.max(0, state.needs.sad   - 10);
    state.needs.tired = Math.max(0, state.needs.tired - 5);
    print("You bow your head and pray. A quiet peace settles over you.", "narration");
  }
}

function cmdClimb(arg) {
  print("You look around but find nothing to climb here.", "error");
}

function moveToRoom(roomId, extraLines = []) {
  state.room = roomId;
  const room = GAME.rooms[roomId];
  printBlank();
  print("— " + room.name + " —", "heading");
  printBlank();

  let enterLines = [];
  if (room.events?.onEnter) {
    enterLines = room.events.onEnter(state) || [];
  }

  // If not visited, show description
  if (!room.visited) {
    room.visited = true;
    printLines(room.description.trim().split("\n").map(l => l.trim()), "narration");
  }

  if (enterLines.length) {
    printBlank();
    printLines(enterLines, "success");
  }
  if (extraLines.length) {
    printBlank();
    printLines(extraLines);
  }

  if (room.items.length > 0) {
    printBlank();
    const names = roomItemNames(room);
    print("You can see: " + names.join(", ") + ".", "response");
  }

  const exits = Object.keys(room.exits);
  if (exits.length) print("Exits: " + exits.join(", ") + ".", "response");
  else print("There are no obvious exits.", "response");

  printBlank();
}

function cmdTake(arg) {
  if (!arg) { print("Take what? Example: take coat", "error"); return; }
  const room = GAME.rooms[state.room];
  const itemId = room.items.find(id => {
    const item = GAME.items[id];
    return item && (item.name === arg || item.id === arg || item.name.includes(arg));
  });
  if (!itemId) { print(`There is no "${arg}" here to take.`, "error"); return; }
  const item = GAME.items[itemId];
  if (!item.takeable) { print(`You cannot take the ${item.name}.`, "error"); return; }

  if (item.stackable) {
    const qty = room.itemQty?.[itemId] ?? 1;
    if (qty <= 1) {
      room.items = room.items.filter(i => i !== itemId);
      if (room.itemQty) delete room.itemQty[itemId];
    } else {
      room.itemQty[itemId] = qty - 1;
    }
    state.inventory.push(itemId);
    const left = room.itemQty?.[itemId] ?? 0;
    print(`You take a ${item.name}.${left > 0 ? " (" + left + " left here)" : ""}`, "response");
  } else {
    room.items = room.items.filter(i => i !== itemId);
    state.inventory.push(itemId);
    if (itemId === "coat") state.flags.coat_given = true;
    print(`You take the ${item.name}.`, "response");
  }
}

function cmdDrop(arg) {
  if (!arg) { print("Drop what? Example: drop coat", "error"); return; }
  const itemId = state.inventory.find(id => {
    const item = GAME.items[id];
    return item && (item.name === arg || item.id === arg || item.name.includes(arg));
  });
  if (!itemId) { print(`You are not carrying a "${arg}".`, "error"); return; }

  const item = GAME.items[itemId];
  removeOneFromInventory(itemId);
  const room = GAME.rooms[state.room];

  if (item.stackable) {
    room.itemQty = room.itemQty || {};
    if (!room.items.includes(itemId)) room.items.push(itemId);
    room.itemQty[itemId] = (room.itemQty[itemId] || 0) + 1;
    const qty = room.itemQty[itemId];
    print(`You put down a ${item.name}.${qty > 1 ? " (" + qty + " here now)" : ""}`, "response");
  } else {
    room.items.push(itemId);
    print(`You drop the ${item.name}.`, "response");
  }
}

function cmdInspect(arg) {
  if (!arg) { print("Inspect what? Example: inspect coat", "error"); return; }

  // check inventory
  let itemId = state.inventory.find(id => {
    const item = GAME.items[id];
    return item && (item.name === arg || item.id === arg || item.name.includes(arg));
  });

  // check room
  if (!itemId) {
    const room = GAME.rooms[state.room];
    itemId = room.items.find(id => {
      const item = GAME.items[id];
      return item && (item.name === arg || item.id === arg || item.name.includes(arg));
    });
  }

  if (!itemId) {
    // try special inspect (like "pit")
    if (!trySpecialCommand("inspect " + arg)) {
      print(`You do not see a "${arg}" here.`, "error");
    }
    return;
  }

  const item = GAME.items[itemId];
  printBlank();
  print(item.name.toUpperCase(), "heading");
  printLines(item.description.trim().split("\n").map(l => l.trim()), "narration");
  printBlank();
}

function cmdInventory() {
  if (state.inventory.length === 0) {
    print("You are not carrying anything.", "response");
    return;
  }
  print("You are carrying:", "response");
  inventoryNames().forEach(name => print("  • " + name, "response"));
}

const EAT_JOKES = [
  (n) => `You bite the ${n}. It does not taste like food. Surprising.`,
  (n) => `You try to eat the ${n}. Your stomach disagrees.`,
  (n) => `The ${n} is not on the menu. Try looking for actual food.`,
  (n) => `You chew on the ${n} for a moment. Nope.`,
  (n) => `Even a very hungry person would not eat a ${n}.`,
];
const DRINK_JOKES = [
  (n) => `You try to drink the ${n}. It is not a beverage.`,
  (n) => `The ${n} refuses to be a drink, no matter how thirsty you are.`,
  (n) => `You hold the ${n} up and wait. Nothing comes out.`,
  (n) => `Drinking a ${n} is not something wise men recommend.`,
  (n) => `The ${n} is many things. A drink is not one of them.`,
];

function cmdEat(arg) {
  const foodId = state.inventory.find(id => {
    const item = GAME.items[id];
    if (item?.consumable !== "food") return false;
    return !arg || item.name === arg || item.name.includes(arg);
  });
  if (!foodId) {
    if (arg) {
      const wrongItem = state.inventory.find(id => {
        const item = GAME.items[id];
        return item && (item.name === arg || item.name.includes(arg));
      });
      if (wrongItem) {
        const joke = EAT_JOKES[Math.floor(Math.random() * EAT_JOKES.length)];
        print(joke(GAME.items[wrongItem].name), "error");
      } else {
        print(`You are not carrying a "${arg}" to eat.`, "error");
      }
    } else {
      print("You have nothing to eat. Look for food on your journey.", "error");
    }
    return;
  }
  const item = GAME.items[foodId];
  removeOneFromInventory(foodId);
  state.needs.hungry = Math.max(0, state.needs.hungry - item.nourishment);
  print(`You eat the ${item.name}. It fills your stomach. You feel better.`, "response");
}

function cmdDrink(arg) {
  const drinkId = state.inventory.find(id => {
    const item = GAME.items[id];
    if (item?.consumable !== "drink") return false;
    return !arg || item.name === arg || item.name.includes(arg);
  });
  if (!drinkId) {
    if (arg) {
      const wrongItem = state.inventory.find(id => {
        const item = GAME.items[id];
        return item && (item.name === arg || item.name.includes(arg));
      });
      if (wrongItem) {
        const joke = DRINK_JOKES[Math.floor(Math.random() * DRINK_JOKES.length)];
        print(joke(GAME.items[wrongItem].name), "error");
      } else {
        print(`You are not carrying a "${arg}" to drink.`, "error");
      }
    } else {
      print("You have nothing to drink. Look for water on your journey.", "error");
    }
    return;
  }
  const item = GAME.items[drinkId];
  removeOneFromInventory(drinkId);
  state.needs.thirsty = Math.max(0, state.needs.thirsty - item.hydration);
  print(`You drink from the ${item.name}. Cool water runs down your throat. Much better.`, "response");
}

function cmdRest() {
  const room = GAME.rooms[state.room];
  if (state.needs.tired < 20) {
    print("You are not tired enough to rest right now.", "response");
    return;
  }
  if (room.restable) {
    state.needs.tired  = Math.max(0, state.needs.tired  - 40);
    state.needs.hungry = Math.min(100, state.needs.hungry + 5);
    state.needs.sad    = Math.max(0, state.needs.sad    - 5);
    print(room.restMessage || "You rest for a while. You feel more refreshed.", "narration");
  } else {
    state.needs.tired  = Math.max(0, state.needs.tired  - 20);
    state.needs.hungry = Math.min(100, state.needs.hungry + 10);
    state.needs.sad    = Math.max(0, state.needs.sad    - 5);
    print("You rest on the ground, one eye open. It is not comfortable, but your legs thank you.", "narration");
    print("The uneasy rest leaves you hungrier than before.", "system");
  }
}

function cmdStatus() {
  printBlank();
  print("HOW JOSEPH FEELS", "heading");
  const labels = { thirsty: "Thirst", hungry: "Hunger", tired: "Tiredness", sad: "Mood" };
  const descs  = [
    [0,  29, "fine"],
    [30, 50, "a little"],
    [51, 75, "quite"],
    [76, 100,"very"]
  ];
  for (const [key, label] of Object.entries(labels)) {
    const v = Math.round(state.needs[key]);
    const word = descs.find(([lo, hi]) => v >= lo && v <= hi)?.[2] ?? "fine";
    const cls  = v >= 76 ? "error" : v >= 51 ? "success" : "system";
    print(`  ${label.padEnd(8)} — ${word}`, cls);
  }
  if (state.inventory.length > 2) {
    print(`  (Carrying ${state.inventory.length} items is making you tired faster.)`, "system");
  }
  printBlank();
}

function cmdRestart() {
  state = newState();
  resetRooms();
  try { localStorage.removeItem(SAVE_KEY); } catch(e) {}
  output.innerHTML = "";
  intro();
}

function cmdHelp() {
  printBlank();
  print("COMMANDS", "heading");
  const cmds = [
    ["look",              "Describe your current location"],
    ["walk [direction]",  "Move: north, south, east, west"],
    ["take [item]",       "Pick up an item"],
    ["drop [item]",       "Put down an item you are carrying"],
    ["inspect [item]",    "Examine an item closely"],
    ["inventory",         "List what you are carrying"],
    ["eat",               "Eat food from your inventory"],
    ["drink",             "Drink from something in your inventory"],
    ["rest",              "Rest (only in safe places)"],
    ["status",            "See how Joseph is feeling"],
    ["reveal",            "Reveal yourself (works in certain places)"],
    ["pray",              "Pray (works in certain places)"],
    ["wait",              "Wait (sometimes things happen)"],
    ["restart",           "Start the game over from the beginning"],
    ["help",              "Show this list"],
  ];
  cmds.forEach(([cmd, desc]) => {
    print(`  ${cmd.padEnd(20)} ${desc}`, "system");
  });
  printBlank();
  print("Syntax matters. Type commands exactly as shown.", "system");
  printBlank();
}

function autoSave() {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); } catch(e) {}
}

function cmdSpecial(fullCmd) {
  trySpecialCommand(fullCmd);
}

function trySpecialCommand(input) {
  const roomSpecials = GAME.specialCommands[state.room];
  if (!roomSpecials) return false;

  const handler = roomSpecials[input];
  if (!handler) return false;

  const result = handler(state);
  if (result.lines) printLines(result.lines, "narration");
  if (result.moveToRoom) moveToRoom(result.moveToRoom);
  if (result.roomChanged) cmdLook();
  return true;
}

// ─── INPUT HANDLER ────────────────────────────────────────────────────────────

cmdInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const val = cmdInput.value;
    cmdInput.value = "";
    handleCommand(val);
  }
});

// keep focus on input
document.addEventListener("click", () => cmdInput.focus());

// ─── INTRO ────────────────────────────────────────────────────────────────────

function intro() {
  printBlank();
  print("★  JOSEPH IN EGYPT  ★", "heading");
  print("   A Bible Text Adventure", "heading");
  printBlank();

  let resumed = false;
  try {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      state = JSON.parse(saved);
      resumed = true;
    }
  } catch(e) {}

  if (resumed) {
    print("Your progress has been restored.", "system");
  } else {
    printLines([
      "The year is around 1700 BC. You are Joseph, son of Jacob,",
      "beloved of your father and blessed with dreams from God.",
      "Your story is about to begin."
    ], "narration");
  }

  printBlank();
  print("Type HELP to see all commands. Type LOOK to see where you are.", "system");
  print("Syntax matters — type commands exactly as shown.", "system");
  printBlank();
  print("━".repeat(55), "system");
  printBlank();

  if (resumed) {
    updateStatus();
    cmdLook();
  } else {
    moveToRoom("canaan_home");
  }
}

intro();
updateStatus();
cmdInput.focus();

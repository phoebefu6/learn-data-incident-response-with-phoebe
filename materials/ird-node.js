// Run the browser engine (assets/ird-live.js) in node on the shipped sample and print the canon as
// JSON, in the same shape as materials/ird_reference.py --json. Usage: node materials/ird-node.js <repo>
const fs = require("fs"), path = require("path"), vm = require("vm");
const repo = process.argv[2] || path.join(__dirname, "..");
const ctx = { console };
ctx.window = ctx;
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(repo, "assets/ird-sample.js"), "utf8"), ctx);
vm.runInContext(fs.readFileSync(path.join(repo, "assets/ird-live.js"), "utf8"), ctx);
const I = ctx.IRD, S = ctx.IRD_SAMPLE;
function strip(r) {
  const out = JSON.parse(JSON.stringify(r, (k, v) => (k[0] === "_" ? undefined : v)));
  return out;
}
function one([rid, name, o]) { const r = strip(I.run(S, o)); r.rung = rid; r.name = name; return r; }
const MOVES = [
  ["m1", "Learner moves on the no-plan baseline", { times: { load: { declare: 60, contain: 90, correct: 300 },
    leak: { declare: 240, contain: 250, correct: 600 }, board: { declare: 2900, contain: 2910, correct: 3000 } } }],
  ["m2", "Correct before contain, typed by hand", { declare: true, times: { load: { declare: 100, contain: 900, correct: 400 } } }],
  ["m3", "Rehearsed plan plus fix-first switch", { declare: true, roles: true, playbook: true, lineage: true, rehearsed: true, fixFirst: true }],
  ["m4", "Rehearsed plan plus drop-table switch", { declare: true, roles: true, playbook: true, lineage: true, rehearsed: true, dropEvidence: true }]
];
console.log(JSON.stringify({ ladder: I.PRESETS.map(one), traps: I.TRAPS.map(one), moves: MOVES.map(one) }, null, 1));

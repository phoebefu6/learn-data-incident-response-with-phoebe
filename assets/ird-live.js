/* ird-live.js - the incident clock for learn-data-incident-response-with-phoebe.
 *
 * An event-driven replay, not an animation. assets/ird-sample.js holds Quarrybank's three incidents
 * (Constructed Quarrybank example) as timestamped event logs: every materialisation of a downstream
 * copy, every read, every decision made on a number, every access through an open door. A response
 * plan (or the learner's own move times) fixes when the incident is declared, assessed, contained
 * and corrected, and who is told; the engine replays the log against those times and counts:
 *   - consumers and decisions that used bad data before it was corrected or they were told (headline)
 *   - consumers never told, copies still wrong, people who read bad data, rows exposed (leak)
 *   - time to declare, contain and correct, measured from the first signal
 *   - notice deadlines met or missed. Deadlines are FIXED INPUTS owned by sibling courses.
 * materials/ird_reference.py implements the same rules in Python; materials/compare-ladder.py checks
 * the two engines by value on every rung and trap.
 */
(function (root) {
  "use strict";

  var DEFAULTS = { declare: false, roles: false, playbook: false, lineage: false, rehearsed: false,
    fixFirst: false, dropEvidence: false, times: null };
  var PRESETS = [
    ["r0", "No plan", {}],
    ["r1", "Declare rule", { declare: true }],
    ["r2", "Severity and roles", { declare: true, roles: true }],
    ["r3", "Containment playbook", { declare: true, roles: true, playbook: true }],
    ["r4", "Lineage-driven consumer notice", { declare: true, roles: true, playbook: true, lineage: true }],
    ["r5", "Rehearsed plan", { declare: true, roles: true, playbook: true, lineage: true, rehearsed: true }]
  ];
  var TRAPS = [
    ["t1", "Fix before you contain", { declare: true, roles: true, playbook: true, lineage: true, fixFirst: true }],
    ["t2", "Drop the bad table to stop it", { declare: true, roles: true, playbook: true, lineage: true, dropEvidence: true }],
    ["t3", "Tell only the people who complained", { declare: true, roles: true, playbook: true, rehearsed: true }]
  ];

  function merge(o) {
    var r = {}, k;
    for (k in DEFAULTS) r[k] = DEFAULTS[k];
    if (o) for (k in o) r[k] = o[k];
    return r;
  }

  function clock(inc, o) {
    var S = inc.signal, C = inc.complaint, reh = o.rehearsed;
    var declare = reh ? S + 5 : (o.declare ? S + 15 : C);
    var assess = reh ? declare + 10 : (o.roles ? declare + 20 : declare + 240);
    var contain = assess + (o.playbook ? (reh ? 10 : 15) : 120);
    var correct = contain + (reh ? 180 : 360) + (o.dropEvidence ? 240 : 0);
    if (o.fixFirst) contain = correct;
    var ov = (o.times && o.times[inc.id]) || {};
    if (ov.declare !== null && ov.declare !== undefined) {
      declare = ov.declare;
      assess = reh ? declare + 10 : (o.roles ? declare + 20 : declare + 240);
    }
    if (ov.contain !== null && ov.contain !== undefined) contain = ov.contain;
    if (ov.correct !== null && ov.correct !== undefined) correct = ov.correct;
    contain = Math.max(contain, declare);
    correct = Math.max(correct, declare);
    contain = Math.min(contain, correct);
    return { declare: declare, assess: assess, contain: contain, correct: correct,
      notifyAt: contain + (reh ? 15 : 30),
      formal: reh ? assess + 720 : (o.roles ? assess + 1440 : declare + 7200) };
  }

  function unionSize(ranges) {
    ranges = ranges.slice().sort(function (a, b) { return a[0] - b[0] || a[1] - b[1]; });
    var tot = 0, lo = null, hi = null, i;
    for (i = 0; i < ranges.length; i++) {
      if (hi === null || ranges[i][0] > hi) {
        if (hi !== null) tot += hi - lo;
        lo = ranges[i][0]; hi = ranges[i][1];
      } else if (ranges[i][1] > hi) hi = ranges[i][1];
    }
    if (hi !== null) tot += hi - lo;
    return tot;
  }

  function runIncident(inc, o) {
    var k = clock(inc, o), S = inc.signal, i, e, n;
    var nodes = {}, order = [], tainted = {};
    for (i = 0; i < inc.nodes.length; i++) { n = inc.nodes[i]; nodes[n.id] = n; order.push(n.id); tainted[n.id] = false; }
    for (i = 0; i < inc.events.length; i++) {
      e = inc.events[i];
      if (e.k === "mat" && e.t < k.contain) tainted[e.n] = true;
    }
    var doorClose = {};
    for (i = 0; i < inc.doors.length; i++) {
      var d = inc.doors[i];
      doorClose[d.id] = (o.playbook || d.basic) ? k.contain : k.correct;
    }
    var reached = {};
    for (i = 0; i < inc.events.length; i++) {
      e = inc.events[i];
      if (e.k === "access" && e.t < doorClose[e.door]) reached[e.p] = true;
    }
    var notified = {};
    for (i = 0; i < order.length; i++) {
      n = nodes[order[i]];
      if (!n.notifiable) notified[n.id] = null;
      else if (o.lineage) notified[n.id] = (tainted[n.id] || reached[n.id]) ? k.notifyAt : null;
      else notified[n.id] = n.known ? k.declare + 60 : null;
    }
    function clear(id) {
      var c = Infinity;
      if (nodes[id].refresh) c = Math.min(c, k.correct);
      if (notified[id] !== null) c = Math.min(c, notified[id]);
      return c;
    }
    var badReads = 0, readers = {}, nReaders = 0, decisions = [];
    for (i = 0; i < inc.events.length; i++) {
      e = inc.events[i];
      if ((e.k === "read" || e.k === "decision") && tainted[e.n] && e.t < clear(e.n)) {
        reached[e.n] = true;
        if (e.k === "read") {
          badReads++;
          if (!readers[e.r]) { readers[e.r] = true; nReaders++; }
        } else decisions.push(e.d);
      }
    }
    var reachedList = [], never = [], stillWrong = 0;
    for (i = 0; i < order.length; i++) {
      var id = order[i];
      if (reached[id]) {
        reachedList.push(id);
        if (nodes[id].notifiable && notified[id] === null) never.push(id);
      }
      if (tainted[id] && !nodes[id].refresh && notified[id] === null) stillWrong++;
    }
    var rowsAtContain = 0, rowsTotal = 0;
    if (inc.rows) {
      var atC = [], tot = [];
      for (i = 0; i < inc.events.length; i++) {
        e = inc.events[i];
        if (e.k !== "access") continue;
        if (e.t < k.contain) atC.push([e.lo, e.hi]);
        if (e.t < doorClose[e.door]) tot.push([e.lo, e.hi]);
      }
      rowsAtContain = unionSize(atC); rowsTotal = unionSize(tot);
      if (o.dropEvidence) { rowsAtContain = inc.rows; rowsTotal = inc.rows; }
    }
    var dls = [];
    for (i = 0; i < inc.deadlines.length; i++) {
      var dl = inc.deadlines[i], due, done;
      if (dl.kind === "hours") { due = S + dl.hours * 60; done = k.formal; }
      else if (dl.kind === "calendarDays") {
        var day = Math.floor((inc.abs0 + k.assess) / 1440);
        due = (day + dl.days + 1) * 1440 - inc.abs0; done = k.formal;
      } else {
        due = S + dl.hours * 60;
        done = notified.hasOwnProperty(dl.node) ? notified[dl.node] : null;
      }
      dls.push({ id: dl.id, due: due, done: done, met: done !== null && done <= due });
    }
    return {
      id: inc.id,
      declare: k.declare, assess: k.assess, contain: k.contain, correct: k.correct,
      ttDeclare: k.declare - S, ttContain: k.contain - S, ttCorrect: k.correct - S,
      consumersReached: reachedList.length, reached: reachedList,
      decisionsOnBad: decisions.length, decisions: decisions,
      badReads: badReads, peopleRead: nReaders,
      neverNotified: never.length, never: never, stillWrong: stillWrong,
      rowsAtContain: rowsAtContain, rowsTotal: rowsTotal,
      evidence: o.dropEvidence ? "lost" : "kept",
      deadlines: dls,
      _k: k, _tainted: tainted, _notified: notified, _doorClose: doorClose
    };
  }

  function run(sample, opts) {
    var o = merge(opts), incs = [], i, j, tot = { c: 0, d: 0, n: 0, s: 0, p: 0, m: 0, t: 0 };
    for (i = 0; i < sample.incidents.length; i++) incs.push(runIncident(sample.incidents[i], o));
    for (i = 0; i < incs.length; i++) {
      tot.c += incs[i].consumersReached; tot.d += incs[i].decisionsOnBad; tot.n += incs[i].neverNotified;
      tot.s += incs[i].stillWrong; tot.p += incs[i].peopleRead;
      for (j = 0; j < incs[i].deadlines.length; j++) { tot.t++; if (incs[i].deadlines[j].met) tot.m++; }
    }
    return { incidents: incs, consumersReached: tot.c, decisionsOnBad: tot.d, neverNotified: tot.n,
      stillWrong: tot.s, peopleRead: tot.p, deadlinesMet: tot.m, deadlinesTotal: tot.t };
  }

  function hm(m) {
    if (m === null || m === undefined) return "never";
    var neg = m < 0; m = Math.abs(Math.round(m));
    var h = Math.floor(m / 60), mm = m % 60;
    return (neg ? "-" : "") + h + "h" + (mm < 10 ? "0" : "") + mm;
  }

  root.IRD = { run: run, PRESETS: PRESETS, TRAPS: TRAPS, DEFAULTS: DEFAULTS, hm: hm, clock: clock };

  /* ------------------------------------------------------------------ widget */
  if (typeof document === "undefined") return;

  var SVGNS = "http://www.w3.org/2000/svg";
  var LEVERS = [
    ["declare", "Declare rule", "declare on the first signal, not the first complaint"],
    ["roles", "Severity and roles", "a commander, a severity, the privacy partner in the room"],
    ["playbook", "Containment playbook", "pause, quarantine, revoke every door"],
    ["lineage", "Lineage-driven notice", "tell every consumer the trace finds"],
    ["rehearsed", "Rehearsed plan", "a tabletop run before the real one"],
    ["fixFirst", "Trap: fix before you contain", "containment waits for the fix"],
    ["dropEvidence", "Trap: drop the bad table", "stops it fast, destroys the record"]
  ];

  function el(tag, cls, txt) {
    var x = document.createElement(tag);
    if (cls) x.className = cls;
    if (txt !== undefined && txt !== null) x.textContent = txt;
    return x;
  }
  function sv(tag, attrs) {
    var x = document.createElementNS(SVGNS, tag), k;
    for (k in attrs) x.setAttribute(k, attrs[k]);
    return x;
  }
  function nodeName(inc, id) {
    for (var i = 0; i < inc.nodes.length; i++) if (inc.nodes[i].id === id) return inc.nodes[i].name;
    return id;
  }

  function Bench(host, sample) {
    this.host = host; this.sample = sample;
    var only = host.getAttribute("data-presets");
    this.presetIds = only ? only.split(",") : null;
    this.full = host.getAttribute("data-ird-bench") !== "lite";
    this.o = merge({});
    this.times = {};
    this.rung = null;
    this.build();
    this.setRung(host.getAttribute("data-start") || "r0");
  }

  Bench.prototype.build = function () {
    var self = this, h = this.host, i;
    h.className += " ird-bench";
    var head = el("div", "ird-head");
    head.appendChild(el("h4", null, "The incident clock · Quarrybank's quarter, replayed"));
    head.appendChild(el("p", "ird-rail", "Constructed Quarrybank example: every event, reader, row and time in the log is constructed. The replay and every count below are computed live from that log. Notice deadlines are fixed inputs owned by the GDPR and PDPA courses; contract and policy terms are constructed."));
    h.appendChild(head);

    var lad = el("div", "ird-ladder");
    lad.appendChild(el("span", "ird-clabel", "Plans"));
    var all = PRESETS.concat((this.full || this.presetIds) ? TRAPS : []);
    this.btns = {};
    for (i = 0; i < all.length; i++) {
      if (this.presetIds && this.presetIds.indexOf(all[i][0]) < 0) continue;
      var b = el("button", "ird-rung" + (all[i][0].charAt(0) === "t" ? " ird-trap" : ""));
      b.type = "button";
      b.appendChild(el("b", null, all[i][0].toUpperCase()));
      b.appendChild(document.createTextNode(" " + all[i][1]));
      b.setAttribute("data-rung", all[i][0]);
      b.addEventListener("click", (function (id) { return function () { self.setRung(id); }; })(all[i][0]));
      lad.appendChild(b);
      this.btns[all[i][0]] = b;
    }
    h.appendChild(lad);

    if (this.full) {
      var lv = el("div", "ird-levers");
      this.boxes = {};
      for (i = 0; i < LEVERS.length; i++) {
        var lab = el("label", "ird-lever" + (LEVERS[i][0] === "fixFirst" || LEVERS[i][0] === "dropEvidence" ? " ird-lever-trap" : ""));
        var cb = document.createElement("input");
        cb.type = "checkbox"; cb.setAttribute("data-lever", LEVERS[i][0]);
        cb.addEventListener("change", function () { self.fromBoxes(); });
        lab.appendChild(cb);
        var t = el("span", "ird-lt");
        t.appendChild(el("b", null, LEVERS[i][1]));
        t.appendChild(el("small", null, LEVERS[i][2]));
        lab.appendChild(t);
        lv.appendChild(lab);
        this.boxes[LEVERS[i][0]] = cb;
      }
      h.appendChild(lv);

      var mv = el("div", "ird-moves");
      mv.appendChild(el("span", "ird-clabel", "Your own move times (minutes after the bad write)"));
      var sel = document.createElement("select");
      sel.className = "ird-sel";
      for (i = 0; i < this.sample.incidents.length; i++) {
        var op = document.createElement("option");
        op.value = this.sample.incidents[i].id; op.textContent = this.sample.incidents[i].name;
        sel.appendChild(op);
      }
      mv.appendChild(sel);
      this.sel = sel;
      this.inputs = {};
      ["declare", "contain", "correct"].forEach(function (key) {
        var l = el("label", "ird-tin");
        l.appendChild(el("span", null, key));
        var inp = document.createElement("input");
        inp.type = "number"; inp.min = "0"; inp.step = "5"; inp.setAttribute("data-move", key);
        l.appendChild(inp);
        mv.appendChild(l);
        self.inputs[key] = inp;
      });
      var go = el("button", "ird-go", "Replay with these times");
      go.type = "button";
      go.addEventListener("click", function () { self.fromMoves(); });
      var clr = el("button", "ird-go ird-clr", "Clear my times");
      clr.type = "button";
      clr.addEventListener("click", function () { self.times = {}; self.render(); });
      mv.appendChild(go); mv.appendChild(clr);
      sel.addEventListener("change", function () { self.fillMoves(); });
      h.appendChild(mv);
    }

    this.headline = el("div", "ird-headline");
    h.appendChild(this.headline);
    this.stage = el("div", "ird-stage");
    h.appendChild(this.stage);
    this.table = el("div", "ird-tablewrap");
    h.appendChild(this.table);
    this.detail = el("div", "ird-detail");
    h.appendChild(this.detail);
  };

  Bench.prototype.setRung = function (id) {
    var all = PRESETS.concat(TRAPS), i;
    for (i = 0; i < all.length; i++) if (all[i][0] === id) { this.o = merge(all[i][2]); break; }
    this.rung = id; this.times = {};
    this.render();
  };
  Bench.prototype.fromBoxes = function () {
    var o = {}, k;
    for (k in this.boxes) o[k] = this.boxes[k].checked;
    this.o = merge(o);
    this.rung = null;
    for (var i = 0; i < PRESETS.concat(TRAPS).length; i++) {
      var p = merge(PRESETS.concat(TRAPS)[i][2]), same = true;
      for (k in this.boxes) if (!!p[k] !== !!o[k]) same = false;
      if (same) { this.rung = PRESETS.concat(TRAPS)[i][0]; break; }
    }
    this.render();
  };
  Bench.prototype.fromMoves = function () {
    var id = this.sel.value, t = {}, key, v;
    for (key in this.inputs) {
      v = this.inputs[key].value;
      t[key] = (v === "" || isNaN(parseFloat(v))) ? null : Math.max(0, Math.round(parseFloat(v)));
    }
    this.times[id] = t;
    this.render();
  };
  Bench.prototype.fillMoves = function () {
    if (!this.inputs || !this.last) return;
    var id = this.sel.value, r = null;
    for (var i = 0; i < this.last.incidents.length; i++) if (this.last.incidents[i].id === id) r = this.last.incidents[i];
    if (!r) return;
    this.inputs.declare.value = r.declare; this.inputs.contain.value = r.contain; this.inputs.correct.value = r.correct;
  };

  Bench.prototype.render = function () {
    var o = merge(this.o), k;
    o.times = {};
    for (k in this.times) o.times[k] = this.times[k];
    var r = run(this.sample, o);
    this.last = r;
    for (k in this.btns) this.btns[k].classList.toggle("is-on", k === this.rung && !Object.keys(this.times).length);
    if (this.boxes) for (k in this.boxes) this.boxes[k].checked = !!this.o[k];
    this.fillMoves();

    var hl = this.headline;
    hl.innerHTML = "";
    var big = el("div", "ird-big");
    var n1 = el("b", "ird-num", String(r.consumersReached));
    n1.setAttribute("data-ird", "consumers");
    var n2 = el("b", "ird-num", String(r.decisionsOnBad));
    n2.setAttribute("data-ird", "decisions");
    big.appendChild(n1); big.appendChild(el("span", null, " consumers and "));
    big.appendChild(n2); big.appendChild(el("span", null, " decisions used bad data before it was corrected or they were told"));
    hl.appendChild(big);
    var sub = el("div", "ird-subs");
    var pairs = [
      ["never", r.neverNotified, "consumers never told"],
      ["stillwrong", r.stillWrong, "copies still wrong at the end"],
      ["people", r.peopleRead, "people read bad data"],
      ["deadlines", r.deadlinesMet + " of " + r.deadlinesTotal, "notice deadlines met"]
    ];
    for (var i = 0; i < pairs.length; i++) {
      var c = el("span", "ird-chip" + ((pairs[i][0] === "never" || pairs[i][0] === "stillwrong") && pairs[i][1] > 0 ? " ird-hot" : "")
        + (pairs[i][0] === "deadlines" && r.deadlinesMet < r.deadlinesTotal ? " ird-hot" : ""));
      var bb = el("b", null, String(pairs[i][1]));
      bb.setAttribute("data-ird", pairs[i][0]);
      c.appendChild(bb); c.appendChild(document.createTextNode(" " + pairs[i][2]));
      sub.appendChild(c);
    }
    hl.appendChild(sub);
    var tag = el("p", "ird-which", (this.rung && !Object.keys(this.times).length) ? ("Plan " + this.rung.toUpperCase()) : "Custom plan or move times");
    hl.appendChild(tag);

    this.drawStage(r);
    this.drawTable(r);
    this.drawDetail(r);
  };

  Bench.prototype.drawStage = function (r) {
    var st = this.stage, i, j;
    st.innerHTML = "";
    var rowH = 92, H = 30 + rowH * r.incidents.length + 40;
    var svg = sv("svg", { viewBox: "0 0 880 " + H, role: "img", "class": "ird-svg",
      "aria-label": "One timeline per incident. Amber band: the bad data is spreading, from the bad write to containment. Pale band: contained but not yet corrected. Dots are reads and accesses, diamonds are decisions; filled amber or red means it used bad data." });
    for (i = 0; i < r.incidents.length; i++) {
      var R = r.incidents[i], inc = this.sample.incidents[i], y0 = 30 + i * rowH;
      var last = 0;
      for (j = 0; j < inc.events.length; j++) last = Math.max(last, inc.events[j].t);
      var end = Math.max(last, R.correct, R.declare) * 1.04 + 30;
      var x = function (t) { return 40 + (Math.max(0, Math.min(t, end)) / end) * 800; };
      var title = sv("text", { x: 40, y: y0 - 8, "class": "ird-t" });
      title.textContent = inc.name + " · constructed";
      svg.appendChild(title);
      var yl = y0 + 34;
      svg.appendChild(sv("rect", { x: 40, y: y0 + 10, width: 800, height: 48, rx: 6, "class": "ird-track" }));
      svg.appendChild(sv("rect", { x: 40, y: y0 + 10, width: Math.max(1, x(R.contain) - 40), height: 48, rx: 6, "class": "ird-spread" }));
      if (R.correct > R.contain) svg.appendChild(sv("rect", { x: x(R.contain), y: y0 + 10, width: Math.max(1, x(R.correct) - x(R.contain)), height: 48, "class": "ird-held" }));
      svg.appendChild(sv("line", { x1: x(inc.signal), x2: x(inc.signal), y1: y0 + 4, y2: y0 + 64, "class": "ird-sig" }));
      svg.appendChild(sv("line", { x1: x(R.declare), x2: x(R.declare), y1: y0 + 4, y2: y0 + 64, "class": "ird-dec" }));
      svg.appendChild(sv("line", { x1: x(R.correct), x2: x(R.correct), y1: y0 + 4, y2: y0 + 64, "class": "ird-cor" }));
      var clearAt = {};
      for (j = 0; j < inc.nodes.length; j++) {
        var nd = inc.nodes[j], c = Infinity;
        if (nd.refresh) c = Math.min(c, R._k.correct);
        if (R._notified[nd.id] !== null && R._notified[nd.id] !== undefined) c = Math.min(c, R._notified[nd.id]);
        clearAt[nd.id] = c;
      }
      for (j = 0; j < inc.events.length; j++) {
        var e = inc.events[j], ex = x(e.t);
        if (e.k === "read") {
          var bad = R._tainted[e.n] && e.t < clearAt[e.n];
          svg.appendChild(sv("circle", { cx: ex, cy: yl - 10, r: 3.2, "class": bad ? "ird-bad" : "ird-ok" }));
        } else if (e.k === "access") {
          var open = e.t < R._doorClose[e.door];
          svg.appendChild(sv("circle", { cx: ex, cy: yl - 10, r: 3.2, "class": open ? "ird-bad" : "ird-ok" }));
        } else if (e.k === "decision") {
          var bd = R._tainted[e.n] && e.t < clearAt[e.n];
          svg.appendChild(sv("path", { d: "M" + ex + " " + (yl + 2) + " l6 7 l-6 7 l-6 -7 z", "class": bd ? "ird-dbad" : "ird-dok" }));
        }
      }
    }
    var ly = H - 14, items = [["ird-sig", "first signal"], ["ird-dec", "declared"], ["ird-cor", "corrected"]];
    for (i = 0; i < items.length; i++) {
      svg.appendChild(sv("line", { x1: 40 + i * 150, x2: 64 + i * 150, y1: ly - 4, y2: ly - 4, "class": items[i][0] }));
      var tt = sv("text", { x: 70 + i * 150, y: ly, "class": "ird-l" });
      tt.textContent = items[i][1];
      svg.appendChild(tt);
    }
    svg.appendChild(sv("rect", { x: 490, y: ly - 11, width: 14, height: 12, "class": "ird-spread" }));
    var t2 = sv("text", { x: 510, y: ly, "class": "ird-l" }); t2.textContent = "spreading";
    svg.appendChild(t2);
    svg.appendChild(sv("rect", { x: 600, y: ly - 11, width: 14, height: 12, "class": "ird-held" }));
    var t3 = sv("text", { x: 620, y: ly, "class": "ird-l" }); t3.textContent = "contained, not corrected";
    svg.appendChild(t3);
    st.appendChild(svg);
    st.appendChild(el("p", "ird-note", "Each row has its own time scale, from the bad write to just past the last event. Filled amber dots and red diamonds used bad data."));
  };

  Bench.prototype.drawTable = function (r) {
    var w = this.table;
    w.innerHTML = "";
    var t = el("table", "clean ird-table");
    var hr = el("tr");
    ["Incident", "Declare", "Contain", "Correct", "Consumers", "Decisions", "Never told", "Deadlines"].forEach(function (x) { hr.appendChild(el("th", null, x)); });
    var th = el("thead"); th.appendChild(hr); t.appendChild(th);
    var tb = el("tbody");
    for (var i = 0; i < r.incidents.length; i++) {
      var R = r.incidents[i], inc = this.sample.incidents[i], tr = el("tr");
      tr.setAttribute("data-inc", R.id);
      var met = 0;
      for (var j = 0; j < R.deadlines.length; j++) if (R.deadlines[j].met) met++;
      [inc.name, hm(R.ttDeclare), hm(R.ttContain), hm(R.ttCorrect), R.consumersReached, R.decisionsOnBad, R.neverNotified, met + " of " + R.deadlines.length]
        .forEach(function (x) { tr.appendChild(el("td", null, String(x))); });
      tb.appendChild(tr);
    }
    t.appendChild(tb);
    w.appendChild(t);
    w.appendChild(el("p", "ird-note", "Declare, contain and correct are measured from the first signal, in hours and minutes."));
  };

  Bench.prototype.drawDetail = function (r) {
    var d = this.detail, i, j;
    d.innerHTML = "";
    for (i = 0; i < r.incidents.length; i++) {
      var R = r.incidents[i], inc = this.sample.incidents[i];
      var box = el("details", "ird-inc");
      var sm = el("summary", null, inc.name + ": what it reached");
      box.appendChild(sm);
      var ul = el("ul");
      ul.appendChild(el("li", null, "Signal: " + inc.signalText + " (" + hm(inc.signal) + " after the bad write). First complaint: " + inc.complaintText + " (" + hm(inc.complaint) + ")."));
      ul.appendChild(el("li", null, "Reached: " + (R.reached.length ? R.reached.map(function (id) { return nodeName(inc, id); }).join("; ") : "nothing") + "."));
      ul.appendChild(el("li", null, "Decisions made on bad data: " + (R.decisions.length ? R.decisions.join("; ") : "none") + "."));
      ul.appendChild(el("li", null, "Never told: " + (R.never.length ? R.never.map(function (id) { return nodeName(inc, id); }).join("; ") : "nobody") + ". Bad reads: " + R.badReads + ", by " + R.peopleRead + " people."));
      if (inc.rows) ul.appendChild(el("li", null, "Customer rows exposed: " + R.rowsAtContain.toLocaleString("en-GB") + " when containment landed, " + R.rowsTotal.toLocaleString("en-GB") + " before every door closed, of " + inc.rows.toLocaleString("en-GB") + (R.evidence === "lost" ? ". Evidence dropped, so every row must be assumed exposed." : ".")));
      for (j = 0; j < R.deadlines.length; j++) {
        var D = R.deadlines[j], src = inc.deadlines[j];
        var li = el("li", D.met ? null : "ird-miss", (D.met ? "Met: " : "Missed: ") + src.label + ". Due " + hm(D.due) + " after the bad write, done " + hm(D.done) + ". ");
        if (/^https:/.test(src.owner)) {
          var a = el("a", null, "Owned by the sibling course");
          a.href = src.owner;
          li.appendChild(a);
        } else li.appendChild(document.createTextNode("(" + src.owner + ")"));
        ul.appendChild(li);
      }
      box.appendChild(ul);
      d.appendChild(box);
    }
  };

  function boot() {
    var sample = root.IRD_SAMPLE;
    if (!sample) return;
    root.IRD.sample = sample;
    var hosts = document.querySelectorAll("[data-ird-bench]"), list = [];
    for (var i = 0; i < hosts.length; i++) list.push(new Bench(hosts[i], sample));
    root.IRD_BENCH = {
      benches: list,
      setRung: function (id, n) { list[n || 0].setRung(id); return list[n || 0].last; },
      read: function (n) { return list[n || 0].last; }
    };
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(typeof window !== "undefined" ? window : this);

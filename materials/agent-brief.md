# Agent brief - shared by every fan-out page of learn-data-incident-response-with-phoebe

Filled 2026-11-10 from course-builder/references/agent-brief.template.md. Internal build document: never
linked from an audience page.

You are writing ONE static HTML session page. No servers, no npm. **If your target file already
exists on disk, do not write it; report that and stop.** Write the file, return its path and one
line of coverage. No HTML in your reply.

## Read first, in this order

1. The template page for YOUR track. Copy its structure, classes, SVG grammar and quiz markup
   EXACTLY, including 3 options per quiz question:
   - Leader track: `/Users/phoebe.fu/Documents/claude_work/github_repo/learn-data-incident-response-with-phoebe/courses/a1-is-this-an-incident.html`
   - Responder track: `/Users/phoebe.fu/Documents/claude_work/github_repo/learn-data-incident-response-with-phoebe/courses/b1-timeline-starts-at-first-signal.html`
2. The source map: every verified number, its evidence tier, per-session coverage, the seams, the bench
   canon. Use ONLY its numbers; never invent a statistic; if a fact is missing, teach the uncertainty.
   `/Users/phoebe.fu/Documents/claude_work/github_repo/learn-data-incident-response-with-phoebe/materials/official-course-map.md`
3. The stylesheet `:root` block (first 30 lines) for the palette tokens:
   `/Users/phoebe.fu/Documents/claude_work/github_repo/learn-data-incident-response-with-phoebe/assets/style.css`

## Page skeleton (keep every component)

toolbar (crumb EXACTLY `<a href="../index.html">learn-data-incident-response-with-phoebe</a> / Leader session N of 6`
or `/ Responder session N of 8`, #toggle-all, #zoom-toggle) · masthead (eyebrow
"Learn Incident Response for Data Teams with Phoebe · Leader session N of 6" or "· Responder session N of 8",
h1 with one `<span class="accent">`, .sub, .chip-row with the level chip 🟢 Foundations (session 1),
🟡 Building (2-3), 🟠 Hands-on (4-6 responder, 4-5 leader), 🔴 Advanced (leader 6, responder 7),
.agenda a1-a4) · main.wrap · section#intro (Part 0: kicker, .lede, .legend pills,
.callout.win "★ What you walk out with tonight.") · 3 Parts, each `section.section#part-N` with
section-kicker (klabel "Part N · covers ...", h2, `.tag.concept "N min live"`), a `.lede`, ONE figure,
`details.card` accordions (summary: `.mode.live` or `.mode.self`, title, `.mini`, `.caret ▶`), at
least one `.callout.example` with `span.ex-pill` "Real world" on the page (Quarrybank stories open
with "Constructed Quarrybank example.") · section#demo-1 Build-along (kicker `.tag.demo "★ 22 min ·
everyone builds"`, .lede, ONE figure, `.steps > .step`, each step a `p` and where useful a
`.prompt-box.good` carrying a `span.label`; one step produces this session's plan page, see your
outline) · section#exercise Homework (ol, 4 items) · section#quiz (3 x `.quiz-q data-answer="0-based"`,
`p.qtext`, three `button.qopt` "A · ...", `p.qwhy`; one `p.quiz-score` after the last; vary the
correct letter) · section#official, h2 EXACTLY "What this session teaches, and where it came from",
`.covered > .covered-row` (pill solid ✓ / light ◐ / inkpill · + name + note), then the `.mono` line
EXACTLY "Every fact on this page, and its verification tier, is recorded in the course's source map."
· section.cheat#cheatsheet (h3 "Leader session N cheat sheet <span>· pin this</span>" or "Responder
session N cheat sheet <span>· pin this</span>", .grid-2 of six .cheat-item) · `.callout.next` with
`.nx-pill` "Next session" · footer.pagefoot (format below) · scripts.

Scripts at the end, exactly: `<script src="../assets/app.js?v=1"></script>`. If (and only if) your
outline says to embed the bench, also add `<script src="../assets/ird-sample.js?v=1"></script>` and
`<script src="../assets/ird-live.js?v=1"></script>` and place
`<div data-ird-bench="lite" data-presets="..." data-start="..."></div>` in the build-along.

Head: the template's social meta block with this page's own title/description/url (url
`https://phoebefu6.github.io/learn-data-incident-response-with-phoebe/courses/<file>`, image
`.../assets/og-cover.png`); `<title>Leader session N · Title - learn incident response for data teams with phoebe</title>`
(Responder likewise); `<link rel="stylesheet" href="../assets/style.css?v=1">`. Nothing else external.

First `details.card` in Part 0 is `open`; no other. Sentence case headings. Warm practitioner voice,
concrete, never dry. Inside prompt-boxes escape `&` `<` `>`. 450 to 650 lines is guidance about
depth, never a target: never collapse whitespace, dissolve a list into a paragraph, or drop a
component to fit.

## Hard rules (a violation is rework)

- NEVER an em dash or en dash, anywhere (prose, code, aria-labels, comments). Hyphen only.
- No meta text: never "this course", "in this course", "the course teaches", "banned here". State
  the professional norm directly with its reason. The two exact estate phrases above are the only
  self-references; "session 5" or "leader session 3" cross-references are fine.
- Attribution "by Phoebe Fu". Never "built with" a tool.
- **Numbers**: use ONLY numbers in the source map's bench canon and verified-facts sections (bench
  numbers, deadlines, quotes) plus structural facts about Quarrybank stated there (18,400 rows, 40
  recipients, about 40 dashboards, event times). Do NOT invent margin percentages, costs, row counts,
  durations or survey statistics. A bench number must be quoted exactly as the bench prints it (times
  as 0h15, 6h50, 120h00; counts as integers; rows as 8,400). If you want a number the map lacks,
  write the sentence without it.
- Bench times in the table are measured FROM THE FIRST SIGNAL; deadline due and done times in the
  bench's "what it reached" panel are measured FROM THE BAD WRITE. Say which whenever you quote one.
- Contested evidence: teach the disagreement, never resolve it (materiality, restate vs footnote,
  how often to declare).
- Citations in the map's appendix form; PDPA 3-day rule and ISO/IEC 27035 are "reported". Never quote
  Atlassian (not read) and never attribute a seniority rule to the SRE workbook (it has none; the
  PagerDuty IC training page is the source for "regardless of their day-to-day rank").
- NEVER "lottery"/"lotteries"; never any betting or gambling word.
- Default to the English word. A Chinese term carries its English in brackets (none are needed here).
- Titles, widget ids and class names must not collide with siblings. Do not reuse any heading from
  learn-data-observability, learn-data-reliability, learn-cyber-security, learn-gdpr, learn-pdpa-dnc;
  never "The first hour", "Postmortems that...", "Runbooks a...", "The incident package",
  "Breach response", "Assess, then notify", "Contain, notify...", "Lineage and blast radius",
  "Destructive events", "Detect what you cannot prevent".
- The law is NOT taught here. GDPR 72 hours and PDPA 3 calendar days appear only as fixed inputs owned
  by the privacy partner, linked to the sibling pages in the cross-links. SEC 8-K applies to US
  registrants and cybersecurity incidents; Quarrybank is not a registrant.
- Write-ups (postmortems) belong to the planned runbooks-and-postmortems course: link the hub, never a
  repo URL for it. Lineage queries belong to observability; backfill mechanics to reliability b5.
- Never Phoebe's employers, clients or projects; Quarrybank is the only company. Never Harborlight,
  Halyard or any other estate case name.

## Figure grammar (hand-drawn, every figure)

Palette, ONLY these hexes (no invented greys): `#075A2C` (green, primary) `#053D1E` (deep green)
`#1C7240` (mid green) `#BFE3CC` (soft) `#ECF7F0` (green tint) `#0D1F14` (ink) `#4A5F52` (muted)
`#C3D3C8` (faint) `#E3EDE6` (hairline) `#F2A900` (hazard amber, a FILL only, never text) `#6B4700`
(amber ink, for amber-coloured TEXT) `#FFF6DC` (amber tint) `#FAFCFA` (paper) · `#FFFFFF` · universal
reds `#991B1B` `#FEF2F2` `#FCA5A5` only for a wrong-way panel or a decision made on bad data.
White text only on #075A2C, #053D1E, #1C7240 or #991B1B. Ink text on amber.

- `<figure class="zoomable">` > `<svg viewBox="0 0 880 H" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="the data, not the
  shape">` > `<defs>` + `<style>` + content, then `<figcaption>🔍 Click to zoom - takeaway</figcaption>`.
  Grow H, never W.
- Prefix unique per figure, used for every class and id: `i` + page id + figure letter, e.g. `ia2a`,
  `ia2b`, `ib5c` (filter `ia2aSk`, hatch `ia2aHc`, arrow `ia2aAr`, classes `.ia2aH` ...).
- `<defs>` holds three things with the figure prefix P: a wobble filter `id="PSk"`
  (`feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="<int>"` +
  `feDisplacementMap scale="2.4" xChannelSelector="R" yChannelSelector="G"`, `x="-3%" y="-3%"
  width="106%" height="106%"`), a hachure pattern `id="PHc"` (7x7 userSpaceOnUse, rotate(-38), one
  line, opacity .5-.7; amber #F2A900 for "bad data / spreading", green for "the record"), an open
  arrowhead `id="PAr"` (path `M1 1 L9 5 L1 9`, fill none, ink stroke 1.6). ALL shapes sit inside ONE
  `<g filter="url(#PSk)" fill="none" stroke="#0D1F14" stroke-width="2" stroke-linecap="round"
  stroke-linejoin="round">`; rects carry a tiny rotation (-4 to 4 degrees for hand-placed items, under
  1 for panels). Fills: white, #ECF7F0, the hachure for "the bad data", and amber ONLY for the one
  thing the figure is about. Text classes: `.PH` 800 12px ink heading · `.PL` 600 12px ink label ·
  `.PS` 400 11px muted · `.PB` 800 11px #6B4700 · `.PV` 800 16-20px #053D1E value · `.PW` 800 12px
  white on a fill · `.PA` 700 11px #053D1E caption · `.PN` 400 12px muted note. Hand-stacked items must
  not overlap as painted rects.
- ALL `<text>` OUTSIDE the filtered group, sans stack, never below 10.5px. No text may sit on a line
  or path: the gate flags any path crossing a label (a deliberate strike-through needs `data-strike="1"`).
- Fit: max chars ≈ (box width - 20) / 7 at 12px, 6.4px/char at 11px; full-width note under 110 chars;
  40px between neighbouring point labels; bottom note 22px below the last row, H clears it by 8px.
  When in doubt, shorten.
- Floor: one figure per Part plus one in the build-along (4 figures). Draw the MECHANISM: where the
  bad rows travel, which consumer read them before the fix, which door the leaked table is still open
  through, who is told and who is not. Never a metaphor literally, never decoration.

## Voice and honesty

Every Part gets a real-world story; Quarrybank stories begin "Constructed Quarrybank example." and,
when they quote a bench number, say "measured on the bench". Practitioner advice without a source is
stated as practice, not as a finding. The bench models plan TIMES by stated rules (map, "Rules"); say
so if you explain why a number moved.

## Cross-links (absolute URLs, open with ↗)

- Observability lineage: https://phoebefu6.github.io/learn-data-observability-with-phoebe/courses/b7-lineage-blast-radius.html
- Reliability rota: https://phoebefu6.github.io/learn-data-reliability-with-phoebe/courses/a3-on-call-is-a-design.html
- Reliability backfills: https://phoebefu6.github.io/learn-data-reliability-with-phoebe/courses/b5-backfills.html
- Reliability incident package: https://phoebefu6.github.io/learn-data-reliability-with-phoebe/courses/b6-incident-package.html
- Cyber exfiltration detection: https://phoebefu6.github.io/learn-cyber-security-with-phoebe/courses/b5-exfiltration-detection.html
- Cyber destructive events and restore: https://phoebefu6.github.io/learn-cyber-security-with-phoebe/courses/b6-destructive-events.html
- GDPR breach response: https://phoebefu6.github.io/learn-gdpr-with-phoebe/courses/b7-breach-response.html
- PDPA breach response: https://phoebefu6.github.io/learn-pdpa-dnc-with-phoebe/courses/b7-breach-response.html
- Data governance protection and breach: https://phoebefu6.github.io/learn-data-governance-with-phoebe/courses/05-protection-and-breach.html
- Agent kill switch and audit record: https://phoebefu6.github.io/learn-agent-secrets-access-with-phoebe/courses/06-prove-what-it-did.html
- Access control secrets and rotation: https://phoebefu6.github.io/learn-data-access-control-with-phoebe/courses/b6-secrets-and-keys.html
- Hub (and the planned runbooks and postmortems course): https://phoebefu6.github.io/learn-with-phoebe/

## Footer chains and session titles

Footer left: "Leader session N of 6 · learn-data-incident-response-with-phoebe · by Phoebe Fu &nbsp;·&nbsp; 📚 <a href="https://phoebefu6.github.io/learn-with-phoebe/">Learn with Phoebe ↗</a>" (Responder likewise).
Footer right: `<a href="PREV">← Prev: Title</a> &nbsp;·&nbsp; <a href="NEXT">Next: Title →</a>`; leader 6 ends
with "Course home" instead of Next (`../index.html`).

Leader (a1-a6): a1-is-this-an-incident.html "Is this an incident yet?" · a2-severity-you-can-defend.html
"Severity you can defend" · a3-who-runs-the-room.html "Who runs the room" ·
a4-telling-people-before-they-ask.html "Telling people before they ask" ·
a5-when-the-board-used-the-number.html "When the board already used the number" ·
a6-ready-before-the-next-one.html "Ready before the next one".

Responder (b1-b8): b1-timeline-starts-at-first-signal.html "The timeline starts at the first signal" ·
b2-what-read-the-bad-data.html "What read the bad data" · b3-stop-a-bad-load-spreading.html
"Stop a bad load spreading" · b4-close-a-leaked-tables-doors.html "Close a leaked table's doors" ·
b5-correct-then-prove-it-landed.html "Correct, then prove it landed" · b6-tell-every-consumer.html
"Tell every consumer who read it" · b7-close-with-evidence.html "Close with evidence" ·
b8-the-incident-clock.html "The incident clock".

Plan pages (the running artifact, Quarrybank's incident response plan): leader 1 declare rule, 2
severity matrix, 3 roles card, 4 comms templates, 5 restatement rule, 6 readiness plan; responder 1
timeline template, 2 consumer trace, 3 bad-load playbook, 4 exposure playbook, 5 correction check, 6
consumer notice, 7 close-out record. Each build-along ends with a `.prompt-box.good` whose label reads
"★ Step N · plan, leader page K, <name>" or "★ Step N · plan, responder page K, <name>" and whose body
starts "QUARRYBANK INCIDENT RESPONSE PLAN · leader page K · <name>" (responder likewise).

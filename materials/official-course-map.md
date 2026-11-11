# Official course map - learn-data-incident-response-with-phoebe

"Incident Response for Data Teams". Two tracks: Leader (a1-a6) and Responder (b1-b8), 45 minutes each,
bench capstone in b8. Built 2026-11-10 by the course lead. Internal build document: never linked from
an audience page.

Question across the course: when the data is wrong or out, how many people and decisions does it reach
before you stop it, and could you show the board exactly what happened and when?

## Evidence tiers

- **Read at source** = fetched and read on 2026-11-10 by the lead (quote only these verbatim).
- **Reported** = from a secondary source, a sibling course map, or a retail listing; say "reported".
- **Constructed** = Quarrybank and everything in its logs. Label "Constructed Quarrybank example".

## Verified facts (read at source, 2026-11-10)

### NIST SP 800-61 Rev. 3 (April 2025) - read at source (PDF, nvlpubs.nist.gov)
- Title: "Incident Response Recommendations and Considerations for Cybersecurity Risk Management: A CSF
  2.0 Community Profile". Published April 2025; supersedes SP 800-61 Rev. 2 (2012).
- The old four-phase life cycle (Preparation; Detection and Analysis; Containment, Eradication and
  Recovery; Post-Incident Activity) is replaced by a model built on the six CSF 2.0 Functions:
  Govern, Identify, Protect (preparation, not part of the response itself) and Detect, Respond, Recover
  (the response), with Improvement (ID.IM) feeding lessons back at all times.
- Why it changed: "Today, incidents occur frequently and cause far more damage." Lessons learned
  "should often be shared as soon as they are identified, not delayed until after recovery concludes."
- Definition of incident (from FISMA 2014): "an occurrence that actually or imminently jeopardizes,
  without lawful authority, the integrity, confidentiality, or availability of information or an
  information system; or constitutes a violation or imminent threat of violation of law, security
  policies, security procedures, or acceptable use policies."
- DE.AE-08: "Incidents are declared when adverse events meet the defined incident criteria."
- RS.MA-01 C1: "Consider designating an incident lead for each incident."
- RS.MA N1: evaluating risk and prioritising "are perhaps the most critical decision points"; R1
  "incidents should not be handled on a first-come, first-served basis"; N2 risk factors include
  "asset criticality, functional impact of the incident, data impact of the incident ... and
  recoverability".
- RS.AN-06: actions are recorded and "the records' integrity and provenance are preserved".
- RS.AN-07: collected incident data "is still considered evidence" even without formal chain of custody.
- RS.AN-08: "Determining the incident's magnitude is often one of the most challenging aspects".
- RS.CO-02 R2: procedures "include what must be reported to whom and at what times (e.g., initial
  notification, regular status updates)".
- RS.MI-01: "Containment refers to preventing the expansion of an incident."
- RC.RP-05 R2: "Verify the correctness and adequacy of the restoration actions taken before putting a
  restored system online."
- RC.RP-06: "The end of incident recovery is declared based on criteria, and incident-related
  documentation is completed"; R1 an after-action report documenting the incident, actions and lessons.
- NIST is cybersecurity-scoped: "This guide addresses only adverse cybersecurity events." Data quality
  and decision incidents are this course's extension, said out loud (a1).

### Google SRE book, "Managing Incidents" - read at source (sre.google/sre-book/managing-incidents/)
- Roles: Incident Command ("holds the high-level state about the incident"), Operational Work ("the
  only group modifying the system during an incident"), Communication ("the public face of the
  incident response task force"), Planning ("supports Ops by dealing with longer-term issues").
- Declare if any is true: "Do you need to involve a second team in fixing the problem?", "Is the outage
  visible to customers?", "Is the issue unsolved even after an hour's concentrated analysis?"
- "It is better to declare an incident early and then find a simple fix and close out the incident."
- "The incident commander's most important responsibility is to keep a living incident document."
- Handoff: the outgoing commander stays until the incoming one acknowledges ("You're now the incident
  commander, okay?").

### Google SRE workbook, "Incident Response" - read at source (sre.google/workbook/incident-response/)
- The 3Cs: coordinate, communicate, control. "Declare incidents early and often."
- "By default, the IC assumes all roles that have not been delegated yet."
- A case study rotated "on-call engineers and the IC every four hours". The workbook does NOT state a
  rule about seniority; do not attribute one to it.

### PagerDuty Incident Response documentation - read at source (response.pagerduty.com)
- Severity SEV-1 "Critical issue that warrants public notification and liaison with executive teams";
  SEV-2 "Critical system issue actively impacting many customers' ability to use the product"; SEV-3
  "Stability or minor customer-impacting issues that require immediate attention from service owners";
  SEV-4 "Minor issues requiring action, but not affecting customer ability to use the product"; SEV-5
  "Cosmetic issues or bugs". If unsure, treat it as the higher one; "During an incident is not the time
  to discuss or litigate severities".
- Roles: Incident Commander, Deputy, Scribe ("documents the timeline of an incident as it
  progresses"), Subject Matter Expert, Customer Liaison, Internal Liaison. "Delegate all repair actions,
  the Incident Commander is NOT a resolver."
- IC training: "They become the highest ranking individual on any major incident call, regardless of
  their day-to-day rank."; may remove anyone from the call "(even if it's the CEO)"; "the arrival of a
  more qualified person does NOT necessarily mean a change in incident command"; "Making the "wrong"
  decision is better than making no decision."

### SEC Form 8-K Item 1.05 - read at source (SEC press release 2023-139)
- Due "four business days after a registrant determines that a cybersecurity incident is material";
  describes the "material aspects of the incident's nature, scope, and timing" and its material impact;
  delay possible if the US Attorney General finds disclosure "would pose a substantial risk to national
  security or public safety". Board angle only (a4, a5); applies to US registrants and cybersecurity
  incidents, not to a margin error; Quarrybank is not a registrant.

### IAS 8 - read at source (ifrs.org standard page)
- "an entity corrects material prior period errors retrospectively by restating the comparative
  amounts", "Unless it is impracticable to determine the effects of the error".
- Retitled in April 2024 (with IFRS 18) to "Basis of Preparation of Financial Statements". The
  materiality definition was clarified in 2018; its text was not read, so materiality is taught as a
  judgement and a disagreement (a5), never as a threshold.

### GDPR Art. 33 - read at source (gdpr-info.eu) - LINKED INPUT ONLY
- "without undue delay and, where feasible, not later than 72 hours after having become aware of it";
  Art. 33(5) the controller documents every breach. Owned by learn-gdpr b7. EDPB Guidelines 9/2022
  (version 2.0, dated 04 April 2023 on the EDPB page) read at the listing page only.

### PDPA (Singapore) - REPORTED, linked input only
- Assess within 30 calendar days; notify the PDPC no later than 3 calendar days after determining the
  breach is notifiable. Source: learn-pdpa-dnc's course map (read there); the PDPC guide page (published
  13 Sep 2021) and the statute page returned 404/403 to the lead. Owned by learn-pdpa-dnc b7.

### FIRST CSIRT Services Framework v2.1 - read at source (first.org)
- Service areas include Information Security Event Management, Information Security Incident
  Management, Vulnerability Management (Situational Awareness and Knowledge Transfer named). Incident
  management services: report acceptance, incidents analysis, artefact and forensic evidence analysis,
  mitigation and recovery, incident coordination, crisis management support. Self-study only.

### ISO/IEC 27035-1:2023 - REPORTED (iso.org returned 403; retail listings only)
- Edition 2, 2023. Process phases reported as plan and prepare, detect and report, assess and decide,
  respond, learn lessons. Paywalled; never quoted.

### Monte Carlo, "The rise of data downtime" (Barr Moses) - read at source (montecarlo.ai)
- "Data downtime refers to periods of time when your data is partial, erroneous, missing or otherwise
  inaccurate." Formula given as "Number of incidents x (average time to detection + average time to
  resolution)". Vendor framing, taught as a claim with its basis; detection belongs to observability.

### Atlassian incident handbook - NOT READ (page body did not load for the fetcher)
- Not quoted anywhere. Named only as Self-study further reading.

### ICO data security incident trends - NOT AVAILABLE
- Page and the Q1 2019 to Q4 2025 workbook both returned 403 to automated fetch. No public base rate is
  used anywhere; the bench is entirely constructed and says so on the widget.

## Running case (constructed)

Quarrybank, a constructed mid-size building-supplies distributor: cloud warehouse, about 40 dashboards,
a weekly partner extract and a monthly board pack. Three incidents in one quarter (dates UTC):
1. **Bad load** (quality), 2026-02-10 02:00: a supplier feed lands a duplicated partition; revenue
   doubles for two regions. Signal 0h40 (volume monitor), first complaint 7h10.
2. **Leaked table** (exposure, personal data), 2026-02-24 09:00: customer table, 18,400 rows, contact
   and credit-limit columns, shared to an outside vendor through a public link and a vendor workspace
   share. Signal 3h20 (access-log alert on an unknown address), first complaint 48h20.
3. **Wrong number on the board deck** (decision), 2026-03-03 08:00: the margin figure in the board pack
   used the bad load and informed a pricing decision. Signal 48h00 (finance reconciliation), first
   complaint 168h00 (external auditor).

## The bench: the incident clock (canon, measured 2026-11-10)

Engine `assets/ird-live.js`, data `assets/ird-sample.js` (built by `materials/build-ird-sample.py`,
seed 20261110, 222 events), Python reference `materials/ird_reference.py`. Node vs Python compared by
value with `materials/compare-ladder.py`: **1151 values, 0 differences, planted one-point fault caught**.

Rules (minutes after the bad write; S signal, C complaint): declare S+5 rehearsed / S+15 with a rule /
C without; assess declare+10 / +20 with roles / +240; contain assess+10 / +15 with playbook / +120;
correct contain+180 rehearsed / +360, +240 if the table was dropped; notice to every reached consumer at
contain+15/+30 with lineage, else only to the complainers at declare+60; formal notice assess+720 /
assess+1440 with roles / declare+7200. Times on the bench are measured from the first signal.

| Rung | Plan | Consumers + decisions on bad data | Never told | Copies still wrong | People who read bad data | Deadlines met |
|---|---|---|---|---|---|---|
| r0 | No plan | 14 + 7 | 11 | 7 | 69 | 0 of 4 |
| r1 | Declare rule | 10 + 4 | 7 | 5 | 62 | 0 of 4 |
| r2 | Severity and roles | 7 + 3 | 4 | 4 | 17 | 3 of 4 |
| r3 | Containment playbook | 7 + 3 | 4 | 4 | 17 | 3 of 4 |
| r4 | Lineage-driven consumer notice | 5 + 1 | 0 | 0 | 13 | 4 of 4 |
| r5 | Rehearsed plan | 5 + 1 | 0 | 0 | 13 | 4 of 4 |
| t1 | Fix before you contain (trap) | 7 + 1 | 0 | 0 | 37 | 4 of 4 |
| t2 | Drop the bad table (trap) | 5 + 1 | 0 | 0 | 13 | 4 of 4 |
| t3 | Tell only who complained (trap) | 7 + 3 | 4 | 4 | 17 | 3 of 4 |

Readiness times (declare / contain / correct, from the first signal):
- r0: bad load 6h30 / 12h30 / 18h30; leak 45h00 / 51h00 / 57h00; board 120h00 / 126h00 / 132h00.
- r1: 0h15 / 6h15 / 12h15 on all three. r2: 0h15 / 2h35 / 8h35. r3 and r4: 0h15 / 0h50 / 6h50.
- r5: 0h05 / 0h25 / 3h25. t1: contain 6h50 (= correct). t2: correct 10h50.

Per incident:
- **Bad load**: r0 and r1 reach 5 consumers (executive dashboard, sales email, partner extract,
  forecast model, finance mart) and 3 decisions (replenishment order, promotion budget cut, partner's
  rebate), never telling any of the 5; r0 60 bad reads by 52 people; partner contract notice MISSED.
  r2, r3 and t3: 2 consumers (partner extract, forecast model) and 2 decisions, both never told, notice
  missed. r4 and r5: 0 consumers, 0 decisions, partner told (2h00 and 1h20 after the bad write, due
  24h40). t1: 2 consumers (sales email, forecast model), 24 people.
- **Leaked table** (18,400 rows): r0 4 parties reached (vendor analysts A and B, the person the link
  was forwarded to, the unknown address), 2 never told, rows exposed 18,400; GDPR 72h and PDPA 3-day
  both missed. r1 2 parties, rows 18,400, both deadlines missed (formal notice 7415 min after the bad
  write; GDPR due 4520, PDPA due 5220). r2 12,800 rows; r3 and r4 8,400; r5 7,600; t1 18,400; t2
  18,400 assumed (evidence lost). From r2 both deadlines met. The unknown address can never be told.
- **Board deck**: r0 5 consumers (portal, emailed pack, pricing deck, investor update, lender
  certificate) and 4 decisions (hold prices, investor update, covenant certificate, bonus accrual), 4
  never told, 35 bad reads by 17 people, chair notice missed. r1 to r5: 3 consumers (portal, emailed
  pack, pricing deck) and 1 decision ("Hold prices in two regions", made at 24h00, before the 48h00
  signal: irreducible by any response plan). r2 onward chair notice met.
- **The floor**: 5 consumers + 1 decision survive the best plan: the vendor's early download and the
  unknown address (leak) and the board pack read before anyone could know. What happens before the first
  signal is detection, which the observability course owns.
- **Trap switches on R5** (checked in the reference): fix-first leaked rows 7,600 -> 14,800; drop-table 18,400
  assumed and correct 3h25 -> 7h25; headline stays 5 + 1.
- **Learner moves** (also in the comparison): m1 fast hand-typed times on the no-plan baseline give
  7 + 3, 4 never told, 0 of 4 deadlines; speed without roles and lineage meets no deadline.

## Per-session coverage

Leader track (a1-a6), crumb "Leader session N of 6":
- a1 Is this an incident yet? NIST definition + DE.AE-08 (declare on criteria), SRE book's three declare
  questions and "declare early", three data incident types (quality, exposure, decision) as this
  course's extension of a cybersecurity definition; bench r0 vs r1. Artifact: declare rule.
- a2 Severity you can defend. PagerDuty SEV-1..5, "if unsure, the higher one", "not the time to
  litigate"; NIST RS.MA risk factors; reach x sensitivity x reversibility matrix (constructed); bench
  per-incident reach. Artifact: severity matrix.
- a3 Who runs the room. SRE book four roles, PagerDuty IC/Deputy/Scribe/liaisons, "IC is NOT a
  resolver", "highest ranking ... regardless of their day-to-day rank", handoff; bench r1 -> r2
  (deadlines 0 of 4 -> 3 of 4). Links reliability a3 for the rota. Artifact: roles card.
- a4 Telling people before they ask. NIST RS.CO-02 (who, what, when), cadence by severity, holding
  statement, executive update, partner note; GDPR 72h and PDPA 3 days as fixed inputs linked out; SEC
  8-K as the board-level analogue for US registrants only. Artifact: comms templates.
- a5 When the board already used the number. Decision incidents; IAS 8 restatement; materiality as the
  disagreement it is (restate vs footnote vs next-period correction); bench board incident: the decision
  at 24h00 precedes the 48h00 signal. Artifact: restatement rule.
- a6 Ready before the next one. Tabletop, three readiness numbers (time to declare, contain, correct)
  from the bench (r5 0h05 / 0h25 / 3h25), NIST ID.IM continuous improvement; write-up handed to the
  docs course. Artifact: readiness plan.

Responder track (b1-b8), crumb "Responder session N of 8":
- b1 The timeline starts at the first signal. Living incident document, scribe, UTC, NIST RS.AN-06/07
  evidence, do not drop the bad table (trap t2 preview). Artifact: timeline template.
- b2 What read the bad data. Consumer trace from lineage; bench reached lists; exposure grows hourly.
  Links observability b7 for lineage queries. Artifact: consumer trace.
- b3 Stop a bad load spreading. Pause, quarantine, circuit breaker, NIST RS.MI-01; bench r2 -> r3 and
  trap t1 (fix before contain: 37 people vs 13). Artifact: bad-load playbook.
- b4 Close a leaked table's doors. Revoke every door, rotate, snapshot first, what was already copied;
  bench rows 12,800 -> 8,400, t2 18,400 assumed. Links cyber b5/b6, access-control b6, secrets 06.
  Artifact: exposure playbook.
- b5 Correct, then prove it landed. Fix forward vs roll back, NIST RC.RP-05 verify restoration, the
  check that every consumer reads corrected rows; copies do not refresh. Links reliability b5.
  Artifact: correction check.
- b6 Tell every consumer who read it. Lineage notice vs complainers only (r4 vs t3: never told 0 vs 4,
  partner deadline met vs missed). Deadlines as inputs from the privacy partner. Artifact: consumer notice.
- b7 Close with evidence. RC.RP-06 exit criteria + after-action report inputs, follow-ups with owners;
  hand-off to the docs course and reliability b6. Artifact: close-out record.
- b8 The incident clock. Full ladder, traps, learner moves. Capstone: whole plan scored.

## Seams (pick the side out loud, link with absolute https)

- learn-data-observability b1-b7: detecting the problem. b2 links
  https://phoebefu6.github.io/learn-data-observability-with-phoebe/courses/b7-lineage-blast-radius.html
- learn-data-reliability a3 (rota) https://phoebefu6.github.io/learn-data-reliability-with-phoebe/courses/a3-on-call-is-a-design.html ;
  a4 postmortems, b4 runbooks, b6 incident package https://phoebefu6.github.io/learn-data-reliability-with-phoebe/courses/b6-incident-package.html ;
  b5 backfills https://phoebefu6.github.io/learn-data-reliability-with-phoebe/courses/b5-backfills.html
- planned learn-runbooks-postmortems (docs): owns the write-up. Not yet live: link the hub
  https://phoebefu6.github.io/learn-with-phoebe/ and name it, never a dead repo URL.
- learn-cyber-security a6 first hour, b5 https://phoebefu6.github.io/learn-cyber-security-with-phoebe/courses/b5-exfiltration-detection.html ,
  b6 https://phoebefu6.github.io/learn-cyber-security-with-phoebe/courses/b6-destructive-events.html
- learn-gdpr b7 https://phoebefu6.github.io/learn-gdpr-with-phoebe/courses/b7-breach-response.html ;
  learn-pdpa-dnc b7 https://phoebefu6.github.io/learn-pdpa-dnc-with-phoebe/courses/b7-breach-response.html ;
  learn-data-governance 05 https://phoebefu6.github.io/learn-data-governance-with-phoebe/courses/05-protection-and-breach.html
- learn-agent-secrets-access 06 https://phoebefu6.github.io/learn-agent-secrets-access-with-phoebe/courses/06-prove-what-it-did.html
- learn-data-access-control b6 https://phoebefu6.github.io/learn-data-access-control-with-phoebe/courses/b6-secrets-and-keys.html
- learn-privacy-engineering: anonymisation and release risk, not covered here.

## Not covered (honest list)

- Detection, monitors and lineage query mechanics (observability). Postmortem writing craft (docs
  course). Backfill mechanics (reliability b5). The breach-notice law itself (GDPR, PDPA, governance).
- Forensics, malware, attacker eradication and restore from destructive events (cyber security).
- Vendor incident tools (PagerDuty, incident.io, Opsgenie, status pages, warehouse time travel):
  Self-study only, taught as claims with their basis.
- Public base rates: the ICO trends workbook could not be fetched; no real-world incident frequency is
  claimed. ISO/IEC 27035 text (paywalled). Atlassian handbook text (not read).
- Accounting materiality thresholds: not given; materiality is taught as a contested judgement.

## Citation appendix

1. NIST SP 800-61 Rev. 3, April 2025. https://csrc.nist.gov/pubs/sp/800/61/r3/final
2. Google, Site Reliability Engineering, ch. "Managing Incidents". https://sre.google/sre-book/managing-incidents/
3. Google, The Site Reliability Workbook, ch. "Incident Response". https://sre.google/workbook/incident-response/
4. PagerDuty Incident Response documentation: severity levels, roles, IC training. https://response.pagerduty.com/
5. SEC press release 2023-139 (Form 8-K Item 1.05). https://www.sec.gov/newsroom/press-releases/2023-139
6. IFRS Foundation, IAS 8. https://www.ifrs.org/issued-standards/list-of-standards/ias-8-accounting-policies-changes-in-accounting-estimates-and-errors/
7. GDPR Art. 33. https://gdpr-info.eu/art-33-gdpr/ ; EDPB Guidelines 9/2022 v2.0. https://www.edpb.europa.eu/our-work-tools/our-documents/guidelines/guidelines-92022-personal-data-breach-notification-under_en
8. PDPC, Guide on Managing and Notifying Data Breaches Under the PDPA (reported). https://www.pdpc.gov.sg/
9. FIRST CSIRT Services Framework v2.1. https://www.first.org/standards/frameworks/csirts/csirt_services_framework_v2.1
10. ISO/IEC 27035-1:2023 (reported). https://www.iso.org/standard/78973.html
11. Barr Moses, "The rise of data downtime", Monte Carlo. https://montecarlo.ai/blog-the-rise-of-data-downtime

#!/usr/bin/env python3
"""Build assets/ird-sample.js: Quarrybank's three incidents as timestamped event logs.

Constructed Quarrybank example. Every node, reader, row range and time below is constructed for
teaching; no public incident dataset is used (the ICO incident-trends workbook refused automated
download on 2026-11-10, so no real base rate is claimed anywhere).

Times are integer MINUTES after the incident's bad write (t = 0). abs0 is the bad write as integer
minutes since 1970-01-01 UTC, so calendar-day deadlines can be computed without parsing dates.
Seeded (random.Random(20261110)); serialised with json.dumps, never string interpolation.

Usage: python3 materials/build-ird-sample.py <repo>
"""
import json, random, sys
from datetime import datetime, timezone
from pathlib import Path

R = random.Random(20261110)


def absmin(s):
    d = datetime.strptime(s, "%Y-%m-%d %H:%M").replace(tzinfo=timezone.utc)
    return int(d.timestamp() // 60)


def reads(node, readers, n, lo, hi):
    out = []
    for i in range(n):
        out.append({"t": R.randint(lo, hi), "k": "read", "n": node, "r": readers[i % len(readers)]})
    return out


events_load = []
events_load += [{"t": t, "k": "mat", "n": "rev"} for t in range(15, 1441, 60)]
events_load += [{"t": 240, "k": "mat", "n": "exec"}, {"t": 1680, "k": "mat", "n": "exec"}]
events_load += [{"t": 300, "k": "mat", "n": "email"}]
events_load += [{"t": 30, "k": "mat", "n": "partner"}]
events_load += [{"t": 35, "k": "mat", "n": "model"}]
events_load += [{"t": 20, "k": "mat", "n": "mart"}, {"t": 1500, "k": "mat", "n": "mart"}]
events_load += reads("rev", ["regional manager %d" % i for i in range(1, 13)], 30, 400, 1300)
events_load += reads("exec", ["executive %d" % i for i in range(1, 6)], 8, 300, 900)
events_load += reads("email", ["sales email recipient %d" % i for i in range(1, 41)], 40, 300, 720)
events_load += reads("partner", ["partner analyst %d" % i for i in range(1, 4)], 6, 400, 2800)
events_load += [{"t": 360, "k": "read", "n": "model", "r": "forecast scoring job"},
                {"t": 1800, "k": "read", "n": "model", "r": "forecast scoring job"}]
events_load += reads("mart", ["finance analyst %d" % i for i in range(1, 5)], 6, 500, 1400)
events_load += [{"t": 480, "k": "decision", "n": "model", "d": "Replenishment order for two regions"},
                {"t": 660, "k": "decision", "n": "exec", "d": "Promotion budget cut in the other regions"},
                {"t": 2400, "k": "decision", "n": "partner", "d": "Partner's volume rebate calculation"}]

load = {
    "id": "load", "name": "Bad load", "type": "quality",
    "summary": "A supplier feed lands a duplicated partition; revenue doubles for two regions in the overnight load.",
    "abs0": absmin("2026-02-10 02:00"), "signal": 40, "complaint": 430,
    "signalText": "volume monitor: row count doubled for two regions",
    "complaintText": "a regional sales head asks why revenue doubled",
    "nodes": [
        {"id": "rev", "name": "Regional revenue dashboard", "type": "dashboard", "refresh": True, "outside": False, "known": True, "notifiable": True},
        {"id": "exec", "name": "Executive KPI dashboard", "type": "dashboard", "refresh": True, "outside": False, "known": False, "notifiable": True},
        {"id": "email", "name": "Daily sales email (40 recipients)", "type": "scheduled email", "refresh": False, "outside": False, "known": False, "notifiable": True},
        {"id": "partner", "name": "Weekly partner extract", "type": "extract", "refresh": False, "outside": True, "known": False, "notifiable": True},
        {"id": "model", "name": "Demand forecast model", "type": "model", "refresh": False, "outside": False, "known": False, "notifiable": True},
        {"id": "mart", "name": "Finance month-end mart", "type": "table", "refresh": True, "outside": False, "known": False, "notifiable": True},
    ],
    "doors": [], "rows": 0,
    "deadlines": [
        {"id": "partner24", "label": "Partner contract: tell the partner within 24 hours of becoming aware of an error in a delivered extract",
         "kind": "node", "node": "partner", "hours": 24, "owner": "constructed contract term"},
    ],
    "events": sorted(events_load, key=lambda e: (e["t"], e["k"], e["n"])),
}

events_leak = [{"t": 30, "k": "access", "door": "vshare", "p": "vendorA", "lo": 0, "hi": 6000}]
for k in range(46):
    events_leak.append({"t": 190 + 10 * k, "k": "access", "door": "public", "p": "unknown", "lo": 18400 - 400 * (k + 1), "hi": 18400 - 400 * k})
events_leak += [{"t": 1300, "k": "access", "door": "public", "p": "forwardee", "lo": 0, "hi": 2000},
                {"t": 1600, "k": "access", "door": "vshare", "p": "vendorB", "lo": 6000, "hi": 9000},
                {"t": 3000, "k": "access", "door": "vshare", "p": "vendorB", "lo": 9000, "hi": 12000},
                {"t": 4500, "k": "access", "door": "vshare", "p": "vendorB", "lo": 12000, "hi": 15000},
                {"t": 7000, "k": "access", "door": "vshare", "p": "vendorB", "lo": 15000, "hi": 18400}]

leak = {
    "id": "leak", "name": "Leaked table", "type": "exposure",
    "summary": "A customer table with contact and credit-limit columns is shared to an outside analytics vendor through a public link.",
    "abs0": absmin("2026-02-24 09:00"), "signal": 200, "complaint": 2900,
    "signalText": "access log alert: an unknown address paging through the public link",
    "complaintText": "a customer complains that a cold call quoted their credit limit",
    "nodes": [
        {"id": "vendorA", "name": "Vendor analyst A (downloaded a copy)", "type": "outside party", "refresh": False, "outside": True, "known": True, "notifiable": True},
        {"id": "vendorB", "name": "Vendor analyst B", "type": "outside party", "refresh": False, "outside": True, "known": False, "notifiable": True},
        {"id": "forwardee", "name": "Person the link was forwarded to", "type": "outside party", "refresh": False, "outside": True, "known": False, "notifiable": True},
        {"id": "unknown", "name": "Unknown address", "type": "outside party", "refresh": False, "outside": True, "known": False, "notifiable": False},
    ],
    "doors": [
        {"id": "public", "name": "Public link", "basic": True},
        {"id": "vshare", "name": "Vendor workspace share", "basic": False},
    ],
    "rows": 18400,
    "deadlines": [
        {"id": "gdpr72", "label": "GDPR Art. 33: notify the supervisory authority within 72 hours of becoming aware",
         "kind": "hours", "hours": 72, "owner": "https://phoebefu6.github.io/learn-gdpr-with-phoebe/courses/b7-breach-response.html"},
        {"id": "pdpa3", "label": "PDPA: notify the PDPC no later than 3 calendar days after assessing the breach as notifiable",
         "kind": "calendarDays", "days": 3, "owner": "https://phoebefu6.github.io/learn-pdpa-dnc-with-phoebe/courses/b7-breach-response.html"},
    ],
    "events": sorted(events_leak, key=lambda e: (e["t"], e["p"])),
}

events_board = [{"t": 0, "k": "mat", "n": "portal"}, {"t": 0, "k": "mat", "n": "emailed"},
                {"t": 1200, "k": "mat", "n": "pricing"}, {"t": 4000, "k": "mat", "n": "investor"},
                {"t": 6000, "k": "mat", "n": "lender"}]
events_board += reads("portal", ["director %d" % i for i in range(1, 10)], 18, 60, 5000)
events_board += reads("emailed", ["director %d" % i for i in range(1, 10)], 9, 30, 600)
events_board += reads("pricing", ["pricing committee member %d" % i for i in range(1, 5)], 4, 1250, 1430)
events_board += reads("investor", ["investor %d" % i for i in range(1, 4)], 3, 4320, 4800)
events_board += [{"t": 6100, "k": "read", "n": "lender", "r": "lender credit officer"}]
events_board += [{"t": 1440, "k": "decision", "n": "pricing", "d": "Hold prices in two regions"},
                 {"t": 4320, "k": "decision", "n": "investor", "d": "Investor update sent with the margin line"},
                 {"t": 6000, "k": "decision", "n": "lender", "d": "Covenant certificate signed on the margin"},
                 {"t": 8000, "k": "decision", "n": "portal", "d": "Bonus accrual set from the pack"}]

board = {
    "id": "board", "name": "Wrong number on the board deck", "type": "decision",
    "summary": "The margin figure in last month's board pack used the bad load and has already informed a pricing decision.",
    "abs0": absmin("2026-03-03 08:00"), "signal": 2880, "complaint": 10080,
    "signalText": "a finance analyst's reconciliation does not tie to the ledger",
    "complaintText": "the external auditor asks about the margin line",
    "nodes": [
        {"id": "portal", "name": "Board portal copy of the pack", "type": "report", "refresh": True, "outside": False, "known": True, "notifiable": True},
        {"id": "emailed", "name": "Emailed pack (9 directors)", "type": "report copy", "refresh": False, "outside": False, "known": False, "notifiable": True},
        {"id": "pricing", "name": "Pricing committee deck", "type": "report copy", "refresh": False, "outside": False, "known": False, "notifiable": True},
        {"id": "investor", "name": "Investor update", "type": "outside copy", "refresh": False, "outside": True, "known": False, "notifiable": True},
        {"id": "lender", "name": "Lender covenant certificate", "type": "outside copy", "refresh": False, "outside": True, "known": False, "notifiable": True},
    ],
    "doors": [], "rows": 0,
    "deadlines": [
        {"id": "chair48", "label": "Quarrybank policy: audit committee chair told within 48 hours of becoming aware of a misstated board figure",
         "kind": "hours", "hours": 48, "owner": "constructed internal policy"},
    ],
    "events": sorted(events_board, key=lambda e: (e["t"], e["k"], e["n"])),
}

SAMPLE = {
    "note": "Constructed Quarrybank example. Every node, reader, row range and time is constructed; no public base rate is used.",
    "seed": 20261110,
    "incidents": [load, leak, board],
}

if __name__ == "__main__":
    repo = Path(sys.argv[1] if len(sys.argv) > 1 else Path(__file__).resolve().parent.parent)
    out = repo / "assets" / "ird-sample.js"
    body = json.dumps(SAMPLE, separators=(",", ":"), ensure_ascii=True)
    out.write_text("/* ird-sample.js - Constructed Quarrybank example, generated by materials/build-ird-sample.py. Do not edit by hand. */\nwindow.IRD_SAMPLE = " + body + ";\n", encoding="utf-8")
    print(f"wrote {out} ({out.stat().st_size} bytes, {sum(len(i['events']) for i in SAMPLE['incidents'])} events)")

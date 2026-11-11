#!/usr/bin/env python3
"""Python reference for the incident clock (assets/ird-live.js). Same rules, written independently.

Reads assets/ird-sample.js, replays each incident's event log under a response plan, prints canon.
Usage: python3 materials/ird_reference.py <repo> [--json]

Rules (minutes after the bad write; S = first signal, C = first complaint):
  declare  = S+5 if rehearsed, else S+15 with a declare rule, else C
  assess   = declare+10 if rehearsed, else declare+20 with severity+roles, else declare+240
  contain  = assess + (10 if rehearsed else 15) with a playbook, else assess+120
  correct  = contain + (180 if rehearsed else 360), +240 if the bad table was dropped
  fix-before-contain: contain = correct.  Learner overrides replace declare/contain/correct.
  effective contain = min(contain, correct); contain and correct never earlier than declare.
  notify   = contain + (15 if rehearsed else 30) for every reached node (lineage notice),
             else declare+60 for nodes someone complained about (known), others never.
  formal   = assess+720 if rehearsed, else assess+1440 with roles, else declare+7200.
A node is tainted if it materialised before containment. A read or decision on a tainted node is
bad until it clears: at the correction if the node refreshes, at its notice if it is notified.
Leak: an access counts while its door is open; a playbook closes every door at containment,
without one only the basic door closes then and the rest at the correction.
"""
import json, sys
from pathlib import Path

INF = float("inf")
PRESETS = [
    ("r0", "No plan", {}),
    ("r1", "Declare rule", {"declare": True}),
    ("r2", "Severity and roles", {"declare": True, "roles": True}),
    ("r3", "Containment playbook", {"declare": True, "roles": True, "playbook": True}),
    ("r4", "Lineage-driven consumer notice", {"declare": True, "roles": True, "playbook": True, "lineage": True}),
    ("r5", "Rehearsed plan", {"declare": True, "roles": True, "playbook": True, "lineage": True, "rehearsed": True}),
]
TRAPS = [
    ("t1", "Fix before you contain", {"declare": True, "roles": True, "playbook": True, "lineage": True, "fixFirst": True}),
    ("t2", "Drop the bad table to stop it", {"declare": True, "roles": True, "playbook": True, "lineage": True, "dropEvidence": True}),
    ("t3", "Tell only the people who complained", {"declare": True, "roles": True, "playbook": True, "rehearsed": True}),
]
MOVES = [
    ("m1", "Learner moves on the no-plan baseline", {"times": {"load": {"declare": 60, "contain": 90, "correct": 300},
                                                         "leak": {"declare": 240, "contain": 250, "correct": 600},
                                                         "board": {"declare": 2900, "contain": 2910, "correct": 3000}}}),
    ("m2", "Correct before contain, typed by hand", {"declare": True, "times": {"load": {"declare": 100, "contain": 900, "correct": 400}}}),
    ("m3", "Rehearsed plan plus fix-first switch", {"declare": True, "roles": True, "playbook": True, "lineage": True, "rehearsed": True, "fixFirst": True}),
    ("m4", "Rehearsed plan plus drop-table switch", {"declare": True, "roles": True, "playbook": True, "lineage": True, "rehearsed": True, "dropEvidence": True}),
]
DEFAULTS = {"declare": False, "roles": False, "playbook": False, "lineage": False, "rehearsed": False,
            "fixFirst": False, "dropEvidence": False, "times": None}


def load_sample(repo):
    s = (Path(repo) / "assets" / "ird-sample.js").read_text(encoding="utf-8")
    return json.loads(s[s.index("=") + 1:].strip().rstrip(";"))


def clock(inc, o):
    S, C = inc["signal"], inc["complaint"]
    reh = o["rehearsed"]
    declare = S + 5 if reh else (S + 15 if o["declare"] else C)
    assess = declare + 10 if reh else (declare + 20 if o["roles"] else declare + 240)
    contain = assess + ((10 if reh else 15) if o["playbook"] else 120)
    correct = contain + (180 if reh else 360) + (240 if o["dropEvidence"] else 0)
    if o["fixFirst"]:
        contain = correct
    ov = (o["times"] or {}).get(inc["id"]) or {}
    if ov.get("declare") is not None:
        declare = ov["declare"]
        assess = declare + 10 if reh else (declare + 20 if o["roles"] else declare + 240)
    if ov.get("contain") is not None:
        contain = ov["contain"]
    if ov.get("correct") is not None:
        correct = ov["correct"]
    contain = max(contain, declare)
    correct = max(correct, declare)
    contain = min(contain, correct)
    notify_at = contain + (15 if reh else 30)
    formal = assess + 720 if reh else (assess + 1440 if o["roles"] else declare + 7200)
    return {"declare": declare, "assess": assess, "contain": contain, "correct": correct,
            "notifyAt": notify_at, "formal": formal}


def union_size(ranges):
    tot, cur_lo, cur_hi = 0, None, None
    for lo, hi in sorted(ranges):
        if cur_hi is None or lo > cur_hi:
            if cur_hi is not None:
                tot += cur_hi - cur_lo
            cur_lo, cur_hi = lo, hi
        else:
            cur_hi = max(cur_hi, hi)
    if cur_hi is not None:
        tot += cur_hi - cur_lo
    return tot


def run_incident(inc, o):
    k = clock(inc, o)
    S = inc["signal"]
    nodes = {n["id"]: n for n in inc["nodes"]}
    order = [n["id"] for n in inc["nodes"]]
    tainted = {nid: False for nid in order}
    for e in inc["events"]:
        if e["k"] == "mat" and e["t"] < k["contain"]:
            tainted[e["n"]] = True
    # who is reached: bad reads, bad decisions, open-door accesses
    door_close = {}
    for d in inc["doors"]:
        door_close[d["id"]] = k["contain"] if (o["playbook"] or d["basic"]) else k["correct"]
    reached = set()
    for e in inc["events"]:
        if e["k"] == "access" and e["t"] < door_close[e["door"]]:
            reached.add(e["p"])
    # notice times
    notified = {}
    for nid in order:
        n = nodes[nid]
        if not n["notifiable"]:
            notified[nid] = None
        elif o["lineage"]:
            notified[nid] = k["notifyAt"] if (tainted[nid] or nid in reached) else None
        else:
            notified[nid] = k["declare"] + 60 if n["known"] else None

    def clear(nid):
        c = INF
        if nodes[nid]["refresh"]:
            c = min(c, k["correct"])
        if notified[nid] is not None:
            c = min(c, notified[nid])
        return c

    bad_reads, readers, decisions = 0, set(), []
    for e in inc["events"]:
        if e["k"] in ("read", "decision") and tainted[e["n"]] and e["t"] < clear(e["n"]):
            reached.add(e["n"])
            if e["k"] == "read":
                bad_reads += 1
                readers.add(e["r"])
            else:
                decisions.append(e["d"])
    reached_list = [nid for nid in order if nid in reached]
    never = [nid for nid in reached_list if nodes[nid]["notifiable"] and notified[nid] is None]
    still_wrong = [nid for nid in order if tainted[nid] and not nodes[nid]["refresh"] and notified[nid] is None]
    rows_at_contain = rows_total = 0
    if inc["rows"]:
        at_c = [(e["lo"], e["hi"]) for e in inc["events"] if e["k"] == "access" and e["t"] < k["contain"]]
        tot = [(e["lo"], e["hi"]) for e in inc["events"] if e["k"] == "access" and e["t"] < door_close[e["door"]]]
        rows_at_contain, rows_total = union_size(at_c), union_size(tot)
        if o["dropEvidence"]:
            rows_at_contain = rows_total = inc["rows"]
    dls = []
    for d in inc["deadlines"]:
        if d["kind"] == "hours":
            due, done = S + d["hours"] * 60, k["formal"]
        elif d["kind"] == "calendarDays":
            day = (inc["abs0"] + k["assess"]) // 1440
            due, done = (day + d["days"] + 1) * 1440 - inc["abs0"], k["formal"]
        else:
            due, done = S + d["hours"] * 60, notified.get(d["node"])
        dls.append({"id": d["id"], "due": due, "done": done, "met": done is not None and done <= due})
    return {
        "id": inc["id"],
        "declare": k["declare"], "assess": k["assess"], "contain": k["contain"], "correct": k["correct"],
        "ttDeclare": k["declare"] - S, "ttContain": k["contain"] - S, "ttCorrect": k["correct"] - S,
        "consumersReached": len(reached_list), "reached": reached_list,
        "decisionsOnBad": len(decisions), "decisions": decisions,
        "badReads": bad_reads, "peopleRead": len(readers),
        "neverNotified": len(never), "never": never, "stillWrong": len(still_wrong),
        "rowsAtContain": rows_at_contain, "rowsTotal": rows_total,
        "evidence": "lost" if o["dropEvidence"] else "kept",
        "deadlines": dls,
    }


def run(sample, opts):
    o = dict(DEFAULTS)
    o.update(opts or {})
    incs = [run_incident(i, o) for i in sample["incidents"]]
    dl = [d for i in incs for d in i["deadlines"]]
    return {
        "incidents": incs,
        "consumersReached": sum(i["consumersReached"] for i in incs),
        "decisionsOnBad": sum(i["decisionsOnBad"] for i in incs),
        "neverNotified": sum(i["neverNotified"] for i in incs),
        "stillWrong": sum(i["stillWrong"] for i in incs),
        "peopleRead": sum(i["peopleRead"] for i in incs),
        "deadlinesMet": sum(1 for d in dl if d["met"]), "deadlinesTotal": len(dl),
    }


def canon(sample):
    def one(rid, name, o):
        r = run(sample, o)
        r["rung"], r["name"] = rid, name
        return r
    return {"ladder": [one(*p) for p in PRESETS], "traps": [one(*t) for t in TRAPS], "moves": [one(*m) for m in MOVES]}


def fmt(m):
    if m is None:
        return "never"
    h, mm = divmod(int(m), 60)
    return f"{h}h{mm:02d}"


if __name__ == "__main__":
    repo = sys.argv[1] if len(sys.argv) > 1 and not sys.argv[1].startswith("--") else str(Path(__file__).resolve().parent.parent)
    c = canon(load_sample(repo))
    if "--json" in sys.argv:
        print(json.dumps(c, indent=1))
        sys.exit(0)
    for r in c["ladder"] + c["traps"] + c["moves"]:
        print(f"{r['rung']} {r['name']}: reached {r['consumersReached']} consumers + {r['decisionsOnBad']} decisions; "
              f"never told {r['neverNotified']}; still wrong {r['stillWrong']}; people read {r['peopleRead']}; deadlines {r['deadlinesMet']}/{r['deadlinesTotal']}")
        for i in r["incidents"]:
            print(f"   {i['id']:5s} declare {fmt(i['ttDeclare'])} contain {fmt(i['ttContain'])} correct {fmt(i['ttCorrect'])} | "
                  f"reached {i['consumersReached']} dec {i['decisionsOnBad']} reads {i['badReads']} people {i['peopleRead']} never {i['neverNotified']} "
                  f"rows {i['rowsAtContain']}/{i['rowsTotal']} | " + " ".join(f"{d['id']}:{'met' if d['met'] else 'MISSED'}" for d in i["deadlines"]))

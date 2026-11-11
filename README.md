<!-- learn-with-phoebe hub banner -->
> ### 📚 Part of [**Learn with Phoebe**](https://phoebefu6.github.io/learn-with-phoebe/)
> The shelf of 194 free, hands-on courses on AI, data, and the craft around them. **[Browse every course ↗](https://phoebefu6.github.io/learn-with-phoebe/)**
<!-- /learn-with-phoebe hub banner -->

# Learn Incident Response for Data Teams with Phoebe

Fourteen 45-minute sessions on what to do when the data is wrong or out: declare it, size it, staff
the room, contain it, correct it, tell every consumer who used it, and close it with evidence. By
Phoebe Fu.

- **Leader track (6)**: heads of data, analytics managers and the privacy or compliance partner who
  run the call: declare rule, severity matrix, roles, comms, restatement, readiness.
- **Responder track (8)**: data and analytics engineers on call: timeline, consumer trace, containment,
  leaked-table doors, correction check, consumer notice, close-out, and the incident clock.

Running case: Quarrybank, a constructed building-supplies distributor with three incidents in one
quarter (a bad load, a leaked table, a wrong number on the board deck). Every session adds a page to
Quarrybank's incident response plan.

## The bench: the incident clock

`assets/ird-live.js` replays a 222-event log (`assets/ird-sample.js`, constructed) against a response
plan and counts the consumers and decisions that used bad data before it was corrected or they were
told, consumers never told, copies still wrong, rows exposed and notice deadlines met. Deadlines are
fixed inputs (GDPR 72 hours, PDPA 3 calendar days, a constructed contract term and policy).

```
python3 materials/build-ird-sample.py .   # regenerate the sample
python3 materials/compare-ladder.py .     # node engine vs materials/ird_reference.py, by value
```

Static site, no build step: open `index.html`.

---
publish: true
title: Saga Pattern — Full Notes
tags:
  - microservices
  - refresher
  - flashcards
---

## TL;DR ⚡

> [!abstract] 5-second recall
>
> - **Saga** = how you keep data consistent across microservices when you **can't**
>   use one ACID transaction. A chain of **local transactions**, each with a
>   **compensating action** that undoes it if a later step fails.
> - Trades **atomicity** for **eventual consistency**.
> - Two styles: **choreography** (event-driven, no boss) vs **orchestration** (one coordinator).
> - Reliability tools: **idempotency** (dedupe), **retry + backoff + jitter**, **DLQ** (give-up bucket).

---

## 1. The problem Saga solves

In a monolith, one **ACID transaction** wraps everything: debit + credit either
both commit or both roll back. Atomic. Safe.

In **microservices**, each service has its **own database**. There is no single
transaction that can span Service A's DB and Service B's DB.

- The old solution — **2PC (two-phase commit)** — technically works but is
  **avoided**: it's slow, it **locks resources** across services while waiting,
  and one slow/dead participant blocks everyone. Doesn't scale.
- So we give up on "one atomic transaction" and use a **Saga** instead.

## 2. What a Saga actually is

A Saga breaks one business transaction into a **sequence of local transactions**,
one per service. Each step commits **independently and immediately**. If a later
step fails, you don't "roll back" (you can't — earlier steps already committed) —
instead you run a **compensating transaction** that _semantically undoes_ the
earlier step.

**Banking example — money transfer across services:**
| Forward step | Compensating action (if a later step fails) |
|---|---|
| 1. Debit ₹5,000 from Account A | Refund ₹5,000 to Account A |
| 2. Credit ₹5,000 to Account B | Reverse the credit |
| 3. Send confirmation | (nothing to undo) |

If step 2 fails, the Saga runs step 1's compensation (refund A). Net effect: as if
nothing happened — **eventual** consistency, reached through compensation rather
than rollback.

> [!warning] Say it right in interviews
> A Saga is **NOT** a distributed transaction — it's the **alternative** to one.
> "Local commits + compensations for eventual consistency, because one ACID
> transaction can't span services."

## 3. Two flavours

- **Choreography** — no central coordinator. Each service publishes **events**;
  others listen and react. Loosely coupled, scales well, but **hard to trace**
  ("who's doing what?") and logic is scattered.
- **Orchestration** — one **orchestrator** service directs each step: "A, do your
  part... now B... B failed? A, compensate." Central control, **easy to follow and
  debug**, but the orchestrator is a component you must build and keep available.
  _(Frameworks: Axon, Camunda, Temporal.)_

Rule of thumb: few steps → choreography is fine; complex multi-step flows →
orchestration for sanity.

---

## 4. Making it reliable — the 3 tools interviewers probe

### (a) Idempotency — "safe to run twice"

> **Idempotent** = running the operation **multiple times has the same effect as
> running it once.** Pressing an elevator button 5 times = same as once.

Why it matters: networks retry. The same "refund A" message might arrive **twice**.
Without protection, you refund twice → wrong balance.

**How to achieve it:**

1. Attach a unique **idempotency key** to each operation — a **UUID** (prefer
   **v7**: time-sortable, indexes better than the random v4).
2. The receiver **records which keys it has already processed** and **skips
   duplicates**. Second delivery of the same key = **no-op**.

The key alone doesn't make it idempotent — it's the key **plus the dedupe check**.

### (b) Retry with backoff + jitter — "try again, but politely"

When a step or compensation fails transiently (network blip, service busy), you
**retry** instead of giving up immediately. But _how_ you retry matters:

- **Fixed retry** (retry every 1s) — bad. If a service is overloaded, hammering it
  every second keeps it down.
- **Exponential backoff** — wait **longer each time**: 1s, 2s, 4s, 8s, 16s... Gives
  the struggling service room to recover. "Back off" = step back, wait more.
- **Jitter** — add a **small random amount** to each wait (e.g. 4s ± a random
  0–1s). Why? Without jitter, if 1,000 requests all failed at the same instant,
  they'd **all retry at exactly 1s, 2s, 4s together** — a synchronized stampede
  that re-crashes the service (the "**thundering herd**"). Jitter **spreads the
  retries out** so they don't arrive in a synchronized wave.

> One line: _"Exponential backoff with jitter" = wait progressively longer, plus a
> random nudge so all clients don't retry in lockstep and re-overload the service._

### (c) Dead Letter Queue (DLQ) — "the give-up bucket"

> A **DLQ** is a separate queue where a message goes **after it has failed all its
> retries.** It's the "we couldn't process this — park it for humans" bucket.

Where it fits in the flow:

```
message → try → fail → retry (backoff+jitter) → fail → retry → ... 
   → still failing after N attempts → move to DLQ  → alert / manual review
```

Why it matters: without a DLQ, a permanently-bad message either (a) blocks the
queue forever as it retries endlessly, or (b) gets silently dropped. The DLQ
**gets the poison message out of the way** so healthy traffic flows, **preserves it**
for investigation, and lets you **alert** on it. Your resume already has "DLQs +
custom retry layers" — this is the story behind that line.

## 5. How they connect (the full failure path)

A compensation message fails →

1. **Retry** it with **exponential backoff + jitter** (don't stampede).
2. Each attempt is **idempotent** (dedupe key), so a retry that _actually_ succeeded
   but whose ack was lost won't double-apply.
3. Still failing after N attempts → send to the **DLQ** for manual intervention.
4. Meanwhile the **orchestrator's state is persisted** (event sourcing / outbox),
   so if it crashes it replays and resumes — it doesn't lose track of the Saga.

---

## Test Yourself

Why not use 2PC / one ACID transaction across microservices?::Each service has its own DB; 2PC locks resources across services, is slow, and one dead participant blocks all. Use a Saga (local commits + compensations) instead.
What is a compensating transaction?::An action that semantically UNDOES a previously-committed step (e.g. refund a debit), since you can't roll back an already-committed local transaction.
Choreography vs orchestration?::Choreography = event-driven, no central coordinator (loose, hard to trace). Orchestration = one coordinator directs steps (clear, debuggable).
What is exponential backoff?::Retrying with progressively longer waits (1s, 2s, 4s, 8s...) to give a struggling service time to recover instead of hammering it.
What is jitter and why add it?::A small random amount added to each retry delay, so many clients that failed together don't all retry at the exact same instant (the thundering-herd stampede).
What is a DLQ and where does it fit?::A Dead Letter Queue holds messages that failed all retries — it unblocks the main queue, preserves the bad message, and lets you alert/investigate instead of silently dropping it.
How do you make a Saga step idempotent?::Attach a unique idempotency key (UUID v7); the receiver records processed keys and skips duplicates so re-delivery is a no-op.

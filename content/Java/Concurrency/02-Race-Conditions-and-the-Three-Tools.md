---
publish: true
title: Race Conditions & the Three Tools (volatile / synchronized / atomic)
tags:
  - java
  - concurrency
  - refresher
  - flashcards
---

## TL;DR ⚡

> [!abstract]
>
> - **Race condition** = outcome depends on thread timing; classic form is **check-then-act**.
> - **volatile** = visibility only. **synchronized** = atomicity (blocks). **atomic** = lock-free single-variable (CAS).
> - **Hook:** _volatile = see it · synchronized = one-at-a-time · atomic = safe ++ without a lock._

## The race: joint account

Balance ₹10,000. Two ₹8,000 withdrawals at once:

```java
void withdraw(int amount) {
    if (balance >= amount) {      // both READ 10,000, both pass  ← check
        balance = balance - amount; // both subtract 8,000          ← act
    }
}
```

Both read before either writes → both withdraw → **−6,000**. The read-check-write wasn't atomic. This is a **check-then-act** race.

**Fix — `synchronized`:** only one thread inside `withdraw` at a time; the second reads the updated balance and fails the check.

## The three tools — different jobs

### volatile — VISIBILITY only

Scenario: a "trading halted" / daily interest-rate flag. Without volatile, threads may cache a **stale** copy in a CPU register. `volatile` forces reads from **main memory**, so everyone sees the latest value.

> ⚠️ volatile does NOT make `count++` safe — that's read-add-write (3 steps). Volatile = one writer, many readers of a simple value.

### synchronized — ATOMICITY (+ visibility)

For **compound** operations (check-then-act, multi-field updates). Correct for anything, but **blocks** other threads → slowest. `synchronized` on a method locks the whole object (`this`).

### atomic (CAS) — lock-free single variable

`AtomicLong txnCount; txnCount.incrementAndGet();` — atomic `++` with **no lock**. Uses **CAS (compare-and-swap)**: "if the value is still what I read, swap it; else retry." No blocking. Fast for a single hot counter. Limit: protects **one** variable only.

## Decision table

| Tool | Solves | Banking example | Cost |
|---|---|---|---|
| volatile | visibility | trading-halt / rate flag | cheap; no atomicity |
| synchronized | atomicity of compound ops | full withdraw / transfer | blocks; slowest |
| atomic (CAS) | atomicity of ONE var | txn-per-second counter | fast; single var |

Decision line: _"volatile for a visibility flag, atomic for a single hot counter, synchronized when the invariant spans multiple fields or a check-then-act."_

## Test Yourself

What is a race condition (classic form)?::Outcome depends on thread timing; check-then-act — two threads both pass a check before either commits.
volatile vs synchronized vs atomic?::volatile = visibility only; synchronized = atomicity for compound ops but blocks; atomic = lock-free single-variable via CAS.
Why doesn't volatile make count++ safe?::++ is read-add-write (3 steps); volatile guarantees latest value, not atomicity of the 3 steps.
What is CAS?::Compare-and-swap: if the value still equals what I read, swap it; else retry. Lock-free atomicity.

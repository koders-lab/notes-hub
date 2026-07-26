---
publish: true
title: Deadlock & the Money-Transfer Trap
tags:
  - java
  - concurrency
  - refresher
  - flashcards
---

## TL;DR ⚡

> [!abstract]
>
> - **Transfer** (debit A + credit B) must be atomic → you must lock **both** accounts.
> - Locking both creates **deadlock**: T1 holds A waits for B; T2 holds B waits for A → frozen forever.
> - **Fix: acquire locks in a consistent global order** (e.g. lower account-id first).

## The transfer trap — why one lock isn't enough

Transfer ₹5,000 from A to B = debit A **and** credit B as one unit. If you only `synchronized` on A, another thread can touch B mid-transfer. So you must lock **both** accounts.

```java
synchronized (accountA) {
    synchronized (accountB) {
        accountA.debit(5000);
        accountB.credit(5000);
    }
}
```

## Deadlock — the freeze this creates

Two transfers at once, opposite directions:

- **T1** (A→B): locks **A**, then reaches for **B**.
- **T2** (B→A): locks **B**, then reaches for **A**.
- T1 holds A, waiting for B. T2 holds B, waiting for A. **Neither releases. Frozen forever.**

### The 4 Coffman conditions (deadlock needs all four)

1. **Mutual exclusion** — a lock is held by one thread.
2. **Hold and wait** — hold one lock while waiting for another.
3. **No preemption** — can't force-take a lock.
4. **Circular wait** — a cycle of threads each waiting on the next.

Break **any one** → no deadlock. The easiest to break is **circular wait**.

## The fix — consistent lock ordering

Always acquire locks in the **same global order**, e.g. by account id:

```java
Account first  = a.id() < b.id() ? a : b;
Account second = a.id() < b.id() ? b : a;
synchronized (first) {
    synchronized (second) { /* transfer */ }
}
```

Now T1 and T2 both try to lock the lower id first → one wins cleanly → no cycle → no deadlock.

Other tactics: **lock timeout** (`tryLock` with timeout, then back off and retry), or a single coarse lock (simpler, less concurrent).

## Test Yourself

Why does a transfer need two locks?::Debit A + credit B must be atomic; locking only one lets another thread touch the other mid-transfer.
How does deadlock happen in transfers?::Two opposite transfers each lock one account and wait for the other → circular wait → frozen.
How do you prevent it?::Acquire locks in a consistent global order (e.g. lower account id first) so no cycle can form.
Name the 4 deadlock conditions.::Mutual exclusion, hold-and-wait, no preemption, circular wait — break any one to prevent deadlock.

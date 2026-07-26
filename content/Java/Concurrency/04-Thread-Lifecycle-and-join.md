---
publish: true
title: Thread Lifecycle & join()
tags:
  - java
  - concurrency
  - refresher
  - flashcards
---

## TL;DR ⚡

> [!abstract]
>
> - Thread states: **NEW → RUNNABLE → (RUNNING) → BLOCKED / WAITING / TIMED\_WAITING → TERMINATED.**
> - **`join()`** = "wait for that thread to finish before I continue." It is **NOT** fork/join, and it does **not** return/combine results.

## The 6 thread states (java.lang.Thread.State)

1. **NEW** — created (`new Thread()`), not started.
2. **RUNNABLE** — `start()` called; eligible to run (running or ready-to-run — the OS scheduler decides).
3. **BLOCKED** — waiting to acquire a `synchronized` lock another thread holds.
4. **WAITING** — waiting indefinitely for another thread (`wait()`, `join()` with no timeout).
5. **TIMED\_WAITING** — waiting for a set time (`sleep(ms)`, `join(ms)`, `wait(ms)`).
6. **TERMINATED** — `run()` finished (or threw).

> Note: there's no separate "RUNNING" enum — actually-executing is part of RUNNABLE.

## What is join()?

`threadA.join()` called from the main thread means: **"main pauses here until threadA finishes."** It's how you wait for a worker to complete before using its side effects.

```java
Thread worker = new Thread(task);
worker.start();
worker.join();      // main WAITS here until worker is done
System.out.println("worker finished, continue");
```

### Common confusions (yours!)

- **Is join() part of fork/join?** No. **Fork/Join** is a _separate framework_ (`ForkJoinPool`, work-stealing, for divide-and-conquer parallelism). `Thread.join()` is just "wait for this thread." Different things that share the word "join."
- **Does join() combine results from two threads?** No. `join()` returns `void` — it only _waits_. To get a **result** back you use `Future`/`CompletableFuture` (see [[CompletableFuture]]). To _combine_ two async results, that's `CompletableFuture.thenCombine`. `join()` only synchronizes timing, not data.

## Mental model

`join()` = "I'll wait at the door until you come out." It does not carry anything _out_ of the room — that's what Futures are for.

## Test Yourself

Name the thread states.::NEW, RUNNABLE, BLOCKED, WAITING, TIMED\_WAITING, TERMINATED.
What does join() do?::Makes the calling thread wait until the target thread finishes. Returns void — no result.
Is join() the same as Fork/Join?::No — Fork/Join is a separate divide-and-conquer framework (ForkJoinPool). join() just waits for a thread.
How do you get a RESULT from a thread (not just wait)?::Use Future / CompletableFuture; join() only synchronizes timing, it returns nothing.

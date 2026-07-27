---
publish: true
title: Concurrency Basics — Threads, Process & Memory
tags:
  - java
  - concurrency
  - refresher
  - flashcards
  - java/concurrency
---

## TL;DR ⚡

> [!abstract] 5-second recall
>
> - **Thread = a worker.** **Process = the whole program** (its own memory) that workers live in.
> - Threads in one process **share memory** → that's the power _and_ the danger (races).
> - **Local variables** (on each thread's private **stack**) are always thread-safe.
> - Shared **object fields / statics** (on the shared **heap / method area**) are the risk.

## Process vs Thread

- **Process** = one running program with its **own private memory** (heap, address space). Two processes = two separate houses, no shared pantry → they coordinate via DB/queue, not shared variables.
- **Thread** = a worker inside a process; **shares that process's memory**. Sharing is why thread-safety matters.

## Why multithread at all?

1. **Speed** — many workers do independent tasks in parallel.
2. **Responsiveness** — one worker handles new requests while another waits on I/O.

## The memory split (ties to [[JVM Architecture]])

| Region | Private / Shared | Holds | Safe? |
|---|---|---|---|
| JVM Stack (per thread) | Private | local variables, method frames | ✅ always |
| Heap (one) | Shared | objects, incl. shared-object fields | ⚠️ guard |
| Method Area / Metaspace (one) | Shared | class metadata, **static** vars | ⚠️ guard |

**The one question that decides everything:** _"Can more than one thread reach this variable?"_

- Local → no → safe.
- `static` or field of a shared object (singleton bean) → yes → guard it.

## You've done this for 13 years without noticing

- **Tomcat = thread-per-request**: each HTTP request runs your controller on a pooled thread. All your Spring code already ran multithreaded — you just kept state in locals + the DB, so no races fired.
- **Vert.x = event loop**: few threads handle thousands of connections by never blocking; blocking work → worker pool. Rule: never block the event loop.

## Test Yourself

Thread vs process?::Process = running program with its own memory; thread = worker inside it that shares that memory. Sharing causes races.
Why is a local variable always thread-safe?::It lives on the thread's private JVM stack — each thread has its own copy, no sharing.
Where do static variables live and why is that risky?::Method Area (Metaspace, Java 8+), shared by all threads → mutable statics are a race risk.

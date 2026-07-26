---
publish: true
title: JVM Memory ↔ Thread Safety (the bridge)
tags:
  - java
  - refresher
---

## Summary

> [!abstract] The one connection that explains all of thread-safety
> Thread-safety isn't a separate topic — it's a **direct consequence of the JVM
> memory model** you already documented years ago. Where a variable _lives_
> decides whether it's safe.
>
> **Hook:** _Stack = private per thread (safe). Heap + Method Area = shared (danger)._

## The split (from your JVM Architecture note)

> One PC Register, JVM Stack, and Native Method Stack are created **per thread**.
> Heap, Method Area, and Runtime Constant Pool are **shared by all threads.**

| JVM region | Private / Shared | Holds | Thread-safety |
|---|---|---|---|
| **JVM Stack** (per thread) | Private | local variables, method frames | locals always safe ✅ |
| **Heap** (one) | Shared | all objects (singleton fields, instance vars of shared objects) | race risk ⚠️ |
| **Method Area / Metaspace** (one) | Shared | class metadata, **static variables**, constant pool | race risk ⚠️ |

## So the whole rule reduces to one question

**"Can more than one thread reach this variable?"**

- Local variable → lives on _my_ stack → no → **safe**, always.
- `static` field → lives in the shared Method Area → yes → **guard it**.
- Field of a shared object (singleton bean) → lives on the shared Heap → yes → **guard it**.
- Field of an object I `new`-ed locally and never published → on the Heap, but
  only _I_ hold the reference → **safe** (until you share the reference).

## PermGen → Metaspace (Java 8) — common interview Q

- **Before Java 8:** Method Area = **PermGen**, fixed-ish size (~64MB default),
  famous `OutOfMemoryError: PermGen space`.
- **Java 8+:** replaced by **Metaspace**, moved to **native memory**, grows
  unbounded by default. Tune with `-XX:MaxMetaspaceSize`.

## Test Yourself

> [!question]- Q: Why is a local variable always thread-safe, in memory terms?
> A: Locals live on the **JVM Stack**, which is created **per thread** — each
> thread has its own copy, so no sharing, no race.

> [!question]- Q: Where do static variables live, and why does that make them a race risk?
> A: In the **Method Area** (Metaspace in Java 8+), which is **shared by all
> threads** — so a mutable static is touched by everyone at once.

> [!question]- Q: What changed about the Method Area in Java 8?
> A: PermGen (fixed size, on-heap-ish) was replaced by Metaspace (native memory,
> grows by default, tunable with -XX:MaxMetaspaceSize).

## See also

- [[JVM Architecture]] — the full deep-dive note (class loaders, all 5 runtime areas)
- [[Concurrency — Threads, Locks & the Banking Stories]]

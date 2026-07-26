---
publish: true
title: Immutability, final, String safety, ThreadLocal & Object Pools
tags:
  - java
  - concurrency
  - refresher
  - flashcards
---

## TL;DR ⚡

> [!abstract]
>
> - **`final` freezes the reference**, not the object. **Immutable** = the object's contents can't change.
> - **Thread-safety needs immutability**, not just `final`. String is safe because it's immutable.
> - **ThreadLocal** = each thread its own private copy of a variable.
> - **Object pool** = reuse pre-built objects (e.g. DB connection pool) to avoid allocation + GC churn.

## final vs immutable (the distinction you caught)

- **`final`** — the **reference can't be reassigned**. But `final List` can still `.add()` — the object mutates, the variable just can't repoint.
- **Immutable** — the **object itself has no way to change its state** after construction.
- **Thread-safety comes from immutability**, not `final` alone. A `final` reference to a mutable object shared across threads is still a race.

## Why String is thread-safe even when shared

`String` is **immutable** — every "modification" (`concat`, `substring`) returns a **new** String; the original never changes. Many threads reading a String that can never change = no writes = no race.

- The **string pool** (on the heap) is just an optimization to reuse identical literals — the safety comes from **immutability**, not the pool.

## Why `final` fields are extra thread-safe (JMM guarantee)

1. **No writes to race on** — can't reassign after construction.
2. **Safe publication** — the JMM guarantees a `final` field is **fully visible** to other threads once the constructor completes; no "partially built object" visibility bug. (This is why singletons use `private static final INSTANCE`.)

## ThreadLocal

Each thread gets its **own private copy** of a variable, even though the code references one name. Like every cook having their own labelled jar — same label, private contents.

```java
static ThreadLocal<String> currentUser = new ThreadLocal<>();
currentUser.set("alice");   // visible only to THIS thread
```

Classic use: carry a request id / current user / transaction context for the length of a request without passing it through every method.

> ⚠️ In thread pools, **always `remove()`** after use — pooled threads are reused, so a stale ThreadLocal leaks into the next task (and can cause memory leaks).

## Object pooling (recap)

Not empty/null — a cache of **fully-built, reusable** objects you **borrow and return** (reset on reuse) instead of creating and discarding.

- Avoids allocation + **GC stop-the-world** pauses → predictable latency (why trading systems pool).
- The one you already use daily: **DB connection pool** (HikariCP in Spring Boot). Also thread pools.

## Test Yourself

final vs immutable?::final freezes the reference (can't reassign); immutable means the object's contents can't change. Thread-safety needs immutability.
Why is a shared String thread-safe?::It's immutable — every change returns a new String, the original never mutates, so no race.
Why do final fields help thread-safety beyond 'can't reassign'?::JMM guarantees a final field is fully visible after the constructor finishes — safe publication, no partial-object bug.
What is ThreadLocal and its pool gotcha?::Per-thread private copy of a variable; in pools you must remove() after use or it leaks into the next reused task.

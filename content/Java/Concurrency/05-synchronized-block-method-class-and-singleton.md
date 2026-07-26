---
publish: true
title: "synchronized: block vs method vs class + Singleton safety"
tags:
  - java
  - concurrency
  - refresher
  - flashcards
---

## TL;DR ⚡

> [!abstract]
>
> - **Synchronized block** = lock only the critical lines → **less contention, faster**. Prefer this.
> - **Synchronized method** = locks the whole method on `this` (or the Class for static) → coarser, slower.
> - Singletons need care because **one instance is shared by all threads**; the getInstance() creation must be safe (double-checked locking + `volatile`).

## The three granularities

**Method-level** — locks the entire method on the object (`this`):

```java
synchronized void withdraw(int amt) { ... }   // whole method, whole object
```

Simple but coarse: no two synchronized methods on the same object run together, even if unrelated.

**Block-level** — lock only the lines that need it:

```java
void withdraw(int amt) {
    // ... non-critical prep runs freely ...
    synchronized (this) {          // only this section is guarded
        if (balance >= amt) balance -= amt;
    }
}
```

**Faster** — smaller critical section = less time holding the lock = less contention. You can also lock on a **dedicated private lock object** (`private final Object lock = new Object();`) so unrelated code isn't blocked.

**Class-level** — `static synchronized` or `synchronized(MyClass.class)` locks the **Class object**, guarding **static** state across _all_ instances.

## Which is faster / what to avoid

- **Prefer block-level with a private lock object** → smallest critical section, least contention.
- **Avoid synchronizing large methods** → serializes everything, kills throughput.
- **Avoid locking on `this`** if external code could also lock your object (they can interfere) — a private lock object is safer.

## Why singletons need synchronization

A singleton = **one object shared by every thread**. The danger is at **creation** (lazy init): two threads call `getInstance()` at once, both see `instance == null`, both create one → two "singletons."

**Double-checked locking (the classic safe lazy singleton):**

```java
class Config {
    private static volatile Config instance;   // volatile is REQUIRED
    private Config() {}
    static Config getInstance() {
        if (instance == null) {                 // 1st check (no lock, fast path)
            synchronized (Config.class) {
                if (instance == null) {         // 2nd check (inside lock)
                    instance = new Config();
                }
            }
        }
        return instance;
    }
}
```

- **Why `volatile`?** Without it, another thread could see a **partially constructed** object (the reference published before the constructor finished — a visibility/reordering bug). `volatile` guarantees safe publication.
- **Why double-checked?** The outer `if` avoids taking the lock on every call (fast); the inner `if` ensures only the first thread actually creates it.
- **Simpler alternatives:** eager `static final Config INSTANCE = new Config();` (thread-safe by class-loading), or an **enum singleton** (safest, handles serialization too).

## Test Yourself

Block vs method synchronization — which is faster and why?::Block — it guards only the critical lines, so the lock is held briefly and contention is lower. Method locks the whole method on the object.
Why does a lazy singleton need synchronization?::One shared instance; two threads could both see null and create two instances. Guard creation.
Why is volatile needed in double-checked locking?::To guarantee safe publication — without it a thread could see a partially-constructed instance due to reordering.
Safest simplest singleton?::Enum singleton (thread-safe, serialization-safe) or eager static final init.

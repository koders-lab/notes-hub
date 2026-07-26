---
publish: true
title: Creating Threads — Runnable vs Thread, start() vs run()
tags:
  - java
  - concurrency
  - refresher
  - flashcards
---

## TL;DR ⚡

> [!abstract]
>
> - Two ways to make a thread: **extend `Thread`** or **implement `Runnable`** (prefer Runnable).
> - **`start()`** launches a new thread; **`run()`** just calls the method on the current thread (classic trap).
> - The "multiple threads on one object" memory: with **Runnable**, many threads can share **one Runnable instance** (one task object, one shared state); extending Thread ties task+thread together.

## Two ways to create a thread

**1. Extend `Thread`:**

```java
class Cook extends Thread {
    public void run() { System.out.println("chopping"); }
}
new Cook().start();
```

**2. Implement `Runnable` (preferred):**

```java
Runnable task = () -> System.out.println("chopping");
new Thread(task).start();
```

## Why Runnable is preferred

1. **Java allows only single inheritance** — extend `Thread` and you've used up your one `extends`; `Runnable` is an interface, so your class stays free to extend something else.
2. **Separation of concerns** — `Runnable` = the _task_; `Thread` = the _worker_. Cleaner: the task doesn't need to know it's a thread.
3. **Reuse with pools** — `ExecutorService` takes `Runnable`/`Callable`, not `Thread` subclasses.

## The "multiple threads on one object" memory (your Stack Overflow recollection)

This is the real distinction you were reaching for:

- With **Runnable**, you can hand the **same Runnable instance to many Thread objects** — multiple threads running over **one shared task object**:
  ```java
  Runnable shared = new Counter();      // ONE object
  new Thread(shared).start();           // thread A
  new Thread(shared).start();           // thread B  → both share Counter's state
  ```
  If `Counter` has mutable fields, now you have shared mutable state → races. This is _the_ setup where thread-safety bites.
- With **extends Thread**, each thread _is_ its own object; you typically get one thread per object, and sharing state means extra wiring.

So the concept: **Runnable decouples the task from the thread, which is exactly what lets several threads operate on a single shared task object.**

## start() vs run() — the trap

- `start()` → asks the JVM to create a **new thread**, which then calls `run()`. Real concurrency.
- `run()` → just a normal method call on the **current** thread. No new thread. Looks like it works, runs sequentially.

## Test Yourself

Runnable vs extending Thread — why prefer Runnable?::Single inheritance stays free; separates task from worker; works with thread pools/Executors.
start() vs run()?::start() launches a new thread that calls run(); calling run() directly just runs it on the current thread — no concurrency.
How can multiple threads run over one object?::Pass the same Runnable instance to several Thread objects — they share that task object's state (and its race risks).

---
publish: true
title: CompletableFuture
tags:
  - java
  - concurrency
  - refresher
  - flashcards
---

## TL;DR ⚡

> [!abstract]
>
> - `Future.get()` **blocks**. `CompletableFuture` lets you attach **callbacks** (no thread waits) and **compose** async steps into a pipeline.
> - **Hook:** _thenApply = map (value→value) · thenCompose = flatMap (value→future, flattened) · thenCombine = join two futures._
> - The work still runs on _some_ pool thread — CF makes **your thread** non-blocking, not the work itself.

## Why it exists (vs plain Future)

`Future` only lets you submit a task and later **block** on `.get()`. You can't react to completion or chain work without blocking a thread. `CompletableFuture` fixes two things:

1. **Callbacks** — "when it's done, run this next" — so no thread sits idle waiting.
2. **Composition** — chain/combine async steps into a pipeline. _This is the headline feature._

> Careful phrasing: CF doesn't make work "non-blocking" — the task runs on a pool thread. What changes is you **register a continuation** instead of parking a thread on `.get()`.

## The key methods

| Method | Function returns | Result | Analogy |
|---|---|---|---|
| `thenApply(fn)` | a **value** | `CF<value>` | Stream `map` |
| `thenCompose(fn)` | a **CompletableFuture** | `CF<value>` (flattened) | Stream `flatMap` |
| `thenCombine(other, fn)` | combines **two** CFs' results | `CF<combined>` | join two |

### thenApply vs thenCompose — the trap

If your function **itself returns a `CompletableFuture`** and you use `thenApply`, you get a **nested `CF<CF<T>>`** — a future wrapping a future. `thenCompose` **flattens** it to a single `CF<T>`.

- Use **thenApply** when transforming a value: `CF<String>` → its length.
- Use **thenCompose** when the next step is **itself async**: `getUserId()` (returns CF) then `fetchOrders(id)` (also returns CF).
- Same trap as `map` vs `flatMap` giving `Stream<Stream<T>>`.

### thenCombine

For **two independent** async results you want to merge: fetch price from service A and inventory from service B in parallel, then combine. Different from `thenCompose`, which is **sequential** (B depends on A's result).

## Async variants

`thenApplyAsync`, etc. run the callback on a **separate pool thread** (default `ForkJoinPool.commonPool`, or one you pass). Non-Async runs the callback on whatever thread completed the previous stage.

## Test Yourself

What does CompletableFuture give you over Future?::Callbacks (no blocking on get) + composition of async steps into a pipeline.
thenApply vs thenCompose?::thenApply: function returns a value → CF<value>. thenCompose: function returns a CF → flattened to CF<value> (avoids CF\<CF<T>>). Like map vs flatMap.
When does thenApply bite you?::When the function you pass itself returns a CompletableFuture — you get a nested CF\<CF<T>>. Use thenCompose.
thenCombine vs thenCompose?::thenCombine merges two independent futures' results; thenCompose sequences a future that depends on a previous future's result.

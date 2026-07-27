---
publish: true
title: Python — Interview Refresher
tags:
  - python
  - refresher
  - flashcards
---

> [!abstract] Quick brush-up. Your Java brain already knows the concepts — this maps them to Python + the gotchas interviewers probe.

## Language essentials

> [!question]- Key data structures?
> **list** (mutable, ordered), **tuple** (immutable, ordered), **dict** (hash map), **set** (unique). Comprehensions: `[x*2 for x in xs if x>0]`.

> [!question]- Mutable vs immutable?
> Immutable: **int, str, tuple, frozenset**. Mutable: **list, dict, set**. Matters for default args and shared references.

> [!warning]- Mutable default argument trap (classic)
> `def f(x, acc=[]):` — the list is created **once** and shared across calls → surprise state. Fix: `def f(x, acc=None): acc = acc or []`.

> [!question]- `is` vs `==`?
> `==` compares **values**; `is` compares **identity** (same object). Like Java's `equals` vs `==`.

> [!question]- Shallow vs deep copy?
> `copy.copy` (shallow — nested refs shared) vs `copy.deepcopy` (fully independent).

## The GIL (they ask this for "Python concurrency")

> [!danger]- What is the GIL and why does it matter?
> **Global Interpreter Lock** — only **one thread executes Python bytecode at a time**. So Python threads DON'T give true CPU parallelism. **Use threads for I/O-bound** work (they release the GIL while waiting), **use `multiprocessing` for CPU-bound** (separate processes, separate GILs). _(Note: Python 3.13+ has an experimental no-GIL build.)_

## Pythonic / OO

> [!question]- Decorators?
> A function that wraps another to add behavior (`@app.route`, `@staticmethod`). Same idea as Java annotations + AOP, but plain functions.

> [!question]- Generators / `yield`?
> Lazy iterators — produce values on demand, memory-efficient. `yield` pauses and resumes.

> [!question]- List comprehension vs generator expression?
> `[...]` builds the whole list in memory; `(...)` is a lazy generator (streams one at a time).

> [!question]- args/kwargs?
> `*args` = variable positional args (tuple); `**kwargs` = variable keyword args (dict).

## Your honesty framing

> [!note] Positioning Python (you're Java-core)
> _"My core is Java; I've used Python across NLP, chatbots, and Flask services, and I ramp fast. I'm comfortable with the syntax, comprehensions, and the concurrency model — the GIL, threads for I/O vs multiprocessing for CPU."_ True + confident.

## Drill cards

GIL — what and impact?::Global Interpreter Lock: one thread runs Python bytecode at a time. Threads for I/O-bound, multiprocessing for CPU-bound.
is vs ==?::== compares values; is compares identity (same object).
Mutable default arg trap?::Default list/dict is created once and shared across calls; use None and create inside.
Generator vs list comprehension?::Generator (parentheses) is lazy/streaming/memory-light; list comp builds it all in memory.
Mutable vs immutable types?::Immutable: int, str, tuple, frozenset. Mutable: list, dict, set.

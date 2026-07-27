---
publish: true
title: Generics — Refresher
tags:
  - java
  - refresher
  - flashcards
---

> [!abstract] 3-minute skim. Full detail → [[Generics — Full Notes]].

## The 8 facts

1. Generics = **compile-time** type safety; **erased** at runtime.
2. **Invariant:** `List<Integer>` is NOT a `List<Number>`.
3. `<?>` = unknown, read-only as Object.
4. `<? extends T>` = T or subtype → **READ** (producer). Can't add.
5. `<? super T>` = T or supertype → **WRITE** (consumer). Read back as Object.
6. **PECS** — Producer Extends, Consumer Super.
7. **Type erasure** ⇒ no `new T[]`, no `instanceof List<String>`, no generic-only overloads.
8. Type parameters use `extends` only (upper bound) — **no `super`** for type params; `super` is wildcards only.

## Signatures to recognize

- `Collections.copy(List<? super T> dest, List<? extends T> src)` — PECS in the JDK.
- `<T extends Comparable<T>> T max(List<T>)` — bounded type parameter.
- `<T extends Number & Comparable<T>>` — multiple bounds.

## Drill cards

PECS — what is it?::Producer Extends, Consumer Super. Read from `? extends T`; write to `? super T`.
Why can't you add to List\<? extends Number>?::Compiler only knows it's some subtype; adding could corrupt (e.g. a Double into a List<Integer>). Read-only.
What is type erasure?::Generics are removed at runtime (List<String> → List). No new T\[], no instanceof List<String>, no generic-only overloads. For backward compatibility.
Are generics covariant like arrays?::No — generics are invariant (List<Integer> ≠ List<Number>); arrays are covariant but fail at runtime (ArrayStoreException).
extends vs super — where does each apply?::Type parameters: `extends` (upper bound) only. Wildcards: both `? extends` (read) and `? super` (write).

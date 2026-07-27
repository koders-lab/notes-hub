---
publish: true
title: HashMap — Refresher
tags:
  - java
  - refresher
  - flashcards
---

> [!abstract] 3-minute skim before an interview. Full detail → [[HashMap Internals]].

## The 10 facts

1. **Structure:** array of **buckets**; each bucket = one array slot holding a **singly-linked list** (or **red-black tree** at ≥8 entries, table ≥64).
2. **Default capacity 16**, always a power of 2. **Load factor 0.75** → resize (double) at 75% full.
3. **put:** `hashCode()` → spread `h ^ (h>>>16)` → index `(n-1) & hash` → walk bucket → replace or append.
4. **get:** same hash/index → jump to bucket → walk chain, match `hash==` then `equals`.
5. **hashCode finds the bucket; equals finds the entry.** (A bucket holds many colliding keys.)
6. **Contract:** override `equals` ⇒ **must** override `hashCode`. Else equal keys → different buckets → `get` never finds them.
7. **Same _index_, not same hash:** collided keys usually have different hashCodes sharing low bits.
8. **`==` on objects = reference identity**; `equals` = logical. Not "primitives only."
9. **Why 31:** odd (no bit loss), prime (spreads), cheap (`31*i == (i<<5)-i`).
10. **Resize (JDK 8):** entry stays at `j` or moves to `j + oldCap`, decided by `hash & oldCap` — no rehash.

## Map family (one line each)

- **HashMap** — no order, O(1) avg.
- **LinkedHashMap** — insertion order (doubly-linked list).
- **TreeMap** — sorted keys, O(log n) (red-black tree).
- Map is **not** a Collection (stores pairs, not elements).

## Drill cards

put steps in order?::hashCode → spread (h ^ h>>>16) → index (n-1)\&hash → walk bucket → replace if key matches else append → treeify at 8 / resize at 0.75.
Why equals AND hashCode?::hashCode picks the bucket; equals finds the exact key in it. Break the contract → equal keys land in different buckets → get fails.
Why 31?::Odd (no bit loss vs even 32), prime (good spread), cheap (31\*i = (i<<5)-i).
JDK 8 resize trick?::Capacity doubles; each entry stays at index j or moves to j+oldCap, chosen by one bit (hash & oldCap). No rehashing.
==&#x20;vs equals?::== = reference identity (same object); equals = logical equality. == works on objects too, comparing references.
HashMap vs LinkedHashMap vs TreeMap?::HashMap = no order; LinkedHashMap = insertion order (doubly-linked); TreeMap = sorted (red-black tree).
Treeify threshold?::A bucket's chain converts to a red-black tree at 8 nodes when table ≥ 64 (else it resizes); reverts to list at 6.

---
publish: true
title: Garbage Collection — Refresher
tags:
  - java
  - jvm
  - refresher
  - flashcards
---

> [!abstract] 3-minute skim. Full detail → [[Garbage Collection — Full Notes]].

## The 10 facts

1. GC decides garbage by **reachability** (trace from GC roots), NOT recency.
2. **GC roots:** all threads' stack locals, static fields, active threads, JNI.
3. **Generational hypothesis: most objects die young** → young gen collected often/cheap.
4. Young gen = **Eden + 2 Survivors**; survive tenuring threshold (max **15**) → promoted to old gen.
5. **Mark → Sweep → Compact.** Compaction removes fragmentation → fast bump-pointer allocation.
6. **Minor** = young; **Major** = old; **Full** = whole heap + metaspace. Triggered by pressure, not a fixed count.
7. **STW** = GC freezes all app threads. Big heap → long pause → why concurrent collectors exist.
8. **G1** = heap **regions**, collects most-garbage-first, pause target; **default since JDK 9**.
9. **ZGC** (colored pointers, 64-bit, Oracle) vs **Shenandoah** (Brooks pointers, Red Hat) — both concurrent, sub-ms.
10. **PermGen → Metaspace** (Java 8): metadata moved to auto-growing native memory; killed `OutOfMemoryError: PermGen space`.

## Collectors by JDK

Serial (1.3) · Parallel (1.4, default 5–8) · CMS (1.4, removed 14) · **G1 (default 9)** · ZGC (11, prod 15) · Shenandoah (12, Red Hat) · Epsilon no-op (11).

## Drill cards

How does GC decide what's garbage?::Reachability — trace from GC roots; unreachable = garbage. Not recency.
Generational hypothesis?::Most objects die young → collect young gen often/cheap, promote rare survivors to old gen (collected rarely).
Mark-Sweep-Compact — why compact?::Compaction slides survivors together, removing fragmentation, so allocation is a fast bump pointer.
G1 vs ZGC?::Both region-based; G1's compaction is stop-the-world (pauses grow with heap), ZGC compacts concurrently (sub-ms, any heap size).
ZGC vs Shenandoah?::ZGC = colored pointers (Oracle, 64-bit); Shenandoah = Brooks forwarding pointers (Red Hat). Both concurrent sub-ms.
Why Metaspace over PermGen?::PermGen was fixed-size and threw OOM on class-heavy apps; Metaspace uses auto-growing native memory. Doesn't grow the heap.
Is GC needed with huge RAM?::Yes — it reclaims unreachable objects regardless of RAM; big heaps make low-pause concurrent collectors MORE necessary.

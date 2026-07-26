---
publish: true
title: CQRS — Full Notes
tags:
  - microservices
  - refresher
  - flashcards
---

## TL;DR ⚡

> [!abstract]
>
> - **CQRS** = Command Query Responsibility Segregation. **Commands = writes**, **Queries = reads** → use **separate models** for each.
> - Why: reads and writes have opposite needs; splitting lets each scale/optimize independently and stop fighting.
> - Read model updated asynchronously → **eventually consistent** (fine for analytics/dashboards).

## What CQRS is

One model doing both reads and writes is a compromise. CQRS **splits** them:

- **Write model (command side)** — normalized, transactional, enforces rules. Optimized for correct writes.
- **Read model (query side)** — denormalized, pre-shaped for exactly the queries you serve. Optimized for fast reads.

## The problem it solves (the analytics story)

A transactional system takes in data (e.g. claims). One team needs **heavy analytics dashboards** — big aggregations. Running those against the **normalized write tables** means huge **joins**, which are slow **and** contend with the transactional load (locks, CPU).

CQRS: keep the write side normalized/transactional; maintain a **separate denormalized read store** pre-shaped for the dashboard. Dashboard reads from that → heavy analytics don't slow or lock the transactional system. The two **scale independently**.

> Say it right: write model = **normalized** (needs joins to aggregate); read model = **denormalized** (pre-joined, fast).

## Keeping the read model in sync

The write side **publishes events** (e.g. via **Kafka**), or a sync/batch process updates the read store. So the read model updates **asynchronously** → it's **eventually consistent** (may lag writes by a moment).

- Trade-off: you give up **strong consistency** for the read side. **Fine for analytics** — nobody needs dashboard totals accurate to the millisecond.

## When to use / not use

- ✅ Read and write workloads are very different or scale differently; heavy reporting/analytics over transactional data; read-heavy systems.
- ❌ Simple CRUD apps — CQRS adds complexity (two models, sync, eventual consistency) that isn't worth it.
- Often pairs with **Event Sourcing** and the **[[Saga Pattern — Full Notes|Saga pattern]]**, but is independent of them.

## Related: normalization vs denormalization

See [[Normalization vs Denormalization]] — CQRS is essentially "normalized write side + denormalized read side."

## Test Yourself

What does CQRS stand for and mean?::Command Query Responsibility Segregation — use separate models for writes (commands) and reads (queries).
Why split reads and writes?::They have opposite needs; splitting lets each optimize/scale independently and stops heavy reads from contending with writes.
How does the read model stay current, and what's the trade-off?::Write side publishes events (e.g. Kafka) → read model updated async → eventually consistent (fine for analytics).
When NOT to use CQRS?::Simple CRUD — the extra complexity (two models, sync, eventual consistency) isn't justified.

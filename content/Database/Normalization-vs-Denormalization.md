---
publish: true
title: Normalization vs Denormalization
tags:
  - rdbms
  - refresher
  - flashcards
---

## TL;DR ⚡

> [!abstract]
>
> - **Normalization** = split data into related tables, no redundancy → great for **writes/consistency**.
> - **Denormalization** = deliberately duplicate/pre-join data → great for **fast reads**.
> - Pairing: **write side → normalized; read side → denormalized.** This is the heart of [[CQRS — Full Notes|CQRS]].

## Normalization

Organizing data to **remove redundancy** by splitting into related tables linked by keys. Governed by normal forms (1NF, 2NF, 3NF...).

- **Pros:** no duplicate data → updates are consistent (change once); smaller storage; write-friendly.
- **Cons:** reads need **joins** to reassemble data → slower for big aggregations.
- Example: `customers`, `orders`, `order_items` as separate tables joined by ids.

## Denormalization

Deliberately **duplicating or pre-joining** data (e.g. storing a flattened `customer_order_summary`).

- **Pros:** reads are **fast** — data is pre-shaped, few/no joins; great for reporting/dashboards.
- **Cons:** duplicated data → updates must touch many places → risk of inconsistency; more storage.

## Which pair is suited where

| Need | Choose | Why |
|---|---|---|
| Transactional writes, correctness | **Normalized** | change data in one place, no anomalies |
| Heavy reads / analytics / dashboards | **Denormalized** | pre-joined, no expensive joins at read time |
| Both, at scale | **Split them** → [[CQRS — Full Notes]] | normalized write model + denormalized read model |

So the CQRS insight _is_ this trade-off applied across two models: keep writes normalized and correct, keep a denormalized read copy for speed, sync asynchronously (eventual consistency).

## Test Yourself

Normalization vs denormalization?::Normalization splits data into related tables (no redundancy, write/consistency-friendly, needs joins to read). Denormalization duplicates/pre-joins (fast reads, harder updates).
Which suits writes, which suits reads?::Normalized suits transactional writes/consistency; denormalized suits heavy reads/analytics.
How does this connect to CQRS?::CQRS = normalized write model + denormalized read model, synced asynchronously — the same trade-off across two models.

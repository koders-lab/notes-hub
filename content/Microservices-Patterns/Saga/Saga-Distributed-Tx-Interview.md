---
publish: true
title: Saga & Distributed Transactions — Interview
tags:
  - microservices
  - refresher
  - flashcards
---

## TL;DR  ⚡

> [!abstract] 5-second recall before the room
>
> - **Core idea:** A Saga is what you use _because you CAN'T have_ one ACID
>   transaction across services. Sequence of local transactions, each with a
>   **compensating action**. Trades atomicity for **eventual consistency**.
> - **Hook:** _Not a distributed transaction — the alternative to one._
> - **The trap:** "What if the compensation fails / runs twice / the orchestrator
>   crashes?" → idempotency + retry/DLQ + persisted saga state (event sourcing).

## My story (state project — file ingestion)

Ingested FND/NND files via **Apache Camel** (format-specific specs), processed,
fanned out to downstream microservices (Medicaid, Family Services). Used **Saga
via Axon** with an **orchestrator**: each service commits in its own boundary; if
service A fails, the orchestrator triggers **compensating transactions** across
the others to roll back. → eventual consistency across services from one source file.

## The hard follow-ups (and answers)

**Compensation fails or is delivered twice?**

- **Idempotency key** (UUID — prefer **v7**, time-sortable, indexes better than v4).
- Receiver **records processed keys and skips duplicates** → redelivery is a no-op.
- Failed compensations → **retry with exponential backoff + jitter** → after N tries → **DLQ** for manual handling.

**Orchestrator crashes mid-Saga?**

- **Persist the saga state** — via **event sourcing** + **outbox pattern** (write
  events to DB as part of the local txn). On restart, orchestrator **replays state**
  and resumes. Axon does this out of the box.

## Choreography vs Orchestration

- **Choreography:** services react to each other's events, no central brain. Loose, scalable, harder to trace.
- **Orchestration:** one coordinator directs each step. Clearer, single control point (what I used).

## Careful with wording

- ❌ "Saga does a distributed transaction across services."
- ✅ "Saga is the alternative to a distributed transaction — local commits + compensations for eventual consistency, because one ACID txn can't span services."

## Drill cards

Why can't you use one ACID transaction across microservices?::Each service has its own DB; a single ACID txn can't span them (2PC is slow + couples services). Use a Saga instead.
What makes a compensation idempotent?::An idempotency key (UUID v7) + the receiver tracking processed keys and skipping duplicates.

<!--SR:!2026-07-29,3,250-->

How does an orchestrator recover after crashing mid-Saga?::Saga state is persisted via event sourcing/outbox; on restart it replays state and resumes. (Axon does this.)
Choreography vs orchestration?::Choreography = event-driven, no central brain. Orchestration = one coordinator directs steps (clearer, traceable).

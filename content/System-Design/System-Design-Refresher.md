---
publish: true
title: System Design — Interview Refresher
tags:
  - system-design
  - refresher
  - flashcards
---

> [!abstract] Quick brush-up. The framework + the concepts that come up in every round.

> [!tip] The framework (say this structure out loud)
> **Requirements** (functional + non-functional, scale) → **Estimation** (QPS, storage) → **High-level design** (components, data flow) → **Deep-dive** (DB, caching, scaling) → **Trade-offs**. Never jump straight to a diagram.

## Core concepts

> [!question]- Horizontal vs vertical scaling?
> **Vertical** = bigger machine (simple, capped, single point of failure). **Horizontal** = more machines (scales far, needs LB + statelessness). Prefer horizontal for scale.

> [!question]- Load balancing?
> Distributes traffic across servers (round-robin, least-connections). Needs **stateless** servers (or sticky sessions / external session store — see your Tomcat/Redis note).

> [!danger]- CAP theorem (they ask this)
> In a network **partition**, you choose **Consistency** OR **Availability** (not both). CP (e.g. traditional RDBMS) vs AP (e.g. Cassandra/Dynamo). Most systems tune for **eventual consistency** in practice.

> [!question]- Caching strategies?
> **Cache-aside** (app checks cache then DB), **write-through** (write both synchronously), **write-behind** (write cache, async to DB). Watch **cache stampede** (hot key expires → prevent with locks / TTL jitter).

> [!question]- SQL vs NoSQL — when?
> **SQL** = strong consistency, relations, transactions. **NoSQL** = scale, flexible schema, high write throughput. Choose by access pattern, not hype.

> [!question]- Consistent hashing (your resume)?
> Distributes keys across nodes on a ring so adding/removing a node moves **minimal** keys (not a full rehash). Used in caches/sharded stores.

> [!question]- DB scaling: replication vs sharding?
> **Replication** = copies for read scaling + failover (leader/follower). **Sharding** = split data across DBs by a key for write scaling.

## Reliability patterns (you have these)

> [!note] From your resume — reach for these
> **Circuit breaker** (stop cascading failures), **Saga** (distributed tx), **CQRS** (read/write split), **DLQ + retry** (messaging reliability), **idempotency** (safe retries).

## Drill cards

System design framework?::Requirements → estimation → high-level design → deep-dive → trade-offs. Clarify + estimate before drawing.
CAP theorem?::During a partition, choose Consistency or Availability. CP vs AP. Most tune for eventual consistency.
Horizontal vs vertical scaling?::Vertical = bigger box (capped, SPOF); horizontal = more boxes (scales, needs LB + stateless).
Consistent hashing — why?::Keys on a ring so adding/removing a node moves minimal keys, not a full rehash.
Replication vs sharding?::Replication = copies for read scaling/failover; sharding = split data by key for write scaling.
Cache stampede fix?::Hot key expires → thundering herd on DB → prevent with a distributed lock or TTL jitter.

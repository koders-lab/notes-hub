---
publish: true
title: Microservices-Patterns
tags:
  - moc
---

_Microservices & distributed systems — your daily reality in banking, but the interview asks about the sharp edges. Guided order first, full note grid below._

## Learn in this order

- [[Communication]] — sync (REST/gRPC) vs. async (events); when each
- [[Resilience]] — retry, circuit breaker, bulkhead, timeout
- _[[Distributed Transactions]]_ — Saga (choreography vs. orchestration), why 2PC is avoided _(the "distributed tx" pain — build next)_
- [[Kafka]] — partitions, ordering, consumer groups
- _[[Idempotency & Outbox]]_ — exactly-once in practice _(build next)_

> [!tip] Where they probe
> "How do you keep data consistent across services without a distributed
> transaction?" → Saga + outbox. Have that answer ready; it's the classic trap.

---
